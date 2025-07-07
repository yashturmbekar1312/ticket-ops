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
  Badge,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
  AlertTitle,
} from '@mui/material';
import {
  Add,
  ConfirmationNumber,
  Notifications,
  Schedule,
  CheckCircle,
  AttachFile,
  Assignment,
  Warning,
  Info,
  ErrorOutline,
} from '@mui/icons-material';
import {
  Ticket,
  TicketNotification,
  SystemAnnouncement,
  TicketCategory,
  TicketPriority,
} from '../../types';
import { TicketDetailModal } from '../ticket/TicketDetailModal';

interface EmployeeDashboardProps {
  userId: string;
  userName: string;
}

const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ userId, userName }) => {
  const [createTicketOpen, setCreateTicketOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [ticketDetailOpen, setTicketDetailOpen] = useState(false);
  const [newTicketData, setNewTicketData] = useState({
    title: '',
    category: '' as TicketCategory,
    description: '',
    priority: 'Medium' as TicketPriority,
    attachments: [] as File[],
  });

  // Mock data - in production, this would come from API
  const allTickets: Ticket[] = [
    {
      id: 'TK-001',
      ticketNumber: 'TK-001',
      title: 'Laptop not working properly',
      description: 'My laptop keeps freezing and shutting down randomly',
      category: 'Hardware',
      priority: 'High',
      status: 'Open',
      createdBy: userId,
      createdByName: userName,
      assignedTo: 'agent1',
      assignedToName: 'Alice Johnson',
      department: 'IT',
      createdAt: '2024-07-07T08:00:00Z',
      updatedAt: '2024-07-07T12:30:00Z',
      slaBreached: false,
      tags: ['hardware', 'laptop'],
      escalationLevel: 0,
      source: 'web',
    },
    {
      id: 'TK-002',
      ticketNumber: 'TK-002',
      title: 'Request for Adobe Creative Suite',
      description: 'Need Adobe Creative Suite for upcoming marketing project',
      category: 'Software',
      priority: 'Medium',
      status: 'Open',
      createdBy: userId,
      createdByName: userName,
      department: 'Marketing',
      createdAt: '2024-07-06T14:00:00Z',
      updatedAt: '2024-07-06T14:00:00Z',
      slaBreached: false,
      tags: ['software', 'adobe'],
      escalationLevel: 0,
      source: 'web',
    },
    {
      id: 'TK-003',
      ticketNumber: 'TK-003',
      title: 'Network connectivity issues',
      description: 'Unable to connect to company VPN from home',
      category: 'Network',
      priority: 'Medium',
      status: 'Resolved',
      createdBy: userId,
      createdByName: userName,
      assignedTo: 'agent2',
      assignedToName: 'Bob Smith',
      department: 'IT',
      createdAt: '2024-07-05T10:00:00Z',
      updatedAt: '2024-07-05T16:00:00Z',
      resolvedAt: '2024-07-05T16:00:00Z',
      slaBreached: false,
      tags: ['network', 'vpn'],
      escalationLevel: 0,
      source: 'web',
    },
    {
      id: 'TK-004',
      ticketNumber: 'TK-004',
      title: 'Password reset request',
      description: 'Need to reset my password for the company email account',
      category: 'Access',
      priority: 'Medium',
      status: 'Open',
      createdBy: userId,
      createdByName: userName,
      department: 'IT',
      createdAt: '2024-07-07T09:00:00Z',
      updatedAt: '2024-07-07T09:00:00Z',
      slaBreached: false,
      tags: ['access', 'password'],
      escalationLevel: 0,
      source: 'web',
    },
  ];

  // Filter to show only Open tickets on dashboard
  const myTickets = allTickets.filter((ticket) => ticket.status === 'Open');

  const notifications: TicketNotification[] = [
    {
      id: 'N-001',
      type: 'ticket_update',
      title: 'Ticket Updated',
      message: 'Your ticket TK-001 has been updated by Alice Johnson',
      relatedTicketId: 'TK-001',
      isRead: false,
      createdAt: '2024-07-07T12:30:00Z',
    },
    {
      id: 'N-002',
      type: 'ticket_resolved',
      title: 'Ticket Resolved',
      message: 'Your ticket TK-003 has been resolved',
      relatedTicketId: 'TK-003',
      isRead: true,
      createdAt: '2024-07-05T16:00:00Z',
    },
  ];

  const announcements: SystemAnnouncement[] = [
    {
      id: 'A-001',
      title: 'System Maintenance Scheduled',
      content: 'Scheduled maintenance will occur on July 10th from 2-4 AM',
      type: 'maintenance',
      isActive: true,
      createdBy: 'admin',
      createdAt: '2024-07-07T10:00:00Z',
      targetRoles: ['Employee', 'Manager', 'IT Agent'],
    },
    {
      id: 'A-002',
      title: 'New IT Policy Updates',
      content: 'Please review the updated IT security policies in the knowledge base',
      type: 'policy',
      isActive: true,
      createdBy: 'admin',
      createdAt: '2024-07-06T15:00:00Z',
      targetRoles: ['Employee', 'Manager', 'IT Agent'],
    },
  ];

  const handleCreateTicket = () => {
    // In production, this would make an API call
    console.log('Creating ticket:', newTicketData);
    setCreateTicketOpen(false);
    setNewTicketData({
      title: '',
      category: '' as TicketCategory,
      description: '',
      priority: 'Medium',
      attachments: [],
    });
  };

  const handleTicketClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setTicketDetailOpen(true);
  };

  const handleCloseTicketDetail = () => {
    setSelectedTicket(null);
    setTicketDetailOpen(false);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open':
        return <Schedule />;
      case 'In Progress':
        return <Assignment />;
      case 'Resolved':
        return <CheckCircle />;
      case 'Closed':
        return <CheckCircle />;
      case 'Pending':
        return <Warning />;
      default:
        return <ConfirmationNumber />;
    }
  };

  const getAnnouncementIcon = (type: string) => {
    switch (type) {
      case 'maintenance':
        return <Warning />;
      case 'policy':
        return <Info />;
      case 'warning':
        return <ErrorOutline />;
      default:
        return <Info />;
    }
  };

  const getAnnouncementColor = (type: string): 'warning' | 'info' | 'error' => {
    switch (type) {
      case 'maintenance':
        return 'warning';
      case 'policy':
        return 'info';
      case 'warning':
        return 'error';
      default:
        return 'info';
    }
  };

  const unreadNotifications = notifications.filter((n) => !n.isRead).length;

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          My Dashboard
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<Add />}
          onClick={() => setCreateTicketOpen(true)}
          sx={{
            backgroundColor: '#1976d2',
            '&:hover': { backgroundColor: '#1565c0' },
          }}
        >
          Create Ticket
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Quick Stats */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ConfirmationNumber sx={{ mr: 1, color: '#1976d2' }} />
                <Typography variant="h6">My Tickets</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                {allTickets.length}
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
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Notifications sx={{ mr: 1, color: '#ff9800' }} />
                <Typography variant="h6">Notifications</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
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
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircle sx={{ mr: 1, color: '#4caf50' }} />
                <Typography variant="h6">Resolved</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                {allTickets.filter((t) => t.status === 'Resolved').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Resolved tickets
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* My Open Tickets */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ConfirmationNumber sx={{ mr: 1 }} />
                <Typography variant="h6">My Open Tickets</Typography>
              </Box>
              <Grid container spacing={2}>
                {myTickets.map((ticket) => (
                  <Grid item xs={12} md={6} lg={4} key={ticket.id}>
                    <Card
                      sx={{
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': {
                          elevation: 4,
                          transform: 'translateY(-2px)',
                        },
                      }}
                      onClick={() => handleTicketClick(ticket)}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          {getStatusIcon(ticket.status)}
                          <Typography variant="h6" sx={{ ml: 1, flexGrow: 1 }}>
                            {ticket.ticketNumber}
                          </Typography>
                          <Chip
                            label={ticket.priority}
                            size="small"
                            sx={{
                              backgroundColor: getPriorityColor(ticket.priority) + '20',
                              color: getPriorityColor(ticket.priority),
                            }}
                          />
                        </Box>
                        <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold' }}>
                          {ticket.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {ticket.description.substring(0, 100)}...
                        </Typography>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Chip
                            label={ticket.status}
                            size="small"
                            sx={{
                              backgroundColor: getStatusColor(ticket.status) + '20',
                              color: getStatusColor(ticket.status),
                            }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {new Date(ticket.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Announcements */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Info sx={{ mr: 1 }} />
                <Typography variant="h6">Announcements</Typography>
              </Box>
              <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
                {announcements.map((announcement) => (
                  <Alert
                    key={announcement.id}
                    severity={getAnnouncementColor(announcement.type)}
                    sx={{ mb: 2 }}
                    icon={getAnnouncementIcon(announcement.type)}
                  >
                    <AlertTitle>{announcement.title}</AlertTitle>
                    {announcement.content}
                  </Alert>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Notifications */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Notifications sx={{ mr: 1 }} />
                <Typography variant="h6">Recent Notifications</Typography>
                {unreadNotifications > 0 && (
                  <Badge badgeContent={unreadNotifications} color="error" sx={{ ml: 1 }} />
                )}
              </Box>
              <List sx={{ maxHeight: 300, overflowY: 'auto' }}>
                {notifications.map((notification) => (
                  <ListItem
                    key={notification.id}
                    sx={{
                      backgroundColor: notification.isRead ? 'transparent' : '#f5f5f5',
                      borderRadius: 1,
                      mb: 1,
                    }}
                  >
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: notification.isRead ? '#9e9e9e' : '#1976d2' }}>
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
        </Grid>
      </Grid>

      {/* Create Ticket Dialog */}
      <Dialog
        open={createTicketOpen}
        onClose={() => setCreateTicketOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create New Ticket</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Title"
              value={newTicketData.title}
              onChange={(e) => setNewTicketData({ ...newTicketData, title: e.target.value })}
              sx={{ mb: 2 }}
            />
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={newTicketData.category}
                    onChange={(e) =>
                      setNewTicketData({
                        ...newTicketData,
                        category: e.target.value as TicketCategory,
                      })
                    }
                    label="Category"
                  >
                    <MenuItem value="Hardware">Hardware</MenuItem>
                    <MenuItem value="Software">Software</MenuItem>
                    <MenuItem value="Network">Network</MenuItem>
                    <MenuItem value="Access">Access</MenuItem>
                    <MenuItem value="HR">HR</MenuItem>
                    <MenuItem value="Security">Security</MenuItem>
                    <MenuItem value="Maintenance">Maintenance</MenuItem>
                    <MenuItem value="Account">Account</MenuItem>
                    <MenuItem value="Training">Training</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={newTicketData.priority}
                    onChange={(e) =>
                      setNewTicketData({
                        ...newTicketData,
                        priority: e.target.value as TicketPriority,
                      })
                    }
                    label="Priority"
                  >
                    <MenuItem value="Low">Low</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                    <MenuItem value="Critical">Critical</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              value={newTicketData.description}
              onChange={(e) => setNewTicketData({ ...newTicketData, description: e.target.value })}
              sx={{ mb: 2 }}
            />
            <Button variant="outlined" startIcon={<AttachFile />} sx={{ mb: 2 }}>
              Attach Files
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateTicketOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreateTicket}
            variant="contained"
            disabled={!newTicketData.title || !newTicketData.category || !newTicketData.description}
          >
            Create Ticket
          </Button>
        </DialogActions>
      </Dialog>

      {/* Ticket Detail Modal */}
      <TicketDetailModal
        ticket={selectedTicket}
        open={ticketDetailOpen}
        onClose={handleCloseTicketDetail}
        userRole="Employee"
        userId={userId}
      />
    </Box>
  );
};

export default EmployeeDashboard;
