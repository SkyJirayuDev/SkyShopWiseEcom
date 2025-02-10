import { NextResponse } from "next/server";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";

export async function POST(req: Request) {
  // เชื่อมต่อกับฐานข้อมูล (หรือใช้การเชื่อมต่อที่มีอยู่ใน mongodb.ts)
  await dbConnect();

  const { name, email, password } = await req.json();

  // ตรวจสอบว่ามีผู้ใช้ที่ใช้ email นี้อยู่หรือไม่
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  // เข้ารหัสรหัสผ่าน
  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    const user = await User.create({ name, email, password: hashedPassword, role: "user" });
    return NextResponse.json({ message: "User registered successfully", user }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to register user" }, { status: 500 });
  }
}
