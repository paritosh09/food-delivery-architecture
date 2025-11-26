"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CreditCard, MapPin, Check, Loader2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { DeliveryAddress, PaymentMethod } from "@/types";
import { useToast } from "@/hooks/use-toast";

const steps = [
  { id: "address", label: "Address", icon: MapPin },
  { id: "payment", label: "Payment", icon: CreditCard },
  { id: "confirm", label: "Confirm", icon: Check },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, total, clearCart } = useCart();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<"address" | "payment" | "confirm">("address");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [address, setAddress] = useState<DeliveryAddress>({
    street: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
    type: "card",
  });

  const deliveryFee = 3.99;
  const tax = total * 0.08;
  const finalTotal = total + deliveryFee + tax;

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  const handleNext = () => {
    if (currentStep === "address") {
      if (!address.street || !address.city || !address.state || !address.zipCode) {
        toast({
          title: "Please fill all fields",
          description: "All address fields are required.",
          variant: "destructive",
        });
        return;
      }
      setCurrentStep("payment");
    } else if (currentStep === "payment") {
      if (paymentMethod.type === "card" && (!paymentMethod.cardNumber || !paymentMethod.expiry || !paymentMethod.cvv)) {
        toast({
          title: "Payment information required",
          description: "Please fill in all payment details.",
          variant: "destructive",
        });
        return;
      }
      setCurrentStep("confirm");
    }
  };

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    clearCart();
    toast({
      title: "Order placed successfully!",
      description: "Your order has been confirmed and will be delivered soon.",
      variant: "success",
    });
    
    setTimeout(() => {
      router.push("/orders/123");
    }, 1000);
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Link href="/menu">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </motion.div>
          </Link>
          <h1 className="text-xl font-bold">Checkout</h1>
        </div>
      </motion.header>

      {/* Checkout Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Progress Steps */}
          <div className="md:col-span-2 space-y-6">
            {/* Progress Indicator */}
            <div className="flex items-center gap-4 mb-8">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = index < currentStepIndex;
                const isCurrent = index === currentStepIndex;
                const isUpcoming = index > currentStepIndex;

                return (
                  <div key={step.id} className="flex items-center flex-1">
                    <div className="flex items-center gap-2 flex-1">
                      <motion.div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                          isCompleted
                            ? "bg-primary text-primary-foreground"
                            : isCurrent
                            ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                            : "bg-muted text-muted-foreground"
                        }`}
                        animate={{
                          scale: isCurrent ? [1, 1.1, 1] : 1,
                        }}
                        transition={{ duration: 0.5, repeat: isCurrent ? Infinity : 0, repeatDelay: 1 }}
                      >
                        {isCompleted ? (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 200 }}
                          >
                            <Check className="h-5 w-5" />
                          </motion.div>
                        ) : (
                          <span className="font-semibold">{index + 1}</span>
                        )}
                      </motion.div>
                      <span
                        className={`text-sm font-medium hidden sm:inline ${
                          isCurrent ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <motion.div
                        className={`h-1 flex-1 mx-2 rounded ${
                          isCompleted ? "bg-primary" : "bg-muted"
                        }`}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: isCompleted ? 1 : 0 }}
                        transition={{ duration: 0.5 }}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Step Content */}
            <AnimatePresence mode="wait">
              {currentStep === "address" && (
                <motion.div
                  key="address"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Delivery Address
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-2"
                      >
                        <Label htmlFor="street">Street Address</Label>
                        <Input
                          id="street"
                          placeholder="123 Main St"
                          value={address.street}
                          onChange={(e) => setAddress({ ...address, street: e.target.value })}
                        />
                      </motion.div>
                      <div className="grid grid-cols-2 gap-4">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="space-y-2"
                        >
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            placeholder="New York"
                            value={address.city}
                            onChange={(e) => setAddress({ ...address, city: e.target.value })}
                          />
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="space-y-2"
                        >
                          <Label htmlFor="state">State</Label>
                          <Input
                            id="state"
                            placeholder="NY"
                            value={address.state}
                            onChange={(e) => setAddress({ ...address, state: e.target.value })}
                          />
                        </motion.div>
                      </div>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-2"
                      >
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          placeholder="10001"
                          value={address.zipCode}
                          onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                        />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button className="w-full" onClick={handleNext}>
                          Continue to Payment
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {currentStep === "payment" && (
                <motion.div
                  key="payment"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Payment Method
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Tabs
                        defaultValue="card"
                        onValueChange={(value) =>
                          setPaymentMethod({ type: value as "card" | "cash" })
                        }
                      >
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="card">Credit Card</TabsTrigger>
                          <TabsTrigger value="cash">Cash on Delivery</TabsTrigger>
                        </TabsList>
                        <TabsContent value="card" className="space-y-4 mt-4">
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-2"
                          >
                            <Label htmlFor="cardNumber">Card Number</Label>
                            <Input
                              id="cardNumber"
                              placeholder="1234 5678 9012 3456"
                              value={paymentMethod.cardNumber || ""}
                              onChange={(e) =>
                                setPaymentMethod({ ...paymentMethod, cardNumber: e.target.value })
                              }
                            />
                          </motion.div>
                          <div className="grid grid-cols-2 gap-4">
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 }}
                              className="space-y-2"
                            >
                              <Label htmlFor="expiry">Expiry Date</Label>
                              <Input
                                id="expiry"
                                placeholder="MM/YY"
                                value={paymentMethod.expiry || ""}
                                onChange={(e) =>
                                  setPaymentMethod({ ...paymentMethod, expiry: e.target.value })
                                }
                              />
                            </motion.div>
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 }}
                              className="space-y-2"
                            >
                              <Label htmlFor="cvv">CVV</Label>
                              <Input
                                id="cvv"
                                placeholder="123"
                                value={paymentMethod.cvv || ""}
                                onChange={(e) =>
                                  setPaymentMethod({ ...paymentMethod, cvv: e.target.value })
                                }
                              />
                            </motion.div>
                          </div>
                        </TabsContent>
                        <TabsContent value="cash" className="mt-4">
                          <p className="text-sm text-muted-foreground">
                            Pay with cash when your order arrives.
                          </p>
                        </TabsContent>
                      </Tabs>
                      <div className="flex gap-2">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1"
                        >
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => setCurrentStep("address")}
                          >
                            Back
                          </Button>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1"
                        >
                          <Button className="w-full" onClick={handleNext}>
                            Review Order
                          </Button>
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {currentStep === "confirm" && (
                <motion.div
                  key="confirm"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Review Your Order</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <h3 className="font-semibold mb-2">Delivery Address</h3>
                        <p className="text-sm text-muted-foreground">
                          {address.street}, {address.city}, {address.state} {address.zipCode}
                        </p>
                      </motion.div>
                      <Separator />
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <h3 className="font-semibold mb-2">Payment Method</h3>
                        <p className="text-sm text-muted-foreground">
                          {paymentMethod.type === "card"
                            ? `Credit Card ending in ${paymentMethod.cardNumber?.slice(-4) || "****"}`
                            : "Cash on Delivery"}
                        </p>
                      </motion.div>
                      <Separator />
                      <div className="flex gap-2">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1"
                        >
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => setCurrentStep("payment")}
                          >
                            Back
                          </Button>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1"
                        >
                          <Button
                            className="w-full"
                            onClick={handlePlaceOrder}
                            disabled={isPlacingOrder}
                          >
                            {isPlacingOrder ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Placing Order...
                              </>
                            ) : (
                              "Place Order"
                            )}
                          </Button>
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {cart.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-muted-foreground">
                          {item.name} × {item.quantity}
                        </span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </motion.div>
                    ))}
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Delivery Fee</span>
                      <span>${deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <motion.div
                      className="flex justify-between font-bold text-lg"
                      key={finalTotal}
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                    >
                      <span>Total</span>
                      <span>${finalTotal.toFixed(2)}</span>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
