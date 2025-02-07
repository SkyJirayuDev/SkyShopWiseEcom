// src/app/api/orders/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const orderData = await request.json();
  
  // ในที่นี้จำลองการบันทึกคำสั่งซื้อ
  console.log('Order received:', orderData);
  
  return NextResponse.json({ message: 'Order received successfully', order: orderData });
}
