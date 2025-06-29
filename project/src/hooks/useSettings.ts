import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { UserSettings } from '../types/auth';
import { useAuth } from './useAuth';

interface UseSettingsReturn {
  updating: boolean;
  error: string | null;
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>;
  applyTheme: (theme: UserSettings['theme']) => void;
}

export const useSettings = (): UseSettingsReturn => {
  const { user, settings, refreshSettings } = useAuth();
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update settings
  const updateSettings = useCallback(async (newSettings: Partial<UserSettings>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      setUpdating(true);
      setError(null);

      const { error } = await supabase
        .from('user_settings')
        .update(newSettings)
        .eq('user_id', user.id);

      if (error) throw error;

      await refreshSettings();

      // Apply theme if it was updated
      if (newSettings.theme) {
        applyTheme(newSettings.theme);
      }

      // Log activity
      await supabase
        .from('user_activity')
        .insert({
          user_id: user.id,
          activity_type: 'settings_updated',
          activity_data: { fields: Object.keys(newSettings) }
        });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Settings update failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setUpdating(false);
    }
  }, [user, refreshSettings]);

  // Apply theme to document
  const applyTheme = useCallback((theme: UserSettings['theme']) => {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System theme
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, []);

  // Apply theme on settings change
  React.useEffect(() => {
    if (settings?.theme) {
      applyTheme(settings.theme);
    }
  }, [settings?.theme, applyTheme]);

  return {
    updating,
    error,
    updateSettings,
    applyTheme,
  };
};