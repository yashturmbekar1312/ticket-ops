import React from 'react';
import { Box, IconButton, useTheme, alpha } from '@mui/material';
import { Search, Help, Brightness4, Brightness7 } from '@mui/icons-material';
import { NotificationBell } from '../../../common/NotificationProvider';
import './TopBarActions.css';

interface TopBarActionsProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

const TopBarActions: React.FC<TopBarActionsProps> = ({ darkMode, onToggleDarkMode }) => {
  const theme = useTheme();

  return (
    <Box className="topbar-actions">
      {/* Search Button */}
      <IconButton
        color="inherit"
        className="topbar-action-button"
        sx={{
          backgroundColor: alpha(theme.palette.common.white, 0.1),
          '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.2),
          },
        }}
      >
        <Search />
      </IconButton>

      {/* Dark Mode Toggle */}
      <IconButton
        color="inherit"
        onClick={onToggleDarkMode}
        className="topbar-action-button"
        sx={{
          backgroundColor: alpha(theme.palette.common.white, 0.1),
          '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.2),
          },
        }}
      >
        {darkMode ? <Brightness7 /> : <Brightness4 />}
      </IconButton>

      {/* Help Button */}
      <IconButton
        color="inherit"
        className="topbar-action-button"
        sx={{
          backgroundColor: alpha(theme.palette.common.white, 0.1),
          '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.2),
          },
        }}
      >
        <Help />
      </IconButton>

      {/* Notifications */}
      <Box className="topbar-notifications">
        <NotificationBell />
      </Box>
    </Box>
  );
};

export default TopBarActions;
