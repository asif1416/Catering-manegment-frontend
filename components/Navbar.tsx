"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";
import api from "@/api/api";
import logo from "@/public/images/CulinaryOdyssey.jpg";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

const Navbar = () => {
  const { logout, isLoggedIn, checkAuth } = useAuthStore();
  const router = useRouter();
  const [customer, setCustomer] = useState<{
    name: string;
    image?: string;
  } | null>(null);

  const handleSignIn = () => {
    router.push("/auth/signin");
  };

  const handleLogout = async () => {
    try {
      await api.get("/auth/logout");
      logout();
    } catch {
      console.log("Failed to logout");
    } finally {
      router.push("/auth/signin");
    }
  };

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const isAuthenticated = await checkAuth();
        if (isAuthenticated) {
          const response = await api.get("/customer/");
          setCustomer(response.data);
        } else {
          setCustomer(null);
        }
      } catch (err: any) {
        console.error("Failed to fetch customer data:", err);
      }
    };

    fetchCustomerData();
  }, [checkAuth]);


  return (
    <header className="p-5">
      <div className="container bg-white mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/home" className="flex items-center space-x-2">
          <Image
            alt="Culinary Odyssey logo"
            className="rounded-full"
            src={logo || "/placeholder.svg"}
            width={40}
            height={40}
          />
          <span className="text-xl font-semibold">
            <span className="text-primary text-3xl">Culinary Odyssey</span>
          </span>
        </Link>

        <NavigationMenu>
          <NavigationMenuList className="gap-3">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/home"
                  className="font-bold text-muted-foreground transition-colors hover:text-primary"
                >
                  Home
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/contact"
                  className="font-bold text-muted-foreground transition-colors hover:text-primary"
                >
                  Contact Us
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/orders"
                  className="font-bold text-muted-foreground transition-colors hover:text-primary"
                >
                  Orders
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              {isLoggedIn ? (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/customer"
                    className="flex items-center space-x-2"
                  >
                    <Avatar>
                      <AvatarImage
                        src={
                          customer?.image ||
                          "https://i.pravatar.cc/150?u=a04258a2462d826712d"
                        }
                        alt="Customer Avatar"
                      />
                      <AvatarFallback>
                        {customer?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-primary">
                      {customer?.name}
                    </span>
                  </Link>
                  <Button onClick={handleLogout}>Logout</Button>
                </div>
              ) : (
                <Button onClick={handleSignIn}>Sign in</Button>
              )}
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
};

export default Navbar;
