"use client";
import React from "react";
import ShopDetails from "@/components/ShopDetails";
import { useSearchParams } from "next/navigation";

const ShopDetailsPage = () => {
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');
  
  if (!productId) {
    return (
      <main>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-500 text-lg mb-4">No product ID provided</p>
            <a 
              href="/shop-with-sidebar" 
              className="px-4 py-2 bg-blue text-white rounded hover:bg-blue-600 inline-block"
            >
              Browse Products
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <ShopDetails productId={productId} />
    </main>
  );
};

export default ShopDetailsPage;
