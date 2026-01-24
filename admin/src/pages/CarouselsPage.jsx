import React, { useState, useEffect } from 'react';
import axiosIntance from '../lib/axios';
import { PlusIcon } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const CarouselsPage = () => {
  const [carousels, setCarousels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCarousel, setEditingCarousel] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    autoplayDelay: 2500,
    spaceBetween: 30,
    centeredSlides: true,
    isActive: true,
    slides: [
      {
        title: '',
        subtitle: '',
        description: '',
        discountPercentage: '30%',
        discountText: 'Sale Off',
        buttonText: 'Shop Now',
        buttonLink: '#',
        order: 0,
        isActive: true
      }
    ]
  });
  const [slideImages, setSlideImages] = useState({});
  const [slideImagePreviews, setSlideImagePreviews] = useState({});
  
  const queryClient = useQueryClient();

  // React Query for fetching carousels
  const { data: carouselsData, isLoading, error } = useQuery({
    queryKey: ['carousels'],
    queryFn: async () => {
      const response = await axiosIntance.get('/admin/carousels');
      console.log(`these are carousel contents, ${JSON.stringify(response.data.carousels,null,2)}`)
      return response.data.carousels || [];
    }
  });

  // Update the carousels state when data changes
  useEffect(() => {
    if (carouselsData) {
      setCarousels(carouselsData);
    }
  }, [carouselsData]);

  // Update loading state
  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  // Legacy fetch function (kept for compatibility)
  const fetchCarousels = async () => {
    try {
      const response = await axiosIntance.get('/admin/carousels');
      console.log(`these are carousel contents, ${JSON.stringify(response.data.carousels,null,2)}`)
      setCarousels(response.data.carousels || []);
    } catch (error) {
      console.error('Error fetching carousels:', error);
    } finally {
      setLoading(false);
    }
  };

  // React Query mutations
  const createCarouselMutation = useMutation({
    mutationFn: async (data) => {
      const formDataToSend = new FormData();
      formDataToSend.append('name', data.name);
      formDataToSend.append('description', data.description);
      formDataToSend.append('autoplayDelay', data.autoplayDelay);
      formDataToSend.append('spaceBetween', data.spaceBetween);
      formDataToSend.append('centeredSlides', data.centeredSlides);
      formDataToSend.append('slides', JSON.stringify(data.slides));

      // Add slide images
      Object.keys(data.slideImages).forEach((key) => {
        if (data.slideImages[key]) {
          formDataToSend.append(key, data.slideImages[key]);
        }
      });

      return await axiosIntance.post('/admin/carousels', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    onSuccess: () => {
      setShowModal(false);
      resetForm();
      // Invalidate and refetch carousels
      queryClient.invalidateQueries({ queryKey: ['carousels'] });
    },
    onError: (error) => {
      console.error('Error creating carousel:', error);
      alert(error.response?.data?.message || 'Error creating carousel');
    }
  });

  const updateCarouselMutation = useMutation({
    mutationFn: async (data) => {
      const formDataToSend = new FormData();
      formDataToSend.append('name', data.name);
      formDataToSend.append('description', data.description);
      formDataToSend.append('autoplayDelay', data.autoplayDelay);
      formDataToSend.append('spaceBetween', data.spaceBetween);
      formDataToSend.append('centeredSlides', data.centeredSlides);
      formDataToSend.append('slides', JSON.stringify(data.slides));

      // Add slide images
      Object.keys(data.slideImages).forEach((key) => {
        if (data.slideImages[key]) {
          formDataToSend.append(key, data.slideImages[key]);
        }
      });

      return await axiosIntance.put(`/admin/carousels/${data._id}`, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    onSuccess: () => {
      setShowModal(false);
      resetForm();
      // Invalidate and refetch carousels
      queryClient.invalidateQueries({ queryKey: ['carousels'] });
    },
    onError: (error) => {
      console.error('Error updating carousel:', error);
      alert(error.response?.data?.message || 'Error updating carousel');
    }
  });

  const deleteCarouselMutation = useMutation({
    mutationFn: async (carouselId) => {
      return await axiosIntance.delete(`/admin/carousels/${carouselId}`);
    },
    onSuccess: () => {
      // Invalidate and refetch carousels
      queryClient.invalidateQueries({ queryKey: ['carousels'] });
    },
    onError: (error) => {
      console.error('Error deleting carousel:', error);
      alert(error.response?.data?.message || 'Error deleting carousel');
    }
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSlideChange = (index, field, value) => {
    const newSlides = [...formData.slides];
    newSlides[index][field] = value;
    setFormData(prev => ({ ...prev, slides: newSlides }));
  };

  const handleSlideImageChange = (index, file) => {
    setSlideImages(prev => ({ ...prev, [`slide${index}Image`]: file }));
    
    // Create preview for new image
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSlideImagePreviews(prev => ({
          ...prev,
          [`slide${index}Image`]: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to set existing image preview when editing
  const setExistingImagePreview = (index, imageUrl) => {
    setSlideImagePreviews(prev => ({
      ...prev,
      [`slide${index}Image`]: imageUrl
    }));
  };

  const addSlide = () => {
    setFormData(prev => ({
      ...prev,
      slides: [...prev.slides, {
        title: '',
        subtitle: '',
        description: '',
        discountPercentage: '30%',
        discountText: 'Sale Off',
        buttonText: 'Shop Now',
        buttonLink: '#',
        order: prev.slides.length,
        isActive: true
      }]
    }));
  };

  const removeSlide = (index) => {
    if (formData.slides.length > 1) {
      const newSlides = formData.slides.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, slides: newSlides }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const submitData = {
      name: formData.name,
      description: formData.description,
      autoplayDelay: formData.autoplayDelay,
      spaceBetween: formData.spaceBetween,
      centeredSlides: formData.centeredSlides,
      slides: formData.slides,
      slideImages: slideImages
    };

    if (editingCarousel) {
      updateCarouselMutation.mutate({
        _id: editingCarousel._id,
        ...submitData
      });
    } else {
      createCarouselMutation.mutate(submitData);
    }
  };

  const handleEdit = (carousel) => {
    setEditingCarousel(carousel);
    setFormData({
      name: carousel.name,
      description: carousel.description || '',
      autoplayDelay: carousel.autoplayDelay,
      spaceBetween: carousel.spaceBetween,
      centeredSlides: carousel.centeredSlides,
      isActive: carousel.isActive,
      slides: carousel.slides.map(slide => ({
        title: slide.title,
        subtitle: slide.subtitle,
        description: slide.description,
        discountPercentage: slide.discountPercentage,
        discountText: slide.discountText,
        buttonText: slide.buttonText,
        buttonLink: slide.buttonLink,
        order: slide.order,
        isActive: slide.isActive
      }))
    });
    
    // Set existing image previews
    const previews = {};
    carousel.slides.forEach((slide, index) => {
      if (slide.image) {
        previews[`slide${index}Image`] = slide.image;
      }
    });
    setSlideImagePreviews(previews);
    
    setSlideImages({});
    setShowModal(true);
  };

  const handleDelete = async (carouselId) => {
    if (!confirm('Are you sure you want to delete this carousel? This cannot be undone.')) return;
    
    deleteCarouselMutation.mutate(carouselId);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      autoplayDelay: 2500,
      spaceBetween: 30,
      centeredSlides: true,
      isActive: true,
      slides: [
        {
          title: '',
          subtitle: '',
          description: '',
          discountPercentage: '30%',
          discountText: 'Sale Off',
          buttonText: 'Shop Now',
          buttonLink: '#',
          order: 0,
          isActive: true
        }
      ]
    });
    setSlideImages({});
    setSlideImagePreviews({});
    setEditingCarousel(null);
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Carousels Management</h1>
          <p className="text-base-content/70 mt-1">Manage your product categories</p>
        </div>
        <button
          onClick={openModal}
          className="btn btn-primary gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          Add New Carousel
        </button>
      </div>

      <div className="bg-base-100 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Slides
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-base-100  divide-gray-200 hover:text-black ">
              {carousels.map((carousel) => (
                <tr key={carousel._id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium truncate max-w-[120px] sm:max-w-none">
                      {carousel.name}
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden sm:table-cell">
                    <div className="text-sm truncate max-w-[150px] sm:max-w-none">
                      {carousel.description || 'No description'}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm">{carousel.slides?.length || 0} slides</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      carousel.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {carousel.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => handleEdit(carousel)}
                        className="text-blue-600 hover:text-blue-900 text-xs sm:text-sm hover:cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(carousel._id)}
                        className="text-red-600 hover:text-red-900 text-xs sm:text-sm hover:cursor-pointer" 
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
      {showModal && (
        // fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50
        <div className="modal">
          {/* relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto */}
          <div className="modal-box">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingCarousel ? 'Edit Carousel' : 'Add New Carousel'}
              </h3>
              <form onSubmit={handleSubmit}>
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Carousel Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium  mb-2">
                      Description
                    </label>
                    <input
                      type="text"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Carousel Settings */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Autoplay Delay (ms)
                    </label>
                    <input
                      type="number"
                      name="autoplayDelay"
                      value={formData.autoplayDelay}
                      onChange={handleInputChange}
                      min="1000"
                      step="500"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Space Between
                    </label>
                    <input
                      type="number"
                      name="spaceBetween"
                      value={formData.spaceBetween}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center pt-6">
                    <input
                      type="checkbox"
                      name="centeredSlides"
                      checked={formData.centeredSlides}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <label className="text-sm font-medium ">
                      Centered Slides
                    </label>
                  </div>
                </div>

                {/* Slides */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-md font-medium ">Slides</h4>
                    {/* bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 */}
                    <button
                      type="button"
                      onClick={addSlide}
                      className="btn btn-primary"
                    >
                      Add Slide
                    </button>
                  </div>

                  {formData.slides.map((slide, index) => (
                    <div key={index} className="border rounded-lg p-4 mb-4 bg-base-100">
                      <div className="flex justify-between items-center mb-3">
                        <h5 className="text-sm font-medium ">Slide {index + 1}</h5>
                        {formData.slides.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSlide(index)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                        <div>
                          <label className="block text-sm font-medium  mb-1">
                            Title *
                          </label>
                          <input
                            type="text"
                            value={slide.title}
                            onChange={(e) => handleSlideChange(index, 'title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium  mb-1">
                            Subtitle
                          </label>
                          <input
                            type="text"
                            value={slide.subtitle}
                            onChange={(e) => handleSlideChange(index, 'subtitle', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium  mb-1">
                            Description *
                          </label>
                          <textarea
                            value={slide.description}
                            onChange={(e) => handleSlideChange(index, 'description', e.target.value)}
                            rows="2"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium  mb-1">
                            Discount Percentage
                          </label>
                          <input
                            type="text"
                            value={slide.discountPercentage}
                            onChange={(e) => handleSlideChange(index, 'discountPercentage', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium  mb-1">
                            Discount Text
                          </label>
                          <input
                            type="text"
                            value={slide.discountText}
                            onChange={(e) => handleSlideChange(index, 'discountText', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium  mb-1">
                            Button Text
                          </label>
                          <input
                            type="text"
                            value={slide.buttonText}
                            onChange={(e) => handleSlideChange(index, 'buttonText', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium  mb-1">
                            Button Link
                          </label>
                          <input
                            type="text"
                            value={slide.buttonLink}
                            onChange={(e) => handleSlideChange(index, 'buttonLink', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium  mb-1">
                            Image *
                          </label>
                          <input
                            type="file"
                            onChange={(e) => handleSlideImageChange(index, e.target.files[0])}
                            accept="image/*"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required={!editingCarousel}
                          />
                          {/* Image Preview */}
                          {slideImagePreviews[`slide${index}Image`] && (
                            <div className="mt-2">
                              <img
                                src={slideImagePreviews[`slide${index}Image`]}
                                alt={`Slide ${index + 1} preview`}
                                className="h-20 w-20 object-cover rounded border border-gray-300"
                              />
                              <p className="text-xs text-gray-500 mt-1">Current image</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={createCarouselMutation.isPending || updateCarouselMutation.isPending}
                  >
                    {createCarouselMutation.isPending || updateCarouselMutation.isPending ? 'Saving...' : (editingCarousel ? 'Update' : 'Create')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarouselsPage;
