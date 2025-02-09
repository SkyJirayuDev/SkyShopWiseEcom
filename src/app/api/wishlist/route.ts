import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Wishlist from '@/models/Wishlist';

export async function GET(req: Request) {
  await connectToDatabase();
  const userId = req.headers.get('user-id') || 'demoUser';

  try {
    const wishlistItems = await Wishlist.find({ userId }).populate('productId');
    return NextResponse.json(wishlistItems);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await connectToDatabase();
  const { userId, productId } = await req.json();

  try {
    const existing = await Wishlist.findOne({ userId, productId });
    if (existing) {
      return NextResponse.json({ message: 'Already in wishlist' });
    }

    const newItem = new Wishlist({ userId, productId });
    await newItem.save();

    return NextResponse.json({ message: 'Added to wishlist!' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add to wishlist' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  await connectToDatabase();
  const { userId, productId } = await req.json();

  try {
    await Wishlist.findOneAndDelete({ userId, productId });
    return NextResponse.json({ message: 'Removed from wishlist!' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to remove from wishlist' }, { status: 500 });
  }
}
