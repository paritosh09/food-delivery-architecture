export interface Category {
    id: string;
    name: string;
    image: string;
    count: string;
}

export interface Restaurant {
    id: string;
    name: string;
    cuisine: string[];
    rating: number;
    deliveryTime: string;
    priceForTwo: string;
    discount?: string;
    image: string;
    isPromoted?: boolean;
    isVeg?: boolean;
}

export const categories: Category[] = [
    {
        id: "1",
        name: "Biryani",
        image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500&auto=format&fit=crop&q=60",
        count: "25+ options",
    },
    {
        id: "2",
        name: "Burger",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60",
        count: "18+ options",
    },
    {
        id: "3",
        name: "Pizza",
        image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500&auto=format&fit=crop&q=60",
        count: "30+ options",
    },
    {
        id: "4",
        name: "Sushi",
        image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&auto=format&fit=crop&q=60",
        count: "12+ options",
    },
    {
        id: "5",
        name: "Chinese",
        image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=500&auto=format&fit=crop&q=60",
        count: "40+ options",
    },
    {
        id: "6",
        name: "Healthy",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60",
        count: "15+ options",
    },
    {
        id: "7",
        name: "Dessert",
        image: "https://images.unsplash.com/photo-1563729768-7491131ba718?w=500&auto=format&fit=crop&q=60",
        count: "20+ options",
    },
    {
        id: "8",
        name: "Rolls",
        image: "https://images.unsplash.com/photo-1536521642388-441263f88a61?w=500&auto=format&fit=crop&q=60",
        count: "22+ options",
    },
];

export const restaurants: Restaurant[] = [
    {
        id: "1",
        name: "La Pino'z Pizza",
        cuisine: ["Italian", "Pizza", "Fast Food"],
        rating: 4.2,
        deliveryTime: "30-35 mins",
        priceForTwo: "$30",
        discount: "50% OFF up to $5",
        image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&auto=format&fit=crop&q=60",
        isPromoted: true,
    },
    {
        id: "2",
        name: "Burger King",
        cuisine: ["American", "Burgers"],
        rating: 4.1,
        deliveryTime: "25-30 mins",
        priceForTwo: "$25",
        discount: "Free Whopper on orders > $15",
        image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&auto=format&fit=crop&q=60",
    },
    {
        id: "3",
        name: "Sushi Master",
        cuisine: ["Japanese", "Sushi", "Asian"],
        rating: 4.8,
        deliveryTime: "40-45 mins",
        priceForTwo: "$50",
        image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=60",
        isPromoted: true,
    },
    {
        id: "4",
        name: "Green Bowl",
        cuisine: ["Healthy", "Salads", "Organic"],
        rating: 4.5,
        deliveryTime: "20-25 mins",
        priceForTwo: "$35",
        discount: "20% OFF",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=60",
        isVeg: true,
    },
    {
        id: "5",
        name: "Tandoori Nights",
        cuisine: ["Indian", "North Indian", "Curry"],
        rating: 4.3,
        deliveryTime: "35-40 mins",
        priceForTwo: "$40",
        discount: "Flat $4 OFF",
        image: "https://images.unsplash.com/photo-1585937421612-70a008356f36?w=800&auto=format&fit=crop&q=60",
    },
    {
        id: "6",
        name: "Wok & Roll",
        cuisine: ["Chinese", "Asian", "Thai"],
        rating: 4.0,
        deliveryTime: "30-35 mins",
        priceForTwo: "$28",
        image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&auto=format&fit=crop&q=60",
    },
    {
        id: "7",
        name: "Dessert Heaven",
        cuisine: ["Desserts", "Bakery", "Ice Cream"],
        rating: 4.6,
        deliveryTime: "15-20 mins",
        priceForTwo: "$15",
        discount: "10% OFF",
        image: "https://images.unsplash.com/photo-1563729768-7491131ba718?w=800&auto=format&fit=crop&q=60",
        isVeg: true,
    },
    {
        id: "8",
        name: "Taco Bell",
        cuisine: ["Mexican", "Tacos", "Fast Food"],
        rating: 3.9,
        deliveryTime: "25-30 mins",
        priceForTwo: "$20",
        image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=60",
    },
];
