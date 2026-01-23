import React from "react";

const SkeletonChart = ({ type = "bar", title, description }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      {(title || description) && (
        <div className="mb-4">
          {title && (
            <div className="h-6 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
          )}
          {description && (
            <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
          )}
        </div>
      )}

      <div className="animate-pulse">
        {type === "pie" ? (
          <div className="flex justify-center py-4">
            <div className="h-64 w-64 bg-gray-200 rounded-full"></div>
          </div>
        ) : type === "line" ? (
          <div className="py-4">
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        ) : type === "horizontal-bar" ? (
          <div className="space-y-3 py-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-6 bg-gray-200 rounded flex-1"></div>
                <div className="h-6 w-12 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-4">
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkeletonChart;
