import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import connectToDatabase from '@/lib/mongodb';
import { getRecommendedProducts } from '@/lib/recommend';
import mongoose from 'mongoose';
import OpenAI from 'openai';

const personalMessageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  message: { type: String, required: true },
  couponCode: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const PersonalMessage =
  mongoose.models.PersonalMessageReccomentation ||
  mongoose.model('PersonalMessageReccomentation', personalMessageSchema);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(req: Request) {
  await connectToDatabase();

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const forceRefresh = searchParams.get('refresh') === 'true';

  try {
    const existing = await PersonalMessage.findOne({ userId });

    const expirationDays = 7;
    const isExpired = (msg: any) => {
      const now = new Date();
      const created = new Date(msg.createdAt);
      const diff = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
      return diff > expirationDays;
    };

    if (existing && !isExpired(existing) && !forceRefresh) {
      return NextResponse.json({ message: existing.message, couponCode: existing.couponCode });
    }

    const recommended = await getRecommendedProducts(userId, 10);

    if (!recommended || recommended.length === 0) {
      return NextResponse.json({ message: 'Check out our latest deals and offers today!', couponCode: '' });
    }

    const productInfo = recommended
      .map((item: any) => `${item.name} (${item.category || 'General'})`)
      .join(', ');

    const couponCode = 'SKY' + Math.floor(100 + Math.random() * 900);

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

    const aiResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'system', content: prompt }],
    });

    const rawMessage = aiResponse.choices[0]?.message?.content?.trim() || 'Check out our latest personalized deals for you!';
    const cleanedMessage = rawMessage.replace(/["']/g, '');

    await PersonalMessage.findOneAndUpdate(
      { userId },
      { message: cleanedMessage, couponCode, createdAt: new Date() },
      { upsert: true }
    );

    return NextResponse.json({ message: cleanedMessage, couponCode });
  } catch (error) {
    console.error('Error generating personalized message:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
