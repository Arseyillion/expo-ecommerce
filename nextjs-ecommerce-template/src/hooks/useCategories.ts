import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface Category {
  _id: string;
  name: string;
  description?: string;
  image: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/categories`);
      const apiCategories = response.data.categories || [];
      
      // Add "All" category at the beginning
      const allCategories = [
        { 
          _id: 'all', 
          name: 'All', 
          image: '', 
          isActive: true, 
          order: -1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        ...apiCategories
      ];
      
      setCategories(apiCategories);
      setError(null);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to fetch categories');
      // Fallback to basic categories
      setCategories([
        { 
          _id: 'all', 
          name: 'All', 
          image: '', 
          isActive: true, 
          order: -1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories
  };
};
