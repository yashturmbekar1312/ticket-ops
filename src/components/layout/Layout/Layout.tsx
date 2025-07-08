import * as React from 'react';
import { Box, Toolbar } from '@mui/material';
import TopBar from '../TopBar';
import { Sidebar } from '../Sidebar';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box className="layout-container">
      <TopBar onToggleSidebar={handleToggleSidebar} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Box component="main" className="layout-main">
        <Toolbar className="layout-toolbar" />
        <Box className="layout-content">{children}</Box>
      </Box>
    </Box>
  );
};

export default Layout;
