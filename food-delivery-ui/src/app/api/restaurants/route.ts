import { NextResponse } from "next/server";
import { restaurants } from "@/lib/data/restaurants";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cuisine = searchParams.get("cuisine");
  const minRating = searchParams.get("minRating");
  const isVeg = searchParams.get("isVeg");
  const sortBy = searchParams.get("sortBy") || "bestMatch";
  const search = searchParams.get("search");

  let filtered = [...restaurants];

  // Filter by search
  if (search) {
    filtered = filtered.filter(
      (r) =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.cuisine.some((c) => c.toLowerCase().includes(search.toLowerCase()))
    );
  }

  // Filter by cuisine
  if (cuisine) {
    filtered = filtered.filter((r) => r.cuisine.includes(cuisine));
  }

  // Filter by rating
  if (minRating) {
    filtered = filtered.filter((r) => r.rating >= parseFloat(minRating));
  }

  // Filter by veg/non-veg
  if (isVeg === "true") {
    filtered = filtered.filter((r) => r.isVeg);
  }

  // Sort
  switch (sortBy) {
    case "rating":
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    case "deliveryTime":
      filtered.sort((a, b) => {
        const aTime = parseInt(a.deliveryTime.split("-")[0]);
        const bTime = parseInt(b.deliveryTime.split("-")[0]);
        return aTime - bTime;
      });
      break;
    case "costLow":
      filtered.sort((a, b) => a.costForTwo - b.costForTwo);
      break;
    case "costHigh":
      filtered.sort((a, b) => b.costForTwo - a.costForTwo);
      break;
    default:
      // Best match - promoted first, then by rating
      filtered.sort((a, b) => {
        if (a.isPromoted && !b.isPromoted) return -1;
        if (!a.isPromoted && b.isPromoted) return 1;
        return b.rating - a.rating;
      });
  }

  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return NextResponse.json({ restaurants: filtered });
}

