import React from "react";

const SkeletonHistory = () => {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg shadow-md border border-gray-200 p-4"
          >
            <div className="text-center">
              <div className="h-8 bg-gray-200 rounded w-16 mx-auto mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-32 mx-auto"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div className="h-6 bg-gray-200 rounded w-56"></div>
            <div className="flex gap-3">
              <div className="h-10 w-32 bg-gray-200 rounded"></div>
              <div className="h-10 w-32 bg-gray-200 rounded"></div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="h-10 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="flex gap-4">
              <div className="h-10 w-44 bg-gray-200 rounded"></div>
              <div className="h-10 w-72 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="bg-gray-50 border-b border-gray-200 p-4">
            <div className="grid grid-cols-7 gap-4 min-w-[1400px]">
              <div className="h-4 bg-gray-200 rounded w-8"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 bg-gray-200 rounded w-28"></div>
              <div className="h-4 bg-gray-200 rounded w-28"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {[...Array(10)].map((_, rowIdx) => (
              <div key={rowIdx} className="p-4">
                <div className="grid grid-cols-7 gap-4 min-w-[1400px] items-center">
                  <div className="h-4 bg-gray-200 rounded w-6"></div>
                  <div className="h-5 bg-gray-200 rounded w-full"></div>
                  <div className="h-6 w-20 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="space-y-2">
                    <div className="h-6 w-32 bg-gray-200 rounded"></div>
                    {rowIdx % 3 === 0 && (
                      <>
                        <div className="h-3 bg-gray-200 rounded w-40"></div>
                        <div className="h-5 w-28 bg-gray-200 rounded"></div>
                      </>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 w-20 bg-gray-200 rounded"></div>
                    {rowIdx % 2 === 0 && (
                      <div className="h-8 w-20 bg-gray-200 rounded"></div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="h-4 bg-gray-200 rounded w-40"></div>
              <div className="flex gap-2">
                {[...Array(5)].map((_, idx) => (
                  <div key={idx} className="h-8 w-8 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonHistory;
