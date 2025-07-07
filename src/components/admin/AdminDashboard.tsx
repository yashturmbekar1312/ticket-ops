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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Badge,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
} from '@mui/material';
import {
  Dashboard,
  ConfirmationNumber,
  Warning,
  Schedule,
  TrendingUp,
  CheckCircle,
  Assignment,
  People,
  Settings,
  Analytics,
  Refresh,
  Visibility,
  Edit,
  AutoAwesome,
  NotificationImportant,
} from '@mui/icons-material';
import { DashboardMetrics, Ticket, SLAAlert, ApprovalRequest } from '../../types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color,
  subtitle,
  trend,
  onClick,
}) => (
  <Card
    sx={{
      height: '100%',
      cursor: onClick ? 'pointer' : 'default',
      '&:hover': onClick ? { elevation: 4 } : {},
    }}
    onClick={onClick}
  >
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            backgroundColor: `${color}20`,
            color: color,
            mr: 2,
          }}
        >
          {icon}
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
            {value.toLocaleString()}
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
        {trend && (
          <Box sx={{ textAlign: 'right' }}>
            <Typography
              variant="body2"
              color={trend.isPositive ? 'success.main' : 'error.main'}
              sx={{ fontWeight: 'bold' }}
            >
              {trend.isPositive ? '+' : ''}
              {trend.value}%
            </Typography>
          </Box>
        )}
      </Box>
    </CardContent>
  </Card>
);

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedDateRange, setSelectedDateRange] = useState('last30days');
  const [refreshing, setRefreshing] = useState(false);

  // Mock data - in production, this would come from API
  const dashboardData: DashboardMetrics = {
    totalTickets: 847,
    openTickets: 152,
    resolvedTickets: 695,
    overdueTickets: 23,
    slaBreachedTickets: 12,
    recentActivity: [],
    performanceMetrics: {
      averageResolutionTime: 24.5,
      firstResponseTime: 2.3,
      customerSatisfactionScore: 4.2,
      agentProductivity: 87,
      ticketVolumeThisMonth: 247,
      ticketVolumeLastMonth: 198,
    },
  };

  const slaAlerts: SLAAlert[] = [
    {
      ticketId: 'TK-001',
      ticketTitle: 'Critical server outage',
      priority: 'Critical',
      createdAt: '2024-07-07T08:00:00Z',
      dueDate: '2024-07-07T12:00:00Z',
      remainingTime: -30,
      escalationLevel: 2,
      alertType: 'breached',
    },
    {
      ticketId: 'TK-002',
      ticketTitle: 'Network connectivity issues',
      priority: 'High',
      createdAt: '2024-07-07T10:00:00Z',
      dueDate: '2024-07-07T14:00:00Z',
      remainingTime: 15,
      escalationLevel: 1,
      alertType: 'approaching',
    },
  ];

  const pendingApprovals: ApprovalRequest[] = [
    {
      id: 'AP-001',
      ticketId: 'TK-003',
      type: 'software',
      requestedBy: 'user1',
      requestedByName: 'John Doe',
      description: 'Adobe Creative Suite License',
      justification: 'Required for marketing campaign design',
      estimatedCost: 599,
      urgency: 'medium',
      createdAt: '2024-07-07T09:00:00Z',
      status: 'pending',
    },
    {
      id: 'AP-002',
      ticketId: 'TK-004',
      type: 'hardware',
      requestedBy: 'user2',
      requestedByName: 'Jane Smith',
      description: 'MacBook Pro 16" M3',
      justification: 'Current laptop is outdated and affecting productivity',
      estimatedCost: 2499,
      urgency: 'high',
      createdAt: '2024-07-07T11:00:00Z',
      status: 'pending',
    },
  ];

  const recentTickets: Ticket[] = [
    {
      id: 'TK-005',
      ticketNumber: 'TK-005',
      title: 'Email server maintenance',
      description: 'Scheduled maintenance for email server',
      category: 'Maintenance',
      priority: 'Medium',
      status: 'In Progress',
      createdBy: 'admin',
      createdByName: 'System Admin',
      assignedTo: 'agent1',
      assignedToName: 'Alice Johnson',
      department: 'IT',
      createdAt: '2024-07-07T12:00:00Z',
      updatedAt: '2024-07-07T12:30:00Z',
      slaBreached: false,
      tags: ['maintenance', 'email'],
      escalationLevel: 0,
      source: 'web',
    },
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return '#ff9800';
      case 'In Progress':
        return '#2196f3';
      case 'Resolved':
        return '#4caf50';
      case 'Closed':
        return '#9e9e9e';
      case 'Escalated':
        return '#f44336';
      default:
        return '#757575';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return '#d32f2f';
      case 'High':
        return '#f57c00';
      case 'Medium':
        return '#1976d2';
      case 'Low':
        return '#388e3c';
      default:
        return '#757575';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return '#f44336';
      case 'medium':
        return '#ff9800';
      case 'low':
        return '#4caf50';
      default:
        return '#757575';
    }
  };

  const formatTimeRemaining = (minutes: number) => {
    if (minutes < 0) {
      return `Overdue by ${Math.abs(minutes)} minutes`;
    }
    if (minutes < 60) {
      return `${minutes} minutes remaining`;
    }
    return `${Math.floor(minutes / 60)} hours ${minutes % 60} minutes remaining`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const DashboardOverview = () => (
    <Grid container spacing={3}>
      {/* Main Stats */}
      <Grid item xs={12} md={3}>
        <StatCard
          title="Total Tickets"
          value={dashboardData.totalTickets}
          icon={<ConfirmationNumber />}
          color="#2196f3"
          trend={{ value: 12.5, isPositive: true }}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <StatCard
          title="Open Tickets"
          value={dashboardData.openTickets}
          icon={<Schedule />}
          color="#ff9800"
          trend={{ value: -5.2, isPositive: false }}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <StatCard
          title="SLA Breaches"
          value={dashboardData.slaBreachedTickets}
          icon={<Warning />}
          color="#f44336"
          trend={{ value: -15.8, isPositive: true }}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <StatCard
          title="Resolved Today"
          value={32}
          icon={<CheckCircle />}
          color="#4caf50"
          trend={{ value: 8.3, isPositive: true }}
        />
      </Grid>

      {/* Performance Metrics */}
      <Grid item xs={12} md={6}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Analytics sx={{ mr: 1 }} />
              <Typography variant="h6">Performance Analytics</Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Avg Resolution Time
                  </Typography>
                  <Typography variant="h4">
                    {dashboardData.performanceMetrics.averageResolutionTime}h
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    First Response Time
                  </Typography>
                  <Typography variant="h4">
                    {dashboardData.performanceMetrics.firstResponseTime}h
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Customer Satisfaction
                  </Typography>
                  <Typography variant="h4">
                    {dashboardData.performanceMetrics.customerSatisfactionScore}/5
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Agent Productivity
                  </Typography>
                  <Typography variant="h4">
                    {dashboardData.performanceMetrics.agentProductivity}%
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* SLA Alerts */}
      <Grid item xs={12} md={6}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Warning sx={{ mr: 1 }} />
              <Typography variant="h6">SLA Alerts</Typography>
              <Badge badgeContent={slaAlerts.length} color="error" sx={{ ml: 1 }} />
            </Box>
            <List>
              {slaAlerts.map((alert) => (
                <ListItem key={alert.ticketId} divider>
                  <ListItemIcon>
                    <NotificationImportant
                      color={alert.alertType === 'breached' ? 'error' : 'warning'}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={alert.ticketTitle}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {alert.ticketId} • {alert.priority}
                        </Typography>
                        <Typography
                          variant="caption"
                          color={alert.remainingTime < 0 ? 'error' : 'warning'}
                        >
                          {formatTimeRemaining(alert.remainingTime)}
                        </Typography>
                      </Box>
                    }
                  />
                  <Chip
                    label={alert.alertType}
                    size="small"
                    color={alert.alertType === 'breached' ? 'error' : 'warning'}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>

      {/* Recent Activity */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TrendingUp sx={{ mr: 1 }} />
              <Typography variant="h6">Recent Tickets</Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Ticket ID</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Assigned To</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell>{ticket.ticketNumber}</TableCell>
                      <TableCell>{ticket.title}</TableCell>
                      <TableCell>
                        <Chip
                          label={ticket.priority}
                          size="small"
                          sx={{ backgroundColor: getPriorityColor(ticket.priority) + '20' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={ticket.status}
                          size="small"
                          sx={{ backgroundColor: getStatusColor(ticket.status) + '20' }}
                        />
                      </TableCell>
                      <TableCell>{ticket.assignedToName || 'Unassigned'}</TableCell>
                      <TableCell>{new Date(ticket.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <IconButton size="small">
                          <Visibility />
                        </IconButton>
                        <IconButton size="small">
                          <Edit />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const TicketManagement = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Assignment sx={{ mr: 1 }} />
              <Typography variant="h6">Ticket Management</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Comprehensive ticket management functionality will be implemented here.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const ApprovalManagement = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Assignment sx={{ mr: 1 }} />
              <Typography variant="h6">Pending Approvals</Typography>
              <Badge badgeContent={pendingApprovals.length} color="primary" sx={{ ml: 1 }} />
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Request ID</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Requester</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Cost</TableCell>
                    <TableCell>Urgency</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pendingApprovals.map((approval) => (
                    <TableRow key={approval.id}>
                      <TableCell>{approval.id}</TableCell>
                      <TableCell>
                        <Chip label={approval.type} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>{approval.requestedByName}</TableCell>
                      <TableCell>{approval.description}</TableCell>
                      <TableCell>
                        {approval.estimatedCost && formatCurrency(approval.estimatedCost)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={approval.urgency}
                          size="small"
                          sx={{ backgroundColor: getUrgencyColor(approval.urgency) + '20' }}
                        />
                      </TableCell>
                      <TableCell>{new Date(approval.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button size="small" color="success" sx={{ mr: 1 }}>
                          Approve
                        </Button>
                        <Button size="small" color="error">
                          Reject
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const UserTeamManagement = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <People sx={{ mr: 1 }} />
              <Typography variant="h6">User & Team Management</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              User and team management functionality will be implemented here.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const AutomationSettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AutoAwesome sx={{ mr: 1 }} />
              <Typography variant="h6">Automation & Rules</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Automation rules and settings will be implemented here.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const SystemSettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Settings sx={{ mr: 1 }} />
              <Typography variant="h6">System Settings</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              System configuration and settings will be implemented here.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Admin Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Date Range</InputLabel>
            <Select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              label="Date Range"
            >
              <MenuItem value="last7days">Last 7 Days</MenuItem>
              <MenuItem value="last30days">Last 30 Days</MenuItem>
              <MenuItem value="last3months">Last 3 Months</MenuItem>
              <MenuItem value="lastyear">Last Year</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </Box>
      </Box>

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab icon={<Dashboard />} label="Overview" />
        <Tab icon={<Assignment />} label="Tickets" />
        <Tab icon={<CheckCircle />} label="Approvals" />
        <Tab icon={<People />} label="Users & Teams" />
        <Tab icon={<AutoAwesome />} label="Automation" />
        <Tab icon={<Settings />} label="Settings" />
      </Tabs>

      <TabPanel value={activeTab} index={0}>
        <DashboardOverview />
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        <TicketManagement />
      </TabPanel>
      <TabPanel value={activeTab} index={2}>
        <ApprovalManagement />
      </TabPanel>
      <TabPanel value={activeTab} index={3}>
        <UserTeamManagement />
      </TabPanel>
      <TabPanel value={activeTab} index={4}>
        <AutomationSettings />
      </TabPanel>
      <TabPanel value={activeTab} index={5}>
        <SystemSettings />
      </TabPanel>
    </Box>
  );
};

export default AdminDashboard;
