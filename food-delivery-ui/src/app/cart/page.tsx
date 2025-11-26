"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, Trash2, ArrowLeft, IndianRupee, Tag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function CartPage() {
  const router = useRouter();
  const { cart, total, updateQuantity, removeFromCart, clearCart } = useCart();
  const { toast } = useToast();
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);

  const deliveryFee = 30;
  const tax = total * 0.05;
  const discount = appliedPromo ? total * 0.1 : 0;
  const finalTotal = total + deliveryFee + tax - discount;

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === "SAVE10") {
      setAppliedPromo("SAVE10");
      toast({
        title: "Promo code applied!",
        description: "10% discount applied to your order.",
        variant: "success",
      });
    } else {
      toast({
        title: "Invalid promo code",
        description: "Please enter a valid promo code.",
        variant: "destructive",
      });
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add items to your cart before checkout.",
        variant: "destructive",
      });
      return;
    }
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <Link href="/restaurants">
          <motion.div whileHover={{ x: -5 }} whileTap={{ scale: 0.95 }}>
            <Button variant="ghost" size="sm" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </motion.div>
        </Link>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="md:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Cart ({cart.length} items)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-lg text-muted-foreground mb-4">Your cart is empty</p>
                    <Button asChild>
                      <Link href="/restaurants">Browse Restaurants</Link>
                    </Button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
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
                            onClick={() => {
                              removeFromCart(item.id);
                              toast({
                                title: "Removed from cart",
                                description: `${item.name} has been removed.`,
                              });
                            }}
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
                                  removeFromCart(item.id);
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
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-₹{discount.toFixed(2)}</span>
                    </div>
                  )}
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

                <Separator />

                {/* Promo Code */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Promo Code</span>
                  </div>
                  {appliedPromo ? (
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-green-800">{appliedPromo}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setAppliedPromo(null)}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-1"
                      />
                      <Button size="sm" onClick={handleApplyPromo}>
                        Apply
                      </Button>
                    </div>
                  )}
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleCheckout}
                    disabled={cart.length === 0}
                  >
                    Proceed to Checkout
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

