import React, { useState } from 'react';
import { Search, Filter, User, Zap } from 'lucide-react';

interface HeaderProps {
  onSearchChange: (query: string) => void;
  onFilterToggle: () => void;
  searchQuery: string;
  showSearch?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  onSearchChange, 
  onFilterToggle, 
  searchQuery, 
  showSearch = true 
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">CC</span>
            </div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-gray-900">CulinaryCarousel</h1>
              <div className="flex items-center space-x-1 px-2 py-1 bg-green-100 rounded-full">
                <Zap className="w-3 h-3 text-green-600" />
                <span className="text-xs font-medium text-green-700">LIVE</span>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          {showSearch && (
            <div className="flex-1 max-w-2xl mx-8">
              <div className={`relative transition-all duration-300 ${
                isSearchFocused ? 'transform scale-105' : ''
              }`}>
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search recipes, ingredients, or cuisines..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:bg-white transition-all duration-300 shadow-sm"
                  autoComplete="off"
                  spellCheck="false"
                />
                {searchQuery && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="flex items-center space-x-1 text-xs text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span>Live</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {showSearch && (
              <button
                onClick={onFilterToggle}
                className="p-3 text-gray-600 hover:text-orange-600 transition-colors duration-200 hover:bg-orange-50 rounded-xl relative"
                aria-label="Open filters"
              >
                <Filter className="w-5 h-5" />
              </button>
            )}
            <button 
              className="p-3 text-gray-600 hover:text-gray-900 transition-colors duration-200 hover:bg-gray-100 rounded-xl"
              aria-label="User profile"
            >
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;