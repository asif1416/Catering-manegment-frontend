import api from "@/api/api";
import { create } from "zustand";

interface AuthState {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  checkAuth: () => Promise<boolean>; 
}

const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  login: () => set({ isLoggedIn: true }),
  logout: () => set({ isLoggedIn: false }),
checkAuth: async () => {
  try {
    const response = await api.get("/auth/validate");
    if (response) {
      set({ isLoggedIn: true });
      return true;
    }
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      console.log("User not authenticated");
    } else {
      console.log("Auth check failed:", error);
    }
    set({ isLoggedIn: false });
    return false;
  }
  set({ isLoggedIn: false });
  return false;
},

}));

export { useAuthStore };
