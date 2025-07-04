import React, { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';

// Lazy loading components
const Layout = React.lazy(() => import('./Layout'));

const LayoutLoader: React.FC = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
    <CircularProgress size={40} />
  </Box>
);

interface LazyLayoutProps {
  children: React.ReactNode;
}

export const LazyLayout: React.FC<LazyLayoutProps> = ({ children }) => {
  return (
    <Suspense fallback={<LayoutLoader />}>
      <Layout>{children}</Layout>
    </Suspense>
  );
};
