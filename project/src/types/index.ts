export interface Recipe {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  total_time_minutes: number | null;
  servings: number | null;
  meal_type: 'Breakfast' | 'Snack' | 'Lunch' | 'Dinner' | 'Dessert' | null;
  difficulty: 'Easy' | 'Medium' | 'Hard' | null;
  budget_level: 'Low' | 'Moderate' | 'High' | null;
  notes: string | null;
  created_at: string | null;
  like_count?: number; // Public like count
  // Related data
  cuisine?: {
    id: string;
    name: string;
  };
  ingredients?: RecipeIngredient[];
  tools?: RecipeTool[];
  tags?: RecipeTag[];
  steps?: RecipeStep[];
}

export interface RecipeIngredient {
  ingredient: {
    id: string;
    name: string;
  };
  amount: string | null;
  descriptor: string | null;
  is_optional: boolean | null;
}

export interface RecipeTool {
  tool: {
    id: string;
    name: string;
  };
  essential: boolean | null;
}

export interface RecipeTag {
  tag: {
    id: string;
    name: string;
  };
}

export interface RecipeStep {
  id: string;
  step_number: number | null;
  instruction: string | null;
}

export interface Cuisine {
  id: string;
  name: string;
}

export interface Ingredient {
  id: string;
  name: string;
}

export interface Tool {
  id: string;
  name: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  created_at: string;
}

export interface UserBookmark {
  id: string;
  user_id: string;
  recipe_id: string;
  created_at: string;
}

export interface CuisineCarousel {
  cuisine: string;
  recipes: Recipe[];
}

export interface SearchFilters {
  query: string;
  cuisines: string[];
  mealTypes: string[];
  cookingTimeRange: [number, number];
  difficulty: string[];
  dietaryTags: string[];
  tools: string[];
  budgetLevel: string[];
}

export interface NavigationItem {
  name: string;
  path: string;
  icon: React.ComponentType<any>;
  active?: boolean;
}