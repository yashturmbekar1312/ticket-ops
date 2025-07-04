import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  List,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  LinearProgress,
  Stack,
  Avatar,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import {
  Warning as WarningIcon,
  BugReport as BugIcon,
  Security as SecurityIcon,
  NetworkCheck as NetworkIcon,
  Computer as HardwareIcon,
  Error as ErrorIcon,
  CheckCircle as ResolvedIcon,
  Schedule as PendingIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
  TrendingUp as EscalationIcon,
  Link as LinkIcon,
  PlayArrow as StartIcon,
  Update as UpdateIcon,
} from '@mui/icons-material';
import { formatDistanceToNow, format } from 'date-fns';

// Enhanced incident types
interface Incident {
  id: string;
  incidentNumber: string;
  title: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical' | 'Major';
  category: 'Hardware' | 'Software' | 'Network' | 'Security' | 'Service';
  status: 'New' | 'Investigating' | 'In Progress' | 'Resolved' | 'Closed' | 'Escalated';
  priority: 'P1' | 'P2' | 'P3' | 'P4' | 'P5';
  assignedTo?: string;
  assignedToName?: string;
  reportedBy: string;
  reportedByName: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  resolutionTime?: number;
  affectedUsers: number;
  businessImpact: 'None' | 'Low' | 'Medium' | 'High' | 'Critical';
  rootCause?: string;
  resolution?: string;
  workaround?: string;
  relatedTickets: string[];
  timelineEvents: IncidentTimelineEvent[];
  slaTarget: number; // hours
  slaRemaining: number; // hours
  isEscalated: boolean;
  escalationLevel: number;
  tags: string[];
}

interface IncidentTimelineEvent {
  id: string;
  type: 'created' | 'assigned' | 'status_change' | 'escalated' | 'comment' | 'resolved';
  description: string;
  userId: string;
  userName: string;
  timestamp: string;
  details?: Record<string, any>;
}

const MOCK_INCIDENTS: Incident[] = [
  {
    id: '1',
    incidentNumber: 'INC-2024-001',
    title: 'Email server outage affecting multiple departments',
    description: 'Complete email service unavailable. Users unable to send or receive emails.',
    severity: 'Critical',
    category: 'Service',
    status: 'Investigating',
    priority: 'P1',
    assignedTo: '1',
    assignedToName: 'John Admin',
    reportedBy: '2',
    reportedByName: 'Jane Manager',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
    affectedUsers: 250,
    businessImpact: 'Critical',
    relatedTickets: ['TKT-001', 'TKT-002'],
    timelineEvents: [
      {
        id: '1',
        type: 'created',
        description: 'Incident reported',
        userId: '2',
        userName: 'Jane Manager',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: '2',
        type: 'assigned',
        description: 'Assigned to John Admin',
        userId: '1',
        userName: 'System',
        timestamp: new Date(Date.now() - 3000000).toISOString(),
      },
      {
        id: '3',
        type: 'status_change',
        description: 'Status changed to Investigating',
        userId: '1',
        userName: 'John Admin',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
      },
    ],
    slaTarget: 4,
    slaRemaining: 2.5,
    isEscalated: false,
    escalationLevel: 0,
    tags: ['email', 'outage', 'critical'],
  },
  {
    id: '2',
    incidentNumber: 'INC-2024-002',
    title: 'Network connectivity issues in Building A',
    description: 'Intermittent network connectivity affecting Floor 3 and 4',
    severity: 'High',
    category: 'Network',
    status: 'In Progress',
    priority: 'P2',
    assignedTo: '3',
    assignedToName: 'Bob IT Agent',
    reportedBy: '4',
    reportedByName: 'Alice Employee',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date(Date.now() - 900000).toISOString(),
    affectedUsers: 45,
    businessImpact: 'Medium',
    workaround: 'Use WiFi connection as temporary solution',
    relatedTickets: ['TKT-003'],
    timelineEvents: [
      {
        id: '1',
        type: 'created',
        description: 'Incident reported',
        userId: '4',
        userName: 'Alice Employee',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        id: '2',
        type: 'assigned',
        description: 'Assigned to Bob IT Agent',
        userId: '1',
        userName: 'System',
        timestamp: new Date(Date.now() - 6600000).toISOString(),
      },
    ],
    slaTarget: 8,
    slaRemaining: 5.8,
    isEscalated: false,
    escalationLevel: 0,
    tags: ['network', 'building-a', 'connectivity'],
  },
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'Critical':
    case 'Major':
      return 'error';
    case 'High':
      return 'warning';
    case 'Medium':
      return 'info';
    case 'Low':
      return 'success';
    default:
      return 'default';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'New':
      return 'primary';
    case 'Investigating':
    case 'In Progress':
      return 'warning';
    case 'Resolved':
    case 'Closed':
      return 'success';
    case 'Escalated':
      return 'error';
    default:
      return 'default';
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Hardware':
      return <HardwareIcon />;
    case 'Software':
      return <BugIcon />;
    case 'Network':
      return <NetworkIcon />;
    case 'Security':
      return <SecurityIcon />;
    case 'Service':
      return <WarningIcon />;
    default:
      return <ErrorIcon />;
  }
};

