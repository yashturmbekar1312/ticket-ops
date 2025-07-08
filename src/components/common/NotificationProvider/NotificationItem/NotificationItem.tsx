import React from 'react';
import {
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Box,
  Avatar,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Assignment as TicketIcon,
  Comment as CommentIcon,
  Warning as WarningIcon,
  TrendingUp as EscalationIcon,
  Notifications as NotificationsIcon,
  DeleteOutline as DeleteIcon,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { TicketNotification } from '../../../../types';
import './NotificationItem.css';

interface NotificationItemProps {
  notification: TicketNotification;
  onNotificationClick: (notification: TicketNotification) => void;
  onDelete: (id: string) => void;
}

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

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onNotificationClick,
  onDelete,
}) => {
  const handleClick = () => {
    onNotificationClick(notification);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(notification.id);
  };

  return (
    <ListItem
      onClick={handleClick}
      className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
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
            {!notification.isRead && <Chip label="New" color="primary" size="small" />}
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
      <IconButton onClick={handleDelete} size="small" className="notification-item-delete">
        <DeleteIcon />
      </IconButton>
    </ListItem>
  );
};

export default NotificationItem;
