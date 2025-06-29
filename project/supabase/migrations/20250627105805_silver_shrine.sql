/*
  # Recipe Images Storage Setup

  1. Storage Setup
    - Create bucket for recipe images
    - Set up storage policies for public access
    - Add helper functions for image management

  2. Database Updates
    - Update recipes table to better handle storage URLs
    - Add functions to generate storage URLs

  3. Security
    - Public read access for recipe images
    - Authenticated write access for recipe management
*/

-- Create storage bucket for recipe images
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('recipe-images', 'recipe-images', true)
  ON CONFLICT (id) DO NOTHING;
END $$;

-- Create storage policies for recipe images
CREATE POLICY "Recipe images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'recipe-images');

CREATE POLICY "Authenticated users can upload recipe images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'recipe-images');

CREATE POLICY "Authenticated users can update recipe images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'recipe-images');

CREATE POLICY "Authenticated users can delete recipe images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'recipe-images');

-- Function to generate storage URL for recipe image
CREATE OR REPLACE FUNCTION get_recipe_image_url(recipe_uuid uuid, file_extension text DEFAULT 'webp')
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  base_url text;
  file_path text;
BEGIN
  -- Get the Supabase project URL (you might need to adjust this)
  SELECT current_setting('app.settings.supabase_url', true) INTO base_url;
  
  -- If not set, use a default pattern (adjust for your project)
  IF base_url IS NULL OR base_url = '' THEN
    base_url := 'https://rocxegyakkbjmuwmgirr.supabase.co';
  END IF;
  
  -- Construct file path using recipe_id
  file_path := recipe_uuid::text || '.' || file_extension;
  
  -- Return full storage URL
  RETURN base_url || '/storage/v1/object/public/recipe-images/' || file_path;
END;
$$;

-- Function to update recipe image_url when image is uploaded
CREATE OR REPLACE FUNCTION update_recipe_image_url()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  recipe_uuid uuid;
  new_image_url text;
BEGIN
  -- Extract recipe_id from filename (assuming format: recipe_id.extension)
  BEGIN
    recipe_uuid := (regexp_split_to_array(NEW.name, '\.'))[1]::uuid;
  EXCEPTION
    WHEN invalid_text_representation THEN
      -- If filename is not a valid UUID, skip update
      RETURN NEW;
  END;
  
  -- Generate the public URL
  new_image_url := get_recipe_image_url(recipe_uuid, (regexp_split_to_array(NEW.name, '\.'))[2]);
  
  -- Update the recipe with the new image URL
  UPDATE recipes 
  SET image_url = new_image_url
  WHERE id = recipe_uuid;
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically update recipe image_url when image is uploaded
DROP TRIGGER IF EXISTS on_recipe_image_upload ON storage.objects;
CREATE TRIGGER on_recipe_image_upload
  AFTER INSERT ON storage.objects
  FOR EACH ROW
  WHEN (NEW.bucket_id = 'recipe-images')
  EXECUTE FUNCTION update_recipe_image_url();

-- Add index for better performance on image_url lookups
CREATE INDEX IF NOT EXISTS idx_recipes_image_url ON recipes(image_url) WHERE image_url IS NOT NULL;