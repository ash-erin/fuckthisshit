import React from 'react';
import { Home, Search, Bookmark, TrendingUp } from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onPageChange }) => {
  const navigationItems = [
    { name: 'Home', path: 'home', icon: Home },
    { name: 'Search', path: 'search', icon: Search },
    { name: 'My Bookmarks', path: 'bookmarks', icon: Bookmark },
    { name: 'Popular', path: 'popular', icon: TrendingUp },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center space-x-8">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => onPageChange(item.path)}
                className={`flex items-center space-x-2 py-4 px-3 border-b-2 transition-all duration-200 ${
                  isActive
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-600 hover:text-orange-600 hover:border-orange-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;