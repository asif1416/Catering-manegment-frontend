import api from "@/api/api";

// add to cart
export const addToCart = async (menuId: number, quantity: number) => {
  try {
    const response = await api.post("/cart/add", { menuId, quantity });
    return response; 
  } catch (error) {
    console.error("Failed to add item to cart:", error);
    throw new Error("Failed to add item to cart");
  }
};

// fetch cart items
export const fetchCartItems = async () => {
  try {
    const response = await api.get("/cart");
    return response.data.cart?.items || [];
  } catch (error) {
    console.error("Failed to fetch cart:", error);
  }
};

// update cart items
export const updateCartQuantity = async (menuId: number, quantity: number) => {
  try {
    await api.patch("/cart/update", {
      menuId,
      quantity,
    });
  } catch (error) {
    console.error("Failed to update quantity:", error);
    throw new Error("Failed to update cart");
  }
};

// remove cart items
export const removeCartItem = async (cartItemId: number) => {
  try {
    await api.delete("/cart/remove", {
      data: { cartItemId },
    });
  } catch (error) {
    console.error("Failed to remove item:", error);
    throw new Error("Failed to remove item from cart");
  }
};

// clear cart
export const clearCart = async () => {
  try {
    await api.delete("/cart/clear");
  } catch (error) {
    console.error("Failed to clear cart:", error);
    throw new Error("Failed to clear cart");
  }
};

// place order
export const order = async (
  orderItems: { menuItemId: number; quantity: number }[]
) => {
  try {
      const response = await api.post("/order", {
      items: orderItems, 
    });

    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to place order");
  }
};
