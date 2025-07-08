import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
} from '@mui/material';
import { Visibility, Edit } from '@mui/icons-material';
import { Ticket } from '../../../types';
import './RecentTickets.css';

interface RecentTicketsProps {
  tickets: Ticket[];
}

const RecentTickets: React.FC<RecentTicketsProps> = ({ tickets }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return '#ff9800';
      case 'In Progress':
        return '#2196f3';
      case 'Resolved':
        return '#4caf50';
      case 'Closed':
        return '#9e9e9e';
      case 'Escalated':
        return '#f44336';
      default:
        return '#757575';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return '#d32f2f';
      case 'High':
        return '#f57c00';
      case 'Medium':
        return '#1976d2';
      case 'Low':
        return '#388e3c';
      default:
        return '#757575';
    }
  };

  return (
    <Card className="recent-tickets-card">
      <CardContent className="recent-tickets-content">
        <Box className="recent-tickets-header">
          <Typography variant="h6" className="recent-tickets-title">
            Recent Tickets
          </Typography>
          <Button variant="outlined" size="small" className="recent-tickets-view-all">
            View All
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className="recent-tickets-table-header">Ticket ID</TableCell>
                <TableCell className="recent-tickets-table-header">Title</TableCell>
                <TableCell className="recent-tickets-table-header">Priority</TableCell>
                <TableCell className="recent-tickets-table-header">Status</TableCell>
                <TableCell className="recent-tickets-table-header">Assigned To</TableCell>
                <TableCell className="recent-tickets-table-header">Created</TableCell>
                <TableCell className="recent-tickets-table-header">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket.id} hover>
                  <TableCell>{ticket.ticketNumber}</TableCell>
                  <TableCell>{ticket.title}</TableCell>
                  <TableCell>
                    <Chip
                      label={ticket.priority}
                      size="small"
                      className="ticket-priority-chip"
                      style={{ backgroundColor: getPriorityColor(ticket.priority) }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={ticket.status}
                      size="small"
                      className="ticket-status-chip"
                      style={{ backgroundColor: getStatusColor(ticket.status) }}
                    />
                  </TableCell>
                  <TableCell>{ticket.assignedToName || 'Unassigned'}</TableCell>
                  <TableCell>{new Date(ticket.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Box className="recent-tickets-actions">
                      <IconButton size="small" className="recent-tickets-action-btn">
                        <Visibility />
                      </IconButton>
                      <IconButton size="small" className="recent-tickets-action-btn">
                        <Edit />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default RecentTickets;
