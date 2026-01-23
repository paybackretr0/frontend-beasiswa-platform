import React from "react";

const SkeletonFormApplication = ({ fieldCount = 5 }) => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8 animate-pulse">
      {/* Back Button Skeleton */}
      <div className="mb-6">
        <div className="h-10 bg-gray-200 rounded w-48"></div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        {/* Header Section */}
        <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              {/* Title */}
              <div className="h-7 bg-blue-200 rounded w-3/4 mb-2"></div>
              <div className="space-y-2 mb-4">
                <div className="h-5 bg-blue-200 rounded w-64"></div>
                <div className="h-4 bg-blue-200 rounded w-48"></div>
                <div className="h-4 bg-blue-200 rounded w-full"></div>
              </div>

              {/* Schema Info Box */}
              <div className="bg-white border border-blue-300 rounded-lg p-4 mt-3">
                <div className="flex items-center mb-2">
                  <div className="h-5 bg-blue-200 rounded w-40"></div>
                </div>
                <div className="h-5 bg-blue-200 rounded w-56 mb-2"></div>
                <div className="h-4 bg-blue-200 rounded w-full"></div>
              </div>
            </div>

            {/* Help Button */}
            <div className="h-10 w-28 bg-blue-200 rounded"></div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          {[...Array(fieldCount)].map((_, idx) => (
            <div key={idx} className="space-y-2">
              {/* Field Label */}
              <div className="flex items-center">
                <div className="h-4 bg-gray-200 rounded w-48"></div>
              </div>

              {/* Field Input - Different types */}
              {idx % 4 === 0 ? (
                // File Upload
                <div>
                  <div className="h-10 bg-gray-200 rounded w-48"></div>
                  <div className="h-3 bg-gray-200 rounded w-40 mt-1"></div>
                </div>
              ) : idx % 4 === 1 ? (
                // Textarea
                <div className="h-24 bg-gray-200 rounded-lg"></div>
              ) : idx % 4 === 2 ? (
                // Select
                <div className="h-10 bg-gray-200 rounded-lg"></div>
              ) : (
                // Text Input
                <div className="h-10 bg-gray-200 rounded-lg"></div>
              )}

              {/* Help Text */}
              {idx % 4 === 0 && (
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              )}
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center mt-8 pt-6 border-t border-gray-200 gap-4">
          {/* Required Info */}
          <div className="h-4 bg-gray-200 rounded w-40"></div>

          {/* Action Buttons */}
          <div className="space-x-4 ml-auto flex">
            <div className="h-10 w-32 bg-gray-200 rounded"></div>
            <div className="h-10 w-40 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonFormApplication;
