import { getToken } from 'next-auth/jwt';
import connectToDatabase from '@/lib/mongodb';
import RecentlyViewed from '@/models/RecentlyViewed';
import Product from '@/models/Product';
import { NextRequest, NextResponse } from 'next/server';

// GET method to fetch recently viewed products
export async function GET(req: NextRequest) {
  await connectToDatabase();
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET! });
  if (!token?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); 

  try {
    const rv = await RecentlyViewed.findOne({ userId: token.id }).populate('items.productId');
    if (!rv) return NextResponse.json([]);

    const sorted = rv.items
      .sort((a: any, b: any) => new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime())
      .map((item: any) => item.productId);

    return NextResponse.json(sorted);
  } catch (err) {
    console.error('GET RecentlyViewed error:', err);
    return NextResponse.json({ error: 'Failed to fetch recently viewed' }, { status: 500 });
  }
}

// POST method to add a product to recently viewed
export async function POST(req: NextRequest) {
  await connectToDatabase();
  const { userId, productId } = await req.json();

  if (!userId || !productId) {
    return NextResponse.json({ error: 'Missing userId or productId' }, { status: 400 });
  }

  try {
    await RecentlyViewed.findOneAndUpdate(
      { userId },
      { $pull: { items: { productId } } },
      { new: true }
    );

    await RecentlyViewed.findOneAndUpdate(
      { userId },
      {
        $push: {
          items: {
            $each: [{ productId, viewedAt: new Date() }],
            $sort: { viewedAt: -1 },
            $slice: 10,
          },
        },
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ message: 'Recently viewed updated' });
  } catch (err) {
    console.error('POST RecentlyViewed error:', err);
    return NextResponse.json({ error: 'Failed to update recently viewed' }, { status: 500 });
  }
}
