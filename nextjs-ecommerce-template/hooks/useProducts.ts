import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../src/lib/axios";
import { Product } from "../src/types/index";

type ProductsResponse = {
  products: Product[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

const useProducts = (page: number = 1, limit: number = 12) => {
  const api = axiosInstance;

  const result = useQuery({
    queryKey: ["products", page, limit],
    queryFn: async () => {
      const {data} = await api.get<ProductsResponse>(`/products?page=${page}&limit=${limit}`);
      return data;
    },
    placeholderData: (previousData) => previousData, // Keep previous data while fetching new data for smooth pagination
  });

  return result;
};

export default useProducts;
