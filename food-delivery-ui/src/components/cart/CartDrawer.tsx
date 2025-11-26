"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, Trash2, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { cart, itemCount, total, updateQuantity, removeFromCart, clearCart } = useCart();
  const { toast } = useToast();

  const deliveryFee = 30;
  const tax = total * 0.05;
  const finalTotal = total + deliveryFee + tax;

  const handleRemove = (id: string) => {
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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>Your Cart ({itemCount} items)</span>
            {cart.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  clearCart();
                  toast({
                    title: "Cart cleared",
                    description: "All items have been removed.",
                  });
                }}
              >
                Clear
              </Button>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <AnimatePresence>
            {cart.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-lg font-semibold mb-2">Your cart is empty</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Add delicious items to get started!
                </p>
                <Button onClick={() => onOpenChange(false)} asChild>
                  <Link href="/restaurants">Browse Restaurants</Link>
                </Button>
              </motion.div>
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
                      className="text-4xl shrink-0"
                      whileHover={{ scale: 1.2, rotate: 10 }}
                    >
                      {item.image}
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold truncate">{item.name}</h4>
                          {item.restaurantName && (
                            <p className="text-xs text-muted-foreground truncate">
                              {item.restaurantName}
                            </p>
                          )}
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleRemove(item.id)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <Trash2 className="h-4 w-4" />
                        </motion.button>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-semibold">₹{item.price}</span>
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              if (item.quantity > 1) {
                                updateQuantity(item.id, item.quantity - 1);
                              } else {
                                handleRemove(item.id);
                              }
                            }}
                            className="p-1 rounded-full border"
                          >
                            <Minus className="h-3 w-3" />
                          </motion.button>
                          <span className="font-semibold min-w-[24px] text-center">
                            {item.quantity}
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 rounded-full border"
                          >
                            <Plus className="h-3 w-3" />
                          </motion.button>
                        </div>
                      </div>
                      <div className="mt-2 text-sm font-semibold">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </motion.div>
                ))}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span>₹{deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <motion.span
                      key={finalTotal}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                    >
                      ₹{finalTotal.toFixed(2)}
                    </motion.span>
                  </div>
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="pt-4"
                >
                  <Button className="w-full" size="lg" asChild>
                    <Link href="/cart" onClick={() => onOpenChange(false)}>
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
  );
}

