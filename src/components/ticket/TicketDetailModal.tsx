import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Chip,
  Divider,
  TextField,
  Button,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Grid,
  Paper,
  Stack,
  Menu,
  MenuItem,
  ListItemSecondaryAction,
  Checkbox,
  DialogActions,
  Tooltip,
  FormControlLabel,
} from '@mui/material';
import {
  Close,
  Send,
  Person,
  Schedule,
  Category,
  Assignment,
  Chat,
  PersonAdd,
  PersonRemove,
  MoreVert,
  Edit,
  Update,
  Flag,
  CheckCircle,
  Cancel,
  PlayArrow,
  Pause,
  Stop,
} from '@mui/icons-material';
import { Ticket, TicketComment, UserRole, User, TicketStatus, TicketPriority } from '../../types';
import { getStatusColor, getPriorityColor, canEditTicket } from '../../utils/permissions';
import { formatDistanceToNow } from 'date-fns';
import { useAppDispatch } from '../../hooks/redux';
import { updateTicket } from '../../redux/ticketSlice';

interface TicketDetailModalProps {
  ticket: Ticket | null;
  open: boolean;
  onClose: () => void;
  userRole?: UserRole;
  userId?: string;
}

// Mock users for assignee selection
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@company.com',
    name: 'IT Admin',
    role: 'IT Admin',
    department: 'IT',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    avatar: '/avatars/admin.png',
  },
  {
    id: '2',
    email: 'manager@company.com',
    name: 'Team Manager',
    role: 'Manager',
    department: 'Engineering',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    avatar: '/avatars/manager.png',
  },
  {
    id: '3',
    email: 'hr@company.com',
    name: 'HR Specialist',
    role: 'HR',
    department: 'Human Resources',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    avatar: '/avatars/hr.png',
  },
  {
    id: '4',
    email: 'agent@company.com',
    name: 'IT Agent',
    role: 'IT Agent',
    department: 'IT',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    avatar: '/avatars/agent.png',
  },
  {
    id: '5',
    email: 'lead@company.com',
    name: 'Team Lead',
    role: 'Team Lead',
    department: 'IT',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    avatar: '/avatars/lead.png',
  },
];

// Mock comments data
const mockComments: TicketComment[] = [
  {
    id: 'c1',
    ticketId: 'TK-001',
    userId: 'agent1',
    userName: 'Alice Johnson',
    userRole: 'IT Agent',
    content:
      "I'm investigating the issue. Please try restarting your laptop and let me know if the problem persists.",
    createdAt: '2024-07-07T10:30:00Z',
    isInternal: false,
    isEdited: false,
  },
  {
    id: 'c2',
    ticketId: 'TK-001',
    userId: 'user1',
    userName: 'John Doe',
    userRole: 'Employee',
    content:
      'I tried restarting but the issue is still there. The laptop froze again after 30 minutes of use.',
    createdAt: '2024-07-07T11:15:00Z',
    isInternal: false,
    isEdited: false,
  },
  {
    id: 'c3',
    ticketId: 'TK-001',
    userId: 'agent1',
    userName: 'Alice Johnson',
    userRole: 'IT Agent',
    content:
      "I'll schedule a hardware diagnostic. Please bring your laptop to the IT office tomorrow at 2 PM.",
    createdAt: '2024-07-07T12:00:00Z',
    isInternal: false,
    isEdited: false,
  },
];

