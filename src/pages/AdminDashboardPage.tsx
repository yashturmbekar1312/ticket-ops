import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Button,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
  LinearProgress,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Badge,
  Avatar,
} from '@mui/material';
import {
  Dashboard,
  ConfirmationNumber,
  People,
  Schedule,
  TrendingUp,
  Warning,
  CheckCircle,
  Error,
  Info,
  Speed,
  Analytics,
  SupervisorAccount,
  Refresh,
  Assessment,
  PieChart,
  BarChart,
  ShowChart,
} from '@mui/icons-material';
import { useAuth } from '../hooks/auth';

interface SystemMetrics {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  slaBreaches: number;
  avgResolutionTime: number;
  customerSatisfaction: number;
  systemUptime: number;
  activeUsers: number;
  agentUtilization: number;
}

interface AgentPerformance {
  id: string;
  name: string;
  avatar?: string;
  role: string;
  department: string;
  ticketsAssigned: number;
  ticketsResolved: number;
  avgResolutionTime: number;
  customerRating: number;
  isOnline: boolean;
  lastActivity: string;
  workloadStatus: 'low' | 'medium' | 'high' | 'overloaded';
}

interface RecentActivity {
  id: string;
  type:
    | 'ticket_created'
    | 'ticket_resolved'
    | 'user_login'
    | 'escalation'
    | 'sla_breach'
    | 'system_alert';
  description: string;
  userId: string;
  userName: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  ticketId?: string;
}

interface SystemAlert {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionRequired: boolean;
  relatedEntity?: string;
}

