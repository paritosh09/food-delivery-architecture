import { NextResponse } from "next/server";
import { categories } from "@/lib/data/restaurants";

export async function GET() {
  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 200));
  return NextResponse.json({ categories });
}

