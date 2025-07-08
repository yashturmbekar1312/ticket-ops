import React from 'react';
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

export interface MenuItem {
  text: string;
  icon: React.ReactNode;
  path: string;
  roles: string[];
}

export const menuItems: MenuItem[] = [
  { text: 'Dashboard', icon: React.createElement(Dashboard), path: '/dashboard', roles: ['all'] },
  {
    text: 'Tickets',
    icon: React.createElement(ConfirmationNumber),
    path: '/tickets',
    roles: ['all'],
  },
  {
    text: 'Create Ticket',
    icon: React.createElement(Add),
    path: '/tickets/create',
    roles: ['all'],
  },
  {
    text: 'Incidents',
    icon: React.createElement(IncidentIcon),
    path: '/incidents',
    roles: ['IT Agent', 'Team Lead', 'IT Admin', 'Admin'],
  },
  {
    text: 'SLA Management',
    icon: React.createElement(SLAIcon),
    path: '/sla',
    roles: ['IT Admin', 'Admin'],
  },
  {
    text: 'Reports',
    icon: React.createElement(Assessment),
    path: '/reports',
    roles: ['Manager', 'IT Admin', 'Admin'],
  },
  {
    text: 'Knowledge Base',
    icon: React.createElement(MenuBook),
    path: '/knowledge-base',
    roles: ['all'],
  },
  {
    text: 'Change Management',
    icon: React.createElement(ChangeCircle),
    path: '/change-management',
    roles: ['IT Admin', 'Admin', 'Team Lead'],
  },
  {
    text: 'Problem Management',
    icon: React.createElement(ProblemIcon),
    path: '/problem-management',
    roles: ['IT Agent', 'Team Lead', 'IT Admin', 'Admin'],
  },
  {
    text: 'Service Catalog',
    icon: React.createElement(ServiceCatalogIcon),
    path: '/service-catalog',
    roles: ['IT Admin', 'Admin', 'Manager'],
  },
  {
    text: 'Customer Portal',
    icon: React.createElement(CustomerPortalIcon),
    path: '/customer-portal',
    roles: ['all'],
  },
  {
    text: 'Communication Hub',
    icon: React.createElement(CommunicationIcon),
    path: '/communication-hub',
    roles: ['IT Agent', 'Team Lead', 'IT Admin', 'Admin'],
  },
  {
    text: 'Asset Management',
    icon: React.createElement(Inventory),
    path: '/asset-management',
    roles: ['IT Admin', 'Admin', 'IT Agent'],
  },
  {
    text: 'Workflow Management',
    icon: React.createElement(Settings),
    path: '/workflow-management',
    roles: ['IT Admin', 'Admin'],
  },
  {
    text: 'User Management',
    icon: React.createElement(People),
    path: '/user-management',
    roles: ['IT Admin', 'Admin'],
  },
  {
    text: 'Integrations',
    icon: React.createElement(IntegrationIcon),
    path: '/integrations',
    roles: ['IT Admin', 'Admin'],
  },
  {
    text: 'Automation Rules',
    icon: React.createElement(AutomationIcon),
    path: '/automation-rules',
    roles: ['IT Admin', 'Admin'],
  },
  {
    text: 'Approvals',
    icon: React.createElement(ApprovalIcon),
    path: '/approvals',
    roles: ['Manager', 'Team Lead', 'IT Admin', 'Admin'],
  },
  {
    text: 'Time Tracking',
    icon: React.createElement(TimeTrackingIcon),
    path: '/time-tracking',
    roles: ['IT Agent', 'Team Lead', 'IT Admin', 'Admin'],
  },
  {
    text: 'Settings',
    icon: React.createElement(Settings),
    path: '/settings',
    roles: ['IT Admin', 'Admin'],
  },
];

export const adminMenuItems: MenuItem[] = [
  {
    text: 'Admin Dashboard',
    icon: React.createElement(Business),
    path: '/admin/dashboard',
    roles: ['IT Admin', 'Admin'],
  },
  {
    text: 'System Configuration',
    icon: React.createElement(AdminPanelSettings),
    path: '/admin/configuration',
    roles: ['IT Admin', 'Admin'],
  },
  {
    text: 'System Settings',
    icon: React.createElement(SystemSettingsIcon),
    path: '/system-settings',
    roles: ['IT Admin', 'Admin'],
  },
  {
    text: 'Bulk Operations',
    icon: React.createElement(BatchPrediction),
    path: '/admin/bulk-operations',
    roles: ['IT Admin', 'Admin'],
  },
  {
    text: 'Audit & Security',
    icon: React.createElement(Security),
    path: '/admin/audit-security',
    roles: ['IT Admin', 'Admin'],
  },
];
