import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Badge,
  Avatar,
} from '@mui/material';
import { Notifications } from '@mui/icons-material';
import { TicketNotification } from '../../../../types';
import './NotificationsList.css';

interface NotificationsListProps {
  notifications: TicketNotification[];
}

const NotificationsList: React.FC<NotificationsListProps> = ({ notifications }) => {
  const unreadNotifications = notifications.filter((n) => !n.isRead).length;

  return (
    <Card className="notifications-list-card">
      <CardContent>
        <Box className="notifications-header">
          <Notifications className="notifications-icon" />
          <Typography variant="h6">Recent Notifications</Typography>
          {unreadNotifications > 0 && (
            <Badge
              badgeContent={unreadNotifications}
              color="error"
              className="notifications-badge"
            />
          )}
        </Box>
        <List className="notifications-list">
          {notifications.map((notification) => (
            <ListItem
              key={notification.id}
              className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
            >
              <ListItemIcon>
                <Avatar
                  className={`notification-avatar ${notification.isRead ? 'read' : 'unread'}`}
                >
                  <Notifications />
                </Avatar>
              </ListItemIcon>
              <ListItemText
                primary={notification.title}
                secondary={
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {notification.message}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default NotificationsList;
