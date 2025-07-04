import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Assessment,
  Download,
  Schedule,
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart,
  Timeline,
  Refresh,
  FilterList,
} from '@mui/icons-material';
import { useAuth } from '../hooks/auth';
import { DashboardStats } from '../types';

// Mock data for reports
const mockReportData: DashboardStats = {
  totalTickets: 1247,
  openTickets: 89,
  resolvedTickets: 1158,
  closedTickets: 1098,
  overdue: 15,
  slaBreached: 8,
  avgResolutionTime: 4.2,
  customerSatisfactionAvg: 4.1,
  ticketsByCategory: {
    Hardware: 234,
    Software: 456,
    Network: 178,
    Access: 123,
    HR: 89,
    Security: 67,
    Maintenance: 45,
    Account: 32,
    Training: 23,
    Other: 78,
  },
  ticketsByPriority: {
    Low: 456,
    Medium: 567,
    High: 178,
    Critical: 34,
    Urgent: 12,
  },
  ticketsByStatus: {
    New: 23,
    Open: 45,
    Assigned: 21,
    'In Progress': 67,
    Resolved: 89,
    Closed: 234,
    Escalated: 8,
    Pending: 12,
    Cancelled: 5,
  },
  recentActivity: [],
  topResolvers: [
    { userId: '1', userName: 'John Doe', count: 45 },
    { userId: '2', userName: 'Jane Smith', count: 38 },
    { userId: '3', userName: 'Bob Johnson', count: 32 },
  ],
};

const ReportsPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState(0);
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    to: new Date(),
  });
  const [reportData, setReportData] = useState<DashboardStats>(mockReportData);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState('overview');
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');

  const canViewReports =
    user?.role === 'Manager' || user?.role === 'IT Admin' || user?.role === 'Admin';

  useEffect(() => {
    if (canViewReports) {
      loadReportData();
    }
  }, [dateRange, selectedReport, canViewReports]);

  const loadReportData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setReportData(mockReportData);
    } catch (error) {
      console.error('Error loading report data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportReport = () => {
    // Simulate export functionality
    console.log(`Exporting report as ${exportFormat}`);
    setIsExportDialogOpen(false);
  };

  const renderOverviewReport = () => (
    <Grid container spacing={3}>
      {/* Key Metrics */}
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h4" color="primary">
                  {reportData.totalTickets}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Tickets
                </Typography>
              </Box>
              <Assessment color="primary" />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <TrendingUp color="success" sx={{ mr: 0.5 }} />
              <Typography variant="caption" color="success.main">
                +12% from last month
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h4" color="warning.main">
                  {reportData.openTickets}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Open Tickets
                </Typography>
              </Box>
              <Schedule color="warning" />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <TrendingDown color="success" sx={{ mr: 0.5 }} />
              <Typography variant="caption" color="success.main">
                -5% from last month
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h4" color="error.main">
                  {reportData.slaBreached}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  SLA Breached
                </Typography>
              </Box>
              <TrendingUp color="error" />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <TrendingUp color="error" sx={{ mr: 0.5 }} />
              <Typography variant="caption" color="error.main">
                +3% from last month
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h4" color="info.main">
                  {reportData.avgResolutionTime}h
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Avg Resolution Time
                </Typography>
              </Box>
              <Timeline color="info" />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <TrendingDown color="success" sx={{ mr: 0.5 }} />
              <Typography variant="caption" color="success.main">
                -0.8h from last month
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Charts Section */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Tickets by Category
            </Typography>
            <Box
              sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <PieChart sx={{ fontSize: 100, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                Chart visualization would go here
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Tickets by Priority
            </Typography>
            <Box
              sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <BarChart sx={{ fontSize: 100, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                Chart visualization would go here
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Top Resolvers */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Top Resolvers
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Resolved</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reportData.topResolvers.map((resolver) => (
                    <TableRow key={resolver.userId}>
                      <TableCell>{resolver.userName}</TableCell>
                      <TableCell align="right">{resolver.count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Customer Satisfaction */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Customer Satisfaction
            </Typography>
            <Box
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h2" color="success.main">
                  {reportData.customerSatisfactionAvg}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Average Rating (out of 5)
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderSLAReport = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              SLA Performance
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Priority</TableCell>
                    <TableCell>Target Response</TableCell>
                    <TableCell>Actual Response</TableCell>
                    <TableCell>Target Resolution</TableCell>
                    <TableCell>Actual Resolution</TableCell>
                    <TableCell>Compliance</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Chip label="Critical" color="error" size="small" />
                    </TableCell>
                    <TableCell>1h</TableCell>
                    <TableCell>0.8h</TableCell>
                    <TableCell>4h</TableCell>
                    <TableCell>3.2h</TableCell>
                    <TableCell>
                      <Chip label="95%" color="success" size="small" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Chip label="High" color="warning" size="small" />
                    </TableCell>
                    <TableCell>2h</TableCell>
                    <TableCell>1.5h</TableCell>
                    <TableCell>8h</TableCell>
                    <TableCell>6.8h</TableCell>
                    <TableCell>
                      <Chip label="92%" color="success" size="small" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Chip label="Medium" color="info" size="small" />
                    </TableCell>
                    <TableCell>4h</TableCell>
                    <TableCell>3.2h</TableCell>
                    <TableCell>24h</TableCell>
                    <TableCell>18.5h</TableCell>
                    <TableCell>
                      <Chip label="88%" color="warning" size="small" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Chip label="Low" color="default" size="small" />
                    </TableCell>
                    <TableCell>8h</TableCell>
                    <TableCell>6.5h</TableCell>
                    <TableCell>72h</TableCell>
                    <TableCell>65.2h</TableCell>
                    <TableCell>
                      <Chip label="85%" color="warning" size="small" />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  if (!canViewReports) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          You don't have permission to view reports. Please contact your administrator.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Reports & Analytics
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button startIcon={<Refresh />} onClick={loadReportData} disabled={isLoading}>
            Refresh
          </Button>
          <Button
            startIcon={<Download />}
            onClick={() => setIsExportDialogOpen(true)}
            variant="outlined"
          >
            Export
          </Button>
        </Box>
      </Box>

      {/* Date Range and Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                label="From Date"
                type="date"
                value={dateRange.from.toISOString().split('T')[0]}
                onChange={(e) => setDateRange({ ...dateRange, from: new Date(e.target.value) })}
                size="small"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                label="To Date"
                type="date"
                value={dateRange.to.toISOString().split('T')[0]}
                onChange={(e) => setDateRange({ ...dateRange, to: new Date(e.target.value) })}
                size="small"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Report Type</InputLabel>
                <Select
                  value={selectedReport}
                  onChange={(e) => setSelectedReport(e.target.value)}
                  label="Report Type"
                >
                  <MenuItem value="overview">Overview</MenuItem>
                  <MenuItem value="sla">SLA Performance</MenuItem>
                  <MenuItem value="satisfaction">Customer Satisfaction</MenuItem>
                  <MenuItem value="performance">Agent Performance</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<FilterList />}
                onClick={loadReportData}
                disabled={isLoading}
              >
                Apply Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Report Content */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Tabs
            value={selectedTab}
            onChange={(_, newValue) => setSelectedTab(newValue)}
            sx={{ mb: 3 }}
          >
            <Tab label="Overview" />
            <Tab label="SLA Performance" />
            <Tab label="Trends" />
            <Tab label="Custom" />
          </Tabs>

          {selectedTab === 0 && renderOverviewReport()}
          {selectedTab === 1 && renderSLAReport()}
          {selectedTab === 2 && (
            <Alert severity="info">
              Trends analysis coming soon. This will show ticket volume trends, resolution time
              trends, and seasonal patterns.
            </Alert>
          )}
          {selectedTab === 3 && (
            <Alert severity="info">
              Custom report builder coming soon. This will allow you to create custom reports with
              specific metrics and visualizations.
            </Alert>
          )}
        </>
      )}

      {/* Export Dialog */}
      <Dialog open={isExportDialogOpen} onClose={() => setIsExportDialogOpen(false)}>
        <DialogTitle>Export Report</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Format</InputLabel>
            <Select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              label="Format"
            >
              <MenuItem value="pdf">PDF</MenuItem>
              <MenuItem value="excel">Excel</MenuItem>
              <MenuItem value="csv">CSV</MenuItem>
            </Select>
          </FormControl>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            The report will be exported with the current filters and date range applied.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsExportDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleExportReport} variant="contained">
            Export
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReportsPage;
