import React from "react";

const SkeletonScholarshipEdit = ({ step = 1 }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md animate-pulse">
      <div className="mb-6">
        <div className="h-4 bg-gray-200 rounded w-64"></div>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          <div className="h-6 bg-gray-200 rounded w-48"></div>
        </div>
        <div className="h-px bg-gray-300 mb-6"></div>

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-300 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-40"></div>
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                    </div>
                  </div>
                </div>
                <div className="border border-gray-300 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-40"></div>
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2">
                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-10 bg-gray-200 rounded-lg"></div>
              </div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-10 bg-gray-200 rounded-lg"></div>
              </div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-10 bg-gray-200 rounded-lg"></div>
              </div>
            </div>

            <div>
              <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-24 bg-gray-200 rounded-lg"></div>
            </div>

            <div>
              <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-10 bg-gray-200 rounded-lg"></div>
            </div>

            <div>
              <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="h-10 bg-gray-200 rounded-lg"></div>
                  <div className="h-3 bg-gray-200 rounded w-48 mt-1"></div>
                </div>
                <div className="w-20 h-20 bg-gray-200 rounded-md"></div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="space-y-2">
                <div className="h-4 bg-blue-200 rounded w-full"></div>
                <div className="h-4 bg-blue-200 rounded w-5/6"></div>
              </div>
            </div>

            <div className="space-y-4">
              {[...Array(2)].map((_, idx) => (
                <div
                  key={idx}
                  className="border border-gray-300 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="h-6 bg-gray-200 rounded w-48"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                          <div
                            key={i}
                            className="h-5 bg-gray-200 rounded"
                          ></div>
                        ))}
                      </div>

                      <div className="flex justify-between">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className="h-4 bg-gray-200 rounded w-20"
                          ></div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <div className="h-8 w-8 bg-gray-200 rounded"></div>
                      <div className="h-8 w-8 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="h-5 bg-gray-200 rounded w-40"></div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <div className="h-5 bg-gray-200 rounded w-40 mb-3"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i}>
                    <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-10 bg-gray-200 rounded-lg"></div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="h-5 bg-gray-200 rounded w-40 mb-3"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-10 bg-gray-200 rounded-lg"></div>
                </div>
                {[...Array(2)].map((_, i) => (
                  <div key={i}>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-10 bg-gray-200 rounded-lg"></div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="h-5 bg-gray-200 rounded w-40 mb-3"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i}>
                    <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
                    <div className="h-10 bg-gray-200 rounded-lg"></div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="h-5 bg-gray-200 rounded w-48 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-64 mb-3"></div>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-2 mb-2 items-center">
                  <div className="h-4 bg-gray-200 rounded w-8"></div>
                  <div className="h-10 bg-gray-200 rounded-lg flex-1"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                </div>
              ))}
              <div className="h-4 bg-gray-200 rounded w-32 mt-2"></div>
            </div>

            <div>
              <div className="h-5 bg-gray-200 rounded w-24 mb-3"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i}>
                    <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-10 bg-gray-200 rounded-lg"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between pt-6 border-t border-gray-200">
        {step > 1 && <div className="h-10 bg-gray-200 rounded w-28"></div>}
        {step < 3 ? (
          <div className="h-10 bg-gray-200 rounded w-32 ml-auto"></div>
        ) : (
          <div className="h-10 bg-gray-200 rounded w-40 ml-auto"></div>
        )}
      </div>
    </div>
  );
};

export default SkeletonScholarshipEdit;
