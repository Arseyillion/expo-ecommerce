import React from "react";

interface OrderSummaryProps {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export default function OrderSummary({ subtotal, shipping, tax, total }: OrderSummaryProps) {
  return (
    <div className="px-0 mt-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-gray-900 text-xl font-bold mb-4">Summary</h2>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-base">Subtotal</span>
            <span className="text-gray-900 font-semibold text-base">
              ${subtotal.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-base">Shipping</span>
            <span className="text-gray-900 font-semibold text-base">
              ${shipping.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-base">Tax</span>
            <span className="text-gray-900 font-semibold text-base">
              ${tax.toFixed(2)}
            </span>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 pt-3 mt-1" />

          {/* Total */}
          <div className="flex justify-between items-center">
            <span className="text-gray-900 font-bold text-lg">Total</span>
            <span className="text-cyan-500 font-bold text-2xl">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
