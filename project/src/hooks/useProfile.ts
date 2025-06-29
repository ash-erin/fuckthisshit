import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { UpdateProfileData, UserProfile } from '../types/auth';
import { useAuth } from './useAuth';

interface UseProfileReturn {
  updating: boolean;
  error: string | null;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  uploadAvatar: (file: File) => Promise<string>;
  deleteAccount: () => Promise<void>;
}

export const useProfile = (): UseProfileReturn => {
  const { user, refreshProfile } = useAuth();
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update profile
  const updateProfile = useCallback(async (data: UpdateProfileData) => {
    if (!user) throw new Error('User not authenticated');

    try {
      setUpdating(true);
      setError(null);

      const { error } = await supabase
        .from('user_profiles')
        .update(data)
        .eq('user_id', user.id);

      if (error) throw error;

      await refreshProfile();

      // Log activity
      await supabase
        .from('user_activity')
        .insert({
          user_id: user.id,
          activity_type: 'profile_updated',
          activity_data: { fields: Object.keys(data) }
        });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Profile update failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setUpdating(false);
    }
  }, [user, refreshProfile]);

  // Upload avatar
  const uploadAvatar = useCallback(async (file: File): Promise<string> => {
    if (!user) throw new Error('User not authenticated');

    try {
      setUpdating(true);
      setError(null);

      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB');
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const avatarUrl = data.publicUrl;

      // Update profile with new avatar URL
      await updateProfile({ avatar_url: avatarUrl });

      return avatarUrl;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Avatar upload failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setUpdating(false);
    }
  }, [user, updateProfile]);

  // Delete account
  const deleteAccount = useCallback(async () => {
    if (!user) throw new Error('User not authenticated');

    try {
      setUpdating(true);
      setError(null);

      // Log activity before deletion
      await supabase
        .from('user_activity')
        .insert({
          user_id: user.id,
          activity_type: 'account_deleted'
        });

      // Delete user account (this will cascade delete all related data)
      const { error } = await supabase.auth.admin.deleteUser(user.id);

      if (error) throw error;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Account deletion failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setUpdating(false);
    }
  }, [user]);

  return {
    updating,
    error,
    updateProfile,
    uploadAvatar,
    deleteAccount,
  };
};