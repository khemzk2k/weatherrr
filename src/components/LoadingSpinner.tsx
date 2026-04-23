export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-spin-slow"></div>
        <div className="absolute inset-2 bg-gradient-to-b from-purple-900 to-blue-900 rounded-full"></div>
        <div className="absolute inset-4 bg-white/10 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

export const SkeletonLoader = () => {
  return (
    <div className="space-y-4">
      <div className="skeleton h-24 w-full"></div>
      <div className="skeleton h-4 w-3/4"></div>
      <div className="skeleton h-4 w-1/2"></div>
    </div>
  );
};

export const WeatherCardSkeleton = () => {
  return (
    <div className="weather-card">
      <div className="skeleton h-20 w-20 rounded-lg"></div>
      <div className="space-y-2 mt-4">
        <div className="skeleton h-4 w-32"></div>
        <div className="skeleton h-4 w-24"></div>
      </div>
    </div>
  );
};
