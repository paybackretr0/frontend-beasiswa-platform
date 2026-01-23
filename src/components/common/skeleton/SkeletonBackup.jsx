import React from "react";

const SkeletonBackup = ({ items = 6 }) => {
  return (
    <div className="space-y-4">
      {[...Array(items)].map((_, idx) => (
        <div
          key={idx}
          className="bg-white rounded-lg shadow-md p-6 border border-gray-200 animate-pulse"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-6 bg-gray-200 rounded w-64"></div>
                <div className="h-6 w-20 bg-gray-200 rounded"></div>
                <div className="h-6 w-16 bg-gray-200 rounded"></div>
              </div>

              <div className="flex items-center gap-2 mb-1">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-2 w-1 bg-gray-200 rounded-full"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-2 w-1 bg-gray-200 rounded-full"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>

              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>

            <div className="flex-shrink-0 ml-4">
              <div className="h-9 w-28 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonBackup;
