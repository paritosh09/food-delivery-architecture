import { NextResponse } from "next/server";
import { offers } from "@/lib/data/restaurants";

export async function GET() {
  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 200));
  return NextResponse.json({ offers });
}

