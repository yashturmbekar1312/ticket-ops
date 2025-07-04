import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './redux/store';
import { AppTheme } from './components/theme/AppTheme';
import { AppRoutes } from './routes/AppRoutes';

function App() {
  return (
    <Provider store={store}>
      <AppTheme>
        <Router>
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
        </Router>
      </AppTheme>
    </Provider>
  );
}

export default App;
