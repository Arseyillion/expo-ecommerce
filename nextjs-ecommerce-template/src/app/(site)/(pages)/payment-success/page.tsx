"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Breadcrumb from "@/components/Common/Breadcrumb";
import Link from "next/link";
import { useApi } from "@/lib/axios";
import useCart from "@/hooks/useCart";

const PaymentSuccess = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const api = useApi();

  const [paymentStatus, setPaymentStatus] = useState<
    "verifying" | "success" | "failed"
  >("verifying");
  const [verificationData, setVerificationData] = useState<any>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const transactionId = searchParams.get("transaction_id");
    const status = searchParams.get("status");
    const txRef = searchParams.get("tx_ref");
    console.log(`transactionId from flutter_wave: ${transactionId}`);
    console.log(`status from flutter_wave: ${status}`);

    console.log(`txRef from flutter_wave: ${txRef}`);

    if (status && status !== "completed") {
      setPaymentStatus("failed");
      setError(`Payment status: ${status}`);
      return;
    }

    if (transactionId || txRef) {
      verifyPayment(transactionId || txRef || "");
    } else {
      setPaymentStatus("failed");
      setError("No transaction ID found");
    }
  }, [searchParams]);

  const verifyPayment = async (transactionId: string) => {
    try {
      console.log("Verifying payment for transaction:", transactionId);

      const response = await api.get(`/payment/verify/${transactionId}`);
      console.log("Verification response:", response.data);

      if (response.data.data.status === "successful") {
        setPaymentStatus("success");
        setVerificationData(response.data.data);

        // Cart is automatically cleared by the backend after order creation
        // No need to manually clear it here

        // Redirect to orders page after 3 seconds
        setTimeout(() => {
          router.push("/orders");
        }, 3000);
      } else {
        setPaymentStatus("failed");
        setError("Payment was not successful");
      }
    } catch (error) {
      console.error("Verification failed:", error);
      setPaymentStatus("failed");
      setError("Failed to verify payment");
    }
  };

  const renderContent = () => {
    switch (paymentStatus) {
      case "verifying":
        return (
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="font-bold text-cyan-500 text-4xl lg:text-[45px] lg:leading-[57px] mb-5">
              Verifying Your Payment...
            </h2>
            <h3 className="font-medium text-gray-900 text-xl sm:text-2xl mb-3">
              Please wait while we confirm your payment
            </h3>
            <p className="max-w-[491px] w-full mx-auto mb-7.5 text-gray-600">
              We're securely verifying your transaction with Flutterwave. This
              usually takes just a few seconds.
            </p>
          </div>
        );

      case "success":
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="font-bold text-cyan-500 text-4xl lg:text-[45px] lg:leading-[57px] mb-5">
              Payment Successful!
            </h2>
            <h3 className="font-medium text-gray-900 text-xl sm:text-2xl mb-3">
              Your order has been confirmed
            </h3>

            {verificationData && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6 max-w-md mx-auto">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Transaction ID:</strong> {verificationData.id}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Amount:</strong> {verificationData.currency === "NGN" ? "₦" : "$"}
                  {verificationData.amount} {verificationData.currency}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Order Reference:</strong> {verificationData.tx_ref}
                </p>
              </div>
            )}

            <p className="max-w-[491px] w-full mx-auto mb-7.5 text-gray-600">
              Thank you for your order! You will be redirected to your orders
              page in a few seconds.
            </p>

            <div className="flex gap-4 justify-center">
              <Link
                href="/orders"
                className="inline-flex items-center gap-2 font-medium text-white bg-cyan-500 py-3 px-6 rounded-md ease-out duration-200 hover:bg-cyan-600"
              >
                View Orders
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 font-medium text-cyan-500 border border-cyan-500 py-3 px-6 rounded-md ease-out duration-200 hover:bg-cyan-50"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        );

      case "failed":
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="font-bold text-red-500 text-4xl lg:text-[45px] lg:leading-[57px] mb-5">
              Payment Failed
            </h2>
            <h3 className="font-medium text-gray-900 text-xl sm:text-2xl mb-3">
              We couldn't process your payment
            </h3>
            <p className="max-w-[491px] w-full mx-auto mb-7.5 text-gray-600">
              {error ||
                "There was an issue verifying your payment. Please try again or contact support if the problem persists."}
            </p>

            <div className="flex gap-4 justify-center">
              <Link
                href="/checkout"
                className="inline-flex items-center gap-2 font-medium text-white bg-cyan-500 py-3 px-6 rounded-md ease-out duration-200 hover:bg-cyan-600"
              >
                Try Again
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 font-medium text-gray-600 border border-gray-300 py-3 px-6 rounded-md ease-out duration-200 hover:bg-gray-50"
              >
                Back to Home
              </Link>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Breadcrumb title={"Payment Status"} pages={["Payment Status"]} />
      <section className="overflow-hidden py-20 bg-gray-50">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="bg-white rounded-xl shadow-sm px-4 py-10 sm:py-15 lg:py-20 xl:py-25">
            {renderContent()}
          </div>
        </div>
      </section>
    </>
  );
};

export default PaymentSuccess;
