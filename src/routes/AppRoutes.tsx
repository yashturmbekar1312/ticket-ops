import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import Layout from '../components/layout/Layout';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import { useAuth } from '../hooks/auth';

// Direct imports - no lazy loading
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import TicketsPage from '../pages/TicketsPage';
import CreateTicketPage from '../pages/CreateTicketPage';
import ViewTicketPage from '../pages/ViewTicketPage';
import KnowledgeBasePage from '../pages/KnowledgeBasePage';
import AssetManagementPage from '../pages/AssetManagementPage';
import WorkflowManagementPage from '../pages/WorkflowManagementPage';

import UserManagementPage from '../pages/UserManagementPage';
import ChangeManagementPage from '../pages/ChangeManagementPage';
import IncidentManagementPage from '../pages/IncidentManagementPage';
import SLAManagementPage from '../pages/SLAManagementPage';
import AdminConfigurationPage from '../pages/AdminConfigurationPage';
import AdminDashboardPage from '../pages/AdminDashboardPage';
import BulkOperationManagementPage from '../pages/BulkOperationManagementPage';
import SystemAuditSecurityPage from '../pages/SystemAuditSecurityPage';
import ServiceCatalogPage from '../pages/ServiceCatalogPage';
import CustomerPortalPage from '../pages/CustomerPortalPage';
import ProblemManagementPage from '../pages/ProblemManagementPage';
import CommunicationHubPage from '../pages/CommunicationHubPage';
import AdvancedAnalyticsPage from '../pages/AdvancedAnalyticsPage';
import IntegrationManagementPage from '../pages/IntegrationManagementPage';
import AutomationRulesPage from '../pages/AutomationRulesPage';
import SystemSettingsPage from '../pages/SystemSettingsPage';
import ApprovalManagementPage from '../pages/ApprovalManagementPage';
import TimeTrackingPage from '../pages/TimeTrackingPage';

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
        path="/tickets/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <ViewTicketPage />
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
              <AdvancedAnalyticsPage />
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
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute requiredRoles={['IT Admin', 'Admin']}>
            <Layout>
              <AdminDashboardPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/configuration"
        element={
          <ProtectedRoute requiredRoles={['IT Admin', 'Admin']}>
            <Layout>
              <AdminConfigurationPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/bulk-operations"
        element={
          <ProtectedRoute requiredRoles={['IT Admin', 'Admin']}>
            <Layout>
              <BulkOperationManagementPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/audit-security"
        element={
          <ProtectedRoute requiredRoles={['IT Admin', 'Admin']}>
            <Layout>
              <SystemAuditSecurityPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/service-catalog"
        element={
          <ProtectedRoute requiredRoles={['IT Admin', 'Admin', 'Manager']}>
            <Layout>
              <ServiceCatalogPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer-portal"
        element={
          <ProtectedRoute>
            <Layout>
              <CustomerPortalPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/problem-management"
        element={
          <ProtectedRoute requiredRoles={['IT Agent', 'Team Lead', 'IT Admin', 'Admin']}>
            <Layout>
              <ProblemManagementPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/communication-hub"
        element={
          <ProtectedRoute requiredRoles={['IT Agent', 'Team Lead', 'IT Admin', 'Admin']}>
            <Layout>
              <CommunicationHubPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/integrations"
        element={
          <ProtectedRoute requiredRoles={['IT Admin', 'Admin']}>
            <Layout>
              <IntegrationManagementPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/automation-rules"
        element={
          <ProtectedRoute requiredRoles={['IT Admin', 'Admin']}>
            <Layout>
              <AutomationRulesPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/system-settings"
        element={
          <ProtectedRoute requiredRoles={['IT Admin', 'Admin']}>
            <Layout>
              <SystemSettingsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/approvals"
        element={
          <ProtectedRoute requiredRoles={['Manager', 'Team Lead', 'IT Admin', 'Admin']}>
            <Layout>
              <ApprovalManagementPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/time-tracking"
        element={
          <ProtectedRoute requiredRoles={['IT Agent', 'Team Lead', 'IT Admin', 'Admin']}>
            <Layout>
              <TimeTrackingPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route
        path="*"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
        }
      />
    </Routes>
  );
};