const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');

  const [systemMetrics] = useState<SystemMetrics>({
    totalTickets: 1247,
    openTickets: 156,
    inProgressTickets: 89,
    resolvedTickets: 1002,
    slaBreaches: 23,
    avgResolutionTime: 4.2,
    customerSatisfaction: 4.3,
    systemUptime: 99.8,
    activeUsers: 145,
    agentUtilization: 78,
  });

  const [agentPerformance] = useState<AgentPerformance[]>([
    {
      id: '1',
      name: 'John Smith',
      role: 'Senior IT Agent',
      department: 'IT Support',
      ticketsAssigned: 45,
      ticketsResolved: 38,
      avgResolutionTime: 3.2,
      customerRating: 4.8,
      isOnline: true,
      lastActivity: '2 minutes ago',
      workloadStatus: 'medium',
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      role: 'IT Agent',
      department: 'IT Support',
      ticketsAssigned: 32,
      ticketsResolved: 29,
      avgResolutionTime: 4.1,
      customerRating: 4.6,
      isOnline: true,
      lastActivity: '5 minutes ago',
      workloadStatus: 'high',
    },
    {
      id: '3',
      name: 'Mike Davis',
      role: 'Team Lead',
      department: 'Network Operations',
      ticketsAssigned: 28,
      ticketsResolved: 25,
      avgResolutionTime: 2.8,
      customerRating: 4.9,
      isOnline: false,
      lastActivity: '1 hour ago',
      workloadStatus: 'low',
    },
  ]);

  const [recentActivity] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'sla_breach',
      description: 'Ticket #TKT-2023-001 has breached SLA deadline',
      userId: 'system',
      userName: 'System',
      timestamp: '2024-01-15T10:30:00Z',
      severity: 'critical',
      ticketId: 'TKT-2023-001',
    },
    {
      id: '2',
      type: 'ticket_created',
      description: 'New high-priority ticket created: Network outage in Building A',
      userId: 'user-1',
      userName: 'Jane Doe',
      timestamp: '2024-01-15T10:15:00Z',
      severity: 'high',
      ticketId: 'TKT-2023-002',
    },
    {
      id: '3',
      type: 'escalation',
      description: 'Ticket #TKT-2023-003 escalated to Level 2 support',
      userId: 'agent-1',
      userName: 'John Smith',
      timestamp: '2024-01-15T09:45:00Z',
      severity: 'medium',
      ticketId: 'TKT-2023-003',
    },
  ]);

  const [systemAlerts] = useState<SystemAlert[]>([
    {
      id: '1',
      type: 'warning',
      title: 'High Ticket Volume',
      message: 'Current ticket creation rate is 40% above normal. Consider adding more agents.',
      timestamp: '2024-01-15T08:00:00Z',
      isRead: false,
      actionRequired: true,
    },
    {
      id: '2',
      type: 'error',
      title: 'Email Service Disruption',
      message: 'SMTP server connection failed. Email notifications are temporarily unavailable.',
      timestamp: '2024-01-15T07:30:00Z',
      isRead: false,
      actionRequired: true,
    },
    {
      id: '3',
      type: 'info',
      title: 'System Maintenance',
      message: 'Scheduled maintenance window for database optimization completed successfully.',
      timestamp: '2024-01-15T06:00:00Z',
      isRead: true,
      actionRequired: false,
    },
  ]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate data refresh
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const getWorkloadColor = (status: string) => {
    switch (status) {
      case 'low':
        return 'success';
      case 'medium':
        return 'warning';
      case 'high':
        return 'error';
      case 'overloaded':
        return 'error';
      default:
        return 'default';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'ticket_created':
        return <ConfirmationNumber />;
      case 'ticket_resolved':
        return <CheckCircle />;
      case 'user_login':
        return <People />;
      case 'escalation':
        return <TrendingUp />;
      case 'sla_breach':
        return <Warning />;
      case 'system_alert':
        return <Error />;
      default:
        return <Info />;
    }
  };

  const overviewTab = () => (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Key Metrics */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ConfirmationNumber color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Tickets</Typography>
              </Box>
              <Typography variant="h3" color="primary">
                {systemMetrics.totalTickets.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Last 30 days
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Schedule color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6">Open Tickets</Typography>
              </Box>
              <Typography variant="h3" color="warning.main">
                {systemMetrics.openTickets}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Requiring attention
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Warning color="error" sx={{ mr: 1 }} />
                <Typography variant="h6">SLA Breaches</Typography>
              </Box>
              <Typography variant="h3" color="error.main">
                {systemMetrics.slaBreaches}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This month
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Speed color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Avg Resolution</Typography>
              </Box>
              <Typography variant="h3" color="success.main">
                {systemMetrics.avgResolutionTime}h
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Resolution time
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* System Health */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                System Health
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">System Uptime</Typography>
                  <Typography variant="body2" color="success.main">
                    {systemMetrics.systemUptime}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={systemMetrics.systemUptime}
                  color="success"
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Agent Utilization</Typography>
                  <Typography variant="body2" color="warning.main">
                    {systemMetrics.agentUtilization}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={systemMetrics.agentUtilization}
                  color="warning"
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2">Active Users</Typography>
                <Chip label={systemMetrics.activeUsers} color="primary" size="small" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Recent Activity
              </Typography>
              <List>
                {recentActivity.slice(0, 5).map((activity, index) => (
                  <React.Fragment key={activity.id}>
                    <ListItem>
                      <ListItemIcon>{getActivityIcon(activity.type)}</ListItemIcon>
                      <ListItemText
                        primary={activity.description}
                        secondary={`${activity.userName} • ${new Date(activity.timestamp).toLocaleString()}`}
                      />
                      <Chip
                        label={activity.severity}
                        color={
                          activity.severity === 'critical'
                            ? 'error'
                            : activity.severity === 'high'
                              ? 'warning'
                              : activity.severity === 'medium'
                                ? 'info'
                                : 'default'
                        }
                        size="small"
                      />
                    </ListItem>
                    {index < recentActivity.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* System Alerts */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                System Alerts
              </Typography>
              <Grid container spacing={2}>
                {systemAlerts.map((alert) => (
                  <Grid item xs={12} md={4} key={alert.id}>
                    <Alert
                      severity={alert.type}
                      action={
                        alert.actionRequired && (
                          <Button color="inherit" size="small">
                            Action
                          </Button>
                        )
                      }
                    >
                      <Typography variant="subtitle2">{alert.title}</Typography>
                      <Typography variant="body2">{alert.message}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(alert.timestamp).toLocaleString()}
                      </Typography>
                    </Alert>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const agentsTab = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Agent Performance & Management
      </Typography>

      <Grid container spacing={3}>
        {/* Agent Performance Cards */}
        {agentPerformance.map((agent) => (
          <Grid item xs={12} md={6} lg={4} key={agent.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Badge
                    color={agent.isOnline ? 'success' : 'default'}
                    variant="dot"
                    overlap="circular"
                  >
                    <Avatar sx={{ mr: 2 }}>{agent.name.charAt(0)}</Avatar>
                  </Badge>
                  <Box>
                    <Typography variant="h6">{agent.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {agent.role} • {agent.department}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Tickets Assigned</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {agent.ticketsAssigned}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Tickets Resolved</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {agent.ticketsResolved}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Avg Resolution Time</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {agent.avgResolutionTime}h
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Customer Rating</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {agent.customerRating}/5.0
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Chip
                    label={agent.workloadStatus}
                    color={getWorkloadColor(agent.workloadStatus)}
                    size="small"
                  />
                  <Typography variant="caption" color="text.secondary">
                    {agent.lastActivity}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const reportsTab = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        System Reports & Analytics
      </Typography>

      <Grid container spacing={3}>
        {/* Report Cards */}
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 3 } }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PieChart color="primary" sx={{ mr: 2 }} />
                <Typography variant="h6">Ticket Volume</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Daily, weekly, and monthly ticket statistics
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 3 } }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BarChart color="success" sx={{ mr: 2 }} />
                <Typography variant="h6">SLA Compliance</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                SLA performance and breach analysis
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 3 } }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ShowChart color="warning" sx={{ mr: 2 }} />
                <Typography variant="h6">Agent Performance</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Individual and team performance metrics
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 3 } }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Assessment color="info" sx={{ mr: 2 }} />
                <Typography variant="h6">Customer Satisfaction</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Customer feedback and satisfaction trends
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Quick Statistics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {systemMetrics.totalTickets}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Tickets
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="success.main">
                      {((systemMetrics.resolvedTickets / systemMetrics.totalTickets) * 100).toFixed(
                        1
                      )}
                      %
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Resolution Rate
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="info.main">
                      {systemMetrics.customerSatisfaction}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Customer Satisfaction
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="warning.main">
                      {systemMetrics.avgResolutionTime}h
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Avg Resolution Time
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  // Check if user has admin access
  if (user?.role !== 'Admin' && user?.role !== 'IT Admin') {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          You don't have permission to access the admin dashboard. Please contact your
          administrator.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Admin Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              label="Time Range"
            >
              <MenuItem value="1h">Last Hour</MenuItem>
              <MenuItem value="24h">Last 24 Hours</MenuItem>
              <MenuItem value="7d">Last 7 Days</MenuItem>
              <MenuItem value="30d">Last 30 Days</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            startIcon={refreshing ? <CircularProgress size={16} /> : <Refresh />}
            onClick={handleRefresh}
            disabled={refreshing}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="admin dashboard tabs">
          <Tab
            label="System Overview"
            icon={<Dashboard />}
            iconPosition="start"
            sx={{ minHeight: 'auto' }}
          />
          <Tab
            label="Agent Management"
            icon={<SupervisorAccount />}
            iconPosition="start"
            sx={{ minHeight: 'auto' }}
          />
          <Tab
            label="Reports & Analytics"
            icon={<Analytics />}
            iconPosition="start"
            sx={{ minHeight: 'auto' }}
          />
        </Tabs>
      </Box>

      {tabValue === 0 && overviewTab()}
      {tabValue === 1 && agentsTab()}
      {tabValue === 2 && reportsTab()}
    </Box>
  );
};

export default AdminDashboardPage;
