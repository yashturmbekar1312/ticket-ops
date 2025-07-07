import React from 'react';
import { Box, Alert } from '@mui/material';
import { useAuth } from '../hooks/auth';
import AdminDashboard from '../components/admin/AdminDashboard';

const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();

  // Check if user has admin access
  if (user?.role !== 'Admin' && user?.role !== 'IT Admin') {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          You don't have permission to access the admin dashboard. Please contact your
          administrator.
        </Alert>
      </Box>
    );
  }

  return <AdminDashboard />;
};

export default AdminDashboardPage;
