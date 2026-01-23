import React from "react";

const SkeletonLog = ({ items = 10 }) => {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center mb-4">
        <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
      </div>

      {[...Array(items)].map((_, idx) => (
        <div
          key={idx}
          className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-center gap-3">
                <div className="h-4 bg-gray-200 rounded w-40"></div>
                <div className="h-5 w-24 bg-gray-200 rounded-full"></div>
              </div>

              <div className="h-4 bg-gray-200 rounded w-3/4"></div>

              <div className="h-3 bg-gray-200 rounded w-2/3"></div>

              <div className="flex items-center gap-2">
                <div className="h-3 bg-gray-200 rounded w-32"></div>
                <div className="h-2 w-1 bg-gray-200 rounded-full"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
            </div>

            <div className="flex-shrink-0 ml-4">
              <div className="h-5 w-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLog;
