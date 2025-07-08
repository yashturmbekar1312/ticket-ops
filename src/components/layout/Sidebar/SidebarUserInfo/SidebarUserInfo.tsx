import React from 'react';
import { Box, Typography } from '@mui/material';
import './SidebarUserInfo.css';

interface User {
  name: string;
  role: string;
}

interface SidebarUserInfoProps {
  user: User | null;
}

const SidebarUserInfo: React.FC<SidebarUserInfoProps> = ({ user }) => {
  if (!user) return null;

  return (
    <Box className="sidebar-user-info">
      <Box className="sidebar-user-content">
        <Box className="sidebar-user-avatar">
          <Typography variant="body1" className="sidebar-user-avatar-text">
            {user.name?.charAt(0)}
          </Typography>
        </Box>
        <Box className="sidebar-user-details">
          <Typography variant="body2" className="sidebar-user-name">
            {user.name}
          </Typography>
          <Box className="sidebar-user-role-container">
            <Box className="sidebar-user-role">{user.role}</Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SidebarUserInfo;
