"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles } from "lucide-react";
import { MenuItem } from "@/types";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

interface MenuItemCardProps {
  item: MenuItem;
  index?: number;
}

export function MenuItemCard({ item, index = 0 }: MenuItemCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addToCart(item);
    toast({
      title: "Added to cart!",
      description: `${item.name} has been added to your cart.`,
      variant: "success",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="overflow-hidden border-muted/40 hover:border-primary/50 transition-all duration-300 group cursor-pointer h-full flex flex-col">
        <CardContent className="p-0 relative">
          <motion.div
            className="bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 h-48 flex items-center justify-center text-7xl relative overflow-hidden"
            animate={{
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              animate={{
                rotate: isHovered ? 360 : 0,
                scale: isHovered ? 1.2 : 1,
              }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              {item.image}
            </motion.div>
            
            {item.isPopular && (
              <motion.div
                className="absolute top-2 right-2"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Popular
                </Badge>
              </motion.div>
            )}
            
            {item.isNew && (
              <motion.div
                className="absolute top-2 left-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Badge variant="secondary" className="bg-green-500 text-white">
                  New
                </Badge>
              </motion.div>
            )}

            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
              initial={false}
            />
          </motion.div>
          
          <div className="p-4 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                {item.name}
              </h3>
              <Badge variant="secondary" className="text-xs shrink-0">
                ${item.price.toFixed(2)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {item.description}
            </p>
            {item.rating && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="text-yellow-500">★</span>
                <span>{item.rating}</span>
                {item.reviews && (
                  <span>({item.reviews} reviews)</span>
                )}
              </div>
            )}
            {item.preparationTime && (
              <p className="text-xs text-muted-foreground">
                ⏱️ {item.preparationTime} min
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <motion.div
            className="w-full"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              className="w-full group/btn"
              onClick={handleAddToCart}
            >
              <motion.div
                animate={{ rotate: isHovered ? 90 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <Plus className="h-4 w-4 mr-2" />
              </motion.div>
              Add to Cart
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

