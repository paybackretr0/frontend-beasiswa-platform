import React from "react";

const SkeletonDetailScholarship = ({ isAdminView = false }) => {
  if (isAdminView) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg p-6 border border-slate-200">
              <div className="flex items-start space-x-6">
                <div className="w-24 h-24 bg-slate-200 rounded-lg flex-shrink-0"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-slate-200 rounded"></div>
                    <div className="h-6 w-16 bg-slate-200 rounded"></div>
                    <div className="h-6 w-20 bg-slate-200 rounded"></div>
                    <div className="h-6 w-32 bg-slate-200 rounded"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                    <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                    <div className="h-4 bg-slate-200 rounded w-4/6"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-slate-200">
              <div className="h-6 bg-slate-200 rounded w-48 mb-4"></div>
              <div className="space-y-4">
                {[...Array(2)].map((_, idx) => (
                  <div
                    key={idx}
                    className="border border-slate-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex gap-2">
                        <div className="h-5 bg-slate-200 rounded w-40"></div>
                        <div className="h-5 w-16 bg-slate-200 rounded"></div>
                      </div>
                      <div className="flex gap-2">
                        <div className="h-8 w-24 bg-slate-200 rounded"></div>
                        <div className="h-8 w-24 bg-slate-200 rounded"></div>
                      </div>
                    </div>

                    <div className="space-y-4 pl-4">
                      <div className="h-4 bg-slate-200 rounded w-full"></div>

                      <div className="grid grid-cols-3 gap-4 bg-slate-50 rounded-lg p-3">
                        <div className="h-12 bg-slate-200 rounded"></div>
                        <div className="h-12 bg-slate-200 rounded"></div>
                        <div className="h-12 bg-slate-200 rounded"></div>
                      </div>

                      <div className="space-y-2">
                        <div className="h-5 bg-slate-200 rounded w-32"></div>
                        <div className="h-10 bg-slate-100 rounded"></div>
                        <div className="h-10 bg-slate-100 rounded"></div>
                      </div>

                      <div className="space-y-2">
                        <div className="h-5 bg-slate-200 rounded w-48"></div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="h-10 bg-slate-100 rounded"></div>
                          <div className="h-10 bg-slate-100 rounded"></div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="h-5 bg-slate-200 rounded w-40"></div>
                        <div className="space-y-2">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex gap-2">
                              <div className="h-8 w-8 bg-slate-200 rounded-full"></div>
                              <div className="h-8 bg-slate-200 rounded flex-1"></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-slate-200">
              <div className="h-6 bg-slate-200 rounded w-48 mb-4"></div>
              <div className="space-y-2">
                {[...Array(4)].map((_, idx) => (
                  <div key={idx} className="flex gap-2">
                    <div className="h-2 w-2 bg-slate-200 rounded-full mt-2"></div>
                    <div className="h-4 bg-slate-200 rounded flex-1"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg p-6 border border-slate-200">
              <div className="h-5 bg-slate-200 rounded w-40 mb-4"></div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <div className="h-4 bg-slate-200 rounded w-24"></div>
                  <div className="h-5 bg-slate-200 rounded w-28"></div>
                </div>
                <div className="h-px bg-slate-200"></div>
                <div className="flex justify-between">
                  <div className="h-4 bg-slate-200 rounded w-28"></div>
                  <div className="h-4 bg-slate-200 rounded w-20"></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-slate-200">
              <div className="h-5 bg-slate-200 rounded w-40 mb-4"></div>
              <div className="space-y-4">
                <div>
                  <div className="h-3 bg-slate-200 rounded w-16 mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-32"></div>
                </div>
                <div className="h-px bg-slate-200"></div>
                <div>
                  <div className="h-3 bg-slate-200 rounded w-16 mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-32"></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-slate-200">
              <div className="h-5 bg-slate-200 rounded w-32 mb-4"></div>
              <div className="space-y-4">
                {[...Array(4)].map((_, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="h-4 w-4 bg-slate-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-slate-200 rounded w-16"></div>
                      <div className="h-4 bg-slate-200 rounded w-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-slate-200">
              <div className="h-5 bg-slate-200 rounded w-32 mb-4"></div>
              <div className="space-y-3">
                <div className="h-3 bg-slate-200 rounded w-20 mb-2"></div>
                <div className="flex flex-wrap gap-2">
                  <div className="h-6 w-20 bg-slate-200 rounded"></div>
                  <div className="h-6 w-24 bg-slate-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="animate-pulse">
      <div className="bg-[#142a5c] text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
          <div className="mb-8">
            <div className="h-4 bg-white/20 rounded w-48"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-4">
                <div className="w-full h-48 bg-slate-200 rounded-md"></div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="h-10 bg-white/20 rounded w-3/4 mb-4"></div>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <div className="h-8 bg-white/20 rounded w-32"></div>
                  <div className="h-8 bg-white/20 rounded w-24"></div>
                  <div className="h-8 bg-white/20 rounded w-20"></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, idx) => (
                  <div
                    key={idx}
                    className="bg-white/10 rounded-lg p-4 text-center"
                  >
                    <div className="h-8 bg-white/20 rounded w-32 mx-auto mb-2"></div>
                    <div className="h-4 bg-white/20 rounded w-24 mx-auto"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-lg p-6 border border-slate-200">
              <div className="h-6 bg-slate-200 rounded w-48 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-5 bg-slate-200 rounded"></div>
                <div className="h-5 bg-slate-200 rounded"></div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-slate-200">
              <div className="h-6 bg-slate-200 rounded w-56 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-slate-200 rounded w-full"></div>
                <div className="h-4 bg-slate-200 rounded w-full"></div>
                <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                <div className="h-4 bg-slate-200 rounded w-full"></div>
                <div className="h-4 bg-slate-200 rounded w-4/6"></div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-slate-200">
              <div className="h-6 bg-slate-200 rounded w-48 mb-4"></div>
              <div className="space-y-3">
                {[...Array(4)].map((_, idx) => (
                  <div
                    key={idx}
                    className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg"
                  >
                    <div className="h-4 bg-slate-200 rounded flex-1"></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-slate-200">
              <div className="h-6 bg-slate-200 rounded w-64 mb-6"></div>

              <div className="mb-4">
                <div className="flex gap-2 border-b border-slate-200 pb-2">
                  <div className="h-10 bg-slate-200 rounded w-40"></div>
                  <div className="h-10 bg-slate-200 rounded w-40"></div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-lg p-4">
                  <div className="h-6 bg-slate-200 rounded w-48 mb-4"></div>
                  <div className="h-4 bg-slate-200 rounded w-full mb-4"></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="h-16 bg-slate-100 rounded-lg"></div>
                    <div className="h-16 bg-slate-100 rounded-lg"></div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <div className="h-6 bg-slate-200 rounded w-56 mb-4"></div>
                  <div className="space-y-3">
                    {[...Array(3)].map((_, idx) => (
                      <div
                        key={idx}
                        className="h-12 bg-slate-100 rounded-lg"
                      ></div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <div className="h-6 bg-slate-200 rounded w-56 mb-4"></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[...Array(4)].map((_, idx) => (
                      <div
                        key={idx}
                        className="h-12 bg-slate-100 rounded-lg"
                      ></div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <div className="h-6 bg-slate-200 rounded w-48 mb-4"></div>
                  <div className="space-y-4">
                    {[...Array(3)].map((_, idx) => (
                      <div key={idx} className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-slate-200 rounded-full flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="h-5 bg-slate-200 rounded w-48"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                  <div className="h-6 bg-slate-200 rounded w-56 mb-3"></div>
                  <div className="h-12 bg-slate-200 rounded-lg w-full"></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 border border-slate-200">
                <div className="h-6 bg-slate-200 rounded w-40 mb-4"></div>
                <div className="space-y-2">
                  {[...Array(5)].map((_, idx) => (
                    <div
                      key={idx}
                      className="h-10 bg-slate-100 rounded-lg"
                    ></div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border border-slate-200">
                <div className="h-6 bg-slate-200 rounded w-40 mb-4"></div>
                <div className="space-y-2">
                  {[...Array(5)].map((_, idx) => (
                    <div
                      key={idx}
                      className="h-10 bg-slate-100 rounded-lg"
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-6">
              <div className="bg-white rounded-lg p-6 border border-slate-200">
                <div className="h-6 bg-slate-200 rounded w-40 mb-4"></div>
                <div className="space-y-4">
                  {[...Array(5)].map((_, idx) => (
                    <div key={idx} className="flex space-x-3">
                      <div className="w-12 h-12 bg-slate-200 rounded-lg flex-shrink-0"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-200 rounded w-full"></div>
                        <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                        <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                  <div className="h-10 bg-slate-200 rounded-lg w-full mt-4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonDetailScholarship;
