import React, { useState, useEffect, useRef } from "react";
import { Address } from "../../../hooks/useAddresses";

interface AddressFormData {
  label: string;
  fullName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  isDefault: boolean;
}

interface AddressFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (addressData: AddressFormData) => void;
  isEditing: boolean;
  initialData?: Address;
  isSaving?: boolean;
}

const AddressFormModal: React.FC<AddressFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  isEditing,
  initialData,
  isSaving = false,
}) => {
  const [formData, setFormData] = useState<AddressFormData>({
    label: "",
    fullName: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    phoneNumber: "",
    isDefault: false,
  });

  const modalRef = useRef<HTMLDivElement>(null);

  // Escape key handling
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      // Focus the modal on mount
      if (modalRef.current) {
        modalRef.current.focus();
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  const [errors, setErrors] = useState<Partial<AddressFormData>>({});

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        label: initialData.label,
        fullName: initialData.fullName,
        streetAddress: initialData.streetAddress,
        city: initialData.city,
        state: initialData.state,
        zipCode: initialData.zipCode,
        phoneNumber: initialData.phoneNumber,
        isDefault: initialData.isDefault,
      });
    } else if (isOpen) {
      setFormData({
        label: "",
        fullName: "",
        streetAddress: "",
        city: "",
        state: "",
        zipCode: "",
        phoneNumber: "",
        isDefault: false,
      });
    }
    setErrors({});
  }, [isOpen, initialData]);

  const handleChange = (field: keyof AddressFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<AddressFormData> = {};

    if (!formData.label.trim()) newErrors.label = "Label is required";
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.streetAddress.trim()) newErrors.streetAddress = "Street address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.zipCode.trim()) newErrors.zipCode = "ZIP code is required";
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity z-0"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div
          className="relative z-10 w-full max-w-lg bg-white rounded-xl shadow-xl"
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-3 md:mt-16 lg:mt-30 mt-50">
            <h2 className="text-xl font-semibold text-dark">
              {isEditing ? "Edit Address" : "Add New Address"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4 pt-4">
            {/* Label */}
            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                Label
              </label>
              <input
                type="text"
                value={formData.label}
                onChange={(e) => handleChange("label", e.target.value)}
                placeholder="e.g., Home, Work, Office"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue focus:border-transparent ${
                  errors.label ? "border-red-500" : "border-gray-3"
                }`}
              />
              {errors.label && (
                <p className="mt-1 text-sm text-red">{errors.label}</p>
              )}
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                placeholder="Enter your full name"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue focus:border-transparent ${
                  errors.fullName ? "border-red-500" : "border-gray-3"
                }`}
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red">{errors.fullName}</p>
              )}
            </div>

            {/* Street Address */}
            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                Street Address
              </label>
              <textarea
                value={formData.streetAddress}
                onChange={(e) => handleChange("streetAddress", e.target.value)}
                placeholder="Street address, apt/suite number"
                rows={2}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue focus:border-transparent ${
                  errors.streetAddress ? "border-red-500" : "border-gray-3"
                }`}
              />
              {errors.streetAddress && (
                <p className="mt-1 text-sm text-red">{errors.streetAddress}</p>
              )}
            </div>

            {/* City and State */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  placeholder="e.g., New York"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue focus:border-transparent ${
                    errors.city ? "border-red-500" : "border-gray-3"
                  }`}
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red">{errors.city}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-2">
                  State
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleChange("state", e.target.value)}
                  placeholder="e.g., NY"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue focus:border-transparent ${
                    errors.state ? "border-red-500" : "border-gray-3"
                  }`}
                />
                {errors.state && (
                  <p className="mt-1 text-sm text-red">{errors.state}</p>
                )}
              </div>
            </div>

            {/* ZIP Code */}
            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                ZIP Code
              </label>
              <input
                type="text"
                value={formData.zipCode}
                onChange={(e) => handleChange("zipCode", e.target.value)}
                placeholder="e.g., 10001"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue focus:border-transparent ${
                  errors.zipCode ? "border-red-500" : "border-gray-3"
                }`}
              />
              {errors.zipCode && (
                <p className="mt-1 text-sm text-red">{errors.zipCode}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
                placeholder="+1 (555) 123-4567"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue focus:border-transparent ${
                  errors.phoneNumber ? "border-red-500" : "border-gray-3"
                }`}
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red">{errors.phoneNumber}</p>
              )}
            </div>

            {/* Default Address Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <label className="text-sm font-medium text-dark">
                Set as default address
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) => handleChange("isDefault", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue"></div>
              </label>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="flex-1 px-4 py-2 border border-gray-3 text-dark rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 px-4 py-2 bg-blue text-white rounded-lg hover:bg-blue-dark transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isEditing ? "Saving..." : "Adding..."}
                  </>
                ) : (
                  isEditing ? "Save Changes" : "Add Address"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddressFormModal;
