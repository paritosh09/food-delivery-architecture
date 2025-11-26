export interface User {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "ADMIN" | "RIDER";
}

export interface AuthResponse {
  token: string;
  role: User["role"];
  name: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: User["role"];
}

export interface Restaurant {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  rating?: number;
  deliveryTime?: string;
  priceForTwo?: string;
  isPromoted?: boolean;
  isVeg?: boolean;
  address?: string;
  discount?: string;
  cuisine: string[]; // Frontend helper, might need mapping from backend
}

export interface Category {
  id: string;
  name: string;
  imageUrl?: string;
  itemCount?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isAvailable: boolean;
  restaurantId?: string;
  categoryId?: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface DeliveryAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface PaymentMethod {
  type: "card" | "cash";
  cardNumber?: string;
  expiry?: string;
  cvv?: string;
}
