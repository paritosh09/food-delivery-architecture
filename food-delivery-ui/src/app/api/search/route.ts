import { NextResponse } from "next/server";
import { restaurants, restaurantMenus } from "@/lib/data/restaurants";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.toLowerCase() || "";

  if (!query) {
    return NextResponse.json({ restaurants: [], dishes: [] });
  }

  // Search restaurants
  const matchingRestaurants = restaurants.filter(
    (r) =>
      r.name.toLowerCase().includes(query) ||
      r.cuisine.some((c) => c.toLowerCase().includes(query)) ||
      r.address.toLowerCase().includes(query)
  );

  // Search dishes
  const matchingDishes: Array<{ dish: any; restaurant: any }> = [];
  Object.entries(restaurantMenus).forEach(([restaurantId, dishes]) => {
    const restaurant = restaurants.find((r) => r.id === restaurantId);
    dishes.forEach((dish) => {
      if (
        dish.name.toLowerCase().includes(query) ||
        dish.description.toLowerCase().includes(query) ||
        dish.category.toLowerCase().includes(query)
      ) {
        matchingDishes.push({ dish, restaurant });
      }
    });
  });

  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 400));

  return NextResponse.json({
    restaurants: matchingRestaurants,
    dishes: matchingDishes,
  });
}

