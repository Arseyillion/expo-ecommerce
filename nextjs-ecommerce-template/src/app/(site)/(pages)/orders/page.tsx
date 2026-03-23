import Orders from "@/components/Orders";
import React from "react";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "My Orders | NextCommerce Nextjs E-commerce template",
  description: "This is Orders page for NextCommerce Template",
  // other metadata
};

const OrdersPage = () => {
  return (
    <main>
      <Orders />
    </main>
  );
};

export default OrdersPage;
