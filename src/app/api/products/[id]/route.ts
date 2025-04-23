import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';

// GET method to fetch a single product by ID
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();

  // Check if the request is a GET request
  try {
    const { id } = params;
    const product = await Product.findById(id);

    // Check if the product exists
    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    // Format the product data
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch product', error }, { status: 500 });
  }
}

// PUT method to update a product by ID
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();

  try {
    const { id } = params;
    const data = await req.json();

    const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true });

    if (!updatedProduct) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Product updated successfully!',
      product: updatedProduct,
    });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update product', error }, { status: 500 });
  }
}

// DELETE method to delete a product by ID
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();

  try {
    const { id } = params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product deleted successfully!' });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete product', error }, { status: 500 });
  }
}
