import React from 'react';
import { Grid, Card, CardContent, Box, Typography } from '@mui/material';
import { ConfirmationNumber, Notifications, CheckCircle } from '@mui/icons-material';
import { Ticket, TicketNotification } from '../../../../types';
import './DashboardStats.css';

interface DashboardStatsProps {
  tickets: Ticket[];
  notifications: TicketNotification[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ tickets, notifications }) => {
  const unreadNotifications = notifications.filter((n) => !n.isRead).length;
  const resolvedTickets = tickets.filter((t) => t.status === 'Resolved').length;

  return (
    <Grid container spacing={3} className="dashboard-stats">
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Box className="stat-item">
              <ConfirmationNumber className="stat-icon tickets-icon" />
              <Typography variant="h6">My Tickets</Typography>
            </Box>
            <Typography variant="h3" className="stat-value tickets-value">
              {tickets.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total tickets created
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Box className="stat-item">
              <Notifications className="stat-icon notifications-icon" />
              <Typography variant="h6">Notifications</Typography>
            </Box>
            <Typography variant="h3" className="stat-value notifications-value">
              {unreadNotifications}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Unread notifications
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Box className="stat-item">
              <CheckCircle className="stat-icon resolved-icon" />
              <Typography variant="h6">Resolved</Typography>
            </Box>
            <Typography variant="h3" className="stat-value resolved-value">
              {resolvedTickets}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Resolved tickets
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default DashboardStats;
