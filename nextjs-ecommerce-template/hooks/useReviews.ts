import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { useApi } from "../lib/axios";

interface CreateReviewData {
  productId: string;
  orderId: string;
  rating: number;
  title?: string;
  comment?: string;
}

interface Review {
  _id: string;
  productId: string;
  userId: string;
  userName: string;
  userImage: string;
  orderId: string;
  rating: number;
  title: string;
  comment: string;
  helpful: number;
  createdAt: string;
  updatedAt: string;
}

export const useReviews = (productId?: string) => {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const api = useApi();

  const createReview = useMutation({
    mutationFn: async (data: CreateReviewData) => {
      console.log(`Creating review with data:`, data);
      const response = await api.post("/reviews", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const getReviews = useQuery({
    queryKey: ["reviews", productId],
    queryFn: async () => {
      if (!productId) return [];
      
      console.log(`Fetching reviews for productId: ${productId}`);
      const response = await api.get(`/reviews/product/${productId}`);
      console.log(`Reviews API response:`, response);
      
      // Backend returns { reviews: [...] } so we need to extract the reviews array
      return response.data.reviews || [];
    },
    enabled: !!productId,
  });

  return {
    isCreatingReview: createReview.isPending,
    createReviewAsync: createReview.mutateAsync,
    reviews: getReviews.data || [],
    isLoadingReviews: getReviews.isLoading,
    reviewsError: getReviews.error,
  };
};
