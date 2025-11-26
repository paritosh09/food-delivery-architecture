"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { CategoryCard } from "@/components/restaurant/CategoryCard";
import { RestaurantCard } from "@/components/restaurant/RestaurantCard";
import { OfferBanner } from "@/components/ui/offer-banner";
import { catalogApi } from "@/lib/api/catalog";
import { Category, Restaurant } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowRight, Filter, SlidersHorizontal, Loader2 } from "lucide-react";
import { CategoryCardSkeleton, RestaurantCardSkeleton } from "@/components/ui/skeleton-loader";

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, rests] = await Promise.all([
          catalogApi.getCategories(),
          catalogApi.getRestaurants(),
        ]);
        setCategories(cats);
        setRestaurants(rests);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        {/* Offers Section */}
        <OfferBanner />

        {/* Hero / Categories Section */}
        <section className="container mx-auto px-4 mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">What's on your mind?</h2>
              <p className="text-muted-foreground mt-1">Explore top categories</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="rounded-full">
                <ArrowRight className="h-4 w-4 rotate-180" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x">
            {loading
              ? [...Array(8)].map((_, i) => <CategoryCardSkeleton key={i} />)
              : categories.map((category) => (
                <Link href={`/menu?category=${category.name.toLowerCase()}`} key={category.id}>
                  <CategoryCard category={category} />
                </Link>
              ))}
          </div>
        </section>

        {/* Filters Bar */}
        <section className="sticky top-20 z-40 bg-background/95 backdrop-blur-sm border-y border-border/50 py-4 mb-8 shadow-sm">
          <div className="container mx-auto px-4 flex items-center gap-4 overflow-x-auto scrollbar-hide">
            <Button variant="outline" className="rounded-full border-border/60 hover:border-primary hover:text-primary bg-background">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline" className="rounded-full border-border/60 hover:border-primary hover:text-primary bg-background">
              Sort By
            </Button>
            <Button variant="default" className="rounded-full">
              Fast Delivery
            </Button>
            <Button variant="outline" className="rounded-full border-border/60 hover:border-primary hover:text-primary bg-background">
              New on FoodExpress
            </Button>
            <Button variant="outline" className="rounded-full border-border/60 hover:border-primary hover:text-primary bg-background">
              Ratings 4.0+
            </Button>
            <Button variant="outline" className="rounded-full border-border/60 hover:border-primary hover:text-primary bg-background">
              Pure Veg
            </Button>
            <Button variant="outline" className="rounded-full border-border/60 hover:border-primary hover:text-primary bg-background">
              Offers
            </Button>
          </div>
        </section>

        {/* Restaurant Grid */}
        <section className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Top Restaurants in New York</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {loading
              ? [...Array(8)].map((_, i) => <RestaurantCardSkeleton key={i} />)
              : restaurants.map((restaurant) => (
                <Link href="/menu" key={restaurant.id}>
                  <RestaurantCard restaurant={restaurant} />
                </Link>
              ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
                FoodExpress
              </h3>
              <p className="text-muted-foreground">
                Delicious food delivered to your doorstep. Experience the best local restaurants.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li className="hover:text-primary cursor-pointer">About Us</li>
                <li className="hover:text-primary cursor-pointer">Team</li>
                <li className="hover:text-primary cursor-pointer">Careers</li>
                <li className="hover:text-primary cursor-pointer">Blog</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li className="hover:text-primary cursor-pointer">Help & Support</li>
                <li className="hover:text-primary cursor-pointer">Partner with us</li>
                <li className="hover:text-primary cursor-pointer">Ride with us</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li className="hover:text-primary cursor-pointer">Terms & Conditions</li>
                <li className="hover:text-primary cursor-pointer">Refund & Cancellation</li>
                <li className="hover:text-primary cursor-pointer">Privacy Policy</li>
                <li className="hover:text-primary cursor-pointer">Cookie Policy</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-12 pt-8 text-center text-muted-foreground">
            <p>© 2025 FoodExpress. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
