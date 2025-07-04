import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Ticket, TicketFormData, TicketFilters } from '../types';
import { ticketService } from '../services/ticket';

interface TicketState {
  tickets: Ticket[];
  currentTicket: Ticket | null;
  isLoading: boolean;
  error: string | null;
  filters: TicketFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const initialState: TicketState = {
  tickets: [],
  currentTicket: null,
  isLoading: false,
  error: null,
  filters: {},
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

// Async thunks
export const fetchTickets = createAsyncThunk(
  'tickets/fetchTickets',
  async (filters: TicketFilters | undefined, { rejectWithValue }) => {
    try {
      const response = await ticketService.getTickets(filters);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch tickets');
    }
  }
);

export const fetchTicket = createAsyncThunk(
  'tickets/fetchTicket',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await ticketService.getTicket(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch ticket');
    }
  }
);

export const createTicket = createAsyncThunk(
  'tickets/createTicket',
  async (ticketData: TicketFormData, { rejectWithValue }) => {
    try {
      const response = await ticketService.createTicket(ticketData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create ticket');
    }
  }
);

export const updateTicket = createAsyncThunk(
  'tickets/updateTicket',
  async ({ id, updates }: { id: string; updates: Partial<Ticket> }, { rejectWithValue }) => {
    try {
      const response = await ticketService.updateTicket(id, updates);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update ticket');
    }
  }
);

export const deleteTicket = createAsyncThunk(
  'tickets/deleteTicket',
  async (id: string, { rejectWithValue }) => {
    try {
      await ticketService.deleteTicket(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete ticket');
    }
  }
);

const ticketSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<TicketFilters>) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentTicket: (state) => {
      state.currentTicket = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tickets
      .addCase(fetchTickets.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tickets = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch single ticket
      .addCase(fetchTicket.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTicket.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentTicket = action.payload;
      })
      .addCase(fetchTicket.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create ticket
      .addCase(createTicket.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tickets.unshift(action.payload);
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update ticket
      .addCase(updateTicket.fulfilled, (state, action) => {
        const index = state.tickets.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.tickets[index] = action.payload;
        }
        if (state.currentTicket?.id === action.payload.id) {
          state.currentTicket = action.payload;
        }
      })
      // Delete ticket
      .addCase(deleteTicket.fulfilled, (state, action) => {
        state.tickets = state.tickets.filter((t) => t.id !== action.payload);
        if (state.currentTicket?.id === action.payload) {
          state.currentTicket = null;
        }
      });
  },
});

export const { setFilters, clearFilters, clearError, clearCurrentTicket } = ticketSlice.actions;
export default ticketSlice.reducer;
