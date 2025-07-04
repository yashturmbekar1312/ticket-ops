import React from 'react';
import {
  Box,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  Typography,
  Button,
  Grid,
} from '@mui/material';
import { Clear, FilterList } from '@mui/icons-material';
import { TicketFilters, TicketStatus, TicketPriority, TicketCategory } from '../../types';

interface TicketFiltersProps {
  filters: TicketFilters;
  onFiltersChange: (filters: TicketFilters) => void;
  onClearFilters: () => void;
}

export const TicketFiltersComponent: React.FC<TicketFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleFilterChange = (key: keyof TicketFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const handleMultiSelectChange = (key: keyof TicketFilters, value: string[]) => {
    onFiltersChange({
      ...filters,
      [key]: value.length > 0 ? value : undefined,
    });
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(
      (value) =>
        value !== undefined && value !== '' && (Array.isArray(value) ? value.length > 0 : true)
    ).length;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterList />
            <Typography variant="h6">Filters</Typography>
            {activeFiltersCount > 0 && (
              <Chip label={`${activeFiltersCount} active`} size="small" color="primary" />
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" size="small" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? 'Hide' : 'Show'} Filters
            </Button>
            {activeFiltersCount > 0 && (
              <Button
                variant="outlined"
                size="small"
                color="error"
                startIcon={<Clear />}
                onClick={onClearFilters}
              >
                Clear All
              </Button>
            )}
          </Box>
        </Box>

        {isExpanded && (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Search"
                variant="outlined"
                size="small"
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search tickets..."
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  multiple
                  value={filters.status || []}
                  onChange={(e) => handleMultiSelectChange('status', e.target.value as string[])}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {(
                    ['Open', 'In Progress', 'Resolved', 'Closed', 'Escalated'] as TicketStatus[]
                  ).map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Priority</InputLabel>
                <Select
                  multiple
                  value={filters.priority || []}
                  onChange={(e) => handleMultiSelectChange('priority', e.target.value as string[])}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {(['Low', 'Medium', 'High', 'Critical'] as TicketPriority[]).map((priority) => (
                    <MenuItem key={priority} value={priority}>
                      {priority}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  multiple
                  value={filters.category || []}
                  onChange={(e) => handleMultiSelectChange('category', e.target.value as string[])}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {(
                    ['Hardware', 'Software', 'Network', 'HR', 'Access', 'Other'] as TicketCategory[]
                  ).map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Department</InputLabel>
                <Select
                  multiple
                  value={filters.department || []}
                  onChange={(e) =>
                    handleMultiSelectChange('department', e.target.value as string[])
                  }
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {['Engineering', 'Human Resources', 'IT', 'Marketing', 'Sales'].map((dept) => (
                    <MenuItem key={dept} value={dept}>
                      {dept}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="From Date"
                type="date"
                size="small"
                value={filters.dateFrom || ''}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="To Date"
                type="date"
                size="small"
                value={filters.dateTo || ''}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
        )}
      </CardContent>
    </Card>
  );
};
