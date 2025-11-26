"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { RestaurantCard } from "@/components/restaurant/RestaurantCard";
import { FilterSidebar } from "@/components/restaurant/FilterSidebar";
import { RestaurantCardSkeleton } from "@/components/ui/skeleton-loader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { Category, Restaurant } from "@/lib/data/restaurants";

const chipGradients = [
  "from-orange-500/90 to-red-500/90",
  "from-pink-500/90 to-purple-500/90",
  "from-emerald-500/90 to-lime-500/90",
  "from-blue-500/90 to-cyan-500/90",
];

export default function RestaurantsPage() {
  const searchParams = useSearchParams();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [sortBy, setSortBy] = useState("bestMatch");
  const [filters, setFilters] = useState({
    cuisine: [] as string[],
    minRating: 0,
    isVeg: null as boolean | null,
    maxDeliveryTime: 60,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data.categories);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.append("search", searchQuery);
        if (filters.cuisine.length > 0) params.append("cuisine", filters.cuisine[0]);
        if (filters.minRating > 0) params.append("minRating", filters.minRating.toString());
        if (filters.isVeg !== null) params.append("isVeg", filters.isVeg.toString());
        params.append("sortBy", sortBy);

        const response = await fetch(`/api/restaurants?${params.toString()}`);
        const data = await response.json();
        setRestaurants(data.restaurants);
      } catch (error) {
        console.error("Failed to fetch restaurants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [searchQuery, filters, sortBy]);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setActiveCategory("All");
    setFilters({
      cuisine: [],
      minRating: 0,
      isVeg: null,
      maxDeliveryTime: 60,
    });
  };

  const handleCategorySelect = (categoryName: string) => {
    setActiveCategory(categoryName);
    setFilters((prev) => ({
      ...prev,
      cuisine: categoryName === "All" ? [] : [categoryName],
    }));
  };

  const resultsCopy = loading
    ? "Curating the best kitchens for you..."
    : `${restaurants.length} ${restaurants.length === 1 ? "restaurant" : "restaurants"} ready to deliver`;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero */}
      <section className="animated-gradient noise-overlay relative overflow-hidden text-white">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute -left-10 top-10 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <span className="orb left-10 top-1/3 h-40 w-40" />
          <span className="orb right-20 top-10 h-56 w-56" />
          <span className="orb bottom-10 left-1/2 h-48 w-48" />
        </div>
        <div className="container relative mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur">
              <Sparkles className="h-4 w-4" />
              Curated eats near you
            </div>
            <div>
              <h1 className="text-4xl font-bold leading-tight md:text-5xl">
                Discover food you’ll love, delivered in minutes.
              </h1>
              <p className="mt-3 text-lg text-white/80 md:text-xl">
                Trending restaurants, chef specials, and lightning-fast delivery across your city.
              </p>
            </div>
            <div className="flex flex-col gap-3 rounded-3xl bg-white/15 p-2 backdrop-blur md:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/70" />
                <Input
                  placeholder="Search for sushi, biryani, pizza..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-14 rounded-2xl border-0 bg-white/15 pl-12 pr-4 text-white placeholder:text-white/60 focus-visible:ring-white/80"
                />
              </div>
              <Button
                size="lg"
                className="h-14 rounded-2xl bg-white text-orange-600 shadow-xl shadow-black/10 transition hover:-translate-y-0.5 hover:bg-white/90"
              >
                Search
              </Button>
            </div>

            <div className="flex flex-wrap gap-3">
              <CategoryChip
                label="All"
                emoji="✨"
                gradient={chipGradients[0]}
                active={activeCategory === "All"}
                onClick={() => handleCategorySelect("All")}
              />
              {categories.map((category, idx) => (
                <CategoryChip
                  key={category.id}
                  label={category.name}
                  emoji={category.emoji}
                  gradient={chipGradients[idx % chipGradients.length]}
                  active={activeCategory === category.name}
                  onClick={() => handleCategorySelect(category.name)}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="relative z-10 -mt-16 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="lg:w-72 shrink-0">
              <FilterSidebar filters={filters} onFilterChange={handleFilterChange} onReset={handleResetFilters} />
            </div>

            <section className="flex-1 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="sticky top-24 z-30 rounded-3xl border border-white/60 bg-white/90 p-5 shadow-2xl shadow-slate-200/70 backdrop-blur"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  <div className="flex-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Results</p>
                    <p className="text-base font-semibold text-slate-800">{resultsCopy}</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-48 rounded-full border-slate-200 bg-slate-50 text-sm font-semibold text-slate-600">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl">
                        <SelectItem value="bestMatch">Best Match</SelectItem>
                        <SelectItem value="rating">Highest Rating</SelectItem>
                        <SelectItem value="deliveryTime">Fastest Delivery</SelectItem>
                        <SelectItem value="costLow">Cost: Low to High</SelectItem>
                        <SelectItem value="costHigh">Cost: High to Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      className="rounded-full border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                      onClick={handleResetFilters}
                    >
                      <SlidersHorizontal className="mr-2 h-4 w-4" />
                      Reset
                    </Button>
                  </div>
                </div>
              </motion.div>

              {loading ? (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {[...Array(6)].map((_, i) => (
                    <RestaurantCardSkeleton key={i} />
                  ))}
                </div>
              ) : restaurants.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-3xl border border-dashed border-slate-200 bg-white/70 p-12 text-center shadow-inner"
                >
                  <p className="text-lg font-semibold text-slate-700">We couldn’t find matches for that filter set.</p>
                  <p className="mt-2 text-sm text-slate-500">
                    Try resetting filters or searching for a different cuisine.
                  </p>
                  <Button className="mt-6 rounded-full" variant="default" onClick={handleResetFilters}>
                    Clear filters
                  </Button>
                </motion.div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  <AnimatePresence>
                    {restaurants.map((restaurant, index) => (
                      <RestaurantCard key={restaurant.id} restaurant={restaurant} index={index} />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

interface CategoryChipProps {
  label: string;
  emoji: string;
  gradient: string;
  active: boolean;
  onClick: () => void;
}

function CategoryChip({ label, emoji, gradient, active, onClick }: CategoryChipProps) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
        active
          ? `bg-gradient-to-r ${gradient} text-white shadow-lg shadow-black/20`
          : "bg-white/20 text-white/80 hover:bg-white/30"
      }`}
    >
      <span className="text-lg">{emoji}</span>
      {label}
    </motion.button>
  );
}

