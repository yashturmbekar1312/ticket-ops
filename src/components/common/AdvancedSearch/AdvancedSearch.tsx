import React, { useState, useEffect } from 'react';
import { Paper, Box, Collapse, Divider } from '@mui/material';
import { TicketFilters } from '../../../types';
import SearchBar from './SearchBar';
import QuickFilters from './QuickFilters';
import SavedSearches from './SavedSearches';
import './AdvancedSearch.css';

// Advanced filters component would be imported here when created
// import AdvancedFilters from './AdvancedFilters';

interface AdvancedSearchProps {
  filters: TicketFilters;
  onFiltersChange: (filters: TicketFilters) => void;
  onClearFilters: () => void;
  onSaveSearch?: (name: string, filters: TicketFilters) => void;
  savedSearches?: Array<{ name: string; filters: TicketFilters }>;
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  savedSearches = [],
}) => {
  const [expanded, setExpanded] = useState(false);
  const [searchText, setSearchText] = useState(filters.search || '');

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchText !== filters.search) {
        onFiltersChange({ ...filters, search: searchText });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchText, filters, onFiltersChange]);

  const handleQuickFilter = (quickFilter: { label: string; filters: Partial<TicketFilters> }) => {
    onFiltersChange({ ...filters, ...quickFilter.filters });
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
    <Paper elevation={2} className="advanced-search">
      <Box className="advanced-search-content">
        <SearchBar
          searchText={searchText}
          onSearchChange={setSearchText}
          onSearchClear={() => setSearchText('')}
          expanded={expanded}
          onToggleExpanded={() => setExpanded(!expanded)}
          activeFiltersCount={activeFiltersCount}
          onClearAllFilters={onClearFilters}
        />

        <QuickFilters onQuickFilter={handleQuickFilter} />

        <SavedSearches savedSearches={savedSearches} onLoadSearch={handleLoadSearch} />

        {/* Advanced Filters - to be implemented */}
        <Collapse in={expanded}>
          <Divider className="advanced-search-divider" />
          <Box className="advanced-search-placeholder">
            {/* AdvancedFilters component will go here */}
            <p>Advanced filters will be implemented in the next iteration...</p>
          </Box>
        </Collapse>
      </Box>
    </Paper>
  );
};

export default AdvancedSearch;
