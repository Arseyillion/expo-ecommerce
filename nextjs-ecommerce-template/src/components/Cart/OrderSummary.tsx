import { selectTotalPrice } from "@/redux/features/cart-slice";
import { useAppSelector } from "@/redux/store";
import React, { useState } from "react";
import Link from "next/link";
import { ALL_NIGERIAN_STATES, NIGERIAN_CITIES } from "@/utils/delivery-fee-calculator";

const OrderSummary = () => {
  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const totalPrice = useAppSelector(selectTotalPrice);
  const [showDeliveryEstimate, setShowDeliveryEstimate] = useState(false);
  const [deliveryState, setDeliveryState] = useState("");
  const [deliveryCity, setDeliveryCity] = useState("");
  const [estimatedDeliveryFee, setEstimatedDeliveryFee] = useState(0);

  // Handle state change - reset city when state changes
  const handleStateChange = (newState: string) => {
    setDeliveryState(newState);
    setDeliveryCity(""); // Reset city when state changes
  };

  // Get cities for the selected state
  const getCitiesForState = (state: string) => {
    return NIGERIAN_CITIES[state as keyof typeof NIGERIAN_CITIES] || [];
  };

  return (
    <div className="lg:max-w-[455px] w-full">
      {/* <!-- order list box --> */}
      <div className="bg-white shadow-1 rounded-[10px]">
        <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
          <h3 className="font-medium text-xl text-dark">Order Summary</h3>
        </div>

        <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
          {/* <!-- title --> */}
          <div className="flex items-center justify-between py-5 border-b border-gray-3">
            <div>
              <h4 className="font-medium text-dark">Product</h4>
            </div>
            <div>
              <h4 className="font-medium text-dark text-right">Subtotal</h4>
            </div>
          </div>

          {/* <!-- product item --> */}
          {cartItems.map((item, key) => (
            <div key={key} className="flex items-center justify-between py-5 border-b border-gray-3">
              <div>
                <p className="text-dark">{item.title}</p>
              </div>
              <div>
                <p className="text-dark text-right">
                  ${item.discountedPrice * item.quantity}
                </p>
              </div>
            </div>
          ))}

          {/* <!-- total --> */}
          <div className="flex items-center justify-between pt-5">
            <div>
              <p className="font-medium text-lg text-dark">Subtotal</p>
            </div>
            <div>
              <p className="font-medium text-lg text-dark text-right">
                ${totalPrice}
              </p>
            </div>
          </div>

          {/* <!-- delivery estimate section --> */}
          <div className="mt-4">
            {!showDeliveryEstimate ? (
              <button
                type="button"
                onClick={() => setShowDeliveryEstimate(true)}
                className="w-full text-center text-blue hover:text-white text-sm font-medium py-2 border border-blue rounded-md hover:bg-blue transition-colors"
              >
                Estimate Delivery Fee
              </button>
            ) : (
              <div className="bg-gray-50 rounded-md p-4 border border-gray-200">
                <h4 className="font-medium text-dark mb-3">Quick Delivery Estimate</h4>
                
                <div className="mb-3">
                  <select
                    value={deliveryState}
                    onChange={(e) => handleStateChange(e.target.value)}
                    className="w-full text-sm bg-white border border-gray-3 rounded-md py-2 px-3 outline-none focus:border-blue"
                  >
                    <option value="">Select State</option>
                    {ALL_NIGERIAN_STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-3">
                  <select
                    value={deliveryCity}
                    onChange={(e) => setDeliveryCity(e.target.value)}
                    disabled={!deliveryState}
                    className="w-full text-sm bg-white border border-gray-3 rounded-md py-2 px-3 outline-none focus:border-blue disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {deliveryState ? "Select your city" : "Select a state first"}
                    </option>
                    {getCitiesForState(deliveryState).map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  {!deliveryState && (
                    <p className="text-xs text-gray-500 mt-1">Please select a state first</p>
                  )}
                </div>
                
                {deliveryState && deliveryCity && (
                  <div className="text-sm text-gray-600">
                    <p>💡 Complete delivery calculation available at checkout</p>
                    <p className="mt-1">📍 Based on location: {deliveryCity}, {deliveryState}</p>
                  </div>
                )}
                
                <button
                  type="button"
                  onClick={() => setShowDeliveryEstimate(false)}
                  className="text-xs text-gray-500 mt-2 hover:text-gray-700"
                >
                  Hide estimate
                </button>
              </div>
            )}
          </div>

          {/* <!-- checkout button --> */}
          <Link
            href="/checkout"
            className="w-full flex justify-center font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5 text-center"
          >
            Process to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
