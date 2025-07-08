import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import { MenuItem } from '../menuItems';
import './SidebarNavigation.css';

interface SidebarNavigationProps {
  menuItems: MenuItem[];
  sectionTitle: string;
  canAccessMenuItem: (roles: string[]) => boolean;
  onItemClick: (path: string) => void;
  variant?: 'main' | 'admin';
}

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  menuItems,
  sectionTitle,
  canAccessMenuItem,
  onItemClick,
  variant = 'main',
}) => {
  const location = useLocation();

  return (
    <Box className="sidebar-navigation">
      <Typography variant="overline" className="sidebar-navigation-title">
        {sectionTitle}
      </Typography>
      <List className="sidebar-navigation-list">
        {menuItems
          .filter((item) => canAccessMenuItem(item.roles))
          .map((item) => (
            <ListItem key={item.text} disablePadding className="sidebar-navigation-item">
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => onItemClick(item.path)}
                className={`sidebar-navigation-button ${variant === 'admin' ? 'admin-style' : ''}`}
              >
                <ListItemIcon className="sidebar-navigation-icon">{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} className="sidebar-navigation-text" />
              </ListItemButton>
            </ListItem>
          ))}
      </List>
    </Box>
  );
};

export default SidebarNavigation;
