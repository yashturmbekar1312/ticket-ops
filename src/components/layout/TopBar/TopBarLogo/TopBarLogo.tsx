import React from 'react';
import { Box, Typography } from '@mui/material';
import './TopBarLogo.css';

const TopBarLogo: React.FC = () => {
  return (
    <Box className="topbar-logo">
      <Box className="topbar-logo-icon">
        <Typography variant="h6" className="topbar-logo-text">
          T
        </Typography>
      </Box>
      <Box>
        <Typography variant="h6" component="div" className="topbar-logo-title">
          TicketOps
        </Typography>
        <Typography variant="caption" className="topbar-logo-subtitle">
          Professional IT Service Management
        </Typography>
      </Box>
    </Box>
  );
};

export default TopBarLogo;
