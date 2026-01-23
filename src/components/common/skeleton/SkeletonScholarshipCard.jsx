import React from "react";

const SkeletonScholarshipCard = ({ items = 9 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(items)].map((_, idx) => (
        <div
          key={idx}
          className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 animate-pulse"
        >
          {/* Image Skeleton */}
          <div className="h-48 bg-gray-200"></div>

          {/* Content Skeleton */}
          <div className="p-6 space-y-4">
            {/* Title + Subtitle */}
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>

            {/* Status Tags */}
            <div className="flex gap-2">
              <div className="h-6 w-16 bg-gray-200 rounded"></div>
            </div>

            {/* Schema Info Box */}
            <div className="bg-gray-100 rounded-lg p-3 space-y-2">
              <div className="flex justify-between">
                <div className="h-3 bg-gray-200 rounded w-20"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="flex justify-between">
                <div className="h-3 bg-gray-200 rounded w-20"></div>
                <div className="h-3 bg-gray-200 rounded w-12"></div>
              </div>
              <div className="flex justify-between">
                <div className="h-3 bg-gray-200 rounded w-24"></div>
                <div className="h-3 bg-gray-200 rounded w-10"></div>
              </div>
            </div>

            {/* Main Info */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
            </div>

            {/* Benefit Info */}
            <div className="h-3 bg-gray-200 rounded w-28"></div>

            {/* CTA Button */}
            <div className="pt-2">
              <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonScholarshipCard;
