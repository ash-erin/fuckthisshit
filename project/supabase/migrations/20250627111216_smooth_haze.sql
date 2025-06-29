/*
  # Enable RLS and add policies for core recipe tables

  1. Security Updates
    - Enable RLS on recipes, cuisines, ingredients, tools, tags, equipment tables
    - Add public read policies for all users
    - Add authenticated user policies for data modification

  2. Tables Updated
    - recipes: Enable RLS with public read access
    - cuisines: Enable RLS with public read access  
    - ingredients: Enable RLS with public read access
    - tools: Enable RLS with public read access
    - tags: Enable RLS with public read access
    - equipment: Enable RLS with public read access
    - recipe_ingredients: Enable RLS with public read access
    - recipe_tools: Enable RLS with public read access
    - recipe_tags: Enable RLS with public read access
    - recipe_steps: Enable RLS with public read access
    - users: Enable RLS with user-specific access

  3. Policy Strategy
    - Allow public read access to recipe data for browsing
    - Require authentication for creating/modifying data
    - Users can only modify their own data where applicable
*/

-- Enable RLS on core tables
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE cuisines ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Recipes policies
CREATE POLICY "Anyone can read recipes"
  ON recipes
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert recipes"
  ON recipes
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update recipes"
  ON recipes
  FOR UPDATE
  TO authenticated
  USING (true);

-- Cuisines policies
CREATE POLICY "Anyone can read cuisines"
  ON cuisines
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert cuisines"
  ON cuisines
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Ingredients policies
CREATE POLICY "Anyone can read ingredients"
  ON ingredients
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert ingredients"
  ON ingredients
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Tools policies
CREATE POLICY "Anyone can read tools"
  ON tools
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert tools"
  ON tools
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Tags policies
CREATE POLICY "Anyone can read tags"
  ON tags
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert tags"
  ON tags
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Equipment policies
CREATE POLICY "Anyone can read equipment"
  ON equipment
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert equipment"
  ON equipment
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Recipe ingredients policies
CREATE POLICY "Anyone can read recipe ingredients"
  ON recipe_ingredients
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert recipe ingredients"
  ON recipe_ingredients
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update recipe ingredients"
  ON recipe_ingredients
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete recipe ingredients"
  ON recipe_ingredients
  FOR DELETE
  TO authenticated
  USING (true);

-- Recipe tools policies
CREATE POLICY "Anyone can read recipe tools"
  ON recipe_tools
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert recipe tools"
  ON recipe_tools
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update recipe tools"
  ON recipe_tools
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete recipe tools"
  ON recipe_tools
  FOR DELETE
  TO authenticated
  USING (true);

-- Recipe tags policies
CREATE POLICY "Anyone can read recipe tags"
  ON recipe_tags
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert recipe tags"
  ON recipe_tags
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update recipe tags"
  ON recipe_tags
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete recipe tags"
  ON recipe_tags
  FOR DELETE
  TO authenticated
  USING (true);

-- Recipe steps policies
CREATE POLICY "Anyone can read recipe steps"
  ON recipe_steps
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert recipe steps"
  ON recipe_steps
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update recipe steps"
  ON recipe_steps
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete recipe steps"
  ON recipe_steps
  FOR DELETE
  TO authenticated
  USING (true);

-- Users policies
CREATE POLICY "Users can read their own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);