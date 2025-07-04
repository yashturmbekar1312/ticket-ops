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
  Divider,
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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Schedule as ScheduleIcon,
  Rule as RuleIcon,
  AutoMode as AutoModeIcon,
  Webhook as WebhookIcon,
  Email as EmailIcon,
  Assignment as AssignmentIcon,
  Update as UpdateIcon,
  Timeline as TimelineIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  type: 'trigger' | 'scheduled' | 'webhook' | 'condition';
  status: 'active' | 'inactive' | 'error';
  trigger: {
    event: string;
    conditions: Condition[];
  };
  actions: Action[];
  schedule?: {
    frequency: 'once' | 'hourly' | 'daily' | 'weekly' | 'monthly';
    time?: string;
    days?: string[];
  };
  createdAt: string;
  updatedAt: string;
  lastRun?: string;
  nextRun?: string;
  runCount: number;
  successRate: number;
  createdBy: string;
}

interface Condition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'in' | 'not_in';
  value: string | string[];
  logicalOperator?: 'AND' | 'OR';
}

interface Action {
  type:
    | 'assign'
    | 'update_field'
    | 'send_email'
    | 'send_sms'
    | 'create_ticket'
    | 'webhook'
    | 'escalate'
    | 'validate';
  parameters: Record<string, any>;
}

interface BusinessRule {
  id: string;
  name: string;
  description: string;
  category: 'validation' | 'assignment' | 'notification' | 'escalation' | 'sla';
  priority: 'low' | 'medium' | 'high' | 'critical';
  conditions: Condition[];
  actions: Action[];
  status: 'active' | 'inactive';
  order: number;
  createdAt: string;
  updatedAt: string;
}

const AutomationRulesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRule, setSelectedRule] = useState<AutomationRule | null>(null);

  // Mock data
  const automationRules: AutomationRule[] = [
    {
      id: '1',
      name: 'Auto-assign Critical Tickets',
      description: 'Automatically assign critical priority tickets to senior agents',
      type: 'trigger',
      status: 'active',
      trigger: {
        event: 'ticket.created',
        conditions: [
          { field: 'priority', operator: 'equals', value: 'Critical' },
          { field: 'category', operator: 'equals', value: 'Infrastructure' },
        ],
      },
      actions: [
        {
          type: 'assign',
          parameters: { agentGroup: 'senior_agents', method: 'round_robin' },
        },
        {
          type: 'send_email',
          parameters: {
            template: 'critical_ticket_notification',
            recipients: ['manager@company.com'],
          },
        },
      ],
      createdAt: '2024-01-10T09:00:00Z',
      updatedAt: '2024-01-14T14:30:00Z',
      lastRun: '2024-01-15T11:45:00Z',
      runCount: 247,
      successRate: 98.8,
      createdBy: 'admin@company.com',
    },
    {
      id: '2',
      name: 'SLA Warning Escalation',
      description: 'Escalate tickets approaching SLA breach',
      type: 'trigger',
      status: 'active',
      trigger: {
        event: 'sla.warning',
        conditions: [
          { field: 'sla_remaining', operator: 'less_than', value: '2' },
          { field: 'status', operator: 'not_equals', value: 'Resolved' },
        ],
      },
      actions: [
        {
          type: 'escalate',
          parameters: { level: 'manager', notify: true },
        },
        {
          type: 'update_field',
          parameters: { field: 'priority', value: 'High' },
        },
      ],
      createdAt: '2024-01-08T15:20:00Z',
      updatedAt: '2024-01-12T10:15:00Z',
      lastRun: '2024-01-15T10:30:00Z',
      runCount: 89,
      successRate: 95.5,
      createdBy: 'admin@company.com',
    },
    {
      id: '3',
      name: 'Weekly Unresolved Tickets Report',
      description: 'Send weekly report of unresolved tickets to managers',
      type: 'scheduled',
      status: 'active',
      trigger: {
        event: 'schedule.weekly',
        conditions: [],
      },
      actions: [
        {
          type: 'send_email',
          parameters: {
            template: 'weekly_unresolved_report',
            recipients: ['managers@company.com'],
          },
        },
      ],
      schedule: {
        frequency: 'weekly',
        time: '09:00',
        days: ['Monday'],
      },
      createdAt: '2024-01-05T12:00:00Z',
      updatedAt: '2024-01-05T12:00:00Z',
      lastRun: '2024-01-15T09:00:00Z',
      nextRun: '2024-01-22T09:00:00Z',
      runCount: 3,
      successRate: 100,
      createdBy: 'admin@company.com',
    },
    {
      id: '4',
      name: 'Customer Satisfaction Survey',
      description: 'Send satisfaction survey after ticket resolution',
      type: 'trigger',
      status: 'active',
      trigger: {
        event: 'ticket.resolved',
        conditions: [{ field: 'customer_type', operator: 'equals', value: 'external' }],
      },
      actions: [
        {
          type: 'send_email',
          parameters: {
            template: 'satisfaction_survey',
            delay: '1_hour',
          },
        },
      ],
      createdAt: '2024-01-12T16:45:00Z',
      updatedAt: '2024-01-12T16:45:00Z',
      lastRun: '2024-01-15T14:20:00Z',
      runCount: 156,
      successRate: 97.4,
      createdBy: 'admin@company.com',
    },
  ];

  const businessRules: BusinessRule[] = [
    {
      id: '1',
      name: 'Mandatory Fields Validation',
      description: 'Ensure all required fields are completed before ticket creation',
      category: 'validation',
      priority: 'high',
      conditions: [
        { field: 'category', operator: 'not_equals', value: '' },
        { field: 'priority', operator: 'not_equals', value: '' },
        { field: 'description', operator: 'not_equals', value: '' },
      ],
      actions: [
        {
          type: 'validate',
          parameters: { message: 'All required fields must be completed' },
        },
      ],
      status: 'active',
      order: 1,
      createdAt: '2024-01-01T08:00:00Z',
      updatedAt: '2024-01-01T08:00:00Z',
    },
    {
      id: '2',
      name: 'Department-based Assignment',
      description: 'Route tickets to appropriate departments based on category',
      category: 'assignment',
      priority: 'medium',
      conditions: [
        { field: 'category', operator: 'in', value: ['Hardware', 'Software', 'Network'] },
      ],
      actions: [
        {
          type: 'assign',
          parameters: { department: 'IT', method: 'category_based' },
        },
      ],
      status: 'active',
      order: 2,
      createdAt: '2024-01-02T10:30:00Z',
      updatedAt: '2024-01-02T10:30:00Z',
    },
    {
      id: '3',
      name: 'Executive Notification',
      description: 'Notify executives for critical business impact tickets',
      category: 'notification',
      priority: 'critical',
      conditions: [
        { field: 'impact', operator: 'equals', value: 'High' },
        { field: 'urgency', operator: 'equals', value: 'High' },
      ],
      actions: [
        {
          type: 'send_email',
          parameters: {
            recipients: ['executives@company.com'],
            template: 'executive_notification',
          },
        },
      ],
      status: 'active',
      order: 3,
      createdAt: '2024-01-03T14:15:00Z',
      updatedAt: '2024-01-03T14:15:00Z',
    },
  ];

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleOpenDialog = (_type: 'automation' | 'business', rule?: AutomationRule) => {
    setSelectedRule(rule || null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRule(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon color="success" />;
      case 'inactive':
        return <WarningIcon color="warning" />;
      case 'error':
        return <ErrorIcon color="error" />;
      default:
        return <InfoIcon />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'trigger':
        return <RuleIcon />;
      case 'scheduled':
        return <ScheduleIcon />;
      case 'webhook':
        return <WebhookIcon />;
      case 'condition':
        return <AutoModeIcon />;
      default:
        return <RuleIcon />;
    }
  };

  const renderAutomationRulesTab = () => (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Automation Rules</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog('automation')}
        >
          Create Rule
        </Button>
      </Box>

      <Grid container spacing={3}>
        {automationRules.map((rule) => (
          <Grid item xs={12} key={rule.id}>
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
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {getTypeIcon(rule.type)}
                    <Box sx={{ ml: 2 }}>
                      <Typography variant="h6" component="div">
                        {rule.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {rule.description}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getStatusIcon(rule.status)}
                    <Chip label={rule.type} size="small" sx={{ mr: 1 }} />
                    <IconButton size="small" onClick={() => handleOpenDialog('automation', rule)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color={rule.status === 'active' ? 'warning' : 'success'}
                    >
                      {rule.status === 'active' ? <PauseIcon /> : <PlayIcon />}
                    </IconButton>
                    <IconButton size="small" color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      Trigger Conditions
                    </Typography>
                    <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
                      <Typography variant="body2" fontWeight="bold">
                        Event: {rule.trigger.event}
                      </Typography>
                      {rule.trigger.conditions.map((condition, index) => (
                        <Typography key={index} variant="body2" sx={{ mt: 1 }}>
                          {condition.field} {condition.operator}{' '}
                          {Array.isArray(condition.value)
                            ? condition.value.join(', ')
                            : condition.value}
                        </Typography>
                      ))}
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      Actions
                    </Typography>
                    <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
                      {rule.actions.map((action, index) => (
                        <Typography key={index} variant="body2" sx={{ mt: index > 0 ? 1 : 0 }}>
                          {action.type}: {JSON.stringify(action.parameters)}
                        </Typography>
                      ))}
                    </Box>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={3}>
                    <Typography variant="body2" color="text.secondary">
                      Runs: {rule.runCount}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="body2" color="text.secondary">
                      Success Rate: {rule.successRate}%
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="body2" color="text.secondary">
                      Last Run: {rule.lastRun ? new Date(rule.lastRun).toLocaleString() : 'Never'}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="body2" color="text.secondary">
                      Next Run:{' '}
                      {rule.nextRun ? new Date(rule.nextRun).toLocaleString() : 'On trigger'}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderBusinessRulesTab = () => (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Business Rules</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog('business')}
        >
          Create Rule
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {businessRules.map((rule) => (
              <TableRow key={rule.id}>
                <TableCell>{rule.order}</TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      {rule.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {rule.description}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip label={rule.category} size="small" />
                </TableCell>
                <TableCell>
                  <Chip
                    label={rule.priority}
                    size="small"
                    color={
                      rule.priority === 'critical'
                        ? 'error'
                        : rule.priority === 'high'
                          ? 'warning'
                          : rule.priority === 'medium'
                            ? 'primary'
                            : 'default'
                    }
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={rule.status}
                    size="small"
                    color={rule.status === 'active' ? 'success' : 'default'}
                  />
                </TableCell>
                <TableCell>
                  <IconButton size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderMacrosTab = () => (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Macros & Templates</Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          Create Macro
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Ticket Response Templates
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Password Reset Instructions"
                    secondary="Quick response for password reset requests"
                  />
                  <ListItemSecondaryAction>
                    <IconButton size="small">
                      <EditIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Hardware Troubleshooting"
                    secondary="Standard hardware diagnostic steps"
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
                Bulk Actions
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <AssignmentIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Assign to Team Lead"
                    secondary="Bulk assign tickets to team lead"
                  />
                  <ListItemSecondaryAction>
                    <IconButton size="small">
                      <EditIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <UpdateIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Update Priority to High"
                    secondary="Bulk update ticket priority"
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
                Workflow Templates
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <TimelineIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Incident Response"
                    secondary="Standard incident response workflow"
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
                    primary="Change Request"
                    secondary="Standard change request approval flow"
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
        Automation & Rules
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Manage automation rules, business logic, and workflow templates
      </Typography>

      <Card>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Automation Rules" />
          <Tab label="Business Rules" />
          <Tab label="Macros & Templates" />
        </Tabs>
        <CardContent>
          {activeTab === 0 && renderAutomationRulesTab()}
          {activeTab === 1 && renderBusinessRulesTab()}
          {activeTab === 2 && renderMacrosTab()}
        </CardContent>
      </Card>

      {/* Rule Creation/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogTitle>{selectedRule ? 'Edit Rule' : 'Create New Rule'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Rule Name"
                defaultValue={selectedRule?.name || ''}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Rule Type</InputLabel>
                <Select value={selectedRule?.type || 'trigger'} label="Rule Type">
                  <MenuItem value="trigger">Trigger-based</MenuItem>
                  <MenuItem value="scheduled">Scheduled</MenuItem>
                  <MenuItem value="webhook">Webhook</MenuItem>
                  <MenuItem value="condition">Conditional</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                defaultValue={selectedRule?.description || ''}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Conditions
              </Typography>
              {/* Condition builder would go here */}
              <Alert severity="info">
                Advanced condition builder interface would be implemented here
              </Alert>
            </Grid>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Actions
              </Typography>
              {/* Action builder would go here */}
              <Alert severity="info">
                Advanced action builder interface would be implemented here
              </Alert>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleCloseDialog}>
            {selectedRule ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AutomationRulesPage;
