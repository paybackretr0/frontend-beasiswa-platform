import React from "react";

const SkeletonFormBuilder = ({ fieldCount = 3 }) => {
  return (
    <div className="bg-gray-50 min-h-screen animate-pulse">
      <div className="bg-white rounded-lg shadow-sm mb-6 p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
            <div className="space-y-2">
              <div className="h-7 bg-gray-200 rounded w-48"></div>
              <div className="h-4 bg-gray-200 rounded w-80"></div>
            </div>
          </div>
          <div className="h-10 bg-gray-200 rounded w-40"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="h-6 bg-gray-200 rounded w-32"></div>
              </div>
              <div className="h-6 w-20 bg-gray-200 rounded"></div>
            </div>

            <div className="space-y-6">
              {[...Array(fieldCount)].map((_, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-5 w-5 bg-gray-200 rounded"></div>
                      <div className="h-6 bg-gray-200 rounded w-32"></div>
                      <div className="h-6 w-16 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-8 w-20 bg-gray-200 rounded"></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-6 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                      <div className="h-10 bg-gray-200 rounded-lg"></div>
                    </div>

                    <div className="md:col-span-4 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                      <div className="h-10 bg-gray-200 rounded-lg"></div>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-12"></div>
                      <div className="h-6 bg-gray-200 rounded w-24 mt-2"></div>
                    </div>
                  </div>

                  {idx % 2 === 0 && (
                    <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                        <div className="h-8 w-28 bg-gray-200 rounded"></div>
                      </div>
                      <div className="space-y-2">
                        {[...Array(2)].map((_, i) => (
                          <div key={i} className="flex gap-2">
                            <div className="h-10 bg-gray-200 rounded flex-1"></div>
                            <div className="h-10 w-10 bg-gray-200 rounded"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <div className="h-16 bg-gray-200 rounded-lg border-2 border-dashed border-gray-300"></div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 sticky top-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-6 bg-gray-200 rounded w-32"></div>
            </div>

            <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>

            <div className="h-px bg-gray-200 my-4"></div>

            <div className="space-y-4">
              {[...Array(fieldCount)].map((_, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-40"></div>
                  <div className="h-10 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonFormBuilder;
