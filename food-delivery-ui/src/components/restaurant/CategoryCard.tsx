"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Category } from "@/types";

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="flex flex-col items-center gap-3 cursor-pointer group min-w-[100px]"
    >
      <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-transparent group-hover:border-primary transition-all duration-300 shadow-md group-hover:shadow-xl">
        <Image
          src={category.imageUrl || "/placeholder-category.png"}
          alt={category.name}
          fill
          sizes="96px"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
      </div>
      <div className="text-center">
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
          {category.name}
        </h3>
        <p className="text-xs text-muted-foreground">{category.itemCount}</p>
      </div>
    </motion.div>
  );
}
