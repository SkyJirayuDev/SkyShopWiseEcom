import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import connectToDatabase from '@/lib/mongodb';
import { getRecommendedProducts } from '@/lib/recommend';
import mongoose from 'mongoose';
import OpenAI from 'openai';

// Define the PersonalMessage schema
const personalMessageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  message: { type: String, required: true },
  couponCode: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Create the PersonalMessage model
const PersonalMessage =
  mongoose.models.PersonalMessageReccomentation ||
  mongoose.model('PersonalMessageReccomentation', personalMessageSchema);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(req: Request) {
  await connectToDatabase();
  // Check if the user is authenticated
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url); // Get the search parameters from the request URL
  const forceRefresh = searchParams.get('refresh') === 'true'; // Check if the refresh parameter is set to true

  // Check if the userId is valid
  try {
    const existing = await PersonalMessage.findOne({ userId });
    const expirationDays = 7;

    // Function to check if the message is expired
    const isExpired = (msg: any) => {
      const now = new Date();
      const created = new Date(msg.createdAt);
      const diff = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
      return diff > expirationDays;
    };

    // If the message exists and is not expired, return it
    if (existing && !isExpired(existing) && !forceRefresh) {
      return NextResponse.json({ message: existing.message, couponCode: existing.couponCode });
    }

    const recommended = await getRecommendedProducts(userId, 10);

    // If no recommendations are found, return a default message
    if (!recommended || recommended.length === 0) {
      return NextResponse.json({ message: 'Check out our latest deals and offers today!', couponCode: '' });
    }

    // Generate a personalized message using OpenAI
    const productInfo = recommended
      .map((item: any) => `${item.name} (${item.category || 'General'})`)
      .join(', ');

    const couponCode = 'SKY' + Math.floor(100 + Math.random() * 900); // Generate a random coupon code

    const prompt = `
You are a creative e-commerce copywriter.

Given the following product types:
${productInfo}

Write a short and persuasive marketing message in 2 sentences.
First sentence: highlight the product types and a benefit.
Second sentence: add a limited-time deal and show the coupon code: ${couponCode}.
Avoid using quotation marks. Make it sound exciting and exclusive.
Use emojis if suitable. Return only the message.
`;

    // Call OpenAI API to generate the message
    const aiResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'system', content: prompt }],
    });

    // Extract the message from the AI response
    const rawMessage = aiResponse.choices[0]?.message?.content?.trim() || 'Check out our latest personalized deals for you!'; // Default message if AI fails
    const cleanedMessage = rawMessage.replace(/["']/g, ''); // Remove any quotation marks

    // Save the message and coupon code to the database
    await PersonalMessage.findOneAndUpdate(
      { userId },
      { message: cleanedMessage, couponCode, createdAt: new Date() },
      { upsert: true }
    );

    // Return the personalized message and coupon code
    return NextResponse.json({ message: cleanedMessage, couponCode });
  } catch (error) {
    console.error('Error generating personalized message:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
