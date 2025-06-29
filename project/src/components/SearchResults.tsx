import React from 'react';
import { Recipe } from '../types';
import SearchResultItem from './SearchResultItem';
import { useUserPreferences } from '../hooks/useUserPreferences';
import { Search, AlertCircle, Loader2 } from 'lucide-react';

interface SearchResultsProps {
  recipes: Recipe[];
  query: string;
  isLoading: boolean;
  error?: string | null;
  totalResults?: number;
  hasSearched?: boolean;
}

const SearchResults: React.FC<SearchResultsProps> = ({ 
  recipes, 
  query, 
  isLoading, 
  error,
  totalResults = 0,
  hasSearched = false
}) => {
  const { isLiked, isSaved, toggleLike, toggleSave } = useUserPreferences();

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="flex items-center justify-center space-x-3">
            <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
            <span className="text-lg font-medium text-gray-700">Searching recipes...</span>
          </div>
        </div>
        
        {/* Loading skeleton */}
        <div className="mt-8 space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
              <div className="flex">
                <div className="w-32 h-32 bg-gray-200" />
                <div className="flex-1 p-4">
                  <div className="h-5 bg-gray-200 rounded mb-2 w-3/4" />
                  <div className="h-4 bg-gray-200 rounded mb-3 w-full" />
                  <div className="flex space-x-4 mb-3">
                    <div className="h-4 bg-gray-200 rounded w-16" />
                    <div className="h-4 bg-gray-200 rounded w-20" />
                    <div className="h-4 bg-gray-200 rounded w-16" />
                  </div>
                  <div className="h-3 bg-gray-200 rounded mb-3 w-5/6" />
                  <div className="flex justify-between">
                    <div className="h-6 bg-gray-200 rounded w-16" />
                    <div className="h-6 bg-gray-200 rounded w-20" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto bg-white rounded-2xl p-8 shadow-lg border border-red-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Search Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">
            Please try again or adjust your search criteria.
          </p>
        </div>
      </div>
    );
  }

  // No results state
  if (hasSearched && recipes.length === 0 && !isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto bg-white rounded-2xl p-8 shadow-lg">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-orange-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No recipes found</h3>
          <p className="text-gray-600 mb-4">
            {query 
              ? `No recipes match "${query}" with your current filters.`
              : 'No recipes match your current filters.'
            }
          </p>
          <p className="text-sm text-gray-500">
            Try adjusting your search terms or removing some filters to see more results.
          </p>
        </div>
      </div>
    );
  }

  // Results display
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Results Header */}
      <div className="mb-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {query ? (
                <>
                  Search Results for <span className="text-orange-600">"{query}"</span>
                </>
              ) : (
                'Filtered Recipes'
              )}
            </h2>
            <p className="text-gray-600">
              {isLoading ? (
                <span className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Searching...</span>
                </span>
              ) : (
                <>
                  Found <span className="font-semibold text-gray-900">{totalResults}</span> recipe{totalResults !== 1 ? 's' : ''}
                  {recipes.length !== totalResults && (
                    <span className="text-sm text-gray-500 ml-2">
                      (showing first {recipes.length})
                    </span>
                  )}
                </>
              )}
            </p>
          </div>
          
          {/* Real-time indicator */}
          <div className="flex items-center space-x-2 text-sm text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Live results</span>
          </div>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {recipes.map((recipe, index) => (
          <div
            key={recipe.id}
            className="transform transition-all duration-300"
            style={{
              animationDelay: `${index * 50}ms`,
              animation: 'fadeInUp 0.5s ease-out forwards'
            }}
          >
            <SearchResultItem
              recipe={recipe}
              isLiked={isLiked(recipe.id)}
              isSaved={isSaved(recipe.id)}
              onLike={() => toggleLike(recipe.id)}
              onSave={() => toggleSave(recipe.id)}
              searchQuery={query}
            />
          </div>
        ))}
      </div>

      {/* Load more indicator */}
      {recipes.length > 0 && recipes.length < totalResults && (
        <div className="mt-8 text-center">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-gray-600">
              Showing {recipes.length} of {totalResults} results
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Refine your search to see more specific results
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);

export default SearchResults;