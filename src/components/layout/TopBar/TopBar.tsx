import * as React from 'react';
import { AppBar, Toolbar, Box, IconButton, useTheme, alpha } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import TopBarLogo from './TopBarLogo';
import TopBarActions from './TopBarActions';
import TopBarUserMenu from './TopBarUserMenu';
import './TopBar.css';

interface TopBarProps {
  onToggleSidebar: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onToggleSidebar }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [darkMode, setDarkMode] = React.useState(false);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <AppBar position="fixed" className="topbar">
      <Toolbar className="topbar-toolbar">
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={onToggleSidebar}
          edge="start"
          className="topbar-menu-button"
          sx={{
            mr: 2,
            backgroundColor: alpha(theme.palette.common.white, 0.1),
            '&:hover': {
              backgroundColor: alpha(theme.palette.common.white, 0.2),
              transform: 'scale(1.05)',
            },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          <MenuIcon />
        </IconButton>

        <TopBarLogo />

        <Box className="topbar-spacer" />

        <Box className="topbar-right">
          <TopBarActions darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />
          <TopBarUserMenu anchorEl={anchorEl} onMenuOpen={handleMenu} onMenuClose={handleClose} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