const getTimelineIcon = (type: string) => {
  switch (type) {
    case 'created':
      return <StartIcon />;
    case 'assigned':
      return <PersonIcon />;
    case 'status_change':
      return <UpdateIcon />;
    case 'escalated':
      return <EscalationIcon />;
    case 'resolved':
      return <ResolvedIcon />;
    default:
      return <TimeIcon />;
  }
};

export const IncidentManagementPage: React.FC = () => {
  const [incidents] = useState<Incident[]>(MOCK_INCIDENTS);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newIncidentOpen, setNewIncidentOpen] = useState(false);

  const handleIncidentClick = (incident: Incident) => {
    setSelectedIncident(incident);
    setDialogOpen(true);
  };

  const criticalIncidents = incidents.filter(
    (i) => i.severity === 'Critical' || i.severity === 'Major'
  );
  const openIncidents = incidents.filter((i) => !['Resolved', 'Closed'].includes(i.status));
  const breachedSLA = incidents.filter((i) => i.slaRemaining <= 0);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Incident Management</Typography>
        <Button
          variant="contained"
          startIcon={<WarningIcon />}
          onClick={() => setNewIncidentOpen(true)}
        >
          Report Incident
        </Button>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'error.main' }}>
                  <WarningIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" color="error.main">
                    {criticalIncidents.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Critical Incidents
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <PendingIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" color="warning.main">
                    {openIncidents.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Open Incidents
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'error.main' }}>
                  <TimeIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" color="error.main">
                    {breachedSLA.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    SLA Breached
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <ResolvedIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" color="success.main">
                    {incidents.filter((i) => i.status === 'Resolved').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Resolved Today
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Critical Incidents Alert */}
      {criticalIncidents.length > 0 && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            {criticalIncidents.length} Critical Incident{criticalIncidents.length > 1 ? 's' : ''}{' '}
            Requiring Immediate Attention
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {criticalIncidents.map((incident) => (
              <Chip
                key={incident.id}
                label={incident.incidentNumber}
                onClick={() => handleIncidentClick(incident)}
                clickable
                size="small"
              />
            ))}
          </Stack>
        </Alert>
      )}

      {/* Incidents List */}
      <Grid container spacing={3}>
        {incidents.map((incident) => (
          <Grid item xs={12} key={incident.id}>
            <Card
              sx={{
                cursor: 'pointer',
                '&:hover': { backgroundColor: 'action.hover' },
                borderLeft: `4px solid ${
                  incident.severity === 'Critical' || incident.severity === 'Major'
                    ? 'error.main'
                    : incident.severity === 'High'
                      ? 'warning.main'
                      : 'info.main'
                }`,
              }}
              onClick={() => handleIncidentClick(incident)}
            >
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      {getCategoryIcon(incident.category)}
                      <Typography variant="h6">{incident.title}</Typography>
                      <Chip label={incident.incidentNumber} size="small" variant="outlined" />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {incident.description}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip
                        label={incident.severity}
                        size="small"
                        color={getSeverityColor(incident.severity) as any}
                      />
                      <Chip
                        label={incident.status}
                        size="small"
                        color={getStatusColor(incident.status) as any}
                        variant="outlined"
                      />
                      <Chip
                        label={`${incident.affectedUsers} users`}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <Typography variant="body2" color="text.secondary">
                      Assigned to: {incident.assignedToName || 'Unassigned'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Created:{' '}
                      {formatDistanceToNow(new Date(incident.createdAt), { addSuffix: true })}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Business Impact: {incident.businessImpact}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        SLA Progress
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={
                          ((incident.slaTarget - incident.slaRemaining) / incident.slaTarget) * 100
                        }
                        color={
                          incident.slaRemaining <= 1
                            ? 'error'
                            : incident.slaRemaining <= 2
                              ? 'warning'
                              : 'primary'
                        }
                        sx={{ mt: 0.5 }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {incident.slaRemaining > 0
                          ? `${incident.slaRemaining}h remaining`
                          : 'SLA Breached'}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Incident Detail Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="lg" fullWidth>
        {selectedIncident && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {getCategoryIcon(selectedIncident.category)}
                <Box>
                  <Typography variant="h6">{selectedIncident.title}</Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    {selectedIncident.incidentNumber}
                  </Typography>
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedIncident.description}
                  </Typography>

                  {selectedIncident.workaround && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                      <Typography variant="subtitle2">Workaround Available:</Typography>
                      <Typography variant="body2">{selectedIncident.workaround}</Typography>
                    </Alert>
                  )}

                  {selectedIncident.resolution && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                      <Typography variant="subtitle2">Resolution:</Typography>
                      <Typography variant="body2">{selectedIncident.resolution}</Typography>
                    </Alert>
                  )}

                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Timeline
                  </Typography>
                  <Timeline>
                    {selectedIncident.timelineEvents.map((event, index) => (
                      <TimelineItem key={event.id}>
                        <TimelineSeparator>
                          <TimelineDot color="primary">{getTimelineIcon(event.type)}</TimelineDot>
                          {index < selectedIncident.timelineEvents.length - 1 && (
                            <TimelineConnector />
                          )}
                        </TimelineSeparator>
                        <TimelineContent>
                          <Typography variant="subtitle2">{event.description}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {event.userName} • {format(new Date(event.timestamp), 'MMM dd, HH:mm')}
                          </Typography>
                        </TimelineContent>
                      </TimelineItem>
                    ))}
                  </Timeline>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Details
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Status:</Typography>
                        <Chip
                          label={selectedIncident.status}
                          size="small"
                          color={getStatusColor(selectedIncident.status) as any}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Severity:</Typography>
                        <Chip
                          label={selectedIncident.severity}
                          size="small"
                          color={getSeverityColor(selectedIncident.severity) as any}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Priority:</Typography>
                        <Typography variant="body2">{selectedIncident.priority}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Affected Users:</Typography>
                        <Typography variant="body2">{selectedIncident.affectedUsers}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Business Impact:</Typography>
                        <Typography variant="body2">{selectedIncident.businessImpact}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Assigned To:</Typography>
                        <Typography variant="body2">
                          {selectedIncident.assignedToName || 'Unassigned'}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>

                  {selectedIncident.relatedTickets.length > 0 && (
                    <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Related Tickets
                      </Typography>
                      <List dense>
                        {selectedIncident.relatedTickets.map((ticketId) => (
                          <ListItemButton key={ticketId}>
                            <ListItemIcon>
                              <LinkIcon />
                            </ListItemIcon>
                            <ListItemText primary={ticketId} />
                          </ListItemButton>
                        ))}
                      </List>
                    </Paper>
                  )}

                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Tags
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selectedIncident.tags.map((tag) => (
                        <Chip key={tag} label={tag} size="small" variant="outlined" />
                      ))}
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Close</Button>
              <Button variant="contained">Update Incident</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* New Incident Dialog */}
      <Dialog
        open={newIncidentOpen}
        onClose={() => setNewIncidentOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Report New Incident</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Incident Title"
                placeholder="Brief description of the incident"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                placeholder="Detailed description of the incident"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Severity</InputLabel>
                <Select defaultValue="">
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Critical">Critical</MenuItem>
                  <MenuItem value="Major">Major</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select defaultValue="">
                  <MenuItem value="Hardware">Hardware</MenuItem>
                  <MenuItem value="Software">Software</MenuItem>
                  <MenuItem value="Network">Network</MenuItem>
                  <MenuItem value="Security">Security</MenuItem>
                  <MenuItem value="Service">Service</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Affected Users"
                placeholder="Number of affected users"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Business Impact</InputLabel>
                <Select defaultValue="">
                  <MenuItem value="None">None</MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Critical">Critical</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewIncidentOpen(false)}>Cancel</Button>
          <Button variant="contained">Report Incident</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default IncidentManagementPage;
