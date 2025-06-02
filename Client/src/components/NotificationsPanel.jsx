import React, { useEffect, useState } from 'react';
import { Card, ListGroup, Badge, Button } from 'react-bootstrap';
import { FiBell, FiCheck } from 'react-icons/fi';

import { fetchUserNotifications,  markAsRead,markAllAsRead } from '../services/notificationService';
function NotificationsPanel() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const loadNotifications = async () => {
            try {
                const data = await fetchUserNotifications();
                setNotifications(Array.isArray(data) ? data : []);
                setUnreadCount(data.filter(n => !n.isRead).length);
            } catch (error) {
                console.error("Error loading notifications:", error);
                setNotifications([]);
                setUnreadCount(0);
            }
        };
      


        loadNotifications();
        
        
        const interval = setInterval(loadNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            await markAsRead(id);
            setNotifications(notifications.map(n => 
                n.id === id ? { ...n, isRead: true } : n
            ));
            setUnreadCount(prev => prev - 1);
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsRead();
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error("Error marking all as read:", error);
        }
    };


    return (
        <Card className="shadow-sm">
            <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                    <FiBell className="me-2" />
                    Notifications
                </h5>
                <div>
                    <Badge pill bg="primary">{unreadCount} unread</Badge>
                    <Button variant="link" size="sm" onClick={markAllAsRead}>
                        Mark all as read
                    </Button>
                </div>
            </Card.Header>
            <ListGroup variant="flush">
                {notifications.length === 0 ? (
                    <ListGroup.Item className="text-center py-4 text-muted">
                        No notifications yet
                    </ListGroup.Item>
                ) : (
                    notifications.map(notification => (
                        <ListGroup.Item 
                            key={notification.id}
                            className={`${!notification.isRead ? 'fw-bold' : ''}`}
                        >
                            <div className="d-flex justify-content-between">
                                <div>
                                    <span className="me-2">{notification.icon}</span>
                                    {notification.message}
                                </div>
                                <div>
                                    {!notification.isRead && (
                                        <Button 
                                            variant="link" 
                                            size="sm" 
                                            className="text-success p-0 me-2"
                                            onClick={() => markAsRead(notification.id)}
                                        >
                                            <FiCheck />
                                        </Button>
                                    )}
                                    <small className="text-muted">
                                        {new Date(notification.dateSent).toLocaleTimeString()}
                                    </small>
                                </div>
                            </div>
                        </ListGroup.Item>
                    ))
                )}
            </ListGroup>
        </Card>
    );
}

export default NotificationsPanel;