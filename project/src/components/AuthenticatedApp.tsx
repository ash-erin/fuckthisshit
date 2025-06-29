import React, { useState } from 'react';
import { useRecipes } from '../hooks/useRecipes';
import { useRealtimeSearch } from '../hooks/useRealtimeSearch';
import { useBookmarks } from '../hooks/useBookmarks';
import { SearchFilters } from '../types';
import Header from './Header';
import Navigation from './Navigation';
import FilterPanel from './FilterPanel';
import RecipeCarousel from './RecipeCarousel';
import SearchResults from './SearchResults';
import BookmarksPage from './BookmarksPage';
import RecipeDetailPage from './RecipeDetailPage';
import RecipeCard from './RecipeCard';
import LoadingSpinner from './LoadingSpinner';
import DashboardHome from './dashboard/DashboardHome';
import ProfilePage from './dashboard/ProfilePage';
import SettingsPage from './dashboard/SettingsPage';
import ActivityPage from './dashboard/ActivityPage';
import DashboardLayout from './dashboard/DashboardLayout';

type AppPage = 'home' | 'search' | 'bookmarks' | 'popular' | 'recipe-detail' | 'dashboard' | 'profile' | 'settings' | 'activity';

const AuthenticatedApp: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<AppPage>('home');
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    query: '',
    cuisines: [],
    mealTypes: [],
    cookingTimeRange: [0, 300],
    difficulty: [],
    dietaryTags: [],
    tools: [],
    budgetLevel: []
  });

  const { recipes, loading, error, getRecipesByCuisine, getMostPopularRecipes } = useRecipes();
  const { searchResults, isSearching, searchError, hasSearched, totalResults } = useRealtimeSearch(searchFilters);
  const { toggleBookmark } = useBookmarks();

  const handleRecipeClick = async (recipeId: string) => {
    setSelectedRecipeId(recipeId);
    setCurrentPage('recipe-detail');
  };

  const handleBackToRecipes = () => {
    setSelectedRecipeId(null);
    setCurrentPage('home');
  };

  const handleSearchChange = (query: string) => {
    setSearchFilters(prev => ({ ...prev, query }));
    if (query.trim() || hasActiveFilters()) {
      setCurrentPage('search');
    }
  };

  const handleFiltersChange = (filters: SearchFilters) => {
    setSearchFilters(filters);
    if (filters.query.trim() || hasActiveFilters(filters)) {
      setCurrentPage('search');
    }
  };

  const hasActiveFilters = (filters = searchFilters) => {
    return filters.cuisines.length > 0 ||
           filters.mealTypes.length > 0 ||
           filters.difficulty.length > 0 ||
           filters.dietaryTags.length > 0 ||
           filters.tools.length > 0 ||
           filters.budgetLevel.length > 0 ||
           filters.cookingTimeRange[0] > 0 ||
           filters.cookingTimeRange[1] < 300;
  };

  const handlePageChange = (page: string) => {
    setCurrentPage(page as AppPage);
    if (page !== 'search') {
      setSearchFilters({
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

  const handleUserIconClick = () => {
    setCurrentPage('dashboard');
  };

  // Dashboard pages
  const isDashboardPage = ['dashboard', 'profile', 'settings', 'activity'].includes(currentPage);

  if (isDashboardPage) {
    const renderDashboardPage = () => {
      switch (currentPage) {
        case 'dashboard':
          return <DashboardHome />;
        case 'profile':
          return <ProfilePage />;
        case 'settings':
          return <SettingsPage />;
        case 'activity':
          return <ActivityPage />;
        default:
          return <DashboardHome />;
      }
    };

    return (
      <DashboardLayout 
        currentPage={currentPage} 
        onPageChange={setCurrentPage}
      >
        {renderDashboardPage()}
      </DashboardLayout>
    );
  }

  // Recipe detail page
  if (currentPage === 'recipe-detail' && selectedRecipeId) {
    return (
      <RecipeDetailPage
        recipe={null}
        onBack={handleBackToRecipes}
        loading={true}
      />
    );
  }

  // Main recipe browsing interface
  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onSearchChange={handleSearchChange}
        onFilterToggle={() => setIsFilterPanelOpen(true)}
        onUserIconClick={handleUserIconClick}
        searchQuery={searchFilters.query}
        showSearch={currentPage !== 'bookmarks'}
      />
      
      <Navigation
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />

      <FilterPanel
        isOpen={isFilterPanelOpen}
        onClose={() => setIsFilterPanelOpen(false)}
        filters={searchFilters}
        onFiltersChange={handleFiltersChange}
      />

      <main className="pb-8">
        {loading && currentPage === 'home' && <LoadingSpinner />}
        
        {error && currentPage === 'home' && (
          <div className="container mx-auto px-4 py-16 text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-600">Error loading recipes: {error}</p>
            </div>
          </div>
        )}

        {currentPage === 'home' && !loading && !error && (
          <div className="container mx-auto px-4 py-8">
            {getRecipesByCuisine().map((cuisineCarousel) => (
              <RecipeCarousel
                key={cuisineCarousel.cuisine}
                title={`${cuisineCarousel.cuisine} Cuisine`}
                recipes={cuisineCarousel.recipes}
                onRecipeClick={handleRecipeClick}
              />
            ))}
          </div>
        )}

        {currentPage === 'search' && (
          <SearchResults
            recipes={searchResults}
            query={searchFilters.query}
            isLoading={isSearching}
            error={searchError}
            totalResults={totalResults}
            hasSearched={hasSearched}
          />
        )}

        {currentPage === 'bookmarks' && (
          <BookmarksPage
            recipes={recipes}
            onRecipeClick={handleRecipeClick}
          />
        )}

        {currentPage === 'popular' && (
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Most Popular Recipes</h1>
              <p className="text-gray-600">Discover the recipes our community loves most</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {getMostPopularRecipes().map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  isSaved={false}
                  onSave={() => toggleBookmark(recipe.id)}
                  onRecipeClick={handleRecipeClick}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AuthenticatedApp;