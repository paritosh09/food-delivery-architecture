"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, ArrowLeft, Search, X, Plus, Minus, Trash2, Filter } from "lucide-react";
import { MenuItemCard } from "@/components/menu/MenuItemCard";
import { useCart } from "@/contexts/CartContext";
import { MenuItem, CartItem } from "@/types";
import { useToast } from "@/hooks/use-toast";

const menuItems: MenuItem[] = [
  { id: 1, name: "Margherita Pizza", description: "Classic tomato, mozzarella, basil", price: 12.99, category: "pizza", image: "🍕", rating: 4.8, reviews: 234, preparationTime: 20, isPopular: true },
  { id: 2, name: "Pepperoni Pizza", description: "Tomato, mozzarella, pepperoni", price: 14.99, category: "pizza", image: "🍕", rating: 4.9, reviews: 189, preparationTime: 25, isPopular: true },
  { id: 3, name: "Veggie Pizza", description: "Tomato, mozzarella, vegetables", price: 13.99, category: "pizza", image: "🍕", rating: 4.6, reviews: 156, preparationTime: 22 },
  { id: 4, name: "Classic Burger", description: "Beef patty, lettuce, tomato, cheese", price: 10.99, category: "burgers", image: "🍔", rating: 4.7, reviews: 312, preparationTime: 15, isPopular: true },
  { id: 5, name: "Chicken Burger", description: "Grilled chicken, lettuce, mayo", price: 11.99, category: "burgers", image: "🍔", rating: 4.5, reviews: 198, preparationTime: 18 },
  { id: 6, name: "Veggie Burger", description: "Plant-based patty, avocado", price: 12.99, category: "burgers", image: "🍔", rating: 4.4, reviews: 145, preparationTime: 20, isNew: true },
  { id: 7, name: "California Roll", description: "Crab, avocado, cucumber", price: 8.99, category: "sushi", image: "🍣", rating: 4.8, reviews: 267, preparationTime: 12 },
  { id: 8, name: "Salmon Nigiri", description: "Fresh salmon, sushi rice", price: 9.99, category: "sushi", image: "🍣", rating: 4.9, reviews: 201, preparationTime: 10, isPopular: true },
  { id: 9, name: "Carbonara", description: "Pasta, bacon, egg, parmesan", price: 13.99, category: "pasta", image: "🍝", rating: 4.7, reviews: 178, preparationTime: 18 },
  { id: 10, name: "Bolognese", description: "Pasta, meat sauce, parmesan", price: 12.99, category: "pasta", image: "🍝", rating: 4.6, reviews: 165, preparationTime: 20 },
  { id: 11, name: "Caesar Salad", description: "Romaine, croutons, parmesan", price: 8.99, category: "salads", image: "🥗", rating: 4.5, reviews: 142, preparationTime: 8 },
  { id: 12, name: "Chocolate Cake", description: "Rich chocolate layer cake", price: 6.99, category: "desserts", image: "🍰", rating: 4.9, reviews: 298, preparationTime: 5, isPopular: true },
];

const categories = ["All", "Pizza", "Burgers", "Sushi", "Pasta", "Salads", "Desserts"];

export default function MenuPage() {
  const { cart, itemCount, total, updateQuantity, removeFromCart } = useCart();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isCartOpen, setIsCartOpen] = useState(false);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleUpdateQuantity = (id: number, delta: number) => {
    const item = cart.find((i) => i.id === id);
    if (item) {
      const newQuantity = item.quantity + delta;
      if (newQuantity <= 0) {
        removeFromCart(id);
        toast({
          title: "Removed from cart",
          description: `${item.name} has been removed.`,
        });
      } else {
        updateQuantity(id, newQuantity);
      }
    }
  };

  const handleRemoveFromCart = (id: number) => {
    const item = cart.find((i) => i.id === id);
    if (item) {
      removeFromCart(id);
      toast({
        title: "Removed from cart",
        description: `${item.name} has been removed.`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </motion.div>
            </Link>
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Menu</span>
            </div>
          </div>
          <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <SheetTrigger asChild>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" className="relative">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Cart
                  {itemCount > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-2"
                    >
                      <Badge className="px-2 py-0.5 text-xs">{itemCount}</Badge>
                    </motion.div>
                  )}
                </Button>
              </motion.div>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Your Cart ({itemCount} items)</SheetTitle>
              </SheetHeader>
              <div className="mt-8 space-y-4">
                <AnimatePresence>
                  {cart.length === 0 ? (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center text-muted-foreground py-8"
                    >
                      Your cart is empty
                    </motion.p>
                  ) : (
                    <>
                      {cart.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="flex gap-4 p-4 rounded-lg border bg-card"
                        >
                          <motion.div
                            className="text-4xl"
                            whileHover={{ scale: 1.2, rotate: 10 }}
                          >
                            {item.image}
                          </motion.div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-8 w-8"
                                  onClick={() => handleUpdateQuantity(item.id, -1)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                              </motion.div>
                              <span className="w-8 text-center font-medium">{item.quantity}</span>
                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-8 w-8"
                                  onClick={() => handleUpdateQuantity(item.id, 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </motion.div>
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="ml-auto"
                              >
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 text-destructive hover:text-destructive"
                                  onClick={() => handleRemoveFromCart(item.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </motion.div>
                            </div>
                          </div>
                          <div className="font-semibold">${(item.price * item.quantity).toFixed(2)}</div>
                        </motion.div>
                      ))}
                      <Separator />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <motion.span
                          key={total}
                          initial={{ scale: 1.2 }}
                          animate={{ scale: 1 }}
                        >
                          ${total.toFixed(2)}
                        </motion.span>
                      </div>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button className="w-full" size="lg" asChild>
                          <Link href="/checkout" onClick={() => setIsCartOpen(false)}>
                            Proceed to Checkout
                          </Link>
                        </Button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </motion.header>

      {/* Menu Content */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Our Menu
          </h1>
          <p className="text-muted-foreground">Browse our delicious selection</p>
        </motion.div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </motion.button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
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

        {/* Menu Grid */}
        <AnimatePresence mode="wait">
          {filteredItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <p className="text-muted-foreground">No items found matching your search.</p>
            </motion.div>
          ) : (
            <motion.div
              key={selectedCategory + searchQuery}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredItems.map((item, index) => (
                <MenuItemCard key={item.id} item={item} index={index} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
