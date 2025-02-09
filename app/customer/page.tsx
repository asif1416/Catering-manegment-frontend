"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import api from "@/api/api";
import { FaEdit } from "react-icons/fa";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const CustomerPage = () => {
  const router = useRouter();
  const { isLoggedIn, login, logout } = useAuthStore();
  const [customer, setCustomer] = useState({
    id: "",
    name: "",
    email: "",
    address: "",
    phone: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get("/auth/validate");
        if (response) {
          login();
        } else {
          logout();
          router.push("/auth/signin");
        }
      } catch (error) {
        logout();
        console.log("Failed to validate user", error);
        router.push("/auth/signin");
      }
    };

    const fetchCustomerDetails = async () => {
      try {
        const response = await api.get("/customer");
        const data = response.data;
        setCustomer(data);
        setFormData({
          name: data.name,
          address: data.address || "",
          phone: data.phone || "",
        });
      } catch (err) {
        console.error("Failed to fetch customer data", err);
      }
    };

    checkAuth().then(r => r);
    fetchCustomerDetails().then(r => r);
  }, [login, logout, router]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveClick = async () => {
    try {
      const response = await api.patch(`/customer/${customer.id}`, {
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
      });
      if (response.status === 200) {
        setCustomer({ ...customer, ...formData });
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Failed to update customer data", err);
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
      <>
        <Navbar />
        <main className="container mx-auto p-6 mb-5">
          <h1 className="text-3xl font-bold mb-6 text-primary">Customer Information</h1>
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Profile</span>
                <Button variant="ghost" className="hover:text-primary" size="sm" onClick={handleEditClick}>
                  <FaEdit className="mr-2" />
                  Edit
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-6">
                <Avatar className="h-16 w-16 mr-4">
                  <AvatarImage src="https://i.pravatar.cc/150?u=a04258a2462d826712d" alt="Customer Avatar" />
                  <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold">{customer.name}</h2>
                  <p className="text-muted-foreground">{customer.email}</p>
                </div>
              </div>
              <div className="space-y-4">
                {isEditing ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address" >Address:</Label>
                        <Input
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                        />
                      </div>
                      <div className="flex justify-end space-x-4 mt-4">
                        <Button variant="outline" onClick={handleCancelClick}>
                          Cancel
                        </Button>
                        <Button onClick={handleSaveClick}>
                          Save
                        </Button>
                      </div>
                    </>
                ) : (
                    <>
                      <div>
                        <Label className="text-xl">Address:</Label>
                        <p className="text-muted-foreground">{customer.address || "Not provided"}</p>
                      </div>
                      <div>
                        <Label className="text-xl">Phone:</Label>
                        <p className="text-muted-foreground">{customer.phone || "Not provided"}</p>
                      </div>
                    </>
                )}
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </>
  );
};

export default CustomerPage;

