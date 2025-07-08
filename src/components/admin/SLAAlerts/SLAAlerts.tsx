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
  Chip,
} from '@mui/material';
import { NotificationImportant } from '@mui/icons-material';
import { SLAAlert } from '../../../types';
import './SLAAlerts.css';

interface SLAAlertsProps {
  alerts: SLAAlert[];
}

const SLAAlerts: React.FC<SLAAlertsProps> = ({ alerts }) => {
  const formatTimeRemaining = (minutes: number) => {
    if (minutes < 0) {
      return `Overdue by ${Math.abs(minutes)} minutes`;
    }
    if (minutes < 60) {
      return `${minutes} minutes remaining`;
    }
    return `${Math.floor(minutes / 60)} hours ${minutes % 60} minutes remaining`;
  };

  return (
    <Card className="sla-alerts-card">
      <CardContent className="sla-alerts-content">
        <Box className="sla-alerts-header">
          <Typography variant="h6" className="sla-alerts-title">
            SLA Alerts
          </Typography>
          <Chip label={alerts.length} size="small" className="sla-alerts-badge" />
        </Box>

        <List dense>
          {alerts.map((alert) => (
            <ListItem key={alert.ticketId} className="sla-alert-item">
              <ListItemIcon>
                <NotificationImportant className={`sla-alert-icon ${alert.alertType}`} />
              </ListItemIcon>
              <ListItemText
                primary={alert.ticketTitle}
                secondary={
                  <Typography variant="body2" className="sla-alert-secondary">
                    {alert.ticketId} • {formatTimeRemaining(alert.remainingTime)}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default SLAAlerts;
