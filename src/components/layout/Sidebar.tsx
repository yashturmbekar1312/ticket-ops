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
  Divider,
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
    <Box sx={{ width: 240, height: '100%' }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" component="h1" color="primary">
          Ticket Ops
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems
          .filter((item) => canAccessMenuItem(item.roles))
          .map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'primary.contrastText',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
      </List>
      {/* Admin Section */}
      {user?.role && ['IT Admin', 'Admin'].includes(user.role) && (
        <>
          <Divider />
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Administration
            </Typography>
          </Box>
          <List>
            {adminMenuItems
              .filter((item) => canAccessMenuItem(item.roles))
              .map((item) => (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton
                    selected={location.pathname === item.path}
                    onClick={() => handleNavigation(item.path)}
                    sx={{
                      '&.Mui-selected': {
                        backgroundColor: 'primary.main',
                        color: 'primary.contrastText',
                        '&:hover': {
                          backgroundColor: 'primary.dark',
                        },
                        '& .MuiListItemIcon-root': {
                          color: 'primary.contrastText',
                        },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              ))}
          </List>
        </>
      )}
    </Box>
  );

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'persistent'}
      open={open}
      onClose={onClose}
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          borderRight: `1px solid ${theme.palette.divider}`,
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
