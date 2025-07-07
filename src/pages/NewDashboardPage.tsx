import React from 'react';
import { useAuth } from '../hooks/auth';
import AdminDashboard from '../components/admin/AdminDashboard';
import ManagerDashboard from '../components/manager/ManagerDashboard';
import EmployeeDashboard from '../components/employee/EmployeeDashboard';
import OperationsDashboard from '../components/operations/OperationsDashboard';
import { Box, Typography } from '@mui/material';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4">Loading...</Typography>
      </Box>
    );
  }

  // Route to appropriate dashboard based on user role
  switch (user.role) {
    case 'IT Admin':
    case 'Admin':
      return <AdminDashboard />;

    case 'Manager':
      return (
        <ManagerDashboard userId={user.id} userName={user.name} department={user.department} />
      );

    case 'Employee':
      return <EmployeeDashboard userId={user.id} userName={user.name} />;

    case 'IT Agent':
    case 'Team Lead':
      return <OperationsDashboard userId={user.id} userName={user.name} userRole={user.role} />;

    default:
      return <EmployeeDashboard userId={user.id} userName={user.name} />;
  }
};

export default DashboardPage;
