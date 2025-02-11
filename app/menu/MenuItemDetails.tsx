"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { addToCart, order } from "@/api/cart";
import toast from "react-hot-toast";
import { MenuItem } from "@/types/types";
import { useCartStore } from "@/store/cart-store";

export default function MenuItemDetails({ menuItem }: { menuItem: MenuItem }) {
  const router = useRouter();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState("");
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const { isLoggedIn } = useAuthStore();
  const { checkAuth } = useAuthStore();
  const { initializeCart } = useCartStore();

  useEffect(() => {
    const setupCart = async () => {
      try {
        const authenticated = await checkAuth();
        if (authenticated) {
          await initializeCart();
        }
      } catch (err: any) {
        console.error("Failed to initialize cart", err);
      }
    };

    setupCart();
  }, [checkAuth, initializeCart]);

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      toast.error("Please login to add items to cart");
      router.push("/auth/signin");
      return;
    }

    if (quantity < 1) {
      toast.error("Please select a valid quantity");
      return;
    }

    if (!endDate) {
      toast.error("Please select an end date");
      return;
    }

    if (startDate && startDate > endDate) {
      toast.error("End date must be after start date");
      return;
    }

    if (!address.trim()) {
      toast.error("Please provide a valid address");
      return;
    }

    try {
      setIsAddingToCart(true);
      const response = await addToCart(menuItem.id, quantity);
      toast.success(response.data.message || "Item added to cart");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to add item to cart"
      );
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!isLoggedIn) {
      toast.error("Please login to place an order");
      router.push("/auth/signin");
      return;
    }

    if (quantity < 1) {
      toast.error("Please select a valid quantity");
      return;
    }

    if (!endDate) {
      toast.error("Please select an end date");
      return;
    }

    if (!address.trim()) {
      toast.error("Please provide a valid address");
      return;
    }

    if (startDate && startDate > endDate) {
      toast.error("End date must be after start date");
      return;
    }

    try {
      setIsPlacingOrder(true);
      const orderItem = [{ menuItemId: menuItem.id, quantity }];

      const response = await order(orderItem);
      toast.success(response.data?.message || "Order placed successfully!");
      router.push("/orders");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setQuantity(value);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="border-t border-primary mb-6" />
        <div className="mb-6 relative h-96">
          <Image
            src={`/images/${menuItem.image}`}
            alt={menuItem.name}
            fill
            className="object-stretch rounded-lg"
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-primary">{menuItem.name}</h2>
          <p className="text-muted">{menuItem.description}</p>
          <p className="text-xl font-semibold text-primary">
            Price: ${menuItem.price}
          </p>
          <p className="text-muted">Category: {menuItem.category}</p>
          <p
            className={cn(
              "font-semibold",
              menuItem.available ? "text-green-600" : "text-red-600"
            )}
          >
            {menuItem.available ? "Available" : "Not Available"}
          </p>
        </div>

        {/* Order Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-2xl font-bold text-primary mb-4">
            Make an Order
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                  aria-label="Select Start Date"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? (
                    format(startDate, "PPP")
                  ) : (
                    <span>Start Date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                  aria-label="Select End Date"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span>End Date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="quantity" className="text-muted">
                Quantity
              </Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
                className="hover:outline-primary"
              />
            </div>

            <div>
              <Label htmlFor="address" className="text-muted">
                Address
              </Label>
              <Input
                id="address"
                placeholder="Enter your address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="hover:outline-primary"
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                onClick={handleAddToCart}
                disabled={isAddingToCart || !menuItem.available}
                className="hover:outline-primary"
              >
                {isAddingToCart ? "Adding to cart..." : "Add to cart"}
              </Button>
              <Button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder || !menuItem.available}
                className="hover:outline-primary"
              >
                {isPlacingOrder ? "Placing Order..." : "Place Order"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
