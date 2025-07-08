import React from 'react';
import { Snackbar, Alert, Typography } from '@mui/material';
import { TicketNotification } from '../../../../types';
import './NotificationSnackbar.css';

interface NotificationSnackbarProps {
  notification: TicketNotification | null;
  open: boolean;
  onClose: () => void;
}

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

const NotificationSnackbar: React.FC<NotificationSnackbarProps> = ({
  notification,
  open,
  onClose,
}) => {
  if (!notification) return null;

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      className="notification-snackbar"
    >
      <Alert
        severity={getNotificationSeverity(notification.type)}
        onClose={onClose}
        className="notification-snackbar-alert"
      >
        <Typography variant="subtitle2" className="notification-snackbar-title">
          {notification.title}
        </Typography>
        <Typography variant="body2" className="notification-snackbar-message">
          {notification.message}
        </Typography>
      </Alert>
    </Snackbar>
  );
};

export default NotificationSnackbar;
