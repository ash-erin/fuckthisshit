import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import RecipeCarousel from './components/RecipeCarousel';
import FilterPanel from './components/FilterPanel';
import SearchResults from './components/SearchResults';
import BookmarksPage from './components/BookmarksPage';
import RecipeDetailPage from './components/RecipeDetailPage';
import LoadingSpinner from './components/LoadingSpinner';
import { useRecipes } from './hooks/useRecipes';
import { useRealtimeSearch } from './hooks/useRealtimeSearch';
import { useBookmarks } from './hooks/useBookmarks';
import { SearchFilters, Recipe } from './types';

const App: React.FC = () => {
  const { 
    recipes, 
    loading, 
    error, 
    getRecipesByCuisine, 
    getMostPopularRecipes,
    getRecipeById 
  } = useRecipes();
  
  const { bookmarkedRecipeIds } = useBookmarks();
  
  const [currentPage, setCurrentPage] = useState('home');
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const [recipeLoading, setRecipeLoading] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    cuisines: [],
    mealTypes: [],
    cookingTimeRange: [0, 300],
    difficulty: [],
    dietaryTags: [],
    tools: [],
    budgetLevel: []
  });

  // Update filters when search query changes
  useEffect(() => {
    setFilters(prev => ({ ...prev, query: searchQuery }));
  }, [searchQuery]);

  // Use real-time search hook
  const { 
    searchResults, 
    isSearching, 
    searchError, 
    hasSearched, 
    totalResults 
  } = useRealtimeSearch(filters);

  // Memoized cuisine carousels
  const cuisineCarousels = useMemo(() => {
    return getRecipesByCuisine();
  }, [getRecipesByCuisine]);

  // Memoized popular recipes
  const popularRecipes = useMemo(() => {
    return getMostPopularRecipes(10);
  }, [getMostPopularRecipes]);

  // Memoized bookmarked recipes
  const bookmarkedRecipes = useMemo(() => {
    return recipes.filter(recipe => bookmarkedRecipeIds.includes(recipe.id));
  }, [recipes, bookmarkedRecipeIds]);

  const isSearchActive = searchQuery || filters.cuisines.length > 0 || filters.mealTypes.length > 0 || 
                        filters.difficulty.length > 0 || filters.dietaryTags.length > 0 || 
                        filters.tools.length > 0 || filters.budgetLevel.length > 0 ||
                        filters.cookingTimeRange[0] > 0 || filters.cookingTimeRange[1] < 300;

  // Handle recipe click
  const handleRecipeClick = async (recipeId: string) => {
    setCurrentPage('recipe');
    setRecipeLoading(true);
    
    try {
      const recipe = await getRecipeById(recipeId);
      setCurrentRecipe(recipe);
    } catch (error) {
      console.error('Error loading recipe:', error);
      setCurrentRecipe(null);
    } finally {
      setRecipeLoading(false);
    }
  };

  // Handle back from recipe
  const handleBackFromRecipe = () => {
    setCurrentPage('home');
    setCurrentRecipe(null);
  };

  // Handle page changes
  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    setCurrentRecipe(null);
    
    // Clear search when navigating away from search page
    if (page !== 'search') {
      setSearchQuery('');
      setFilters({
        query: '',
        cuisines: [],
        mealTypes: [],
        cookingTimeRange: [0, 300],
        difficulty: [],
        dietaryTags: [],
        tools: [],
        budgetLevel: []
      });
    }
  };

  // Mock like function (in real app, this would update the database)
  const handleLike = (recipeId: string) => {
    console.log('Liked recipe:', recipeId);
    // In a real app, you would increment the like count in the database
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl p-8 shadow-lg max-w-md mx-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Recipes</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">
            Make sure your Supabase connection is configured properly.
          </p>
        </div>
      </div>
    );
  }

  // Recipe detail page
  if (currentPage === 'recipe') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header
          searchQuery=""
          onSearchChange={() => {}}
          onFilterToggle={() => {}}
          showSearch={false}
        />
        <RecipeDetailPage
          recipe={currentRecipe}
          onBack={handleBackFromRecipe}
          onLike={currentRecipe ? () => handleLike(currentRecipe.id) : undefined}
          loading={recipeLoading}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onFilterToggle={() => setIsFilterOpen(true)}
        showSearch={currentPage === 'search' || currentPage === 'home'}
      />

      <Navigation
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />

      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
      />

      <main className="pb-8">
        {/* Home Page */}
        {currentPage === 'home' && (
          <>
            {isSearchActive ? (
              <SearchResults
                recipes={searchResults}
                query={searchQuery}
                isLoading={isSearching}
                error={searchError}
                totalResults={totalResults}
                hasSearched={hasSearched}
              />
            ) : (
              <div className="space-y-8 pt-8">
                {/* Hero Section */}
                <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-red-500 to-pink-600">
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="container mx-auto px-4 py-20 text-center relative">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                      Discover Your Next
                      <span className="block bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
                        Culinary Adventure
                      </span>
                    </h1>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                      Explore thousands of recipes from around the world with real-time search and live updates.
                    </p>
                  </div>
                </div>

                {/* Featured Carousels */}
                <div className="container mx-auto">
                  {/* Most Popular Recipes */}
                  {popularRecipes.length > 0 && (
                    <RecipeCarousel
                      title="🔥 Most Popular"
                      recipes={popularRecipes}
                      onRecipeClick={handleRecipeClick}
                      onLike={handleLike}
                    />
                  )}

                  {/* My Bookmarks */}
                  {bookmarkedRecipes.length > 0 && (
                    <RecipeCarousel
                      title="📚 My List"
                      recipes={bookmarkedRecipes}
                      onRecipeClick={handleRecipeClick}
                      onLike={handleLike}
                    />
                  )}

                  {/* Cuisine Carousels */}
                  {cuisineCarousels.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md mx-auto">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No recipes found</h3>
                        <p className="text-gray-600">
                          Connect to your Supabase database and add some recipes to get started.
                        </p>
                      </div>
                    </div>
                  ) : (
                    cuisineCarousels.map((carousel) => (
                      <RecipeCarousel
                        key={carousel.cuisine}
                        title={`${carousel.cuisine} Cuisine`}
                        recipes={carousel.recipes}
                        onRecipeClick={handleRecipeClick}
                        onLike={handleLike}
                      />
                    ))
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* Search Page */}
        {currentPage === 'search' && (
          <SearchResults
            recipes={searchResults}
            query={searchQuery}
            isLoading={isSearching}
            error={searchError}
            totalResults={totalResults}
            hasSearched={hasSearched}
          />
        )}

        {/* Bookmarks Page */}
        {currentPage === 'bookmarks' && (
          <BookmarksPage
            recipes={recipes}
            onRecipeClick={handleRecipeClick}
            onLike={handleLike}
          />
        )}

        {/* Popular Page */}
        {currentPage === 'popular' && (
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">🔥 Most Popular Recipes</h1>
              <p className="text-gray-600">
                Discover the most loved recipes in our community
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {popularRecipes.map((recipe) => (
                <div key={recipe.id} className="w-full max-w-none">
                  <RecipeCard
                    recipe={recipe}
                    isSaved={bookmarkedRecipeIds.includes(recipe.id)}
                    onSave={() => {}} // Handled by useBookmarks hook
                    onRecipeClick={handleRecipeClick}
                    onLike={() => handleLike(recipe.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;