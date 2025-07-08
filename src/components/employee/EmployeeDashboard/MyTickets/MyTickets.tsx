import React from 'react';
import { Grid, Card, CardContent, Box, Typography, Chip } from '@mui/material';
import {
  Schedule,
  Assignment,
  CheckCircle,
  Warning,
  ConfirmationNumber,
} from '@mui/icons-material';
import { Ticket } from '../../../../types';
import './MyTickets.css';

interface MyTicketsProps {
  tickets: Ticket[];
  onTicketClick: (ticket: Ticket) => void;
}

const MyTickets: React.FC<MyTicketsProps> = ({ tickets, onTicketClick }) => {
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
      case 'Pending':
        return '#9c27b0';
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open':
        return <Schedule />;
      case 'In Progress':
        return <Assignment />;
      case 'Resolved':
        return <CheckCircle />;
      case 'Closed':
        return <CheckCircle />;
      case 'Pending':
        return <Warning />;
      default:
        return <ConfirmationNumber />;
    }
  };

  return (
    <Card className="my-tickets-card">
      <CardContent>
        <Box className="my-tickets-header">
          <ConfirmationNumber className="my-tickets-icon" />
          <Typography variant="h6">My Open Tickets</Typography>
        </Box>
        <Grid container spacing={2}>
          {tickets.map((ticket) => (
            <Grid item xs={12} md={6} lg={4} key={ticket.id}>
              <Card
                className="ticket-card"
                onClick={() => onTicketClick(ticket)}
              >
                <CardContent>
                  <Box className="ticket-header">
                    {getStatusIcon(ticket.status)}
                    <Typography variant="h6" className="ticket-number">
                      {ticket.ticketNumber}
                    </Typography>
                    <Chip
                      label={ticket.priority}
                      size="small"
                      className="priority-chip"
                      sx={{
                        backgroundColor: getPriorityColor(ticket.priority) + '20',
                        color: getPriorityColor(ticket.priority),
                      }}
                    />
                  </Box>
                  <Typography variant="body1" className="ticket-title">
                    {ticket.title}
                  </Typography>
                  <Typography variant="body2" className="ticket-description">
                    {ticket.description.substring(0, 100)}...
                  </Typography>
                  <Box className="ticket-footer">
                    <Chip
                      label={ticket.status}
                      size="small"
                      className="status-chip"
                      sx={{
                        backgroundColor: getStatusColor(ticket.status) + '20',
                        color: getStatusColor(ticket.status),
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default MyTickets;
