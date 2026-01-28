"use client"
import React from "react";
import { useQuery } from "@tanstack/react-query";

const DebugPromoBanner = () => {
    console.log("🔍 DebugPromoBanner: Component rendering");
    console.log("🔍 Environment API URL:", process.env.NEXT_PUBLIC_API_URL);

    const { data: bannersData, isLoading, error } = useQuery({
        queryKey: ['promoBanners-debug'],
        queryFn: async () => {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3000';
            console.log("🔍 Fetching banners from:", `${apiUrl}/api/promo-banners/active`);
            
            const response = await fetch(`${apiUrl}/api/promo-banners/active`);
            console.log("🔍 Response status:", response.status);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch promo banners: ${response.status}`);
            }
            
            const data = await response.json();
            console.log("🔍 Response data:", data);
            
            if (data.success) {
                return data.data;
            }
            throw new Error('Invalid response format');
        },
        staleTime: 0, // No caching for debugging
        retry: false, // No retries for debugging,
    });

    console.log("🔍 Query state:", { isLoading, error, dataLength: bannersData?.length });

    if (isLoading) {
        return (
            <section className="overflow-hidden py-20 bg-yellow-100">
                <div className="max-w-[1170px] w-full mx-auto px-4">
                    <h2 className="text-2xl font-bold text-center">🔄 Loading Promo Banners...</h2>
                    <p className="text-center mt-2">API URL: {process.env.NEXT_PUBLIC_API_URL || 'NOT SET'}</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="overflow-hidden py-20 bg-red-100">
                <div className="max-w-[1170px] w-full mx-auto px-4">
                    <h2 className="text-2xl font-bold text-center">❌ Error Loading Promo Banners</h2>
                    <p className="text-center mt-2">API URL: {process.env.NEXT_PUBLIC_API_URL || 'NOT SET'}</p>
                    <p className="text-center mt-2 text-red-600">{error instanceof Error ? error.message : 'Unknown error'}</p>
                    <p className="text-center mt-4">Check browser console for more details</p>
                </div>
            </section>
        );
    }

    if (!bannersData || bannersData.length === 0) {
        return (
            <section className="overflow-hidden py-20 bg-blue-100">
                <div className="max-w-[1170px] w-full mx-auto px-4">
                    <h2 className="text-2xl font-bold text-center">📦 No Promo Banners Found</h2>
                    <p className="text-center mt-2">API URL: {process.env.NEXT_PUBLIC_API_URL || 'NOT SET'}</p>
                    <p className="text-center mt-2">Banners data: {JSON.stringify(bannersData)}</p>
                </div>
            </section>
        );
    }

    return (
        <section className="overflow-hidden py-20 bg-green-100">
            <div className="max-w-[1170px] w-full mx-auto px-4">
                <h2 className="text-2xl font-bold text-center">✅ Promo Banners Loaded Successfully!</h2>
                <p className="text-center mt-2">Found {bannersData.length} banners</p>
                <div className="mt-4 space-y-2">
                    {bannersData.map((banner: any) => (
                        <div key={banner._id} className="bg-white p-4 rounded-lg shadow">
                            <h3 className="font-bold">{banner.title}</h3>
                            <p className="text-sm text-gray-600">{banner.subtitle}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default DebugPromoBanner;
