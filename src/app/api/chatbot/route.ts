import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";
import OpenAI from "openai";

// ✅ Connect to OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  await connectToDatabase();

  try {
    const { userInput } = await req.json();

    // ✅ Send message to OpenAI for processing the user's query
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful shopping assistant for an IT e-commerce website. Suggest products based on user queries.",
        },
        { role: "user", content: userInput },
      ],
    });

    const aiMessage = chatResponse.choices[0]?.message.content || "";

    // ✅ Search in name, description, category
    const searchQuery = new RegExp(userInput, "i");
    const queryConditions: Record<string, any>[] = [
      { name: searchQuery },
      { description: searchQuery },
      { category: searchQuery },
    ];

    // ✅ Detect price conditions (greater than/less than)
    const priceMatch = userInput.match(/(\d+)/); // Find numbers
    const isGreaterThan = /greater than|above|more than/.test(userInput);
    const isLessThan = /less than|below|under/.test(userInput);

    if (priceMatch) {
      const priceValue = Number(priceMatch[0]);

      if (isGreaterThan) {
        queryConditions.push({ price: { $gte: priceValue } }); // ✅ Greater than or equal to
      } else if (isLessThan) {
        queryConditions.push({ price: { $lte: priceValue } }); // ✅ Less than or equal to
      } else {
        queryConditions.push({ price: { $lte: priceValue } }); // ✅ Default condition
      }
    }

    // ✅ Search for products in the database
    const products = await Product.find({ $or: queryConditions });

    // ✅ Create product links with target="_blank"
    const productLinks = products
      .map(
        (product) =>
          `<a href="http://localhost:3000/product/${product._id}" target="_blank" style="color: blue; text-decoration: underline;">${product.name}</a> - $${product.price}`
      )
      .join("<br>");

    // ✅ Combine AI message with product results
    const combinedMessage = products.length
      ? `${aiMessage}<br><br><strong>Here are some products you might be interested in:</strong><br>${productLinks}`
      : `${aiMessage}<br><br>❌ No products found related to "${userInput}"`;

    return NextResponse.json({
      aiMessage: combinedMessage,
    });
  } catch (error) {
    console.error("Error in chatbot API:", error);
    return NextResponse.json(
      { error: "Failed to process chatbot request" },
      { status: 500 }
    );
  }
}
