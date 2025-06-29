import React, { useState, useEffect } from 'react';
import { Search, Bell, ChevronDown, User } from 'lucide-react';
import { Movie } from '../types';

interface HeaderProps {
  onSearch: (query: string) => void;
  onProfileClick: () => void;
  onNotificationClick: () => void;
  onLogoClick: () => void;
  isScrolled: boolean;
  searchSuggestions?: Movie[];
  onMovieSelect?: (movie: Movie) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onSearch, 
  onProfileClick, 
  onNotificationClick,
  onLogoClick,
  isScrolled,
  searchSuggestions = [],
  onMovieSelect
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
    setIsSearchOpen(false);
    setShowSuggestions(false);
  };

  const handleInputChange = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
    setShowSuggestions(value.length > 0);
  };

  const handleSuggestionClick = (movie: Movie) => {
    setSearchQuery('');
    setIsSearchOpen(false);
    setShowSuggestions(false);
    onMovieSelect?.(movie);
  };

  const handleMyListClick = () => {
    const myListElement = document.getElementById('mylist-section');
    if (myListElement) {
      myListElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handlePopularClick = () => {
    const mostPopularElement = document.querySelector('[data-section="most-popular"]');
    if (mostPopularElement) {
      // Get the title element within the section
      const titleElement = mostPopularElement.querySelector('h2');
      if (titleElement) {
        // Calculate offset to account for fixed header
        const headerHeight = 80; // Approximate header height
        const elementTop = titleElement.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementTop - headerHeight;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      } else {
        // Fallback to section scroll if title not found
        mostPopularElement.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };

  const handleHomeClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSearchQuery('');
    onSearch(''); // Clear search results
  };

  const handleLogoClick = () => {
    // Refresh the page when logo is clicked
    window.location.reload();
  };

  const handleNavItemClick = (item: string) => {
    // Clear search first
    setSearchQuery('');
    onSearch('');
    
    // Then handle navigation
    if (item === 'My List') {
      setTimeout(() => {
        const myListElement = document.getElementById('mylist-section');
        if (myListElement) {
          myListElement.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);
    } else if (item === 'Popular') {
      setTimeout(() => {
        const mostPopularElement = document.querySelector('[data-section="most-popular"]');
        if (mostPopularElement) {
          const titleElement = mostPopularElement.querySelector('h2');
          if (titleElement) {
            const headerHeight = 80;
            const elementTop = titleElement.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementTop - headerHeight;
            
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          } else {
            mostPopularElement.scrollIntoView({ 
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
      }, 100);
    } else if (item === 'Home') {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    } else if (item === 'Practical Information') {
      setTimeout(() => {
        const contentRows = document.querySelectorAll('[data-content-row]');
        if (contentRows.length >= 2) {
          const secondRow = contentRows[1];
          const titleElement = secondRow.querySelector('h2');
          if (titleElement) {
            const headerHeight = 80;
            const elementTop = titleElement.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementTop - headerHeight;
            
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }
      }, 100);
    }
  };

  const navItems = ['Home', 'Popular', 'My List', 'Practical Information'];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'backdrop-blur-md' : 'bg-gradient-to-b to-transparent'
    }`} style={{ backgroundColor: isScrolled ? 'rgba(8, 25, 50, 0.9)' : 'rgba(8, 25, 50, 0.8)' }}>
      <div className="flex items-center justify-between px-4 md:px-8 py-4">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleLogoClick}
              className="transition-opacity hover:opacity-80"
            >
              <img 
                src="/src/assets/image copy.png" 
                alt="SKÀ Logo" 
                className="h-10 w-auto"
                style={{ transform: 'scale(1.6)' }}
              />
            </button>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item, index) => (
              <button
                key={item}
                onClick={() => handleNavItemClick(item)}
                className="text-white hover:text-gray-300 transition-colors text-base font-medium px-2 py-1"
              >
                {item}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            {isSearchOpen ? (
              <div className="relative">
                <form onSubmit={handleSearch} className="flex items-center">
                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onBlur={() => {
                      setTimeout(() => {
                        if (!searchQuery) setIsSearchOpen(false);
                        setShowSuggestions(false);
                      }, 200);
                    }}
                    onFocus={() => searchQuery && setShowSuggestions(true)}
                    placeholder="Search titles..."
                    className="border border-gray-600 rounded px-3 py-1 text-white text-sm w-64 focus:outline-none"
                    style={{ backgroundColor: 'rgba(8, 25, 50, 0.8)', borderColor: '#6b7280' }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#ddb870'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#6b7280'}
                  />
                </form>
                
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 backdrop-blur-md border border-gray-700 rounded-md shadow-xl max-h-80 overflow-y-auto z-50" style={{ backgroundColor: 'rgba(8, 25, 50, 0.95)' }}>
                    {searchSuggestions.slice(0, 6).map((movie) => (
                      <div
                        key={movie.id}
                        onClick={() => handleSuggestionClick(movie)}
                        className="flex items-center space-x-3 p-3 cursor-pointer transition-colors"
                        style={{ ':hover': { backgroundColor: 'rgba(15, 47, 95, 0.5)' } }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(15, 47, 95, 0.5)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <img
                          src={movie.thumbnail}
                          alt={movie.title}
                          className="w-12 h-8 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white text-sm font-medium truncate">
                            {movie.title}
                          </h4>
                          <p className="text-white/60 text-xs">
                            {movie.genre.slice(0, 2).join(', ')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-white hover:text-gray-300 transition-colors p-2"
              >
                <Search size={20} />
              </button>
            )}
          </div>

          <button 
            onClick={onNotificationClick}
            className="text-white hover:text-gray-300 transition-colors p-2 relative"
          >
            <Bell size={20} />
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full" style={{ backgroundColor: '#ddb870' }}></div>
          </button>

          <button
            onClick={onProfileClick}
            className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors"
          >
            <div className="w-8 h-8 rounded flex items-center justify-center" style={{ backgroundColor: '#ddb870' }}>
              <User size={16} />
            </div>
            <ChevronDown size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};