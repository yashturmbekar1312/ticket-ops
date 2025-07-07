import * as React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Chip,
  Button,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import {
  AccountCircle,
  ExitToApp,
  Settings,
  Menu as MenuIcon,
  Search,
  Help,
  Brightness4,
  Brightness7,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/auth';
import { useAppDispatch } from '../../hooks/redux';
import { logout } from '../../redux/authSlice';
import { NotificationBell } from '../common/NotificationProvider';

interface TopBarProps {
  onToggleSidebar: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onToggleSidebar }) => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [darkMode, setDarkMode] = React.useState(false);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleClose();
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background:
          'linear-gradient(135deg, rgba(99, 102, 241, 0.95) 0%, rgba(139, 92, 246, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px 0 rgba(99, 102, 241, 0.2)',
      }}
    >
      <Toolbar sx={{ minHeight: '72px !important', px: 3 }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={onToggleSidebar}
          edge="start"
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

        <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                color: '#6366f1',
                fontSize: '1.2rem',
              }}
            >
              T
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 700,
                fontSize: '1.25rem',
                color: 'white',
                letterSpacing: '-0.02em',
              }}
            >
              TicketOps
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: alpha(theme.palette.common.white, 0.8),
                fontSize: '0.75rem',
                fontWeight: 500,
                display: { xs: 'none', sm: 'block' },
              }}
            >
              Professional IT Service Management
            </Typography>
          </Box>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Search Button */}
          <IconButton
            color="inherit"
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
            onClick={toggleDarkMode}
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
          <Box sx={{ position: 'relative' }}>
            <NotificationBell />
          </Box>

          {/* User Role Chip */}
          {user && (
            <Chip
              label={user.role}
              size="small"
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
          <Box sx={{ position: 'relative' }}>
            <Button
              onClick={handleMenu}
              sx={{
                p: 0,
                minWidth: 'auto',
                borderRadius: '12px',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.common.white, 0.1),
                },
              }}
            >
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                  color: '#6366f1',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                }}
              >
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
              onClose={handleClose}
              sx={{
                '& .MuiPaper-root': {
                  borderRadius: 2,
                  minWidth: 220,
                  boxShadow:
                    '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  mt: 1,
                },
              }}
            >
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#374151' }}>
                  {user?.name}
                </Typography>
                <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.75rem' }}>
                  {user?.email}
                </Typography>
              </Box>
              <Divider />
              <MenuItem
                onClick={handleClose}
                sx={{
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: '#f8fafc',
                  },
                }}
              >
                <Settings sx={{ mr: 2, color: '#6b7280' }} />
                <Typography variant="body2">Settings & Preferences</Typography>
              </MenuItem>
              <MenuItem
                onClick={handleClose}
                sx={{
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: '#f8fafc',
                  },
                }}
              >
                <AccountCircle sx={{ mr: 2, color: '#6b7280' }} />
                <Typography variant="body2">Profile & Account</Typography>
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={handleLogout}
                sx={{
                  py: 1.5,
                  color: '#ef4444',
                  '&:hover': {
                    backgroundColor: '#fef2f2',
                  },
                }}
              >
                <ExitToApp sx={{ mr: 2, color: '#ef4444' }} />
                <Typography variant="body2">Sign Out</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
