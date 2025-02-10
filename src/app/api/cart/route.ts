import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Cart from "@/models/Cart";
import Product from "@/models/Product"; // สำหรับ populate ข้อมูลสินค้า
import { getServerSession } from 'next-auth/next';
import { authOptions } from "../auth/[...nextauth]/route";

// ดึงข้อมูลสินค้าที่อยู่ใน Cart เฉพาะของผู้ใช้ที่ล็อกอินอยู่
export async function GET() {
  await connectToDatabase();
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cartItems = await Cart.find({ user: session.user.id }).populate("productId");

    // กรองรายการที่ไม่มี productId (กรณีสินค้าถูกลบ)
    const formattedCartItems = cartItems
      .filter((item) => item.productId)
      .map((item) => ({
        _id: item._id,
        quantity: item.quantity,
        product: item.productId, // ข้อมูลสินค้าที่ถูก populate แล้ว
      }));

    return NextResponse.json(formattedCartItems);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart items" },
      { status: 500 }
    );
  }
}

// เพิ่มสินค้าใน Cart สำหรับผู้ใช้ที่ล็อกอินอยู่
export async function POST(req: Request) {
  await connectToDatabase();
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, quantity } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required." },
        { status: 400 }
      );
    }

    // ค้นหาสินค้าในตะกร้าที่มี productId และ user ตรงกับ session
    const existingCartItem = await Cart.findOne({ productId, user: session.user.id });

    if (existingCartItem) {
      existingCartItem.quantity += quantity;
      await existingCartItem.save();
    } else {
      await Cart.create({ productId, quantity, user: session.user.id });
    }

    return NextResponse.json({ message: "Added to cart successfully!" });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Failed to add to cart" },
      { status: 500 }
    );
  }
}

// ลบสินค้าใน Cart สำหรับผู้ใช้ที่ล็อกอินอยู่
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

    await Cart.findOneAndDelete({ _id: cartItemId, user: session.user.id });

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
