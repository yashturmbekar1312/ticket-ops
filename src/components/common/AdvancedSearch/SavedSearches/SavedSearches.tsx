import React from 'react';
import { Box, Typography, Chip, Stack } from '@mui/material';
import { SavedSearch as SavedSearchIcon } from '@mui/icons-material';
import { TicketFilters } from '../../../../types';
import './SavedSearches.css';

interface SavedSearch {
  name: string;
  filters: TicketFilters;
}

interface SavedSearchesProps {
  savedSearches: SavedSearch[];
  onLoadSearch: (filters: TicketFilters) => void;
}

const SavedSearches: React.FC<SavedSearchesProps> = ({ savedSearches, onLoadSearch }) => {
  if (savedSearches.length === 0) {
    return null;
  }

  return (
    <Box className="saved-searches">
      <Typography variant="subtitle2" className="saved-searches-title">
        Saved Searches
      </Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap" className="saved-searches-list">
        {savedSearches.map((saved) => (
          <Chip
            key={saved.name}
            label={saved.name}
            icon={<SavedSearchIcon />}
            variant="outlined"
            onClick={() => onLoadSearch(saved.filters)}
            className="saved-search-chip"
          />
        ))}
      </Stack>
    </Box>
  );
};

export default SavedSearches;
