"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Search, ShoppingBag, User, MapPin, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { itemCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? "bg-background/80 backdrop-blur-md border-b shadow-sm"
          : "bg-transparent"
        }`}
    >
      <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4">
        {/* Logo & Location */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary p-2 rounded-xl group-hover:rotate-12 transition-transform">
              <ShoppingBag className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
              FoodExpress
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-secondary/50 px-3 py-1.5 rounded-full">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="font-medium">New York, USA</span>
            <span className="text-xs opacity-50">▼</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-xl relative">
          <div className="relative w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search for restaurants, cuisine or a dish..."
              className="w-full pl-12 h-12 rounded-full bg-secondary/50 border-transparent focus:bg-background focus:border-primary/20 focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link href="/menu">
            <Button variant="ghost" className="hidden md:flex font-medium">
              Menu
            </Button>
          </Link>

          <Link href="/checkout">
            <Button variant="ghost" size="icon" className="relative hover:bg-primary/10 hover:text-primary transition-colors">
              <ShoppingBag className="h-6 w-6" />
              {itemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary text-primary-foreground">
                  {itemCount}
                </Badge>
              )}
            </Button>
          </Link>

          <Button variant="default" className="rounded-full px-6 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
            <User className="h-4 w-4 mr-2" />
            Sign In
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
