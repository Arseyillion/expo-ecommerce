"use client";
import React, { useState, useEffect } from "react";
import { useAppSelector } from "@/redux/store";

// Import delivery fee calculation functions
import { calculateDeliveryFee, ALL_NIGERIAN_STATES, NIGERIAN_CITIES } from "../../utils/delivery-fee-calculator";

interface DeliveryFeeResult {
  zone: string;
  zoneDescription: string;
  breakdown: {
    baseFee: number;
    weightFee: number;
    sizeFee: number;
    fragileFee: number;
    riskFee: number;
  };
  metrics: {
    totalWeightKg: number;
    largestSize: string;
    hasFragileItem: boolean;
    isHighRisk: boolean;
  };
  totalDeliveryFee: number;
}

interface CartItemWithDelivery {
  id: number;
  title: string;
  price: number;
  discountedPrice: number;
  quantity: number;
  weightKg?: number; // Weight in kg
  sizeCategory?: "SMALL" | "MEDIUM" | "LARGE"; // Size category
  isFragile?: boolean; // Whether item is fragile
}

const DeliveryFeeCalculator = ({ onDeliveryFeeChange }: { onDeliveryFeeChange: (fee: number) => void }) => {
  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const [deliveryState, setDeliveryState] = useState("");
  const [deliveryCity, setDeliveryCity] = useState("");
  const [deliveryFeeResult, setDeliveryFeeResult] = useState<DeliveryFeeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Mock product delivery data - in real app, this would come from product database
  const getProductDeliveryInfo = (productId: number) => {
    // Default delivery info for products
    const productDeliveryMap: { [key: number]: { weightKg: number; sizeCategory: "SMALL" | "MEDIUM" | "LARGE"; isFragile: boolean } } = {
      1: { weightKg: 0.2, sizeCategory: "SMALL", isFragile: false }, // Small electronics
      2: { weightKg: 1.5, sizeCategory: "MEDIUM", isFragile: true },  // Fragile electronics
      3: { weightKg: 0.5, sizeCategory: "SMALL", isFragile: false }, // Accessories
      4: { weightKg: 3.0, sizeCategory: "LARGE", isFragile: false },  // Large items
      5: { weightKg: 0.8, sizeCategory: "MEDIUM", isFragile: true },  // Medium fragile
    };

    return productDeliveryMap[productId] || { weightKg: 1.0, sizeCategory: "MEDIUM", isFragile: false };
  };

  // Handle state change - reset city when state changes
  const handleStateChange = (newState: string) => {
    setDeliveryState(newState);
    setDeliveryCity(""); // Reset city when state changes
    setDeliveryFeeResult(null); // Clear previous results
    setError(""); // Clear any errors
  };

  // Get cities for the selected state
  const getCitiesForState = (state: string) => {
    return NIGERIAN_CITIES[state as keyof typeof NIGERIAN_CITIES] || [];
  };

  // Calculate delivery fee when state and city are selected
  useEffect(() => {
    if (deliveryState && deliveryCity && cartItems.length > 0) {
      calculateFee();
    } else {
      setDeliveryFeeResult(null);
      onDeliveryFeeChange(0);
    }
  }, [deliveryState, deliveryCity, cartItems]);

  const calculateFee = async () => {
    setLoading(true);
    setError("");

    try {
      // Convert cart items to delivery calculation format
      const orderItems = cartItems.map((item) => {
        const deliveryInfo = getProductDeliveryInfo(item.id);
        return {
          weightKg: deliveryInfo.weightKg * item.quantity, // Total weight for quantity
          sizeCategory: deliveryInfo.sizeCategory,
          isFragile: deliveryInfo.isFragile,
        };
      });

      const order = {
        deliveryState,
        deliveryCity,
        items: orderItems,
      };

      // Calculate delivery fee using our calculator
      const result = calculateDeliveryFee(order);
      setDeliveryFeeResult(result);
      onDeliveryFeeChange(result.totalDeliveryFee);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to calculate delivery fee");
      setDeliveryFeeResult(null);
      onDeliveryFeeChange(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-1 rounded-[10px] mt-7.5">
      <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
        <h3 className="font-medium text-xl text-dark">Delivery Information</h3>
      </div>

      <div className="p-4 sm:p-8.5">
        {/* State Selection */}
        <div className="mb-5">
          <label htmlFor="deliveryState" className="block mb-2.5">
            Delivery State <span className="text-red">*</span>
          </label>
          <select
            id="deliveryState"
            value={deliveryState}
            onChange={(e) => handleStateChange(e.target.value)}
            className="w-full bg-gray-1 rounded-md border border-gray-3 text-dark py-3 pl-5 pr-9 duration-200 appearance-none outline-none focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          >
            <option value="">Select your state</option>
            {ALL_NIGERIAN_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        {/* City Selection */}
        <div className="mb-5">
          <label htmlFor="deliveryCity" className="block mb-2.5">
            Delivery City <span className="text-red">*</span>
          </label>
          <select
            id="deliveryCity"
            value={deliveryCity}
            onChange={(e) => setDeliveryCity(e.target.value)}
            disabled={!deliveryState}
            className="w-full bg-gray-1 rounded-md border border-gray-3 text-dark py-3 pl-5 pr-9 duration-200 appearance-none outline-none focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20 disabled:bg-gray-2 disabled:cursor-not-allowed"
          >
            <option value="">
              {deliveryState ? "Select your city" : "Select a state first"}
            </option>
            {getCitiesForState(deliveryState).map((city,index) => (
              <option key={index} value={city}>
                {city}
              </option>
            ))}
          </select>
          {!deliveryState && (
            <p className="text-xs text-gray-500 mt-1">Please select a state first</p>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue"></div>
            <p className="mt-2 text-sm text-gray-600">Calculating delivery fee...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-5">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Delivery Fee Result */}
        {deliveryFeeResult && !loading && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <h4 className="font-medium text-dark mb-3">Delivery Fee Breakdown</h4>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Zone:</span>
                <span className="font-medium">{deliveryFeeResult.zoneDescription}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Total Weight:</span>
                <span className="font-medium">{deliveryFeeResult.metrics.totalWeightKg}kg</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Package Size:</span>
                <span className="font-medium">{deliveryFeeResult.metrics.largestSize}</span>
              </div>
              
              {deliveryFeeResult.metrics.hasFragileItem && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Fragile Handling:</span>
                  <span className="font-medium text-orange-600">Required</span>
                </div>
              )}
              
              {deliveryFeeResult.metrics.isHighRisk && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Area Risk:</span>
                  <span className="font-medium text-red-600">High Risk Area</span>
                </div>
              )}
              
              <hr className="my-2" />
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Base Fee:</span>
                <span>₦{deliveryFeeResult.breakdown.baseFee}</span>
              </div>
              
              {deliveryFeeResult.breakdown.weightFee > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Extra Weight Fee:</span>
                  <span>₦{deliveryFeeResult.breakdown.weightFee}</span>
                </div>
              )}
              
              {deliveryFeeResult.breakdown.sizeFee > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Size Fee:</span>
                  <span>₦{deliveryFeeResult.breakdown.sizeFee}</span>
                </div>
              )}
              
              {deliveryFeeResult.breakdown.fragileFee > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Fragile Fee:</span>
                  <span>₦{deliveryFeeResult.breakdown.fragileFee}</span>
                </div>
              )}
              
              {deliveryFeeResult.breakdown.riskFee > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Risk Surcharge:</span>
                  <span>₦{deliveryFeeResult.breakdown.riskFee}</span>
                </div>
              )}
              
              <hr className="my-2" />
              
              <div className="flex justify-between font-bold text-lg">
                <span>Total Delivery Fee:</span>
                <span className="text-green-600">₦{deliveryFeeResult.totalDeliveryFee}</span>
              </div>
            </div>
          </div>
        )}

        {/* Delivery Info Message */}
        {!deliveryState || !deliveryCity ? (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <p className="text-blue-600 text-sm">
              Please enter your delivery location to calculate shipping fees.
            </p>
          </div>
        ) : !deliveryFeeResult && !loading && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <p className="text-yellow-600 text-sm">
              Enter your complete delivery information to see the delivery fee breakdown.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryFeeCalculator;
