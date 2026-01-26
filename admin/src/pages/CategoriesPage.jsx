import React, { useState, useEffect } from 'react';
import axiosIntance from '../lib/axios';
import { PlusIcon } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    order: 0,
    image: null
  });
  const [imagePreview, setImagePreview] = useState('');
  
  const queryClient = useQueryClient();

  useEffect(() => {
    fetchCategories();
  }, []);

  const {data, isLoading} = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axiosIntance.get('/admin/categories');
      setCategories(response.data.categories || []);
      return response.data;
    }
  });

  const fetchCategories = async () => {
    try {
      const response = await axiosIntance.get('/admin/categories');
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      setFormData(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const createCategoryMutation = useMutation({
    mutationFn: async (data) => {
      const formDataToSend = new FormData();
      formDataToSend.append('name', data.name);
      formDataToSend.append('description', data.description);
      formDataToSend.append('order', data.order);
      if (data.image) {
        formDataToSend.append('image', data.image);
      }
      return await axiosIntance.post('/admin/categories', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    onSuccess: () => {
      setShowModal(false);
      resetForm();
      // Invalidate and refetch categories
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error) => {
      console.error('Error saving category:', error);
      alert(error.response?.data?.message || 'Error saving category');
    }
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async (data) => {
      const formDataToSend = new FormData();
      formDataToSend.append('name', data.name);
      formDataToSend.append('description', data.description);
      formDataToSend.append('order', data.order);
      if (data.image) {
        formDataToSend.append('image', data.image);
      }
      return await axiosIntance.put(`/admin/categories/${data._id}`, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    onSuccess: () => {
      setShowModal(false);
      resetForm();
      // Invalidate and refetch categories
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error) => {
      console.error('Error saving category:', error);
      alert(error.response?.data?.message || 'Error saving category');
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('order', formData.order);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      if (editingCategory) {
        // await axiosIntance.put(`/admin/categories/${editingCategory._id}`, formDataToSend, {
        //   headers: { 'Content-Type': 'multipart/form-data' }
        // });
        updateCategoryMutation.mutate({
          _id: editingCategory._id,
          name: formData.name,
          description: formData.description,
          order: formData.order,
          image: formData.image
        });
      } else {
        createCategoryMutation.mutate({
          name: formData.name,
          description: formData.description,
          order: formData.order,
          image: formData.image
        });
      }

      // setShowModal(false);
      // resetForm();
      // fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      alert(error.response?.data?.message || 'Error saving category');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      order: category.order || 0,
      image: null
    });
    setImagePreview(category.image);
    setShowModal(true);
  };

  const handleDelete = async (categoryId) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    try {
      await axiosIntance.delete(`/admin/categories/${categoryId}`);
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert(error.response?.data?.message || 'Error deleting category');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', order: 0, image: null });
    setImagePreview('');
    setEditingCategory(null);
  };

  const openModal = () => {
    resetForm();
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Categories Management</h1>
          <p className="text-base-content/70 mt-1">Manage your product categories</p>
        </div>
        <button
          onClick={openModal}
          className="btn btn-primary gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          Add New Category
        </button>
      </div>

      <div className="bagrounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-base-100 divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category._id} className="hover:bg-gray-50 hover:text-black">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-12 w-12 rounded object-cover flex-shrink-0"
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium  truncate max-w-[120px] sm:max-w-none">
                      {category.name}
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden sm:table-cell">
                    <div className="text-sm truncate max-w-37.5 text sm:max-w-none">
                      {category.description || 'No description'}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm ">{category.order}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {category.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="text-blue-600 hover:text-blue-900 text-xs sm:text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(category._id)}
                        className="text-red-600 hover:text-red-900 text-xs sm:text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <input type="checkbox" className="modal-toggle" checked={showModal} readOnly/>
      <div className="modal">
        {/* relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white */}
        <div className="modal-box max-w-2xl">
          <div className="mt-3">
            <h3 className="font-bold text-2xl mb-2">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h3>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className="font-control">
                <label className="block text-sm font-medium  mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 "
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium  mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 "
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium  mb-2">
                  Order
                </label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 "
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium  mb-2">
                  Category Image *
                </label>
                <input
                  type="file"
                  name="image"
                  onChange={handleInputChange}
                  accept="image/*"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={!editingCategory}
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mt-2 h-20 w-20 object-cover rounded"
                  />
                )}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium  bg-gray-100 rounded-md hover:cursor-pointer btn btn-primary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium  btn btn-primary rounded-md hover:cursor-pointer"
                  disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}
                >
                  {createCategoryMutation.isPending || updateCategoryMutation.isPending ? 'Saving...' : (editingCategory ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default CategoriesPage;
