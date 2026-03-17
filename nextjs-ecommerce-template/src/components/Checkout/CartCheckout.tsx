"use client";
import React, { useState, useEffect } from "react";
import AddressSelectionModal from "../Common/AddressSelectionModal";
import OrderSummary from "./OrderSummary";
import useCart from "../../../hooks/useCart";
import { useAddresses } from "../../../hooks/useAddresses";
import { useApi } from "@/lib/axios";

const CartCheckout = () => {
  const api = useApi();
  const {
    cart,
    isLoading,
    isError,
    cartTotal,
    cartItemCount,
    updateQuantity,
    removeFromCart,
    clearCart,
    isUpdating,
    isRemoving,
  } = useCart();

  const { addresses, isLoading: addressesLoading } = useAddresses();

  const [paymentLoading, setPaymentLoading] = useState(false);
  const [addressModalVisible, setAddressModalVisible] = useState(false);

  const cartItems = cart?.items || [];
  const subtotal = cartTotal;
  const shipping = 10.0; // $10 shipping fee
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    // Check if user has addresses
    if (!addresses || addresses.length === 0) {
      alert(
        "Please add a shipping address in your profile before checking out.",
      );
      return;
    }

    // Show address selection modal
    setAddressModalVisible(true);
  };

  const handleProceedWithPayment = async (selectedAddress: any) => {
    setAddressModalVisible(false);

    try {
      setPaymentLoading(true);

      // Simulate payment processing
      // await new Promise(resolve => setTimeout(resolve, 2000));
      const { data } = await api.post("/payment/create-flutterwave-intent", {
        cartItems,
        shippingAddress: {
          fullName: selectedAddress.fullName,
          streetAddress: selectedAddress.streetAddress,
          city: selectedAddress.city,
          state: selectedAddress.state,
          zipCode: selectedAddress.zipCode,
          phoneNumber: selectedAddress.phoneNumber,
        },
      });

      console.log(` data from flutter wave ${JSON.stringify(data)}`)
      const paymentLink = data.data.data.link;
      console.log(`the paymentLink value ${JSON.stringify(paymentLink)}`)
      window.location.href = paymentLink;
      console.log(
        `This is the output of the payment processing pathway ${JSON.stringify(data)}`,
      );
      alert("Payment successful! Your order is being processed.");
      // Clear cart logic here
    } catch (error) {
      console.error("Payment error:", error);
      alert("Failed to process payment");
    } finally {
      setPaymentLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-600">Add some products to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Cart
          </h1>
        </div>

        {/* Cart Items */}
        <div className="space-y-4 mb-8">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl shadow-sm overflow-hidden"
            >
              <div className="p-6 flex items-center">
                {/* Product Image */}
                <div className="relative">
                  <img
                    src={item.product.images?.[0] || "/placeholder-image.jpg"}
                    alt={item.product.name}
                    className="bg-gray-100 rounded-xl"
                    style={{ width: 112, height: 112, objectFit: "cover" }}
                  />
                  <div className="absolute top-2 right-2 bg-cyan-500 rounded-full px-2 py-0.5">
                    <span className="text-white bg-dark w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center">
                      ×{item.quantity}
                    </span>
                  </div>
                </div>

                <div className="flex-1 ml-6 flex justify-between items-center">
                  <div>
                    <h3 className="text-gray-900 font-bold text-lg leading-tight line-clamp-2">
                      {item.product.name}
                    </h3>
                    <div className="flex items-center mt-2">
                      <span className="text-cyan-500 font-bold text-2xl">
                        $
                        {(item.product.discountedPrice || item.product.price) *
                          item.quantity}
                      </span>
                      <span className="text-gray-500 text-sm ml-2">
                        ${item.product.discountedPrice || item.product.price}{" "}
                        each
                      </span>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-3">
                    <button
                      className="bg-gray-100 rounded-full w-9 h-9 flex items-center justify-center hover:bg-gray-200 transition-colors"
                      onClick={() => {
                        // Handle quantity decrease
                        if (item.quantity > 1) {
                          updateQuantity({
                            productId: item.product._id,
                            quantity: item.quantity - 1,
                          });
                        }
                      }}
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <span className="text-gray-600 text-lg">−</span>
                      )}
                    </button>

                    <div className="min-w-[32px] text-center">
                      <span className="text-gray-900 font-bold text-lg">
                        {item.quantity}
                      </span>
                    </div>

                    <button
                      className="bg-cyan-500 rounded-full w-9 h-9 flex items-center justify-center hover:bg-cyan-600 transition-colors"
                      onClick={() => {
                        // Handle quantity increase
                        updateQuantity({
                          productId: item.product._id,
                          quantity: item.quantity + 1,
                        });
                      }}
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <span className="text-gray-600 text-lg">+</span>
                      )}
                    </button>

                    <button
                      className="ml-4 bg-red-50 rounded-full w-9 h-9 flex items-center justify-center hover:bg-red-100 transition-colors"
                      onClick={() => {
                        // Handle item removal
                        removeFromCart(item.product._id);
                      }}
                      disabled={isRemoving}
                    >
                      <span className="text-red-500 text-lg">×</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <OrderSummary
          subtotal={subtotal}
          shipping={shipping}
          tax={tax}
          total={total}
        />

        {/* Checkout Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Quick Stats */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <span className="text-2xl mr-2">🛒</span>
                <span className="text-gray-600">
                  {cartItemCount} {cartItemCount === 1 ? "item" : "items"}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-900 font-bold text-xl">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <div className="w-full flex flex-col items-center justify-center">
              <button
                className="w-1/2 bg-dark text-white rounded-2xl py-5 font-bold text-lg hover:bg-cyan-600 transition-colors flex items-center justify-center"
                onClick={handleCheckout}
                disabled={paymentLoading}
              >
                {paymentLoading ? (
                  <div className="w-5 h-5 border-2  border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                ) : (
                  <>
                    <span className="bg-dark py-3 px-9 mr-3">Checkout</span>
                    <span className="text-white">→</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Add padding bottom to account for fixed checkout button */}
        <div className="h-32"></div>

        {/* Address Selection Modal */}
        <AddressSelectionModal
          isOpen={addressModalVisible}
          onClose={() => setAddressModalVisible(false)}
          onProceed={handleProceedWithPayment}
          addresses={addresses}
          isLoading={addressesLoading}
          isProcessing={paymentLoading}
        />
      </div>
    </div>
  );
};

export default CartCheckout;
