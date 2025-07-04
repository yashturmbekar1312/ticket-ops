import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Tab,
  Tabs,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Divider,
  Alert,
  Switch,
  FormControlLabel,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  LinearProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  ShoppingCart as CatalogIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Assessment as MetricsIcon,
  AccountTree as WorkflowIcon,
  Approval as ApprovalIcon,
} from '@mui/icons-material';
import { useAuth } from '../hooks/auth';

interface ServiceCatalogItem {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  price: number;
  currency: string;
  estimatedDelivery: string;
  approvalRequired: boolean;
  isActive: boolean;
  requestCount: number;
  averageRating: number;
  tags: string[];
  fields: FormField[];
  workflow: string;
  createdBy: string;
  createdDate: string;
  lastModified: string;
}

interface FormField {
  id: string;
  name: string;
  type: 'text' | 'select' | 'multiline' | 'number' | 'date' | 'file' | 'checkbox';
  label: string;
  required: boolean;
  options?: string[];
  validation?: string;
  helpText?: string;
}

interface ServiceRequest {
  id: string;
  serviceId: string;
  serviceName: string;
  requester: string;
  requesterEmail: string;
  status: 'pending' | 'approved' | 'rejected' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  requestedDate: string;
  approvalDate?: string;
  completionDate?: string;
  assignedTo?: string;
  description: string;
  attachments: string[];
  cost: number;
  estimatedCompletion: string;
  actualCompletion?: string;
  approvalHistory: ApprovalStep[];
  comments: Comment[];
}

interface ApprovalStep {
  id: string;
  approver: string;
  approverEmail: string;
  status: 'pending' | 'approved' | 'rejected';
  date?: string;
  comments?: string;
  level: number;
}

interface Comment {
  id: string;
  author: string;
  authorEmail: string;
  content: string;
  timestamp: string;
  isInternal: boolean;
}

const ServiceCatalogPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'create' | 'edit' | 'view' | 'request'>('create');
  const [selectedItem, setSelectedItem] = useState<ServiceCatalogItem | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);

  // Mock data
  const [catalogItems] = useState<ServiceCatalogItem[]>([
    {
      id: '1',
      name: 'New Employee Onboarding',
      description:
        'Complete onboarding package for new employees including laptop, software licenses, and access setup',
      category: 'HR Services',
      icon: '👤',
      price: 2500.0,
      currency: 'USD',
      estimatedDelivery: '3-5 business days',
      approvalRequired: true,
      isActive: true,
      requestCount: 45,
      averageRating: 4.8,
      tags: ['onboarding', 'hr', 'new-hire'],
      fields: [
        { id: '1', name: 'employee_name', type: 'text', label: 'Employee Name', required: true },
        {
          id: '2',
          name: 'department',
          type: 'select',
          label: 'Department',
          required: true,
          options: ['IT', 'HR', 'Finance', 'Marketing'],
        },
        { id: '3', name: 'start_date', type: 'date', label: 'Start Date', required: true },
        { id: '4', name: 'manager', type: 'text', label: 'Manager', required: true },
        {
          id: '5',
          name: 'special_requirements',
          type: 'multiline',
          label: 'Special Requirements',
          required: false,
        },
      ],
      workflow: 'hr-onboarding',
      createdBy: 'admin@company.com',
      createdDate: '2024-01-15',
      lastModified: '2024-03-10',
    },
    {
      id: '2',
      name: 'Software License Request',
      description: 'Request for new software license or renewal',
      category: 'IT Services',
      icon: '💾',
      price: 0.0,
      currency: 'USD',
      estimatedDelivery: '1-2 business days',
      approvalRequired: true,
      isActive: true,
      requestCount: 128,
      averageRating: 4.5,
      tags: ['software', 'license', 'it'],
      fields: [
        { id: '1', name: 'software_name', type: 'text', label: 'Software Name', required: true },
        {
          id: '2',
          name: 'license_type',
          type: 'select',
          label: 'License Type',
          required: true,
          options: ['Individual', 'Team', 'Enterprise'],
        },
        {
          id: '3',
          name: 'business_justification',
          type: 'multiline',
          label: 'Business Justification',
          required: true,
        },
        {
          id: '4',
          name: 'urgency',
          type: 'select',
          label: 'Urgency',
          required: true,
          options: ['Low', 'Medium', 'High', 'Critical'],
        },
      ],
      workflow: 'software-approval',
      createdBy: 'it-admin@company.com',
      createdDate: '2024-01-20',
      lastModified: '2024-03-15',
    },
    {
      id: '3',
      name: 'Conference Room Booking',
      description: 'Book conference rooms for meetings and events',
      category: 'Facilities',
      icon: '🏢',
      price: 0.0,
      currency: 'USD',
      estimatedDelivery: 'Immediate',
      approvalRequired: false,
      isActive: true,
      requestCount: 324,
      averageRating: 4.2,
      tags: ['facilities', 'booking', 'meeting'],
      fields: [
        {
          id: '1',
          name: 'room_preference',
          type: 'select',
          label: 'Room Preference',
          required: true,
          options: ['Small (2-6)', 'Medium (6-12)', 'Large (12+)', 'Board Room'],
        },
        { id: '2', name: 'date', type: 'date', label: 'Date', required: true },
        { id: '3', name: 'time_start', type: 'text', label: 'Start Time', required: true },
        { id: '4', name: 'time_end', type: 'text', label: 'End Time', required: true },
        { id: '5', name: 'purpose', type: 'text', label: 'Purpose', required: true },
        {
          id: '6',
          name: 'equipment_needed',
          type: 'multiline',
          label: 'Equipment Needed',
          required: false,
        },
      ],
      workflow: 'facilities-booking',
      createdBy: 'facilities@company.com',
      createdDate: '2024-02-01',
      lastModified: '2024-03-05',
    },
  ]);

  const [serviceRequests] = useState<ServiceRequest[]>([
    {
      id: 'SR-001',
      serviceId: '1',
      serviceName: 'New Employee Onboarding',
      requester: 'John Manager',
      requesterEmail: 'john.manager@company.com',
      status: 'in_progress',
      priority: 'medium',
      requestedDate: '2024-03-15',
      approvalDate: '2024-03-16',
      assignedTo: 'HR Team',
      description: 'Onboarding for new developer starting next Monday',
      attachments: ['offer_letter.pdf', 'background_check.pdf'],
      cost: 2500.0,
      estimatedCompletion: '2024-03-20',
      approvalHistory: [
        {
          id: '1',
          approver: 'HR Manager',
          approverEmail: 'hr.manager@company.com',
          status: 'approved',
          date: '2024-03-16',
          comments: 'Approved for immediate processing',
          level: 1,
        },
      ],
      comments: [
        {
          id: '1',
          author: 'HR Team',
          authorEmail: 'hr-team@company.com',
          content: 'Laptop ordered and should arrive by Tuesday',
          timestamp: '2024-03-17T10:30:00Z',
          isInternal: false,
        },
      ],
    },
    {
      id: 'SR-002',
      serviceId: '2',
      serviceName: 'Software License Request',
      requester: 'Sarah Developer',
      requesterEmail: 'sarah.dev@company.com',
      status: 'pending',
      priority: 'high',
      requestedDate: '2024-03-18',
      description: 'Need IntelliJ IDEA license for development work',
      attachments: [],
      cost: 0.0,
      estimatedCompletion: '2024-03-20',
      approvalHistory: [
        {
          id: '1',
          approver: 'IT Manager',
          approverEmail: 'it.manager@company.com',
          status: 'pending',
          level: 1,
        },
      ],
      comments: [],
    },
  ]);

  const categories = ['all', 'IT Services', 'HR Services', 'Facilities', 'Finance', 'Legal'];

  const filteredCatalogItems = catalogItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleCreateRequest = (item: ServiceCatalogItem) => {
    setSelectedItem(item);
    setDialogType('request');
    setOpenDialog(true);
  };

  const handleEditItem = (item: ServiceCatalogItem) => {
    setSelectedItem(item);
    setDialogType('edit');
    setOpenDialog(true);
  };

  const handleViewRequest = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setDialogType('view');
    setOpenDialog(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'approved':
        return 'info';
      case 'in_progress':
        return 'primary';
      case 'completed':
        return 'success';
      case 'rejected':
        return 'error';
      case 'cancelled':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <PendingIcon />;
      case 'approved':
        return <CheckCircleIcon />;
      case 'in_progress':
        return <AssignmentIcon />;
      case 'completed':
        return <CheckCircleIcon />;
      case 'rejected':
        return <CancelIcon />;
      case 'cancelled':
        return <CancelIcon />;
      default:
        return <PendingIcon />;
    }
  };

  const renderCatalogTab = () => (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          placeholder="Search services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          sx={{ minWidth: 300 }}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />,
          }}
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            label="Category"
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {user?.role && ['IT Admin', 'Admin'].includes(user.role) && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setDialogType('create');
              setOpenDialog(true);
            }}
          >
            Add Service
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {filteredCatalogItems.map((item) => (
          <Grid item xs={12} md={6} lg={4} key={item.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>{item.icon}</Avatar>
                  <Box>
                    <Typography variant="h6" component="h2">
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.category}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {item.description}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Price:</strong> {item.price > 0 ? `$${item.price.toFixed(2)}` : 'Free'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Delivery:</strong> {item.estimatedDelivery}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Requests:</strong> {item.requestCount}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  {item.tags.map((tag) => (
                    <Chip key={tag} label={tag} size="small" variant="outlined" />
                  ))}
                </Box>
                {item.approvalRequired && (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    <ApprovalIcon sx={{ mr: 1 }} />
                    Approval Required
                  </Alert>
                )}
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => handleCreateRequest(item)}
                  disabled={!item.isActive}
                >
                  Request Service
                </Button>
                {user?.role && ['IT Admin', 'Admin'].includes(user.role) && (
                  <IconButton onClick={() => handleEditItem(item)} size="small">
                    <EditIcon />
                  </IconButton>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderRequestsTab = () => (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
        <Typography variant="h6">Service Requests</Typography>
        <Button variant="outlined" startIcon={<FilterIcon />} size="small">
          Filter
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Request ID</TableCell>
              <TableCell>Service</TableCell>
              <TableCell>Requester</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Requested Date</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {serviceRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.id}</TableCell>
                <TableCell>{request.serviceName}</TableCell>
                <TableCell>{request.requester}</TableCell>
                <TableCell>
                  <Chip
                    icon={getStatusIcon(request.status)}
                    label={request.status.replace('_', ' ')}
                    color={getStatusColor(request.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={request.priority}
                    color={
                      request.priority === 'critical'
                        ? 'error'
                        : request.priority === 'high'
                          ? 'warning'
                          : 'default'
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>{request.requestedDate}</TableCell>
                <TableCell>{request.assignedTo || 'Unassigned'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleViewRequest(request)} size="small">
                    <ViewIcon />
                  </IconButton>
                  <IconButton size="small">
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderMetricsTab = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Service Catalog Metrics
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="primary">
                {catalogItems.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Services
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="primary">
                {serviceRequests.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Requests
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="success.main">
                {serviceRequests.filter((r) => r.status === 'completed').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="warning.main">
                {serviceRequests.filter((r) => r.status === 'pending').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending Approval
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Popular Services
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Service</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Requests</TableCell>
                <TableCell>Avg. Rating</TableCell>
                <TableCell>Completion Rate</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {catalogItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.requestCount}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ mr: 1 }}>
                        {item.averageRating}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={(item.averageRating / 5) * 100}
                        sx={{ flexGrow: 1, mr: 1 }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <LinearProgress
                      variant="determinate"
                      value={Math.random() * 100}
                      color="success"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );

  const renderApprovalTab = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Approval Workflows
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Configure approval workflows for different service types and manage approval chains.
      </Alert>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                <WorkflowIcon sx={{ mr: 1 }} />
                Workflow Configuration
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="HR Onboarding"
                    secondary="Manager → HR Manager → IT Team"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Software License"
                    secondary="IT Manager → Finance (if >$500)"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <PendingIcon color="warning" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Facilities Booking"
                    secondary="Auto-approval for standard rooms"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                <PendingIcon sx={{ mr: 1 }} />
                Pending Approvals
              </Typography>
              <List>
                {serviceRequests
                  .filter((r) => r.status === 'pending')
                  .map((request) => (
                    <ListItem key={request.id}>
                      <ListItemText
                        primary={request.serviceName}
                        secondary={`${request.requester} - ${request.requestedDate}`}
                      />
                      <Button size="small" variant="outlined" color="success">
                        Approve
                      </Button>
                      <Button size="small" variant="outlined" color="error" sx={{ ml: 1 }}>
                        Reject
                      </Button>
                    </ListItem>
                  ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        <CatalogIcon sx={{ mr: 2 }} />
        Service Catalog Management
      </Typography>

      <Paper sx={{ width: '100%' }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Service Catalog" icon={<CatalogIcon />} />
          <Tab label="Service Requests" icon={<AssignmentIcon />} />
          <Tab label="Metrics & Analytics" icon={<MetricsIcon />} />
          <Tab label="Approval Workflows" icon={<ApprovalIcon />} />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {activeTab === 0 && renderCatalogTab()}
          {activeTab === 1 && renderRequestsTab()}
          {activeTab === 2 && renderMetricsTab()}
          {activeTab === 3 && renderApprovalTab()}
        </Box>
      </Paper>

      {/* Create/Edit Service Dialog */}
      <Dialog
        open={openDialog && (dialogType === 'create' || dialogType === 'edit')}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{dialogType === 'create' ? 'Create New Service' : 'Edit Service'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Service Name"
              defaultValue={selectedItem?.name || ''}
              fullWidth
              required
            />
            <TextField
              label="Description"
              defaultValue={selectedItem?.description || ''}
              multiline
              rows={3}
              fullWidth
              required
            />
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select defaultValue={selectedItem?.category || ''} label="Category">
                {categories
                  .filter((c) => c !== 'all')
                  .map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <TextField
              label="Price (USD)"
              type="number"
              defaultValue={selectedItem?.price || 0}
              fullWidth
            />
            <TextField
              label="Estimated Delivery"
              defaultValue={selectedItem?.estimatedDelivery || ''}
              fullWidth
            />
            <FormControlLabel
              control={<Switch defaultChecked={selectedItem?.approvalRequired || false} />}
              label="Approval Required"
            />
            <FormControlLabel
              control={<Switch defaultChecked={selectedItem?.isActive !== false} />}
              label="Active"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained">{dialogType === 'create' ? 'Create' : 'Update'}</Button>
        </DialogActions>
      </Dialog>

      {/* Service Request Dialog */}
      <Dialog
        open={openDialog && dialogType === 'request'}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Request Service: {selectedItem?.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <Alert severity="info">{selectedItem?.description}</Alert>
            {selectedItem?.fields.map((field) => (
              <TextField
                key={field.id}
                label={field.label}
                multiline={field.type === 'multiline'}
                rows={field.type === 'multiline' ? 3 : 1}
                type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                required={field.required}
                fullWidth
                InputLabelProps={field.type === 'date' ? { shrink: true } : {}}
                helperText={field.helpText}
              />
            ))}
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Estimated Cost:</strong>{' '}
                {selectedItem?.price ? `$${selectedItem.price.toFixed(2)}` : 'Free'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Delivery Time:</strong> {selectedItem?.estimatedDelivery}
              </Typography>
              {selectedItem?.approvalRequired && (
                <Typography variant="body2" color="warning.main">
                  <strong>Note:</strong> This request requires approval before processing.
                </Typography>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained">Submit Request</Button>
        </DialogActions>
      </Dialog>

      {/* View Request Dialog */}
      <Dialog
        open={openDialog && dialogType === 'view'}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Service Request: {selectedRequest?.id}</DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Service
                  </Typography>
                  <Typography variant="body1">{selectedRequest.serviceName}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Status
                  </Typography>
                  <Chip
                    icon={getStatusIcon(selectedRequest.status)}
                    label={selectedRequest.status.replace('_', ' ')}
                    color={getStatusColor(selectedRequest.status) as any}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Requester
                  </Typography>
                  <Typography variant="body1">{selectedRequest.requester}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Priority
                  </Typography>
                  <Chip
                    label={selectedRequest.priority}
                    color={
                      selectedRequest.priority === 'critical'
                        ? 'error'
                        : selectedRequest.priority === 'high'
                          ? 'warning'
                          : 'default'
                    }
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Description
                  </Typography>
                  <Typography variant="body1">{selectedRequest.description}</Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6">Approval History</Typography>
              <List>
                {selectedRequest.approvalHistory.map((approval) => (
                  <ListItem key={approval.id}>
                    <ListItemIcon>
                      {approval.status === 'approved' ? (
                        <CheckCircleIcon color="success" />
                      ) : approval.status === 'rejected' ? (
                        <CancelIcon color="error" />
                      ) : (
                        <PendingIcon color="warning" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={approval.approver}
                      secondary={`Level ${approval.level} - ${approval.status} ${approval.date ? `on ${approval.date}` : ''}`}
                    />
                  </ListItem>
                ))}
              </List>

              {selectedRequest.comments.length > 0 && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6">Comments</Typography>
                  <List>
                    {selectedRequest.comments.map((comment) => (
                      <ListItem key={comment.id}>
                        <ListItemText
                          primary={comment.content}
                          secondary={`${comment.author} - ${new Date(comment.timestamp).toLocaleDateString()}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
          {selectedRequest?.status === 'pending' &&
            user?.role &&
            ['IT Admin', 'Admin', 'Manager'].includes(user.role) && (
              <>
                <Button variant="contained" color="success">
                  Approve
                </Button>
                <Button variant="contained" color="error">
                  Reject
                </Button>
              </>
            )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ServiceCatalogPage;
