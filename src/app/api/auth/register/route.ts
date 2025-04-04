import { NextResponse } from "next/server";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";

export async function POST(req: Request) {
  await dbConnect();

  // Check if the request is a POST request
  const { name, email, password } = await req.json();
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  // Create a new user
  try {
    const user = await User.create({ name, email, password: hashedPassword, role: "user" });
    return NextResponse.json({ message: "User registered successfully", user }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to register user" }, { status: 500 });
  }
}
