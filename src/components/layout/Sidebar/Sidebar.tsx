import * as React from 'react';
import { Drawer, Box, useTheme, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/auth';
import { menuItems, adminMenuItems } from './menuItems';
import SidebarHeader from './SidebarHeader';
import SidebarUserInfo from './SidebarUserInfo';
import SidebarNavigation from './SidebarNavigation';
import SidebarFooter from './SidebarFooter';
import './Sidebar.css';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
    <Box className="sidebar-content">
      <SidebarHeader />
      <SidebarUserInfo user={user} />
      <SidebarNavigation
        menuItems={menuItems}
        sectionTitle="Main Menu"
        canAccessMenuItem={canAccessMenuItem}
        onItemClick={handleNavigation}
        variant="main"
      />
      {user?.role && ['IT Admin', 'Admin'].includes(user.role) && (
        <SidebarNavigation
          menuItems={adminMenuItems}
          sectionTitle="Administration"
          canAccessMenuItem={canAccessMenuItem}
          onItemClick={handleNavigation}
          variant="admin"
        />
      )}
      <SidebarFooter />
    </Box>
  );

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'persistent'}
      open={open}
      onClose={onClose}
      className="sidebar-drawer"
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
