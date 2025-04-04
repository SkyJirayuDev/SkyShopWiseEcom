import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});

// Connect to the database
export async function POST(req: Request) {
  await connectToDatabase();
  try {
    const { userInput } = await req.json(); // Extract user input from the request body
    const products = await Product.find({}).lean(); // Fetch all products from the database
    let productContext: string = ""; // Initialize an empty string for product context

    // Iterate over each product and format its details
    products.forEach((product: any): void => {
      productContext += `ID: ${product._id}\nName: ${product.name}\nDescription: ${product.description}\nCategory: ${product.category}\nPrice: $${product.price}\n\n`;
    });
    const baseUrl: string = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"; 

    // Construct the system message for the AI model
    const systemMessage: string = `You are a friendly and knowledgeable shopping assistant.
Your task is to answer the customer's query using only the product information provided below.
Each product is described with its ID, Name, Description, Category, and Price.

Product List:
${productContext}

Customer Query: "${userInput}"

Instructions:
1. Analyze the customer's query to determine:
   - The intended product type (e.g., "mouse", "laptop", "keyboard", "monitor", "graphics card", etc.).
   - The required attributes (e.g., "wireless", "Bluetooth support", "mechanical", "Intel-based", "on sale", etc.).
   - Any numerical constraints (e.g., "under $1,000" or a specific price range).
2. Identify the set of products that EXACTLY match all these criteria.
   - An exact match means that the product’s Name or Description explicitly indicates the intended product type, includes all required attributes, and meets any numerical constraints.
3. If one or more exact matches are found, list them on separate lines in the following format:
   <a href="${baseUrl}/product/{ID}" target="_blank" style="color: blue; text-decoration: underline;">{Product Name}</a> - $ {Price}
4. If no products exactly match the criteria, start your answer with:
   "Unfortunately, there are no products that exactly match your criteria."
   Then, if available, list the closest available matches from the same intended product category as alternatives.
   - Precede these alternatives with a note such as: "However, here are the closest available matches:" and briefly explain why they are the closest (e.g., "This option does not fully meet the price criteria" or "This product does not include the specified attribute").
5. Ensure that only products of the intended type are included. For example, for a query like "Show me the latest wireless mice", only include products whose Name or Description clearly indicate they are a "mouse" (or "mice") and that include "wireless" if specified.
6. Respond in a natural, concise, and friendly tone. Invite further questions if needed.

Please provide your answer accordingly.`;

    // Log the system message for debugging
    const messages = [
      { role: "system", content: systemMessage },
      { role: "user", content: userInput },
    ];

    // Call the OpenAI API to get the AI's response
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages as unknown as any,
    });

    // Log the AI's response for debugging
    const aiMessage: string = chatResponse.choices[0]?.message.content || "";
    return NextResponse.json({ aiMessage });
  } catch (error) {
    console.error("Error in chatbot API:", error);
    return NextResponse.json({ error: "Failed to process chatbot request" }, { status: 500 });
  }
}
