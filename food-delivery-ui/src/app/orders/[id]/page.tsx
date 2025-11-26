"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Package, Truck, CheckCircle2, Clock } from "lucide-react";

export default function OrderTrackingPage({ params }: { params: { id: string } }) {
    const [currentStatus, setCurrentStatus] = useState(0);

    const statuses = [
        { icon: Clock, label: "Order Placed", time: "2:30 PM", completed: true },
        { icon: Package, label: "Preparing", time: "2:35 PM", completed: true },
        { icon: Truck, label: "Out for Delivery", time: "3:15 PM", completed: false },
        { icon: CheckCircle2, label: "Delivered", time: "", completed: false },
    ];

    useEffect(() => {
        // Simulate status updates
        const interval = setInterval(() => {
            setCurrentStatus((prev) => {
                if (prev < statuses.length - 1) {
                    return prev + 1;
                }
                clearInterval(interval);
                return prev;
            });
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4 h-16 flex items-center gap-4">
                    <Link href="/">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <h1 className="text-xl font-bold">Order #{params.id}</h1>
                </div>
            </header>

            {/* Order Tracking Content */}
            <main className="container mx-auto px-4 py-8 max-w-2xl">
                <div className="space-y-6">
                    {/* Status Card */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Order Status</CardTitle>
                                <Badge variant={currentStatus === statuses.length - 1 ? "default" : "secondary"}>
                                    {currentStatus === statuses.length - 1 ? "Delivered" : "In Progress"}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {statuses.map((status, index) => {
                                    const Icon = status.icon;
                                    const isCompleted = index <= currentStatus;
                                    const isCurrent = index === currentStatus;

                                    return (
                                        <div key={status.label} className="flex gap-4">
                                            <div className="flex flex-col items-center">
                                                <div
                                                    className={`w-10 h-10 rounded-full flex items-center justify-center ${isCompleted
                                                            ? "bg-primary text-primary-foreground"
                                                            : "bg-muted text-muted-foreground"
                                                        } ${isCurrent ? "ring-4 ring-primary/20" : ""}`}
                                                >
                                                    <Icon className="h-5 w-5" />
                                                </div>
                                                {index < statuses.length - 1 && (
                                                    <div
                                                        className={`w-0.5 h-12 ${isCompleted ? "bg-primary" : "bg-muted"
                                                            }`}
                                                    />
                                                )}
                                            </div>
                                            <div className="flex-1 pb-8">
                                                <div className="flex items-center justify-between">
                                                    <h3
                                                        className={`font-semibold ${isCompleted ? "text-foreground" : "text-muted-foreground"
                                                            }`}
                                                    >
                                                        {status.label}
                                                    </h3>
                                                    {status.time && (
                                                        <span className="text-sm text-muted-foreground">{status.time}</span>
                                                    )}
                                                </div>
                                                {isCurrent && (
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        Your order is currently being {status.label.toLowerCase()}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Order Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Margherita Pizza</span>
                                    <span>$12.99</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Pepperoni Pizza</span>
                                    <span>$14.99</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Caesar Salad</span>
                                    <span>$8.99</span>
                                </div>
                            </div>
                            <Separator />
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>$36.97</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Delivery Fee</span>
                                    <span>$3.99</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Tax</span>
                                    <span>$2.96</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-bold">
                                    <span>Total</span>
                                    <span>$43.92</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Delivery Address */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Delivery Address</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm">
                                123 Main Street
                                <br />
                                New York, NY 10001
                            </p>
                        </CardContent>
                    </Card>

                    <Button className="w-full" variant="outline" asChild>
                        <Link href="/">Back to Home</Link>
                    </Button>
                </div>
            </main>
        </div>
    );
}
