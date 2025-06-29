import React, { useState } from 'react';
import { 
  Activity, 
  Filter, 
  Calendar, 
  Clock,
  MapPin,
  Monitor,
  RefreshCw
} from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';
import { UserActivity } from '../../types/auth';

const ActivityPage: React.FC = () => {
  const { activities, loading, error, refreshStats } = useDashboard();
  const [filter, setFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'type'>('date');

  const activityTypes = [
    { value: 'all', label: 'All Activities' },
    { value: 'sign_in', label: 'Sign In' },
    { value: 'sign_out', label: 'Sign Out' },
    { value: 'profile_updated', label: 'Profile Updates' },
    { value: 'settings_updated', label: 'Settings Updates' },
    { value: 'password_changed', label: 'Password Changes' },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'sign_in':
        return '🔐';
      case 'sign_out':
        return '🚪';
      case 'profile_updated':
        return '👤';
      case 'settings_updated':
        return '⚙️';
      case 'password_changed':
        return '🔑';
      default:
        return '📝';
    }
  };

  const getActivityDescription = (activity: UserActivity) => {
    switch (activity.activity_type) {
      case 'sign_in':
        return 'Signed in to account';
      case 'sign_out':
        return 'Signed out of account';
      case 'profile_updated':
        return `Updated profile (${activity.activity_data?.fields?.join(', ') || 'multiple fields'})`;
      case 'settings_updated':
        return `Updated settings (${activity.activity_data?.fields?.join(', ') || 'multiple fields'})`;
      case 'password_changed':
        return 'Changed account password';
      default:
        return activity.activity_type.replace('_', ' ');
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'sign_in':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'sign_out':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'profile_updated':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'settings_updated':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'password_changed':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 168) {
      const days = Math.floor(diffInHours / 24);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const filteredActivities = activities.filter(activity => 
    filter === 'all' || activity.activity_type === filter
  );

  const sortedActivities = [...filteredActivities].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    } else {
      return a.activity_type.localeCompare(b.activity_type);
    }
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-xl p-6">
        <p className="text-red-600 dark:text-red-400">Error loading activity: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-3 mb-4 sm:mb-0">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Activity Log</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Track your account activity and security events
              </p>
            </div>
          </div>
          
          <button
            onClick={refreshStats}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter:</span>
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {activityTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'type')}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="date">Date</option>
              <option value="type">Type</option>
            </select>
          </div>
        </div>
      </div>

      {/* Activity List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        {sortedActivities.length > 0 ? (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedActivities.map((activity) => (
              <div key={activity.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-600 rounded-full flex items-center justify-center">
                      <span className="text-lg">{getActivityIcon(activity.activity_type)}</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          {getActivityDescription(activity)}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActivityColor(activity.activity_type)}`}>
                          {activity.activity_type.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(activity.created_at)}</span>
                      </div>
                    </div>
                    
                    <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                      {activity.ip_address && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>IP: {activity.ip_address}</span>
                        </div>
                      )}
                      {activity.user_agent && (
                        <div className="flex items-center space-x-1">
                          <Monitor className="w-3 h-3" />
                          <span className="truncate max-w-xs">
                            {activity.user_agent.split(' ')[0]}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {new Date(activity.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>

                    {activity.activity_data && Object.keys(activity.activity_data).length > 0 && (
                      <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-600 rounded text-xs">
                        <pre className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                          {JSON.stringify(activity.activity_data, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No activity found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {filter === 'all' 
                ? 'No activity has been recorded yet.'
                : `No ${filter.replace('_', ' ')} activities found.`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityPage;