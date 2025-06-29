import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useFilters = () => {
  const [cuisines, setCuisines] = useState<string[]>([]);
  const [tools, setTools] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        setLoading(true);

        // Fetch cuisines
        const { data: cuisinesData } = await supabase
          .from('cuisines')
          .select('name')
          .order('name');

        // Fetch tools
        const { data: toolsData } = await supabase
          .from('tools')
          .select('name')
          .order('name');

        // Fetch tags (for dietary preferences)
        const { data: tagsData } = await supabase
          .from('tags')
          .select('name')
          .order('name');

        setCuisines(cuisinesData?.map(c => c.name) || []);
        setTools(toolsData?.map(t => t.name) || []);
        setTags(tagsData?.map(t => t.name) || []);

      } catch (error) {
        console.error('Error fetching filter options:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilterOptions();
  }, []);

  return {
    cuisines,
    tools,
    tags,
    loading
  };
};