import { useState, useEffect, useCallback } from 'react';

export const useUserPreferences = () => {
  const [likedRecipeIds, setLikedRecipeIds] = useState<string[]>([]);
  const [savedRecipeIds, setSavedRecipeIds] = useState<string[]>([]);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedLikes = localStorage.getItem('userLikes');
    const savedBookmarks = localStorage.getItem('userBookmarks');
    
    if (savedLikes) {
      setLikedRecipeIds(JSON.parse(savedLikes));
    }
    
    if (savedBookmarks) {
      setSavedRecipeIds(JSON.parse(savedBookmarks));
    }
  }, []);

  // Save to localStorage whenever preferences change
  useEffect(() => {
    localStorage.setItem('userLikes', JSON.stringify(likedRecipeIds));
  }, [likedRecipeIds]);

  useEffect(() => {
    localStorage.setItem('userBookmarks', JSON.stringify(savedRecipeIds));
  }, [savedRecipeIds]);

  const toggleLike = useCallback((recipeId: string) => {
    setLikedRecipeIds(prev => 
      prev.includes(recipeId) 
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId]
    );
  }, []);

  const toggleSave = useCallback((recipeId: string) => {
    setSavedRecipeIds(prev => 
      prev.includes(recipeId) 
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId]
    );
  }, []);

  const isLiked = useCallback((recipeId: string) => {
    return likedRecipeIds.includes(recipeId);
  }, [likedRecipeIds]);

  const isSaved = useCallback((recipeId: string) => {
    return savedRecipeIds.includes(recipeId);
  }, [savedRecipeIds]);

  return {
    likedRecipeIds,
    savedRecipeIds,
    toggleLike,
    toggleSave,
    isLiked,
    isSaved
  };
};