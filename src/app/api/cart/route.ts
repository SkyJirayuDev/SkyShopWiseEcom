import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Cart from "@/models/Cart";
import Product from "@/models/Product"; // ✅ สำหรับ join ข้อมูลสินค้า

// ✅ ดึงข้อมูลสินค้าที่อยู่ใน Cart
export async function GET() {
  await connectToDatabase();

  try {
    const cartItems = await Cart.find().populate("productId"); // join กับ collection ของสินค้า
    return NextResponse.json(cartItems);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart items" },
      { status: 500 }
    );
  }
}

// ✅ เพิ่มสินค้าใน Cart
export async function POST(req: Request) {
  await connectToDatabase();

  try {
    const { productId, quantity } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required." },
        { status: 400 }
      );
    }

    const existingCartItem = await Cart.findOne({ productId });

    if (existingCartItem) {
      existingCartItem.quantity += quantity;
      await existingCartItem.save();
    } else {
      await Cart.create({ productId, quantity });
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

// เพิ่มฟังก์ชัน DELETE สำหรับลบสินค้าใน Cart
export async function DELETE(req: Request) {
    await connectToDatabase();
  
    try {
      const { cartItemId } = await req.json(); // รับ cartItemId ที่ต้องการลบ
  
      if (!cartItemId) {
        return NextResponse.json(
          { error: "Cart Item ID is required." },
          { status: 400 }
        );
      }
  
      await Cart.findByIdAndDelete(cartItemId); // ลบข้อมูลออกจากฐานข้อมูล
  
      return NextResponse.json({ message: "Item removed from cart successfully!" });
    } catch (error) {
      console.error("Error removing cart item:", error);
      return NextResponse.json(
        { error: "Failed to remove item from cart" },
        { status: 500 }
      );
    }
  }
  