export const TicketDetailModal: React.FC<TicketDetailModalProps> = ({
  ticket,
  open,
  onClose,
  userRole,
  userId,
}) => {
  const dispatch = useAppDispatch();
  const [newComment, setNewComment] = useState('');
  const [isInternalComment, setIsInternalComment] = useState(false);
  const [comments] = useState<TicketComment[]>(mockComments);
  const [assigneeMenuAnchor, setAssigneeMenuAnchor] = useState<null | HTMLElement>(null);
  const [assigneeDialogOpen, setAssigneeDialogOpen] = useState(false);
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [statusMenuAnchor, setStatusMenuAnchor] = useState<null | HTMLElement>(null);
  const [priorityMenuAnchor, setPriorityMenuAnchor] = useState<null | HTMLElement>(null);

  // Set initial assignee selection
  useEffect(() => {
    if (ticket?.assignedTo) {
      setSelectedAssignees([ticket.assignedTo]);
    }
  }, [ticket?.assignedTo]);

  const handleAddComment = () => {
    if (newComment.trim()) {
      // In production, this would make an API call
      console.log('Adding comment:', newComment);
      setNewComment('');
      setIsInternalComment(false);
    }
  };

  const handleAssigneeChange = async (assigneeIds: string[]) => {
    if (!ticket?.id) return;

    try {
      const assignedTo = assigneeIds.length > 0 ? assigneeIds[0] : undefined;
      const assignedToName = assignedTo
        ? mockUsers.find((u) => u.id === assignedTo)?.name
        : undefined;

      await dispatch(
        updateTicket({
          id: ticket.id,
          updates: {
            assignedTo,
            assignedToName,
          },
        })
      ).unwrap();

      setSelectedAssignees(assigneeIds);
      setAssigneeDialogOpen(false);
    } catch (err) {
      console.error('Failed to update assignee:', err);
    }
  };

  const handleRemoveAssignee = async () => {
    if (!ticket?.id) return;

    try {
      await dispatch(
        updateTicket({
          id: ticket.id,
          updates: {
            assignedTo: undefined,
            assignedToName: undefined,
          },
        })
      ).unwrap();

      setSelectedAssignees([]);
      setAssigneeMenuAnchor(null);
    } catch (err) {
      console.error('Failed to remove assignee:', err);
    }
  };

  const handleStatusChange = async (newStatus: TicketStatus) => {
    if (!ticket?.id) return;

    try {
      await dispatch(
        updateTicket({
          id: ticket.id,
          updates: {
            status: newStatus,
          },
        })
      ).unwrap();
      setStatusMenuAnchor(null);
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handlePriorityChange = async (newPriority: TicketPriority) => {
    if (!ticket?.id) return;

    try {
      await dispatch(
        updateTicket({
          id: ticket.id,
          updates: {
            priority: newPriority,
          },
        })
      ).unwrap();
      setPriorityMenuAnchor(null);
    } catch (err) {
      console.error('Failed to update priority:', err);
    }
  };

  const handleClose = () => {
    setNewComment('');
    setIsInternalComment(false);
    setAssigneeMenuAnchor(null);
    setAssigneeDialogOpen(false);
    setStatusMenuAnchor(null);
    setPriorityMenuAnchor(null);
    onClose();
  };

  if (!ticket) return null;

  const ticketComments = comments.filter((comment) => comment.ticketId === ticket.id);
  const canEdit = userRole && userId ? canEditTicket(userRole, ticket, userId) : false;

  const getStatusIcon = (status: TicketStatus) => {
    switch (status) {
      case 'Open':
      case 'New':
        return <PlayArrow />;
      case 'In Progress':
        return <Update />;
      case 'Resolved':
        return <CheckCircle />;
      case 'Closed':
        return <Stop />;
      case 'Pending':
        return <Pause />;
      case 'Cancelled':
        return <Cancel />;
      default:
        return <Assignment />;
    }
  };

  const statusOptions: TicketStatus[] = ['Open', 'In Progress', 'Pending', 'Resolved', 'Closed'];
  const priorityOptions: TicketPriority[] = ['Low', 'Medium', 'High', 'Critical', 'Urgent'];

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { maxHeight: '90vh' },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" component="span">
              {ticket.ticketNumber}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              Created {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {canEdit && (
              <Tooltip title="Edit Ticket">
                <IconButton size="small">
                  <Edit />
                </IconButton>
              </Tooltip>
            )}
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
            {ticket.title}
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Chip
                label={ticket.status}
                icon={getStatusIcon(ticket.status)}
                sx={{
                  backgroundColor: getStatusColor(ticket.status),
                  color: 'white',
                  fontWeight: 'bold',
                }}
                onClick={canEdit ? (e) => setStatusMenuAnchor(e.currentTarget) : undefined}
                clickable={canEdit}
              />
              {canEdit && (
                <Tooltip title="Change Status">
                  <IconButton size="small" onClick={(e) => setStatusMenuAnchor(e.currentTarget)}>
                    <Update />
                  </IconButton>
                </Tooltip>
              )}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Chip
                label={ticket.priority}
                icon={<Flag />}
                sx={{
                  backgroundColor: getPriorityColor(ticket.priority),
                  color: 'white',
                  fontWeight: 'bold',
                }}
                onClick={canEdit ? (e) => setPriorityMenuAnchor(e.currentTarget) : undefined}
                clickable={canEdit}
              />
              {canEdit && (
                <Tooltip title="Change Priority">
                  <IconButton size="small" onClick={(e) => setPriorityMenuAnchor(e.currentTarget)}>
                    <Flag />
                  </IconButton>
                </Tooltip>
              )}
            </Box>

            <Chip label={ticket.category} variant="outlined" />
          </Stack>

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
            {ticket.description}
          </Typography>

          <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Person sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                  <Typography variant="body2" color="text.secondary">
                    Created by: {ticket.createdByName}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Assignment sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                  <Typography variant="body2" color="text.secondary">
                    Assigned to:
                  </Typography>
                  {ticket.assignedTo && ticket.assignedToName ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
                      <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main' }}>
                        {ticket.assignedToName.charAt(0)}
                      </Avatar>
                      <Typography variant="body2">{ticket.assignedToName}</Typography>
                      {canEdit && (
                        <IconButton
                          size="small"
                          onClick={(e) => setAssigneeMenuAnchor(e.currentTarget)}
                        >
                          <MoreVert />
                        </IconButton>
                      )}
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Unassigned
                      </Typography>
                      {canEdit && (
                        <Tooltip title="Assign ticket">
                          <IconButton size="small" onClick={() => setAssigneeDialogOpen(true)}>
                            <PersonAdd />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Category sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                  <Typography variant="body2" color="text.secondary">
                    Department: {ticket.department}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Schedule sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                  <Typography variant="body2" color="text.secondary">
                    Last updated:{' '}
                    {formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true })}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {ticket.tags && ticket.tags.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Tags:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {ticket.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.7rem' }}
                  />
                ))}
              </Stack>
            </Box>
          )}

          {/* Quick Actions for Authorized Users */}
          {canEdit && (
            <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: 'action.hover' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Quick Actions:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<PersonAdd />}
                  onClick={() => setAssigneeDialogOpen(true)}
                >
                  {ticket.assignedTo ? 'Change Assignee' : 'Assign Ticket'}
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Update />}
                  onClick={(e) => setStatusMenuAnchor(e.currentTarget)}
                >
                  Update Status
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Flag />}
                  onClick={(e) => setPriorityMenuAnchor(e.currentTarget)}
                >
                  Change Priority
                </Button>
                <Button size="small" variant="outlined" startIcon={<Edit />}>
                  Edit Details
                </Button>
              </Stack>
            </Paper>
          )}
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <Chat sx={{ mr: 1 }} />
            Comments ({ticketComments.length})
          </Typography>

          <Box sx={{ maxHeight: 300, overflowY: 'auto', mb: 3 }}>
            {ticketComments.length === 0 ? (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: 'center', py: 3 }}
              >
                No comments yet. Be the first to comment!
              </Typography>
            ) : (
              <List>
                {ticketComments.map((comment) => (
                  <ListItem key={comment.id} alignItems="flex-start" sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar
                        sx={{ bgcolor: comment.userRole === 'IT Agent' ? '#1976d2' : '#9e9e9e' }}
                      >
                        {comment.userName.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {comment.userName}
                          </Typography>
                          <Chip
                            label={comment.userRole}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem' }}
                          />
                          {comment.isInternal && (
                            <Chip
                              label="Internal"
                              size="small"
                              color="warning"
                              variant="outlined"
                              sx={{ fontSize: '0.7rem' }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" sx={{ mt: 1, mb: 0.5 }}>
                            {comment.content}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>

          <Box>
            <TextField
              fullWidth
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              multiline
              maxRows={3}
              size="small"
              sx={{ mb: 2 }}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAddComment();
                }
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isInternalComment}
                    onChange={(e) => setIsInternalComment(e.target.checked)}
                  />
                }
                label="Internal comment (only visible to staff)"
              />
              <Button
                variant="contained"
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                startIcon={<Send />}
                sx={{ minWidth: 'auto', px: 2 }}
              >
                Send
              </Button>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      {/* Status Menu */}
      <Menu
        anchorEl={statusMenuAnchor}
        open={Boolean(statusMenuAnchor)}
        onClose={() => setStatusMenuAnchor(null)}
      >
        {statusOptions.map((status) => (
          <MenuItem
            key={status}
            onClick={() => handleStatusChange(status)}
            selected={ticket.status === status}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {getStatusIcon(status)}
              {status}
            </Box>
          </MenuItem>
        ))}
      </Menu>

      {/* Priority Menu */}
      <Menu
        anchorEl={priorityMenuAnchor}
        open={Boolean(priorityMenuAnchor)}
        onClose={() => setPriorityMenuAnchor(null)}
      >
        {priorityOptions.map((priority) => (
          <MenuItem
            key={priority}
            onClick={() => handlePriorityChange(priority)}
            selected={ticket.priority === priority}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Flag sx={{ color: getPriorityColor(priority) }} />
              {priority}
            </Box>
          </MenuItem>
        ))}
      </Menu>

      {/* Assignee Menu */}
      <Menu
        anchorEl={assigneeMenuAnchor}
        open={Boolean(assigneeMenuAnchor)}
        onClose={() => setAssigneeMenuAnchor(null)}
      >
        <MenuItem
          onClick={() => {
            setAssigneeDialogOpen(true);
            setAssigneeMenuAnchor(null);
          }}
        >
          <PersonAdd sx={{ mr: 1 }} />
          Change Assignee
        </MenuItem>
        <MenuItem onClick={handleRemoveAssignee}>
          <PersonRemove sx={{ mr: 1 }} />
          Remove Assignee
        </MenuItem>
      </Menu>

      {/* Assignee Dialog */}
      <Dialog
        open={assigneeDialogOpen}
        onClose={() => setAssigneeDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{ticket.assignedTo ? 'Change Assignee' : 'Assign Ticket'}</DialogTitle>
        <DialogContent>
          <List>
            {mockUsers.map((user) => (
              <ListItem
                key={user.id}
                button
                onClick={() => {
                  handleAssigneeChange([user.id]);
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>{user.name.charAt(0)}</Avatar>
                </ListItemAvatar>
                <ListItemText primary={user.name} secondary={`${user.role} • ${user.department}`} />
                <ListItemSecondaryAction>
                  <Checkbox
                    checked={selectedAssignees.includes(user.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedAssignees([user.id]);
                      } else {
                        setSelectedAssignees([]);
                      }
                    }}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssigneeDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => handleAssigneeChange(selectedAssignees)}
            variant="contained"
            disabled={selectedAssignees.length === 0}
          >
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default TicketDetailModal;
