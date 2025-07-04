import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Button,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Badge,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
} from '@mui/material';
import {
  Security,
  Shield,
  VpnKey,
  History,
  Visibility,
  Lock,
  Person,
  Computer,
  Warning,
  Error,
  Info,
  Block,
  Login,
  Edit,
  Download,
  Refresh,
  Search,
  ExpandMore,
  TrendingUp,
} from '@mui/icons-material';
import { useAuth } from '../hooks/auth';

interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  sessionId: string;
  success: boolean;
  errorMessage?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category:
    | 'authentication'
    | 'authorization'
    | 'data_access'
    | 'data_modification'
    | 'system'
    | 'security';
}

interface SecurityEvent {
  id: string;
  type:
    | 'failed_login'
    | 'suspicious_activity'
    | 'privilege_escalation'
    | 'data_breach'
    | 'malware'
    | 'unauthorized_access';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  userId?: string;
  userName?: string;
  ipAddress: string;
  location?: string;
  timestamp: string;
  status: 'open' | 'investigating' | 'resolved' | 'false_positive';
  assignedTo?: string;
  remediationSteps?: string[];
  relatedEvents?: string[];
}

interface UserSession {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  ipAddress: string;
  location: string;
  device: string;
  browser: string;
  startTime: string;
  lastActivity: string;
  isActive: boolean;
  activityCount: number;
  duration: number;
}

interface SystemPermission {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  resource: string;
  permission: string;
  grantedBy: string;
  grantedAt: string;
  expiresAt?: string;
  isActive: boolean;
  lastUsed?: string;
}

