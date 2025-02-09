"use client";

import {Suspense, useEffect, useState} from "react";
import {useSearchParams} from "next/navigation";
import api from "@/api/api";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Separator} from "@/components/ui/separator";
import Loader from "@/components/Loader";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface PaymentDetails {
  tran_id: string;
  total_amount: number;
  currency: string;
  paymentStatus: string;
  paymentMethod: string;
  cardIssuer: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  createdAt: string;
  order: {
    totalPrice: number;
    status: string;
    createdAt: string;
  };
}

function PaymentContent() {
  const searchParams = useSearchParams();
  const [paymentData, setPaymentData] = useState<PaymentDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const tranId = searchParams.get("tran_id");
    if (!tranId) return;

    const fetchPaymentDetails = async () => {
      try {
        const response = await api.get(`/payment/details?tran_id=${tranId}`);
        setPaymentData(response.data.payment);
      } catch (error) {
        console.error("Error fetching payment details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [searchParams]);

  return (
      <div className="flex flex-col items-center justify-center m-4">
        <h1 className="text-3xl font-semibold text-green-600">
          Payment Successful 🎉
        </h1>
        <p className="text-gray-600 mt-2">
          Thank you for your payment. Your transaction was successful.
        </p>

        {loading ? (
            <div className="mt-6 flex items-center">
              <Loader />
            </div>
        ) : paymentData ? (
            <Card className="mt-6 w-full max-w-md shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800">
                  Transaction Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-gray-700">
                <div>
                  <strong>Transaction ID:</strong> {paymentData.tran_id}
                </div>
                <div>
                  <strong>Amount:</strong> {paymentData.total_amount}{" "}
                  {paymentData.currency}
                </div>
                <div>
                  <strong>Payment Status:</strong> {paymentData.paymentStatus}
                </div>
                <div>
                  <strong>Payment Method:</strong>{" "}
                  {paymentData.paymentMethod || "N/A"}
                </div>
                <div>
                  <strong>Card Issuer:</strong> {paymentData.cardIssuer}
                </div>
                <Separator />
                <div className="text-gray-900 font-semibold">Customer Details</div>
                <div>
                  <strong>Name:</strong> {paymentData.customerName}
                </div>
                <div>
                  <strong>Email:</strong> {paymentData.customerEmail}
                </div>
                <div>
                  <strong>Phone:</strong> {paymentData.customerPhone}
                </div>
                <Separator />
                <div>
                  <strong>Total Price:</strong> {paymentData.order.totalPrice}{" "}
                  {paymentData.currency}
                </div>
                <div>
                  <strong>Order Status:</strong> {paymentData.order.status}
                </div>
              </CardContent>
            </Card>
        ) : (
            <p className="mt-4 text-red-500">Failed to retrieve payment details.</p>
        )}
      </div>
  );
}

export default function PaymentSuccess() {
  return (
      <>
        <Navbar />
        <Suspense fallback={<Loader />}>
          <PaymentContent />
        </Suspense>
        <Footer />
      </>
  );
}
