import { useState, useEffect } from 'react';
import { getRecipeImageUrl, getBestRecipeImageUrl, getFallbackImageUrl } from '../utils/imageUtils';

interface UseRecipeImageReturn {
  imageUrl: string;
  isLoading: boolean;
  hasError: boolean;
  retryLoad: () => void;
}

/**
 * Hook to manage recipe image loading with automatic fallback
 * @param recipeTitle - The title of the recipe
 * @param recipeId - Optional recipe ID for fallback selection
 * @param existingImageUrl - Existing image URL from database (optional)
 * @returns Object with image URL, loading state, and error state
 */
export const useRecipeImage = (
  recipeTitle: string, 
  recipeId?: string, 
  existingImageUrl?: string | null
): UseRecipeImageReturn => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const loadImage = async () => {
    setIsLoading(true);
    setHasError(false);

    try {
      // If we have an existing image URL from the database, try that first
      if (existingImageUrl) {
        // Test if the existing URL is accessible
        try {
          const response = await fetch(existingImageUrl, { method: 'HEAD' });
          if (response.ok) {
            setImageUrl(existingImageUrl);
            setIsLoading(false);
            return;
          }
        } catch {
          // Continue to storage lookup if existing URL fails
        }
      }

      // Try to get image from storage based on recipe title
      if (recipeTitle) {
        const storageImageUrl = await getBestRecipeImageUrl(recipeTitle, recipeId);
        setImageUrl(storageImageUrl);
      } else {
        // Use fallback if no title
        setImageUrl(getFallbackImageUrl(recipeId));
      }
    } catch (error) {
      console.error('Error loading recipe image:', error);
      setHasError(true);
      setImageUrl(getFallbackImageUrl(recipeId));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadImage();
  }, [recipeTitle, recipeId, existingImageUrl]);

  const retryLoad = () => {
    loadImage();
  };

  return {
    imageUrl,
    isLoading,
    hasError,
    retryLoad
  };
};

/**
 * Simple hook to get storage image URL without loading logic
 * @param recipeTitle - The title of the recipe
 * @param fileExtension - The file extension (default: 'webp')
 * @returns The storage image URL
 */
export const useRecipeImageUrl = (recipeTitle: string, fileExtension: string = 'webp'): string => {
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    if (recipeTitle) {
      const url = getRecipeImageUrl(recipeTitle, fileExtension);
      setImageUrl(url);
    }
  }, [recipeTitle, fileExtension]);

  return imageUrl;
};