"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import useUserOrders, { Order } from "../../../hooks/useUserOrders";
import ReviewModal from "../ReviewModal";
import ProductListModal from "../ProductListModal";

const Orders = () => {
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  const { data: ordersData, isLoading, error } = useUserOrders();
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showProductListModal, setShowProductListModal] = useState(false);
  const [selectedOrderForProducts, setSelectedOrderForProducts] = useState<Order | null>(null);

  useEffect(() => {
    // Only redirect if user is definitely not signed in (not during loading state)
    if (isSignedIn === false) {
      router.push("/signin");
    }
  }, [isSignedIn, router]);

  const orders = ordersData?.orders || [];
  console.log(`response from orders ${JSON.stringify(orders)}`)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "text-green-600 bg-green-50";
      case "shipped":
        return "text-blue-600 bg-blue-50";
      case "processing":
        return "text-yellow-600 bg-yellow-50";
      case "pending":
        return "text-gray-600 bg-gray-50";
      case "cancelled":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleLeaveReview = (order: Order) => {
    // Store order data in localStorage for the review modal
    localStorage.setItem("reviewOrder", JSON.stringify(order));
    // Open the review modal instead of redirecting
    setShowReviewModal(true);
    setSelectedOrder(order);
  };

  const handleViewProduct = (order: Order) => {
    if (order.orderItems.length === 1) {
      // Single product - navigate directly
      router.push(`/shop-details?id=${order.orderItems[0]?.product?._id}`);
    } else {
      // Multiple products - show modal
      setSelectedOrderForProducts(order);
      setShowProductListModal(true);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Orders</h2>
          <p className="text-gray-600 mb-4">{error instanceof Error ? error.message : "An error occurred"}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="pb-20 pt-35 lg:pb-25 lg:pt-45 xl:pb-30 xl:pt-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Orders Yet</h2>
            <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
            <Link
              href="/shop-without-sidebar"
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors inline-block"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="mt-2 lg:mt-0">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 mb-4">
                  {order.orderItems.map((item) => (
                    <div key={item._id} className="flex items-center space-x-4">
                      <div className="relative">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="rounded-lg object-cover"
                        />
                        {item.quantity > 1 && (
                          <div className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                            {item.quantity}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-600">
                          ${item.price.toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="mb-4 sm:mb-0">
                      <p className="text-sm text-gray-600">
                        Total ({order.orderItems.reduce((sum, item) => sum + item.quantity, 0)} items)
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        ${order.totalPrice.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleViewProduct(order)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        View Product{order.orderItems.length > 1 ? 's' : ''}
                      </button>

                      {order.status === "delivered" && !order.hasReviewed && (
                        <button
                          onClick={() => handleLeaveReview(order)}
                          className="px-4 py-2 bg-orange text-white rounded-lg hover:bg-primary/90 transition-colors"
                        >
                          Leave Review
                        </button>
                      )}

                      {order.status === "delivered" && order.hasReviewed && (
                        <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg flex items-center">
                          ✓ Reviewed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => {
          setShowReviewModal(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
      />

      {/* Product List Modal */}
      <ProductListModal
        isOpen={showProductListModal}
        onClose={() => {
          setShowProductListModal(false);
          setSelectedOrderForProducts(null);
        }}
        order={selectedOrderForProducts}
      />
    </section>
  );
};

export default Orders;
