import React, { useState } from 'react';
import { Clock, Users, Heart, Bookmark, ChefHat, DollarSign } from 'lucide-react';
import { Recipe } from '../types';
import { useRecipeImage } from '../hooks/useRecipeImage';

interface SearchResultItemProps {
  recipe: Recipe;
  isLiked: boolean;
  isSaved: boolean;
  onLike: () => void;
  onSave: () => void;
  searchQuery: string;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({
  recipe,
  isLiked,
  isSaved,
  onLike,
  onSave,
  searchQuery
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

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 text-yellow-900 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-1">
      <div className="flex">
        {/* Image */}
        <div className="relative w-32 h-32 flex-shrink-0 bg-gray-50">
          {imageLoading && (
            <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
              <ChefHat className="w-8 h-8 text-gray-400" />
            </div>
          )}
          
          {imageError || !imageUrl ? (
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
              <ChefHat className="w-8 h-8 text-orange-300" />
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
          
          {/* Cuisine Badge */}
          {recipe.cuisine && (
            <div className="absolute top-2 left-2">
              <span className="px-2 py-1 bg-white/90 text-gray-800 text-xs font-medium rounded-full backdrop-blur-sm shadow-sm">
                {recipe.cuisine.name}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-4">
          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
            {highlightText(recipe.title, searchQuery)}
          </h3>
          
          {/* Description */}
          {recipe.description && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
              {highlightText(recipe.description, searchQuery)}
            </p>
          )}

          {/* Stats Row */}
          <div className="flex items-center space-x-4 mb-3 text-sm">
            {recipe.total_time_minutes && (
              <div className="flex items-center space-x-1 text-gray-600">
                <Clock className="w-4 h-4" />
                <span className="font-medium">{recipe.total_time_minutes}m</span>
              </div>
            )}
            {recipe.servings && (
              <div className="flex items-center space-x-1 text-gray-600">
                <Users className="w-4 h-4" />
                <span className="font-medium">{recipe.servings}</span>
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
            <div className="mb-3">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Ingredients: </span>
                {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
                  <span key={ingredient.ingredient.id}>
                    {highlightText(ingredient.ingredient.name, searchQuery)}
                    {index < Math.min(2, recipe.ingredients!.length - 1) && ', '}
                  </span>
                ))}
                {recipe.ingredients.length > 3 && (
                  <span className="text-gray-500"> +{recipe.ingredients.length - 3} more</span>
                )}
              </div>
            </div>
          )}

          {/* Bottom Row */}
          <div className="flex items-center justify-between">
            {/* Tags and Difficulty */}
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
              {recipe.tags && recipe.tags.length > 0 && (
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  {recipe.tags[0].tag.name}
                  {recipe.tags.length > 1 && ` +${recipe.tags.length - 1}`}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {/* Like Count */}
              {recipe.like_count !== undefined && recipe.like_count > 0 && (
                <div className="flex items-center space-x-1 text-gray-500 text-sm">
                  <Heart className="w-4 h-4" />
                  <span>{recipe.like_count}</span>
                </div>
              )}
              
              {/* Like Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onLike();
                }}
                className={`p-2 rounded-full transition-all duration-200 ${
                  isLiked 
                    ? 'bg-red-50 text-red-500' 
                    : 'bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-500'
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              </button>
              
              {/* Bookmark Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSave();
                }}
                className={`p-2 rounded-full transition-all duration-200 ${
                  isSaved 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-50 text-gray-600 hover:bg-orange-50 hover:text-orange-500'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultItem;