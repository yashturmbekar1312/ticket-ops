import * as React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Dashboard,
  ConfirmationNumber,
  Add,
  People,
  Assessment,
  MenuBook,
  Inventory,
  Settings,
  Warning as IncidentIcon,
  Timer as SLAIcon,
  ChangeCircle,
  AdminPanelSettings,
  Security,
  BatchPrediction,
  Business,
  ShoppingCart as ServiceCatalogIcon,
  Support as CustomerPortalIcon,
  Psychology as ProblemIcon,
  Chat as CommunicationIcon,
  Link as IntegrationIcon,
  AutoFixHigh as AutomationIcon,
  Approval as ApprovalIcon,
  AccessTime as TimeTrackingIcon,
  SettingsApplications as SystemSettingsIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/auth';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard', roles: ['all'] },
    { text: 'Tickets', icon: <ConfirmationNumber />, path: '/tickets', roles: ['all'] },
    { text: 'Create Ticket', icon: <Add />, path: '/tickets/create', roles: ['all'] },
    {
      text: 'Incidents',
      icon: <IncidentIcon />,
      path: '/incidents',
      roles: ['IT Agent', 'Team Lead', 'IT Admin', 'Admin'],
    },
    {
      text: 'SLA Management',
      icon: <SLAIcon />,
      path: '/sla',
      roles: ['IT Admin', 'Admin'],
    },
    {
      text: 'Reports',
      icon: <Assessment />,
      path: '/reports',
      roles: ['Manager', 'IT Admin', 'Admin'],
    },
    { text: 'Knowledge Base', icon: <MenuBook />, path: '/knowledge-base', roles: ['all'] },
    {
      text: 'Change Management',
      icon: <ChangeCircle />,
      path: '/change-management',
      roles: ['IT Admin', 'Admin', 'Team Lead'],
    },
    {
      text: 'Problem Management',
      icon: <ProblemIcon />,
      path: '/problem-management',
      roles: ['IT Agent', 'Team Lead', 'IT Admin', 'Admin'],
    },
    {
      text: 'Service Catalog',
      icon: <ServiceCatalogIcon />,
      path: '/service-catalog',
      roles: ['IT Admin', 'Admin', 'Manager'],
    },
    {
      text: 'Customer Portal',
      icon: <CustomerPortalIcon />,
      path: '/customer-portal',
      roles: ['all'],
    },
    {
      text: 'Communication Hub',
      icon: <CommunicationIcon />,
      path: '/communication-hub',
      roles: ['IT Agent', 'Team Lead', 'IT Admin', 'Admin'],
    },
    {
      text: 'Asset Management',
      icon: <Inventory />,
      path: '/asset-management',
      roles: ['IT Admin', 'Admin', 'IT Agent'],
    },
    {
      text: 'Workflow Management',
      icon: <Settings />,
      path: '/workflow-management',
      roles: ['IT Admin', 'Admin'],
    },
    {
      text: 'User Management',
      icon: <People />,
      path: '/user-management',
      roles: ['IT Admin', 'Admin'],
    },
    {
      text: 'Integrations',
      icon: <IntegrationIcon />,
      path: '/integrations',
      roles: ['IT Admin', 'Admin'],
    },
    {
      text: 'Automation Rules',
      icon: <AutomationIcon />,
      path: '/automation-rules',
      roles: ['IT Admin', 'Admin'],
    },
    {
      text: 'Approvals',
      icon: <ApprovalIcon />,
      path: '/approvals',
      roles: ['Manager', 'Team Lead', 'IT Admin', 'Admin'],
    },
    {
      text: 'Time Tracking',
      icon: <TimeTrackingIcon />,
      path: '/time-tracking',
      roles: ['IT Agent', 'Team Lead', 'IT Admin', 'Admin'],
    },
    { text: 'Settings', icon: <Settings />, path: '/settings', roles: ['IT Admin', 'Admin'] },
  ];

  const adminMenuItems = [
    {
      text: 'Admin Dashboard',
      icon: <Business />,
      path: '/admin/dashboard',
      roles: ['IT Admin', 'Admin'],
    },
    {
      text: 'System Configuration',
      icon: <AdminPanelSettings />,
      path: '/admin/configuration',
      roles: ['IT Admin', 'Admin'],
    },
    {
      text: 'System Settings',
      icon: <SystemSettingsIcon />,
      path: '/system-settings',
      roles: ['IT Admin', 'Admin'],
    },
    {
      text: 'Bulk Operations',
      icon: <BatchPrediction />,
      path: '/admin/bulk-operations',
      roles: ['IT Admin', 'Admin'],
    },
    {
      text: 'Audit & Security',
      icon: <Security />,
      path: '/admin/audit-security',
      roles: ['IT Admin', 'Admin'],
    },
  ];

  const canAccessMenuItem = (itemRoles: string[]) => {
    if (itemRoles.includes('all')) return true;
    if (!user?.role) return false;
    return itemRoles.includes(user.role);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const drawerContent = (
    <Box sx={{ width: 280, height: '100%', backgroundColor: '#ffffff' }}>
      {/* Header Section */}
      <Box
        sx={{
          p: 3,
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                color: 'white',
                fontSize: '1.1rem',
              }}
            >
              T
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: '#1f2937',
                fontSize: '1.1rem',
                lineHeight: 1.2,
              }}
            >
              TicketOps
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: '#6b7280',
                fontSize: '0.7rem',
                fontWeight: 500,
              }}
            >
              Service Management
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* User Info Section */}
      {user && (
        <Box
          sx={{
            p: 3,
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb',
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 600,
                  color: '#6366f1',
                  fontSize: '1rem',
                }}
              >
                {user.name?.charAt(0)}
              </Typography>
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: '#1f2937',
                  fontSize: '0.875rem',
                  lineHeight: 1.3,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {user.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                <Box
                  sx={{
                    px: 1.5,
                    py: 0.25,
                    borderRadius: '6px',
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    color: 'white',
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {user.role}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      )}

      {/* Main Navigation */}
      <Box sx={{ px: 2, py: 2 }}>
        <Typography
          variant="overline"
          sx={{
            color: '#6b7280',
            fontSize: '0.65rem',
            fontWeight: 700,
            letterSpacing: '0.05em',
            px: 2,
            mb: 1,
            display: 'block',
          }}
        >
          Main Menu
        </Typography>
        <List sx={{ p: 0 }}>
          {menuItems
            .filter((item) => canAccessMenuItem(item.roles))
            .map((item) => (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  selected={location.pathname === item.path}
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    borderRadius: 2,
                    mx: 1,
                    px: 2,
                    py: 1.5,
                    minHeight: 48,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      backgroundColor: '#f8fafc',
                      transform: 'translateX(4px)',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    },
                    '&.Mui-selected': {
                      backgroundColor: '#ede9fe',
                      background: 'linear-gradient(135deg, #ede9fe 0%, #f3f4f6 100%)',
                      boxShadow: '0 2px 8px rgba(99, 102, 241, 0.1)',
                      '&:hover': {
                        backgroundColor: '#ddd6fe',
                        transform: 'translateX(4px)',
                      },
                      '& .MuiListItemIcon-root': {
                        color: '#6366f1',
                      },
                      '& .MuiListItemText-primary': {
                        color: '#4f46e5',
                        fontWeight: 600,
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 44,
                      color: '#6b7280',
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: '#374151',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
        </List>
      </Box>

      {/* Admin Section */}
      {user?.role && ['IT Admin', 'Admin'].includes(user.role) && (
        <Box sx={{ px: 2, py: 1 }}>
          <Typography
            variant="overline"
            sx={{
              color: '#6b7280',
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
              px: 2,
              mb: 1,
              display: 'block',
            }}
          >
            Administration
          </Typography>
          <List sx={{ p: 0 }}>
            {adminMenuItems
              .filter((item) => canAccessMenuItem(item.roles))
              .map((item) => (
                <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    selected={location.pathname === item.path}
                    onClick={() => handleNavigation(item.path)}
                    sx={{
                      borderRadius: 2,
                      mx: 1,
                      px: 2,
                      py: 1.5,
                      minHeight: 48,
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        backgroundColor: '#fef2f2',
                        transform: 'translateX(4px)',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      },
                      '&.Mui-selected': {
                        backgroundColor: '#fef2f2',
                        background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                        boxShadow: '0 2px 8px rgba(239, 68, 68, 0.1)',
                        '&:hover': {
                          backgroundColor: '#fee2e2',
                          transform: 'translateX(4px)',
                        },
                        '& .MuiListItemIcon-root': {
                          color: '#dc2626',
                        },
                        '& .MuiListItemText-primary': {
                          color: '#dc2626',
                          fontWeight: 600,
                        },
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 44,
                        color: '#6b7280',
                        transition: 'all 0.2s ease-in-out',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: '#374151',
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
          </List>
        </Box>
      )}

      {/* Footer */}
      <Box
        sx={{
          mt: 'auto',
          p: 2,
          borderTop: '1px solid #e5e7eb',
          backgroundColor: '#f8fafc',
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: '#6b7280',
            fontSize: '0.7rem',
            textAlign: 'center',
            display: 'block',
          }}
        >
          © 2024 TicketOps Pro
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'persistent'}
      open={open}
      onClose={onClose}
      sx={{
        width: 280,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 280,
          boxSizing: 'border-box',
          border: 'none',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
      }}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
