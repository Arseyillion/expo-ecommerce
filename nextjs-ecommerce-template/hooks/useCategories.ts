import { useQuery } from '@tanstack/react-query';

interface Category {
  _id: string;
  name: string;
  description: string;
  image: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Fix: API returns { categories: [...] } not { data: [...] }
interface CategoriesResponse {
  success?: boolean;
  categories: Category[];
}

export const useCategories = () => {
  return useQuery<CategoriesResponse>({
    queryKey: ['categories'],
    queryFn: async () => {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/categories`;
      console.log('🔍 Fetching categories from:', apiUrl);
      
      const response = await fetch(apiUrl);
      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        console.error('❌ Failed to fetch categories:', response.statusText);
        throw new Error(`Failed to fetch categories: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('📊 Categories data received:', data);
      return data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
