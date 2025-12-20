import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const name = searchParams.get("name");

    let user;

    // 1. If ID is provided, fetch by ID (Used by Dashboard)
    if (id) {
        user = await prisma.user.findUnique({
            where: { id: parseInt(id) },
        });
    } 
    // 2. If Name is provided, fetch by Name (Used by Share Page)
    else if (name) {
        user = await prisma.user.findUnique({
            where: { name: name },
        });
    } else {
        return NextResponse.json({ message: "ID or Name required" }, { status: 400 });
    }

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });

  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}