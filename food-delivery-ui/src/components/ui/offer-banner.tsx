"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function OfferBanner() {
  return (
    <div className="container mx-auto px-4 mb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="relative h-64 rounded-2xl overflow-hidden bg-gradient-to-r from-orange-500 to-red-500 text-white p-8 flex flex-col justify-center items-start"
        >
          <div className="relative z-10 max-w-md">
            <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">
              Free Delivery
            </span>
            <h3 className="text-3xl font-bold mb-2">50% OFF on First Order</h3>
            <p className="text-white/90 mb-6">Order from top restaurants and get delivered in minutes.</p>
            <Button variant="secondary" className="font-semibold">
              Order Now
            </Button>
          </div>
          <div className="absolute right-0 bottom-0 w-64 h-64 opacity-20">
            {/* Abstract shape or pattern could go here */}
            <div className="w-full h-full bg-white rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="relative h-64 rounded-2xl overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-8 flex flex-col justify-center items-start"
        >
          <div className="relative z-10 max-w-md">
            <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">
              New Arrival
            </span>
            <h3 className="text-3xl font-bold mb-2">Try Premium Sushi</h3>
            <p className="text-white/90 mb-6">Experience authentic Japanese cuisine at home.</p>
            <Button variant="secondary" className="font-semibold">
              Explore Menu
            </Button>
          </div>
          <div className="absolute right-0 bottom-0 w-64 h-64 opacity-20">
            <div className="w-full h-full bg-white rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
