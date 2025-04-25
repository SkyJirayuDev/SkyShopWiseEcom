"use server";

import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateContextText(userInput: string, category?: string) {
  const prompt = `
You are a helpful shopping assistant.

The user asked: "${userInput}"
The product category is: "${category || "unknown"}"

Write:
- An intro (1 sentence) to naturally introduce the product list.
- A closing (1 sentence) to invite user to ask further or explore more options.

Only return JSON format:
{
  "intro": "...",
  "closing": "..."
}
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const raw = response.choices[0].message.content || "{}";
    const parsed = JSON.parse(raw);
    return {
      intro: parsed.intro || "",
      closing: parsed.closing || "",
    };
  } catch (err) {
    console.error("Failed to generate context text:", err);
    return {
      intro: "",
      closing: "",
    };
  }
}

export async function POST(req: Request) {
  await connectToDatabase();

  try {
    const { userInput } = await req.json();
    const trimmed = userInput.trim();

    if (/^(hi|hello|hey)[\s!]*$/i.test(trimmed)) {
      return NextResponse.json({
        aiMessage: "Hello! How can I assist you today? 😊",
      });
    }

    const classifyResp = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an intent classifier." },
        { role: "user", content: userInput },
      ],
      functions: [
        {
          name: "classify_intent",
          description: "Classify the input as greeting, product_search, or other",
          parameters: {
            type: "object",
            properties: {
              intent: {
                type: "string",
                enum: ["greeting", "product_search", "other"],
              },
            },
            required: ["intent"],
          },
        },
      ],
      function_call: { name: "classify_intent" },
    });

    let intent = "other";
    const classifyCall = classifyResp.choices?.[0]?.message.function_call;
    if (classifyCall?.arguments) {
      try {
        const parsed = JSON.parse(classifyCall.arguments);
        if (parsed.intent) intent = parsed.intent;
      } catch {}
    }

    if (intent !== "product_search") {
      const chatResp = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: userInput },
        ],
      });
      return NextResponse.json({
        aiMessage: chatResp.choices[0].message.content,
      });
    }

    const slotResp = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Extract product keywords and price conditions from the user message.",
        },
        { role: "user", content: userInput },
      ],
      functions: [
        {
          name: "extract_product_info",
          description: "Extract product search keywords and price conditions",
          parameters: {
            type: "object",
            properties: {
              product: { type: "string" },
              category: { type: "string" },
              priceCondition: {
                type: "object",
                properties: {
                  type: {
                    type: "string",
                    enum: ["under", "over", "exactly"],
                  },
                  amount: { type: "number" },
                },
              },
            },
          },
        },
      ],
      function_call: { name: "extract_product_info" },
    });

    let product: string | undefined;
    let category: string | undefined;
    let priceCondition: { type: string; amount: number } | undefined;
    const slotCall = slotResp.choices?.[0]?.message.function_call;
    if (slotCall?.arguments) {
      try {
        const parsed = JSON.parse(slotCall.arguments);
        product = parsed.product;
        category = parsed.category;
        priceCondition = parsed.priceCondition;
      } catch {}
    }

    const products = await Product.find({}).lean();
    let matches = products.filter((p) => {
      let ok = true;
      const lowerName = p.name.toLowerCase();
      const lowerCat = p.category.toLowerCase();

      if (product) {
        const key = product.toLowerCase();
        ok = lowerName.includes(key) || lowerCat.includes(key);
      }
      if (category) {
        ok = ok && lowerCat.includes(category.toLowerCase());
      }
      if (priceCondition) {
        if (priceCondition.type === "under") ok = ok && p.price < priceCondition.amount;
        if (priceCondition.type === "over") ok = ok && p.price > priceCondition.amount;
        if (priceCondition.type === "exactly") ok = ok && p.price === priceCondition.amount;
      }
      return ok;
    });

    if (matches.length === 0 && product) {
      const tokens = product.toLowerCase().split(" ").filter(Boolean);
      matches = products.filter((p) =>
        tokens.some((tok) =>
          p.name.toLowerCase().includes(tok) || p.category.toLowerCase().includes(tok)
        )
      );
    }

    if (matches.length > 0) {
      const context = await generateContextText(userInput, category || product);

      const aiMessage = {
        type: "productList",
        header: "Here are the products I found 😊",
        intro: context.intro,
        closing: context.closing,
        items: matches.map((p) => ({
          id: p._id,
          name: p.name,
          price: p.price,
        })),
      };

      return NextResponse.json({ aiMessage });
    } else {
      return NextResponse.json({
        aiMessage:
          "Sorry, I couldn't find any products that match your criteria. Could you provide more details or adjust your search?",
      });
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
