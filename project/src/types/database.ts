export interface Database {
  public: {
    Tables: {
      cuisines: {
        Row: {
          id: string;
          name: string;
        };
        Insert: {
          id?: string;
          name: string;
        };
        Update: {
          id?: string;
          name?: string;
        };
      };
      recipes: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          cuisine_id: string | null;
          meal_type: 'Breakfast' | 'Snack' | 'Lunch' | 'Dinner' | 'Dessert' | null;
          difficulty: 'Easy' | 'Medium' | 'Hard' | null;
          total_time_minutes: number | null;
          servings: number | null;
          budget_level: 'Low' | 'Moderate' | 'High' | null;
          image_url: string | null;
          created_at: string | null;
          notes: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          cuisine_id?: string | null;
          meal_type?: 'Breakfast' | 'Snack' | 'Lunch' | 'Dinner' | 'Dessert' | null;
          difficulty?: 'Easy' | 'Medium' | 'Hard' | null;
          total_time_minutes?: number | null;
          servings?: number | null;
          budget_level?: 'Low' | 'Moderate' | 'High' | null;
          image_url?: string | null;
          created_at?: string | null;
          notes?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          cuisine_id?: string | null;
          meal_type?: 'Breakfast' | 'Snack' | 'Lunch' | 'Dinner' | 'Dessert' | null;
          difficulty?: 'Easy' | 'Medium' | 'Hard' | null;
          total_time_minutes?: number | null;
          servings?: number | null;
          budget_level?: 'Low' | 'Moderate' | 'High' | null;
          image_url?: string | null;
          created_at?: string | null;
          notes?: string | null;
        };
      };
      ingredients: {
        Row: {
          id: string;
          name: string;
        };
        Insert: {
          id?: string;
          name: string;
        };
        Update: {
          id?: string;
          name?: string;
        };
      };
      recipe_ingredients: {
        Row: {
          recipe_id: string;
          ingredient_id: string;
          amount: string | null;
          descriptor: string | null;
          is_optional: boolean | null;
        };
        Insert: {
          recipe_id: string;
          ingredient_id: string;
          amount?: string | null;
          descriptor?: string | null;
          is_optional?: boolean | null;
        };
        Update: {
          recipe_id?: string;
          ingredient_id?: string;
          amount?: string | null;
          descriptor?: string | null;
          is_optional?: boolean | null;
        };
      };
      tools: {
        Row: {
          id: string;
          name: string;
        };
        Insert: {
          id?: string;
          name: string;
        };
        Update: {
          id?: string;
          name?: string;
        };
      };
      recipe_tools: {
        Row: {
          recipe_id: string;
          tool_id: string;
          essential: boolean | null;
        };
        Insert: {
          recipe_id: string;
          tool_id: string;
          essential?: boolean | null;
        };
        Update: {
          recipe_id?: string;
          tool_id?: string;
          essential?: boolean | null;
        };
      };
      tags: {
        Row: {
          id: string;
          name: string;
        };
        Insert: {
          id?: string;
          name: string;
        };
        Update: {
          id?: string;
          name?: string;
        };
      };
      recipe_tags: {
        Row: {
          recipe_id: string;
          tag_id: string;
        };
        Insert: {
          recipe_id: string;
          tag_id: string;
        };
        Update: {
          recipe_id?: string;
          tag_id?: string;
        };
      };
      recipe_steps: {
        Row: {
          id: string;
          recipe_id: string | null;
          step_number: number | null;
          instruction: string | null;
        };
        Insert: {
          id?: string;
          recipe_id?: string | null;
          step_number?: number | null;
          instruction?: string | null;
        };
        Update: {
          id?: string;
          recipe_id?: string | null;
          step_number?: number | null;
          instruction?: string | null;
        };
      };
    };
  };
}