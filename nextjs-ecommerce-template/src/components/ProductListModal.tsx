"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Order } from "../../hooks/useUserOrders";
import Link from "next/link";

interface ProductListModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

const ProductListModal = ({ isOpen, onClose, order }: ProductListModalProps) => {
  const router = useRouter();
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  if (!isOpen || !order) return null;

  const handleViewProduct = (productId: string | undefined) => {
    if (!productId) {
      console.warn('Product ID is missing, cannot navigate');
      return;
    }
    onClose();
    router.push(`/shop-details?id=${productId}`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Products in Order</h2>
              <p className="text-sm text-gray-600 mt-1">
                Order #{order._id.slice(-8)} • {order.orderItems.length} item{order.orderItems.length > 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4 ">
            {order.orderItems.map((item, index) => {
              return (
                <Link key={item._id} href={`/shop-details?id=${item.product?._id}`} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-start space-x-4">
                    <Image
                      src={failedImages.has(item._id) ? "/images/users/user-01.jpg" : (item.product?.imgs?.previews?.[0] || item.image || "/images/users/user-01.jpg")}
                      alt={item.product?.title || item.name || "Product"}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover"
                      onError={() => {
                        setFailedImages(prev => new Set(prev).add(item._id));
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {item.product?.title || item.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        ${(item.product?.price || item.price).toFixed(2)} × {item.quantity}
                      </p>
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium text-gray-900">
                          Total: ${((item.product?.price || item.price) * item.quantity).toFixed(2)}
                        </p>
                        <button
                          onClick={() => item.product?._id && handleViewProduct(item.product._id)}
                          disabled={!item.product?._id}
                          className={`px-3 py-1 text-sm rounded transition-colors ${
                            item.product?._id
                              ? 'bg-primary text-white hover:bg-primary/90'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Order Total:</span>
              <span className="text-lg font-bold text-primary">${order.totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListModal;
