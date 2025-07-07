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
  ArrowUpward,
  ArrowDownward,
} from '@mui/icons-material';
import { DashboardMetrics, Ticket, SLAAlert, ApprovalRequest } from '../../types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
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
  bgColor,
  subtitle,
  trend,
  onClick,
}) => (
  <Card
    sx={{
      borderRadius: 4,
      border: '1px solid #f1f5f9',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      transition: 'all 0.3s ease-in-out',
      cursor: onClick ? 'pointer' : 'default',
      '&:hover': {
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        transform: onClick ? 'translateY(-2px)' : 'none',
      },
    }}
    onClick={onClick}
  >
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: '#1f2937',
              fontSize: '2rem',
              lineHeight: 1.2,
              mb: 0.5,
            }}
          >
            {value.toLocaleString()}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#6b7280',
              fontSize: '0.875rem',
              fontWeight: 500,
              mb: 0.5,
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="caption"
              sx={{
                color: '#9ca3af',
                fontSize: '0.75rem',
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: '16px',
              backgroundColor: bgColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 1,
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Box sx={{ color: color, fontSize: '1.5rem' }}>{icon}</Box>
          </Box>
          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {trend.isPositive ? (
                <ArrowUpward sx={{ color: '#10b981', fontSize: '1rem' }} />
              ) : (
                <ArrowDownward sx={{ color: '#ef4444', fontSize: '1rem' }} />
              )}
              <Typography
                variant="caption"
                sx={{
                  color: trend.isPositive ? '#10b981' : '#ef4444',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                }}
              >
                {Math.abs(trend.value)}%
              </Typography>
            </Box>
          )}
        </Box>
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
    <Grid container spacing={4}>
      {/* Main Stats */}
      <Grid item xs={12} md={3}>
        <StatCard
          title="Total Tickets"
          value={dashboardData.totalTickets}
          icon={<ConfirmationNumber />}
          color="#6366f1"
          bgColor="#ede9fe"
          trend={{ value: 12.5, isPositive: true }}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <StatCard
          title="Open Tickets"
          value={dashboardData.openTickets}
          icon={<Schedule />}
          color="#f59e0b"
          bgColor="#fef3c7"
          trend={{ value: -5.2, isPositive: false }}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <StatCard
          title="SLA Breaches"
          value={dashboardData.slaBreachedTickets}
          icon={<Warning />}
          color="#ef4444"
          bgColor="#fee2e2"
          trend={{ value: -15.8, isPositive: true }}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <StatCard
          title="Resolved Today"
          value={32}
          icon={<CheckCircle />}
          color="#10b981"
          bgColor="#d1fae5"
          trend={{ value: 8.3, isPositive: true }}
        />
      </Grid>

      {/* Performance Metrics */}
      <Grid item xs={12} md={8}>
        <Card
          sx={{
            borderRadius: 4,
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            height: '100%',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '12px',
                  backgroundColor: '#ede9fe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                }}
              >
                <Analytics sx={{ color: '#6366f1', fontSize: '1.2rem' }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1f2937' }}>
                Performance Analytics
              </Typography>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={6} md={3}>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    backgroundColor: '#f0f9ff',
                    border: '1px solid #e0f2fe',
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="body2" sx={{ color: '#0369a1', fontWeight: 600, mb: 1 }}>
                    Avg Resolution Time
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#0c4a6e' }}>
                    {dashboardData.performanceMetrics.averageResolutionTime}h
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #dcfce7',
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="body2" sx={{ color: '#059669', fontWeight: 600, mb: 1 }}>
                    First Response Time
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#047857' }}>
                    {dashboardData.performanceMetrics.firstResponseTime}h
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    backgroundColor: '#fffbeb',
                    border: '1px solid #fef3c7',
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="body2" sx={{ color: '#d97706', fontWeight: 600, mb: 1 }}>
                    Customer Satisfaction
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#92400e' }}>
                    {dashboardData.performanceMetrics.customerSatisfactionScore}/5
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="body2" sx={{ color: '#dc2626', fontWeight: 600, mb: 1 }}>
                    Agent Productivity
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#991b1b' }}>
                    {dashboardData.performanceMetrics.agentProductivity}%
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* SLA Alerts */}
      <Grid item xs={12} md={4}>
        <Card
          sx={{
            borderRadius: 4,
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            height: '100%',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
              <Typography variant="h6" fontWeight="600" color="#111827">
                SLA Alerts
              </Typography>
              <Chip
                label={slaAlerts.length}
                size="small"
                sx={{
                  backgroundColor: '#fee2e2',
                  color: '#dc2626',
                  fontWeight: 600,
                }}
              />
            </Box>

            <List dense>
              {slaAlerts.map((alert) => (
                <ListItem key={alert.ticketId} sx={{ px: 0 }}>
                  <ListItemIcon>
                    <NotificationImportant
                      sx={{
                        color: alert.alertType === 'breached' ? '#dc2626' : '#f59e0b',
                        fontSize: 20,
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={alert.ticketTitle}
                    secondary={
                      <Typography variant="body2" color="#6b7280">
                        {alert.ticketId} • {formatTimeRemaining(alert.remainingTime)}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>

      {/* Recent Activity */}
      <Grid item xs={12}>
        <Card
          sx={{
            borderRadius: 4,
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
              <Typography variant="h6" fontWeight="600" color="#111827">
                Recent Tickets
              </Typography>
              <Button
                variant="outlined"
                size="small"
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  borderColor: '#d1d5db',
                  color: '#6b7280',
                  '&:hover': {
                    borderColor: '#9ca3af',
                    backgroundColor: '#f9fafb',
                  },
                }}
              >
                View All
              </Button>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Ticket ID</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Title</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Priority</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Assigned To</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Created</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentTickets.map((ticket) => (
                    <TableRow key={ticket.id} hover>
                      <TableCell>{ticket.ticketNumber}</TableCell>
                      <TableCell>{ticket.title}</TableCell>
                      <TableCell>
                        <Chip
                          label={ticket.priority}
                          size="small"
                          sx={{
                            backgroundColor: getPriorityColor(ticket.priority),
                            color: 'white',
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={ticket.status}
                          size="small"
                          sx={{
                            backgroundColor: getStatusColor(ticket.status),
                            color: 'white',
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>
                      <TableCell>{ticket.assignedToName || 'Unassigned'}</TableCell>
                      <TableCell>{new Date(ticket.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                          <IconButton size="small" sx={{ color: '#6b7280' }}>
                            <Visibility sx={{ fontSize: 16 }} />
                          </IconButton>
                          <IconButton size="small" sx={{ color: '#6b7280' }}>
                            <Edit sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Box>
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
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Card
          sx={{
            borderRadius: 4,
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Assignment sx={{ mr: 2, color: '#6366f1' }} />
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1f2937' }}>
                Ticket Management
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ color: '#6b7280' }}>
              Comprehensive ticket management functionality will be implemented here.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const ApprovalManagement = () => (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Card
          sx={{
            borderRadius: 4,
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CheckCircle sx={{ mr: 2, color: '#10b981' }} />
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1f2937' }}>
                Pending Approvals
              </Typography>
              <Chip
                label={pendingApprovals.length}
                size="small"
                sx={{
                  ml: 2,
                  backgroundColor: '#ef4444',
                  color: 'white',
                  fontWeight: 600,
                }}
              />
            </Box>
            <Typography variant="body1" sx={{ color: '#6b7280', mb: 3 }}>
              Review and approve pending requests from team members.
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Request ID</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Requester</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Description</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Cost</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Urgency</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Created</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pendingApprovals.map((approval) => (
                    <TableRow key={approval.id} hover>
                      <TableCell>{approval.id}</TableCell>
                      <TableCell>
                        <Chip
                          label={approval.type}
                          size="small"
                          sx={{
                            backgroundColor: approval.type === 'hardware' ? '#dbeafe' : '#f3e8ff',
                            color: approval.type === 'hardware' ? '#1d4ed8' : '#7c3aed',
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>
                      <TableCell>{approval.requestedByName}</TableCell>
                      <TableCell>{approval.description}</TableCell>
                      <TableCell>
                        <Typography variant="body2" color="#374151" fontWeight="600">
                          {approval.estimatedCost && formatCurrency(approval.estimatedCost)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={approval.urgency}
                          size="small"
                          sx={{
                            backgroundColor: getUrgencyColor(approval.urgency) + '20',
                            color: getUrgencyColor(approval.urgency),
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>
                      <TableCell>{new Date(approval.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                          <Button
                            size="small"
                            variant="contained"
                            sx={{
                              minWidth: 'auto',
                              px: 2,
                              py: 0.5,
                              fontSize: '0.75rem',
                              borderRadius: 1.5,
                              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #047857 0%, #059669 100%)',
                              },
                            }}
                          >
                            Approve
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            sx={{
                              minWidth: 'auto',
                              px: 2,
                              py: 0.5,
                              fontSize: '0.75rem',
                              borderRadius: 1.5,
                              borderColor: '#ef4444',
                              color: '#ef4444',
                              '&:hover': {
                                borderColor: '#dc2626',
                                backgroundColor: '#fef2f2',
                              },
                            }}
                          >
                            Reject
                          </Button>
                        </Box>
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
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Card
          sx={{
            borderRadius: 4,
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <People sx={{ mr: 2, color: '#8b5cf6' }} />
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1f2937' }}>
                Users & Teams
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ color: '#6b7280' }}>
              Manage user accounts, roles, and team assignments.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const AutomationSettings = () => (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Card
          sx={{
            borderRadius: 4,
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AutoAwesome sx={{ mr: 2, color: '#f59e0b' }} />
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1f2937' }}>
                Automation Rules
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ color: '#6b7280' }}>
              Configure automated workflows, routing rules, and escalation policies.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const SystemSettings = () => (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Card
          sx={{
            borderRadius: 4,
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Settings sx={{ mr: 2, color: '#6b7280' }} />
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1f2937' }}>
                System Settings
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ color: '#6b7280' }}>
              Configure system-wide settings, notifications, and integrations.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  return (
    <Box
      sx={{
        p: 4,
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
      }}
    >
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight="700" color="#111827" mb={2}>
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="#6b7280">
          Manage your ticket system, users, and configurations
        </Typography>
      </Box>

      {/* Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Date Range</InputLabel>
            <Select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              label="Date Range"
              sx={{
                borderRadius: 2,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#e5e7eb',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#6366f1',
                },
              }}
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
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              borderColor: '#e5e7eb',
              color: '#374151',
              '&:hover': {
                borderColor: '#6366f1',
                backgroundColor: '#f8fafc',
              },
            }}
          >
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </Box>
      </Box>

      {/* Navigation Tabs */}
      <Box mb={4}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              borderRadius: 3,
              margin: '0 4px',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.875rem',
              minHeight: 48,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: '#f8fafc',
              },
              '&.Mui-selected': {
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: 'white',
                boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
              },
            },
            '& .MuiTabs-indicator': {
              display: 'none',
            },
          }}
        >
          <Tab icon={<Dashboard />} label="Overview" />
          <Tab icon={<Assignment />} label="Tickets" />
          <Tab icon={<CheckCircle />} label="Approvals" />
          <Tab icon={<People />} label="Users & Teams" />
          <Tab icon={<AutoAwesome />} label="Automation" />
          <Tab icon={<Settings />} label="Settings" />
        </Tabs>
      </Box>

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
