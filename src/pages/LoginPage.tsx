import * as React from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Grid,
  Card,
  CardContent,
  Avatar,
  IconButton,
  InputAdornment,
  Divider,
  Chip,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  Business,
  AdminPanelSettings,
  Engineering,
} from '@mui/icons-material';
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
  const [showPassword, setShowPassword] = React.useState(false);

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
      icon: <AdminPanelSettings />,
      color: '#dc2626',
      bgColor: '#fef2f2',
    },
    {
      role: 'Manager',
      email: 'manager@company.com',
      password: 'password',
      description: 'Team tickets, assignments, priority management',
      icon: <Business />,
      color: '#059669',
      bgColor: '#f0fdf4',
    },
    {
      role: 'HR',
      email: 'hr@company.com',
      password: 'password',
      description: 'HR tickets, onboarding, escalations',
      icon: <Person />,
      color: '#d97706',
      bgColor: '#fffbeb',
    },
    {
      role: 'Employee',
      email: 'employee@company.com',
      password: 'password',
      description: 'Create tickets, view own tickets, add comments',
      icon: <Engineering />,
      color: '#ff5d5d',
      bgColor: '#fff5f5',
    },
  ];

  const handleDemoLogin = (email: string, password: string) => {
    formik.setFieldValue('email', email);
    formik.setFieldValue('password', password);
    dispatch(login({ email, password }));
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #ff5d5d 0%, #ffffff 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          {/* Left Side - Login Form */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <CardContent sx={{ p: 6 }}>
                {/* Logo and Title */}
                <Box sx={{ textAlign: 'center', mb: 5 }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '20px',
                      background: 'linear-gradient(135deg, #ff5d5d 0%, #ffffff 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                      boxShadow: '0 20px 25px -5px rgba(255, 93, 93, 0.4)',
                    }}
                  >
                    <Typography
                      variant="h2"
                      sx={{
                        fontWeight: 800,
                        color: 'white',
                        fontSize: '2.5rem',
                      }}
                    >
                      T
                    </Typography>
                  </Box>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 800,
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      mb: 1,
                    }}
                  >
                    TicketOps
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#757575',
                      fontWeight: 500,
                      fontSize: '1.125rem',
                    }}
                  >
                    Professional IT Service Management
                  </Typography>
                </Box>

                {/* Login Form */}
                <form onSubmit={formik.handleSubmit}>
                  <Box sx={{ mb: 3 }}>
                    <TextField
                      fullWidth
                      id="email"
                      name="email"
                      label="Email Address"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.email && Boolean(formik.errors.email)}
                      helperText={formik.touched.email && formik.errors.email}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email sx={{ color: '#6b7280' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          backgroundColor: '#f8fafc',
                          '& fieldset': {
                            borderColor: '#e5e7eb',
                          },
                          '&:hover fieldset': {
                            borderColor: '#6366f1',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#6366f1',
                            boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1)',
                          },
                        },
                      }}
                    />
                  </Box>

                  <Box sx={{ mb: 4 }}>
                    <TextField
                      fullWidth
                      id="password"
                      name="password"
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.password && Boolean(formik.errors.password)}
                      helperText={formik.touched.password && formik.errors.password}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock sx={{ color: '#6b7280' }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          backgroundColor: '#f8fafc',
                          '& fieldset': {
                            borderColor: '#e5e7eb',
                          },
                          '&:hover fieldset': {
                            borderColor: '#6366f1',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#6366f1',
                            boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1)',
                          },
                        },
                      }}
                    />
                  </Box>

                  {error && (
                    <Alert
                      severity="error"
                      sx={{
                        mb: 3,
                        borderRadius: 2,
                        '& .MuiAlert-message': {
                          fontWeight: 500,
                        },
                      }}
                    >
                      {error}
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={isLoading}
                    sx={{
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 600,
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                        boxShadow: '0 8px 25px rgba(99, 102, 241, 0.6)',
                        transform: 'translateY(-2px)',
                      },
                      '&:disabled': {
                        background: '#e5e7eb',
                        color: '#9ca3af',
                      },
                    }}
                  >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>

                <Divider sx={{ my: 4, '&::before, &::after': { borderColor: '#e5e7eb' } }}>
                  <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 500 }}>
                    OR
                  </Typography>
                </Divider>

                <Typography variant="body2" sx={{ textAlign: 'center', color: '#6b7280' }}>
                  Don't have an account?{' '}
                  <Button
                    variant="text"
                    sx={{
                      fontWeight: 600,
                      color: '#6366f1',
                      textTransform: 'none',
                      p: 0,
                      minWidth: 'auto',
                      '&:hover': {
                        backgroundColor: 'transparent',
                        color: '#4f46e5',
                      },
                    }}
                  >
                    Contact Administrator
                  </Button>
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Side - Demo Users */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <CardContent sx={{ p: 6 }}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: '#1f2937',
                      mb: 2,
                    }}
                  >
                    Try Demo Accounts
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#6b7280', mb: 3 }}>
                    Click any role below to quickly sign in and explore the platform
                  </Typography>
                  <Chip
                    label="🚀 Quick Access"
                    sx={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                    }}
                  />
                </Box>

                <Grid container spacing={3}>
                  {demoUsers.map((user, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Card
                        sx={{
                          borderRadius: 3,
                          border: '1px solid #e5e7eb',
                          transition: 'all 0.3s ease-in-out',
                          cursor: 'pointer',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow:
                              '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                            borderColor: user.color,
                          },
                        }}
                        onClick={() => handleDemoLogin(user.email, user.password)}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Avatar
                              sx={{
                                width: 44,
                                height: 44,
                                backgroundColor: user.bgColor,
                                color: user.color,
                                mr: 2,
                              }}
                            >
                              {user.icon}
                            </Avatar>
                            <Box>
                              <Typography
                                variant="h6"
                                sx={{
                                  fontWeight: 600,
                                  color: '#1f2937',
                                  fontSize: '1rem',
                                  lineHeight: 1.2,
                                }}
                              >
                                {user.role}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: '#6b7280',
                                  fontSize: '0.75rem',
                                }}
                              >
                                {user.email}
                              </Typography>
                            </Box>
                          </Box>
                          <Typography
                            variant="body2"
                            sx={{
                              color: '#6b7280',
                              fontSize: '0.875rem',
                              lineHeight: 1.5,
                            }}
                          >
                            {user.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>

                <Box sx={{ mt: 4, textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: '0.75rem' }}>
                    All demo accounts use password: <strong>password</strong>
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LoginPage;
