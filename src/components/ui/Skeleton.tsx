import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'rect' | 'circle' | 'text';
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', variant = 'rect' }) => {
  const roundedClass =
    variant === 'circle' ? 'rounded-full' : variant === 'text' ? 'rounded' : 'rounded-lg';

  return (
    <div
      aria-hidden="true"
      className={`animate-pulse bg-[#16214A]/70 ${roundedClass} ${className}`}
    />
  );
};
