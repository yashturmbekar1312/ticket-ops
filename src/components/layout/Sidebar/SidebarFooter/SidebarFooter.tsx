import React from 'react';
import { Box, Typography } from '@mui/material';
import './SidebarFooter.css';

const SidebarFooter: React.FC = () => {
  return (
    <Box className="sidebar-footer">
      <Typography variant="caption" className="sidebar-footer-text">
        © 2024 TicketOps Pro
      </Typography>
    </Box>
  );
};

export default SidebarFooter;
