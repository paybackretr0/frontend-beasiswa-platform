import React from "react";

const SkeletonNewsCard = ({ items = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[...Array(items)].map((_, idx) => (
        <div
          key={idx}
          className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 animate-pulse"
        >
          <div className="h-48 bg-gray-200"></div>

          <div className="p-6 space-y-3">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>

            <div className="h-4 bg-gray-200 rounded w-1/2"></div>

            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              <div className="h-3 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonNewsCard;
