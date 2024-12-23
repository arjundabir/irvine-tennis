import { NextResponse, NextRequest } from "next/server";
import { Firestore } from "@google-cloud/firestore";

const firestore = new Firestore({
  keyFilename: process.env.FIREBASE_CONFIG,
});

interface User {
  name: string;
  email: string;
  phone_number: number;
}

export async function POST(req: NextRequest, res: NextResponse) {
  const { name, email, phone_number } = await req.json() as User;
  try {
    const userRef = firestore.collection("users").doc();
    await userRef.set({
      name,
      email,
      phone_number,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        message: "User added successfully",
        id: userRef.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}