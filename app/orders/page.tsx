"use client";

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import Image from "next/image";
import {useAuthStore} from "@/store/auth-store";
import api from "@/api/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {Card, CardContent} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {toast} from "react-hot-toast";
import {Order} from "@/types/types";
import Loader from "@/components/Loader";
import Link from "next/link";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { isLoggedIn, checkAuth } = useAuthStore();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const isAuthenticated = await checkAuth();
        if (!isAuthenticated) {
          router.push("/auth/signin");
          return;
        }

        const response = await api.get("/order");
        setOrders(response.data);
      } catch (err: any) {
        console.log(err.response?.data?.message || "Failed to fetch orders");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [checkAuth, router]);

  const handleCancelOrder = async (orderId: number) => {
    try {
      await api.patch(`/order/cancel`, { orderId });
      setOrders((prevOrders) =>
          prevOrders.map((order) =>
              order.id === orderId ? { ...order, status: "cancelled" } : order
          )
      );
      toast.success("Order cancelled successfully");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to cancel order");
    }
  };

  const handlePayOrder = async (orderId: number) => {
    try {
      const response = await api.post("/payment/init", { orderId });
      if (response.data.GatewayPageURL) {
        window.location.href = response.data.GatewayPageURL;
      } else {
        toast.error("Payment gateway URL not found");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to initiate payment");
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <>
      <Navbar />
      <main className="container mx-auto p-6 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-primary">My Orders</h1>

        {isLoading ? (
          <Loader />
        ) : orders.length === 0 ? (
          <p className="text-center text-muted-foreground mt-6">
            No orders found.{" "}
            <Link href="/home" className="text-primary underline">
              Go to Home
            </Link>
          </p>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => (
              <Card key={order.id}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <p className="text-muted-foreground">
                        Order #{index + 1}
                      </p>
                      <Badge
                        className={
                          order.status === "cancelled"
                            ? "bg-red-500 hover:bg-red-500"
                            : order.status === "active"
                            ? "bg-green-500 hover:bg-green-500"
                            : "default"
                        }
                      >
                        {order.status}
                      </Badge>
                    </div>
                    <div className="border-t pt-4">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center space-x-4 mb-4"
                        >
                          <div className="h-24 w-24 relative">
                            <Image
                              src={`/images/${item.menuItem.image}`}
                              alt={item.menuItem.name}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">
                              {item.menuItem.name}
                            </h3>
                            <p className="text-muted-foreground">
                              $ {item.menuItem.price} x {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              $ {item.totalPrice.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center border-t pt-4">
                      <p className="text-muted-foreground">
                        Ordered on{" "}
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p className="font-semibold">
                        Total: $ {order.totalPrice.toFixed(2)}
                      </p>
                    </div>
                    {order.status !== "cancelled" &&
                       (
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="destructive"
                            onClick={() => handleCancelOrder(order.id)}
                            disabled={order.status === "cancelled"}
                          >
                            Cancel Order
                          </Button>
                          <Button
                            onClick={() => handlePayOrder(order.id)}
                            disabled={order.status === "active"}
                          >
                            Pay Now
                          </Button>
                        </div>
                      )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}