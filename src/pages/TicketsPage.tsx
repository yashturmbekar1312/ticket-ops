import React from 'react';
import { Box, Typography, Button, Grid, CircularProgress, Alert, Fab } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { useAuth } from '../hooks/auth';
import { fetchTickets, setFilters, clearFilters } from '../redux/ticketSlice';
import { canViewTicket } from '../utils/permissions';
import { TicketCard } from '../components/ticket/TicketCard';
import { TicketFiltersComponent } from '../components/ticket/TicketFilters';
import { TicketFilters } from '../types';

export const TicketsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { tickets, isLoading, error, filters } = useAppSelector((state) => state.tickets);

  React.useEffect(() => {
    dispatch(fetchTickets(filters));
  }, [dispatch, filters]);

  const handleFiltersChange = (newFilters: TicketFilters) => {
    dispatch(setFilters(newFilters));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const handleTicketClick = (ticket: any) => {
    navigate(`/tickets/${ticket.id}`);
  };

  const handleCreateTicket = () => {
    navigate('/tickets/create');
  };

  const filteredTickets = tickets.filter((ticket) =>
    user ? canViewTicket(user.role, ticket, user.id) : false
  );

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">My Tickets</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleCreateTicket}>
          Create Ticket
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <TicketFiltersComponent
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
      />

      {filteredTickets.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '200px',
            textAlign: 'center',
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No tickets found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {Object.keys(filters).length > 0
              ? "Try adjusting your filters to find what you're looking for."
              : 'Get started by creating your first ticket.'}
          </Typography>
          <Button variant="contained" startIcon={<Add />} onClick={handleCreateTicket}>
            Create Your First Ticket
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredTickets.map((ticket) => (
            <Grid item xs={12} md={6} lg={4} key={ticket.id}>
              <TicketCard ticket={ticket} onClick={handleTicketClick} showActions={true} />
            </Grid>
          ))}
        </Grid>
      )}

      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
        onClick={handleCreateTicket}
      >
        <Add />
      </Fab>
    </Box>
  );
};
