import {fetchCartItems} from "@/api/cart";
import {create} from "zustand";

export interface CartItem {
    id: number;
    menuId: number;
    name: string;
    price: number;
    quantity: number;
    image?: string;
}

interface CartStore {
    items: CartItem[];
    selectedItems: Set<number>;
    setItems: (items: CartItem[]) => void;
    initializeCart: () => Promise<void>;
    addToCart: (item: CartItem) => void;
    removeFromCart: (itemId: number) => void;
    updateQuantity: (itemId: number, quantity: number) => void;
    toggleItemSelection: (itemId: number) => void;
    toggleAllSelection: (selected: boolean) => void;
    clearCart: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
    items: [],
    selectedItems: new Set(),

    setItems: (items) =>
        set(() => {
            const uniqueItems = Array.from(
                new Map(items.map((item) => [item.id, item])).values()
            );
            return {
                items: uniqueItems,
                count: uniqueItems.length,
            };
        }),


    initializeCart: async () => {
        try {
            const cartItems = await fetchCartItems();
            console.log("Fetched Cart Items:", cartItems); // Log fetched items
            const formattedItems = cartItems.map((item: any) => ({
                id: item.id,
                menuId: item.menu.id,
                name: item.menu.name,
                price: item.menu.price,
                quantity: item.quantity,
                image: item.menu.image,
            }));
            set({ items: formattedItems });
            console.log("Formatted Cart Items:", formattedItems); // Log formatted items
        } catch (error) {
            console.error("Failed to initialize cart:", error);
        }
    },

    addToCart: (item) =>
        set((state) => {
            const existingItem = state.items.find((i) => i.id === item.id);
            let updatedItems;
            if (existingItem) {
                updatedItems = state.items.map((i) =>
                    i.id === item.id ? {...i, quantity: item.quantity} : i
                );
            } else {
                updatedItems = [...state.items, item];
            }
            return {
                items: updatedItems,
                count: updatedItems.reduce((sum, i) => sum + i.quantity, 0),
            };
        }),


    removeFromCart: (itemId) =>
        set((state) => {
            const updatedItems = state.items.filter((item) => item.id !== itemId);
            return {
                items: updatedItems,
                count: updatedItems.reduce((sum, i) => sum + i.quantity, 0),
                selectedItems: new Set(
                    Array.from(state.selectedItems).filter((id) => id !== itemId)
                ),
            };
        }),

    updateQuantity: (itemId, quantity) =>
        set((state) => {
            const updatedItems = state.items.map((item) =>
                item.id === itemId ? {...item, quantity} : item
            );
            return {
                items: updatedItems,
                count: updatedItems.reduce((sum, i) => sum + i.quantity, 0),
            };
        }),

    toggleItemSelection: (itemId) =>
        set((state) => {
            const newSelected = new Set(state.selectedItems);
            if (newSelected.has(itemId)) {
                newSelected.delete(itemId);
            } else {
                newSelected.add(itemId);
            }
            return {selectedItems: newSelected};
        }),

    toggleAllSelection: (selected) =>
        set((state) => ({
            selectedItems: selected
                ? new Set(state.items.map((item) => item.id))
                : new Set(),
        })),

    clearCart: () => set({items: [], selectedItems: new Set()}),
}));
