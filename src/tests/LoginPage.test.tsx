import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { LoginPage } from '../pages/LoginPage';
import authReducer from '../redux/authSlice';

// Mock store setup
const createMockStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
  });
};

const renderWithProviders = (component: React.ReactElement) => {
  const store = createMockStore();
  return render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>
  );
};

describe('LoginPage', () => {
  test('renders login form', () => {
    renderWithProviders(<LoginPage />);

    expect(screen.getByText('TicketOps')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  test('shows demo users', () => {
    renderWithProviders(<LoginPage />);

    expect(screen.getByText('Demo Users')).toBeInTheDocument();
    expect(screen.getByText('IT Admin')).toBeInTheDocument();
    expect(screen.getByText('Manager')).toBeInTheDocument();
    expect(screen.getByText('HR')).toBeInTheDocument();
    expect(screen.getByText('Employee')).toBeInTheDocument();
  });

  test('validates required fields', async () => {
    renderWithProviders(<LoginPage />);

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
  });

  test('fills form when demo user button is clicked', () => {
    renderWithProviders(<LoginPage />);

    const adminButton = screen.getAllByText('Use This Account')[0];
    fireEvent.click(adminButton);

    const emailInput = screen.getByDisplayValue('admin@company.com');
    const passwordInput = screen.getByDisplayValue('password');

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
  });
});
