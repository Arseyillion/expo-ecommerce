import React from "react";
import { Address } from "../../../hooks/useAddresses";

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (addressId: string, label: string) => void;
  isUpdatingAddress?: boolean;
  isDeletingAddress?: boolean;
}

const AddressCard: React.FC<AddressCardProps> = ({
  address,
  onEdit,
  onDelete,
  isUpdatingAddress = false,
  isDeletingAddress = false,
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-3 p-6 mb-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center mb-3">
            <h3 className="font-semibold text-lg text-dark mr-3">
              {address.label}
            </h3>
            {address.isDefault && (
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                Default
              </span>
            )}
          </div>
          
          <div className="space-y-1 text-gray-600">
            <p className="font-medium text-dark">{address.fullName}</p>
            <p>{address.streetAddress}</p>
            <p>
              {address.city}, {address.state} {address.zipCode}
            </p>
            <p>{address.phoneNumber}</p>
          </div>
        </div>
        
        <div className="flex gap-2 ml-4">
          <button
            onClick={() => onEdit(address)}
            disabled={isUpdatingAddress || isDeletingAddress}
            className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-3 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Edit address"
          >
            <svg
              className="w-4 h-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          
          <button
            onClick={() => onDelete(address._id, address.label)}
            disabled={isUpdatingAddress || isDeletingAddress}
            className="flex items-center justify-center w-10 h-10 rounded-lg border border-red-200 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Delete address"
          >
            <svg
              className="w-4 h-4 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressCard;
