import React from 'react';
import { Box, Typography } from '@mui/material';
import './SidebarHeader.css';

const SidebarHeader: React.FC = () => {
  return (
    <Box className="sidebar-header">
      <Box className="sidebar-header-content">
        <Box className="sidebar-logo">
          <Typography variant="h6" className="sidebar-logo-text">
            T
          </Typography>
        </Box>
        <Box>
          <Typography variant="h6" className="sidebar-title">
            TicketOps
          </Typography>
          <Typography variant="caption" className="sidebar-subtitle">
            Service Management
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default SidebarHeader;
