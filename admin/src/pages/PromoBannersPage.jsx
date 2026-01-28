import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const PromoBannersPage = () => {
  const [editingBanner, setEditingBanner] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const queryClient = useQueryClient();

  // Helper function to get full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:3000${imagePath}`;
  };

  // Fetch banners using useQuery
  const { data: banners = [], isLoading, error } = useQuery({
    queryKey: ['promoBanners', 'admin'],
    queryFn: async () => {
      const response = await fetch('/api/promo-banners');
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
    mutationFn: async (bannerData) => {
      const response = await fetch('/api/promo-banners', {
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
    mutationFn: async ({ id, data }) => {
      const response = await fetch(`/api/promo-banners/${id}`, {
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
    mutationFn: async (id) => {
      const response = await fetch(`/api/promo-banners/${id}`, {
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
    mutationFn: async (id) => {
      const response = await fetch(`/api/promo-banners/${id}/toggle`, {
        method: 'PATCH',
      });
      if (!response.ok) throw new Error('Failed to toggle banner');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promoBanners', 'admin'] });
    },
  });

  const handleSubmit = async (e) => {
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
      priority: parseInt(formData.get('priority')),
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

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this banner?')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting banner:', error);
      }
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleMutation.mutateAsync(id);
    } catch (error) {
      console.error('Error toggling banner:', error);
    }
  };

  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold ">Promo Banner Manager</h1>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary"
        >
          Add New Banner
        </button>
      </div>

      {showForm && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-4xl">
            <h2 className="font-bold text-xl mb-4">
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
                    className="input input-bordered w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Subtitle</label>
                  <input
                    name="subtitle"
                    type="text"
                    defaultValue={editingBanner?.subtitle}
                    className="input input-bordered w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    name="description"
                    defaultValue={editingBanner?.description}
                    className="textarea textarea-bordered w-full"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Discount</label>
                  <input
                    name="discount"
                    type="text"
                    defaultValue={editingBanner?.discount}
                    className="input input-bordered w-full"
                    placeholder="e.g., 20% OFF"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Button Text</label>
                  <input
                    name="buttonText"
                    type="text"
                    defaultValue={editingBanner?.buttonText || "Buy Now"}
                    className="input input-bordered w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Button Link</label>
                  <input
                    name="buttonLink"
                    type="text"
                    defaultValue={editingBanner?.buttonLink}
                    className="input input-bordered w-full"
                    placeholder="/shop-with-sidebar"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Background Color</label>
                  <input
                    name="backgroundColor"
                    type="color"
                    defaultValue={editingBanner?.backgroundColor || "#F5F5F7"}
                    className="w-full h-10 input input-bordered"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Text Color</label>
                  <input
                    name="textColor"
                    type="color"
                    defaultValue={editingBanner?.textColor || "#000000"}
                    className="w-full h-10 input input-bordered"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Button Color</label>
                  <input
                    name="buttonColor"
                    type="color"
                    defaultValue={editingBanner?.buttonColor || "#3B82F6"}
                    className="w-full h-10 input input-bordered"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Image URL</label>
                  <input
                    name="image"
                    type="text"
                    defaultValue={editingBanner?.image}
                    className="input input-bordered w-full"
                    placeholder="/images/promo/promo-01.png"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Image Position</label>
                  <select
                    name="imagePosition"
                    defaultValue={editingBanner?.imagePosition || "right"}
                    className="select select-bordered w-full"
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
                    className="select select-bordered w-full"
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
                    min="1"
                    max="10"
                    defaultValue={editingBanner?.priority || 1}
                    className="input input-bordered w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Start Date</label>
                  <input
                    name="startDate"
                    type="datetime-local"
                    defaultValue={editingBanner?.startDate}
                    className="input input-bordered w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End Date</label>
                  <input
                    name="endDate"
                    type="datetime-local"
                    defaultValue={editingBanner?.endDate}
                    className="input input-bordered w-full"
                  />
                </div>
              </div>
              <div className="modal-action">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingBanner(null);
                  }}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="btn btn-primary"
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    editingBanner ? 'Update Banner' : 'Create Banner'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {banners.map((banner) => (
          <div key={banner._id} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="card-title">{banner.title}</h3>
                    <div className="badge badge-success badge-outline">
                      {banner.isActive ? 'Active' : 'Inactive'}
                    </div>
                    <div className={`badge ${banner.size === 'large' ? 'badge-primary' : 'badge-secondary'} badge-outline`}>
                      {banner.size}
                    </div>
                  </div>
                  {banner.subtitle && <p className="text-sm opacity-70 mb-1">{banner.subtitle}</p>}
                  {banner.description && <p className="text-sm opacity-70 mb-1">{banner.description}</p>}
                  {banner.discount && <p className="text-sm font-semibold text-primary mb-1">{banner.discount}</p>}
                  <div className="flex items-center gap-4 text-xs opacity-60">
                    <span>Priority: {banner.priority}</span>
                    <span>Position: {banner.imagePosition}</span>
                    {banner.endDate && <span>Ends: {new Date(banner.endDate).toLocaleDateString()}</span>}
                  </div>
                </div>
                {banner.image && (
                  <div className="avatar ml-4 cursor-pointer" onClick={() => setPreviewImage(getImageUrl(banner.image))}>
                    <div className="w-20 rounded ring ring-primary ring-offset-base-100 ring-offset-2 hover:ring-primary-focus transition-all">
                      <img
                        src={getImageUrl(banner.image)}
                        alt={banner.title}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="card-actions justify-end mt-4">
                <button
                  onClick={() => handleToggle(banner._id)}
                  className={`btn btn-sm ${
                    banner.isActive ? 'btn-warning' : 'btn-success'
                  }`}
                >
                  {banner.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => handleEdit(banner)}
                  className="btn btn-sm btn-primary"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(banner._id)}
                  className="btn btn-sm btn-error"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="modal modal-open" onClick={() => setPreviewImage(null)}>
          <div className="modal-box max-w-4xl p-0" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <button 
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-10"
                onClick={() => setPreviewImage(null)}
              >
                ✕
              </button>
              <img 
                src={previewImage} 
                alt="Preview" 
                className="w-full h-auto rounded-lg"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/600x400?text=Image+Not+Available';
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromoBannersPage;
