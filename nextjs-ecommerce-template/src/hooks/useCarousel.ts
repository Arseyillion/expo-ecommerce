import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface CarouselSlide {
  title: string;
  subtitle: string;
  description: string;
  discountPercentage: string;
  discountText: string;
  buttonText: string;
  buttonLink: string;
  image: string;
  isActive: boolean;
  order: number;
}

export interface Carousel {
  _id: string;
  name: string;
  description?: string;
  slides: CarouselSlide[];
  isActive: boolean;
  autoplayDelay: number;
  spaceBetween: number;
  centeredSlides: boolean;
  createdAt: string;
  updatedAt: string;
}

export const useCarousel = (carouselId?: string) => {
  const [carousel, setCarousel] = useState<Carousel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCarousel();
  }, [carouselId]);

  const fetchCarousel = async () => {
    try {
      setLoading(true);
      
      // Fetch the first active carousel
      const response = await axios.get(`${API_URL}/carousels/active`);
      setCarousel(response.data.carousel);
      setError(null);
    } catch (err) {
      console.error('Error fetching carousel:', err);
      setError('Failed to fetch carousel');
      // Set fallback carousel with static data
      setCarousel({
        _id: 'fallback',
        name: 'Default Carousel',
        slides: [
          {
            title: "True Wireless Noise Cancelling Headphone",
            subtitle: "Sale Off",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi at ipsum at risus euismod lobortis in",
            discountPercentage: "30%",
            discountText: "Sale Off",
            buttonText: "Shop Now",
            buttonLink: "#",
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop",
            isActive: true,
            order: 0
          },
          {
            title: "Premium Smart Watch Series",
            subtitle: "Limited Time", 
            description: "Advanced fitness tracking, heart rate monitor, GPS, and water-resistant design. Stay connected with notifications.",
            discountPercentage: "25%",
            discountText: "Limited Time",
            buttonText: "Shop Now",
            buttonLink: "#",
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop",
            isActive: true,
            order: 1
          }
        ],
        isActive: true,
        autoplayDelay: 2500,
        spaceBetween: 30,
        centeredSlides: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    carousel,
    loading,
    error,
    refetch: fetchCarousel
  };
};
