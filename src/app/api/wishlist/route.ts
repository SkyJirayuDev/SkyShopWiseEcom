import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Wishlist from '@/models/Wishlist';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(req: Request) {
  await connectToDatabase();
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Query wishlist items ของผู้ใช้ที่ล็อกอินอยู่
    const wishlistItems = await Wishlist.find({ user: session.user.id })
      .populate('productId') // ดึงข้อมูลสินค้า (Product)
      .lean();

    // เปลี่ยนชื่อฟิลด์ productId เป็น product ให้ตรงกับที่ UI คาดหวัง
    const renamedItems = wishlistItems.map((item) => ({
      ...item,
      product: item.productId,
    }));

    return NextResponse.json(renamedItems);
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 });
  }
}

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
