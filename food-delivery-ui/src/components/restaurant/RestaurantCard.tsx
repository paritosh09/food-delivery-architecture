"use client";

import { motion } from "framer-motion";
import { Star, Clock, CircleDollarSign, Heart } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Restaurant } from "@/types";

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-card rounded-2xl overflow-hidden border border-border/50 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
    >
      {/* Image Section */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={restaurant.imageUrl || "/placeholder-restaurant.png"}
          alt={restaurant.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {restaurant.isPromoted && (
            <Badge className="bg-primary/90 hover:bg-primary text-xs font-semibold uppercase tracking-wider shadow-lg backdrop-blur-sm">
              Promoted
            </Badge>
          )}
          {restaurant.isVeg && (
            <Badge variant="secondary" className="bg-green-500/90 text-white hover:bg-green-600 backdrop-blur-sm">
              Pure Veg
            </Badge>
          )}
        </div>

        {/* Favorite Button */}
        <button className="absolute top-3 right-3 p-2 rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-white hover:text-red-500 transition-colors">
          <Heart className="h-5 w-5" />
        </button>

        {/* Discount Badge */}
        {restaurant.discount && (
          <div className="absolute bottom-3 left-3">
            <Badge variant="destructive" className="font-bold text-xs shadow-lg">
              {restaurant.discount}
            </Badge>
          </div>
        )}

        {/* Delivery Time (Overlay on Image) */}
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm text-foreground">
          <Clock className="h-3 w-3" />
          {restaurant.deliveryTime}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {restaurant.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {restaurant.cuisine.join(", ")}
            </p>
          </div>
          <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 px-1.5 py-0.5 rounded-md">
            <span className="text-sm font-bold text-green-700 dark:text-green-400">
              {restaurant.rating}
            </span>
            <Star className="h-3 w-3 fill-current text-green-700 dark:text-green-400" />
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground border-t border-border/50 pt-3">
          <div className="flex items-center gap-1">
            <CircleDollarSign className="h-4 w-4" />
            <span>{restaurant.priceForTwo} for two</span>
          </div>
          <span className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
            Free Delivery
          </span>
        </div>
      </div>
    </motion.div>
  );
}
