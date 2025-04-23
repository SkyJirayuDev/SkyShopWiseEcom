"use server";

import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Helper to extract a single numeric price filter from user input
function extractPriceCondition(input: string): { filter: (price: number) => boolean } | null {
  const lower = input.toLowerCase();
  const match = lower.match(/(under|less than|over|more than|exactly|equal to)\s*\$?(\d+[.,]?\d*)/);
  if (!match) return null;
  const [, keyword, num] = match;
  const amount = parseFloat(num.replace(/,/g, ""));
  if (keyword.startsWith("under") || keyword.startsWith("less")) {
    return { filter: price => price < amount };
  }
  if (keyword.startsWith("over") || keyword.startsWith("more")) {
    return { filter: price => price > amount };
  }
  if (keyword.startsWith("exactly") || keyword.startsWith("equal")) {
    return { filter: price => price === amount };
  }
  return null;
}

// Normalize and remove price clause from user input
function normalizeInput(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/(under|less than|over|more than|exactly|equal to)\s*\$?\d+[.,]?\d*/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export async function POST(req: Request) {
  await connectToDatabase();

  try {
    const { userInput } = await req.json();
    const trimmed = userInput.trim();

    // Handle simple greetings
    if (/^(hi|hello|hey)[.!]*$/i.test(trimmed)) {
      return NextResponse.json({ aiMessage: "Hello! How can I assist you today? 😊" });
    }

    const normalized = normalizeInput(trimmed);
    const priceCondition = extractPriceCondition(trimmed);

    // Fetch products
    const products = await Product.find({}).lean();

    // 1) Try exact-phrase match on normalized input
    let matches = products.filter(p => {
      const name = p.name?.toLowerCase() || "";
      const cat  = p.category?.toLowerCase() || "";
      const phraseMatch = normalized
        ? name.includes(normalized) || cat.includes(normalized)
        : true;
      const priceMatch = priceCondition
        ? priceCondition.filter(p.price)
        : true;
      return phraseMatch && priceMatch;
    });

    // 2) If none, fallback to token match (excluding generic words)
    if (matches.length === 0 && normalized) {
      const tokens = normalized
        .split(" ")
        .filter(tok => tok !== "product" && tok !== "products");
      if (tokens.length > 0) {
        matches = products.filter(p => {
          const name = p.name?.toLowerCase() || "";
          const cat  = p.category?.toLowerCase() || "";
          const tokenMatch = tokens.some(tok => name.includes(tok) || cat.includes(tok));
          const priceMatch = priceCondition
            ? priceCondition.filter(p.price)
            : true;
          return tokenMatch && priceMatch;
        });
      }
    }

    // Exclude specific unwanted items
    const excluded = [
      "ubiquiti unifi protect uvc-ai-theta-audio for ai theta camera",
      "sony fdrax43a"
    ];
    matches = matches.filter(p => {
      const name = p.name?.toLowerCase() || "";
      return !excluded.some(ex => name.includes(ex));
    });

    const noMatchMessage = "Unfortunately, there are no products that match your criteria. Feel free to ask more!";
    if (matches.length === 0) {
      return NextResponse.json({ aiMessage: noMatchMessage });
    }

    // Build numbered list with HTML links
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
    const numberedList = matches
      .map((p, i) =>
        `${i + 1}. <a href="${baseUrl}/product/${p._id}" target="_blank" style="color: blue; text-decoration: underline;">` +
        `${p.name}</a> - $${p.price.toFixed(2)}`
      )
      .join("\n");

    // System prompt for tone adjustment
    const systemPrompt = `
You are a friendly shopping assistant 😊.
Here are the product suggestions:
${numberedList}

Please wrap this list in a polite message, sprinkle in a couple of emojis, and invite further questions.
    `.trim();

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user",   content: userInput }
      ] as any
    });

    const aiMessage = response.choices?.[0]?.message?.content || numberedList;
    return NextResponse.json({ aiMessage });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
