"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Star, Shield } from "lucide-react";
import { Dish } from "@/lib/data/restaurants";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

interface DishCardProps {
  dish: Dish;
  restaurantId: string;
  restaurantName: string;
  index?: number;
}

export function DishCard({ dish, restaurantId, restaurantName, index = 0 }: DishCardProps) {
  const { addToCart, updateQuantity, getItemQuantity, removeFromCart } = useCart();
  const { toast } = useToast();
  const [isHovered, setIsHovered] = useState(false);
  const quantity = getItemQuantity(dish.id);

  const handleAdd = () => {
    addToCart({
      ...dish,
      restaurantId,
      restaurantName,
    });
    toast({
      title: "Added to cart!",
      description: `${dish.name} has been added.`,
      variant: "success",
    });
  };

  const handleIncrement = () => {
    updateQuantity(dish.id, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity === 1) {
      removeFromCart(dish.id);
    } else {
      updateQuantity(dish.id, quantity - 1);
    }
  };

  if (!dish.isAvailable) {
    return (
      <Card className="opacity-60 border-muted">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="text-4xl">{dish.image}</div>
            <div className="flex-1">
              <h3 className="font-semibold line-through">{dish.name}</h3>
              <p className="text-sm text-muted-foreground">{dish.description}</p>
              <Badge variant="secondary" className="mt-2">Not Available</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="border-2 hover:border-primary/50 transition-all duration-300 group">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <motion.div
              className="text-5xl shrink-0"
              animate={{ scale: isHovered ? 1.2 : 1, rotate: isHovered ? 10 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {dish.image}
            </motion.div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    {dish.name}
                  </h3>
                  {dish.rating > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-muted-foreground">{dish.rating}</span>
                    </div>
                  )}
                </div>
                {dish.isVeg && (
                  <Shield className="h-4 w-4 text-green-600 shrink-0" />
                )}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {dish.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-lg">₹{dish.price}</span>
                <AnimatePresence mode="wait">
                  {quantity === 0 ? (
                    <motion.div
                      key="add"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Button
                        size="sm"
                        onClick={handleAdd}
                        className="rounded-full"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="quantity"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-3 py-1"
                    >
                      <motion.button
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.8 }}
                        onClick={handleDecrement}
                        className="p-1"
                      >
                        <Minus className="h-3 w-3" />
                      </motion.button>
                      <span className="font-semibold min-w-[20px] text-center">{quantity}</span>
                      <motion.button
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.8 }}
                        onClick={handleIncrement}
                        className="p-1"
                      >
                        <Plus className="h-3 w-3" />
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

