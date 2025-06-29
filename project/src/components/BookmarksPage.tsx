import React from 'react';
import { Recipe } from '../types';
import RecipeCard from './RecipeCard';
import { useBookmarks } from '../hooks/useBookmarks';
import { Bookmark } from 'lucide-react';

interface BookmarksPageProps {
  recipes: Recipe[];
  onRecipeClick: (recipeId: string) => void;
  onLike?: (recipeId: string) => void;
}

const BookmarksPage: React.FC<BookmarksPageProps> = ({ 
  recipes, 
  onRecipeClick,
  onLike 
}) => {
  const { bookmarkedRecipeIds, toggleBookmark } = useBookmarks();

  const bookmarkedRecipes = recipes.filter(recipe => 
    bookmarkedRecipeIds.includes(recipe.id)
  );

  if (bookmarkedRecipes.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-md mx-auto">
          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Bookmark className="w-12 h-12 text-orange-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Bookmarks Yet</h2>
          <p className="text-gray-600 mb-6">
            Start exploring recipes and bookmark your favorites to see them here.
          </p>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-500">
              💡 Tip: Click the bookmark icon on any recipe card to save it to your collection.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
            <Bookmark className="w-5 h-5 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">My Bookmarks</h1>
        </div>
        <p className="text-gray-600">
          You have {bookmarkedRecipes.length} saved recipe{bookmarkedRecipes.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Bookmarked Recipes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {bookmarkedRecipes.map((recipe) => (
          <div key={recipe.id} className="w-full max-w-none">
            <RecipeCard
              recipe={recipe}
              isSaved={true}
              onSave={() => toggleBookmark(recipe.id)}
              onRecipeClick={onRecipeClick}
              onLike={onLike ? () => onLike(recipe.id) : undefined}
            />
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="mt-12 bg-gray-50 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Collection Stats</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {bookmarkedRecipes.length}
            </div>
            <div className="text-sm text-gray-600">Total Recipes</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {new Set(bookmarkedRecipes.map(r => r.cuisine?.name).filter(Boolean)).size}
            </div>
            <div className="text-sm text-gray-600">Cuisines</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {bookmarkedRecipes.reduce((sum, recipe) => sum + (recipe.like_count || 0), 0)}
            </div>
            <div className="text-sm text-gray-600">Total Likes</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookmarksPage;