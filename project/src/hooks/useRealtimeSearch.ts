import { useState, useEffect, useCallback, useRef } from 'react';
import { Recipe, SearchFilters } from '../types';
import { supabase } from '../lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

interface UseRealtimeSearchReturn {
  searchResults: Recipe[];
  isSearching: boolean;
  searchError: string | null;
  hasSearched: boolean;
  totalResults: number;
}

export const useRealtimeSearch = (filters: SearchFilters): UseRealtimeSearchReturn => {
  const [searchResults, setSearchResults] = useState<Recipe[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  
  const debounceTimerRef = useRef<NodeJS.Timeout>();
  const channelRef = useRef<RealtimeChannel | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Debounced search function
  const performSearch = useCallback(async (searchFilters: SearchFilters) => {
    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      setIsSearching(true);
      setSearchError(null);

      // Build the query
      let query = supabase
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
        `, { count: 'exact' });

      // Apply text search filters
      if (searchFilters.query.trim()) {
        const searchTerm = searchFilters.query.trim();
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,notes.ilike.%${searchTerm}%`);
      }

      // Apply cuisine filters
      if (searchFilters.cuisines.length > 0) {
        const { data: cuisineIds } = await supabase
          .from('cuisines')
          .select('id')
          .in('name', searchFilters.cuisines);
        
        if (cuisineIds && cuisineIds.length > 0) {
          query = query.in('cuisine_id', cuisineIds.map(c => c.id));
        }
      }

      // Apply meal type filters
      if (searchFilters.mealTypes.length > 0) {
        query = query.in('meal_type', searchFilters.mealTypes);
      }

      // Apply difficulty filters
      if (searchFilters.difficulty.length > 0) {
        query = query.in('difficulty', searchFilters.difficulty);
      }

      // Apply budget level filters
      if (searchFilters.budgetLevel.length > 0) {
        query = query.in('budget_level', searchFilters.budgetLevel);
      }

      // Apply cooking time range
      if (searchFilters.cookingTimeRange[0] > 0 || searchFilters.cookingTimeRange[1] < 300) {
        query = query
          .gte('total_time_minutes', searchFilters.cookingTimeRange[0])
          .lte('total_time_minutes', searchFilters.cookingTimeRange[1]);
      }

      // Order by relevance (title matches first, then description, then created_at)
      if (searchFilters.query.trim()) {
        query = query.order('created_at', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      // Limit results for performance
      query = query.limit(50);

      const { data: recipesData, error: recipesError, count } = await query.abortSignal(signal);

      if (signal.aborted) return;

      if (recipesError) {
        throw recipesError;
      }

      // Format recipes with proper typing
      const formattedRecipes: Recipe[] = (recipesData || []).map(recipe => ({
        ...recipe,
        ingredients: recipe.ingredients || [],
        tools: recipe.tools || [],
        tags: recipe.tags || [],
        steps: (recipe.steps || []).sort((a, b) => (a.step_number || 0) - (b.step_number || 0))
      }));

      // Filter by dietary tags and tools on the client side for more complex logic
      let filteredRecipes = formattedRecipes;

      // Apply dietary tags filter
      if (searchFilters.dietaryTags.length > 0) {
        filteredRecipes = filteredRecipes.filter(recipe =>
          searchFilters.dietaryTags.every(tag =>
            recipe.tags?.some(rt => rt.tag.name === tag)
          )
        );
      }

      // Apply tools filter
      if (searchFilters.tools.length > 0) {
        filteredRecipes = filteredRecipes.filter(recipe =>
          searchFilters.tools.every(tool =>
            recipe.tools?.some(rt => rt.tool.name === tool)
          )
        );
      }

      // Sort by relevance if there's a search query
      if (searchFilters.query.trim()) {
        const searchTerm = searchFilters.query.toLowerCase();
        filteredRecipes.sort((a, b) => {
          const aTitle = a.title.toLowerCase();
          const bTitle = b.title.toLowerCase();
          
          // Exact title matches first
          if (aTitle === searchTerm && bTitle !== searchTerm) return -1;
          if (bTitle === searchTerm && aTitle !== searchTerm) return 1;
          
          // Title starts with search term
          if (aTitle.startsWith(searchTerm) && !bTitle.startsWith(searchTerm)) return -1;
          if (bTitle.startsWith(searchTerm) && !aTitle.startsWith(searchTerm)) return 1;
          
          // Title contains search term
          if (aTitle.includes(searchTerm) && !bTitle.includes(searchTerm)) return -1;
          if (bTitle.includes(searchTerm) && !aTitle.includes(searchTerm)) return 1;
          
          // Default to creation date
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        });
      }

      setSearchResults(filteredRecipes);
      setTotalResults(count || filteredRecipes.length);
      setHasSearched(true);

    } catch (error: any) {
      if (error.name === 'AbortError') return;
      
      console.error('Search error:', error);
      setSearchError(error.message || 'Failed to search recipes');
      setSearchResults([]);
      setTotalResults(0);
    } finally {
      if (!signal.aborted) {
        setIsSearching(false);
      }
    }
  }, []);

  // Debounced search effect
  useEffect(() => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Only search if there are active filters
    const hasActiveFilters = 
      filters.query.trim() ||
      filters.cuisines.length > 0 ||
      filters.mealTypes.length > 0 ||
      filters.difficulty.length > 0 ||
      filters.dietaryTags.length > 0 ||
      filters.tools.length > 0 ||
      filters.budgetLevel.length > 0 ||
      filters.cookingTimeRange[0] > 0 ||
      filters.cookingTimeRange[1] < 300;

    if (!hasActiveFilters) {
      setSearchResults([]);
      setTotalResults(0);
      setHasSearched(false);
      setIsSearching(false);
      return;
    }

    // Set up debounced search
    debounceTimerRef.current = setTimeout(() => {
      performSearch(filters);
    }, 400); // 400ms debounce

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [filters, performSearch]);

  // Set up real-time subscription
  useEffect(() => {
    // Clean up existing subscription
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    // Create new subscription for real-time updates
    const channel = supabase
      .channel('recipes_realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'recipes'
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          
          // Re-run search if we have active filters
          const hasActiveFilters = 
            filters.query.trim() ||
            filters.cuisines.length > 0 ||
            filters.mealTypes.length > 0 ||
            filters.difficulty.length > 0 ||
            filters.dietaryTags.length > 0 ||
            filters.tools.length > 0 ||
            filters.budgetLevel.length > 0 ||
            filters.cookingTimeRange[0] > 0 ||
            filters.cookingTimeRange[1] < 300;

          if (hasActiveFilters) {
            performSearch(filters);
          }
        }
      )
      .subscribe((status) => {
        console.log('Real-time subscription status:', status);
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [filters, performSearch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, []);

  return {
    searchResults,
    isSearching,
    searchError,
    hasSearched,
    totalResults
  };
};