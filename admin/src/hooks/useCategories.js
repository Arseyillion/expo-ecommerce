import { useQuery } from '@tanstack/react-query';

export const useAdminCategories = () => {
  return useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const apiUrl = `${import.meta.env.VITE_API_URL}/categories`;
      console.log('🔍 Admin fetching categories from:', apiUrl);
      
      const response = await fetch(apiUrl);
      console.log('📡 Admin response status:', response.status);
      
      if (!response.ok) {
        console.error('❌ Admin failed to fetch categories:', response.statusText);
        throw new Error(`Failed to fetch categories: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('📊 Admin categories data received:', data);
      return data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
