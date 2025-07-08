import React from 'react';
import { Grid } from '@mui/material';
import { ConfirmationNumber, Schedule, Warning, CheckCircle } from '@mui/icons-material';
import { DashboardMetrics, SLAAlert, Ticket } from '../../../types';
import StatCard from '../StatCard';
import PerformanceMetrics from '../PerformanceMetrics';
import SLAAlerts from '../SLAAlerts';
import RecentTickets from '../RecentTickets';
import './DashboardOverview.css';

interface DashboardOverviewProps {
  dashboardData: DashboardMetrics;
  slaAlerts: SLAAlert[];
  recentTickets: Ticket[];
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  dashboardData,
  slaAlerts,
  recentTickets,
}) => {
  return (
    <Grid container spacing={4}>
      {/* Main Stats */}
      <Grid item xs={12} md={3}>
        <StatCard
          title="Total Tickets"
          value={dashboardData.totalTickets}
          icon={<ConfirmationNumber />}
          color="#6366f1"
          bgColor="#ede9fe"
          trend={{ value: 12.5, isPositive: true }}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <StatCard
          title="Open Tickets"
          value={dashboardData.openTickets}
          icon={<Schedule />}
          color="#f59e0b"
          bgColor="#fef3c7"
          trend={{ value: -5.2, isPositive: false }}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <StatCard
          title="SLA Breaches"
          value={dashboardData.slaBreachedTickets}
          icon={<Warning />}
          color="#ef4444"
          bgColor="#fee2e2"
          trend={{ value: -15.8, isPositive: true }}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <StatCard
          title="Resolved Today"
          value={32}
          icon={<CheckCircle />}
          color="#10b981"
          bgColor="#d1fae5"
          trend={{ value: 8.3, isPositive: true }}
        />
      </Grid>

      {/* Performance Metrics */}
      <Grid item xs={12} md={8}>
        <PerformanceMetrics performanceMetrics={dashboardData.performanceMetrics} />
      </Grid>

      {/* SLA Alerts */}
      <Grid item xs={12} md={4}>
        <SLAAlerts alerts={slaAlerts} />
      </Grid>

      {/* Recent Activity */}
      <Grid item xs={12}>
        <RecentTickets tickets={recentTickets} />
      </Grid>
    </Grid>
  );
};

export default DashboardOverview;
