import * as React from 'react';
import { Box, Toolbar } from '@mui/material';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <TopBar onToggleSidebar={handleToggleSidebar} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          width: { sm: `calc(100% - 280px)` },
          minHeight: '100vh',
          backgroundColor: '#f8fafc',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <Toolbar sx={{ mb: 2 }} />
        <Box
          sx={{
            maxWidth: '1600px',
            mx: 'auto',
            minHeight: 'calc(100vh - 120px)',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
