"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Filter } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface FilterSidebarProps {
  filters: {
    cuisine: string[];
    minRating: number;
    isVeg: boolean | null;
    maxDeliveryTime: number;
  };
  onFilterChange: (filters: any) => void;
  onReset: () => void;
}

const cuisines = ["Biryani", "Pizza", "Burgers", "Chinese", "North Indian", "South Indian", "Desserts"];

export function FilterSidebar({ filters, onFilterChange, onReset }: FilterSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleCuisineToggle = (cuisine: string) => {
    const newCuisines = filters.cuisine.includes(cuisine)
      ? filters.cuisine.filter((c) => c !== cuisine)
      : [...filters.cuisine, cuisine];
    onFilterChange({ ...filters, cuisine: newCuisines });
  };

  const content = (
    <div className="space-y-6">
      {/* Cuisine Filter */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Cuisine</h3>
        <div className="flex flex-wrap gap-2">
          {cuisines.map((cuisine) => (
            <motion.button
              key={cuisine}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCuisineToggle(cuisine)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                filters.cuisine.includes(cuisine)
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              {cuisine}
            </motion.button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Rating Filter */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Minimum Rating</h3>
        <div className="space-y-2">
          {[4.5, 4.0, 3.5, 3.0].map((rating) => (
            <motion.button
              key={rating}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onFilterChange({ ...filters, minRating: rating })}
              className={`w-full rounded-2xl border px-4 py-2 text-left text-sm font-medium transition-all ${
                filters.minRating === rating
                  ? "border-orange-200 bg-orange-50 text-orange-600"
                  : "border-transparent bg-slate-100 text-slate-500 hover:border-slate-200"
              }`}
            >
              {rating}+ ⭐
            </motion.button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Veg/Non-Veg Filter */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Food Type</h3>
        <div className="space-y-2">
          {[
            { label: "All", value: null },
            { label: "Veg Only", value: true },
            { label: "Non-Veg", value: false },
          ].map((option) => (
            <motion.button
              key={option.label}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onFilterChange({ ...filters, isVeg: option.value })}
              className={`w-full rounded-2xl border px-4 py-2 text-left text-sm font-medium transition-all ${
                filters.isVeg === option.value
                  ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                  : "border-transparent bg-slate-100 text-slate-500 hover:border-slate-200"
              }`}
            >
              {option.label}
            </motion.button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Reset Button */}
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          variant="outline"
          className="w-full rounded-full border-0 bg-slate-900 text-white shadow-lg shadow-slate-900/20"
          onClick={onReset}
        >
          Reset Filters
        </Button>
      </motion.div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Card className="sticky top-28 rounded-3xl border-none bg-white/80 shadow-2xl shadow-slate-200/70 backdrop-blur">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-800">
              <span className="rounded-full bg-orange-50 p-2 text-orange-500">
                <Filter className="h-4 w-4" />
              </span>
              Refine Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">{content}</CardContent>
        </Card>
      </div>

      {/* Mobile Sheet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="md:hidden rounded-full border-none bg-white/80 text-slate-900 shadow-lg">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-full bg-white/95 backdrop-blur sm:max-w-sm">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="mt-6">{content}</div>
        </SheetContent>
      </Sheet>
    </>
  );
}

