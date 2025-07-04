import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Box,
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Dashboard,
  ConfirmationNumber,
  Add,
  People,
  Assessment,
  MenuBook,
  Inventory,
  Settings,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/auth';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard', roles: ['all'] },
    { text: 'Tickets', icon: <ConfirmationNumber />, path: '/tickets', roles: ['all'] },
    { text: 'Create Ticket', icon: <Add />, path: '/tickets/create', roles: ['all'] },
    {
      text: 'Reports',
      icon: <Assessment />,
      path: '/reports',
      roles: ['Manager', 'IT Admin', 'Admin'],
    },
    { text: 'Knowledge Base', icon: <MenuBook />, path: '/knowledge-base', roles: ['all'] },
    {
      text: 'Asset Management',
      icon: <Inventory />,
      path: '/asset-management',
      roles: ['IT Admin', 'Admin', 'IT Agent'],
    },
    {
      text: 'User Management',
      icon: <People />,
      path: '/user-management',
      roles: ['IT Admin', 'Admin'],
    },
    { text: 'Settings', icon: <Settings />, path: '/settings', roles: ['IT Admin', 'Admin'] },
  ];

  const canAccessMenuItem = (itemRoles: string[]) => {
    if (itemRoles.includes('all')) return true;
    if (!user?.role) return false;
    return itemRoles.includes(user.role);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const drawerContent = (
    <Box sx={{ width: 240, height: '100%' }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" component="h1" color="primary">
          Ticket Ops
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems
          .filter((item) => canAccessMenuItem(item.roles))
          .map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'primary.contrastText',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
      </List>
    </Box>
  );

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'persistent'}
      open={open}
      onClose={onClose}
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          borderRight: `1px solid ${theme.palette.divider}`,
        },
      }}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
