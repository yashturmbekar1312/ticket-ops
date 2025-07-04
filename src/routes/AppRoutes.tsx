import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { Layout } from '../components/layout/Layout';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { useAuth } from '../hooks/auth';

// Direct imports - no lazy loading
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import TicketsPage from '../pages/TicketsPage';
import CreateTicketPage from '../pages/CreateTicketPage';
import KnowledgeBasePage from '../pages/KnowledgeBasePage';
import AssetManagementPage from '../pages/AssetManagementPage';
import WorkflowManagementPage from '../pages/WorkflowManagementPage';
import ReportsPage from '../pages/ReportsPage';
import UserManagementPage from '../pages/UserManagementPage';
import ChangeManagementPage from '../pages/ChangeManagementPage';
import IncidentManagementPage from '../pages/IncidentManagementPage';
import SLAManagementPage from '../pages/SLAManagementPage';

const UnauthorizedPage: React.FC = () => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    minHeight="100vh"
  >
    <Typography variant="h4" gutterBottom>
      Unauthorized
    </Typography>
    <Typography variant="body1" color="text.secondary">
      You don't have permission to access this page.
    </Typography>
  </Box>
);

export const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route
        path="/"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <DashboardPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tickets"
        element={
          <ProtectedRoute>
            <Layout>
              <TicketsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tickets/create"
        element={
          <ProtectedRoute>
            <Layout>
              <CreateTicketPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tickets/all"
        element={
          <ProtectedRoute requiredRoles={['IT Admin']}>
            <Layout>
              <TicketsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tickets/team"
        element={
          <ProtectedRoute requiredRoles={['Manager']}>
            <Layout>
              <TicketsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tickets/hr"
        element={
          <ProtectedRoute requiredRoles={['HR']}>
            <Layout>
              <TicketsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute requiredRoles={['Manager', 'IT Admin', 'Admin', 'Team Lead']}>
            <Layout>
              <ReportsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/knowledge-base"
        element={
          <ProtectedRoute>
            <Layout>
              <KnowledgeBasePage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/assets"
        element={
          <ProtectedRoute requiredRoles={['IT Agent', 'Team Lead', 'IT Admin', 'Admin']}>
            <Layout>
              <AssetManagementPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/asset-management"
        element={
          <ProtectedRoute requiredRoles={['IT Agent', 'Team Lead', 'IT Admin', 'Admin']}>
            <Layout>
              <AssetManagementPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/workflow-management"
        element={
          <ProtectedRoute requiredRoles={['IT Admin', 'Admin']}>
            <Layout>
              <WorkflowManagementPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute requiredRoles={['IT Admin', 'Admin']}>
            <Layout>
              <UserManagementPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute requiredRoles={['IT Admin', 'Admin']}>
            <Layout>
              <DashboardPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/incidents"
        element={
          <ProtectedRoute requiredRoles={['IT Agent', 'Team Lead', 'IT Admin', 'Admin']}>
            <Layout>
              <IncidentManagementPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/sla"
        element={
          <ProtectedRoute requiredRoles={['IT Admin', 'Admin']}>
            <Layout>
              <SLAManagementPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/change-management"
        element={
          <ProtectedRoute requiredRoles={['IT Admin', 'Admin', 'Team Lead']}>
            <Layout>
              <ChangeManagementPage />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
