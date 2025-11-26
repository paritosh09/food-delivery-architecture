import { NextResponse } from "next/server";
import { restaurants, restaurantMenus } from "@/lib/data/restaurants";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const restaurant = restaurants.find((r) => r.id === params.id);
  const menu = restaurantMenus[params.id] || [];

  if (!restaurant) {
    return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
  }

  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  return NextResponse.json({ restaurant, menu });
}

