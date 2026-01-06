import React from 'react';

const ProfileSkeleton = () => {
  return (
    <div className="relative w-full max-w-[380px] mx-auto mt-5 p-8 text-center overflow-hidden border shadow-xl rounded-3xl bg-white/5 backdrop-blur-md border-white/10">
      
      {/* Avatar Skeleton */}
      <div className="relative w-[100px] h-[100px] mx-auto mb-6">
        <div className="w-full h-full rounded-full bg-white/10 animate-pulse"></div>
      </div>

      {/* Text Skeletons */}
      <div className="space-y-4">
        {/* Name */}
        <div className="w-3/4 h-8 mx-auto rounded-md bg-white/10 animate-pulse"></div>
        {/* Location */}
        <div className="w-1/2 h-4 mx-auto rounded-md bg-white/10 animate-pulse"></div>
        
        {/* Bio Box */}
        <div className="w-full h-16 mt-6 rounded-lg bg-white/5 animate-pulse"></div>

        {/* Skills Pills */}
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          <div className="w-16 h-6 rounded-full bg-white/10 animate-pulse"></div>
          <div className="w-20 h-6 rounded-full bg-white/10 animate-pulse"></div>
          <div className="h-6 rounded-full w-14 bg-white/10 animate-pulse"></div>
        </div>
      </div>

      {/* Buttons Skeleton */}
      <div className="flex justify-center gap-3 mt-8">
        <div className="w-24 h-10 rounded-xl bg-white/10 animate-pulse"></div>
        <div className="w-24 h-10 rounded-xl bg-white/10 animate-pulse"></div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;