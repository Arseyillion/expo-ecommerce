"use client";

import React, { useState, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useReviews } from "../../hooks/useReviews";
import Image from "next/image";
import useUserOrders, { Order } from "../../hooks/useUserOrders";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

const ReviewModal = ({ isOpen, onClose, order }: ReviewModalProps) => {
  const { user } = useUser();
  const { createReviewAsync, isCreatingReview } = useReviews();
  const [ratings, setRatings] = useState<{ [key: string]: number }>({});
  const [titles, setTitles] = useState<{ [key: string]: string }>({});
  const [comments, setComments] = useState<{ [key: string]: string }>({});
  const prevIsOpen = useRef(isOpen);

  const handleOpenRating = (order: Order) => {
    // Initialize ratings for all products to 0
    const initialRatings: { [key: string]: number } = {};
    order.orderItems.forEach((item) => {
      if (!item.product?._id) {
        // Skip items without product data
        return;
      }
      const productId = item.product._id;
      initialRatings[productId] = 0;
    });
    setRatings(initialRatings);
    setTitles({});
    setComments({});
  };

  const handleRatingChange = (productId: string, rating: number) => {
    console.log(`Setting rating for product ${productId}: ${rating}`);
    setRatings((prev) => {
      const newRatings = { ...prev, [productId]: rating };
      console.log('New ratings state:', newRatings);
      return newRatings;
    });
  };

  const handleTitleChange = (productId: string, title: string) => {
    setTitles((prev) => ({ ...prev, [productId]: title }));
  };

  const handleCommentChange = (productId: string, comment: string) => {
    setComments((prev) => ({ ...prev, [productId]: comment }));
  };

  const handleSubmit = async () => {
    if (!order || !user) return;

    // Check if all products are rated
    const allRated = order.orderItems.every((item) => {
     if (!item.product?._id) return true; // Skip items without product data
     const productId = item.product._id;
     return (ratings[productId] ?? 0) > 0;
   });
    
    if (!allRated) {
      alert("Please rate all products before submitting.");
      return;
    }

    try {
      const failedItems: string[] = [];
      
      // Process items sequentially to prevent partial writes
      for (const item of order.orderItems) {
        if (!item.product?._id) {
          console.warn('Skipping item without product data');
          continue;
        }
        
        const productId = item.product._id;
        
        try {
          await createReviewAsync({
            productId: productId,
            orderId: order._id,
            rating: ratings[productId ?? '0'],
            title: titles[productId ?? '0'] || "",
            comment: comments[productId ?? '0'] || "",
          });
        } catch (error) {
          console.error(`Failed to create review for product ${productId}:`, error);
          failedItems.push(productId);
          // Stop processing on first failure to prevent partial writes
          break;
        }
      }

      if (failedItems.length > 0) {
        alert(`Failed to submit review for ${failedItems.length} product(s). Please try again.`);
        return;
      }

      alert("Thank you for rating all products!");
      onClose();
      setRatings({});
      setTitles({});
      setComments({});
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to submit reviews");
    }
  };

  const StarRating = ({ rating, onRatingChange, productId }: { rating: number; onRatingChange: (rating: number) => void; productId: string }) => {
    console.log(`StarRating rendering for product ${productId} with rating: ${rating}`);
    
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const isSelected = star <= rating;
          console.log(`Star ${star} isSelected: ${isSelected} (rating: ${rating})`);
          
          return (
            <button
              key={star}
              type="button"
              onClick={() => {
                console.log(`Star clicked: ${star} for product ${productId}`);
                onRatingChange(star);
              }}
              aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
              className="focus:outline-none transition-all duration-200 transform hover:scale-110"
            >
              <svg
                className={`w-6 h-6 transition-colors duration-200 ${
                  isSelected
                    ? "text-yellow fill-current" 
                    : "text-gray-300 hover:text-yellow-200"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          );
        })}
      </div>
    );
  };

  // Initialize ratings when modal opens (only on open transition)
  React.useEffect(() => {
    if (isOpen && !prevIsOpen.current && order) {
      handleOpenRating(order);
    }
    // Update previous open state
    prevIsOpen.current = isOpen;
  }, [isOpen, order]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 lg:mt-20 ">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-modal-title"
        className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 mt-40 lg:mt-0">
          <div className="flex justify-between items-center mb-6">
            <div className="text-center">
              <h2 id="review-modal-title" className="text-2xl font-bold text-gray-900 mb-2">Rate Your Products</h2>
              <p className="text-gray-600 text-sm">Rate each product from your order</p>
            </div>
            <button
              onClick={onClose}
              aria-label="Close review dialog"
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            {order?.orderItems.map((item, index) => {
              const productId = item.product?._id;
              
              // Skip items without product data
              if (!productId) {
                return (
                  <div key={index} className="border rounded-lg p-4 mb-4 bg-gray-50">
                    <p className="text-gray-500">Product information unavailable</p>
                  </div>
                );
              }
              
              return (
                <div key={item._id} className="border-b pb-6 last:border-b-0">
                  <div className="flex items-start space-x-4">
                    <Image
                      src={item.product?.imgs?.previews?.[0] || item.image || "/images/users/user-01.jpg"}
                      alt={item.product?.title || item.name || "Product"}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/images/users/user-01.jpg";
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{item.product?.title || item.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        ${(item.product?.price || item.price).toFixed(2)} × {item.quantity}
                      </p>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rating *
                        </label>
                        <StarRating
                          rating={ratings[productId] || 0}
                          onRatingChange={(rating) => handleRatingChange(productId, rating)}
                          productId={productId}
                        />
                        <div className="text-xs text-gray-500 mt-1">
                          Current rating: {ratings[productId] || 0}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Your Thoughts (optional)
                        </label>
                        <textarea
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Share your experience with this product..."
                          value={comments[productId] || ""}
                          onChange={(e) => handleCommentChange(productId, e.target.value)}
                          maxLength={1000}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {comments[productId]?.length || 0}/1000 characters
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              disabled={isCreatingReview}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isCreatingReview}
              className="px-4 py-2 bg-orange text-white rounded-md disabled:opacity-50 hover:cursor-pointer "
            >
              {isCreatingReview ? "Submitting..." : "Submit All Reviews"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
