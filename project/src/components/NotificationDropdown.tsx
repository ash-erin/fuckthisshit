import React from 'react';
import { Clock, Star, Play } from 'lucide-react';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Notification {
  id: string;
  type: 'new_release' | 'recommendation' | 'reminder';
  title: string;
  description: string;
  time: string;
  thumbnail?: string;
  isRead: boolean;
}

const notifications: Notification[] = [
  {
    id: '1',
    type: 'new_release',
    title: 'New Episode Available',
    description: 'Stranger Things Season 5 Episode 1 is now streaming',
    time: '2 hours ago',
    thumbnail: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=100',
    isRead: false,
  },
  {
    id: '2',
    type: 'recommendation',
    title: 'Recommended for You',
    description: 'Based on your viewing history, you might like "Dark"',
    time: '1 day ago',
    thumbnail: 'https://images.pexels.com/photos/5699456/pexels-photo-5699456.jpeg?auto=compress&cs=tinysrgb&w=100',
    isRead: false,
  },
  {
    id: '3',
    type: 'reminder',
    title: 'Continue Watching',
    description: 'You left off at 23:45 in "Money Heist"',
    time: '2 days ago',
    thumbnail: 'https://images.pexels.com/photos/6896450/pexels-photo-6896450.jpeg?auto=compress&cs=tinysrgb&w=100',
    isRead: true,
  },
  {
    id: '4',
    type: 'new_release',
    title: 'New Season Added',
    description: 'The Witcher Season 3 is now available',
    time: '3 days ago',
    thumbnail: 'https://images.pexels.com/photos/8111085/pexels-photo-8111085.jpeg?auto=compress&cs=tinysrgb&w=100',
    isRead: true,
  },
];

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_release':
        return <Star size={16} className="text-yellow-500" />;
      case 'recommendation':
        return <Play size={16} className="text-blue-500" />;
      case 'reminder':
        return <Clock size={16} className="text-green-500" />;
      default:
        return <Star size={16} className="text-gray-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-40" onClick={onClose}>
      <div className="absolute top-16 right-4 md:right-20 backdrop-blur-md border border-gray-700 rounded-md shadow-xl w-80 max-h-96 overflow-y-auto" style={{ backgroundColor: 'rgba(8, 25, 50, 0.95)' }}>
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-white font-semibold text-lg">Notifications</h3>
        </div>
        
        <div className="divide-y divide-gray-700">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 hover:bg-gray-800/50 transition-colors cursor-pointer ${
                !notification.isRead ? '' : ''
              }`}
              style={{ backgroundColor: !notification.isRead ? 'rgba(15, 47, 95, 0.3)' : 'transparent' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(15, 47, 95, 0.5)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = !notification.isRead ? 'rgba(15, 47, 95, 0.3)' : 'transparent'}
            >
              <div className="flex space-x-3">
                {notification.thumbnail && (
                  <img
                    src={notification.thumbnail}
                    alt=""
                    className="w-12 h-12 rounded object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    {getNotificationIcon(notification.type)}
                    <h4 className={`text-sm font-medium ${
                      notification.isRead ? 'text-white/80' : 'text-white'
                    }`}>
                      {notification.title}
                    </h4>
                    {!notification.isRead && (
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: '#ddb870' }}></div>
                    )}
                  </div>
                  <p className={`text-xs ${
                    notification.isRead ? 'text-white/60' : 'text-white/80'
                  } line-clamp-2`}>
                    {notification.description}
                  </p>
                  <p className="text-xs text-white/50 mt-1">{notification.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t border-gray-700">
          <button 
            className="text-sm font-medium transition-colors"
            style={{ color: '#ddb870' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#ebdcb5'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#ddb870'}
          >
            Mark all as read
          </button>
        </div>
      </div>
    </div>
  );
};