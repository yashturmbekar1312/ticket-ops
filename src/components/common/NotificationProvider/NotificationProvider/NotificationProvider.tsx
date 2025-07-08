import React, { useState, useEffect, ReactNode } from 'react';
import { TicketNotification } from '../../../../types';
import { NotificationContext, NotificationContextType } from '../../../../hooks/useNotifications';
import NotificationSnackbar from '../NotificationSnackbar';
import './NotificationProvider.css';

// Mock WebSocket service for real-time notifications
class WebSocketService {
  private static instance: WebSocketService;
  private callbacks: Map<string, (data: TicketNotification) => void> = new Map();

  static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  connect(userId: string, onMessage: (data: TicketNotification) => void) {
    // In production, this would connect to a real WebSocket server
    // Mock simulation disabled to stop unnecessary notifications
    this.callbacks.set(userId, onMessage);

    return () => {
      this.callbacks.delete(userId);
    };
  }

  disconnect(userId: string) {
    this.callbacks.delete(userId);
  }

  // Method to send notifications (would be called from backend)
  sendNotification(userId: string, notification: TicketNotification) {
    const callback = this.callbacks.get(userId);
    if (callback) {
      callback(notification);
    }
  }
}

interface NotificationProviderProps {
  children: ReactNode;
  userId: string;
}

const NotificationProvider: React.FC<NotificationProviderProps> = ({ children, userId }) => {
  const [notifications, setNotifications] = useState<TicketNotification[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [currentSnackbar, setCurrentSnackbar] = useState<TicketNotification | null>(null);

  useEffect(() => {
    const wsService = WebSocketService.getInstance();

    const handleNewNotification = (notification: TicketNotification) => {
      setNotifications((prev) => [notification, ...prev]);
      setCurrentSnackbar(notification);
      setSnackbarOpen(true);
    };

    const cleanup = wsService.connect(userId, handleNewNotification);

    // Load existing notifications (would come from API)
    const mockNotifications: TicketNotification[] = [
      {
        id: '1',
        type: 'ticket_update',
        title: 'Ticket Assigned',
        message: 'You have been assigned to ticket TKT-001',
        relatedTicketId: 'TKT-001',
        isRead: false,
        createdAt: new Date(Date.now() - 300000).toISOString(),
      },
      {
        id: '2',
        type: 'ticket_update',
        title: 'New Comment',
        message: 'A new comment has been added to your ticket',
        relatedTicketId: 'TKT-002',
        isRead: false,
        createdAt: new Date(Date.now() - 600000).toISOString(),
      },
      {
        id: '3',
        type: 'reminder',
        title: 'SLA Warning',
        message: 'Ticket TKT-003 is approaching SLA deadline',
        relatedTicketId: 'TKT-003',
        isRead: true,
        createdAt: new Date(Date.now() - 1800000).toISOString(),
      },
    ];

    setNotifications(mockNotifications);

    return cleanup;
  }, [userId]);

  const addNotification = (notification: TicketNotification) => {
    setNotifications((prev) => [notification, ...prev]);
    setCurrentSnackbar(notification);
    setSnackbarOpen(true);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  };

  return (
    <NotificationContext.Provider value={value}>
      <div className="notification-provider">
        {children}
        <NotificationSnackbar
          notification={currentSnackbar}
          open={snackbarOpen}
          onClose={() => setSnackbarOpen(false)}
        />
      </div>
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
