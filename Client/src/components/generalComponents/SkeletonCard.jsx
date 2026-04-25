import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm w-full max-w-md mx-auto mb-6 overflow-hidden animate-pulse">
      {/* Header Skeleton */}
      <div className="px-4 py-3 flex justify-between items-center bg-gray-50/50">
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
      </div>

      {/* Image Skeleton */}
      <div className="aspect-video bg-gray-200 w-full"></div>

      {/* Description Skeleton */}
      <div className="px-4 py-4 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        <div className="h-3 bg-gray-200 rounded w-4/6"></div>
      </div>

      {/* Footer Skeleton */}
      <div className="px-4 pb-4 flex justify-between items-center">
        <div className="h-8 bg-gray-200 rounded-lg w-20"></div>
        <div className="h-8 bg-gray-200 rounded-full w-8"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
