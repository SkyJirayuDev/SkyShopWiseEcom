import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Wishlist from '@/models/Wishlist';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

// GET method to fetch wishlist items
export async function GET() {
  await connectToDatabase();
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const wishlist = await Wishlist.findOne({ userId: session.user.id }).populate('items.productId');
    if (!wishlist) return NextResponse.json([]); // No wishlist found

    // Check if wishlist items exist
    const response = wishlist.items.map((item: any) => ({
      ...item._doc,
      product: item.productId,
    }));

    return NextResponse.json(response);
  } catch (err) {
    console.error('Error fetching wishlist:', err);
    return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 });
  }
}

// POST method to add a product to the wishlist
export async function POST(req: Request) {
  await connectToDatabase();
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { productId } = await req.json();
    const userId = session.user.id;

    await Wishlist.findOneAndUpdate(
      { userId },
      {
        $addToSet: {
          items: {
            productId,
            addedAt: new Date(),
          },
        },
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ message: 'Added to wishlist!' });
  } catch (err) {
    console.error('Error adding to wishlist:', err);
    return NextResponse.json({ error: 'Failed to add to wishlist' }, { status: 500 });
  }
}

// DELETE method to remove a product from the wishlist
export async function DELETE(req: Request) {
  await connectToDatabase();
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { productId } = await req.json();
    const userId = session.user.id;

    await Wishlist.findOneAndUpdate(
      { userId },
      { $pull: { items: { productId } } },
      { new: true }
    );

    return NextResponse.json({ message: 'Removed from wishlist!' });
  } catch (err) {
    console.error('Error removing wishlist item:', err);
    return NextResponse.json({ error: 'Failed to remove from wishlist' }, { status: 500 });
  }
}
