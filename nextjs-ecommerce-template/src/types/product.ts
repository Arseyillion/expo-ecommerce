import { ReactNode } from 'react';

export type Product = {
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
};
