import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";
import { Product } from "@/types/index";

type ProductsResponse = {
  products: Product[];
};

const useProducts = () => {
  const api = axiosInstance;

  const result = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const {data} = await api.get<ProductsResponse>("/products");
      return data;
    },
  });

  return result;
};

export default useProducts;
