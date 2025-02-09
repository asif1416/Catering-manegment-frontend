import api from "@/api/api";

// Fetch menu data
export const fetchMenuData = async () => {
  try {
    const response = await api.get("/menu");
    return response.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Failed to fetch menu data");
  }
};

// Search menu items
export const searchMenuItems = async (searchTerm: string) => {
  try {
    const response = await api.get(`/menu/search?name=${searchTerm}`);
    return response.data;
  } catch (err: any) {
    throw new Error(
      err.response?.data?.message || "Error searching menu items"
    );
  }
};

export default api;
