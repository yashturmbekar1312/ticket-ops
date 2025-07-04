import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  CheckBox,
  Edit,
  Person,
  Schedule,
  Flag,
  Category,
  Email,
  Merge,
  Archive,
  PlayArrow,
  Stop,
  Download,
  Check,
  Error,
  Info,
  Preview,
} from '@mui/icons-material';
import { useAuth } from '../hooks/auth';
import { useAppSelector } from '../hooks/redux';
import { Ticket } from '../types';

interface BulkOperation {
  id: string;
  name: string;
  description: string;
  type:
    | 'assign'
    | 'status_change'
    | 'priority_change'
    | 'category_change'
    | 'merge'
    | 'archive'
    | 'delete'
    | 'notify'
    | 'tag'
    | 'custom';
  targetField?: string;
  newValue?: any;
  conditions?: any[];
  isActive: boolean;
  createdAt: string;
  lastExecuted?: string;
  executionCount: number;
}

interface BulkExecutionJob {
  id: string;
  operationName: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  totalItems: number;
  processedItems: number;
  successCount: number;
  errorCount: number;
  startTime: string;
  endTime?: string;
  errors: string[];
  results: any[];
}

const BulkOperationManagementPage: React.FC = () => {
  const { user } = useAuth();
  const { tickets } = useAppSelector((state: any) => state.tickets);

  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [executionDialogOpen, setExecutionDialogOpen] = useState(false);

  const [bulkOperations] = useState<BulkOperation[]>([
    {
      id: '1',
      name: 'Auto-assign to IT Team',
      description: 'Automatically assign IT-related tickets to available IT agents',
      type: 'assign',
      targetField: 'assignedTo',
      newValue: 'auto-it-team',
      conditions: [
        { field: 'category', operator: 'in', value: ['Hardware', 'Software', 'Network'] },
      ],
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      lastExecuted: '2024-01-15T10:30:00Z',
      executionCount: 45,
    },
    {
      id: '2',
      name: 'Close Resolved Tickets',
      description: 'Automatically close tickets that have been resolved for more than 7 days',
      type: 'status_change',
      targetField: 'status',
      newValue: 'Closed',
      conditions: [
        { field: 'status', operator: 'equals', value: 'Resolved' },
        { field: 'resolvedAt', operator: 'older_than', value: '7d' },
      ],
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      lastExecuted: '2024-01-15T08:00:00Z',
      executionCount: 23,
    },
  ]);

  const [executionJobs, setExecutionJobs] = useState<BulkExecutionJob[]>([
    {
      id: '1',
      operationName: 'Bulk Status Update',
      status: 'completed',
      totalItems: 25,
      processedItems: 25,
      successCount: 23,
      errorCount: 2,
      startTime: '2024-01-15T10:00:00Z',
      endTime: '2024-01-15T10:02:30Z',
      errors: [
        'Failed to update ticket TKT-001: Permission denied',
        'Failed to update ticket TKT-015: Invalid status',
      ],
      results: [],
    },
    {
      id: '2',
      operationName: 'Bulk Assignment',
      status: 'running',
      totalItems: 50,
      processedItems: 32,
      successCount: 30,
      errorCount: 2,
      startTime: '2024-01-15T10:30:00Z',
      errors: [],
      results: [],
    },
  ]);

  const [bulkForm, setBulkForm] = useState({
    operation: '',
    targetValue: '',
    notifyUsers: false,
    addComment: false,
    comment: '',
    scheduleExecution: false,
    scheduledTime: '',
  });

  const [currentJob, setCurrentJob] = useState<BulkExecutionJob | null>(null);

  const handleSelectAllTickets = (checked: boolean) => {
    if (checked) {
      setSelectedTickets(tickets.map((ticket: Ticket) => ticket.id));
    } else {
      setSelectedTickets([]);
    }
  };

  const handleSelectTicket = (ticketId: string, checked: boolean) => {
    if (checked) {
      setSelectedTickets([...selectedTickets, ticketId]);
    } else {
      setSelectedTickets(selectedTickets.filter((id) => id !== ticketId));
    }
  };

  const handleBulkOperation = () => {
    if (selectedTickets.length === 0) {
      alert('Please select at least one ticket');
      return;
    }
    setBulkDialogOpen(true);
  };

  const handlePreviewOperation = () => {
    // Preview functionality can be implemented here
    console.log('Preview operation');
  };

  const handleExecuteOperation = () => {
    setBulkDialogOpen(false);
    setConfirmDialogOpen(true);
  };

  const handleConfirmExecution = () => {
    setConfirmDialogOpen(false);

    // Create new execution job
    const newJob: BulkExecutionJob = {
      id: Date.now().toString(),
      operationName: `Bulk ${bulkForm.operation}`,
      status: 'running',
      totalItems: selectedTickets.length,
      processedItems: 0,
      successCount: 0,
      errorCount: 0,
      startTime: new Date().toISOString(),
      errors: [],
      results: [],
    };

    setCurrentJob(newJob);
    setExecutionJobs([newJob, ...executionJobs]);
    setExecutionDialogOpen(true);

    // Simulate bulk operation execution
    simulateBulkExecution(newJob);
  };

  const simulateBulkExecution = async (job: BulkExecutionJob) => {
    const totalItems = job.totalItems;

    for (let i = 0; i < totalItems; i++) {
      await new Promise((resolve) => setTimeout(resolve, 200)); // Simulate processing time

      // Simulate success/failure
      const isSuccess = Math.random() > 0.1; // 90% success rate

      const updatedJob = {
        ...job,
        processedItems: i + 1,
        successCount: job.successCount + (isSuccess ? 1 : 0),
        errorCount: job.errorCount + (isSuccess ? 0 : 1),
        errors: isSuccess ? job.errors : [...job.errors, `Failed to process item ${i + 1}`],
      };

      if (i === totalItems - 1) {
        updatedJob.status = 'completed';
        updatedJob.endTime = new Date().toISOString();
      }

      setCurrentJob(updatedJob);
      setExecutionJobs((prev) => prev.map((j) => (j.id === job.id ? updatedJob : j)));
    }
  };

  const getOperationOptions = () => [
    { value: 'assign', label: 'Assign to Agent', icon: <Person /> },
    { value: 'status', label: 'Change Status', icon: <Schedule /> },
    { value: 'priority', label: 'Change Priority', icon: <Flag /> },
    { value: 'category', label: 'Change Category', icon: <Category /> },
    { value: 'merge', label: 'Merge Tickets', icon: <Merge /> },
    { value: 'archive', label: 'Archive Tickets', icon: <Archive /> },
    { value: 'notify', label: 'Send Notification', icon: <Email /> },
    { value: 'tag', label: 'Add Tags', icon: <Info /> },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'running':
        return 'warning';
      case 'failed':
        return 'error';
      case 'cancelled':
        return 'default';
      default:
        return 'info';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check />;
      case 'running':
        return <PlayArrow />;
      case 'failed':
        return <Error />;
      case 'cancelled':
        return <Stop />;
      default:
        return <Info />;
    }
  };

  // Check if user has permission for bulk operations
  if (user?.role !== 'Admin' && user?.role !== 'IT Admin' && user?.role !== 'Team Lead') {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          You don't have permission to perform bulk operations. Please contact your administrator.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Bulk Operations Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Download />}
            disabled={selectedTickets.length === 0}
          >
            Export Selected
          </Button>
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={handleBulkOperation}
            disabled={selectedTickets.length === 0}
          >
            Bulk Action ({selectedTickets.length})
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Selection Summary */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography variant="h6">Ticket Selection</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setSelectedTickets([])}
                    disabled={selectedTickets.length === 0}
                  >
                    Clear Selection
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleSelectAllTickets(true)}
                  >
                    Select All
                  </Button>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Chip
                  label={`${selectedTickets.length} tickets selected`}
                  color="primary"
                  icon={<CheckBox />}
                />
                <Chip
                  label={`${tickets.length - selectedTickets.length} tickets available`}
                  variant="outlined"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Tickets Table */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Available Tickets
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedTickets.length === tickets.length}
                          indeterminate={
                            selectedTickets.length > 0 && selectedTickets.length < tickets.length
                          }
                          onChange={(e) => handleSelectAllTickets(e.target.checked)}
                        />
                      </TableCell>
                      <TableCell>Ticket</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Priority</TableCell>
                      <TableCell>Assigned To</TableCell>
                      <TableCell>Category</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tickets.slice(0, 10).map((ticket: Ticket) => (
                      <TableRow key={ticket.id} hover>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedTickets.includes(ticket.id)}
                            onChange={(e) => handleSelectTicket(ticket.id, e.target.checked)}
                          />
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="subtitle2">{ticket.title}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {ticket.ticketNumber}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip label={ticket.status} size="small" />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={ticket.priority}
                            size="small"
                            color={
                              ticket.priority === 'Critical'
                                ? 'error'
                                : ticket.priority === 'High'
                                  ? 'warning'
                                  : ticket.priority === 'Medium'
                                    ? 'info'
                                    : 'default'
                            }
                          />
                        </TableCell>
                        <TableCell>{ticket.assignedToName || 'Unassigned'}</TableCell>
                        <TableCell>{ticket.category}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Execution History */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Execution History
              </Typography>
              <List>
                {executionJobs.map((job) => (
                  <React.Fragment key={job.id}>
                    <ListItem>
                      <ListItemIcon>{getStatusIcon(job.status)}</ListItemIcon>
                      <ListItemText
                        primary={job.operationName}
                        secondary={
                          <Box>
                            <Typography variant="caption" display="block">
                              {job.processedItems}/{job.totalItems} processed
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(job.startTime).toLocaleString()}
                            </Typography>
                          </Box>
                        }
                      />
                      <Chip label={job.status} color={getStatusColor(job.status)} size="small" />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Saved Operations */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Saved Bulk Operations
              </Typography>
              <Grid container spacing={2}>
                {bulkOperations.map((operation) => (
                  <Grid item xs={12} md={6} lg={4} key={operation.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="subtitle1">{operation.name}</Typography>
                          <Switch checked={operation.isActive} size="small" />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {operation.description}
                        </Typography>
                        <Box
                          sx={{ display: 'flex', justify: 'space-between', alignItems: 'center' }}
                        >
                          <Box>
                            <Typography variant="caption" display="block">
                              Executed: {operation.executionCount} times
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Last:{' '}
                              {operation.lastExecuted
                                ? new Date(operation.lastExecuted).toLocaleDateString()
                                : 'Never'}
                            </Typography>
                          </Box>
                          <Box>
                            <IconButton size="small">
                              <Edit />
                            </IconButton>
                            <IconButton size="small">
                              <PlayArrow />
                            </IconButton>
                          </Box>
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

      {/* Bulk Operation Dialog */}
      <Dialog
        open={bulkDialogOpen}
        onClose={() => setBulkDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Bulk Operation</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Alert severity="info">
              You have selected {selectedTickets.length} tickets for bulk operation.
            </Alert>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Operation Type</InputLabel>
                <Select
                  value={bulkForm.operation}
                  onChange={(e) => setBulkForm({ ...bulkForm, operation: e.target.value })}
                  label="Operation Type"
                >
                  {getOperationOptions().map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {option.icon}
                        {option.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {bulkForm.operation && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Target Value"
                  value={bulkForm.targetValue}
                  onChange={(e) => setBulkForm({ ...bulkForm, targetValue: e.target.value })}
                  helperText="The new value to apply to selected tickets"
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={bulkForm.addComment}
                    onChange={(e) => setBulkForm({ ...bulkForm, addComment: e.target.checked })}
                  />
                }
                label="Add comment to tickets"
              />
            </Grid>

            {bulkForm.addComment && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Comment"
                  value={bulkForm.comment}
                  onChange={(e) => setBulkForm({ ...bulkForm, comment: e.target.value })}
                  placeholder="Enter a comment to add to all affected tickets..."
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={bulkForm.notifyUsers}
                    onChange={(e) => setBulkForm({ ...bulkForm, notifyUsers: e.target.checked })}
                  />
                }
                label="Notify affected users"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkDialogOpen(false)}>Cancel</Button>
          <Button onClick={handlePreviewOperation} startIcon={<Preview />}>
            Preview
          </Button>
          <Button variant="contained" onClick={handleExecuteOperation} startIcon={<PlayArrow />}>
            Execute
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>Confirm Bulk Operation</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="h6">Are you sure?</Typography>
            <Typography>
              This action will affect {selectedTickets.length} tickets and cannot be undone.
            </Typography>
          </Alert>
          <Typography variant="body2">
            <strong>Operation:</strong> {bulkForm.operation}
          </Typography>
          <Typography variant="body2">
            <strong>Target Value:</strong> {bulkForm.targetValue}
          </Typography>
          {bulkForm.notifyUsers && (
            <Typography variant="body2">
              <strong>Notifications:</strong> Users will be notified of changes
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="warning" onClick={handleConfirmExecution}>
            Confirm & Execute
          </Button>
        </DialogActions>
      </Dialog>

      {/* Execution Progress Dialog */}
      <Dialog
        open={executionDialogOpen}
        onClose={() => setExecutionDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Bulk Operation Progress</DialogTitle>
        <DialogContent>
          {currentJob && (
            <Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6">{currentJob.operationName}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Processing {currentJob.totalItems} tickets...
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <LinearProgress
                  variant="determinate"
                  value={(currentJob.processedItems / currentJob.totalItems) * 100}
                  sx={{ height: 8, borderRadius: 4 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="body2">
                    {currentJob.processedItems} / {currentJob.totalItems} processed
                  </Typography>
                  <Typography variant="body2">
                    {((currentJob.processedItems / currentJob.totalItems) * 100).toFixed(0)}%
                  </Typography>
                </Box>
              </Box>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="success.main">
                      {currentJob.successCount}
                    </Typography>
                    <Typography variant="body2">Successful</Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="error.main">
                      {currentJob.errorCount}
                    </Typography>
                    <Typography variant="body2">Errors</Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="info.main">
                      {currentJob.totalItems - currentJob.processedItems}
                    </Typography>
                    <Typography variant="body2">Remaining</Typography>
                  </Box>
                </Grid>
              </Grid>

              {currentJob.errors.length > 0 && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Errors ({currentJob.errors.length})
                  </Typography>
                  <List>
                    {currentJob.errors.slice(0, 5).map((error, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <Error color="error" />
                        </ListItemIcon>
                        <ListItemText primary={error} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {currentJob?.status === 'running' && (
            <Button startIcon={<Stop />} color="error">
              Cancel Operation
            </Button>
          )}
          <Button onClick={() => setExecutionDialogOpen(false)}>
            {currentJob?.status === 'completed' ? 'Close' : 'Hide'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BulkOperationManagementPage;
