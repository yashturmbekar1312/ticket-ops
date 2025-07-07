import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  IconButton,
  Avatar,
  Paper,
  LinearProgress,
} from '@mui/material';
import {
  Assignment,
  CheckCircle,
  Schedule,
  TrendingUp,
  Visibility,
  Close,
  Send,
  Warning,
  Info,
  Speed,
  Group,
  Person,
  Update,
  TrendingUp as EscalateIcon,
  Link,
  Search,
  Refresh,
  Timer,
  Star,
  StarBorder,
  NotificationImportant,
  PriorityHigh,
  ArrowDownward,
} from '@mui/icons-material';
import { Ticket, SLAAlert, AgentPerformanceMetrics, KnowledgeBaseArticle } from '../../types';

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

interface OperationsDashboardProps {
  userId: string;
  userName: string;
  userRole: string;
}

const OperationsDashboard: React.FC<OperationsDashboardProps> = ({ userId, userName }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [escalateDialogOpen, setEscalateDialogOpen] = useState(false);
  const [linkKBDialogOpen, setLinkKBDialogOpen] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState('');
  const [updateNote, setUpdateNote] = useState('');
  const [escalationReason, setEscalationReason] = useState('');
  const [escalateTo, setEscalateTo] = useState('');
  const [selectedKBArticle, setSelectedKBArticle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  // Mock data - in production, this would come from API
  const assignedTickets: Ticket[] = [
    {
      id: 'TK-001',
      ticketNumber: 'TK-001',
      title: 'Critical server outage - Production down',
      description: 'Main production server is down, affecting all users',
      category: 'Hardware',
      priority: 'Critical',
      status: 'In Progress',
      createdBy: 'user1',
      createdByName: 'John Doe',
      assignedTo: userId,
      assignedToName: userName,
      department: 'IT',
      createdAt: '2024-07-07T08:00:00Z',
      updatedAt: '2024-07-07T12:30:00Z',
      dueDate: '2024-07-07T14:00:00Z',
      slaBreached: false,
      tags: ['critical', 'server', 'outage'],
      escalationLevel: 1,
      source: 'phone',
    },
    {
      id: 'TK-002',
      ticketNumber: 'TK-002',
      title: 'Employee unable to access VPN',
      description: 'Remote employee cannot connect to company VPN',
      category: 'Network',
      priority: 'High',
      status: 'Open',
      createdBy: 'user2',
      createdByName: 'Jane Smith',
      assignedTo: userId,
      assignedToName: userName,
      department: 'IT',
      createdAt: '2024-07-07T10:00:00Z',
      updatedAt: '2024-07-07T10:00:00Z',
      dueDate: '2024-07-07T18:00:00Z',
      slaBreached: false,
      tags: ['vpn', 'network', 'access'],
      escalationLevel: 0,
      source: 'web',
    },
    {
      id: 'TK-003',
      ticketNumber: 'TK-003',
      title: 'Software license request',
      description: 'Employee needs Adobe Creative Suite license',
      category: 'Software',
      priority: 'Medium',
      status: 'Pending',
      createdBy: 'user3',
      createdByName: 'Mike Johnson',
      assignedTo: userId,
      assignedToName: userName,
      department: 'Marketing',
      createdAt: '2024-07-06T15:00:00Z',
      updatedAt: '2024-07-06T15:00:00Z',
      dueDate: '2024-07-08T15:00:00Z',
      slaBreached: false,
      tags: ['software', 'license', 'adobe'],
      escalationLevel: 0,
      source: 'web',
    },
  ];

  const groupTickets: Ticket[] = [
    {
      id: 'TK-004',
      ticketNumber: 'TK-004',
      title: 'Email server maintenance',
      description: 'Scheduled maintenance for email server',
      category: 'Maintenance',
      priority: 'Low',
      status: 'Open',
      createdBy: 'admin',
      createdByName: 'System Admin',
      assignedTo: 'team1',
      assignedToName: 'IT Team',
      department: 'IT',
      createdAt: '2024-07-07T09:00:00Z',
      updatedAt: '2024-07-07T09:00:00Z',
      dueDate: '2024-07-08T09:00:00Z',
      slaBreached: false,
      tags: ['maintenance', 'email'],
      escalationLevel: 0,
      source: 'web',
    },
  ];

  const closedTickets: Ticket[] = [
    {
      id: 'TK-005',
      ticketNumber: 'TK-005',
      title: 'Password reset request',
      description: 'Employee forgot password and needs reset',
      category: 'Access',
      priority: 'Low',
      status: 'Resolved',
      createdBy: 'user4',
      createdByName: 'Sarah Wilson',
      assignedTo: userId,
      assignedToName: userName,
      department: 'HR',
      createdAt: '2024-07-05T11:00:00Z',
      updatedAt: '2024-07-05T11:30:00Z',
      resolvedAt: '2024-07-05T11:30:00Z',
      dueDate: '2024-07-05T15:00:00Z',
      slaBreached: false,
      tags: ['password', 'reset', 'access'],
      escalationLevel: 0,
      source: 'email',
    },
  ];

  const slaAlerts: SLAAlert[] = [
    {
      ticketId: 'TK-001',
      ticketTitle: 'Critical server outage - Production down',
      priority: 'Critical',
      createdAt: '2024-07-07T08:00:00Z',
      dueDate: '2024-07-07T14:00:00Z',
      remainingTime: 90, // 1.5 hours
      escalationLevel: 1,
      alertType: 'approaching',
    },
    {
      ticketId: 'TK-006',
      ticketTitle: 'Database connection issues',
      priority: 'High',
      createdAt: '2024-07-06T16:00:00Z',
      dueDate: '2024-07-07T08:00:00Z',
      remainingTime: -240, // 4 hours overdue
      escalationLevel: 2,
      alertType: 'breached',
    },
  ];

  const performanceMetrics: AgentPerformanceMetrics = {
    ticketsAssigned: 15,
    ticketsResolved: 12,
    averageResolutionTime: 4.2,
    firstResponseTime: 0.8,
    customerSatisfactionScore: 4.5,
    slaComplianceRate: 95.5,
    workload: 'medium',
  };

  const knowledgeBaseArticles: KnowledgeBaseArticle[] = [
    {
      id: 'KB-001',
      title: 'VPN Connection Troubleshooting',
      content: 'Step-by-step guide to resolve VPN connection issues',
      summary: 'Common solutions for VPN connectivity problems',
      tags: ['vpn', 'network', 'troubleshooting'],
      category: 'Network',
      author: 'IT Team',
      createdAt: '2024-06-15T00:00:00Z',
      updatedAt: '2024-07-01T00:00:00Z',
      viewCount: 245,
      isPublished: true,
      helpfulCount: 89,
    },
    {
      id: 'KB-002',
      title: 'Password Reset Procedures',
      content: 'How to reset user passwords in Active Directory',
      summary: 'Complete guide for password reset procedures',
      tags: ['password', 'reset', 'active directory'],
      category: 'Security',
      author: 'Security Team',
      createdAt: '2024-06-10T00:00:00Z',
      updatedAt: '2024-06-20T00:00:00Z',
      viewCount: 156,
      isPublished: true,
      helpfulCount: 67,
    },
  ];

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleTicketClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
  };

  const handleUpdateTicket = () => {
    if (selectedTicket && statusUpdate) {
      // In production, this would make an API call
      console.log(
        'Updating ticket:',
        selectedTicket.id,
        'Status:',
        statusUpdate,
        'Note:',
        updateNote
      );
      setUpdateDialogOpen(false);
      setSelectedTicket(null);
      setStatusUpdate('');
      setUpdateNote('');
    }
  };

  const handleEscalateTicket = () => {
    if (selectedTicket && escalateTo && escalationReason) {
      // In production, this would make an API call
      console.log(
        'Escalating ticket:',
        selectedTicket.id,
        'To:',
        escalateTo,
        'Reason:',
        escalationReason
      );
      setEscalateDialogOpen(false);
      setSelectedTicket(null);
      setEscalateTo('');
      setEscalationReason('');
    }
  };

  const handleLinkKBArticle = () => {
    if (selectedTicket && selectedKBArticle) {
      // In production, this would make an API call
      console.log('Linking KB article:', selectedKBArticle, 'to ticket:', selectedTicket.id);
      setLinkKBDialogOpen(false);
      setSelectedTicket(null);
      setSelectedKBArticle('');
    }
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
      case 'Pending':
        return '#9c27b0';
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

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return <PriorityHigh color="error" />;
      case 'High':
        return <PriorityHigh color="warning" />;
      case 'Medium':
        return <Warning color="primary" />;
      case 'Low':
        return <ArrowDownward color="success" />;
      default:
        return <Info />;
    }
  };

  const getWorkloadColor = (workload: string) => {
    switch (workload) {
      case 'low':
        return '#4caf50';
      case 'medium':
        return '#ff9800';
      case 'high':
        return '#f44336';
      case 'overloaded':
        return '#d32f2f';
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

  const filteredTickets = assignedTickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || ticket.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const MyDashboard = () => (
    <Grid container spacing={3}>
      {/* Performance Metrics */}
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Assignment sx={{ mr: 1, color: '#1976d2' }} />
              <Typography variant="h6">Assigned</Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
              {performanceMetrics.ticketsAssigned}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active tickets
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CheckCircle sx={{ mr: 1, color: '#4caf50' }} />
              <Typography variant="h6">Resolved</Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
              {performanceMetrics.ticketsResolved}
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
              <Timer sx={{ mr: 1, color: '#ff9800' }} />
              <Typography variant="h6">Avg Resolution</Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
              {performanceMetrics.averageResolutionTime}h
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Resolution time
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Speed sx={{ mr: 1, color: getWorkloadColor(performanceMetrics.workload) }} />
              <Typography variant="h6">Workload</Typography>
            </Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 'bold',
                color: getWorkloadColor(performanceMetrics.workload),
                textTransform: 'capitalize',
              }}
            >
              {performanceMetrics.workload}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Current load
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* SLA Alerts */}
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <NotificationImportant sx={{ mr: 1 }} />
              <Typography variant="h6">SLA Alerts</Typography>
              <Badge badgeContent={slaAlerts.length} color="error" sx={{ ml: 1 }} />
            </Box>
            <List>
              {slaAlerts.map((alert) => (
                <ListItem key={alert.ticketId} divider>
                  <ListItemIcon>
                    <Avatar
                      sx={{
                        bgcolor: alert.alertType === 'breached' ? '#f44336' : '#ff9800',
                        width: 32,
                        height: 32,
                      }}
                    >
                      {alert.alertType === 'breached' ? <Warning /> : <Schedule />}
                    </Avatar>
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

      {/* Performance Summary */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TrendingUp sx={{ mr: 1 }} />
              <Typography variant="h6">Performance</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Customer Satisfaction
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mr: 1 }}>
                  {performanceMetrics.customerSatisfactionScore}
                </Typography>
                <Box sx={{ display: 'flex' }}>
                  {[1, 2, 3, 4, 5].map((star) =>
                    star <= performanceMetrics.customerSatisfactionScore ? (
                      <Star key={star} sx={{ color: '#ffc107', fontSize: 16 }} />
                    ) : (
                      <StarBorder key={star} sx={{ color: '#ffc107', fontSize: 16 }} />
                    )
                  )}
                </Box>
              </Box>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                SLA Compliance
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {performanceMetrics.slaComplianceRate}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={performanceMetrics.slaComplianceRate}
                sx={{ mt: 1 }}
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const MyTicketsTab = () => (
    <Grid container spacing={3}>
      {/* Filters */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                size="small"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ flexGrow: 1 }}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="Open">Open</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Resolved">Resolved</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  label="Priority"
                >
                  <MenuItem value="all">All Priority</MenuItem>
                  <MenuItem value="Critical">Critical</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                </Select>
              </FormControl>
              <Button variant="outlined" startIcon={<Refresh />}>
                Refresh
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Tickets Table */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              My Assigned Tickets ({filteredTickets.length})
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Ticket ID</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Requester</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell>{ticket.ticketNumber}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {getPriorityIcon(ticket.priority)}
                          <Typography sx={{ ml: 1 }}>{ticket.title}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{ticket.createdByName}</TableCell>
                      <TableCell>
                        <Chip
                          label={ticket.priority}
                          size="small"
                          sx={{
                            backgroundColor: getPriorityColor(ticket.priority) + '20',
                            color: getPriorityColor(ticket.priority),
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={ticket.status}
                          size="small"
                          sx={{
                            backgroundColor: getStatusColor(ticket.status) + '20',
                            color: getStatusColor(ticket.status),
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {ticket.dueDate
                          ? new Date(ticket.dueDate).toLocaleDateString()
                          : 'No due date'}
                      </TableCell>
                      <TableCell>
                        <IconButton size="small" onClick={() => handleTicketClick(ticket)}>
                          <Visibility />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedTicket(ticket);
                            setUpdateDialogOpen(true);
                          }}
                        >
                          <Update />
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

  const GroupTicketsTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Group Tickets ({groupTickets.length})
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Ticket ID</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Assigned To</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {groupTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell>{ticket.ticketNumber}</TableCell>
                      <TableCell>{ticket.title}</TableCell>
                      <TableCell>{ticket.assignedToName}</TableCell>
                      <TableCell>
                        <Chip
                          label={ticket.priority}
                          size="small"
                          sx={{
                            backgroundColor: getPriorityColor(ticket.priority) + '20',
                            color: getPriorityColor(ticket.priority),
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={ticket.status}
                          size="small"
                          sx={{
                            backgroundColor: getStatusColor(ticket.status) + '20',
                            color: getStatusColor(ticket.status),
                          }}
                        />
                      </TableCell>
                      <TableCell>{new Date(ticket.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <IconButton size="small" onClick={() => handleTicketClick(ticket)}>
                          <Visibility />
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

  const ClosedTicketsTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Recently Closed Tickets ({closedTickets.length})
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Ticket ID</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Requester</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Resolved Date</TableCell>
                    <TableCell>Resolution Time</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {closedTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell>{ticket.ticketNumber}</TableCell>
                      <TableCell>{ticket.title}</TableCell>
                      <TableCell>{ticket.createdByName}</TableCell>
                      <TableCell>
                        <Chip
                          label={ticket.priority}
                          size="small"
                          sx={{
                            backgroundColor: getPriorityColor(ticket.priority) + '20',
                            color: getPriorityColor(ticket.priority),
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {ticket.resolvedAt
                          ? new Date(ticket.resolvedAt).toLocaleDateString()
                          : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {ticket.timeToResolution ? `${ticket.timeToResolution}h` : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <IconButton size="small" onClick={() => handleTicketClick(ticket)}>
                          <Visibility />
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

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 3 }}>
        Operations Dashboard
      </Typography>

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab icon={<Assignment />} label="My Dashboard" />
        <Tab icon={<Person />} label="My Tickets" />
        <Tab icon={<Group />} label="Group Tickets" />
        <Tab icon={<CheckCircle />} label="Closed Tickets" />
      </Tabs>

      <TabPanel value={activeTab} index={0}>
        <MyDashboard />
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        <MyTicketsTab />
      </TabPanel>
      <TabPanel value={activeTab} index={2}>
        <GroupTicketsTab />
      </TabPanel>
      <TabPanel value={activeTab} index={3}>
        <ClosedTicketsTab />
      </TabPanel>

      {/* Update Ticket Dialog */}
      <Dialog
        open={updateDialogOpen}
        onClose={() => setUpdateDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Update Ticket</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {selectedTicket?.ticketNumber}: {selectedTicket?.title}
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusUpdate}
                onChange={(e) => setStatusUpdate(e.target.value)}
                label="Status"
              >
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Waiting on User">Waiting on User</MenuItem>
                <MenuItem value="Resolved">Resolved</MenuItem>
                <MenuItem value="Closed">Closed</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Update Notes"
              multiline
              rows={4}
              value={updateNote}
              onChange={(e) => setUpdateNote(e.target.value)}
              placeholder="Add notes about the update..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpdateDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleUpdateTicket}
            variant="contained"
            disabled={!statusUpdate}
            startIcon={<Send />}
          >
            Update Ticket
          </Button>
        </DialogActions>
      </Dialog>

      {/* Escalate Ticket Dialog */}
      <Dialog
        open={escalateDialogOpen}
        onClose={() => setEscalateDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Escalate Ticket</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {selectedTicket?.ticketNumber}: {selectedTicket?.title}
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Escalate To</InputLabel>
              <Select
                value={escalateTo}
                onChange={(e) => setEscalateTo(e.target.value)}
                label="Escalate To"
              >
                <MenuItem value="senior_agent">Senior Agent</MenuItem>
                <MenuItem value="team_lead">Team Lead</MenuItem>
                <MenuItem value="manager">Manager</MenuItem>
                <MenuItem value="specialist">Specialist</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Escalation Reason"
              multiline
              rows={4}
              value={escalationReason}
              onChange={(e) => setEscalationReason(e.target.value)}
              placeholder="Explain why this ticket needs escalation..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEscalateDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleEscalateTicket}
            variant="contained"
            disabled={!escalateTo || !escalationReason}
            startIcon={<EscalateIcon />}
          >
            Escalate Ticket
          </Button>
        </DialogActions>
      </Dialog>

      {/* Link Knowledge Base Dialog */}
      <Dialog
        open={linkKBDialogOpen}
        onClose={() => setLinkKBDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Link Knowledge Base Article</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {selectedTicket?.ticketNumber}: {selectedTicket?.title}
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Knowledge Base Article</InputLabel>
              <Select
                value={selectedKBArticle}
                onChange={(e) => setSelectedKBArticle(e.target.value)}
                label="Knowledge Base Article"
              >
                {knowledgeBaseArticles.map((article) => (
                  <MenuItem key={article.id} value={article.id}>
                    {article.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {selectedKBArticle && (
              <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {knowledgeBaseArticles.find((a) => a.id === selectedKBArticle)?.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {knowledgeBaseArticles.find((a) => a.id === selectedKBArticle)?.summary}
                </Typography>
              </Paper>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLinkKBDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleLinkKBArticle}
            variant="contained"
            disabled={!selectedKBArticle}
            startIcon={<Link />}
          >
            Link Article
          </Button>
        </DialogActions>
      </Dialog>

      {/* Ticket Detail Dialog */}
      <Dialog
        open={!!selectedTicket && !updateDialogOpen && !escalateDialogOpen}
        onClose={() => setSelectedTicket(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedTicket && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">{selectedTicket.ticketNumber}</Typography>
                <IconButton onClick={() => setSelectedTicket(null)}>
                  <Close />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h5" sx={{ mb: 1 }}>
                  {selectedTicket.title}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Chip
                    label={selectedTicket.status}
                    sx={{
                      backgroundColor: getStatusColor(selectedTicket.status) + '20',
                      color: getStatusColor(selectedTicket.status),
                    }}
                  />
                  <Chip
                    label={selectedTicket.priority}
                    sx={{
                      backgroundColor: getPriorityColor(selectedTicket.priority) + '20',
                      color: getPriorityColor(selectedTicket.priority),
                    }}
                  />
                  <Chip label={selectedTicket.category} variant="outlined" />
                </Box>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {selectedTicket.description}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Created: {new Date(selectedTicket.createdAt).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Requester: {selectedTicket.createdByName}
                  </Typography>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  setUpdateDialogOpen(true);
                }}
                startIcon={<Update />}
              >
                Update Status
              </Button>
              <Button
                onClick={() => {
                  setEscalateDialogOpen(true);
                }}
                startIcon={<EscalateIcon />}
              >
                Escalate
              </Button>
              <Button
                onClick={() => {
                  setLinkKBDialogOpen(true);
                }}
                startIcon={<Link />}
              >
                Link KB Article
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default OperationsDashboard;
