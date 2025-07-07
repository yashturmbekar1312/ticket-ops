import React, { useContext } from 'react';
import { TicketNotification } from '../types';

export interface NotificationContextType {
  notifications: TicketNotification[];
  unreadCount: number;
  addNotification: (notification: TicketNotification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
}

export const NotificationContext = React.createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
