"use client";
import React, { useState } from "react";
import { useAddresses } from "../../../hooks/useAddresses";
import AddressCard from "@/components/Common/AddressCard";
import AddressFormModal from "@/components/Common/AddressFormModal";
import { Address } from "../../../hooks/useAddresses";

const Addresses = () => {
  const {
    addresses,
    isLoading,
    isError,
    addAddress,
    updateAddress,
    deleteAddress,
    isAddingAddress,
    isUpdatingAddress,
    isDeletingAddress,
  } = useAddresses();

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const handleAddAddress = () => {
    setShowAddressForm(true);
    setEditingAddress(null);
  };

  const handleEditAddress = (address: Address) => {
    setShowAddressForm(true);
    setEditingAddress(address);
  };

  const handleDeleteAddress = (addressId: string, label: string) => {
    if (window.confirm(`Are you sure you want to delete ${label}?`)) {
      deleteAddress(addressId, {
        onSuccess: () => {
          console.log("Address deleted successfully");
        },
        onError: (error: any) => {
          console.error("Failed to delete address:", error);
          alert("Failed to delete address. Please try again.");
        },
      });
    }
  };

  const handleSaveAddress = (addressData: any) => {
    if (editingAddress) {
      // Update existing address
      updateAddress(
        {
          addressId: editingAddress._id,
          addressData,
        },
        {
          onSuccess: () => {
            setShowAddressForm(false);
            setEditingAddress(null);
            alert("Address updated successfully");
          },
          onError: (error: any) => {
            console.error("Failed to update address:", error);
            alert("Failed to update address. Please try again.");
          },
        }
      );
    } else {
      // Add new address
      addAddress(addressData, {
        onSuccess: () => {
          setShowAddressForm(false);
          alert("Address added successfully");
        },
        onError: (error: any) => {
          console.error("Failed to add address:", error);
          alert("Failed to add address. Please try again.");
        },
      });
    }
  };

  const handleCloseAddressForm = () => {
    setShowAddressForm(false);
    setEditingAddress(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue"></div>
        <span className="ml-3 text-gray-600">Loading addresses...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-red-500 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load addresses</h3>
        <p className="text-gray-600">Please check your connection and try again.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-dark">My Addresses</h2>
        <button
          onClick={handleAddAddress}
          className="px-4 py-2 bg-blue text-white rounded-lg hover:bg-blue-dark transition-colors flex items-center"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add New Address
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg
            className="mx-auto h-16 w-16 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses yet</h3>
          <p className="text-gray-600 mb-6">
            You haven't added any delivery addresses yet.
          </p>
          <button
            onClick={handleAddAddress}
            className="px-6 py-3 bg-blue text-white rounded-lg hover:bg-blue-dark transition-colors"
          >
            Add Your First Address
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((address) => (
            <AddressCard
              key={address._id}
              address={address}
              onEdit={handleEditAddress}
              onDelete={handleDeleteAddress}
              isUpdatingAddress={isUpdatingAddress}
              isDeletingAddress={isDeletingAddress}
            />
          ))}
        </div>
      )}

      <AddressFormModal
        isOpen={showAddressForm}
        onClose={handleCloseAddressForm}
        onSave={handleSaveAddress}
        isEditing={!!editingAddress}
        initialData={editingAddress || undefined}
        isSaving={isAddingAddress || isUpdatingAddress}
      />
    </div>
  );
};

export default Addresses;
