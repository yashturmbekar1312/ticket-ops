import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import { LazyLayout } from '../components/layout/LazyLayout';
import { useAuth } from '../hooks/auth';

// Lazy load components
const ProtectedRoute = React.lazy(() => import('../components/auth/ProtectedRoute'));
const LoginPage = React.lazy(() => import('../pages/LoginPage'));
const DashboardPage = React.lazy(() => import('../pages/DashboardPage'));
const TicketsPage = React.lazy(() => import('../pages/TicketsPage'));
const CreateTicketPage = React.lazy(() => import('../pages/CreateTicketPage'));
const KnowledgeBasePage = React.lazy(() => import('../pages/KnowledgeBasePage'));
const AssetManagementPage = React.lazy(() => import('../pages/AssetManagementPage'));
const ReportsPage = React.lazy(() => import('../pages/ReportsPage'));
const UserManagementPage = React.lazy(() => import('../pages/UserManagementPage'));

// Loading component for lazy-loaded pages
const PageLoader: React.FC = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
    <CircularProgress size={40} />
  </Box>
);

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
      <Route
        path="/login"
        element={
          <Suspense fallback={<PageLoader />}>
            <LoginPage />
          </Suspense>
        }
      />
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
          <Suspense fallback={<PageLoader />}>
            <ProtectedRoute>
              <LazyLayout>
                <Suspense fallback={<PageLoader />}>
                  <DashboardPage />
                </Suspense>
              </LazyLayout>
            </ProtectedRoute>
          </Suspense>
        }
      />
      <Route
        path="/tickets"
        element={
          <Suspense fallback={<PageLoader />}>
            <ProtectedRoute>
              <LazyLayout>
                <Suspense fallback={<PageLoader />}>
                  <TicketsPage />
                </Suspense>
              </LazyLayout>
            </ProtectedRoute>
          </Suspense>
        }
      />
      <Route
        path="/tickets/create"
        element={
          <Suspense fallback={<PageLoader />}>
            <ProtectedRoute>
              <LazyLayout>
                <Suspense fallback={<PageLoader />}>
                  <CreateTicketPage />
                </Suspense>
              </LazyLayout>
            </ProtectedRoute>
          </Suspense>
        }
      />
      <Route
        path="/tickets/all"
        element={
          <Suspense fallback={<PageLoader />}>
            <ProtectedRoute requiredRoles={['IT Admin']}>
              <LazyLayout>
                <Suspense fallback={<PageLoader />}>
                  <TicketsPage />
                </Suspense>
              </LazyLayout>
            </ProtectedRoute>
          </Suspense>
        }
      />
      <Route
        path="/tickets/team"
        element={
          <Suspense fallback={<PageLoader />}>
            <ProtectedRoute requiredRoles={['Manager']}>
              <LazyLayout>
                <Suspense fallback={<PageLoader />}>
                  <TicketsPage />
                </Suspense>
              </LazyLayout>
            </ProtectedRoute>
          </Suspense>
        }
      />
      <Route
        path="/tickets/hr"
        element={
          <Suspense fallback={<PageLoader />}>
            <ProtectedRoute requiredRoles={['HR']}>
              <LazyLayout>
                <Suspense fallback={<PageLoader />}>
                  <TicketsPage />
                </Suspense>
              </LazyLayout>
            </ProtectedRoute>
          </Suspense>
        }
      />        <Route
          path="/reports"
          element={
            <Suspense fallback={<PageLoader />}>
              <ProtectedRoute requiredRoles={['Manager', 'IT Admin', 'Admin', 'Team Lead']}>
                <LazyLayout>
                  <Suspense fallback={<PageLoader />}>
                    <ReportsPage />
                  </Suspense>
                </LazyLayout>
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="/knowledge-base"
          element={
            <Suspense fallback={<PageLoader />}>
              <ProtectedRoute>
                <LazyLayout>
                  <Suspense fallback={<PageLoader />}>
                    <KnowledgeBasePage />
                  </Suspense>
                </LazyLayout>
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="/assets"
          element={
            <Suspense fallback={<PageLoader />}>
              <ProtectedRoute requiredRoles={['IT Agent', 'Team Lead', 'IT Admin', 'Admin']}>
                <LazyLayout>
                  <Suspense fallback={<PageLoader />}>
                    <AssetManagementPage />
                  </Suspense>
                </LazyLayout>
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="/users"
          element={
            <Suspense fallback={<PageLoader />}>
              <ProtectedRoute requiredRoles={['IT Admin', 'Admin']}>
                <LazyLayout>
                  <Suspense fallback={<PageLoader />}>
                    <UserManagementPage />
                  </Suspense>
                </LazyLayout>
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="/settings"
          element={
            <Suspense fallback={<PageLoader />}>
              <ProtectedRoute requiredRoles={['IT Admin', 'Admin']}>
                <LazyLayout>
                  <Suspense fallback={<PageLoader />}>
                    <DashboardPage />
                  </Suspense>
                </LazyLayout>
              </ProtectedRoute>
            </Suspense>
          }
        />
    </Routes>
  );
};
