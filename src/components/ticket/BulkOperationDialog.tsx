import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Alert,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  TextField,
  Autocomplete,
} from '@mui/material';
import {
  Edit,
  Person,
  Flag,
  CheckCircle,
  Assignment,
  Schedule,
  Category,
} from '@mui/icons-material';
import { Ticket, TicketStatus, TicketPriority, User } from '../../types';

interface BulkOperationProps {
  selectedTickets: Ticket[];
  users: User[];
  onBulkUpdate: (ticketIds: string[], updates: Partial<Ticket>) => void;
  onClose: () => void;
  open: boolean;
}

type BulkActionType =
  | 'assign'
  | 'change_status'
  | 'change_priority'
  | 'add_tags'
  | 'set_category'
  | 'set_due_date';

interface BulkAction {
  type: BulkActionType;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const bulkActions: BulkAction[] = [
  {
    type: 'assign',
    label: 'Assign Tickets',
    icon: <Person />,
    description: 'Assign selected tickets to a user',
  },
  {
    type: 'change_status',
    label: 'Change Status',
    icon: <CheckCircle />,
    description: 'Update the status of selected tickets',
  },
  {
    type: 'change_priority',
    label: 'Change Priority',
    icon: <Flag />,
    description: 'Update the priority of selected tickets',
  },
  {
    type: 'add_tags',
    label: 'Add Tags',
    icon: <Assignment />,
    description: 'Add tags to selected tickets',
  },
  {
    type: 'set_category',
    label: 'Set Category',
    icon: <Category />,
    description: 'Change category of selected tickets',
  },
  {
    type: 'set_due_date',
    label: 'Set Due Date',
    icon: <Schedule />,
    description: 'Set due date for selected tickets',
  },
];

const statusOptions: TicketStatus[] = [
  'New',
  'Open',
  'Assigned',
  'In Progress',
  'Resolved',
  'Closed',
  'Escalated',
  'Pending',
  'Cancelled',
];

const priorityOptions: TicketPriority[] = ['Low', 'Medium', 'High', 'Critical', 'Urgent'];

const categoryOptions = [
  'Hardware',
  'Software',
  'Network',
  'Access',
  'HR',
  'Security',
  'Maintenance',
  'Account',
  'Training',
  'Other',
];

const BulkOperationDialog: React.FC<BulkOperationProps> = ({
  selectedTickets,
  users,
  onBulkUpdate,
  onClose,
  open,
}) => {
  const [selectedAction, setSelectedAction] = useState<BulkActionType | ''>('');
  const [assigneeId, setAssigneeId] = useState<string>('');
  const [newStatus, setNewStatus] = useState<TicketStatus | ''>('');
  const [newPriority, setNewPriority] = useState<TicketPriority | ''>('');
  const [newCategory, setNewCategory] = useState<string>('');
  const [newTags, setNewTags] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleActionSelect = (action: BulkActionType) => {
    setSelectedAction(action);
    // Reset form values
    setAssigneeId('');
    setNewStatus('');
    setNewPriority('');
    setNewCategory('');
    setNewTags([]);
    setDueDate('');
  };

  const handleApplyChanges = async () => {
    if (!selectedAction) return;

    setIsProcessing(true);

    try {
      const ticketIds = selectedTickets.map((ticket) => ticket.id);
      let updates: Partial<Ticket> = {};

      switch (selectedAction) {
        case 'assign':
          if (assigneeId) {
            const assignee = users.find((u) => u.id === assigneeId);
            updates = {
              assignedTo: assigneeId,
              assignedToName: assignee?.name,
              status: 'Assigned',
            };
          }
          break;

        case 'change_status':
          if (newStatus) {
            updates = { status: newStatus };
          }
          break;

        case 'change_priority':
          if (newPriority) {
            updates = { priority: newPriority };
          }
          break;

        case 'add_tags':
          if (newTags.length > 0) {
            // Merge with existing tags
            updates = {
              tags: [...new Set([...(selectedTickets[0]?.tags || []), ...newTags])],
            };
          }
          break;

        case 'set_category':
          if (newCategory) {
            updates = { category: newCategory as any };
          }
          break;

        case 'set_due_date':
          if (dueDate) {
            updates = { dueDate };
          }
          break;
      }

      if (Object.keys(updates).length > 0) {
        await onBulkUpdate(ticketIds, updates);
        onClose();
      }
    } catch (error) {
      console.error('Bulk update failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderActionForm = () => {
    switch (selectedAction) {
      case 'assign':
        return (
          <FormControl fullWidth>
            <InputLabel>Assign To</InputLabel>
            <Select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              label="Assign To"
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography>{user.name}</Typography>
                    <Chip label={user.role} size="small" variant="outlined" />
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case 'change_status':
        return (
          <FormControl fullWidth>
            <InputLabel>New Status</InputLabel>
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as TicketStatus)}
              label="New Status"
            >
              {statusOptions.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case 'change_priority':
        return (
          <FormControl fullWidth>
            <InputLabel>New Priority</InputLabel>
            <Select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value as TicketPriority)}
              label="New Priority"
            >
              {priorityOptions.map((priority) => (
                <MenuItem key={priority} value={priority}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Flag
                      sx={{
                        color:
                          priority === 'Critical'
                            ? 'error.main'
                            : priority === 'High'
                              ? 'warning.main'
                              : priority === 'Medium'
                                ? 'info.main'
                                : 'success.main',
                      }}
                    />
                    {priority}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case 'add_tags':
        return (
          <Autocomplete
            multiple
            freeSolo
            value={newTags}
            onChange={(_event, newValue) => setNewTags(newValue)}
            options={[
              'urgent',
              'hardware',
              'software',
              'network',
              'access',
              'onboarding',
              'training',
              'security',
              'maintenance',
            ]}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip variant="outlined" label={option} {...getTagProps({ index })} key={option} />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Tags"
                placeholder="Add tags"
                helperText="Press Enter to add custom tags"
              />
            )}
          />
        );

      case 'set_category':
        return (
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              label="Category"
            >
              {categoryOptions.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case 'set_due_date':
        return (
          <TextField
            fullWidth
            type="date"
            label="Due Date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        );

      default:
        return null;
    }
  };

  const getActionSummary = () => {
    switch (selectedAction) {
      case 'assign':
        const assignee = users.find((u) => u.id === assigneeId);
        return assignee ? `Assign to ${assignee.name}` : '';

      case 'change_status':
        return newStatus ? `Change status to ${newStatus}` : '';

      case 'change_priority':
        return newPriority ? `Change priority to ${newPriority}` : '';

      case 'add_tags':
        return newTags.length > 0 ? `Add tags: ${newTags.join(', ')}` : '';

      case 'set_category':
        return newCategory ? `Change category to ${newCategory}` : '';

      case 'set_due_date':
        return dueDate ? `Set due date to ${dueDate}` : '';

      default:
        return '';
    }
  };

  const isFormValid = () => {
    switch (selectedAction) {
      case 'assign':
        return assigneeId !== '';
      case 'change_status':
        return newStatus !== '';
      case 'change_priority':
        return newPriority !== '';
      case 'add_tags':
        return newTags.length > 0;
      case 'set_category':
        return newCategory !== '';
      case 'set_due_date':
        return dueDate !== '';
      default:
        return false;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Edit />
          <Typography variant="h6">Bulk Operations</Typography>
          <Chip label={`${selectedTickets.length} tickets selected`} size="small" color="primary" />
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3}>
          {/* Action Selection */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Select Action
            </Typography>
            <List>
              {bulkActions.map((action) => (
                <ListItem
                  key={action.type}
                  button
                  selected={selectedAction === action.type}
                  onClick={() => handleActionSelect(action.type)}
                  sx={{
                    border: 1,
                    borderColor: selectedAction === action.type ? 'primary.main' : 'divider',
                    borderRadius: 1,
                    mb: 1,
                  }}
                >
                  <ListItemIcon>{action.icon}</ListItemIcon>
                  <ListItemText primary={action.label} secondary={action.description} />
                </ListItem>
              ))}
            </List>
          </Grid>

          {/* Action Form */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Configure Action
            </Typography>

            {!selectedAction && (
              <Alert severity="info">Select an action from the left to configure it.</Alert>
            )}

            {selectedAction && (
              <Box sx={{ mt: 2 }}>
                {renderActionForm()}

                {getActionSummary() && (
                  <Box sx={{ mt: 3 }}>
                    <Alert severity="info">
                      <Typography variant="body2">
                        <strong>Action Preview:</strong>
                        <br />
                        {getActionSummary()}
                      </Typography>
                    </Alert>
                  </Box>
                )}
              </Box>
            )}
          </Grid>

          {/* Selected Tickets Preview */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Selected Tickets ({selectedTickets.length})
            </Typography>
            <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
              {selectedTickets.slice(0, 5).map((ticket) => (
                <Box
                  key={ticket.id}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 1,
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    mb: 1,
                  }}
                >
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      {ticket.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {ticket.ticketNumber} • {ticket.status} • {ticket.priority}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip label={ticket.status} size="small" variant="outlined" />
                    <Chip label={ticket.priority} size="small" />
                  </Box>
                </Box>
              ))}
              {selectedTickets.length > 5 && (
                <Typography variant="caption" color="text.secondary">
                  ...and {selectedTickets.length - 5} more tickets
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isProcessing}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleApplyChanges}
          disabled={!isFormValid() || isProcessing}
        >
          {isProcessing ? 'Processing...' : `Apply to ${selectedTickets.length} tickets`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BulkOperationDialog;