const SystemAuditSecurityPage: React.FC = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [selectedDateRange, setSelectedDateRange] = useState('7d');
  const [filterText, setFilterText] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [auditLogs] = useState<AuditLog[]>([
    {
      id: '1',
      timestamp: '2024-01-15T10:30:00Z',
      userId: 'user-1',
      userName: 'John Smith',
      userRole: 'IT Agent',
      action: 'UPDATE',
      resource: 'Ticket',
      resourceId: 'TKT-2024-001',
      details: 'Changed ticket status from Open to In Progress',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      sessionId: 'sess-12345',
      success: true,
      severity: 'low',
      category: 'data_modification',
    },
    {
      id: '2',
      timestamp: '2024-01-15T10:25:00Z',
      userId: 'user-2',
      userName: 'Jane Doe',
      userRole: 'User',
      action: 'LOGIN_ATTEMPT',
      resource: 'Authentication',
      details: 'Failed login attempt - invalid password',
      ipAddress: '10.0.0.50',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
      sessionId: 'sess-12346',
      success: false,
      errorMessage: 'Invalid credentials',
      severity: 'medium',
      category: 'authentication',
    },
    {
      id: '3',
      timestamp: '2024-01-15T10:20:00Z',
      userId: 'admin-1',
      userName: 'System Admin',
      userRole: 'Admin',
      action: 'DELETE',
      resource: 'User',
      resourceId: 'user-999',
      details: 'Deleted user account for terminated employee',
      ipAddress: '192.168.1.10',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      sessionId: 'sess-12347',
      success: true,
      severity: 'high',
      category: 'data_modification',
    },
  ]);

  const [securityEvents] = useState<SecurityEvent[]>([
    {
      id: '1',
      type: 'failed_login',
      severity: 'medium',
      title: 'Multiple Failed Login Attempts',
      description:
        'User "jane.doe" has 5 failed login attempts in the last 10 minutes from IP 10.0.0.50',
      userId: 'user-2',
      userName: 'Jane Doe',
      ipAddress: '10.0.0.50',
      location: 'New York, NY',
      timestamp: '2024-01-15T10:25:00Z',
      status: 'open',
      assignedTo: 'security-team',
      remediationSteps: [
        'Verify user identity',
        'Check if account is compromised',
        'Consider temporary account lock',
      ],
    },
    {
      id: '2',
      type: 'suspicious_activity',
      severity: 'high',
      title: 'Unusual Data Access Pattern',
      description: 'User accessed 50+ tickets in rapid succession outside normal business hours',
      userId: 'user-5',
      userName: 'Bob Johnson',
      ipAddress: '203.0.113.15',
      location: 'Unknown',
      timestamp: '2024-01-15T02:30:00Z',
      status: 'investigating',
      assignedTo: 'security-team',
      remediationSteps: [
        'Review access logs',
        'Contact user for verification',
        'Monitor ongoing activity',
      ],
    },
  ]);

  const [userSessions, setUserSessions] = useState<UserSession[]>([
    {
      id: '1',
      userId: 'user-1',
      userName: 'John Smith',
      userRole: 'IT Agent',
      ipAddress: '192.168.1.100',
      location: 'New York, NY',
      device: 'Windows Desktop',
      browser: 'Chrome 120',
      startTime: '2024-01-15T08:00:00Z',
      lastActivity: '2024-01-15T10:30:00Z',
      isActive: true,
      activityCount: 45,
      duration: 150, // minutes
    },
    {
      id: '2',
      userId: 'user-2',
      userName: 'Jane Doe',
      userRole: 'User',
      ipAddress: '10.0.0.50',
      location: 'Los Angeles, CA',
      device: 'iPhone',
      browser: 'Safari Mobile',
      startTime: '2024-01-15T09:15:00Z',
      lastActivity: '2024-01-15T10:20:00Z',
      isActive: false,
      activityCount: 12,
      duration: 65,
    },
  ]);

  const [systemPermissions] = useState<SystemPermission[]>([
    {
      id: '1',
      userId: 'user-1',
      userName: 'John Smith',
      userRole: 'IT Agent',
      resource: 'Tickets',
      permission: 'READ_WRITE',
      grantedBy: 'admin-1',
      grantedAt: '2024-01-01T00:00:00Z',
      isActive: true,
      lastUsed: '2024-01-15T10:30:00Z',
    },
    {
      id: '2',
      userId: 'user-2',
      userName: 'Jane Doe',
      userRole: 'User',
      resource: 'Tickets',
      permission: 'READ_ONLY',
      grantedBy: 'admin-1',
      grantedAt: '2024-01-01T00:00:00Z',
      isActive: true,
      lastUsed: '2024-01-15T09:45:00Z',
    },
  ]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleExportLogs = () => {
    // Simulate log export
    console.log('Exporting audit logs...');
  };

  const handleTerminateSession = (sessionId: string) => {
    setUserSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId
          ? { ...session, isActive: false, lastActivity: new Date().toISOString() }
          : session
      )
    );
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'error';
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'authentication':
        return <Login />;
      case 'authorization':
        return <VpnKey />;
      case 'data_access':
        return <Visibility />;
      case 'data_modification':
        return <Edit />;
      case 'system':
        return <Computer />;
      case 'security':
        return <Security />;
      default:
        return <Info />;
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'failed_login':
        return <Block />;
      case 'suspicious_activity':
        return <Warning />;
      case 'privilege_escalation':
        return <TrendingUp />;
      case 'data_breach':
        return <Error />;
      case 'unauthorized_access':
        return <Lock />;
      default:
        return <Info />;
    }
  };

  const auditLogsTab = () => (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Audit Logs</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            size="small"
            placeholder="Search logs..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            InputProps={{
              startAdornment: <Search />,
            }}
          />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Severity</InputLabel>
            <Select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              label="Severity"
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="critical">Critical</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="low">Low</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              label="Category"
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="authentication">Authentication</MenuItem>
              <MenuItem value="authorization">Authorization</MenuItem>
              <MenuItem value="data_access">Data Access</MenuItem>
              <MenuItem value="data_modification">Data Modification</MenuItem>
              <MenuItem value="system">System</MenuItem>
              <MenuItem value="security">Security</MenuItem>
            </Select>
          </FormControl>
          <Button variant="outlined" startIcon={<Download />} onClick={handleExportLogs}>
            Export
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Timestamp</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Resource</TableCell>
              <TableCell>Details</TableCell>
              <TableCell>IP Address</TableCell>
              <TableCell>Severity</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {auditLogs.map((log) => (
              <TableRow key={log.id} hover>
                <TableCell>
                  <Typography variant="body2">
                    {new Date(log.timestamp).toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 24, height: 24 }}>{log.userName.charAt(0)}</Avatar>
                    <Box>
                      <Typography variant="body2">{log.userName}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {log.userRole}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getCategoryIcon(log.category)}
                    <Typography variant="body2">{log.action}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {log.resource}
                    {log.resourceId && (
                      <Typography variant="caption" display="block" color="text.secondary">
                        ID: {log.resourceId}
                      </Typography>
                    )}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{log.details}</Typography>
                  {log.errorMessage && (
                    <Typography variant="caption" color="error" display="block">
                      Error: {log.errorMessage}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{log.ipAddress}</Typography>
                </TableCell>
                <TableCell>
                  <Chip label={log.severity} color={getSeverityColor(log.severity)} size="small" />
                </TableCell>
                <TableCell>
                  <Chip
                    label={log.success ? 'Success' : 'Failed'}
                    color={log.success ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const securityEventsTab = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Security Events & Incidents
      </Typography>

      <Grid container spacing={3}>
        {securityEvents.map((event) => (
          <Grid item xs={12} md={6} key={event.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {getEventTypeIcon(event.type)}
                  <Box sx={{ ml: 1, flexGrow: 1 }}>
                    <Typography variant="h6">{event.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {event.description}
                    </Typography>
                  </Box>
                  <Chip
                    label={event.severity}
                    color={getSeverityColor(event.severity)}
                    size="small"
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>User:</strong> {event.userName || 'Unknown'}
                  </Typography>
                  <Typography variant="body2">
                    <strong>IP Address:</strong> {event.ipAddress}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Location:</strong> {event.location || 'Unknown'}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Time:</strong> {new Date(event.timestamp).toLocaleString()}
                  </Typography>
                </Box>

                {event.remediationSteps && (
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography variant="subtitle2">Remediation Steps</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List dense>
                        {event.remediationSteps.map((step, index) => (
                          <ListItem key={index}>
                            <ListItemText primary={step} />
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                )}

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 2,
                  }}
                >
                  <Chip
                    label={event.status}
                    color={
                      event.status === 'resolved'
                        ? 'success'
                        : event.status === 'investigating'
                          ? 'warning'
                          : event.status === 'false_positive'
                            ? 'info'
                            : 'error'
                    }
                    size="small"
                  />
                  <Box>
                    <IconButton size="small">
                      <Visibility />
                    </IconButton>
                    <IconButton size="small">
                      <Edit />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const userSessionsTab = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Active User Sessions
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Device & Location</TableCell>
              <TableCell>Session Info</TableCell>
              <TableCell>Activity</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userSessions.map((session) => (
              <TableRow key={session.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Badge
                      color={session.isActive ? 'success' : 'default'}
                      variant="dot"
                      overlap="circular"
                    >
                      <Avatar sx={{ width: 32, height: 32 }}>{session.userName.charAt(0)}</Avatar>
                    </Badge>
                    <Box>
                      <Typography variant="body2">{session.userName}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {session.userRole}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{session.device}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {session.browser}
                  </Typography>
                  <Typography variant="caption" display="block" color="text.secondary">
                    📍 {session.location}
                  </Typography>
                  <Typography variant="caption" display="block" color="text.secondary">
                    🌐 {session.ipAddress}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    Started: {new Date(session.startTime).toLocaleString()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Last activity: {new Date(session.lastActivity).toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{session.activityCount} actions</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {Math.floor(session.duration / 60)}h {session.duration % 60}m
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={session.isActive ? 'Active' : 'Inactive'}
                    color={session.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {session.isActive && (
                    <Tooltip title="Terminate Session">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleTerminateSession(session.id)}
                      >
                        <Block />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="View Details">
                    <IconButton size="small">
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const permissionsTab = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        System Permissions & Access Control
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Resource</TableCell>
              <TableCell>Permission</TableCell>
              <TableCell>Granted By</TableCell>
              <TableCell>Granted Date</TableCell>
              <TableCell>Last Used</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {systemPermissions.map((permission) => (
              <TableRow key={permission.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 24, height: 24 }}>{permission.userName.charAt(0)}</Avatar>
                    <Box>
                      <Typography variant="body2">{permission.userName}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {permission.userRole}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{permission.resource}</Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={permission.permission}
                    color={permission.permission.includes('WRITE') ? 'warning' : 'info'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{permission.grantedBy}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {new Date(permission.grantedAt).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {permission.lastUsed ? new Date(permission.lastUsed).toLocaleString() : 'Never'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={permission.isActive ? 'Active' : 'Inactive'}
                    color={permission.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton size="small">
                    <Edit />
                  </IconButton>
                  <IconButton size="small" color="error">
                    <Block />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  // Check if user has admin access
  if (user?.role !== 'Admin' && user?.role !== 'IT Admin') {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          You don't have permission to access system audit and security features. Please contact
          your administrator.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          System Audit & Security
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Date Range</InputLabel>
            <Select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              label="Date Range"
            >
              <MenuItem value="1d">Last 24 Hours</MenuItem>
              <MenuItem value="7d">Last 7 Days</MenuItem>
              <MenuItem value="30d">Last 30 Days</MenuItem>
              <MenuItem value="90d">Last 90 Days</MenuItem>
            </Select>
          </FormControl>
          <Button variant="outlined" startIcon={<Refresh />}>
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Security Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <History color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Audit Events</Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {auditLogs.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Last 24 hours
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Warning color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6">Security Events</Typography>
              </Box>
              <Typography variant="h4" color="warning.main">
                {securityEvents.filter((e) => e.status === 'open').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Open incidents
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Person color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Active Sessions</Typography>
              </Box>
              <Typography variant="h4" color="success.main">
                {userSessions.filter((s) => s.isActive).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Current users
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Shield color="info" sx={{ mr: 1 }} />
                <Typography variant="h6">Permissions</Typography>
              </Box>
              <Typography variant="h4" color="info.main">
                {systemPermissions.filter((p) => p.isActive).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active permissions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="audit security tabs">
          <Tab
            label="Audit Logs"
            icon={<History />}
            iconPosition="start"
            sx={{ minHeight: 'auto' }}
          />
          <Tab
            label="Security Events"
            icon={<Security />}
            iconPosition="start"
            sx={{ minHeight: 'auto' }}
          />
          <Tab
            label="User Sessions"
            icon={<Person />}
            iconPosition="start"
            sx={{ minHeight: 'auto' }}
          />
          <Tab
            label="Permissions"
            icon={<VpnKey />}
            iconPosition="start"
            sx={{ minHeight: 'auto' }}
          />
        </Tabs>
      </Box>

      {tabValue === 0 && auditLogsTab()}
      {tabValue === 1 && securityEventsTab()}
      {tabValue === 2 && userSessionsTab()}
      {tabValue === 3 && permissionsTab()}
    </Box>
  );
};

export default SystemAuditSecurityPage;
