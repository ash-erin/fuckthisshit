import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { DashboardStats, UserActivity } from '../types/auth';
import { useAuth } from './useAuth';

interface UseDashboardReturn {
  stats: DashboardStats | null;
  activities: UserActivity[];
  loading: boolean;
  error: string | null;
  refreshStats: () => Promise<void>;
}

export const useDashboard = (): UseDashboardReturn => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard statistics
  const fetchStats = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Get total login count
      const { count: totalLogins } = await supabase
        .from('user_activity')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('activity_type', 'sign_in');

      // Get last login
      const { data: lastLoginData } = await supabase
        .from('user_activity')
        .select('created_at')
        .eq('user_id', user.id)
        .eq('activity_type', 'sign_in')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      // Get total activity count
      const { count: totalActivity } = await supabase
        .from('user_activity')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Get recent activities
      const { data: recentActivities } = await supabase
        .from('user_activity')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      // Calculate account age in days
      const accountAge = Math.floor(
        (new Date().getTime() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24)
      );

      setStats({
        totalLogins: totalLogins || 0,
        lastLogin: lastLoginData?.created_at || null,
        accountAge,
        totalActivity: totalActivity || 0,
        recentActivities: recentActivities || []
      });

      setActivities(recentActivities || []);

    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Refresh stats
  const refreshStats = useCallback(async () => {
    await fetchStats();
  }, [fetchStats]);

  // Fetch stats on mount and user change
  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user, fetchStats]);

  return {
    stats,
    activities,
    loading,
    error,
    refreshStats,
  };
};