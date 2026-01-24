import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";

type ProductsResponse = {
  products: any[];
};

const useNewArrivals = (limit = 8) => {
  const api = axiosInstance;
  
  const result = useQuery({
    queryKey: ["new-arrivals", limit],
    queryFn: async () => {
      const { data } = await api.get<ProductsResponse>(`/products/new-arrivals?limit=${limit}`);
      return data;
    }
  });

  return result;
};

export default useNewArrivals;
