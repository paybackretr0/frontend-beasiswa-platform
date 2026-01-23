import React from "react";

const SkeletonProfile = () => {
  return (
    <div className="animate-pulse">
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="h-5 w-5 bg-blue-200 rounded-full flex-shrink-0"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-blue-200 rounded w-48"></div>
            <div className="h-3 bg-blue-200 rounded w-full"></div>
            <div className="h-3 bg-blue-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-48 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-24 mx-auto mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-32 mx-auto"></div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="h-5 bg-gray-200 rounded w-40 mb-4"></div>
            <div className="space-y-4">
              {[...Array(4)].map((_, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="h-4 w-4 bg-gray-200 rounded-full flex-shrink-0 mt-0.5"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="space-y-2">
                <div className="h-7 bg-gray-200 rounded w-48"></div>
                <div className="h-4 bg-gray-200 rounded w-64"></div>
              </div>
              <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>

            <div className="space-y-6">
              <div className="md:col-span-2">
                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-12 bg-gray-200 rounded-lg"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, idx) => (
                  <div key={idx}>
                    <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-12 bg-gray-200 rounded-lg"></div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-200">
                {[...Array(3)].map((_, idx) => (
                  <div key={idx}>
                    <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-12 bg-gray-200 rounded-lg"></div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                <div className="h-12 bg-gray-200 rounded-lg flex-1"></div>
                <div className="h-12 bg-gray-200 rounded-lg flex-1"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 p-6 bg-white rounded-2xl border border-gray-200 shadow-md">
        <div className="h-6 bg-gray-200 rounded w-40 mb-6"></div>
        <div className="space-y-6">
          {[...Array(3)].map((_, idx) => (
            <div key={idx}>
              <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
              <div className="h-12 bg-gray-200 rounded-lg"></div>
            </div>
          ))}

          <div className="flex justify-end pt-4">
            <div className="h-10 bg-gray-200 rounded w-40"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonProfile;
