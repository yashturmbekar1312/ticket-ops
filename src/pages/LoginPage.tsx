import React from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../hooks/redux';
import { useAuth } from '../hooks/auth';
import { login } from '../redux/authSlice';
import { LoginFormData } from '../types';

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated } = useAuth();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const formik = useFormik<LoginFormData>({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      dispatch(login(values));
    },
  });

  const demoUsers = [
    {
      role: 'IT Admin',
      email: 'admin@company.com',
      password: 'password',
      description: 'Full system access, user management, all tickets',
    },
    {
      role: 'Manager',
      email: 'manager@company.com',
      password: 'password',
      description: 'Team tickets, assignments, priority management',
    },
    {
      role: 'HR',
      email: 'hr@company.com',
      password: 'password',
      description: 'HR tickets, onboarding, escalations',
    },
    {
      role: 'Employee',
      email: 'employee@company.com',
      password: 'password',
      description: 'Create tickets, view own tickets, add comments',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                TicketOps
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Professional Ticketing System
              </Typography>
            </Box>

            <form onSubmit={formik.handleSubmit}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                margin="normal"
                autoComplete="email"
                autoFocus
              />
              <TextField
                fullWidth
                id="password"
                name="password"
                label="Password"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                margin="normal"
                autoComplete="current-password"
              />

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Demo Users
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Use these credentials to test different role capabilities:
          </Typography>

          {demoUsers.map((user, index) => (
            <Card key={index} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  {user.role}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Email:</strong> {user.email}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Password:</strong> {user.password}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.description}
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  sx={{ mt: 1 }}
                  onClick={() => {
                    formik.setFieldValue('email', user.email);
                    formik.setFieldValue('password', user.password);
                  }}
                >
                  Use This Account
                </Button>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Grid>
    </Container>
  );
};
