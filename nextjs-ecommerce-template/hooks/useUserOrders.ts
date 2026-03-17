import { useQuery } from "@tanstack/react-query";
import { useApi } from "../lib/axios";
import { useUser } from "@clerk/nextjs";

interface OrderItem {
  _id: string;
  product: {
    _id: string;
    title: string;
    price: number;
    imgs: {
      previews: string[];
    };
  };
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  _id: string;
  user: string;
  clerkId: string;
  orderItems: OrderItem[];
  totalPrice: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  deliveredAt?: string;
  shippedAt?: string;
  hasReviewed?: boolean;
}

type OrdersResponse = {
  orders: Order[];
};

const useUserOrders = () => {
  const api = useApi();
  const { isSignedIn, user } = useUser();
  
  const result = useQuery<OrdersResponse>({
    queryKey: ["user-orders", user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("User not authenticated");
      const { data } = await api.get<OrdersResponse>("/orders");
      return data;
    },
    enabled: !!user?.id, // Only run query if user is authenticated
    retry: 1,
  });

  return result;
};

export default useUserOrders;
