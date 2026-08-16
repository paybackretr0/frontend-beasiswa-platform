import React from "react";

const SkeletonScholarshipCard = ({ items = 9 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(items)].map((_, idx) => (
        <div
          key={idx}
          className="bg-white rounded-lg overflow-hidden border border-slate-200 animate-pulse"
        >
          {/* Image Skeleton */}
          <div className="h-48 bg-slate-200"></div>

          {/* Content Skeleton */}
          <div className="p-6 space-y-4">
            {/* Title + Subtitle */}
            <div className="space-y-2">
              <div className="h-6 bg-slate-200 rounded w-3/4"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            </div>

            {/* Status Tags */}
            <div className="flex gap-2">
              <div className="h-6 w-16 bg-slate-200 rounded"></div>
            </div>

            {/* Schema Info Box */}
            <div className="bg-slate-100 rounded-md p-3 space-y-2">
              <div className="flex justify-between">
                <div className="h-3 bg-slate-200 rounded w-20"></div>
                <div className="h-3 bg-slate-200 rounded w-16"></div>
              </div>
              <div className="flex justify-between">
                <div className="h-3 bg-slate-200 rounded w-20"></div>
                <div className="h-3 bg-slate-200 rounded w-12"></div>
              </div>
              <div className="flex justify-between">
                <div className="h-3 bg-slate-200 rounded w-24"></div>
                <div className="h-3 bg-slate-200 rounded w-10"></div>
              </div>
            </div>

            {/* Main Info */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <div className="h-4 bg-slate-200 rounded w-16"></div>
                <div className="h-4 bg-slate-200 rounded w-24"></div>
              </div>
              <div className="flex justify-between">
                <div className="h-4 bg-slate-200 rounded w-16"></div>
                <div className="h-4 bg-slate-200 rounded w-20"></div>
              </div>
              <div className="flex justify-between">
                <div className="h-4 bg-slate-200 rounded w-16"></div>
                <div className="h-4 bg-slate-200 rounded w-32"></div>
              </div>
            </div>

            {/* Benefit Info */}
            <div className="h-3 bg-slate-200 rounded w-28"></div>

            {/* CTA Button */}
            <div className="pt-2">
              <div className="h-10 bg-slate-200 rounded-md w-full"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonScholarshipCard;
