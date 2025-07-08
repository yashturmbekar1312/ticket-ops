import React from 'react';
import { Box, Chip } from '@mui/material';
import { TicketFilters } from '../../../../types';
import './QuickFilters.css';

interface QuickFilter {
  label: string;
  filters: Partial<TicketFilters>;
}

interface QuickFiltersProps {
  onQuickFilter: (quickFilter: QuickFilter) => void;
}

const QUICK_FILTERS: QuickFilter[] = [
  { label: 'My Tickets', filters: { assignedTo: ['current_user'] } },
  { label: 'Overdue', filters: { overdue: true } },
  { label: 'SLA Breached', filters: { slaBreached: true } },
  { label: 'High Priority', filters: { priority: ['High', 'Critical', 'Urgent'] } },
  { label: 'Open Issues', filters: { status: ['New', 'Open', 'Assigned', 'In Progress'] } },
  {
    label: 'Recent',
    filters: { dateFrom: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
  },
];

const QuickFilters: React.FC<QuickFiltersProps> = ({ onQuickFilter }) => {
  return (
    <Box className="quick-filters">
      {QUICK_FILTERS.map((quickFilter) => (
        <Chip
          key={quickFilter.label}
          label={quickFilter.label}
          variant="outlined"
          onClick={() => onQuickFilter(quickFilter)}
          className="quick-filter-chip"
        />
      ))}
    </Box>
  );
};

export default QuickFilters;
