// src/app/api/chatbot/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: Request) {
  try {
    const { userInput } = await request.json();

    const prompt = `User query: "${userInput}". Provide product search guidance in an IT e-commerce context.`;

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful shopping assistant for an IT e-commerce website." },
        { role: "user", content: prompt }
      ]
    });

    const reply = response.choices[0].message.content;
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Error in chatbot API:", error);
    return NextResponse.json({ error: "Failed to get response from AI" }, { status: 500 });
  }
}
