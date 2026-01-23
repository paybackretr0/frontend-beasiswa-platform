import React from "react";

const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 animate-pulse">
      <div className="flex flex-col items-left py-6">
        <div className="h-4 bg-gray-200 rounded w-32 mb-3"></div>
        <div className="h-8 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
