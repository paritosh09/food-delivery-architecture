export interface Restaurant {
  id: string;
  name: string;
  cuisine: string[];
  rating: number;
  reviews: number;
  deliveryTime: string;
  deliveryFee: number;
  minOrder: number;
  image: string;
  logo: string;
  address: string;
  offers: string[];
  isVeg: boolean;
  isPromoted: boolean;
  costForTwo: number;
  tags: string[];
}

export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isVeg: boolean;
  isAvailable: boolean;
  rating: number;
  customizations?: {
    name: string;
    options: { name: string; price: number }[];
  }[];
}

export interface Category {
  id: string;
  name: string;
  image: string;
  emoji: string;
}

export const categories: Category[] = [
  { id: "1", name: "Biryani", image: "🍛", emoji: "🍛" },
  { id: "2", name: "Pizza", image: "🍕", emoji: "🍕" },
  { id: "3", name: "Burgers", image: "🍔", emoji: "🍔" },
  { id: "4", name: "Desserts", image: "🍰", emoji: "🍰" },
  { id: "5", name: "Chinese", image: "🥡", emoji: "🥡" },
  { id: "6", name: "North Indian", image: "🍛", emoji: "🍛" },
  { id: "7", name: "South Indian", image: "🍛", emoji: "🍛" },
  { id: "8", name: "Fast Food", image: "🍟", emoji: "🍟" },
];

export const restaurants: Restaurant[] = [
  {
    id: "1",
    name: "Biryani House",
    cuisine: ["Biryani", "North Indian", "Mughlai"],
    rating: 4.5,
    reviews: 1234,
    deliveryTime: "30-40 min",
    deliveryFee: 25,
    minOrder: 200,
    image: "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=800",
    logo: "🍛",
    address: "Koramangala, Bangalore",
    offers: ["50% off up to ₹100", "Free delivery"],
    isVeg: false,
    isPromoted: true,
    costForTwo: 400,
    tags: ["Popular", "Best Seller"],
  },
  {
    id: "2",
    name: "Pizza Paradise",
    cuisine: ["Pizza", "Italian", "Fast Food"],
    rating: 4.7,
    reviews: 2341,
    deliveryTime: "25-35 min",
    deliveryFee: 30,
    minOrder: 150,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800",
    logo: "🍕",
    address: "Indiranagar, Bangalore",
    offers: ["Buy 1 Get 1", "20% off"],
    isVeg: true,
    isPromoted: true,
    costForTwo: 500,
    tags: ["Trending"],
  },
  {
    id: "3",
    name: "Burger King",
    cuisine: ["Burgers", "Fast Food", "American"],
    rating: 4.3,
    reviews: 1890,
    deliveryTime: "20-30 min",
    deliveryFee: 20,
    minOrder: 100,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800",
    logo: "🍔",
    address: "MG Road, Bangalore",
    offers: ["Combo deals", "Free fries"],
    isVeg: false,
    isPromoted: false,
    costForTwo: 350,
    tags: ["Quick Bites"],
  },
  {
    id: "4",
    name: "Sweet Dreams",
    cuisine: ["Desserts", "Bakery", "Ice Cream"],
    rating: 4.6,
    reviews: 987,
    deliveryTime: "15-25 min",
    deliveryFee: 15,
    minOrder: 150,
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800",
    logo: "🍰",
    address: "HSR Layout, Bangalore",
    offers: ["30% off", "Free dessert"],
    isVeg: true,
    isPromoted: false,
    costForTwo: 300,
    tags: ["Sweet"],
  },
  {
    id: "5",
    name: "Dragon Wok",
    cuisine: ["Chinese", "Asian", "Noodles"],
    rating: 4.4,
    reviews: 1456,
    deliveryTime: "30-40 min",
    deliveryFee: 25,
    minOrder: 200,
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800",
    logo: "🥡",
    address: "Whitefield, Bangalore",
    offers: ["40% off", "Free soup"],
    isVeg: false,
    isPromoted: true,
    costForTwo: 450,
    tags: ["Spicy"],
  },
  {
    id: "6",
    name: "Tandoor Express",
    cuisine: ["North Indian", "Tandoor", "Kebabs"],
    rating: 4.5,
    reviews: 2100,
    deliveryTime: "35-45 min",
    deliveryFee: 30,
    minOrder: 250,
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800",
    logo: "🍛",
    address: "BTM Layout, Bangalore",
    offers: ["25% off", "Free naan"],
    isVeg: false,
    isPromoted: false,
    costForTwo: 550,
    tags: ["Authentic"],
  },
];

export const restaurantMenus: Record<string, Dish[]> = {
  "1": [
    {
      id: "d1",
      name: "Hyderabadi Biryani",
      description: "Fragrant basmati rice with tender mutton, spices, and fried onions",
      price: 350,
      image: "🍛",
      category: "Biryani",
      isVeg: false,
      isAvailable: true,
      rating: 4.8,
    },
    {
      id: "d2",
      name: "Chicken Biryani",
      description: "Aromatic basmati rice cooked with chicken and special spices",
      price: 320,
      image: "🍛",
      category: "Biryani",
      isVeg: false,
      isAvailable: true,
      rating: 4.7,
    },
    {
      id: "d3",
      name: "Veg Biryani",
      description: "Delicious biryani with mixed vegetables and aromatic spices",
      price: 250,
      image: "🍛",
      category: "Biryani",
      isVeg: true,
      isAvailable: true,
      rating: 4.5,
    },
  ],
  "2": [
    {
      id: "d4",
      name: "Margherita Pizza",
      description: "Classic pizza with tomato, mozzarella, and fresh basil",
      price: 299,
      image: "🍕",
      category: "Pizza",
      isVeg: true,
      isAvailable: true,
      rating: 4.6,
    },
    {
      id: "d5",
      name: "Pepperoni Pizza",
      description: "Spicy pepperoni with mozzarella cheese",
      price: 399,
      image: "🍕",
      category: "Pizza",
      isVeg: false,
      isAvailable: true,
      rating: 4.8,
    },
    {
      id: "d6",
      name: "Veg Supreme Pizza",
      description: "Loaded with vegetables and cheese",
      price: 349,
      image: "🍕",
      category: "Pizza",
      isVeg: true,
      isAvailable: true,
      rating: 4.7,
    },
  ],
  "3": [
    {
      id: "d7",
      name: "Classic Burger",
      description: "Beef patty with lettuce, tomato, and special sauce",
      price: 199,
      image: "🍔",
      category: "Burgers",
      isVeg: false,
      isAvailable: true,
      rating: 4.5,
    },
    {
      id: "d8",
      name: "Veg Burger",
      description: "Crispy veg patty with fresh vegetables",
      price: 149,
      image: "🍔",
      category: "Burgers",
      isVeg: true,
      isAvailable: true,
      rating: 4.4,
    },
  ],
};

export const offers = [
  { id: "1", title: "50% OFF", subtitle: "Up to ₹100", code: "SAVE50", color: "from-red-500 to-pink-500" },
  { id: "2", title: "FREE DELIVERY", subtitle: "On orders above ₹200", code: "FREEDEL", color: "from-green-500 to-emerald-500" },
  { id: "3", title: "FLAT ₹50 OFF", subtitle: "On orders above ₹300", code: "FLAT50", color: "from-blue-500 to-cyan-500" },
];

