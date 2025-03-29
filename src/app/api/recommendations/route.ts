import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { getRecommendedProducts } from '@/lib/recommend';
import connectToDatabase from '@/lib/mongodb';

/**
 * GET /api/recommendations
 * Returns personalized product recommendations for the current user
 */
export async function GET(req: Request) {
  await connectToDatabase();

  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const recommended = await getRecommendedProducts(session.user.id, 10);
    return NextResponse.json(recommended);
  } catch (error) {
    console.error('Recommendation error:', error);
    return NextResponse.json({ error: 'Failed to get recommendations' }, { status: 500 });
  }
}
