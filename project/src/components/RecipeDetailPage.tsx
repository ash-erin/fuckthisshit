import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Users, 
  ChefHat, 
  DollarSign, 
  Heart, 
  Bookmark, 
  ArrowLeft
} from 'lucide-react';
import { Recipe } from '../types';
import { useBookmarks } from '../hooks/useBookmarks';
import { useRecipeImage } from '../hooks/useRecipeImage';

interface RecipeDetailPageProps {
  recipe: Recipe | null;
  onBack: () => void;
  onLike?: () => void;
  loading?: boolean;
}

const RecipeDetailPage: React.FC<RecipeDetailPageProps> = ({ 
  recipe, 
  onBack, 
  onLike,
  loading = false 
}) => {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { imageUrl, isLoading: imageLoading, hasError: imageError } = useRecipeImage(
    recipe?.title || '',
    recipe?.id,
    recipe?.image_url
  );

  const getDifficultyColor = (difficulty: string | null) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'hard': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-32 mb-6" />
            <div className="h-80 bg-gray-200 rounded-lg mb-8" />
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-full mb-2" />
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded" />
                ))}
              </div>
              <div className="space-y-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Recipe not found</h2>
          <p className="text-gray-600 mb-4">The recipe you're looking for doesn't exist.</p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to recipes</span>
        </button>

        {/* Recipe Image */}
        <div className="relative h-80 rounded-lg overflow-hidden mb-6 bg-gray-100">
          {imageLoading && (
            <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
              <ChefHat className="w-16 h-16 text-gray-400" />
            </div>
          )}
          
          {imageError || !imageUrl ? (
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
              <ChefHat className="w-16 h-16 text-orange-300" />
            </div>
          ) : (
            <img
              src={imageUrl}
              alt={recipe.title}
              className={`w-full h-full object-cover transition-all duration-300 ${
                imageLoading ? 'opacity-0' : 'opacity-100'
              }`}
              onError={() => {
                console.warn(`Failed to load image for recipe: ${recipe.title}`);
              }}
            />
          )}
          
          {/* Action Buttons Overlay */}
          <div className="absolute top-4 right-4 flex space-x-2">
            {onLike && (
              <button
                onClick={onLike}
                className="p-3 rounded-full bg-white/90 text-gray-600 hover:bg-red-50 hover:text-red-500 transition-all duration-200 backdrop-blur-sm shadow-sm"
              >
                <Heart className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={() => toggleBookmark(recipe.id)}
              className={`p-3 rounded-full transition-all duration-200 backdrop-blur-sm shadow-sm ${
                isBookmarked(recipe.id)
                  ? 'bg-orange-500 text-white'
                  : 'bg-white/90 text-gray-600 hover:bg-orange-50 hover:text-orange-500'
              }`}
            >
              <Bookmark className={`w-5 h-5 ${isBookmarked(recipe.id) ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Like Count Badge */}
          {recipe.like_count !== undefined && recipe.like_count > 0 && (
            <div className="absolute top-4 left-4">
              <div className="flex items-center space-x-1 px-3 py-2 bg-white/90 text-gray-800 rounded-full backdrop-blur-sm shadow-sm">
                <Heart className="w-4 h-4 text-red-500 fill-current" />
                <span className="font-medium">{recipe.like_count}</span>
                <span className="text-sm text-gray-600">LIKES</span>
              </div>
            </div>
          )}
        </div>

        {/* Recipe Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{recipe.title}</h1>
        
        {/* Cuisine */}
        {recipe.cuisine && (
          <p className="text-lg text-gray-600 mb-6">
            <span className="font-medium">{recipe.cuisine.name}</span> cuisine
          </p>
        )}

        {/* Description */}
        {recipe.description && (
          <p className="text-gray-700 text-lg leading-relaxed mb-8">{recipe.description}</p>
        )}

        {/* Recipe Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 py-6 border-t border-b border-gray-200">
          {recipe.total_time_minutes && (
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">{recipe.total_time_minutes}</div>
              <div className="text-sm text-gray-600 uppercase tracking-wide">MINUTES</div>
            </div>
          )}
          {recipe.servings && (
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">{recipe.servings}</div>
              <div className="text-sm text-gray-600 uppercase tracking-wide">SERVINGS</div>
            </div>
          )}
          {recipe.difficulty && (
            <div className="text-center">
              <div className={`text-2xl font-bold mb-1 ${getDifficultyColor(recipe.difficulty)}`}>
                {recipe.difficulty}
              </div>
              <div className="text-sm text-gray-600 uppercase tracking-wide">DIFFICULTY</div>
            </div>
          )}
          {recipe.budget_level && (
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">{recipe.budget_level}</div>
              <div className="text-sm text-gray-600 uppercase tracking-wide">BUDGET</div>
            </div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Ingredients */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide mb-6">INGREDIENTS</h2>
            {recipe.ingredients && recipe.ingredients.length > 0 ? (
              <div className="space-y-3">
                {recipe.ingredients.map((ingredient, index) => (
                  <div key={ingredient.ingredient.id} className="flex justify-between items-start py-2 border-b border-gray-100 last:border-b-0">
                    <div className="flex-1">
                      <span className="text-gray-900 font-medium">
                        {ingredient.ingredient.name}
                      </span>
                      {ingredient.descriptor && (
                        <span className="text-gray-500 text-sm ml-2">
                          ({ingredient.descriptor})
                        </span>
                      )}
                      {ingredient.is_optional && (
                        <span className="text-orange-500 text-sm ml-2 font-medium">
                          optional
                        </span>
                      )}
                    </div>
                    {ingredient.amount && (
                      <span className="text-gray-700 font-medium ml-4">
                        {ingredient.amount}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No ingredients listed</p>
            )}

            {/* Tools */}
            {recipe.tools && recipe.tools.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-4">TOOLS</h3>
                <div className="space-y-2">
                  {recipe.tools.map((tool) => (
                    <div key={tool.tool.id} className="flex items-center justify-between py-1">
                      <span className="text-gray-900">{tool.tool.name}</span>
                      {tool.essential === false && (
                        <span className="text-orange-500 text-sm font-medium">optional</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Directions */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide mb-6">DIRECTIONS</h2>
            {recipe.steps && recipe.steps.length > 0 ? (
              <div className="space-y-6">
                {recipe.steps.map((step) => (
                  <div key={step.id} className="flex space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {step.step_number}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700 leading-relaxed">{step.instruction}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No instructions provided</p>
            )}
          </div>
        </div>

        {/* Notes */}
        {recipe.notes && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide mb-4">NOTES</h2>
            <p className="text-gray-700 leading-relaxed">{recipe.notes}</p>
          </div>
        )}

        {/* Tags */}
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-4">DIETARY INFORMATION</h3>
            <div className="flex flex-wrap gap-2">
              {recipe.tags.map((tagItem) => (
                <span
                  key={tagItem.tag.id}
                  className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full"
                >
                  {tagItem.tag.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeDetailPage;