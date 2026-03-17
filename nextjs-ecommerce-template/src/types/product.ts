import { ReactNode } from 'react';

export type Product = {
   _id: string;
  description: ReactNode;
  title: string;
  reviews: number;
  price: number;
  discountedPrice: number;
  discount?: number;
  hasDiscount?: boolean;
  id: string; // Changed from number to string to match backend _id
  imgs?: {
    thumbnails: string[];
    previews: string[];
  };
  features?: string[]; // Array of product features
  name?: string; // Product name (used in ShopDetails)
  images?: string[]; // Product images array (used in ShopDetails)
  specifications?: Record<string, any>; // Product specifications object
};
