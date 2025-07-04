import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Tab,
  Tabs,
  Button,
  TextField,
  IconButton,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  LinearProgress,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
  Timeline as TimelineIcon,
  Approval as ApprovalIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  Visibility as VisibilityIcon,
  Assignment as AssignmentIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

interface ApprovalWorkflow {
  id: string;
  name: string;
  description: string;
  category:
    | 'service_request'
    | 'change_request'
    | 'purchase_order'
    | 'time_off'
    | 'expense'
    | 'custom';
  status: 'active' | 'inactive' | 'draft';
  steps: ApprovalStep[];
  conditions: ApprovalCondition[];
  settings: {
    autoApprove: boolean;
    timeout: number;
    escalation: boolean;
    parallel: boolean;
  };
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  usage: number;
}

interface ApprovalStep {
  id: string;
  name: string;
  type: 'individual' | 'group' | 'role' | 'manager' | 'any' | 'all';
  approvers: string[];
  conditions?: ApprovalCondition[];
  timeout?: number;
  escalation?: string[];
  order: number;
  required: boolean;
}

interface ApprovalCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'in';
  value: string | number | string[];
  logicalOperator?: 'AND' | 'OR';
}

interface ApprovalRequest {
  id: string;
  title: string;
  type: string;
  requestor: string;
  workflow: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'expired';
  currentStep: number;
  steps: ApprovalRequestStep[];
  createdAt: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  details: Record<string, any>;
}

interface ApprovalRequestStep {
  id: string;
  name: string;
  approver: string;
  status: 'pending' | 'approved' | 'rejected' | 'skipped';
  comments?: string;
  decidedAt?: string;
  dueDate: string;
}

const ApprovalManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<ApprovalWorkflow | null>(null);
  const [, setDialogType] = useState<'workflow' | 'request' | null>(null);

  // Mock data
  const workflows: ApprovalWorkflow[] = [
    {
      id: '1',
      name: 'Service Request Approval',
      description: 'Standard approval workflow for service requests',
      category: 'service_request',
      status: 'active',
      steps: [
        {
          id: '1',
          name: 'Line Manager Approval',
          type: 'manager',
          approvers: ['manager'],
          order: 1,
          required: true,
          timeout: 2,
        },
        {
          id: '2',
          name: 'IT Department Approval',
          type: 'group',
          approvers: ['it-managers'],
          order: 2,
          required: true,
          timeout: 3,
        },
      ],
      conditions: [
        {
          field: 'amount',
          operator: 'greater_than',
          value: 1000,
        },
      ],
      settings: {
        autoApprove: false,
        timeout: 5,
        escalation: true,
        parallel: false,
      },
      createdAt: '2024-01-01T08:00:00Z',
      updatedAt: '2024-01-10T14:30:00Z',
      createdBy: 'admin@company.com',
      usage: 156,
    },
    {
      id: '2',
      name: 'Change Request Approval',
      description: 'CAB approval workflow for change requests',
      category: 'change_request',
      status: 'active',
      steps: [
        {
          id: '1',
          name: 'Technical Review',
          type: 'role',
          approvers: ['technical-lead'],
          order: 1,
          required: true,
          timeout: 1,
        },
        {
          id: '2',
          name: 'Change Advisory Board',
          type: 'group',
          approvers: ['cab-members'],
          order: 2,
          required: true,
          timeout: 2,
        },
        {
          id: '3',
          name: 'Final Approval',
          type: 'individual',
          approvers: ['change-manager@company.com'],
          order: 3,
          required: true,
          timeout: 1,
        },
      ],
      conditions: [
        {
          field: 'risk',
          operator: 'in',
          value: ['high', 'critical'],
        },
      ],
      settings: {
        autoApprove: false,
        timeout: 7,
        escalation: true,
        parallel: false,
      },
      createdAt: '2024-01-02T09:15:00Z',
      updatedAt: '2024-01-12T11:45:00Z',
      createdBy: 'admin@company.com',
      usage: 89,
    },
    {
      id: '3',
      name: 'Purchase Order Approval',
      description: 'Financial approval workflow for purchase orders',
      category: 'purchase_order',
      status: 'active',
      steps: [
        {
          id: '1',
          name: 'Budget Owner',
          type: 'role',
          approvers: ['budget-owner'],
          order: 1,
          required: true,
          timeout: 2,
        },
        {
          id: '2',
          name: 'Finance Team',
          type: 'group',
          approvers: ['finance-team'],
          order: 2,
          required: true,
          timeout: 3,
        },
        {
          id: '3',
          name: 'Executive Approval',
          type: 'role',
          approvers: ['executive'],
          order: 3,
          required: false,
          timeout: 2,
        },
      ],
      conditions: [
        {
          field: 'amount',
          operator: 'greater_than',
          value: 5000,
        },
      ],
      settings: {
        autoApprove: false,
        timeout: 10,
        escalation: true,
        parallel: false,
      },
      createdAt: '2024-01-03T10:30:00Z',
      updatedAt: '2024-01-08T16:20:00Z',
      createdBy: 'admin@company.com',
      usage: 34,
    },
  ];

  const approvalRequests: ApprovalRequest[] = [
    {
      id: '1',
      title: 'New Laptop Request - MacBook Pro',
      type: 'Service Request',
      requestor: 'john.smith@company.com',
      workflow: 'Service Request Approval',
      status: 'pending',
      currentStep: 1,
      steps: [
        {
          id: '1',
          name: 'Line Manager Approval',
          approver: 'manager@company.com',
          status: 'approved',
          comments: 'Approved - employee needs new laptop for project',
          decidedAt: '2024-01-14T10:30:00Z',
          dueDate: '2024-01-16T17:00:00Z',
        },
        {
          id: '2',
          name: 'IT Department Approval',
          approver: 'it-manager@company.com',
          status: 'pending',
          dueDate: '2024-01-17T17:00:00Z',
        },
      ],
      createdAt: '2024-01-13T09:15:00Z',
      dueDate: '2024-01-18T17:00:00Z',
      priority: 'medium',
      details: {
        item: 'MacBook Pro 16"',
        cost: 2500,
        justification: 'Current laptop is 5 years old and performance is inadequate',
      },
    },
    {
      id: '2',
      title: 'Database Schema Change - Customer Table',
      type: 'Change Request',
      requestor: 'developer@company.com',
      workflow: 'Change Request Approval',
      status: 'pending',
      currentStep: 2,
      steps: [
        {
          id: '1',
          name: 'Technical Review',
          approver: 'tech-lead@company.com',
          status: 'approved',
          comments: 'Technical review complete - no issues found',
          decidedAt: '2024-01-14T14:20:00Z',
          dueDate: '2024-01-15T17:00:00Z',
        },
        {
          id: '2',
          name: 'Change Advisory Board',
          approver: 'cab@company.com',
          status: 'pending',
          dueDate: '2024-01-16T17:00:00Z',
        },
        {
          id: '3',
          name: 'Final Approval',
          approver: 'change-manager@company.com',
          status: 'pending',
          dueDate: '2024-01-17T17:00:00Z',
        },
      ],
      createdAt: '2024-01-12T11:45:00Z',
      dueDate: '2024-01-19T17:00:00Z',
      priority: 'high',
      details: {
        system: 'Customer Database',
        risk: 'Medium',
        impact: 'Low',
        rollback: 'Database backup available',
      },
    },
    {
      id: '3',
      title: 'Software License Purchase - Adobe Creative Suite',
      type: 'Purchase Order',
      requestor: 'marketing@company.com',
      workflow: 'Purchase Order Approval',
      status: 'approved',
      currentStep: 3,
      steps: [
        {
          id: '1',
          name: 'Budget Owner',
          approver: 'budget-owner@company.com',
          status: 'approved',
          comments: 'Budget available for this quarter',
          decidedAt: '2024-01-10T09:30:00Z',
          dueDate: '2024-01-12T17:00:00Z',
        },
        {
          id: '2',
          name: 'Finance Team',
          approver: 'finance@company.com',
          status: 'approved',
          comments: 'Financial review complete',
          decidedAt: '2024-01-11T15:45:00Z',
          dueDate: '2024-01-13T17:00:00Z',
        },
        {
          id: '3',
          name: 'Executive Approval',
          approver: 'ceo@company.com',
          status: 'approved',
          comments: 'Approved for marketing team expansion',
          decidedAt: '2024-01-12T08:15:00Z',
          dueDate: '2024-01-14T17:00:00Z',
        },
      ],
      createdAt: '2024-01-09T14:20:00Z',
      dueDate: '2024-01-16T17:00:00Z',
      priority: 'low',
      details: {
        vendor: 'Adobe Systems',
        licenses: 5,
        cost: 3000,
        duration: '12 months',
      },
    },
  ];

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleOpenDialog = (type: 'workflow' | 'request', workflow?: ApprovalWorkflow) => {
    setDialogType(type);
    setSelectedWorkflow(workflow || null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedWorkflow(null);
    setDialogType(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'default';
      case 'expired':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircleIcon color="success" />;
      case 'rejected':
        return <CancelIcon color="error" />;
      case 'pending':
        return <HourglassEmptyIcon color="warning" />;
      case 'cancelled':
        return <CloseIcon color="disabled" />;
      case 'expired':
        return <WarningIcon color="error" />;
      default:
        return <ScheduleIcon />;
    }
  };

  const renderWorkflowsTab = () => (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Approval Workflows</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog('workflow')}
        >
          Create Workflow
        </Button>
      </Box>

      <Grid container spacing={3}>
        {workflows.map((workflow) => (
          <Grid item xs={12} key={workflow.id}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 2,
                  }}
                >
                  <Box>
                    <Typography variant="h6" component="div">
                      {workflow.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {workflow.description}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip label={workflow.category.replace('_', ' ')} size="small" sx={{ mr: 1 }} />
                    <Chip
                      label={workflow.status}
                      size="small"
                      color={workflow.status === 'active' ? 'success' : 'default'}
                    />
                    <IconButton size="small" onClick={() => handleOpenDialog('workflow', workflow)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color={workflow.status === 'active' ? 'warning' : 'success'}
                    >
                      {workflow.status === 'active' ? <PauseIcon /> : <PlayArrowIcon />}
                    </IconButton>
                    <IconButton size="small" color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={8}>
                    <Typography variant="subtitle2" gutterBottom>
                      Approval Steps
                    </Typography>
                    <Stepper orientation="vertical" sx={{ ml: 2 }}>
                      {workflow.steps.map((step) => (
                        <Step key={step.id} active={true} completed={false}>
                          <StepLabel>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2" fontWeight="bold">
                                {step.name}
                              </Typography>
                              <Chip label={step.type} size="small" variant="outlined" />
                              {step.required && (
                                <Chip
                                  label="Required"
                                  size="small"
                                  color="error"
                                  variant="outlined"
                                />
                              )}
                            </Box>
                          </StepLabel>
                          <StepContent>
                            <Typography variant="body2" color="text.secondary">
                              Approvers: {step.approvers.join(', ')}
                            </Typography>
                            {step.timeout && (
                              <Typography variant="body2" color="text.secondary">
                                Timeout: {step.timeout} days
                              </Typography>
                            )}
                          </StepContent>
                        </Step>
                      ))}
                    </Stepper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle2" gutterBottom>
                      Workflow Settings
                    </Typography>
                    <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Timeout: {workflow.settings.timeout} days
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Escalation: {workflow.settings.escalation ? 'Enabled' : 'Disabled'}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Parallel: {workflow.settings.parallel ? 'Yes' : 'No'}
                      </Typography>
                      <Typography variant="body2">Usage: {workflow.usage} requests</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderPendingApprovalsTab = () => (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Pending Approvals</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog('request')}
        >
          New Request
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Request</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Requestor</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Current Step</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {approvalRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      {request.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Created: {new Date(request.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{request.type}</TableCell>
                <TableCell>{request.requestor}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getStatusIcon(request.status)}
                    <Chip
                      label={request.status}
                      size="small"
                      color={getStatusColor(request.status) as any}
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2">
                      {request.steps[request.currentStep - 1]?.name || 'Completed'}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={(request.currentStep / request.steps.length) * 100}
                      sx={{ width: 100, mt: 1 }}
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    color={new Date(request.dueDate) < new Date() ? 'error' : 'text.primary'}
                  >
                    {new Date(request.dueDate).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={request.priority}
                    size="small"
                    color={
                      request.priority === 'urgent'
                        ? 'error'
                        : request.priority === 'high'
                          ? 'warning'
                          : request.priority === 'medium'
                            ? 'primary'
                            : 'default'
                    }
                  />
                </TableCell>
                <TableCell>
                  <IconButton size="small">
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton size="small" color="success">
                    <CheckIcon />
                  </IconButton>
                  <IconButton size="small" color="error">
                    <CloseIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderTemplatesTab = () => (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Approval Templates</Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          Create Template
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Service Request Templates
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <AssignmentIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Hardware Request"
                    secondary="Standard template for hardware requests"
                  />
                  <ListItemSecondaryAction>
                    <IconButton size="small">
                      <EditIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AssignmentIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Software License"
                    secondary="Template for software license requests"
                  />
                  <ListItemSecondaryAction>
                    <IconButton size="small">
                      <EditIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AssignmentIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Access Request"
                    secondary="Template for system access requests"
                  />
                  <ListItemSecondaryAction>
                    <IconButton size="small">
                      <EditIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Change Request Templates
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <TimelineIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Standard Change"
                    secondary="Template for routine changes"
                  />
                  <ListItemSecondaryAction>
                    <IconButton size="small">
                      <EditIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <TimelineIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Emergency Change"
                    secondary="Template for urgent changes"
                  />
                  <ListItemSecondaryAction>
                    <IconButton size="small">
                      <EditIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <TimelineIcon />
                  </ListItemIcon>
                  <ListItemText primary="Normal Change" secondary="Template for regular changes" />
                  <ListItemSecondaryAction>
                    <IconButton size="small">
                      <EditIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Purchase Order Templates
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <ApprovalIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Low Value Purchase"
                    secondary="Template for purchases under $1000"
                  />
                  <ListItemSecondaryAction>
                    <IconButton size="small">
                      <EditIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <ApprovalIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="High Value Purchase"
                    secondary="Template for purchases over $5000"
                  />
                  <ListItemSecondaryAction>
                    <IconButton size="small">
                      <EditIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <ApprovalIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Capital Expenditure"
                    secondary="Template for capital purchases"
                  />
                  <ListItemSecondaryAction>
                    <IconButton size="small">
                      <EditIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Approval Management
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Manage approval workflows, pending requests, and templates
      </Typography>

      <Card>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Workflows" />
          <Tab label="Pending Approvals" />
          <Tab label="Templates" />
        </Tabs>
        <CardContent>
          {activeTab === 0 && renderWorkflowsTab()}
          {activeTab === 1 && renderPendingApprovalsTab()}
          {activeTab === 2 && renderTemplatesTab()}
        </CardContent>
      </Card>

      {/* Workflow Creation/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogTitle>{selectedWorkflow ? 'Edit Workflow' : 'Create New Workflow'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Workflow Name"
                defaultValue={selectedWorkflow?.name || ''}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Category</InputLabel>
                <Select value={selectedWorkflow?.category || 'service_request'} label="Category">
                  <MenuItem value="service_request">Service Request</MenuItem>
                  <MenuItem value="change_request">Change Request</MenuItem>
                  <MenuItem value="purchase_order">Purchase Order</MenuItem>
                  <MenuItem value="time_off">Time Off</MenuItem>
                  <MenuItem value="expense">Expense</MenuItem>
                  <MenuItem value="custom">Custom</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                defaultValue={selectedWorkflow?.description || ''}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Approval Steps
              </Typography>
              <Alert severity="info">
                Advanced step builder interface would be implemented here
              </Alert>
            </Grid>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Workflow Settings
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={<Switch defaultChecked={selectedWorkflow?.settings.autoApprove} />}
                    label="Auto-approve when conditions are met"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={<Switch defaultChecked={selectedWorkflow?.settings.escalation} />}
                    label="Enable escalation on timeout"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={<Switch defaultChecked={selectedWorkflow?.settings.parallel} />}
                    label="Allow parallel approvals"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Default Timeout (days)"
                    type="number"
                    defaultValue={selectedWorkflow?.settings.timeout || 5}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleCloseDialog}>
            {selectedWorkflow ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ApprovalManagementPage;
