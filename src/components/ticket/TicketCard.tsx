import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
} from '@mui/material';
import { MoreVert, Person, Schedule } from '@mui/icons-material';
import { Ticket } from '../../types';
import { getStatusColor, getPriorityColor } from '../../utils/permissions';
import { formatDistanceToNow } from 'date-fns';

interface TicketCardProps {
  ticket: Ticket;
  onClick: (ticket: Ticket) => void;
  onEdit?: (ticket: Ticket) => void;
  onDelete?: (ticket: Ticket) => void;
  showActions?: boolean;
}

export const TicketCard: React.FC<TicketCardProps> = ({
  ticket,
  onClick,
  onEdit,
  onDelete,
  showActions = true,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(ticket);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(ticket);
    }
    handleMenuClose();
  };

  const handleCardClick = () => {
    onClick(ticket);
  };

  return (
    <Card
      sx={{
        cursor: 'pointer',
        '&:hover': {
          boxShadow: 3,
          transform: 'translateY(-2px)',
        },
        transition: 'all 0.2s',
        mb: 2,
      }}
      onClick={handleCardClick}
    >
      <CardContent>
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
              {ticket.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {ticket.description.length > 100
                ? `${ticket.description.substring(0, 100)}...`
                : ticket.description}
            </Typography>
          </Box>
          {showActions && (
            <IconButton size="small" onClick={handleMenuOpen} sx={{ ml: 1 }}>
              <MoreVert />
            </IconButton>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Chip
            label={ticket.status}
            size="small"
            sx={{
              backgroundColor: getStatusColor(ticket.status),
              color: 'white',
              fontWeight: 'bold',
            }}
          />
          <Chip
            label={ticket.priority}
            size="small"
            sx={{
              backgroundColor: getPriorityColor(ticket.priority),
              color: 'white',
              fontWeight: 'bold',
            }}
          />
          <Chip label={ticket.category} size="small" variant="outlined" />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Person sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {ticket.department}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
            </Typography>
          </Box>
        </Box>

        {ticket.tags.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 2 }}>
            {ticket.tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.7rem' }}
              />
            ))}
          </Box>
        )}
      </CardContent>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {onEdit && <MenuItem onClick={handleEdit}>Edit</MenuItem>}
        {onDelete && (
          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            Delete
          </MenuItem>
        )}
      </Menu>
    </Card>
  );
};
