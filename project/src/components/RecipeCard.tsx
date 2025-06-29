import React, { useState } from 'react';
import { Clock, Users, Heart, Bookmark, ChefHat, DollarSign } from 'lucide-react';
import { Recipe } from '../types';
import { useRecipeImage } from '../hooks/useRecipeImage';

interface RecipeCardProps {
  recipe: Recipe;
  isSaved: boolean;
  onSave: () => void;
  onRecipeClick: (recipeId: string) => void;
  onLike?: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ 
  recipe, 
  isSaved, 
  onSave,
  onRecipeClick,
  onLike
}) => {
  const { imageUrl, isLoading: imageLoading, hasError: imageError } = useRecipeImage(
    recipe.title,
    recipe.id,
    recipe.image_url
  );

  const getDifficultyColor = (difficulty: string | null) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBudgetColor = (budget: string | null) => {
    switch (budget?.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div 
      className="group relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 min-w-[320px] max-w-[320px] flex-shrink-0 border border-gray-100 cursor-pointer"
      onClick={() => onRecipeClick(recipe.id)}
    >
      {/* Header with Image */}
      <div className="relative h-48 overflow-hidden bg-gray-50">
        {imageLoading && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
            <ChefHat className="w-8 h-8 text-gray-400" />
          </div>
        )}
        
        {imageError || !imageUrl ? (
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
            <ChefHat className="w-12 h-12 text-orange-300" />
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={recipe.title}
            className={`w-full h-full object-cover transition-all duration-300 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onError={() => {
              // This will trigger the useRecipeImage hook to show fallback
              console.warn(`Failed to load image for recipe: ${recipe.title}`);
            }}
          />
        )}
        
        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex space-x-2">
          {onLike && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLike();
              }}
              className="p-2 rounded-full backdrop-blur-sm transition-all duration-200 shadow-sm bg-white/90 text-gray-600 hover:bg-red-50 hover:text-red-500"
            >
              <Heart className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSave();
            }}
            className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 shadow-sm ${
              isSaved 
                ? 'bg-orange-500 text-white' 
                : 'bg-white/90 text-gray-600 hover:bg-orange-50 hover:text-orange-500'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Cuisine Badge */}
        {recipe.cuisine && (
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 bg-white/90 text-gray-800 text-xs font-medium rounded-full backdrop-blur-sm shadow-sm">
              {recipe.cuisine.name}
            </span>
          </div>
        )}

        {/* Like Count */}
        {recipe.like_count !== undefined && recipe.like_count > 0 && (
          <div className="absolute bottom-3 left-3">
            <div className="flex items-center space-x-1 px-2 py-1 bg-black/50 text-white text-xs rounded-full backdrop-blur-sm">
              <Heart className="w-3 h-3 fill-current" />
              <span>{recipe.like_count}</span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-gray-900 font-bold text-lg mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors duration-200">
          {recipe.title}
        </h3>
        
        {/* Description */}
        {recipe.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
            {recipe.description}
          </p>
        )}

        {/* Stats Row */}
        <div className="flex items-center justify-between mb-4 text-sm">
          {recipe.total_time_minutes && (
            <div className="flex items-center space-x-1 text-gray-600">
              <Clock className="w-4 h-4" />
              <span className="font-medium">{recipe.total_time_minutes}m</span>
            </div>
          )}
          {recipe.servings && (
            <div className="flex items-center space-x-1 text-gray-600">
              <Users className="w-4 h-4" />
              <span className="font-medium">{recipe.servings} servings</span>
            </div>
          )}
          {recipe.budget_level && (
            <div className="flex items-center space-x-1">
              <DollarSign className="w-4 h-4 text-gray-500" />
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBudgetColor(recipe.budget_level)}`}>
                {recipe.budget_level}
              </span>
            </div>
          )}
        </div>

        {/* Ingredients Preview */}
        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Ingredients ({recipe.ingredients.length})
            </h4>
            <div className="text-sm text-gray-600">
              {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
                <span key={ingredient.ingredient.id}>
                  {ingredient.ingredient.name}
                  {index < Math.min(2, recipe.ingredients!.length - 1) && ', '}
                </span>
              ))}
              {recipe.ingredients.length > 3 && (
                <span className="text-gray-500"> +{recipe.ingredients.length - 3} more</span>
              )}
            </div>
          </div>
        )}

        {/* Tags and Difficulty */}
        <div className="flex items-center justify-between">
          {/* Difficulty & Meal Type */}
          <div className="flex items-center space-x-2">
            {recipe.difficulty && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                {recipe.difficulty}
              </span>
            )}
            {recipe.meal_type && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                {recipe.meal_type}
              </span>
            )}
          </div>

          {/* Dietary Tags */}
          {recipe.tags && recipe.tags.length > 0 && (
            <div className="flex items-center space-x-1">
              {recipe.tags.slice(0, 2).map((tagItem) => (
                <span
                  key={tagItem.tag.id}
                  className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full"
                >
                  {tagItem.tag.name}
                </span>
              ))}
              {recipe.tags.length > 2 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                  +{recipe.tags.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;