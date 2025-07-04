import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Tab,
  Tabs,
  Card,
  CardContent,
  CardActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Badge,
} from '@mui/material';
import {
  Assessment as ReportIcon,
  TrendingUp as TrendingIcon,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  Timeline as TimelineIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Schedule as ScheduleIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Star as StarIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  Speed as SpeedIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  MonetizationOn as MoneyIcon,
  ThumbUp as ThumbUpIcon,
  Dashboard as DashboardIcon,
  Analytics as AnalyticsIcon,
  ShowChart as ChartIcon,
  NotificationsActive as AlertIcon,
  CompareArrows as CompareIcon,
  TableChart as TableIcon,
} from '@mui/icons-material';

interface Report {
  id: string;
  name: string;
  description: string;
  type: 'chart' | 'table' | 'dashboard' | 'kpi';
  category: string;
  createdBy: string;
  createdDate: string;
  lastRun: string;
  isScheduled: boolean;
  scheduleFrequency?: string;
  recipients?: string[];
  parameters: { [key: string]: any };
  tags: string[];
  isPublic: boolean;
  isFavorite: boolean;
  views: number;
  exports: number;
  rating: number;
  status: 'active' | 'draft' | 'archived';
}

interface KPIMetric {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
  status: 'good' | 'warning' | 'critical';
  description: string;
  category: string;
  lastUpdated: string;
}

const AdvancedAnalyticsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'create' | 'edit' | 'schedule' | 'export'>('create');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const [reports] = useState<Report[]>([
    {
      id: 'RPT-001',
      name: 'Ticket Volume Analysis',
      description: 'Daily ticket volume trends with category breakdown',
      type: 'chart',
      category: 'Tickets',
      createdBy: 'IT Manager',
      createdDate: '2024-03-01',
      lastRun: '2024-03-18',
      isScheduled: true,
      scheduleFrequency: 'Daily',
      recipients: ['manager@company.com', 'admin@company.com'],
      parameters: { dateRange: '30d', categories: ['all'], groupBy: 'day' },
      tags: ['tickets', 'volume', 'trends'],
      isPublic: true,
      isFavorite: true,
      views: 156,
      exports: 23,
      rating: 4.8,
      status: 'active',
    },
    {
      id: 'RPT-002',
      name: 'Agent Performance Dashboard',
      description: 'Comprehensive agent performance metrics and KPIs',
      type: 'dashboard',
      category: 'Performance',
      createdBy: 'HR Manager',
      createdDate: '2024-03-05',
      lastRun: '2024-03-18',
      isScheduled: true,
      scheduleFrequency: 'Weekly',
      recipients: ['hr@company.com'],
      parameters: { agents: ['all'], metrics: ['resolution_time', 'satisfaction', 'volume'] },
      tags: ['agents', 'performance', 'kpi'],
      isPublic: false,
      isFavorite: false,
      views: 89,
      exports: 12,
      rating: 4.5,
      status: 'active',
    },
    {
      id: 'RPT-003',
      name: 'SLA Compliance Report',
      description: 'Service Level Agreement compliance tracking and breach analysis',
      type: 'table',
      category: 'SLA',
      createdBy: 'Service Manager',
      createdDate: '2024-03-10',
      lastRun: '2024-03-17',
      isScheduled: true,
      scheduleFrequency: 'Monthly',
      recipients: ['service@company.com', 'management@company.com'],
      parameters: { slaTypes: ['all'], includeBreaches: true },
      tags: ['sla', 'compliance', 'breaches'],
      isPublic: true,
      isFavorite: true,
      views: 234,
      exports: 45,
      rating: 4.9,
      status: 'active',
    },
    {
      id: 'RPT-004',
      name: 'Customer Satisfaction Trends',
      description: 'Customer satisfaction scores and feedback analysis',
      type: 'chart',
      category: 'Customer',
      createdBy: 'Customer Success Manager',
      createdDate: '2024-03-12',
      lastRun: '2024-03-18',
      isScheduled: false,
      parameters: { period: '90d', includeComments: true },
      tags: ['satisfaction', 'customers', 'feedback'],
      isPublic: true,
      isFavorite: false,
      views: 67,
      exports: 8,
      rating: 4.3,
      status: 'active',
    },
  ]);

  const [kpiMetrics] = useState<KPIMetric[]>([
    {
      id: 'KPI-001',
      name: 'First Response Time',
      value: 2.3,
      target: 2.0,
      unit: 'hours',
      trend: 'down',
      changePercent: -8.5,
      status: 'warning',
      description: 'Average time to first response on tickets',
      category: 'Response',
      lastUpdated: '2024-03-18T16:00:00Z',
    },
    {
      id: 'KPI-002',
      name: 'Resolution Rate',
      value: 94.2,
      target: 95.0,
      unit: '%',
      trend: 'up',
      changePercent: 2.1,
      status: 'warning',
      description: 'Percentage of tickets resolved within SLA',
      category: 'Resolution',
      lastUpdated: '2024-03-18T16:00:00Z',
    },
    {
      id: 'KPI-003',
      name: 'Customer Satisfaction',
      value: 4.7,
      target: 4.5,
      unit: '/5',
      trend: 'up',
      changePercent: 4.4,
      status: 'good',
      description: 'Average customer satisfaction rating',
      category: 'Satisfaction',
      lastUpdated: '2024-03-18T16:00:00Z',
    },
    {
      id: 'KPI-004',
      name: 'Ticket Backlog',
      value: 23,
      target: 20,
      unit: 'tickets',
      trend: 'stable',
      changePercent: 0.0,
      status: 'warning',
      description: 'Number of open tickets past due',
      category: 'Backlog',
      lastUpdated: '2024-03-18T16:00:00Z',
    },
    {
      id: 'KPI-005',
      name: 'Agent Utilization',
      value: 87.5,
      target: 85.0,
      unit: '%',
      trend: 'up',
      changePercent: 3.2,
      status: 'good',
      description: 'Average agent utilization rate',
      category: 'Utilization',
      lastUpdated: '2024-03-18T16:00:00Z',
    },
    {
      id: 'KPI-006',
      name: 'Cost per Ticket',
      value: 45.6,
      target: 50.0,
      unit: '$',
      trend: 'down',
      changePercent: -6.2,
      status: 'good',
      description: 'Average cost to resolve a ticket',
      category: 'Cost',
      lastUpdated: '2024-03-18T16:00:00Z',
    },
  ]);

  const categories = [
    'all',
    'Tickets',
    'Performance',
    'SLA',
    'Customer',
    'Financial',
    'Operational',
  ];

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || report.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleReportSelect = (_report: Report) => {
    setDialogType('edit');
    setOpenDialog(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'success';
      case 'warning':
        return 'warning';
      case 'critical':
        return 'error';
      default:
        return 'default';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingIcon color="success" />;
      case 'down':
        return <TrendingIcon color="error" sx={{ transform: 'rotate(180deg)' }} />;
      case 'stable':
        return <CompareIcon color="action" />;
      default:
        return <CompareIcon />;
    }
  };

  const getKPIIcon = (category: string) => {
    switch (category) {
      case 'Response':
        return <SpeedIcon />;
      case 'Resolution':
        return <CheckCircleIcon />;
      case 'Satisfaction':
        return <ThumbUpIcon />;
      case 'Backlog':
        return <WarningIcon />;
      case 'Utilization':
        return <PersonIcon />;
      case 'Cost':
        return <MoneyIcon />;
      default:
        return <AnalyticsIcon />;
    }
  };

  const renderDashboardTab = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Executive Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* KPI Cards */}
        {kpiMetrics.map((kpi) => (
          <Grid item xs={12} md={6} lg={4} key={kpi.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ mr: 2, bgcolor: getStatusColor(kpi.status) + '.main' }}>
                    {getKPIIcon(kpi.category)}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">
                      {kpi.value}
                      {kpi.unit}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {kpi.name}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {getTrendIcon(kpi.trend)}
                    <Typography
                      variant="body2"
                      color={
                        kpi.changePercent > 0
                          ? 'success.main'
                          : kpi.changePercent < 0
                            ? 'error.main'
                            : 'text.secondary'
                      }
                      sx={{ ml: 1 }}
                    >
                      {kpi.changePercent > 0 ? '+' : ''}
                      {kpi.changePercent}%
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {kpi.description}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                    Target: {kpi.target}
                    {kpi.unit}
                  </Typography>
                  <Chip label={kpi.status} color={getStatusColor(kpi.status) as any} size="small" />
                </Box>

                <LinearProgress
                  variant="determinate"
                  value={Math.min((kpi.value / kpi.target) * 100, 100)}
                  color={getStatusColor(kpi.status) as any}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Chart Placeholder */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                <ChartIcon sx={{ mr: 1 }} />
                Ticket Volume Trends
              </Typography>
              <Box
                sx={{
                  height: 300,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'grey.50',
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  Chart visualization would be displayed here
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                <AlertIcon sx={{ mr: 1 }} />
                Recent Alerts
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'error.main' }}>
                      <WarningIcon />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText primary="SLA Breach Alert" secondary="Ticket TK-001 exceeded SLA" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'warning.main' }}>
                      <InfoIcon />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary="High Volume Alert"
                    secondary="50% increase in tickets today"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'success.main' }}>
                      <CheckCircleIcon />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary="Target Achieved"
                    secondary="Customer satisfaction goal met"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderReportsTab = () => (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search reports..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          sx={{ minWidth: 300 }}
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            label="Category"
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setDialogType('create');
            setOpenDialog(true);
          }}
        >
          New Report
        </Button>
        <Button variant="outlined" startIcon={<RefreshIcon />}>
          Refresh
        </Button>
      </Box>

      <Grid container spacing={3}>
        {filteredReports.map((report) => (
          <Grid item xs={12} md={6} lg={4} key={report.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                    {report.type === 'chart' ? (
                      <BarChartIcon />
                    ) : report.type === 'dashboard' ? (
                      <DashboardIcon />
                    ) : report.type === 'table' ? (
                      <TableIcon />
                    ) : (
                      <ReportIcon />
                    )}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h2">
                      {report.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {report.category}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {report.isFavorite && <StarIcon color="warning" />}
                    {report.isScheduled && <ScheduleIcon color="info" />}
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {report.description}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  {report.tags.map((tag) => (
                    <Chip key={tag} label={tag} size="small" variant="outlined" />
                  ))}
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Views: {report.views}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Exports: {report.exports}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Rating: {report.rating}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Created:</strong> {report.createdDate}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Last Run:</strong> {report.lastRun}
                  </Typography>
                  {report.isScheduled && (
                    <Typography variant="body2" color="text.secondary">
                      <strong>Schedule:</strong> {report.scheduleFrequency}
                    </Typography>
                  )}
                </Box>

                <Chip
                  label={report.status}
                  color={report.status === 'active' ? 'success' : 'default'}
                  size="small"
                />
              </CardContent>

              <CardActions>
                <Button size="small" onClick={() => handleReportSelect(report)}>
                  View
                </Button>
                <IconButton size="small">
                  <DownloadIcon />
                </IconButton>
                <IconButton size="small">
                  <ShareIcon />
                </IconButton>
                <IconButton size="small">
                  <EditIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderAnalyticsTab = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Advanced Analytics
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                <PieChartIcon sx={{ mr: 1 }} />
                Ticket Distribution by Category
              </Typography>
              <Box
                sx={{
                  height: 300,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'grey.50',
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  Pie chart would be displayed here
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                <TimelineIcon sx={{ mr: 1 }} />
                Response Time Trends
              </Typography>
              <Box
                sx={{
                  height: 300,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'grey.50',
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  Line chart would be displayed here
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                <BarChartIcon sx={{ mr: 1 }} />
                Agent Performance Comparison
              </Typography>
              <Box
                sx={{
                  height: 400,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'grey.50',
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  Bar chart would be displayed here
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderScheduledTab = () => (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
        <Typography variant="h6">Scheduled Reports</Typography>
        <Button
          variant="contained"
          startIcon={<ScheduleIcon />}
          onClick={() => {
            setDialogType('schedule');
            setOpenDialog(true);
          }}
        >
          Schedule Report
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Report Name</TableCell>
              <TableCell>Frequency</TableCell>
              <TableCell>Recipients</TableCell>
              <TableCell>Last Run</TableCell>
              <TableCell>Next Run</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports
              .filter((r) => r.isScheduled)
              .map((report) => (
                <TableRow key={report.id}>
                  <TableCell>{report.name}</TableCell>
                  <TableCell>{report.scheduleFrequency}</TableCell>
                  <TableCell>
                    <Badge badgeContent={report.recipients?.length || 0} color="primary">
                      <GroupIcon />
                    </Badge>
                  </TableCell>
                  <TableCell>{report.lastRun}</TableCell>
                  <TableCell>
                    {/* Calculate next run based on frequency */}
                    {new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={report.status}
                      color={report.status === 'active' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small">
                      <ViewIcon />
                    </IconButton>
                    <IconButton size="small">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        <AnalyticsIcon sx={{ mr: 2 }} />
        Advanced Analytics & Reporting
      </Typography>

      <Paper sx={{ width: '100%' }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Dashboard" icon={<DashboardIcon />} />
          <Tab label="Reports" icon={<ReportIcon />} />
          <Tab label="Analytics" icon={<AnalyticsIcon />} />
          <Tab label="Scheduled" icon={<ScheduleIcon />} />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {activeTab === 0 && renderDashboardTab()}
          {activeTab === 1 && renderReportsTab()}
          {activeTab === 2 && renderAnalyticsTab()}
          {activeTab === 3 && renderScheduledTab()}
        </Box>
      </Paper>

      {/* Create Report Dialog */}
      <Dialog
        open={openDialog && dialogType === 'create'}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create New Report</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField label="Report Name" fullWidth required />
            <TextField label="Description" multiline rows={3} fullWidth required />
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select label="Category">
                {categories
                  .filter((c) => c !== 'all')
                  .map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Report Type</InputLabel>
              <Select label="Report Type">
                <MenuItem value="chart">Chart</MenuItem>
                <MenuItem value="table">Table</MenuItem>
                <MenuItem value="dashboard">Dashboard</MenuItem>
                <MenuItem value="kpi">KPI</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Tags (comma separated)"
              fullWidth
              placeholder="e.g., tickets, performance, daily"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained">Create Report</Button>
        </DialogActions>
      </Dialog>

      {/* Schedule Report Dialog */}
      <Dialog
        open={openDialog && dialogType === 'schedule'}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Schedule Report</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Select Report</InputLabel>
              <Select label="Select Report">
                {reports.map((report) => (
                  <MenuItem key={report.id} value={report.id}>
                    {report.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Frequency</InputLabel>
              <Select label="Frequency">
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="quarterly">Quarterly</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Recipients (comma separated)"
              fullWidth
              placeholder="email1@company.com, email2@company.com"
            />
            <TextField
              label="Start Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Subject Template"
              fullWidth
              defaultValue="Scheduled Report: {report_name}"
            />
            <TextField
              label="Message Template"
              multiline
              rows={3}
              fullWidth
              defaultValue="Please find the attached {report_name} report."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained">Schedule Report</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdvancedAnalyticsPage;
