// src/app/appi/chatbot/route.ts

import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";
import OpenAI from "openai";
import Fuse from "fuse.js";

// เชื่อมต่อ OpenAI โดยใช้ API key จาก environment variable
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  await connectToDatabase();

  try {
    const { userInput } = await req.json();

    // 1. แปลงข้อความผู้ใช้เป็น lower-case และแยกเป็น tokens
    const lowerInput = userInput.toLowerCase();
    const tokens = lowerInput.split(/\s+/);

    // 2. ดึงสินค้าทั้งหมดจากฐานข้อมูล
    const products = await Product.find({}).lean();

    // 3. คัดกรอง tokens โดยดูว่ามี token ไหนปรากฏในสินค้า (name, description, category)
    const validTokens = tokens.filter((token: string) =>
      products.some(product => {
        const text = `${product.name} ${product.description} ${product.category}`.toLowerCase();
        return text.includes(token);
      })
    );

    // 4. สร้าง refined query จาก valid tokens (ถ้ามี) หรือใช้ lowerInput ถ้าไม่มี token ใดตรงกับสินค้าก็ให้ใช้ totalidad
    const refinedQuery = validTokens.length > 0 ? validTokens.join(" ") : lowerInput;

    // 5. กำหนด Fuse.js options โดยปรับ weight และ threshold ให้เหมาะสม
    const fuseOptions = {
      keys: [
        { name: "name", weight: 0.7 },
        { name: "description", weight: 0.3 },
        { name: "category", weight: 0.1 },
      ],
      includeScore: true,
      threshold: 0.4,
    };

    const fuse = new Fuse(products, fuseOptions);
    const fuzzyResults = fuse.search(refinedQuery);
    let matchedProducts = fuzzyResults.map(result => result.item);

    // 6. หาก query มีหลาย token ให้กรองผลลัพธ์เพิ่มเติมโดยเช็คว่ามี token ที่ปรากฏอยู่ใน fields ของสินค้า
    if (tokens.length > 1) {
      const filteredProducts = matchedProducts.filter(product => {
        const name = product.name?.toLowerCase() || "";
        const description = product.description?.toLowerCase() || "";
        const category = product.category?.toLowerCase() || "";
        return tokens.some((token: string) => 
          name.includes(token) || description.includes(token) || category.includes(token)
        );
      });
      if (filteredProducts.length > 0) {
        matchedProducts = filteredProducts;
      }
    }

    // 7. Fallback: หาก Fuse.js ไม่พบสินค้า ให้ใช้ substring search
    if (matchedProducts.length === 0) {
      matchedProducts = products.filter(product => {
        const name = product.name?.toLowerCase() || "";
        const description = product.description?.toLowerCase() || "";
        const category = product.category?.toLowerCase() || "";
        return (
          name.includes(refinedQuery) ||
          description.includes(refinedQuery) ||
          category.includes(refinedQuery)
        );
      });
    }

    // 8. สร้าง context สำหรับ AI โดยใช้สินค้าที่พบ
    let productContext = "";
    if (matchedProducts.length > 0) {
      productContext = "Available products:\n";
      matchedProducts.forEach(product => {
        productContext += `- ${product.name}: ${product.description} [Category: ${product.category}]\n`;
      });
    } else {
      productContext = "No matching products found in our database.";
    }

    // 9. สร้าง messages สำหรับ prompt ของ OpenAI
    const messages = [
      {
        role: "system",
        content: `You are a helpful shopping assistant. Use the following product information to answer the user's question only based on available products:\n\n${productContext}`,
      },
      {
        role: "user",
        content: userInput,
      },
    ];

    // Due to type mismatches ใน type definitions ของ OpenAI,
    // เราจึงใช้ type assertion เพื่อบังคับให้ TypeScript ยอมรับค่า messages
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages as unknown as any,
    });

    const aiMessage = chatResponse.choices[0]?.message.content || "";

    // 10. สร้างลิงก์สำหรับสินค้าที่ตรงกัน (ถ้ามี)
    let productLinks = "";
    if (matchedProducts.length > 0) {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      productLinks = matchedProducts
        .map(
          product =>
            `<a href="${baseUrl}/product/${product._id}" target="_blank" style="color: blue; text-decoration: underline;">${product.name}</a> - $${product.price}`
        )
        .join("<br>");
    }

    // 11. ผสานข้อความจาก AI กับลิงก์สินค้า (ถ้ามี)
    const combinedMessage = matchedProducts.length
      ? `${aiMessage}<br><br><strong>Here are some products you might be interested in:</strong><br>${productLinks}`
      : aiMessage;

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
