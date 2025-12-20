import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // We expect userId to be sent from the frontend now
    const { userId, ...profileData } = body;

    if (!userId) {
        return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId) }, 
      data: {
        name: profileData.name, // Allow name update
        profession: profileData.profession,
        resumeUrl: profileData.resume,
        portfolioUrl: profileData.portfolio,
        skills: profileData.skills,
        socials: profileData.socials,
        projects: profileData.projects,
        photoUrl: profileData.photo,
      },
    });

    return NextResponse.json({ message: "Saved", user: updatedUser });

  } catch (error) {
    console.error("Save error:", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}