import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  Chip,
  Alert,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  LinearProgress,
} from '@mui/material';

// Simple Timeline components as placeholders
const Timeline: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>{children}</Box>
);

const TimelineItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>{children}</Box>
);

const TimelineDot: React.FC<{ color?: string; children?: React.ReactNode }> = ({
  color = 'primary',
  children,
}) => (
  <Box
    sx={{
      width: 24,
      height: 24,
      borderRadius: '50%',
      bgcolor:
        color === 'primary'
          ? 'primary.main'
          : color === 'success'
            ? 'success.main'
            : color === 'error'
              ? 'error.main'
              : 'warning.main',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: 12,
    }}
  >
    {children}
  </Box>
);

const TimelineContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box sx={{ flex: 1 }}>{children}</Box>
);

const TimelineSeparator: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>{children}</Box>
);

const TimelineConnector: React.FC = () => (
  <Box sx={{ width: 2, height: 20, bgcolor: 'divider', my: 1 }} />
);

const TimelineOppositeContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box sx={{ minWidth: 100, textAlign: 'right', pr: 2 }}>{children}</Box>
);
import {
  Add,
  Edit,
  Delete,
  PlayArrow,
  Visibility,
  Schedule,
  Event,
  CheckCircle,
  Error,
  Warning,
  Info,
  PlaylistPlay,
  Rule,
  Webhook,
  Speed,
} from '@mui/icons-material';
import { workflowService } from '../services/workflow';
import {
  WorkflowRule,
  WorkflowExecution,
  WorkflowTemplate,
  WorkflowMetrics,
} from '../types/workflow';

interface WorkflowManagementPageProps {}

