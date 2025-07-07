import React from 'react';
import { Grid, Card, CardContent, Typography, Box, Chip, LinearProgress } from '@mui/material';
import { ConfirmationNumber, TrendingUp, Schedule, CheckCircle } from '@mui/icons-material';
import { useAuth } from '../hooks/auth';
import { getStatusColor, getPriorityColor } from '../utils/permissions';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, subtitle }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box
          sx={{
            p: 1,
            borderRadius: 1,
            backgroundColor: `${color}20`,
            color: color,
            mr: 2,
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  // Mock data - in a real app, this would come from API
  const dashboardData = {
    totalTickets: 12,
    openTickets: 5,
    inProgressTickets: 3,
    resolvedTickets: 4,
    recentTickets: [
      {
        id: '1',
        title: 'Laptop not working',
        status: 'Open',
        priority: 'High',
        createdAt: '2 hours ago',
      },
      {
        id: '2',
        title: 'Access to new software',
        status: 'In Progress',
        priority: 'Medium',
        createdAt: '1 day ago',
      },
      {
        id: '3',
        title: 'Network connectivity issues',
        status: 'Escalated',
        priority: 'High',
        createdAt: '2 days ago',
      },
    ],
  };

  const getPersonalizedStats = () => {
    switch (user?.role) {
      case 'IT Admin':
        return {
          title: 'System Overview',
          stats: [
            { title: 'Total Tickets', value: 45, icon: <ConfirmationNumber />, color: '#2196f3' },
            { title: 'Open Tickets', value: 12, icon: <Schedule />, color: '#ff9800' },
            { title: 'In Progress', value: 8, icon: <TrendingUp />, color: '#4caf50' },
            { title: 'Resolved Today', value: 15, icon: <CheckCircle />, color: '#9c27b0' },
          ],
        };
      case 'Manager':
        return {
          title: 'Team Overview',
          stats: [
            { title: 'Team Tickets', value: 23, icon: <ConfirmationNumber />, color: '#2196f3' },
            { title: 'Pending Assignment', value: 5, icon: <Schedule />, color: '#ff9800' },
            { title: 'High Priority', value: 3, icon: <TrendingUp />, color: '#f44336' },
            { title: 'Completed', value: 8, icon: <CheckCircle />, color: '#4caf50' },
          ],
        };
      case 'HR':
        return {
          title: 'HR Tickets',
          stats: [
            { title: 'HR Tickets', value: 8, icon: <ConfirmationNumber />, color: '#2196f3' },
            { title: 'Onboarding', value: 3, icon: <Schedule />, color: '#ff9800' },
            { title: 'Access Requests', value: 2, icon: <TrendingUp />, color: '#4caf50' },
            { title: 'Completed', value: 3, icon: <CheckCircle />, color: '#9c27b0' },
          ],
        };
      default:
        return {
          title: 'My Tickets',
          stats: [
            { title: 'My Tickets', value: 5, icon: <ConfirmationNumber />, color: '#2196f3' },
            { title: 'Open', value: 2, icon: <Schedule />, color: '#ff9800' },
            { title: 'In Progress', value: 1, icon: <TrendingUp />, color: '#4caf50' },
            { title: 'Resolved', value: 2, icon: <CheckCircle />, color: '#9c27b0' },
          ],
        };
    }
  };

  const { title, stats } = getPersonalizedStats();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Welcome back, {user?.name}! Here's your overview.
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Tickets
              </Typography>
              <Box>
                {dashboardData.recentTickets.map((ticket, index) => (
                  <Box
                    key={ticket.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      py: 2,
                      borderBottom:
                        index < dashboardData.recentTickets.length - 1
                          ? '1px solid #e0e0e0'
                          : 'none',
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {ticket.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {ticket.createdAt}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip
                        label={ticket.status}
                        size="small"
                        sx={{
                          backgroundColor: getStatusColor(ticket.status),
                          color: 'white',
                        }}
                      />
                      <Chip
                        label={ticket.priority}
                        size="small"
                        sx={{
                          backgroundColor: getPriorityColor(ticket.priority),
                          color: 'white',
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Ticket Resolution Rate
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  This Week
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={75}
                  sx={{ height: 8, borderRadius: 4, mt: 1 }}
                />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  75% (15 of 20 tickets)
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  This Month
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={82}
                  sx={{ height: 8, borderRadius: 4, mt: 1 }}
                />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  82% (68 of 83 tickets)
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
