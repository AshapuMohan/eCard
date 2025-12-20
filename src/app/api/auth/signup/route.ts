// app/api/auth/signup/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// Initialize Prisma Client
// (Best practice: utilize a singleton pattern in production, but this works for now)
const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, password } = body;

    // 1. Validate input
    if (!name || !password) {
      return NextResponse.json(
        { message: "Username and password are required" },
        { status: 400 }
      );
    }

    // 2. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { name: name },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Username already taken" },
        { status: 409 }
      );
    }

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create user in Postgres
    const newUser = await prisma.user.create({
      data: {
        name,
        password: hashedPassword,
      },
    });

    // 5. Return success (remove password from response)
    return NextResponse.json(
      { message: "User created successfully", user: { id: newUser.id, name: newUser.name } },
      { status: 201 }
    );

  } catch (error) {
    console.error("Signup API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}