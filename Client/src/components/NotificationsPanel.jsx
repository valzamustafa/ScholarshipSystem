import React, { useEffect, useState } from 'react';
import { FiBell, FiCheck, FiMessageSquare, FiMail } from 'react-icons/fi';

const NotificationsPanel = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://localhost:7255/api/notification/for-user", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.isRead).length);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`https://localhost:7255/api/notification/${id}/read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, isRead: true } : n
      ));
      setUnreadCount(unreadCount - 1);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch("https://localhost:7255/api/notification/mark-all-read", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

     return (
    <div className="dropdown">
      <button 
        className="btn btn-light dropdown-toggle position-relative" 
        type="button" 
        data-bs-toggle="dropdown"
      >
        <FiBell size={20} />
        {unreadCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {unreadCount}
          </span>
        )}
      </button>
      <div className="dropdown-menu dropdown-menu-end p-0" style={{ width: '300px' }}>
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h6 className="mb-0">Notifications</h6>
            <button 
              className="btn btn-sm btn-link text-muted"
              onClick={markAllAsRead}
            >
              Mark all as read
            </button>
          </div>
          <div className="card-body p-0">
            {notifications.length === 0 ? (
              <div className="p-3 text-center text-muted">No notifications</div>
            ) : (
              <ul className="list-group list-group-flush">
                {notifications.map(notification => (
                  <li 
                    key={notification.id} 
                    className={`list-group-item ${!notification.isRead ? 'bg-light' : ''}`}
                  >
                    <div className="d-flex">
                      <div className="me-2">
                        {notification.notificationType === 'NewMessage' ? (
                          <FiMessageSquare className="text-primary" />
                        ) : notification.notificationType === 'NewApplication' ? (
                          <FiMail className="text-success" />
                        ) : (
                          <FiBell className="text-warning" />
                        )}
                      </div>
                      <div className="flex-grow-1">
                        <p className="mb-1">{notification.message}</p>
                        <small className="text-muted">
                          {new Date(notification.dateSent).toLocaleString()}
                        </small>
                      </div>
                      {!notification.isRead && (
                        <button 
                          className="btn btn-sm btn-link"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <FiCheck />
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPanel;