import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';

// GET method to fetch all products
export async function GET() {
  await connectToDatabase();
  try {
    const products = await Product.find({});
    return NextResponse.json(products); // Return all products
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ message: 'Failed to fetch products', error }, { status: 500 }); 
  }
}

// POST method to create a new product
export async function POST(request: Request) {
  await connectToDatabase();
  try {
    const { name, description, price, category, image, stock } = await request.json();
    const newProduct = new Product({ name, description, price, category, image, stock });
    await newProduct.save();
    return NextResponse.json({ message: 'Product created successfully!', product: newProduct }); // Return the created product
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ message: 'Failed to create product', error }, { status: 500 });
  }
}
