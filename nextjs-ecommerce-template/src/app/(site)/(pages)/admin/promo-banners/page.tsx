import PromoBannerManager from "@/components/Admin/PromoBannerManager";
import { Metadata } from "next";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Promo Banners Admin | NextCommerce",
  description: "Manage promotional banners for your ecommerce store",
};

const PromoBannersAdminPage = () => {
  return <PromoBannerManager />;
};

export default PromoBannersAdminPage;
