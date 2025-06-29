import { useState, useEffect, useCallback } from 'react';
import { Recipe, CuisineCarousel, SearchFilters } from '../types';
import { supabase } from '../lib/supabase';

export const useRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [cuisines, setCuisines] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: recipesData, error: recipesError } = await supabase
        .from('recipes')
        .select(`
          *,
          cuisine:cuisines(id, name),
          ingredients:recipe_ingredients(
            amount,
            descriptor,
            is_optional,
            ingredient:ingredients(id, name)
          ),
          tools:recipe_tools(
            essential,
            tool:tools(id, name)
          ),
          tags:recipe_tags(
            tag:tags(id, name)
          ),
          steps:recipe_steps(
            id,
            step_number,
            instruction
          )
        `)
        .order('created_at', { ascending: false });

      if (recipesError) {
        throw recipesError;
      }

      const formattedRecipes: Recipe[] = (recipesData || []).map(recipe => ({
        ...recipe,
        like_count: Math.floor(Math.random() * 100), // Mock like count for demo
        ingredients: recipe.ingredients || [],
        tools: recipe.tools || [],
        tags: recipe.tags || [],
        steps: (recipe.steps || []).sort((a, b) => (a.step_number || 0) - (b.step_number || 0))
      }));

      setRecipes(formattedRecipes);

      // Fetch unique cuisines
      const { data: cuisinesData, error: cuisinesError } = await supabase
        .from('cuisines')
        .select('name')
        .order('name');

      if (cuisinesError) {
        throw cuisinesError;
      }

      setCuisines(cuisinesData?.map(c => c.name) || []);

    } catch (err) {
      console.error('Error fetching recipes:', err);
      setError(err instanceof Error ? err.message : 'Failed to load recipes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const getRecipesByCuisine = useCallback((): CuisineCarousel[] => {
    return cuisines.map(cuisineName => ({
      cuisine: cuisineName,
      recipes: recipes.filter(recipe => recipe.cuisine?.name === cuisineName)
    })).filter(carousel => carousel.recipes.length > 0);
  }, [recipes, cuisines]);

  const getMostPopularRecipes = useCallback((limit: number = 10): Recipe[] => {
    return [...recipes]
      .sort((a, b) => (b.like_count || 0) - (a.like_count || 0))
      .slice(0, limit);
  }, [recipes]);

  const getRecipeById = useCallback(async (id: string): Promise<Recipe | null> => {
    try {
      const { data: recipeData, error } = await supabase
        .from('recipes')
        .select(`
          *,
          cuisine:cuisines(id, name),
          ingredients:recipe_ingredients(
            amount,
            descriptor,
            is_optional,
            ingredient:ingredients(id, name)
          ),
          tools:recipe_tools(
            essential,
            tool:tools(id, name)
          ),
          tags:recipe_tags(
            tag:tags(id, name)
          ),
          steps:recipe_steps(
            id,
            step_number,
            instruction
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      if (!recipeData) return null;

      return {
        ...recipeData,
        like_count: Math.floor(Math.random() * 100), // Mock like count for demo
        ingredients: recipeData.ingredients || [],
        tools: recipeData.tools || [],
        tags: recipeData.tags || [],
        steps: (recipeData.steps || []).sort((a, b) => (a.step_number || 0) - (b.step_number || 0))
      };
    } catch (error) {
      console.error('Error fetching recipe:', error);
      return null;
    }
  }, []);

  const searchRecipes = useCallback((filters: SearchFilters): Recipe[] => {
    return recipes.filter(recipe => {
      // Query search
      const matchesQuery = !filters.query || 
        recipe.title.toLowerCase().includes(filters.query.toLowerCase()) ||
        recipe.description?.toLowerCase().includes(filters.query.toLowerCase()) ||
        recipe.ingredients?.some(ri => 
          ri.ingredient.name.toLowerCase().includes(filters.query.toLowerCase())
        );

      // Cuisine filter
      const matchesCuisine = filters.cuisines.length === 0 || 
        (recipe.cuisine && filters.cuisines.includes(recipe.cuisine.name));

      // Meal type filter
      const matchesMealType = filters.mealTypes.length === 0 || 
        (recipe.meal_type && filters.mealTypes.includes(recipe.meal_type));

      // Cooking time filter
      const cookingTime = recipe.total_time_minutes || 0;
      const matchesCookingTime = cookingTime >= filters.cookingTimeRange[0] && 
        cookingTime <= filters.cookingTimeRange[1];

      // Difficulty filter
      const matchesDifficulty = filters.difficulty.length === 0 || 
        (recipe.difficulty && filters.difficulty.includes(recipe.difficulty));

      // Budget level filter
      const matchesBudget = filters.budgetLevel.length === 0 || 
        (recipe.budget_level && filters.budgetLevel.includes(recipe.budget_level));

      // Dietary tags filter
      const matchesDietaryTags = filters.dietaryTags.length === 0 || 
        filters.dietaryTags.every(tag => 
          recipe.tags?.some(rt => rt.tag.name === tag)
        );

      // Tools filter
      const matchesTools = filters.tools.length === 0 || 
        filters.tools.every(tool => 
          recipe.tools?.some(rt => rt.tool.name === tool)
        );

      return matchesQuery && matchesCuisine && matchesMealType && 
             matchesCookingTime && matchesDifficulty && matchesBudget &&
             matchesDietaryTags && matchesTools;
    });
  }, [recipes]);

  return {
    recipes,
    cuisines,
    loading,
    error,
    getRecipesByCuisine,
    getMostPopularRecipes,
    getRecipeById,
    searchRecipes,
    refetch: fetchRecipes
  };
};