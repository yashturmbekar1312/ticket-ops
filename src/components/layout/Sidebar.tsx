import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Typography,
  Box,
} from '@mui/material';
import {
  Dashboard,
  ConfirmationNumber,
  People,
  Assessment,
  Settings,
  Add,
  Assignment,
  Group,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth, useRole } from '../../hooks/auth';

const drawerWidth = 240;

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { isAdmin, isManager, isHR } = useRole();

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <Dashboard />,
      path: '/dashboard',
      roles: ['Employee', 'HR', 'Manager', 'IT Admin'],
    },
    {
      text: 'My Tickets',
      icon: <ConfirmationNumber />,
      path: '/tickets',
      roles: ['Employee', 'HR', 'Manager', 'IT Admin'],
    },
    {
      text: 'Create Ticket',
      icon: <Add />,
      path: '/tickets/create',
      roles: ['Employee', 'HR', 'Manager', 'IT Admin'],
    },
    {
      text: 'All Tickets',
      icon: <Assignment />,
      path: '/tickets/all',
      roles: ['IT Admin'],
    },
    {
      text: 'Team Tickets',
      icon: <Group />,
      path: '/tickets/team',
      roles: ['Manager'],
    },
    {
      text: 'HR Tickets',
      icon: <People />,
      path: '/tickets/hr',
      roles: ['HR'],
    },
    {
      text: 'Reports',
      icon: <Assessment />,
      path: '/reports',
      roles: ['Manager', 'IT Admin'],
    },
    {
      text: 'User Management',
      icon: <People />,
      path: '/users',
      roles: ['IT Admin'],
    },
    {
      text: 'Settings',
      icon: <Settings />,
      path: '/settings',
      roles: ['IT Admin'],
    },
  ];

  const filteredMenuItems = menuItems.filter((item) => user && item.roles.includes(user.role));

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Welcome back,
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {user?.name}
          </Typography>
        </Box>
        <Divider />
        <List>
          {filteredMenuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                  },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};
