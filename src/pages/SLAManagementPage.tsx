import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  IconButton,
  Tooltip,
  Badge,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Warning,
  CheckCircle,
  Error,
  Timer,
  TrendingUp,
  Add,
  Edit,
  Delete,
  Visibility,
  NotificationsActive,
} from '@mui/icons-material';
import { useAppSelector } from '@/hooks/redux';
import { slaService } from '@/services/sla';
import { SLAPolicy, SLAMetrics, SLABreach } from '@/types/sla';
import { Ticket } from '@/types';

interface SLAManagementPageProps {}

const SLAManagementPage: React.FC<SLAManagementPageProps> = () => {
  const { tickets } = useAppSelector((state: any) => state.tickets);
  const [tabValue, setTabValue] = useState(0);
  const [slaPolicies, setSLAPolicies] = useState<SLAPolicy[]>([]);
  const [slaMetrics, setSLAMetrics] = useState<SLAMetrics[]>([]);
  const [slaBreaches, setSLABreaches] = useState<SLABreach[]>([]);
  const [ticketsAtRisk, setTicketsAtRisk] = useState<Ticket[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<SLAPolicy | null>(null);
  const [policyDialogOpen, setPolicyDialogOpen] = useState(false);
  const [breachDialogOpen, setBreachDialogOpen] = useState(false);
  useEffect(() => {
    loadSLAData();
  }, [tickets]);

  const loadSLAData = () => {
    // Load SLA policies
    const policies = slaService.getAllSLAPolicies();
    setSLAPolicies(policies);

    // Calculate metrics for all tickets
    const metrics = tickets
      .map((ticket: any) => slaService.calculateSLAMetrics(ticket))
      .filter((metric: any) => metric !== null) as SLAMetrics[];
    setSLAMetrics(metrics);

    // Get SLA breaches
    const breaches = slaService.checkSLABreaches(tickets);
    setSLABreaches(breaches);

    // Get tickets at risk
    const atRisk = slaService.getTicketsAtRisk(tickets);
    setTicketsAtRisk(atRisk);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAddPolicy = () => {
    setSelectedPolicy(null);
    setPolicyDialogOpen(true);
  };

  const handleEditPolicy = (policy: SLAPolicy) => {
    setSelectedPolicy(policy);
    setPolicyDialogOpen(true);
  };

  const handleDeletePolicy = (policyId: string) => {
    slaService.deleteSLAPolicy(policyId);
    loadSLAData();
  };

  const handleViewBreaches = (breaches: SLABreach[]) => {
    setSLABreaches(breaches);
    setBreachDialogOpen(true);
  };

  const getSLAStatusColor = (status: string) => {
    switch (status) {
      case 'on_track':
        return 'success';
      case 'at_risk':
        return 'warning';
      case 'breached':
        return 'error';
      default:
        return 'default';
    }
  };

  const getSLAStatusIcon = (status: string) => {
    switch (status) {
      case 'on_track':
        return <CheckCircle color="success" />;
      case 'at_risk':
        return <Warning color="warning" />;
      case 'breached':
        return <Error color="error" />;
      default:
        return <Timer />;
    }
  };

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const calculateComplianceRate = (): number => {
    const total = slaMetrics.length;
    const compliant = slaMetrics.filter((m) => m.status === 'on_track').length;
    return total > 0 ? (compliant / total) * 100 : 0;
  };

  const SLAOverviewTab = () => (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Key Metrics */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircle color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">SLA Compliance</Typography>
              </Box>
              <Typography variant="h3" color="success.main">
                {calculateComplianceRate().toFixed(1)}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={calculateComplianceRate()}
                color="success"
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Error color="error" sx={{ mr: 1 }} />
                <Typography variant="h6">SLA Breaches</Typography>
              </Box>
              <Typography variant="h3" color="error.main">
                {slaBreaches.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active breaches
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Warning color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6">At Risk</Typography>
              </Box>
              <Typography variant="h3" color="warning.main">
                {ticketsAtRisk.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tickets at risk
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Timer color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Avg Resolution</Typography>
              </Box>
              <Typography variant="h3" color="primary.main">
                {formatTime(240)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Average time
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Active Tickets with SLA Status */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Active Tickets - SLA Status
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Ticket</TableCell>
                      <TableCell>Priority</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>SLA Status</TableCell>
                      <TableCell>Time Remaining</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {slaMetrics.slice(0, 10).map((metric) => {
                      const ticket = tickets.find((t: any) => t.id === metric.ticketId);
                      if (!ticket) return null;

                      return (
                        <TableRow key={metric.ticketId}>
                          <TableCell>
                            <Box>
                              <Typography variant="body2" fontWeight="bold">
                                {ticket.title}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {ticket.ticketNumber}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={ticket.priority}
                              size="small"
                              color={ticket.priority === 'Critical' ? 'error' : 'default'}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip label={ticket.status} size="small" variant="outlined" />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {getSLAStatusIcon(metric.status)}
                              <Chip
                                label={metric.status.replace('_', ' ')}
                                size="small"
                                color={getSLAStatusColor(metric.status)}
                                sx={{ ml: 1 }}
                              />
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {formatTime(metric.timeRemaining)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Tooltip title="View Details">
                              <IconButton size="small">
                                <Visibility />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const SLAPoliciesTab = () => (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">SLA Policies</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleAddPolicy}>
          Add Policy
        </Button>
      </Box>

      <Grid container spacing={3}>
        {slaPolicies.map((policy) => (
          <Grid item xs={12} md={6} lg={4} key={policy.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">{policy.name}</Typography>
                  <Box>
                    <IconButton size="small" onClick={() => handleEditPolicy(policy)}>
                      <Edit />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDeletePolicy(policy.id)}>
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {policy.description}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={policy.priority}
                    size="small"
                    color={policy.priority === 'Critical' ? 'error' : 'default'}
                    sx={{ mr: 1 }}
                  />
                  {policy.category && (
                    <Chip label={policy.category} size="small" variant="outlined" />
                  )}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Response Time:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {formatTime(policy.responseTime)}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Resolution Time:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {formatTime(policy.resolutionTime)}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2">Business Hours:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {policy.businessHours.enabled ? 'Yes' : 'No'}
                  </Typography>
                </Box>

                <Box
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <NotificationsActive sx={{ mr: 1, fontSize: 16 }} />
                    <Typography variant="body2">
                      {policy.escalationRules.length} escalation rules
                    </Typography>
                  </Box>
                  <FormControlLabel
                    control={<Switch checked={policy.isActive} size="small" />}
                    label=""
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const SLABreachesTab = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        SLA Breaches
      </Typography>

      {slaBreaches.length === 0 ? (
        <Alert severity="success">
          No active SLA breaches. Great job maintaining service levels!
        </Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ticket</TableCell>
                <TableCell>Breach Type</TableCell>
                <TableCell>SLA Policy</TableCell>
                <TableCell>Breach Duration</TableCell>
                <TableCell>Escalation Level</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {slaBreaches.map((breach) => {
                const ticket = tickets.find((t: any) => t.id === breach.ticketId);
                if (!ticket) return null;

                return (
                  <TableRow key={breach.id}>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {ticket.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {ticket.ticketNumber}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={breach.breachType} size="small" color="error" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{breach.slaPolicy.name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="error.main">
                        {formatTime(breach.breachDuration)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Badge badgeContent={breach.escalationLevel} color="error">
                        <TrendingUp />
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={breach.isResolved ? 'Resolved' : 'Active'}
                        size="small"
                        color={breach.isResolved ? 'success' : 'error'}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleViewBreaches([breach])}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Overview" />
          <Tab label="SLA Policies" />
          <Tab label="Breaches" />
          <Tab label="Reports" />
        </Tabs>
      </Box>

      {tabValue === 0 && <SLAOverviewTab />}
      {tabValue === 1 && <SLAPoliciesTab />}
      {tabValue === 2 && <SLABreachesTab />}
      {tabValue === 3 && (
        <Box sx={{ p: 3 }}>
          <Typography variant="h5">SLA Reports</Typography>
          <Alert severity="info" sx={{ mt: 2 }}>
            Advanced SLA reporting features coming soon!
          </Alert>
        </Box>
      )}

      {/* Policy Dialog */}
      <Dialog
        open={policyDialogOpen}
        onClose={() => setPolicyDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{selectedPolicy ? 'Edit SLA Policy' : 'Create New SLA Policy'}</DialogTitle>
        <DialogContent>
          {/* Policy form would go here */}
          <Alert severity="info">SLA Policy form implementation in progress...</Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPolicyDialogOpen(false)}>Cancel</Button>
          <Button variant="contained">{selectedPolicy ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>

      {/* Breach Details Dialog */}
      <Dialog
        open={breachDialogOpen}
        onClose={() => setBreachDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>SLA Breach Details</DialogTitle>
        <DialogContent>
          {/* Breach details would go here */}
          <Alert severity="info">SLA Breach details implementation in progress...</Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBreachDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SLAManagementPage;
