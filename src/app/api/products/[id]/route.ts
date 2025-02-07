import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';

// ดึงข้อมูลสินค้าตาม ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();
  try {
    const product = await Product.findById(params.id);
    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch product', error }, { status: 500 });
  }
}

// แก้ไขข้อมูลสินค้า (Update)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();
  try {
    const data = await req.json();
    const updatedProduct = await Product.findByIdAndUpdate(params.id, data, { new: true });
    if (!updatedProduct) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Product updated successfully!', product: updatedProduct });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update product', error }, { status: 500 });
  }
}

// ลบสินค้า (Delete)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();
  try {
    const deletedProduct = await Product.findByIdAndDelete(params.id);
    if (!deletedProduct) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Product deleted successfully!' });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete product', error }, { status: 500 });
  }
}
