import React from 'react';
import { Card, CardContent, Box, Typography, Grid } from '@mui/material';
import { Analytics } from '@mui/icons-material';
import { DashboardMetrics } from '../../../types';
import './PerformanceMetrics.css';

interface PerformanceMetricsProps {
  performanceMetrics: DashboardMetrics['performanceMetrics'];
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ performanceMetrics }) => {
  return (
    <Card className="performance-metrics-card">
      <CardContent className="performance-metrics-content">
        <Box className="performance-metrics-header">
          <Box className="performance-metrics-icon">
            <Analytics />
          </Box>
          <Typography variant="h5" className="performance-metrics-title">
            Performance Analytics
          </Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={6} md={3}>
            <Box className="performance-metric-item blue">
              <Typography variant="body2" className="performance-metric-label blue">
                Avg Resolution Time
              </Typography>
              <Typography variant="h4" className="performance-metric-value blue">
                {performanceMetrics.averageResolutionTime}h
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box className="performance-metric-item green">
              <Typography variant="body2" className="performance-metric-label green">
                First Response Time
              </Typography>
              <Typography variant="h4" className="performance-metric-value green">
                {performanceMetrics.firstResponseTime}h
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box className="performance-metric-item yellow">
              <Typography variant="body2" className="performance-metric-label yellow">
                Customer Satisfaction
              </Typography>
              <Typography variant="h4" className="performance-metric-value yellow">
                {performanceMetrics.customerSatisfactionScore}/5
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box className="performance-metric-item red">
              <Typography variant="body2" className="performance-metric-label red">
                Agent Productivity
              </Typography>
              <Typography variant="h4" className="performance-metric-value red">
                {performanceMetrics.agentProductivity}%
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PerformanceMetrics;
