import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Wishlist from '@/models/Wishlist';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

// ดึงข้อมูล Wishlist สำหรับผู้ใช้ที่ล็อกอินอยู่
export async function GET(req: Request) {
  await connectToDatabase();
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const wishlistItems = await Wishlist.find({ user: session.user.id }).populate('productId');
    return NextResponse.json(wishlistItems);
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 });
  }
}

// เพิ่มสินค้าลงใน Wishlist สำหรับผู้ใช้ที่ล็อกอินอยู่
export async function POST(req: Request) {
  await connectToDatabase();
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await req.json();
    const userId = session.user.id;

    const existing = await Wishlist.findOne({ user: userId, productId });
    if (existing) {
      return NextResponse.json({ message: 'Already in wishlist' });
    }

    const newItem = new Wishlist({ user: userId, productId });
    await newItem.save();

    return NextResponse.json({ message: 'Added to wishlist!' });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return NextResponse.json({ error: 'Failed to add to wishlist' }, { status: 500 });
  }
}

// ลบสินค้าจาก Wishlist สำหรับผู้ใช้ที่ล็อกอินอยู่
export async function DELETE(req: Request) {
  await connectToDatabase();
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await req.json();
    const userId = session.user.id;

    await Wishlist.findOneAndDelete({ user: userId, productId });
    return NextResponse.json({ message: 'Removed from wishlist!' });
  } catch (error) {
    console.error("Error removing wishlist item:", error);
    return NextResponse.json({ error: 'Failed to remove from wishlist' }, { status: 500 });
  }
}
