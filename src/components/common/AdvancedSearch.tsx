import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Autocomplete,
  Chip,
  Button,
  Paper,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Collapse,
  IconButton,
  Divider,
  Stack,
  InputAdornment,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  KeyboardArrowDown as ArrowDownIcon,
  KeyboardArrowUp as ArrowUpIcon,
  SavedSearch as SavedSearchIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TicketFilters, TicketStatus, TicketPriority, TicketCategory } from '../../types';

interface AdvancedSearchProps {
  filters: TicketFilters;
  onFiltersChange: (filters: TicketFilters) => void;
  onClearFilters: () => void;
  onSaveSearch?: (name: string, filters: TicketFilters) => void;
  savedSearches?: Array<{ name: string; filters: TicketFilters }>;
}

const TICKET_STATUSES: TicketStatus[] = [
  'New',
  'Open',
  'Assigned',
  'In Progress',
  'Resolved',
  'Closed',
  'Escalated',
  'Pending',
  'Cancelled',
];

const TICKET_PRIORITIES: TicketPriority[] = ['Low', 'Medium', 'High', 'Critical', 'Urgent'];

const TICKET_CATEGORIES: TicketCategory[] = [
  'Hardware',
  'Software',
  'Network',
  'Access',
  'HR',
  'Security',
  'Maintenance',
  'Account',
  'Training',
  'Other',
];

const DEPARTMENTS = [
  'Engineering',
  'Human Resources',
  'Finance',
  'Marketing',
  'Sales',
  'Operations',
  'IT',
  'Legal',
];

const SOURCES = ['web', 'email', 'phone', 'chat', 'api'];

