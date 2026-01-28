import React from 'react';

interface DiscountBadgeProps {
  discount: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const DiscountBadge: React.FC<DiscountBadgeProps> = ({ 
  discount, 
  className = '', 
  size = 'md' 
}) => {
  if (!discount || discount <= 0) return null;

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5'
  };

  return (
    <div 
      className={`
        inline-flex items-center justify-center
        bg-red-500 text-orange font-semibold
        rounded-md
        ${sizeClasses[size]}
        ${className}
      `}
    >
      -{Math.round(discount)}%
    </div>
  );
};

export default DiscountBadge;
