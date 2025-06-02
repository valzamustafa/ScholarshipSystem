
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './useAuth';

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const [notifsRes, countRes] = await Promise.all([
        axios.get('/api/notifications'),
        axios.get('/api/notifications/unread-count')
      ]);
      
      setNotifications(notifsRes.data);
      setUnreadCount(countRes.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`/api/notifications/${id}/read`);
      setNotifications(notifs => 
        notifs.map(n => n.id === id ? {...n, isRead: true} : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put('/api/notifications/mark-all-read');
      setNotifications(notifs => 
        notifs.map(n => ({...n, isRead: true}))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
     
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  return {
    notifications,
    unreadCount,
    loading,
    refresh: fetchNotifications,
    markAsRead,
    markAllAsRead
  };
}


import { FiBell } from 'react-icons/fi';
import { useNotifications } from './useNotifications';

export function NotificationBell() {
  const { unreadCount, markAllAsRead } = useNotifications();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => {
          setShowDropdown(!showDropdown);
          if (showDropdown && unreadCount > 0) {
            markAllAsRead();
          }
        }}
        className="relative p-2"
      >
        <FiBell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>
      
      {showDropdown && <NotificationDropdown />}
    </div>
  );
}


import { useNotifications } from './useNotifications';

export function NotificationDropdown() {
  const { notifications, markAsRead } = useNotifications();

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-10">
      <div className="p-3 border-b">
        <h3 className="font-semibold">Notifications</h3>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No notifications</div>
        ) : (
          notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${!notification.isRead ? 'bg-blue-50' : ''}`}
              onClick={() => {
                if (!notification.isRead) {
                  markAsRead(notification.id);
                }
            
              }}
            >
              <div className="flex items-start">
                <span className="text-xl mr-2">{notification.icon}</span>
                <div>
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(notification.dateSent).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}