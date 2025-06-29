import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import RecipeCard from './RecipeCard';
import { Recipe } from '../types';
import { useBookmarks } from '../hooks/useBookmarks';

interface RecipeCarouselProps {
  title: string;
  recipes: Recipe[];
  onRecipeClick: (recipeId: string) => void;
  onLike?: (recipeId: string) => void;
}

const RecipeCarousel: React.FC<RecipeCarouselProps> = ({ 
  title, 
  recipes, 
  onRecipeClick,
  onLike 
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const { isBookmarked, toggleBookmark } = useBookmarks();

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const handleResize = () => checkScrollButtons();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [recipes]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 340;
      const newScrollLeft = scrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  if (recipes.length === 0) return null;

  return (
    <div className="relative group mb-12">
      {/* Section Title */}
      <div className="flex items-center justify-between mb-6 px-4">
        <h2 className="text-3xl font-bold text-gray-900">
          {title}
        </h2>
        <div className="text-sm text-gray-500">
          {recipes.length} recipe{recipes.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
          className={`absolute left-2 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full bg-white shadow-lg transition-all duration-300 ${
            canScrollLeft 
              ? 'opacity-0 group-hover:opacity-100 hover:shadow-xl hover:scale-110 text-gray-700 hover:text-orange-600' 
              : 'opacity-0 cursor-not-allowed'
          }`}
          disabled={!canScrollLeft}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('right')}
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full bg-white shadow-lg transition-all duration-300 ${
            canScrollRight 
              ? 'opacity-0 group-hover:opacity-100 hover:shadow-xl hover:scale-110 text-gray-700 hover:text-orange-600' 
              : 'opacity-0 cursor-not-allowed'
          }`}
          disabled={!canScrollRight}
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Recipes Container */}
        <div
          ref={scrollRef}
          className="flex space-x-6 overflow-x-auto scrollbar-hide px-4 py-2"
          onScroll={checkScrollButtons}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              isSaved={isBookmarked(recipe.id)}
              onSave={() => toggleBookmark(recipe.id)}
              onRecipeClick={onRecipeClick}
              onLike={onLike ? () => onLike(recipe.id) : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecipeCarousel;