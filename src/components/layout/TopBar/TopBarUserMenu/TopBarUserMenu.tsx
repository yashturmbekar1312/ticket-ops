import React from 'react';
import {
  Box,
  Avatar,
  Menu,
  MenuItem,
  Button,
  Typography,
  Divider,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import { AccountCircle, ExitToApp, Settings } from '@mui/icons-material';
import { useAuth } from '../../../../hooks/auth';
import { useAppDispatch } from '../../../../hooks/redux';
import { logout } from '../../../../redux/authSlice';
import './TopBarUserMenu.css';

interface TopBarUserMenuProps {
  anchorEl: null | HTMLElement;
  onMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
  onMenuClose: () => void;
}

const TopBarUserMenu: React.FC<TopBarUserMenuProps> = ({ anchorEl, onMenuOpen, onMenuClose }) => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const handleLogout = () => {
    dispatch(logout());
    onMenuClose();
  };

  return (
    <Box className="topbar-user-menu">
      {/* User Role Chip */}
      {user && (
        <Chip
          label={user.role}
          size="small"
          className="topbar-user-role-chip"
          sx={{
            background:
              'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)',
            color: 'white',
            fontWeight: 600,
            fontSize: '0.75rem',
            height: 28,
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            '&:hover': {
              background:
                'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.2) 100%)',
            },
          }}
        />
      )}

      {/* User Avatar Menu */}
      <Box className="topbar-user-avatar-container">
        <Button
          onClick={onMenuOpen}
          className="topbar-user-avatar-button"
          sx={{
            p: 0,
            minWidth: 'auto',
            borderRadius: '12px',
            '&:hover': {
              backgroundColor: alpha(theme.palette.common.white, 0.1),
            },
          }}
        >
          <Avatar className="topbar-user-avatar">
            {user?.name?.charAt(0) || <AccountCircle />}
          </Avatar>
        </Button>

        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={onMenuClose}
          className="topbar-user-menu-dropdown"
        >
          <Box className="topbar-user-info">
            <Typography variant="subtitle2" className="topbar-user-name">
              {user?.name}
            </Typography>
            <Typography variant="body2" className="topbar-user-email">
              {user?.email}
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={onMenuClose} className="topbar-menu-item">
            <Settings className="topbar-menu-icon" />
            <Typography variant="body2">Settings & Preferences</Typography>
          </MenuItem>
          <MenuItem onClick={onMenuClose} className="topbar-menu-item">
            <AccountCircle className="topbar-menu-icon" />
            <Typography variant="body2">Profile & Account</Typography>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout} className="topbar-menu-item logout">
            <ExitToApp className="topbar-menu-icon logout-icon" />
            <Typography variant="body2">Sign Out</Typography>
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default TopBarUserMenu;
