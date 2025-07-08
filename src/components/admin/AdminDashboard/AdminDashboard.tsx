import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
} from '@mui/material';
import {
  Dashboard,
  Assignment,
  People,
  Settings,
  Refresh,
  AutoAwesome,
  CheckCircle,
} from '@mui/icons-material';
import { DashboardMetrics, Ticket, SLAAlert, ApprovalRequest } from '../../../types';
import DashboardOverview from '../DashboardOverview';
import TicketManagement from '../TicketManagement';
import ApprovalManagement from '../ApprovalManagement';
import UserTeamManagement from '../UserTeamManagement';
import AutomationSettings from '../AutomationSettings';
import SystemSettings from '../SystemSettings';
import TabPanel from '../TabPanel';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedDateRange, setSelectedDateRange] = useState('last30days');
  const [refreshing, setRefreshing] = useState(false);

  // Mock data - in production, this would come from API
  const dashboardData: DashboardMetrics = {
    totalTickets: 847,
    openTickets: 152,
    resolvedTickets: 695,
    overdueTickets: 23,
    slaBreachedTickets: 12,
    recentActivity: [],
    performanceMetrics: {
      averageResolutionTime: 24.5,
      firstResponseTime: 2.3,
      customerSatisfactionScore: 4.2,
      agentProductivity: 87,
      ticketVolumeThisMonth: 247,
      ticketVolumeLastMonth: 198,
    },
  };

  const slaAlerts: SLAAlert[] = [
    {
      ticketId: 'TK-001',
      ticketTitle: 'Critical server outage',
      priority: 'Critical',
      createdAt: '2024-07-07T08:00:00Z',
      dueDate: '2024-07-07T12:00:00Z',
      remainingTime: -30,
      escalationLevel: 2,
      alertType: 'breached',
    },
    {
      ticketId: 'TK-002',
      ticketTitle: 'Network connectivity issues',
      priority: 'High',
      createdAt: '2024-07-07T10:00:00Z',
      dueDate: '2024-07-07T14:00:00Z',
      remainingTime: 15,
      escalationLevel: 1,
      alertType: 'approaching',
    },
  ];

  const pendingApprovals: ApprovalRequest[] = [
    {
      id: 'AP-001',
      ticketId: 'TK-003',
      type: 'software',
      requestedBy: 'user1',
      requestedByName: 'John Doe',
      description: 'Adobe Creative Suite License',
      justification: 'Required for marketing campaign design',
      estimatedCost: 599,
      urgency: 'medium',
      createdAt: '2024-07-07T09:00:00Z',
      status: 'pending',
    },
    {
      id: 'AP-002',
      ticketId: 'TK-004',
      type: 'hardware',
      requestedBy: 'user2',
      requestedByName: 'Jane Smith',
      description: 'MacBook Pro 16" M3',
      justification: 'Current laptop is outdated and affecting productivity',
      estimatedCost: 2499,
      urgency: 'high',
      createdAt: '2024-07-07T11:00:00Z',
      status: 'pending',
    },
  ];

  const recentTickets: Ticket[] = [
    {
      id: 'TK-005',
      ticketNumber: 'TK-005',
      title: 'Email server maintenance',
      description: 'Scheduled maintenance for email server',
      category: 'Maintenance',
      priority: 'Medium',
      status: 'In Progress',
      createdBy: 'admin',
      createdByName: 'System Admin',
      assignedTo: 'agent1',
      assignedToName: 'Alice Johnson',
      department: 'IT',
      createdAt: '2024-07-07T12:00:00Z',
      updatedAt: '2024-07-07T12:30:00Z',
      slaBreached: false,
      tags: ['maintenance', 'email'],
      escalationLevel: 0,
      source: 'web',
    },
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box className="admin-dashboard">
      {/* Header */}
      <Box className="dashboard-header">
        <Typography variant="h4" className="dashboard-title">
          Admin Dashboard
        </Typography>
        <Typography variant="body1" className="dashboard-subtitle">
          Manage your ticket system, users, and configurations
        </Typography>
      </Box>

      {/* Controls */}
      <Box className="dashboard-controls">
        <Box />
        <Box className="controls-right">
          <FormControl size="small" className="date-range-select">
            <InputLabel>Date Range</InputLabel>
            <Select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              label="Date Range"
            >
              <MenuItem value="last7days">Last 7 Days</MenuItem>
              <MenuItem value="last30days">Last 30 Days</MenuItem>
              <MenuItem value="last3months">Last 3 Months</MenuItem>
              <MenuItem value="lastyear">Last Year</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleRefresh}
            disabled={refreshing}
            className="refresh-button"
          >
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </Box>
      </Box>

      {/* Navigation Tabs */}
      <Box className="dashboard-tabs">
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab icon={<Dashboard />} label="Overview" />
          <Tab icon={<Assignment />} label="Tickets" />
          <Tab icon={<CheckCircle />} label="Approvals" />
          <Tab icon={<People />} label="Users & Teams" />
          <Tab icon={<AutoAwesome />} label="Automation" />
          <Tab icon={<Settings />} label="Settings" />
        </Tabs>
      </Box>

      <TabPanel value={activeTab} index={0}>
        <DashboardOverview
          dashboardData={dashboardData}
          slaAlerts={slaAlerts}
          recentTickets={recentTickets}
        />
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        <TicketManagement />
      </TabPanel>
      <TabPanel value={activeTab} index={2}>
        <ApprovalManagement pendingApprovals={pendingApprovals} />
      </TabPanel>
      <TabPanel value={activeTab} index={3}>
        <UserTeamManagement />
      </TabPanel>
      <TabPanel value={activeTab} index={4}>
        <AutomationSettings />
      </TabPanel>
      <TabPanel value={activeTab} index={5}>
        <SystemSettings />
      </TabPanel>
    </Box>
  );
};

export default AdminDashboard;
