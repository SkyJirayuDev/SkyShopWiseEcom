import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';

export async function POST(req: Request) {
  await connectToDatabase();
  try {
    const { userId, cartItems, total } = await req.json();

    // ✅ แสดงข้อมูลที่ได้รับจาก Frontend เพื่อ Debug
    console.log("Received Order Data:", { userId, cartItems, total });

    // ✅ ตรวจสอบข้อมูลก่อนบันทึก
    if (!userId || !cartItems || cartItems.length === 0 || !total) {
      console.error("Validation Error:", { userId, cartItems, total });
      return NextResponse.json(
        { error: "Missing required fields: userId, cartItems, or total." },
        { status: 400 }
      );
    }

    const newOrder = new Order({
      userId,
      items: cartItems,
      total,
    });

    await newOrder.save();

    console.log("Order saved successfully!"); // ✅ ตรวจสอบการบันทึกข้อมูล

    return NextResponse.json({ message: 'Order placed successfully!' });
  } catch (error) {
    console.error('Error placing order:', error);
    return NextResponse.json({ error: 'Failed to place order' }, { status: 500 });
  }
}
// ✅ ดึงประวัติการสั่งซื้อ
export async function GET(req: Request) {
    await connectToDatabase();
    try {
      const userId = req.headers.get("user-id");
  
      if (!userId) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
      }
  
      const orders = await Order.find({ userId });
      return NextResponse.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }
  }