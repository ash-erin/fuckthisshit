import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-800 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="w-12 h-12 border-4 border-gray-800 border-t-red-500 rounded-full animate-spin animate-reverse absolute top-2 left-1/2 transform -translate-x-1/2"></div>
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Loading Recipes</h2>
        <p className="text-gray-400">Preparing your culinary adventure...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;