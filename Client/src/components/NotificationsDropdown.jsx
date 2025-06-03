import React, { useEffect, useState } from 'react';
import { FiBell, FiCheck, FiTrash2, FiCheckCircle } from 'react-icons/fi';
import { Dropdown, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { fetchUserNotifications, markAsRead, markAllAsRead } from '../services/notificationService';

function NotificationsDropdown() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const loadNotifications = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const data = await fetchUserNotifications();
                setNotifications(Array.isArray(data) ? data : []);
                setUnreadCount(data.filter(n => !n.isRead).length);
            } catch (error) {
                console.error("Error loading notifications:", error);
                setError(error.message || "Failed to load notifications");
                setNotifications([]);
                setUnreadCount(0);
            } finally {
                setLoading(false);
            }
        };

        loadNotifications();
        const interval = setInterval(loadNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsRead();
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error("Error marking all notifications as read:", error);
        }
    };

    const handleNotificationClick = (notification) => {
        markAsRead(notification.id);
        
        if (notification.relatedEntityType === "Application") {
            navigate(`/applications/${notification.relatedEntityId}`);
        } else if (notification.relatedEntityType === "Scholarship") {
            navigate(`/scholarships/${notification.relatedEntityId}`);
        }
    };

   return (
        <Dropdown className="ms-3">
            <Dropdown.Toggle variant="light" id="dropdown-notifications">
                <div className="position-relative">
                    <FiBell size={20} />
                    {unreadCount > 0 && (
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            {unreadCount}
                        </span>
                    )}
                </div>
            </Dropdown.Toggle>

            <Dropdown.Menu className="p-0" style={{ width: '350px', maxHeight: '400px', overflowY: 'auto' }}>
                <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                    <div>
                        <h6 className="mb-0">Notifications</h6>
                        <small className="text-muted">{notifications.length} total</small>
                    </div>
                    {unreadCount > 0 && (
                        <Button 
                            variant="link" 
                            size="sm" 
                            className="text-primary p-0"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAllAsRead();
                            }}
                            title="Mark all as read"
                        >
                            <FiCheckCircle size={16} className="me-1" />
                            Mark all
                        </Button>
                    )}
                </div>
                {loading ? (
                    <Dropdown.Item className="text-center py-3">
                        Loading notifications...
                    </Dropdown.Item>
                ) : error ? (
                    <Dropdown.Item className="text-center py-3 text-danger">
                        Error: {error}
                    </Dropdown.Item>
                ) : notifications.length === 0 ? (
                    <Dropdown.Item className="text-center py-3 text-muted">
                        No notifications yet
                    </Dropdown.Item>
                ) : (
                    notifications.map(notification => (
                        <Dropdown.Item 
                            key={notification.id}
                            className={`p-3 border-bottom ${!notification.isRead ? 'bg-light' : ''}`}
                            onClick={() => handleNotificationClick(notification)}
                        >
                            <div className="d-flex align-items-start">
                                <span className="me-2">{notification.icon}</span>
                                <div className="flex-grow-1">
                                    <p className="mb-1">{notification.message}</p>
                                    <small className="text-muted">
                                        {new Date(notification.dateSent).toLocaleString()}
                                    </small>
                                </div>
                                {!notification.isRead && (
                                    <button 
                                        className="btn btn-sm btn-link text-primary"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            markAsRead(notification.id);
                                        }}
                                    >
                                        <FiCheck size={16} />
                                    </button>
                                )}
                            </div>
                        </Dropdown.Item>
                    ))
                )}
            </Dropdown.Menu>
        </Dropdown>
    );
}

export default NotificationsDropdown;