import React from 'react';

const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  const shimmerClass = "animate-pulse bg-navy-800 rounded-lg";

  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className="glass-panel p-6 rounded-2xl flex flex-col gap-3">
            <div className={`h-4 w-1/3 ${shimmerClass}`}></div>
            <div className={`h-8 w-1/2 ${shimmerClass}`}></div>
            <div className={`h-3 w-3/4 ${shimmerClass}`}></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="glass-panel rounded-2xl overflow-hidden p-6 space-y-4">
        <div className="flex gap-4">
          <div className={`h-8 w-1/4 ${shimmerClass}`}></div>
          <div className={`h-8 w-1/6 ${shimmerClass}`}></div>
          <div className={`h-8 w-1/6 ${shimmerClass}`}></div>
        </div>
        <div className="border-t border-navy-800 pt-4 space-y-3">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="flex justify-between items-center py-2">
              <div className="flex gap-4 w-2/3">
                <div className={`h-5 w-1/3 ${shimmerClass}`}></div>
                <div className={`h-5 w-1/4 ${shimmerClass}`}></div>
                <div className={`h-5 w-1/5 ${shimmerClass}`}></div>
              </div>
              <div className={`h-6 w-16 ${shimmerClass}`}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div className="glass-panel p-6 rounded-2xl h-[300px] flex flex-col justify-between">
        <div className={`h-5 w-1/4 ${shimmerClass}`}></div>
        <div className="flex items-end gap-3 h-[200px] w-full px-4">
          <div className={`h-[40%] w-full ${shimmerClass}`}></div>
          <div className={`h-[70%] w-full ${shimmerClass}`}></div>
          <div className={`h-[50%] w-full ${shimmerClass}`}></div>
          <div className={`h-[85%] w-full ${shimmerClass}`}></div>
          <div className={`h-[60%] w-full ${shimmerClass}`}></div>
          <div className={`h-[95%] w-full ${shimmerClass}`}></div>
        </div>
        <div className="flex justify-between w-full">
          <div className={`h-3 w-12 ${shimmerClass}`}></div>
          <div className={`h-3 w-12 ${shimmerClass}`}></div>
          <div className={`h-3 w-12 ${shimmerClass}`}></div>
        </div>
      </div>
    );
  }

  return null;
};

export default SkeletonLoader;
