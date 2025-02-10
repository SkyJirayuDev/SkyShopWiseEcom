import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(req: Request) {
  await connectToDatabase();
  try {
    // ดึง session จาก NextAuth
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // แทนที่จะรับ userId จาก client เราจะใช้ session.user.id
    const { cartItems, total } = await req.json();

    console.log("Received Order Data:", { user: session.user.id, cartItems, total });

    // ตรวจสอบข้อมูลก่อนบันทึก
    if (!cartItems || cartItems.length === 0 || !total) {
      console.error("Validation Error:", { user: session.user.id, cartItems, total });
      return NextResponse.json(
        { error: "Missing required fields: cartItems or total." },
        { status: 400 }
      );
    }

    const newOrder = new Order({
      user: session.user.id,
      items: cartItems,
      total,
    });

    await newOrder.save();
    console.log("Order saved successfully!");

    return NextResponse.json({ message: 'Order placed successfully!' });
  } catch (error) {
    console.error('Error placing order:', error);
    return NextResponse.json({ error: 'Failed to place order' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  await connectToDatabase();
  try {
    // ดึง session ของผู้ใช้
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Query orders เฉพาะของผู้ใช้ที่ล็อกอินอยู่
    const orders = await Order.find({ user: session.user.id });
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
