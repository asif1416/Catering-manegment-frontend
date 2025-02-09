import api from "@/api/api";
import { MenuItem } from "@/types/types";

export async function fetchMenuItem(id: string): Promise<MenuItem> {
  try {
    const response = await api.get(`/menu/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch menu item:", error);
    throw new Error("Failed to fetch menu item");
  }
}
