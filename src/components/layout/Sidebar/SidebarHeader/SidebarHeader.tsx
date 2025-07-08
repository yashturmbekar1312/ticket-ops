import React from 'react';
import { Box, Typography } from '@mui/material';
import './SidebarHeader.css';

const SidebarHeader: React.FC = () => {
  return (
    <Box className="sidebar-header">
      <Box className="sidebar-header-content">
        <Box className="sidebar-logo">
          <img
            src="/redfish-logo.svg"
            alt="Redfish Logo"
            style={{ width: '20px', height: '20px' }}
          />
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
