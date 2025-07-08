import React from 'react';
import { List, Box, Typography, Divider } from '@mui/material';
import { TicketNotification } from '../../../../types';
import NotificationItem from '../NotificationItem';
import './NotificationList.css';

interface NotificationListProps {
  notifications: TicketNotification[];
  onNotificationClick: (notification: TicketNotification) => void;
  onDelete: (id: string) => void;
}

const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  onNotificationClick,
  onDelete,
}) => {
  if (notifications.length === 0) {
    return (
      <Box className="notification-list-empty">
        <Typography variant="body2" color="text.secondary">
          No notifications yet
        </Typography>
      </Box>
    );
  }

  return (
    <List className="notification-list">
      {notifications.map((notification, index) => (
        <React.Fragment key={notification.id}>
          <NotificationItem
            notification={notification}
            onNotificationClick={onNotificationClick}
            onDelete={onDelete}
          />
          {index < notifications.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </List>
  );
};

export default NotificationList;
