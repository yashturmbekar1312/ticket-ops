import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './redux/store';
import { AppTheme } from './components/theme/AppTheme';
import { AppRoutes } from './routes/AppRoutes';
import { NotificationProvider } from './components/common/NotificationProvider';
import { useAuth } from './hooks/auth';

function AppContent() {
  const { user } = useAuth();
  
  return (
    <NotificationProvider userId={user?.id || 'guest'}>
      <AppRoutes />
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
    </NotificationProvider>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppTheme>
        <Router>
          <AppContent />
        </Router>
      </AppTheme>
    </Provider>
  );
}

export default App;
