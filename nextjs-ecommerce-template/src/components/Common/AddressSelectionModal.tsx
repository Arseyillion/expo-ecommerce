import React, { useState, useEffect, useRef } from "react";
import { Address } from "../../../hooks/useAddresses";
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';


interface AddressSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: (address: Address) => void;
  addresses: Address[];
  isLoading?: boolean;
  isProcessing?: boolean;
}

const AddressSelectionModal: React.FC<AddressSelectionModalProps> = ({
  isOpen,
  onClose,
  onProceed,
  addresses,
  isLoading = false,
  isProcessing = false,
}) => {
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const isSubmittingRef = useRef<boolean>(false);

  // Reset and validate selection when addresses change or modal opens
  useEffect(() => {
    if (isOpen) {
      // Focus the modal on mount
      if (modalRef.current) {
        modalRef.current.focus();
      }
    } else {
      // Reset reentrancy guard when modal closes
      isSubmittingRef.current = false;
    }
    
    // Validate existing selection against current addresses
    if (selectedAddressId) {
      const addressExists = addresses.find(addr => addr._id === selectedAddressId);
      if (!addressExists) {
        // Clear stale selection
        setSelectedAddressId(null);
      }
    }
  }, [addresses, isOpen, selectedAddressId]);

  // Escape key handling
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isProcessing) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose, isProcessing]);

  const getSelectedAddress = (): Address | null => {
    if (!selectedAddressId) return null;
    return addresses.find(addr => addr._id === selectedAddressId) || null;
  };

  const handleProceed = async () => {
    if (isSubmittingRef.current) return;
    
    const selectedAddress = getSelectedAddress();
    if (selectedAddress) {
      isSubmittingRef.current = true;
      try {
        await onProceed(selectedAddress);
      } finally {
        isSubmittingRef.current = false;
      }
    }
  };

  const handleAddressSelect = (address: Address) => {
    setSelectedAddressId(address._id);
  };

  const handleAddressKeyDown = (event: React.KeyboardEvent, address: Address) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleAddressSelect(address);
    }
  };

  const handleSafeClose = () => {
    if (!isProcessing) {
      onClose();
    }
  };

  if (!isOpen) return null;

 
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center p-4">
        {/* Backdrop */}
        <div 
          className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity z-0 ${isProcessing ? 'pointer-events-none' : ''}`}
          onClick={handleSafeClose}
        />
        
        {/* Modal */}
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="address-selection-modal-title"
          tabIndex={-1}
          className="relative z-10 w-full max-w-2xl bg-white rounded-t-2xl shadow-xl animate-slide-up"
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 id="address-selection-modal-title" className="text-xl font-semibold text-gray-900">Select Address</h2>
            <button
              onClick={handleSafeClose}
              disabled={isProcessing}
              aria-disabled={isProcessing}
              aria-label="Close address selection modal"
              className={`p-2 rounded-lg transition-colors ${
                isProcessing 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-gray-100'
              }`}
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

          {/* Addresses List */}
          <div className="max-h-96 overflow-y-auto p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
                <span className="ml-3 text-gray-600">Loading addresses...</span>
              </div>
            ) : addresses.length === 0 ? (
              <div className="text-center py-8">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400 mb-4"
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
                <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses found</h3>
                <p className="text-gray-600 mb-4">
                  You haven't added any delivery addresses yet.
                </p>
                <button
                  onClick={handleSafeClose}
                  disabled={isProcessing}
                  aria-disabled={isProcessing}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    isProcessing
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                      : 'bg-cyan-500 text-white hover:bg-cyan-600'
                  }`}
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((address) => (
                  <button
                    key={address._id}
                    type="button"
                    onClick={() => handleAddressSelect(address)}
                    onKeyDown={(e) => handleAddressKeyDown(e, address)}
                    role="button"
                    aria-pressed={selectedAddressId === address._id}
                    aria-selected={selectedAddressId === address._id}
                    className={`w-full border rounded-lg p-4 cursor-pointer transition-all text-left ${
                      selectedAddressId === address._id
                        ? "border-4 border-blue bg-[#f9f9f9]"
                        : "border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="font-semibold text-dark mr-3">
                            {address.label}
                          </h3>
                          {address.isDefault && (
                            <span className="bg-dark text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        
                        <div className="text-sm text-gray-600 space-y-1">
                          <p className="font-medium text-dark">{address.fullName}</p>
                          <p>{address.streetAddress}</p>
                          <p>
                            {address.city}, {address.state} {address.zipCode}
                          </p>
                          <p>{address.phoneNumber}</p>
                        </div>
                      </div>
                      
                      <div className="ml-4 flex items-center">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedAddressId === address._id
                            ? "border-dark bg-dark"
                            : "border-gray-300"
                        }`}>
                          {selectedAddressId === address._id && (
                            <svg
                              className="w-3 h-3 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex gap-3">
              <button
                onClick={handleSafeClose}
                disabled={isProcessing}
                aria-disabled={isProcessing}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-900 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleProceed}
                disabled={!getSelectedAddress() || isProcessing}
                className="flex-1 px-4 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors disabled:opacity-50 flex items-center justify-center bg-dark"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    Continue to Payment
                    <svg
                      className="w-5 h-5 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressSelectionModal;
