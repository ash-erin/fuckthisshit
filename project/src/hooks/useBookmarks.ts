import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export const useBookmarks = () => {
  const [bookmarkedRecipeIds, setBookmarkedRecipeIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadBookmarks = useCallback(async () => {
    if (!user) {
      // For demo purposes, load from localStorage when not authenticated
      const saved = localStorage.getItem('userBookmarks');
      if (saved) {
        setBookmarkedRecipeIds(JSON.parse(saved));
      }
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_bookmarks')
        .select('recipe_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setBookmarkedRecipeIds(data?.map(b => b.recipe_id) || []);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      // Fallback to localStorage
      const saved = localStorage.getItem('userBookmarks');
      if (saved) {
        setBookmarkedRecipeIds(JSON.parse(saved));
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  const saveBookmarks = useCallback(async (newBookmarks: string[]) => {
    setBookmarkedRecipeIds(newBookmarks);
    
    // Always save to localStorage as backup
    localStorage.setItem('userBookmarks', JSON.stringify(newBookmarks));

    if (!user) return;

    try {
      // In a real implementation, you would have a user_bookmarks table
      // For now, we'll just use localStorage
      console.log('Would save to Supabase:', newBookmarks);
    } catch (error) {
      console.error('Error saving bookmarks:', error);
    }
  }, [user]);

  const toggleBookmark = useCallback(async (recipeId: string) => {
    const isCurrentlyBookmarked = bookmarkedRecipeIds.includes(recipeId);
    let newBookmarks: string[];

    if (isCurrentlyBookmarked) {
      newBookmarks = bookmarkedRecipeIds.filter(id => id !== recipeId);
    } else {
      newBookmarks = [...bookmarkedRecipeIds, recipeId];
    }

    await saveBookmarks(newBookmarks);
  }, [bookmarkedRecipeIds, saveBookmarks]);

  const isBookmarked = useCallback((recipeId: string) => {
    return bookmarkedRecipeIds.includes(recipeId);
  }, [bookmarkedRecipeIds]);

  const clearAllBookmarks = useCallback(async () => {
    await saveBookmarks([]);
  }, [saveBookmarks]);

  return {
    bookmarkedRecipeIds,
    loading,
    user,
    toggleBookmark,
    isBookmarked,
    clearAllBookmarks,
    refetch: loadBookmarks
  };
};