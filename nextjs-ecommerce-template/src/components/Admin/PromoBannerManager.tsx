"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface PromoBannerData {
    _id: string;
    title: string;
    subtitle?: string;
    description?: string;
    discount?: string;
    buttonText: string;
    buttonLink: string;
    backgroundColor: string;
    textColor: string;
    buttonColor: string;
    image?: string;
    imagePosition: "left" | "right" | "bottom";
    size: "large" | "small";
    isActive: boolean;
    priority: number;
    startDate: string;
    endDate?: string;
}

const PromoBannerManager = () => {
    const [editingBanner, setEditingBanner] = useState<PromoBannerData | null>(null);
    const [showForm, setShowForm] = useState(false);
    const queryClient = useQueryClient();

    // Fetch banners using useQuery
    const { data: banners = [], isLoading, error } = useQuery({
        queryKey: ['promoBanners', 'admin'],
        queryFn: async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/promo-banners`);
            const data = await response.json();
            if (data.success) {
                return data.data;
            }
            throw new Error('Failed to fetch banners');
        },
        staleTime: 2 * 60 * 1000, // 2 minutes for admin
    });

    // Mutations for CRUD operations
    const createMutation = useMutation({
        mutationFn: async (bannerData: any) => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/promo-banners`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bannerData),
            });
            if (!response.ok) throw new Error('Failed to create banner');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['promoBanners', 'admin'] });
            setShowForm(false);
            setEditingBanner(null);
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: any }) => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/promo-banners/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error('Failed to update banner');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['promoBanners', 'admin'] });
            setShowForm(false);
            setEditingBanner(null);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/promo-banners/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete banner');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['promoBanners', 'admin'] });
        },
    });

    const toggleMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/promo-banners/${id}/toggle`, {
                method: 'PATCH',
            });
            if (!response.ok) throw new Error('Failed to toggle banner');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['promoBanners', 'admin'] });
        },
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        const bannerData = {
            title: formData.get('title'),
            subtitle: formData.get('subtitle'),
            description: formData.get('description'),
            discount: formData.get('discount'),
            buttonText: formData.get('buttonText'),
            buttonLink: formData.get('buttonLink'),
            backgroundColor: formData.get('backgroundColor'),
            textColor: formData.get('textColor'),
            buttonColor: formData.get('buttonColor'),
            image: formData.get('image'),
            imagePosition: formData.get('imagePosition'),
            size: formData.get('size'),
            priority: parseInt(formData.get('priority') as string),
            startDate: formData.get('startDate'),
            endDate: formData.get('endDate') || undefined,
        };

        try {
            if (editingBanner) {
                await updateMutation.mutateAsync({ id: editingBanner._id, data: bannerData });
            } else {
                await createMutation.mutateAsync(bannerData);
            }
            e.currentTarget.reset();
        } catch (error) {
            console.error('Error saving banner:', error);
        }
    };

    const handleEdit = (banner: PromoBannerData) => {
        setEditingBanner(banner);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this banner?')) {
            try {
                await deleteMutation.mutateAsync(id);
            } catch (error) {
                console.error('Error deleting banner:', error);
            }
        }
    };

    const handleToggle = async (id: string) => {
        try {
            await toggleMutation.mutateAsync(id);
        } catch (error) {
            console.error('Error toggling banner:', error);
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Promo Banner Manager</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                    Add New Banner
                </button>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">
                            {editingBanner ? 'Edit Banner' : 'Add New Banner'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Title *</label>
                                    <input
                                        name="title"
                                        type="text"
                                        required
                                        defaultValue={editingBanner?.title}
                                        className="w-full border rounded-md px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Subtitle</label>
                                    <input
                                        name="subtitle"
                                        type="text"
                                        defaultValue={editingBanner?.subtitle}
                                        className="w-full border rounded-md px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Description</label>
                                    <textarea
                                        name="description"
                                        defaultValue={editingBanner?.description}
                                        className="w-full border rounded-md px-3 py-2"
                                        rows={3}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Discount</label>
                                    <input
                                        name="discount"
                                        type="text"
                                        defaultValue={editingBanner?.discount}
                                        className="w-full border rounded-md px-3 py-2"
                                        placeholder="e.g., 20% OFF"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Button Text</label>
                                    <input
                                        name="buttonText"
                                        type="text"
                                        defaultValue={editingBanner?.buttonText || "Buy Now"}
                                        className="w-full border rounded-md px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Button Link</label>
                                    <input
                                        name="buttonLink"
                                        type="text"
                                        defaultValue={editingBanner?.buttonLink}
                                        className="w-full border rounded-md px-3 py-2"
                                        placeholder="/shop-with-sidebar"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Background Color</label>
                                    <input
                                        name="backgroundColor"
                                        type="color"
                                        defaultValue={editingBanner?.backgroundColor || "#F5F5F7"}
                                        className="w-full h-10 border rounded-md px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Text Color</label>
                                    <input
                                        name="textColor"
                                        type="color"
                                        defaultValue={editingBanner?.textColor || "#000000"}
                                        className="w-full h-10 border rounded-md px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Button Color</label>
                                    <input
                                        name="buttonColor"
                                        type="color"
                                        defaultValue={editingBanner?.buttonColor || "#3B82F6"}
                                        className="w-full h-10 border rounded-md px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Image URL</label>
                                    <input
                                        name="image"
                                        type="text"
                                        defaultValue={editingBanner?.image}
                                        className="w-full border rounded-md px-3 py-2"
                                        placeholder="/images/promo/banner-1.jpg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Image Position</label>
                                    <select
                                        name="imagePosition"
                                        defaultValue={editingBanner?.imagePosition || "right"}
                                        className="w-full border rounded-md px-3 py-2"
                                    >
                                        <option value="left">Left</option>
                                        <option value="right">Right</option>
                                        <option value="bottom">Bottom</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Size</label>
                                    <select
                                        name="size"
                                        defaultValue={editingBanner?.size || "large"}
                                        className="w-full border rounded-md px-3 py-2"
                                    >
                                        <option value="large">Large</option>
                                        <option value="small">Small</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Priority</label>
                                    <input
                                        name="priority"
                                        type="number"
                                        defaultValue={editingBanner?.priority || 0}
                                        className="w-full border rounded-md px-3 py-2"
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Start Date</label>
                                    <input
                                        name="startDate"
                                        type="datetime-local"
                                        defaultValue={editingBanner?.startDate ? new Date(editingBanner.startDate).toISOString().slice(0, 16) : ''}
                                        className="w-full border rounded-md px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">End Date (Optional)</label>
                                    <input
                                        name="endDate"
                                        type="datetime-local"
                                        defaultValue={editingBanner?.endDate ? new Date(editingBanner.endDate).toISOString().slice(0, 16) : ''}
                                        className="w-full border rounded-md px-3 py-2"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        setEditingBanner(null);
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    {editingBanner ? 'Update' : 'Create'} Banner
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="grid gap-4">
                {banners.map((banner) => (
                    <div key={banner._id} className="border rounded-lg p-4 bg-white shadow-sm">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-4 mb-2">
                                    <h3 className="text-lg font-semibold">{banner.title}</h3>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                        banner.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {banner.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                        banner.size === 'large' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {banner.size}
                                    </span>
                                </div>
                                {banner.subtitle && <p className="text-sm text-gray-600 mb-1">{banner.subtitle}</p>}
                                {banner.description && <p className="text-sm text-gray-600 mb-1">{banner.description}</p>}
                                {banner.discount && <p className="text-sm font-medium text-blue-600 mb-1">{banner.discount}</p>}
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <span>Priority: {banner.priority}</span>
                                    <span>Position: {banner.imagePosition}</span>
                                    {banner.endDate && <span>Ends: {new Date(banner.endDate).toLocaleDateString()}</span>}
                                </div>
                            </div>
                            {banner.image && (
                                <div className="w-20 h-20 relative ml-4">
                                    <Image
                                        src={banner.image}
                                        alt={banner.title}
                                        fill
                                        className="object-cover rounded"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={() => handleToggle(banner._id)}
                                className={`px-3 py-1 rounded text-sm ${
                                    banner.isActive 
                                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                                }`}
                            >
                                {banner.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                                onClick={() => handleEdit(banner)}
                                className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(banner._id)}
                                className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PromoBannerManager;
