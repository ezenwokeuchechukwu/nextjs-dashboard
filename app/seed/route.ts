import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("users_db");

  // Example seeding data
  await db.collection("users").insertOne({
    name: "Admin User",
    email: "admin@example.com",
    password: "hashed_password_here",
  });

  return NextResponse.json({ message: "Database seeded successfully" });
}
