// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, password } = body;

    // 1. Validate Input
    if (!name || !password) {
      return NextResponse.json(
        { message: "Username and password are required" },
        { status: 400 }
      );
    }

    // 2. Find User in Database
    const user = await prisma.user.findUnique({
      where: { name: name },
    });

    // 3. Check if user exists
    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" }, // Generic message for security
        { status: 401 }
      );
    }

    // 4. Compare Password (Hash vs Plaintext)
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 5. Success (You can set cookies here if using JWT later)
    return NextResponse.json(
      { 
        message: "Login successful", 
        user: { id: user.id, name: user.name } 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}