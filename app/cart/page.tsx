"use client";

import React, {useEffect, useState} from "react";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {useAuthStore} from "@/store/auth-store";
import {useCartStore} from "@/store/cart-store";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import {Card, CardContent} from "@/components/ui/card";
import {CheckCircle, Minus, Plus, Trash2} from "lucide-react";
import {clearCart, fetchCartItems, order, removeCartItem, updateCartQuantity,} from "@/api/cart";
import toast from "react-hot-toast";
import CustomModal from "@/components/CustomModal";
import {Separator} from "@/components/ui/separator";
import Loader from "@/components/Loader";

export default function CartPage() {
    const router = useRouter();
    const {isLoggedIn, checkAuth} = useAuthStore();
    const {
        items,
        selectedItems,
        setItems,
        updateQuantity,
        toggleItemSelection,
        toggleAllSelection,
    } = useCartStore();
    const [loading, setLoading] = useState(true);
    const [isAllSelected, setIsAllSelected] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [orderDetails, setOrderDetails] = useState<any>({items: []});

    useEffect(() => {
        const initializeCart = async () => {
            setLoading(true);
            const isAuth = await checkAuth();
            if (isAuth) {
                try {
                    const cartItems = await fetchCartItems();
                    console.log("Fetched Cart Items:", cartItems);
                    const formattedItems = cartItems.map((item: any) => ({
                        id: item.id,
                        menuId: item.menu.id,
                        name: item.menu.name,
                        price: item.menu.price,
                        quantity: item.quantity,
                        image: item.menu.image,
                    }));
                    setItems(formattedItems);
                } catch (error: any) {
                    toast.error(error.message);
                }
            }
            setLoading(false);
        };

        initializeCart();
    }, [checkAuth, setItems]);


    const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
        if (newQuantity < 1) return;
        try {
            await updateCartQuantity(itemId, newQuantity);
            updateQuantity(itemId, newQuantity);
            toast.success("Cart updated successfully");
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleRemoveItem = async (cartItemId: number) => {
        try {
            await removeCartItem(cartItemId);
            setItems(items.filter(item => item.id !== cartItemId));
            toast.success("Item removed successfully");
        } catch (error: any) {
            toast.error(error.message);
        }
    };


    const handleDeleteSelected = async () => {
        try {
            await clearCart();
            setItems(items.filter(item => !selectedItems.has(item.id)));
            toast.success("Selected items removed successfully");
        } catch (error: any) {
            toast.error(error.message);
        }
    };


    const handlePlaceOrder = async () => {
        setLoading(true);
        try {
            const selectedCartItems = items.filter((item) =>
                selectedItems.has(item.id)
            );
            const orderItems = selectedCartItems.map((item) => ({
                menuItemId: item.menuId,
                quantity: item.quantity,
            }));

            const response = await order(orderItems);

            if (!response || !response.data || !response.data.order) {
                throw new Error("Failed to place order or invalid response");
            }

            setOrderDetails(response.data.order);
            setIsModalOpen(true);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };


    const shippingFee = 0;
    //const total = subtotal + shippingFee;

    if (!isLoggedIn && !loading) {
        return (
            <>
                <Navbar/>
                <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
                    <Card className="w-full max-w-md mx-4">
                        <CardContent className="pt-6">
                            <p className="text-center mb-4">
                                Please log in to view your cart.
                            </p>
                            <Button
                                className="w-full"
                                onClick={() => router.push("/auth/signin")}
                            >
                                Sign In
                            </Button>
                        </CardContent>
                    </Card>
                </div>
                <Footer/>
            </>
        );
    }

    if (loading) {
        return (
            <>
                <Navbar/>
                <Loader/>
                <Footer/>
            </>
        );
    }

    return (
        <>
            <Navbar/>
            <main className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-2/3">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    checked={
                                        selectedItems.size === items.length && items.length > 0
                                    }
                                    onCheckedChange={(checked) => {
                                        toggleAllSelection(checked as boolean);
                                        setIsAllSelected(checked as boolean);
                                    }}
                                    id="select-all"
                                />
                                <label
                                    htmlFor="select-all"
                                    className="text-sm font-medium leading-none"
                                >
                                    SELECT ALL ({items.length} ITEM(S))
                                </label>
                            </div>
                            {isAllSelected && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleDeleteSelected}
                                    className="text-red-500 hover:text-red-600"
                                >
                                    <Trash2 className="h-4 w-4 mr-2"/>
                                    DELETE
                                </Button>
                            )}
                        </div>

                        {items.length === 0 ? (
                            <Card>
                                <CardContent className="pt-6">
                                    <p className="text-center mb-4">Your cart is empty.</p>
                                    <Button
                                        className="w-full"
                                        onClick={() => router.push("/home")}
                                    >
                                        Browse Menu
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {items.map((item) => (
                                    <Card key={item.id}>
                                        <CardContent className="p-4">
                                            <div className="mt-4 flex gap-4">
                                                <Checkbox
                                                    checked={selectedItems.has(item.id)}
                                                    onCheckedChange={() => toggleItemSelection(item.id)}
                                                />
                                                <Image
                                                    src={`/images/${item.image}`}
                                                    alt={item.name}
                                                    width={80}
                                                    height={80}
                                                    className="rounded-md"
                                                />
                                                <div className="flex-1">
                                                    <h3 className="font-medium">{item.name}</h3>
                                                    <div className="mt-2">
                                                        <p className="text-sm text-muted-foreground">
                                                            Price: ${item.price}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            size="icon"
                                                            variant="outline"
                                                            onClick={() =>
                                                                handleUpdateQuantity(item.id, item.quantity - 1)
                                                            }
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            <Minus className="h-4 w-4"/>
                                                        </Button>
                                                        <span className="w-8 text-center">
                              {item.quantity}
                            </span>
                                                        <Button
                                                            size="icon"
                                                            variant="outline"
                                                            onClick={() =>
                                                                handleUpdateQuantity(item.id, item.quantity + 1)
                                                            }
                                                        >
                                                            <Plus className="h-4 w-4"/>
                                                        </Button>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="text-red-500 hover:text-red-600"
                                                            onClick={() => handleRemoveItem(item.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4"/>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="lg:w-1/3">
                        <Card>
                            <CardContent className="p-6">
                                <h2 className="font-medium mb-4">Order Summary</h2>
                                <div className="space-y-4">
                                    {Array.from(selectedItems).map((itemId) => {
                                        const item = items.find((item) => item.id === itemId);
                                        if (!item) return null;

                                        return (
                                            <div key={item.id}
                                                 className="flex justify-between text-sm text-muted-foreground">
                        <span>
                          {item.name} (x{item.quantity})
                        </span>
                                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        );
                                    })}
                                    <Separator/>
                                    <div className="flex justify-between text-sm">
                                        <span>Subtotal ({selectedItems.size} items)</span>
                                        <span>
                      $
                                            {Array.from(selectedItems)
                                                .reduce((sum, itemId) => {
                                                    const item = items.find((item) => item.id === itemId);
                                                    return sum + (item ? item.price * item.quantity : 0);
                                                }, 0)
                                                .toFixed(2)}
                    </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Shipping Fee</span>
                                        <span>${shippingFee.toFixed(2)}</span>
                                    </div>
                                    <Separator/>
                                    <div className="flex justify-between font-medium">
                                        <span>Total</span>
                                        <span className="text-primary">
                      $
                                            {Array.from(selectedItems)
                                                .reduce((sum, itemId) => {
                                                    const item = items.find((item) => item.id === itemId);
                                                    return sum + (item ? item.price * item.quantity : 0);
                                                }, shippingFee)
                                                .toFixed(2)}
                    </span>
                                    </div>
                                    <Button
                                        className="w-full"
                                        disabled={selectedItems.size === 0}
                                        onClick={handlePlaceOrder}
                                    >
                                        PLACE ORDER ({selectedItems.size})
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
            <Footer/>

            <CustomModal
                title="Order Successful"
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            >
                <div className="space-y-4">
                    <div className="flex justify-center">
                        <CheckCircle className="h-12 w-12 text-primary"/>
                    </div>

                    <p className="text-lg font-semibold text-primary text-center">
                        Your order has been placed successfully!
                    </p>

                    {/* Order Details */}
                    <div className="bg-white p-4 rounded-lg">
                        <h3 className="font-medium text-lg mb-4">Order Details</h3>
                        {orderDetails &&
                        orderDetails.items &&
                        orderDetails.items.length > 0 ? (
                            <ul className="space-y-3">
                                {orderDetails.items.map((item: any) => (
                                    <li
                                        key={item.id}
                                        className="flex justify-between items-center bg-neutral-100 p-3 rounded-lg shadow-sm"
                                    >
                                        <div className="flex items-center gap-3">
                      <span className="text-muted font-medium">
                        {item.menuItem.name}
                      </span>
                                            <span className="text-sm text-gray-500">
                        (x{item.quantity})
                      </span>
                                        </div>
                                        <span className="text-muted font-semibold">
                      ${item.menuItem.price}
                    </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-muted">No order details available.</p>
                        )}
                    </div>

                    {/* Total Price */}
                    {orderDetails && (
                        <div className="bg-white p-4 rounded-lg">
                            <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-700">
                  Total Price:
                </span>
                                <span className="text-xl font-semibold text-primary">
                  ${orderDetails.totalPrice}
                </span>
                            </div>
                        </div>
                    )}

                    <Button
                        className="w-full mt-6 bg-primary text-white"
                        onClick={() => {
                            setIsModalOpen(false);
                            router.push("/orders");
                        }}
                    >
                        View My Orders
                    </Button>
                </div>
            </CustomModal>
        </>
    );
}
