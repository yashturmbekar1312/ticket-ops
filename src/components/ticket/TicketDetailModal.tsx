import React, { useState } from 'react';
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
} from '@mui/material';
import { Close, Send, Person, Schedule, Category, Assignment, Chat } from '@mui/icons-material';
import { Ticket, TicketComment, UserRole } from '../../types';
import { getStatusColor, getPriorityColor } from '../../utils/permissions';
import { formatDistanceToNow } from 'date-fns';

interface TicketDetailModalProps {
  ticket: Ticket | null;
  open: boolean;
  onClose: () => void;
  userRole?: UserRole;
  userId?: string;
}

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
}) => {
  const [newComment, setNewComment] = useState('');
  const [comments] = useState<TicketComment[]>(mockComments);

  const handleAddComment = () => {
    if (newComment.trim()) {
      // In production, this would make an API call
      console.log('Adding comment:', newComment);
      setNewComment('');
    }
  };

  const handleClose = () => {
    setNewComment('');
    onClose();
  };

  if (!ticket) return null;

  const ticketComments = comments.filter((comment) => comment.ticketId === ticket.id);

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
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
            {ticket.title}
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <Chip
              label={ticket.status}
              sx={{
                backgroundColor: getStatusColor(ticket.status),
                color: 'white',
                fontWeight: 'bold',
              }}
            />
            <Chip
              label={ticket.priority}
              sx={{
                backgroundColor: getPriorityColor(ticket.priority),
                color: 'white',
                fontWeight: 'bold',
              }}
            />
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
                    Assigned to: {ticket.assignedToName || 'Unassigned'}
                  </Typography>
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

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
            <TextField
              fullWidth
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              multiline
              maxRows={3}
              size="small"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAddComment();
                }
              }}
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
      </DialogContent>
    </Dialog>
  );
};

export default TicketDetailModal;
