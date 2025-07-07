import React, { useState, useEffect, ReactNode } from 'react';
import {
  Snackbar,
  Alert,
  Badge,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Box,
  Divider,
  Button,
  Paper,
  Avatar,
  Chip,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Assignment as TicketIcon,
  Comment as CommentIcon,
  Warning as WarningIcon,
  TrendingUp as EscalationIcon,
  Close as CloseIcon,
  MarkEmailRead as MarkReadIcon,
  DeleteOutline as DeleteIcon,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { TicketNotification } from '../../types';
import {
  useNotifications,
  NotificationContext,
  NotificationContextType,
} from '../../hooks/useNotifications';

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

    // Simulate real-time notifications (DISABLED)
    // const interval = setInterval(() => {
    //   if (Math.random() > 0.95) {
    //     // 5% chance every second
    //     const mockNotification: TicketNotification = {
    //       id: Date.now().toString(),
    //       type: 'ticket_update',
    //       title: 'Ticket Updated',
    //       message: 'Your ticket has been updated by an agent',
    //       relatedTicketId: 'TKT-001',
    //       isRead: false,
    //       createdAt: new Date().toISOString(),
    //     };
    //     onMessage(mockNotification);
    //   }
    // }, 1000);

    return () => {
      // clearInterval(interval);
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

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children, userId }) => {
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
      {children}
      {currentSnackbar && (
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            severity={getNotificationSeverity(currentSnackbar.type)}
            onClose={() => setSnackbarOpen(false)}
            sx={{ width: '100%' }}
          >
            <Typography variant="subtitle2">{currentSnackbar.title}</Typography>
            <Typography variant="body2">{currentSnackbar.message}</Typography>
          </Alert>
        </Snackbar>
      )}
    </NotificationContext.Provider>
  );
};

const getNotificationSeverity = (
  type: TicketNotification['type']
): 'success' | 'info' | 'warning' | 'error' => {
  switch (type) {
    case 'reminder':
      return 'warning';
    case 'ticket_update':
      return 'info';
    case 'ticket_resolved':
      return 'success';
    case 'system_announcement':
      return 'info';
    default:
      return 'info';
  }
};

const getNotificationIcon = (type: TicketNotification['type']) => {
  switch (type) {
    case 'ticket_update':
      return <TicketIcon />;
    case 'ticket_resolved':
      return <CommentIcon />;
    case 'reminder':
      return <WarningIcon />;
    case 'system_announcement':
      return <EscalationIcon />;
    default:
      return <NotificationsIcon />;
  }
};

interface NotificationBellProps {
  onClick?: () => void;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ onClick }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } =
    useNotifications();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    onClick?.();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (notification: TicketNotification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    // Navigate to ticket if applicable
    if (notification.relatedTicketId) {
      window.location.href = `/tickets/${notification.relatedTicketId}`;
    }
    handleClose();
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton color="inherit" onClick={handleClick} sx={{ ml: 1 }}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Paper sx={{ width: 400, maxHeight: 600 }}>
          <Box
            sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <Typography variant="h6">Notifications</Typography>
            <Box>
              {unreadCount > 0 && (
                <Button
                  size="small"
                  startIcon={<MarkReadIcon />}
                  onClick={markAllAsRead}
                  sx={{ mr: 1 }}
                >
                  Mark all read
                </Button>
              )}
              <IconButton onClick={handleClose} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          <Divider />

          {notifications.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No notifications yet
              </Typography>
            </Box>
          ) : (
            <List sx={{ maxHeight: 400, overflow: 'auto' }}>
              {notifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <ListItem
                    onClick={() => handleNotificationClick(notification)}
                    sx={{
                      cursor: 'pointer',
                      backgroundColor: notification.isRead ? 'transparent' : 'action.hover',
                      '&:hover': {
                        backgroundColor: 'action.selected',
                      },
                      py: 1.5,
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                        {getNotificationIcon(notification.type)}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle2">{notification.title}</Typography>
                          {!notification.isRead && (
                            <Chip label="New" color="primary" size="small" />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {notification.message}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDistanceToNow(new Date(notification.createdAt), {
                              addSuffix: true,
                            })}
                          </Typography>
                        </Box>
                      }
                    />
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItem>
                  {index < notifications.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Paper>
      </Popover>
    </>
  );
};

export default NotificationProvider;
