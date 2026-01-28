export type Product = {
  description: ReactNode;
  title: string;
  reviews: number;
  price: number;
  discountedPrice: number;
  discount?: number;
  hasDiscount?: boolean;
  id: number;
  imgs?: {
    thumbnails: string[];
    previews: string[];
  };
};
