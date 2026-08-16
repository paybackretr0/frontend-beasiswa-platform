import React from "react";

const SkeletonInformation = ({ items = 9 }) => {
  return (
    <div className="animate-pulse">
      <div className="bg-white rounded-lg border border-slate-200 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="lg:col-span-2">
            <div className="h-4 bg-slate-200 rounded w-32 mb-2"></div>
            <div className="h-10 bg-slate-200 rounded-lg"></div>
          </div>

          <div>
            <div className="h-4 bg-slate-200 rounded w-20 mb-2"></div>
            <div className="h-10 bg-slate-200 rounded-lg"></div>
          </div>

          <div>
            <div className="h-4 bg-slate-200 rounded w-24 mb-2"></div>
            <div className="h-10 bg-slate-200 rounded-lg"></div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
          <div className="h-4 bg-slate-200 rounded w-64"></div>
          <div className="h-9 bg-slate-200 rounded w-28"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        {[...Array(items)].map((_, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg overflow-hidden border border-slate-200"
          >
            <div className="h-48 bg-slate-200"></div>

            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <div className="h-6 bg-slate-200 rounded w-full"></div>
                <div className="h-6 bg-slate-200 rounded w-3/4"></div>
              </div>

              <div className="flex items-center justify-between">
                <div className="h-5 bg-slate-200 rounded w-40"></div>
              </div>

              <div className="space-y-2">
                <div className="h-4 bg-slate-200 rounded w-full"></div>
                <div className="h-4 bg-slate-200 rounded w-full"></div>
                <div className="h-4 bg-slate-200 rounded w-2/3"></div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-2">
                  <div className="h-6 w-16 bg-slate-200 rounded"></div>
                </div>
              </div>

              <div className="pt-2">
                <div className="h-10 bg-slate-200 rounded-md w-full"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <div className="h-11 bg-slate-200 rounded w-64"></div>
      </div>

      <div className="text-center mt-6">
        <div className="h-4 bg-slate-200 rounded w-32 mx-auto"></div>
      </div>
    </div>
  );
};

export default SkeletonInformation;
