import React from 'react';
import { Box, TextField, Button, IconButton, InputAdornment } from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  KeyboardArrowDown as ArrowDownIcon,
  KeyboardArrowUp as ArrowUpIcon,
} from '@mui/icons-material';
import './SearchBar.css';

interface SearchBarProps {
  searchText: string;
  onSearchChange: (value: string) => void;
  onSearchClear: () => void;
  expanded: boolean;
  onToggleExpanded: () => void;
  activeFiltersCount: number;
  onClearAllFilters: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchText,
  onSearchChange,
  onSearchClear,
  expanded,
  onToggleExpanded,
  activeFiltersCount,
  onClearAllFilters,
}) => {
  return (
    <Box className="search-bar">
      <TextField
        fullWidth
        placeholder="Search tickets by title, description, or ticket number..."
        value={searchText}
        onChange={(e) => onSearchChange(e.target.value)}
        className="search-bar-input"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: searchText && (
            <InputAdornment position="end">
              <IconButton onClick={onSearchClear} size="small">
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Button
        variant="outlined"
        startIcon={expanded ? <ArrowUpIcon /> : <ArrowDownIcon />}
        onClick={onToggleExpanded}
        className="search-bar-filters-button"
      >
        Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
      </Button>
      {activeFiltersCount > 0 && (
        <Button
          variant="outlined"
          startIcon={<ClearIcon />}
          onClick={onClearAllFilters}
          color="error"
          className="search-bar-clear-button"
        >
          Clear All
        </Button>
      )}
    </Box>
  );
};

export default SearchBar;
