"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { DishCard } from "@/components/restaurant/DishCard";
import { DishCardSkeleton } from "@/components/ui/skeleton-loader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, Clock, IndianRupee, Shield, ArrowLeft, ShoppingBag } from "lucide-react";
import { Restaurant, Dish } from "@/lib/data/restaurants";
import { useCart } from "@/contexts/CartContext";
import Link from "next/link";

export default function RestaurantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { itemCount } = useCart();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menu, setMenu] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const categories = Array.from(new Set(menu.map((dish) => dish.category)));

  useEffect(() => {
    const fetchRestaurant = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/restaurant/${params.id}`);
        const data = await response.json();
        const menuData = Array.isArray(data.menu) ? data.menu : [];
        setRestaurant(data.restaurant);
        setMenu(menuData);
        if (menuData.length > 0) {
          setSelectedCategory(menuData[0].category);
        }
      } catch (error) {
        console.error("Failed to fetch restaurant:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchRestaurant();
    }
  }, [params.id]);

  const filteredMenu = selectedCategory
    ? menu.filter((dish) => dish.category === selectedCategory)
    : menu;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <DishCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Restaurant not found</h2>
          <Button onClick={() => router.push("/restaurants")}>Back to Restaurants</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Restaurant Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <Link href="/restaurants">
            <motion.div whileHover={{ x: -5 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" size="sm" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </motion.div>
          </Link>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-64 h-48 md:h-64 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg flex items-center justify-center text-8xl shrink-0">
              {restaurant.logo}
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
                <p className="text-muted-foreground">{restaurant.cuisine.join(", ")}</p>
                <p className="text-sm text-muted-foreground mt-1">{restaurant.address}</p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-full border">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{restaurant.rating}</span>
                  <span className="text-sm text-muted-foreground">
                    ({restaurant.reviews} reviews)
                  </span>
                </div>

                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{restaurant.deliveryTime}</span>
                </div>

                <div className="flex items-center gap-1 text-muted-foreground">
                  <IndianRupee className="h-4 w-4" />
                  <span>{restaurant.deliveryFee} delivery fee</span>
                </div>

                {restaurant.isVeg && (
                  <div className="flex items-center gap-1 text-green-600">
                    <Shield className="h-4 w-4" />
                    <span>Veg</span>
                  </div>
                )}
              </div>

              {restaurant.offers.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {restaurant.offers.map((offer, i) => (
                    <Badge key={i} variant="secondary" className="bg-orange-100 text-orange-800">
                      {offer}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Menu Categories */}
      {categories.length > 1 && (
        <div className="bg-white border-b sticky top-16 z-40">
          <div className="container mx-auto px-4">
            <div className="flex gap-2 overflow-x-auto py-4">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Menu Items */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-4">
          {filteredMenu.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No items in this category</p>
            </div>
          ) : (
            filteredMenu.map((dish, index) => (
              <DishCard
                key={dish.id}
                dish={dish}
                restaurantId={restaurant.id}
                restaurantName={restaurant.name}
                index={index}
              />
            ))
          )}
        </div>
      </div>

      {/* Sticky Cart Button (Mobile) */}
      {itemCount > 0 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 md:hidden z-50"
        >
          <Button
            className="w-full"
            size="lg"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingBag className="h-5 w-5 mr-2" />
            View Cart ({itemCount} items)
          </Button>
        </motion.div>
      )}

      {/* Cart Drawer */}
      <CartDrawer open={isCartOpen} onOpenChange={setIsCartOpen} />
    </div>
  );
}

