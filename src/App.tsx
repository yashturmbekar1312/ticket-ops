import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './redux/store';
import { AppTheme } from './components/theme/AppTheme';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Layout } from './components/layout/Layout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { TicketsPage } from './pages/TicketsPage';
import { CreateTicketPage } from './pages/CreateTicketPage';
import { useAuth } from './hooks/auth';
import { Box, Typography } from '@mui/material';

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

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
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
            <ProtectedRoute requiredRoles={['Manager', 'IT Admin']}>
              <Layout>
                <DashboardPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute requiredRoles={['IT Admin']}>
              <Layout>
                <DashboardPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute requiredRoles={['IT Admin']}>
              <Layout>
                <DashboardPage />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppTheme>
        <AppContent />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </AppTheme>
    </Provider>
  );
}

export default App;
