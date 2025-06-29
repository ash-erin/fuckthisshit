import React from 'react';
import { X } from 'lucide-react';
import { SearchFilters } from '../types';
import { useFilters } from '../hooks/useFilters';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ 
  isOpen, 
  onClose, 
  filters, 
  onFiltersChange 
}) => {
  const { cuisines, tools, tags, loading } = useFilters();

  const mealTypes = ['Breakfast', 'Snack', 'Lunch', 'Dinner', 'Dessert'];
  const difficultyLevels = ['Easy', 'Medium', 'Hard'];
  const budgetLevels = ['Low', 'Moderate', 'High'];

  const updateFilters = (key: keyof SearchFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = (key: keyof SearchFilters, value: string) => {
    const currentArray = filters[key] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFilters(key, newArray);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      query: '',
      cuisines: [],
      mealTypes: [],
      cookingTimeRange: [0, 300],
      difficulty: [],
      dietaryTags: [],
      tools: [],
      budgetLevel: []
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="absolute right-0 top-0 h-full w-96 bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">Filters</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={clearAllFilters}
              className="text-sm text-orange-400 hover:text-orange-300 transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-gray-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Content */}
        <div className="p-6 overflow-y-auto h-full pb-32">
          {loading ? (
            <div className="text-center text-gray-400">Loading filters...</div>
          ) : (
            <>
              {/* Cuisines */}
              {cuisines.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-white font-semibold mb-3">Cuisines</h3>
                  <div className="flex flex-wrap gap-2">
                    {cuisines.map((cuisine) => (
                      <button
                        key={cuisine}
                        onClick={() => toggleArrayFilter('cuisines', cuisine)}
                        className={`px-3 py-2 rounded-full text-sm transition-all duration-200 ${
                          filters.cuisines.includes(cuisine)
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        {cuisine}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Meal Types */}
              <div className="mb-6">
                <h3 className="text-white font-semibold mb-3">Meal Types</h3>
                <div className="flex flex-wrap gap-2">
                  {mealTypes.map((mealType) => (
                    <button
                      key={mealType}
                      onClick={() => toggleArrayFilter('mealTypes', mealType)}
                      className={`px-3 py-2 rounded-full text-sm transition-all duration-200 ${
                        filters.mealTypes.includes(mealType)
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {mealType}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cooking Time Range */}
              <div className="mb-6">
                <h3 className="text-white font-semibold mb-3">
                  Cooking Time: {filters.cookingTimeRange[0]} - {filters.cookingTimeRange[1]} minutes
                </h3>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="300"
                    value={filters.cookingTimeRange[0]}
                    onChange={(e) => updateFilters('cookingTimeRange', [parseInt(e.target.value), filters.cookingTimeRange[1]])}
                    className="w-full accent-orange-500"
                  />
                  <input
                    type="range"
                    min="0"
                    max="300"
                    value={filters.cookingTimeRange[1]}
                    onChange={(e) => updateFilters('cookingTimeRange', [filters.cookingTimeRange[0], parseInt(e.target.value)])}
                    className="w-full accent-orange-500"
                  />
                </div>
              </div>

              {/* Difficulty */}
              <div className="mb-6">
                <h3 className="text-white font-semibold mb-3">Difficulty</h3>
                <div className="flex flex-wrap gap-2">
                  {difficultyLevels.map((difficulty) => (
                    <button
                      key={difficulty}
                      onClick={() => toggleArrayFilter('difficulty', difficulty)}
                      className={`px-3 py-2 rounded-full text-sm transition-all duration-200 ${
                        filters.difficulty.includes(difficulty)
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {difficulty}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget Level */}
              <div className="mb-6">
                <h3 className="text-white font-semibold mb-3">Budget Level</h3>
                <div className="flex flex-wrap gap-2">
                  {budgetLevels.map((budget) => (
                    <button
                      key={budget}
                      onClick={() => toggleArrayFilter('budgetLevel', budget)}
                      className={`px-3 py-2 rounded-full text-sm transition-all duration-200 ${
                        filters.budgetLevel.includes(budget)
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {budget}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dietary Tags */}
              {tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-white font-semibold mb-3">Dietary Preferences</h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleArrayFilter('dietaryTags', tag)}
                        className={`px-3 py-2 rounded-full text-sm transition-all duration-200 ${
                          filters.dietaryTags.includes(tag)
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tools */}
              {tools.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-white font-semibold mb-3">Required Tools</h3>
                  <div className="flex flex-wrap gap-2">
                    {tools.map((tool) => (
                      <button
                        key={tool}
                        onClick={() => toggleArrayFilter('tools', tool)}
                        className={`px-3 py-2 rounded-full text-sm transition-all duration-200 ${
                          filters.tools.includes(tool)
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        {tool}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;