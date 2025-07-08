import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
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
} from '@mui/material';
import {
  Dashboard,
  People,
  Assignment,
  CheckCircle,
  Schedule,
  TrendingUp,
  Visibility,
  Close,
  Add,
  PersonAdd,
  Block,
  BarChart,
} from '@mui/icons-material';
import { Ticket, ApprovalRequest, DepartmentStats, User, TicketPriority } from '../../types';

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

interface ManagerDashboardProps {
  userId: string;
  userName: string;
  department: string;
}

const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ userId, userName, department }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [selectedApproval, setSelectedApproval] = useState<ApprovalRequest | null>(null);
  const [createTicketOpen, setCreateTicketOpen] = useState(false);
  const [reassignDialogOpen, setReassignDialogOpen] = useState(false);
  const [selectedReassignTicket, setSelectedReassignTicket] = useState<Ticket | null>(null);
  const [reassignTo, setReassignTo] = useState('');
  const [approvalComment, setApprovalComment] = useState('');
  const [newTicketData, setNewTicketData] = useState({
    title: '',
    category: '',
    description: '',
    priority: 'Medium' as TicketPriority,
  });

  // Mock data - in production, this would come from API
  const departmentStats: DepartmentStats = {
    totalTickets: 45,
    openTickets: 12,
    resolvedTickets: 28,
    averageResolutionTime: 18.5,
    teamMembers: 8,
    productivity: 92,
  };

  const pendingApprovals: ApprovalRequest[] = [
    {
      id: 'AP-001',
      ticketId: 'TK-001',
      type: 'software',
      requestedBy: 'emp1',
      requestedByName: 'John Doe',
      description: 'Adobe Creative Suite Professional',
      justification: 'Required for upcoming marketing campaign design work',
      estimatedCost: 599,
      urgency: 'medium',
      createdAt: '2024-07-07T09:00:00Z',
      status: 'pending',
    },
    {
      id: 'AP-002',
      ticketId: 'TK-002',
      type: 'hardware',
      requestedBy: 'emp2',
      requestedByName: 'Jane Smith',
      description: 'MacBook Pro 16" M3 Max',
      justification: 'Current laptop is 5 years old and causing productivity issues',
      estimatedCost: 2499,
      urgency: 'high',
      createdAt: '2024-07-07T10:30:00Z',
      status: 'pending',
    },
  ];

  const teamTickets: Ticket[] = [
    {
      id: 'TK-003',
      ticketNumber: 'TK-003',
      title: 'Email signature not updating',
      description: 'Employee email signature is not reflecting the new company branding',
      category: 'Software',
      priority: 'Low',
      status: 'Open',
      createdBy: 'emp3',
      createdByName: 'Mike Johnson',
      department: department,
      createdAt: '2024-07-07T08:00:00Z',
      updatedAt: '2024-07-07T08:00:00Z',
      slaBreached: false,
      tags: ['email', 'branding'],
      escalationLevel: 0,
      source: 'web',
    },
    {
      id: 'TK-004',
      ticketNumber: 'TK-004',
      title: 'Access to marketing database',
      description: 'Need access to the marketing analytics database for Q3 reporting',
      category: 'Access',
      priority: 'Medium',
      status: 'Pending',
      createdBy: 'emp4',
      createdByName: 'Sarah Wilson',
      department: department,
      createdAt: '2024-07-06T14:00:00Z',
      updatedAt: '2024-07-06T14:00:00Z',
      slaBreached: false,
      tags: ['access', 'database'],
      escalationLevel: 0,
      source: 'web',
    },
  ];

  const myTickets: Ticket[] = [
    {
      id: 'TK-005',
      ticketNumber: 'TK-005',
      title: 'Budget approval for new marketing tools',
      description: 'Request for budget approval for new marketing automation tools',
      category: 'HR',
      priority: 'Medium',
      status: 'In Progress',
      createdBy: userId,
      createdByName: userName,
      assignedTo: 'admin1',
      assignedToName: 'Admin User',
      department: department,
      createdAt: '2024-07-05T11:00:00Z',
      updatedAt: '2024-07-07T09:00:00Z',
      slaBreached: false,
      tags: ['budget', 'marketing'],
      escalationLevel: 0,
      source: 'web',
    },
  ];

  const teamMembers: User[] = [
    {
      id: 'emp1',
      email: 'john.doe@company.com',
      name: 'John Doe',
      role: 'Employee',
      department: department,
      isActive: true,
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z',
    },
    {
      id: 'emp2',
      email: 'jane.smith@company.com',
      name: 'Jane Smith',
      role: 'Employee',
      department: department,
      isActive: true,
      createdAt: '2024-02-01T00:00:00Z',
      updatedAt: '2024-02-01T00:00:00Z',
    },
    {
      id: 'emp3',
      email: 'mike.johnson@company.com',
      name: 'Mike Johnson',
      role: 'Employee',
      department: department,
      isActive: true,
      createdAt: '2024-03-10T00:00:00Z',
      updatedAt: '2024-03-10T00:00:00Z',
    },
  ];

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleApprovalAction = (approval: ApprovalRequest, action: 'approve' | 'reject') => {
    // In production, this would make an API call
    console.log(`${action} approval:`, approval.id, approvalComment);
    setSelectedApproval(null);
    setApprovalComment('');
  };

  const handleReassignTicket = () => {
    if (selectedReassignTicket && reassignTo) {
      // In production, this would make an API call
      console.log('Reassigning ticket:', selectedReassignTicket.id, 'to:', reassignTo);
      setReassignDialogOpen(false);
      setSelectedReassignTicket(null);
      setReassignTo('');
    }
  };

  const handleCreateTicket = () => {
    // In production, this would make an API call
    console.log('Creating ticket:', newTicketData);
    setCreateTicketOpen(false);
    setNewTicketData({
      title: '',
      category: '',
      description: '',
      priority: 'Medium',
    });
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
        return '#ff5d5d';
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const DashboardOverview = () => (
    <Grid container spacing={3}>
      {/* Department Stats */}
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Assignment sx={{ mr: 1, color: '#1976d2' }} />
              <Typography variant="h6">Total Tickets</Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
              {departmentStats.totalTickets}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Department tickets
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Schedule sx={{ mr: 1, color: '#ff9800' }} />
              <Typography variant="h6">Open Tickets</Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
              {departmentStats.openTickets}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Awaiting resolution
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <People sx={{ mr: 1, color: '#4caf50' }} />
              <Typography variant="h6">Team Members</Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
              {departmentStats.teamMembers}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active members
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TrendingUp sx={{ mr: 1, color: '#9c27b0' }} />
              <Typography variant="h6">Productivity</Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#9c27b0' }}>
              {departmentStats.productivity}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Department average
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Pending Approvals */}
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CheckCircle sx={{ mr: 1 }} />
              <Typography variant="h6">Pending Approvals</Typography>
              <Badge badgeContent={pendingApprovals.length} color="primary" sx={{ ml: 1 }} />
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Requester</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Cost</TableCell>
                    <TableCell>Urgency</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pendingApprovals.map((approval) => (
                    <TableRow key={approval.id}>
                      <TableCell>{approval.requestedByName}</TableCell>
                      <TableCell>
                        <Chip label={approval.type} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>{approval.description}</TableCell>
                      <TableCell>
                        {approval.estimatedCost && formatCurrency(approval.estimatedCost)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={approval.urgency}
                          size="small"
                          sx={{
                            backgroundColor: getUrgencyColor(approval.urgency) + '20',
                            color: getUrgencyColor(approval.urgency),
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          onClick={() => setSelectedApproval(approval)}
                          sx={{ mr: 1 }}
                        >
                          Review
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

      {/* Performance Metrics */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <BarChart sx={{ mr: 1 }} />
              <Typography variant="h6">Performance</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Avg Resolution Time
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {departmentStats.averageResolutionTime}h
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Resolution Rate
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {Math.round((departmentStats.resolvedTickets / departmentStats.totalTickets) * 100)}
                %
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const TeamTicketsTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Assignment sx={{ mr: 1 }} />
              <Typography variant="h6">Team Tickets</Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Ticket ID</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Requester</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {teamTickets.map((ticket) => (
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
                        <IconButton size="small" onClick={() => setSelectedTicket(ticket)}>
                          <Visibility />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedReassignTicket(ticket);
                            setReassignDialogOpen(true);
                          }}
                        >
                          <PersonAdd />
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

  const MyTicketsTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Assignment sx={{ mr: 1 }} />
                <Typography variant="h6">My Tickets</Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setCreateTicketOpen(true)}
              >
                Create Ticket
              </Button>
            </Box>
            <Grid container spacing={2}>
              {myTickets.map((ticket) => (
                <Grid item xs={12} md={6} lg={4} key={ticket.id}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      '&:hover': { elevation: 4 },
                    }}
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="h6">{ticket.ticketNumber}</Typography>
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
    </Grid>
  );

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 3 }}>
        Manager Dashboard
      </Typography>

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab icon={<Dashboard />} label="Overview" />
        <Tab icon={<Assignment />} label="Team Tickets" />
        <Tab icon={<Assignment />} label="My Tickets" />
      </Tabs>

      <TabPanel value={activeTab} index={0}>
        <DashboardOverview />
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        <TeamTicketsTab />
      </TabPanel>
      <TabPanel value={activeTab} index={2}>
        <MyTicketsTab />
      </TabPanel>

      {/* Approval Review Dialog */}
      <Dialog
        open={!!selectedApproval}
        onClose={() => setSelectedApproval(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedApproval && (
          <>
            <DialogTitle>Review Approval Request</DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {selectedApproval.description}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Requested by: {selectedApproval.requestedByName}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Justification: {selectedApproval.justification}
                </Typography>
                {selectedApproval.estimatedCost && (
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    Estimated Cost: {formatCurrency(selectedApproval.estimatedCost)}
                  </Typography>
                )}
                <TextField
                  fullWidth
                  label="Comments"
                  multiline
                  rows={3}
                  value={approvalComment}
                  onChange={(e) => setApprovalComment(e.target.value)}
                  placeholder="Add comments for your decision..."
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedApproval(null)}>Cancel</Button>
              <Button
                onClick={() => handleApprovalAction(selectedApproval, 'reject')}
                color="error"
                startIcon={<Block />}
              >
                Reject
              </Button>
              <Button
                onClick={() => handleApprovalAction(selectedApproval, 'approve')}
                color="success"
                variant="contained"
                startIcon={<CheckCircle />}
              >
                Approve
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Reassign Dialog */}
      <Dialog
        open={reassignDialogOpen}
        onClose={() => setReassignDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Reassign Ticket</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Reassign ticket {selectedReassignTicket?.ticketNumber} to:
            </Typography>
            <FormControl fullWidth>
              <InputLabel>Team Member</InputLabel>
              <Select
                value={reassignTo}
                onChange={(e) => setReassignTo(e.target.value)}
                label="Team Member"
              >
                {teamMembers.map((member) => (
                  <MenuItem key={member.id} value={member.id}>
                    {member.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReassignDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleReassignTicket} variant="contained" disabled={!reassignTo}>
            Reassign
          </Button>
        </DialogActions>
      </Dialog>

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
                      setNewTicketData({ ...newTicketData, category: e.target.value })
                    }
                    label="Category"
                  >
                    <MenuItem value="Hardware">Hardware</MenuItem>
                    <MenuItem value="Software">Software</MenuItem>
                    <MenuItem value="Network">Network</MenuItem>
                    <MenuItem value="Access">Access</MenuItem>
                    <MenuItem value="HR">HR</MenuItem>
                    <MenuItem value="Security">Security</MenuItem>
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
            />
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

      {/* Ticket Detail Dialog */}
      <Dialog
        open={!!selectedTicket}
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
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default ManagerDashboard;
