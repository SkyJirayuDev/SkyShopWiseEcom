import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';
import Cart from '@/models/Cart'; 
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

// POST method to place an order
export async function POST(req: Request) {
  await connectToDatabase();
  try {
    // Check if the user is authenticated
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { cartItems, total } = await req.json();
    if (!cartItems || cartItems.length === 0 || !total) {
      return NextResponse.json(
        { error: "Missing required fields: cartItems or total." },
        { status: 400 }
      );
    }

    // Check if the cart items are valid
    const orderItems = cartItems.map((item: any) => ({
      productId: item.productId,
      quantity: item.quantity,
      priceAtOrder: item.priceAtOrder,
    }));

    // Check if the cart items exist in the database
    const newOrder = new Order({
      userId: session.user.id,
      items: orderItems,
      total,
      status: "pending",
      orderedAt: new Date(),
    });

    await newOrder.save();

    // Clear the cart after placing the order
    await Cart.updateOne(
      { userId: session.user.id },
      { $set: { items: [] } }
    );

    return NextResponse.json({ message: 'Order placed successfully!' });
  } catch (error) {
    console.error('Error placing order:', error);
    return NextResponse.json({ error: 'Failed to place order' }, { status: 500 });
  }
}

// GET method to fetch orders for the authenticated user
export async function GET(req: Request) {
  await connectToDatabase();
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await Order.find({ userId: session.user.id })
      .populate('items.productId')
      .sort({ orderedAt: -1 });

    const formattedOrders = orders.map((order) => ({
      _id: order._id,
      items: order.items.map((item: any) => ({
        productId: item.productId ? {
          _id: item.productId._id,
          name: item.productId.name,
          image: item.productId.image,
          price: item.productId.price,
        } : null,
        quantity: item.quantity,
        priceAtOrder: item.priceAtOrder,
      })),
      total: order.total,
      status: order.status,
      orderedAt: order.orderedAt,
    }));

    return NextResponse.json(formattedOrders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
