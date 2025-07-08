import React, { useState } from 'react';
import { Badge, IconButton, Popover, Typography, Box, Divider, Button, Paper } from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Close as CloseIcon,
  MarkEmailRead as MarkReadIcon,
} from '@mui/icons-material';
import { TicketNotification } from '../../../../types';
import { useNotifications } from '../../../../hooks/useNotifications';
import NotificationList from '../NotificationList';
import './NotificationBell.css';

interface NotificationBellProps {
  onClick?: () => void;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ onClick }) => {
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
      <IconButton color="inherit" onClick={handleClick} className="notification-bell">
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
        className="notification-popover"
      >
        <Paper className="notification-paper">
          <Box className="notification-header">
            <Typography variant="h6">Notifications</Typography>
            <Box className="notification-header-actions">
              {unreadCount > 0 && (
                <Button
                  size="small"
                  startIcon={<MarkReadIcon />}
                  onClick={markAllAsRead}
                  className="mark-all-read-btn"
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

          <NotificationList
            notifications={notifications}
            onNotificationClick={handleNotificationClick}
            onDelete={deleteNotification}
          />
        </Paper>
      </Popover>
    </>
  );
};

export default NotificationBell;
