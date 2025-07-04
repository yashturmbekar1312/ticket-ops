import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Divider,
  TextField,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
  FormControlLabel,
  Tooltip,
  Stack,
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  PersonAdd,
  PersonRemove,
  Comment as CommentIcon,
  Assignment,
  Send,
  MoreVert,
  Update,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { useAuth } from '../hooks/auth';
import { fetchTicket, updateTicket } from '../redux/ticketSlice';
import { formatDistanceToNow } from 'date-fns';
import { getStatusColor, getPriorityColor, canEditTicket } from '../utils/permissions';
import { ticketService } from '../services/ticket';
import { Comment as TicketComment, User, TicketStatus } from '../types';

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
    id: '5',
    email: 'agent@company.com',
    name: 'IT Agent',
    role: 'IT Agent',
    department: 'IT',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    avatar: '/avatars/agent.png',
  },
];

export const ViewTicketPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { currentTicket, isLoading, error } = useAppSelector((state) => state.tickets);

  // Local state
  const [comments, setComments] = useState<TicketComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isInternalComment, setIsInternalComment] = useState(false);
  const [assigneeMenuAnchor, setAssigneeMenuAnchor] = useState<null | HTMLElement>(null);
  const [assigneeDialogOpen, setAssigneeDialogOpen] = useState(false);
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);

  // Fetch ticket data
  useEffect(() => {
    if (id) {
      dispatch(fetchTicket(id));
    }
  }, [dispatch, id]);

  // Fetch comments
  useEffect(() => {
    if (currentTicket?.id) {
      const loadComments = async () => {
        setLoadingComments(true);
        try {
          const ticketComments = await ticketService.getComments(currentTicket.id);
          setComments(ticketComments);
        } catch (err) {
          console.error('Failed to load comments:', err);
          setCommentError('Failed to load comments');
        } finally {
          setLoadingComments(false);
        }
      };
      loadComments();
    }
  }, [currentTicket?.id]);

  // Initialize selected assignees
  useEffect(() => {
    if (currentTicket?.assignedTo) {
      setSelectedAssignees([currentTicket.assignedTo]);
    }
  }, [currentTicket?.assignedTo]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !currentTicket?.id || !user) return;

    setIsSubmittingComment(true);
    setCommentError(null);

    try {
      const comment: TicketComment = {
        id: Date.now().toString(),
        ticketId: currentTicket.id,
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        content: newComment.trim(),
        createdAt: new Date().toISOString(),
        isInternal: isInternalComment,
        isEdited: false,
      };

      await ticketService.addComment(currentTicket.id, {
        content: newComment.trim(),
        isInternal: isInternalComment,
      });

      setComments([...comments, comment]);
      setNewComment('');
      setIsInternalComment(false);
    } catch (error) {
      console.error('Failed to add comment:', error);
      setCommentError('Failed to add comment');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleAssigneeChange = async (assigneeIds: string[]) => {
    if (!currentTicket?.id) return;

    try {
      const assignedTo = assigneeIds.length > 0 ? assigneeIds[0] : undefined;
      const assignedToName = assignedTo
        ? mockUsers.find((u) => u.id === assignedTo)?.name
        : undefined;

      await dispatch(
        updateTicket({
          id: currentTicket.id,
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
    if (!currentTicket?.id) return;

    try {
      await dispatch(
        updateTicket({
          id: currentTicket.id,
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

  const handleStatusChange = async (newStatus: string) => {
    if (!currentTicket?.id) return;

    try {
      await dispatch(
        updateTicket({
          id: currentTicket.id,
          updates: {
            status: newStatus as TicketStatus,
          },
        })
      ).unwrap();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const canEdit = user && currentTicket ? canEditTicket(user.role, currentTicket, user.id) : false;

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => navigate('/tickets')}>
          Back to Tickets
        </Button>
      </Box>
    );
  }

  if (!currentTicket) {
    return (
      <Box>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Ticket not found
        </Alert>
        <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => navigate('/tickets')}>
          Back to Tickets
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/tickets')} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" component="h1">
          {currentTicket.title}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          {/* Ticket Details */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                mb: 2,
              }}
            >
              <Box>
                <Typography variant="h5" gutterBottom>
                  {currentTicket.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Ticket #{currentTicket.ticketNumber} • Created by {currentTicket.createdByName}
                </Typography>
              </Box>
              {canEdit && (
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={() => navigate(`/tickets/${currentTicket.id}/edit`)}
                >
                  Edit
                </Button>
              )}
            </Box>

            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
              <Chip
                label={currentTicket.status}
                sx={{
                  backgroundColor: getStatusColor(currentTicket.status),
                  color: 'white',
                  fontWeight: 'bold',
                }}
              />
              <Chip
                label={currentTicket.priority}
                sx={{
                  backgroundColor: getPriorityColor(currentTicket.priority),
                  color: 'white',
                  fontWeight: 'bold',
                }}
              />
              <Chip label={currentTicket.category} variant="outlined" />
            </Box>

            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
              {currentTicket.description}
            </Typography>

            {currentTicket.tags.length > 0 && (
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {currentTicket.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    size="small"
                    variant="outlined"
                    icon={<Assignment />}
                  />
                ))}
              </Box>
            )}
          </Paper>

          {/* Comments Section */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <CommentIcon sx={{ mr: 1 }} />
              Comments ({comments.length})
            </Typography>

            {loadingComments ? (
              <Box display="flex" justifyContent="center" py={2}>
                <CircularProgress size={24} />
              </Box>
            ) : (
              <Box>
                {comments.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                    No comments yet. Be the first to add one!
                  </Typography>
                ) : (
                  <List>
                    {comments.map((comment) => (
                      <ListItem key={comment.id} alignItems="flex-start" sx={{ px: 0 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {comment.userName.charAt(0)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="subtitle2">{comment.userName}</Typography>
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
                              <Typography variant="caption" color="text.secondary">
                                {formatDistanceToNow(new Date(comment.createdAt), {
                                  addSuffix: true,
                                })}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              {comment.content}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                )}

                <Divider sx={{ my: 2 }} />

                {/* Add Comment Form */}
                <Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
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
                      startIcon={<Send />}
                      onClick={handleAddComment}
                      disabled={!newComment.trim() || isSubmittingComment}
                    >
                      {isSubmittingComment ? 'Adding...' : 'Add Comment'}
                    </Button>
                  </Box>
                  {commentError && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                      {commentError}
                    </Alert>
                  )}
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Ticket Info */}
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Ticket Details
            </Typography>
            <Stack spacing={2}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Status
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    label={currentTicket.status}
                    sx={{
                      backgroundColor: getStatusColor(currentTicket.status),
                      color: 'white',
                      fontWeight: 'bold',
                    }}
                  />
                  {canEdit && (
                    <IconButton
                      size="small"
                      onClick={() => {
                        // Quick status update options
                        const nextStatus =
                          currentTicket.status === 'Open' ? 'In Progress' : 'Resolved';
                        handleStatusChange(nextStatus);
                      }}
                    >
                      <Update />
                    </IconButton>
                  )}
                </Box>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Priority
                </Typography>
                <Chip
                  label={currentTicket.priority}
                  sx={{
                    backgroundColor: getPriorityColor(currentTicket.priority),
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                />
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Category
                </Typography>
                <Chip label={currentTicket.category} variant="outlined" />
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Created
                </Typography>
                <Typography variant="body2">
                  {formatDistanceToNow(new Date(currentTicket.createdAt), { addSuffix: true })}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Last Updated
                </Typography>
                <Typography variant="body2">
                  {formatDistanceToNow(new Date(currentTicket.updatedAt), { addSuffix: true })}
                </Typography>
              </Box>
            </Stack>
          </Paper>

          {/* Assignee Management */}
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Assignee
            </Typography>
            {currentTicket.assignedTo && currentTicket.assignedToName ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                  {currentTicket.assignedToName.charAt(0)}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2">{currentTicket.assignedToName}</Typography>
                </Box>
                {canEdit && (
                  <IconButton size="small" onClick={(e) => setAssigneeMenuAnchor(e.currentTarget)}>
                    <MoreVert />
                  </IconButton>
                )}
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
          </Paper>

          {/* Quick Actions */}
          {canEdit && (
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Stack spacing={1}>
                <Button
                  variant="outlined"
                  startIcon={<PersonAdd />}
                  onClick={() => setAssigneeDialogOpen(true)}
                  fullWidth
                >
                  {currentTicket.assignedTo ? 'Change Assignee' : 'Assign Ticket'}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={() => navigate(`/tickets/${currentTicket.id}/edit`)}
                  fullWidth
                >
                  Edit Ticket
                </Button>
              </Stack>
            </Paper>
          )}
        </Grid>
      </Grid>

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
        <DialogTitle>{currentTicket.assignedTo ? 'Change Assignee' : 'Assign Ticket'}</DialogTitle>
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
    </Box>
  );
};

export default ViewTicketPage;
