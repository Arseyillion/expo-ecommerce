import React from "react";
import CartCheckout from "@/components/Checkout/CartCheckout";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Checkout Page | NextCommerce Nextjs E-commerce template",
  description: "This is Checkout Page for NextCommerce Template",
  // other metadata
};

const CheckoutPage = () => {
  return (
    <main>
      <CartCheckout />
    </main>
  );
};

export default CheckoutPage;
