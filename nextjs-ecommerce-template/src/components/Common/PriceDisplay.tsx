import React from 'react';
import DiscountBadge from './DiscountBadge';

interface PriceDisplayProps {
  price: number;
  discountedPrice?: number;
  hasDiscount?: boolean;
  discount?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showDiscountBadge?: boolean;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  discountedPrice,
  hasDiscount,
  discount,
  className = '',
  size = 'md',
  showDiscountBadge = true
}) => {
  const hasDiscountApplied = hasDiscount && discountedPrice && discountedPrice < price;

  const sizeClasses = {
    sm: {
      current: 'text-sm font-semibold',
      original: 'text-xs line-through',
      discount: 'text-xs'
    },
    md: {
      current: 'text-base font-semibold',
      original: 'text-sm line-through',
      discount: 'text-sm'
    },
    lg: {
      current: 'text-lg font-bold',
      original: 'text-base line-through',
      discount: 'text-base'
    }
  };

  const currentSize = sizeClasses[size];

  if (!hasDiscountApplied) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className={`${currentSize.current} text-gray-900`}>
          ${price.toFixed(2)}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2  ${className}`}>
     
      {/* Current Price */}
      <span className={`${currentSize.current} text-red-600`}>
        ${discountedPrice!.toFixed(2)}
      </span>
      
      {/* Original Price */}
      <span className={`${currentSize.original} text-gray-400`}>
        ${price.toFixed(2)}
      </span>

       {/* Discount Badge */}
      {showDiscountBadge && discount && (
        <DiscountBadge discount={discount} size={size === 'lg' ? 'md' : 'sm'} />
      )}
      
    </div>
  );
};

export default PriceDisplay;