const QUICK_FILTERS = [
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

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  onSaveSearch,
  savedSearches = [],
}) => {
  const [expanded, setExpanded] = useState(false);
  const [searchText, setSearchText] = useState(filters.search || '');
  const [saveSearchName, setSaveSearchName] = useState('');
  const [showSaveSearch, setShowSaveSearch] = useState(false);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchText !== filters.search) {
        onFiltersChange({ ...filters, search: searchText });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchText, filters, onFiltersChange]);

  const handleFilterChange = (key: keyof TicketFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleMultiSelectChange = (key: keyof TicketFilters, values: string[]) => {
    onFiltersChange({ ...filters, [key]: values.length > 0 ? values : undefined });
  };

  const handleQuickFilter = (quickFilter: any) => {
    onFiltersChange({ ...filters, ...quickFilter.filters });
  };

  const handleSaveSearch = () => {
    if (saveSearchName && onSaveSearch) {
      onSaveSearch(saveSearchName, filters);
      setSaveSearchName('');
      setShowSaveSearch(false);
    }
  };

  const handleLoadSearch = (savedFilters: TicketFilters) => {
    onFiltersChange(savedFilters);
    setSearchText(savedFilters.search || '');
  };

  const activeFiltersCount = Object.values(filters).filter(
    (value) =>
      value !== undefined && value !== null && (Array.isArray(value) ? value.length > 0 : true)
  ).length;

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
      <Box>
        {/* Quick Search Bar */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Search tickets by title, description, or ticket number..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchText && (
                <InputAdornment position="end">
                  <IconButton onClick={() => setSearchText('')} size="small">
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="outlined"
            startIcon={expanded ? <ArrowUpIcon /> : <ArrowDownIcon />}
            onClick={() => setExpanded(!expanded)}
            sx={{ minWidth: 120 }}
          >
            Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </Button>
          {activeFiltersCount > 0 && (
            <Button
              variant="outlined"
              startIcon={<ClearIcon />}
              onClick={onClearFilters}
              color="error"
            >
              Clear All
            </Button>
          )}
        </Box>

        {/* Quick Filters */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {QUICK_FILTERS.map((quickFilter) => (
            <Chip
              key={quickFilter.label}
              label={quickFilter.label}
              variant="outlined"
              onClick={() => handleQuickFilter(quickFilter)}
              sx={{
                '&:hover': { backgroundColor: 'primary.light', color: 'primary.contrastText' },
              }}
            />
          ))}
        </Box>

        {/* Saved Searches */}
        {savedSearches.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Saved Searches
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {savedSearches.map((saved) => (
                <Chip
                  key={saved.name}
                  label={saved.name}
                  icon={<SavedSearchIcon />}
                  variant="outlined"
                  onClick={() => handleLoadSearch(saved.filters)}
                  sx={{ mb: 1 }}
                />
              ))}
            </Stack>
          </Box>
        )}

        {/* Advanced Filters */}
        <Collapse in={expanded}>
          <Divider sx={{ mb: 3 }} />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid container spacing={2}>
              {/* Status Filter */}
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    multiple
                    value={filters.status || []}
                    onChange={(e) => handleMultiSelectChange('status', e.target.value as string[])}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    {TICKET_STATUSES.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Priority Filter */}
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    multiple
                    value={filters.priority || []}
                    onChange={(e) =>
                      handleMultiSelectChange('priority', e.target.value as string[])
                    }
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    {TICKET_PRIORITIES.map((priority) => (
                      <MenuItem key={priority} value={priority}>
                        {priority}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Category Filter */}
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    multiple
                    value={filters.category || []}
                    onChange={(e) =>
                      handleMultiSelectChange('category', e.target.value as string[])
                    }
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    {TICKET_CATEGORIES.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Department Filter */}
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Department</InputLabel>
                  <Select
                    multiple
                    value={filters.department || []}
                    onChange={(e) =>
                      handleMultiSelectChange('department', e.target.value as string[])
                    }
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    {DEPARTMENTS.map((dept) => (
                      <MenuItem key={dept} value={dept}>
                        {dept}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Source Filter */}
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Source</InputLabel>
                  <Select
                    multiple
                    value={filters.source || []}
                    onChange={(e) => handleMultiSelectChange('source', e.target.value as string[])}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    {SOURCES.map((source) => (
                      <MenuItem key={source} value={source}>
                        {source.charAt(0).toUpperCase() + source.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Date Range */}
              <Grid item xs={12} sm={6} md={4}>
                <DatePicker
                  label="Date From"
                  value={filters.dateFrom ? new Date(filters.dateFrom) : null}
                  onChange={(date) => handleFilterChange('dateFrom', date?.toISOString())}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <DatePicker
                  label="Date To"
                  value={filters.dateTo ? new Date(filters.dateTo) : null}
                  onChange={(date) => handleFilterChange('dateTo', date?.toISOString())}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>

              {/* Tags */}
              <Grid item xs={12} sm={6} md={4}>
                <Autocomplete
                  multiple
                  freeSolo
                  options={[]}
                  value={filters.tags || []}
                  onChange={(_, value) => handleFilterChange('tags', value)}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        variant="outlined"
                        label={option}
                        {...getTagProps({ index })}
                        key={option}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Tags" placeholder="Add tags to filter by" />
                  )}
                />
              </Grid>

              {/* Boolean Filters */}
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Special Filters</InputLabel>
                  <Select
                    multiple
                    value={[
                      ...(filters.slaBreached ? ['slaBreached'] : []),
                      ...(filters.overdue ? ['overdue'] : []),
                    ]}
                    onChange={(e) => {
                      const values = e.target.value as string[];
                      handleFilterChange('slaBreached', values.includes('slaBreached'));
                      handleFilterChange('overdue', values.includes('overdue'));
                    }}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map((value) => (
                          <Chip
                            key={value}
                            label={value === 'slaBreached' ? 'SLA Breached' : 'Overdue'}
                            size="small"
                          />
                        ))}
                      </Box>
                    )}
                  >
                    <MenuItem value="slaBreached">SLA Breached</MenuItem>
                    <MenuItem value="overdue">Overdue</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Save Search */}
            <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
              {onSaveSearch && (
                <>
                  {!showSaveSearch ? (
                    <Button
                      variant="outlined"
                      startIcon={<SavedSearchIcon />}
                      onClick={() => setShowSaveSearch(true)}
                      disabled={activeFiltersCount === 0}
                    >
                      Save Search
                    </Button>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TextField
                        size="small"
                        placeholder="Search name"
                        value={saveSearchName}
                        onChange={(e) => setSaveSearchName(e.target.value)}
                      />
                      <Button
                        variant="contained"
                        onClick={handleSaveSearch}
                        disabled={!saveSearchName}
                      >
                        Save
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setShowSaveSearch(false);
                          setSaveSearchName('');
                        }}
                      >
                        Cancel
                      </Button>
                    </Box>
                  )}
                </>
              )}
            </Box>
          </LocalizationProvider>
        </Collapse>
      </Box>
    </Paper>
  );
};

export default AdvancedSearch;
