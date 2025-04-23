import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

interface CartItem {
  _id?: string;
  productId: string;
  quantity: number;
  addedAt?: Date;
}

// GET method to fetch cart items
export async function GET() {
  // Connect to the database
  await connectToDatabase();

  try {
    // Check if the user is authenticated
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json([]); 
    }
    // Find the cart for the current user
    const cart = await Cart.findOne({ userId: session.user.id }).populate("items.productId");
    if (!cart) {
      return NextResponse.json([]);
    }

    // Check if cart items exist
    const formattedItems = cart.items
      .filter((item: any) => item.productId) 
      .map((item: any) => ({
        _id: item._id,
        quantity: item.quantity,
        product: item.productId, 
      }));

    return NextResponse.json(formattedItems);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart items" },
      { status: 500 }
    );
  }
}

// POST method to add an item to the cart
export async function POST(req: Request) {
  await connectToDatabase();
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, quantity } = await req.json();

    if (!productId || !quantity) {
      return NextResponse.json(
        { error: "Product ID and quantity are required." },
        { status: 400 }
      );
    }

    const userId = session.user.id;
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId, quantity, addedAt: new Date() }],
        updatedAt: new Date(),
      });
    } else {
      const existingItem = cart.items.find(
        (item: CartItem) => item.productId.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.addedAt = new Date();
      } else {
        cart.items.push({ productId, quantity, addedAt: new Date() });
      }

      cart.updatedAt = new Date();
    }

    await cart.save();
    return NextResponse.json({ message: "Added to cart successfully!" });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Failed to add to cart" },
      { status: 500 }
    );
  }
}

// DELETE method to remove an item from the cart
export async function DELETE(req: Request) {
  await connectToDatabase();

  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { cartItemId } = await req.json();

    if (!cartItemId) {
      return NextResponse.json(
        { error: "Cart Item ID is required." },
        { status: 400 }
      );
    }

    const userId = session.user.id;
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return NextResponse.json({ message: "Cart is empty." });
    }

    cart.items = cart.items.filter(
      (item: CartItem) => item._id?.toString() !== cartItemId
    );

    cart.updatedAt = new Date();
    await cart.save();

    return NextResponse.json({
      message: "Item removed from cart successfully!",
    });
  } catch (error) {
    console.error("Error removing cart item:", error);
    return NextResponse.json(
      { error: "Failed to remove item from cart" },
      { status: 500 }
    );
  }
}
