import { supabase } from '../lib/supabase';

/**
 * Generate a storage URL for a recipe image based on recipe title
 * @param recipeTitle - The title of the recipe
 * @param fileExtension - The file extension (default: 'webp')
 * @returns The full storage URL or null if not found
 */
export const getRecipeImageUrl = (recipeTitle: string, fileExtension: string = 'webp'): string => {
  if (!recipeTitle) return '';
  
  // Sanitize the recipe title to match file naming conventions
  const sanitizedTitle = recipeTitle
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
  
  // Construct the file path
  const fileName = `${sanitizedTitle}.${fileExtension}`;
  
  // Get the public URL from Supabase storage
  const { data } = supabase.storage
    .from('recipe-images')
    .getPublicUrl(fileName);
  
  return data.publicUrl;
};

/**
 * Check if an image exists in the storage bucket
 * @param recipeTitle - The title of the recipe
 * @param fileExtension - The file extension to check
 * @returns Promise<boolean> - Whether the image exists
 */
export const checkImageExists = async (recipeTitle: string, fileExtension: string = 'webp'): Promise<boolean> => {
  if (!recipeTitle) return false;
  
  const sanitizedTitle = recipeTitle
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  
  const fileName = `${sanitizedTitle}.${fileExtension}`;
  
  try {
    const { data, error } = await supabase.storage
      .from('recipe-images')
      .list('', {
        limit: 1,
        search: fileName
      });
    
    if (error) {
      console.warn('Error checking image existence:', error);
      return false;
    }
    
    return data && data.length > 0;
  } catch (error) {
    console.warn('Error checking image existence:', error);
    return false;
  }
};

/**
 * Get the best available image URL for a recipe
 * Tries multiple file extensions and falls back to default images
 * @param recipeTitle - The title of the recipe
 * @param recipeId - The recipe ID for fallback
 * @returns Promise<string> - The best available image URL
 */
export const getBestRecipeImageUrl = async (recipeTitle: string, recipeId?: string): Promise<string> => {
  if (!recipeTitle) {
    return getFallbackImageUrl(recipeId);
  }
  
  // Try different file extensions in order of preference
  const extensions = ['webp', 'jpg', 'jpeg', 'png'];
  
  for (const ext of extensions) {
    try {
      // Use the Supabase storage list method to check if file exists
      // This is more reliable than HEAD requests
      const sanitizedTitle = recipeTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      
      const fileName = `${sanitizedTitle}.${ext}`;
      
      const { data, error } = await supabase.storage
        .from('recipe-images')
        .list('', {
          limit: 1,
          search: fileName
        });
      
      // If no error and file exists, return the URL
      if (!error && data && data.length > 0) {
        return getRecipeImageUrl(recipeTitle, ext);
      }
    } catch (error) {
      // Continue to next extension on any error
      console.warn(`Error checking image for ${recipeTitle}.${ext}:`, error);
      continue;
    }
  }
  
  // If no image found in storage, return fallback
  return getFallbackImageUrl(recipeId);
};

/**
 * Get a fallback image URL when no storage image is available
 * @param recipeId - Optional recipe ID for deterministic fallback selection
 * @returns A fallback image URL
 */
export const getFallbackImageUrl = (recipeId?: string): string => {
  const fallbackImages = [
    '/mediterranean-macaroni-1325836 test image 1.webp',
    '/tuscany-doc-food-market-1-1567116 test image 2.webp',
    '/a_richly_detailed_grimm_folk_kitchen_with_expressive_folk_art_touches_a_wooden_cutting_board_holds__52fjk4sjhemycev0s9lf_2.png',
    '/a_grimm-style_enchanted_kitchen_nestled_in_a_shadowy_german_woodland_illustrated_in_a_hybrid_of_dar_yxnvr3i5v6608xjpzdea_2.png'
  ];
  
  if (recipeId) {
    // Use recipe ID to deterministically select a fallback image
    const hash = recipeId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return fallbackImages[Math.abs(hash) % fallbackImages.length];
  }
  
  // Random fallback if no recipe ID
  return fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
};

/**
 * Upload a recipe image to storage
 * @param file - The image file to upload
 * @param recipeTitle - The recipe title to use for naming
 * @returns Promise<string | null> - The uploaded image URL or null if failed
 */
export const uploadRecipeImage = async (file: File, recipeTitle: string): Promise<string | null> => {
  if (!file || !recipeTitle) return null;
  
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size must be less than 5MB');
    }
    
    // Generate filename based on recipe title
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'webp';
    const sanitizedTitle = recipeTitle
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    const fileName = `${sanitizedTitle}.${fileExt}`;
    
    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('recipe-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true // Allow overwriting existing images
      });
    
    if (uploadError) throw uploadError;
    
    // Return the public URL
    return getRecipeImageUrl(recipeTitle, fileExt);
    
  } catch (error) {
    console.error('Error uploading recipe image:', error);
    return null;
  }
};

/**
 * Delete a recipe image from storage
 * @param recipeTitle - The recipe title
 * @param fileExtension - The file extension to delete
 * @returns Promise<boolean> - Whether deletion was successful
 */
export const deleteRecipeImage = async (recipeTitle: string, fileExtension: string = 'webp'): Promise<boolean> => {
  if (!recipeTitle) return false;
  
  try {
    const sanitizedTitle = recipeTitle
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    const fileName = `${sanitizedTitle}.${fileExtension}`;
    
    const { error } = await supabase.storage
      .from('recipe-images')
      .remove([fileName]);
    
    if (error) {
      console.error('Error deleting recipe image:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting recipe image:', error);
    return false;
  }
};