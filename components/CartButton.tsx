"use client";

import {usePathname, useRouter} from "next/navigation";
import {FaCartPlus} from "react-icons/fa";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {useCartStore} from "@/store/cart-store";
import {useEffect} from "react";
import {useAuthStore} from "@/store/auth-store";

export default function CartButton() {
  const router = useRouter();
  const pathname = usePathname();
  const hideCartRoutes = ["/auth/signin", "/auth/signup", "/cart"];
  const shouldHideCart = hideCartRoutes.includes(pathname);
  const { initializeCart } = useCartStore();
  const { checkAuth } = useAuthStore();

  const items = useCartStore((state) => state.items);

  const itemCount = items.length;

  const handleCartClick = () => {
    router.push("/cart");
  };

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const authenticated = await checkAuth();
        if (authenticated) {
          await initializeCart();
        }
      } catch (err: any) {
        console.error("Failed to initialize cart", err);
      }
    };

    initializeApp();
  }, [checkAuth, initializeCart]);

  if (shouldHideCart) {
    return null;
  }

  return (
      <Button
          variant="default"
          size="icon"
          className="fixed bottom-5 right-5 rounded-full p-3 shadow-lg"
          onClick={handleCartClick}
      >
        <Badge variant="destructive" className="absolute -top-2 -right-2">
          {itemCount}
        </Badge>
        <FaCartPlus className="h-6 w-6" />
        <span className="sr-only">Open cart</span>
      </Button>
  );
}