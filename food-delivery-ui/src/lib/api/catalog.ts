import { api } from "./axios";
import { Restaurant, Category } from "@/types";

export const catalogApi = {
    getRestaurants: async (): Promise<Restaurant[]> => {
        const response = await api.get<Restaurant[]>("/restaurants");
        return response.data;
    },

    getRestaurantById: async (id: string): Promise<Restaurant> => {
        const response = await api.get<Restaurant>(`/restaurants/${id}`);
        return response.data;
    },

    getCategories: async (): Promise<Category[]> => {
        const response = await api.get<Category[]>("/categories");
        return response.data;
    },
};
