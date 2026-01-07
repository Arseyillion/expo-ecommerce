import { useApi } from "@/lib/api";
import { Product } from "@/types";
import { useQuery } from "@tanstack/react-query";

type ProductsResponse = {
  products: Product[];
};

const useProducts = () => {
  const api = useApi();

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