const WorkflowManagementPage: React.FC<WorkflowManagementPageProps> = () => {
  const [tabValue, setTabValue] = useState(0);
  const [workflows, setWorkflows] = useState<WorkflowRule[]>([]);
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([]);
  const [metrics, setMetrics] = useState<WorkflowMetrics | null>(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowRule | null>(null);
  const [selectedExecution, setSelectedExecution] = useState<WorkflowExecution | null>(null);
  const [workflowDialogOpen, setWorkflowDialogOpen] = useState(false);
  const [executionDialogOpen, setExecutionDialogOpen] = useState(false);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<WorkflowTemplate | null>(null);

  useEffect(() => {
    loadWorkflowData();
  }, []);

  const loadWorkflowData = () => {
    setWorkflows(workflowService.getAllWorkflows());
    setExecutions(workflowService.getWorkflowExecutions());
    setTemplates(workflowService.getAllTemplates());
    setMetrics(workflowService.getWorkflowMetrics());
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCreateWorkflow = () => {
    setSelectedWorkflow(null);
    setWorkflowDialogOpen(true);
  };

  const handleEditWorkflow = (workflow: WorkflowRule) => {
    setSelectedWorkflow(workflow);
    setWorkflowDialogOpen(true);
  };

  const handleDeleteWorkflow = (workflowId: string) => {
    if (window.confirm('Are you sure you want to delete this workflow?')) {
      workflowService.deleteWorkflow(workflowId);
      loadWorkflowData();
    }
  };

  const handleExecuteWorkflow = async (workflowId: string) => {
    try {
      await workflowService.executeWorkflow(workflowId, { manual: true });
      loadWorkflowData();
    } catch (error) {
      console.error('Error executing workflow:', error);
    }
  };

  const handleToggleWorkflow = (workflowId: string, isActive: boolean) => {
    workflowService.updateWorkflow(workflowId, { isActive });
    loadWorkflowData();
  };

  const handleViewExecution = (execution: WorkflowExecution) => {
    setSelectedExecution(execution);
    setExecutionDialogOpen(true);
  };

  const handleUseTemplate = (template: WorkflowTemplate) => {
    setSelectedTemplate(template);
    setTemplateDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'running':
        return 'info';
      case 'failed':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'primary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle color="success" />;
      case 'running':
        return <PlayArrow color="info" />;
      case 'failed':
        return <Error color="error" />;
      case 'pending':
        return <Warning color="warning" />;
      default:
        return <Info />;
    }
  };

  const getTriggerIcon = (type: string) => {
    switch (type) {
      case 'event':
        return <Event />;
      case 'schedule':
        return <Schedule />;
      case 'manual':
        return <PlayArrow />;
      case 'webhook':
        return <Webhook />;
      default:
        return <Rule />;
    }
  };

  const WorkflowOverviewTab = () => (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Key Metrics */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rule color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Workflows</Typography>
              </Box>
              <Typography variant="h3" color="primary.main">
                {metrics?.totalWorkflows || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {metrics?.activeWorkflows || 0} active
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PlaylistPlay color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Executions</Typography>
              </Box>
              <Typography variant="h3" color="success.main">
                {metrics?.totalExecutions || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {metrics?.successfulExecutions || 0} successful
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Speed color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6">Avg. Execution Time</Typography>
              </Box>
              <Typography variant="h3" color="warning.main">
                {Math.round((metrics?.averageExecutionTime || 0) / 1000)}s
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Average duration
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Error color="error" sx={{ mr: 1 }} />
                <Typography variant="h6">Failed Executions</Typography>
              </Box>
              <Typography variant="h3" color="error.main">
                {metrics?.failedExecutions || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Need attention
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Execution Status Distribution */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Execution Status Distribution
              </Typography>
              {metrics?.executionsByStatus &&
                Object.entries(metrics.executionsByStatus).map(([status, count]) => (
                  <Box key={status} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {getStatusIcon(status)}
                        <Typography variant="body2" sx={{ ml: 1, textTransform: 'capitalize' }}>
                          {status}
                        </Typography>
                      </Box>
                      <Typography variant="body2" fontWeight="bold">
                        {count}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(count / (metrics?.totalExecutions || 1)) * 100}
                      color={getStatusColor(status)}
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>
                ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Top Workflows */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Most Active Workflows
              </Typography>
              <List>
                {metrics?.topWorkflows?.slice(0, 5).map((workflow, index) => (
                  <ListItem key={workflow.workflowId} divider>
                    <ListItemIcon>
                      <Typography variant="h6" color="primary">
                        {index + 1}
                      </Typography>
                    </ListItemIcon>
                    <ListItemText
                      primary={workflow.workflowName}
                      secondary={`${workflow.executionCount} executions • ${workflow.successRate}% success rate`}
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
              <Typography variant="h6" gutterBottom>
                Recent Workflow Activity
              </Typography>
              <Alert severity="info">Real-time workflow activity tracking coming soon!</Alert>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const WorkflowsTab = () => (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Workflows</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleCreateWorkflow}>
          Create Workflow
        </Button>
      </Box>

      <Grid container spacing={3}>
        {workflows.map((workflow) => (
          <Grid item xs={12} md={6} lg={4} key={workflow.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" noWrap>
                    {workflow.name}
                  </Typography>
                  <Box>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={workflow.isActive}
                          onChange={(e) => handleToggleWorkflow(workflow.id, e.target.checked)}
                          size="small"
                        />
                      }
                      label=""
                    />
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {workflow.description}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Chip
                    icon={getTriggerIcon(workflow.trigger.type)}
                    label={workflow.trigger.type}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Chip label={workflow.category} size="small" variant="outlined" />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2">Executions: {workflow.executionCount}</Typography>
                  <Typography variant="body2">Priority: {workflow.priority}</Typography>
                </Box>

                <Box
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Last executed:{' '}
                      {workflow.lastExecuted ? workflow.lastExecuted.toLocaleString() : 'Never'}
                    </Typography>
                  </Box>
                  <Box>
                    <Tooltip title="Execute">
                      <IconButton size="small" onClick={() => handleExecuteWorkflow(workflow.id)}>
                        <PlayArrow />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="View/Edit">
                      <IconButton size="small" onClick={() => handleEditWorkflow(workflow)}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" onClick={() => handleDeleteWorkflow(workflow.id)}>
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const ExecutionsTab = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Workflow Executions
      </Typography>

      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Workflow</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Triggered By</TableCell>
                  <TableCell>Start Time</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {executions.map((execution) => {
                  const workflow = workflows.find((w) => w.id === execution.workflowId);
                  return (
                    <TableRow key={execution.id}>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {workflow?.name || 'Unknown Workflow'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {execution.workflowId}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {getStatusIcon(execution.status)}
                          <Chip
                            label={execution.status}
                            size="small"
                            color={getStatusColor(execution.status)}
                            sx={{ ml: 1 }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{execution.triggeredBy}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {execution.startTime.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {execution.duration ? `${(execution.duration / 1000).toFixed(1)}s` : '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Tooltip title="View Details">
                          <IconButton size="small" onClick={() => handleViewExecution(execution)}>
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );

  const TemplatesTab = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Workflow Templates
      </Typography>

      <Grid container spacing={3}>
        {templates.map((template) => (
          <Grid item xs={12} md={6} lg={4} key={template.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">{template.name}</Typography>
                  {template.isBuiltIn && <Chip label="Built-in" size="small" variant="outlined" />}
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {template.description}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Chip label={template.category} size="small" color="primary" sx={{ mr: 1 }} />
                  <Chip label={`v${template.version}`} size="small" variant="outlined" />
                </Box>

                <Box sx={{ mb: 2 }}>
                  {template.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      variant="outlined"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
                </Box>

                <Box
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Typography variant="caption" color="text.secondary">
                    By {template.author}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleUseTemplate(template)}
                  >
                    Use Template
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Overview" />
          <Tab label="Workflows" />
          <Tab label="Executions" />
          <Tab label="Templates" />
          <Tab label="Automation" />
        </Tabs>
      </Box>

      {tabValue === 0 && <WorkflowOverviewTab />}
      {tabValue === 1 && <WorkflowsTab />}
      {tabValue === 2 && <ExecutionsTab />}
      {tabValue === 3 && <TemplatesTab />}
      {tabValue === 4 && (
        <Box sx={{ p: 3 }}>
          <Typography variant="h5">Automation Rules</Typography>
          <Alert severity="info" sx={{ mt: 2 }}>
            Advanced automation rules management coming soon!
          </Alert>
        </Box>
      )}

      {/* Workflow Dialog */}
      <Dialog
        open={workflowDialogOpen}
        onClose={() => setWorkflowDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{selectedWorkflow ? 'Edit Workflow' : 'Create New Workflow'}</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Workflow builder interface coming soon!
          </Alert>
          <TextField
            fullWidth
            label="Workflow Name"
            variant="outlined"
            margin="dense"
            defaultValue={selectedWorkflow?.name || ''}
          />
          <TextField
            fullWidth
            label="Description"
            variant="outlined"
            margin="dense"
            multiline
            rows={3}
            defaultValue={selectedWorkflow?.description || ''}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Category</InputLabel>
            <Select value={selectedWorkflow?.category || ''} label="Category">
              <MenuItem value="ticket_management">Ticket Management</MenuItem>
              <MenuItem value="sla_management">SLA Management</MenuItem>
              <MenuItem value="incident_response">Incident Response</MenuItem>
              <MenuItem value="reporting">Reporting</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWorkflowDialogOpen(false)}>Cancel</Button>
          <Button variant="contained">{selectedWorkflow ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>

      {/* Execution Dialog */}
      <Dialog
        open={executionDialogOpen}
        onClose={() => setExecutionDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Workflow Execution Details</DialogTitle>
        <DialogContent>
          {selectedExecution && (
            <Box>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Execution ID
                  </Typography>
                  <Typography variant="body1">{selectedExecution.id}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Status
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {getStatusIcon(selectedExecution.status)}
                    <Chip
                      label={selectedExecution.status}
                      size="small"
                      color={getStatusColor(selectedExecution.status)}
                      sx={{ ml: 1 }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Duration
                  </Typography>
                  <Typography variant="body1">
                    {selectedExecution.duration
                      ? `${(selectedExecution.duration / 1000).toFixed(1)}s`
                      : 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Triggered By
                  </Typography>
                  <Typography variant="body1">{selectedExecution.triggeredBy}</Typography>
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom>
                Execution Steps
              </Typography>
              <Timeline>
                {selectedExecution.steps.map((step, index) => (
                  <TimelineItem key={step.id}>
                    <TimelineOppositeContent>
                      <Typography variant="body2" color="text.secondary">
                        {step.startTime.toLocaleTimeString()}
                      </Typography>
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineDot color={getStatusColor(step.status)}>
                        {getStatusIcon(step.status)}
                      </TimelineDot>
                      {index < selectedExecution.steps.length - 1 && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography variant="body1">{step.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {step.duration ? `${(step.duration / 1000).toFixed(1)}s` : 'N/A'}
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExecutionDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Template Dialog */}
      <Dialog
        open={templateDialogOpen}
        onClose={() => setTemplateDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Use Template: {selectedTemplate?.name}</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Template configuration interface coming soon!
          </Alert>
          {selectedTemplate && (
            <Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedTemplate.description}
              </Typography>
              <Typography variant="h6" gutterBottom>
                Required Parameters
              </Typography>
              {selectedTemplate.parameters.map((param) => (
                <Box key={param.name} sx={{ mb: 2 }}>
                  <Typography variant="body2" fontWeight="bold">
                    {param.name} {param.required && '*'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {param.description}
                  </Typography>
                  {param.type === 'select' && param.options && (
                    <FormControl fullWidth margin="dense">
                      <Select size="small">
                        {param.options.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTemplateDialogOpen(false)}>Cancel</Button>
          <Button variant="contained">Create Workflow</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkflowManagementPage;
