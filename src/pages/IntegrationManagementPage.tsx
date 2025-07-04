import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Tab,
  Tabs,
  Button,
  Switch,
  FormControlLabel,
  TextField,
  IconButton,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Sync as SyncIcon,
  Api as ApiIcon,
  Email as EmailIcon,
  Chat as ChatIcon,
  Phone as PhoneIcon,
  Storage as StorageIcon,
  Security as SecurityIcon,
  Webhook as WebhookIcon,
  Extension as ExtensionIcon,
  Cloud as CloudIcon,
  Link as LinkIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

interface Integration {
  id: string;
  name: string;
  type: 'SSO' | 'EMAIL' | 'CHAT' | 'PHONE' | 'MONITORING' | 'CMDB' | 'API' | 'WEBHOOK';
  status: 'active' | 'inactive' | 'error' | 'syncing';
  provider: string;
  description: string;
  lastSync: string;
  configuration: Record<string, any>;
  endpoints: number;
  requests: number;
  errors: number;
}

interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  status: 'active' | 'inactive';
  secret: string;
  retryCount: number;
  lastDelivery: string;
  successRate: number;
}

const IntegrationManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);

  // Mock data
  const integrations: Integration[] = [
    {
      id: '1',
      name: 'Microsoft Azure AD',
      type: 'SSO',
      status: 'active',
      provider: 'Microsoft',
      description: 'Single Sign-On integration with Azure Active Directory',
      lastSync: '2024-01-15T10:30:00Z',
      configuration: { tenantId: 'xxx', clientId: 'yyy' },
      endpoints: 3,
      requests: 1250,
      errors: 0,
    },
    {
      id: '2',
      name: 'Microsoft Teams',
      type: 'CHAT',
      status: 'active',
      provider: 'Microsoft',
      description: 'Team collaboration and notifications',
      lastSync: '2024-01-15T11:00:00Z',
      configuration: { webhookUrl: 'https://...', channels: ['general', 'it-support'] },
      endpoints: 2,
      requests: 856,
      errors: 2,
    },
    {
      id: '3',
      name: 'Slack',
      type: 'CHAT',
      status: 'active',
      provider: 'Slack',
      description: 'Team communication and incident notifications',
      lastSync: '2024-01-15T10:45:00Z',
      configuration: { botToken: 'xoxb-...', channels: ['#incidents', '#support'] },
      endpoints: 4,
      requests: 2100,
      errors: 1,
    },
    {
      id: '4',
      name: 'Twilio',
      type: 'PHONE',
      status: 'active',
      provider: 'Twilio',
      description: 'SMS and voice communication',
      lastSync: '2024-01-15T09:15:00Z',
      configuration: { accountSid: 'AC...', authToken: '...', phoneNumber: '+1234567890' },
      endpoints: 3,
      requests: 45,
      errors: 0,
    },
    {
      id: '5',
      name: 'Jira',
      type: 'API',
      status: 'error',
      provider: 'Atlassian',
      description: 'Project management and issue tracking',
      lastSync: '2024-01-15T08:00:00Z',
      configuration: { baseUrl: 'https://company.atlassian.net', username: 'api@company.com' },
      endpoints: 5,
      requests: 325,
      errors: 15,
    },
    {
      id: '6',
      name: 'Zabbix',
      type: 'MONITORING',
      status: 'active',
      provider: 'Zabbix',
      description: 'Infrastructure monitoring and alerting',
      lastSync: '2024-01-15T11:30:00Z',
      configuration: { apiUrl: 'https://monitor.company.com/api', username: 'admin' },
      endpoints: 8,
      requests: 3200,
      errors: 5,
    },
  ];

  const webhooks: Webhook[] = [
    {
      id: '1',
      name: 'Ticket Created',
      url: 'https://api.company.com/webhooks/ticket-created',
      events: ['ticket.created', 'ticket.updated'],
      status: 'active',
      secret: 'whsec_...',
      retryCount: 3,
      lastDelivery: '2024-01-15T11:45:00Z',
      successRate: 99.2,
    },
    {
      id: '2',
      name: 'SLA Breach Alert',
      url: 'https://alerts.company.com/sla-breach',
      events: ['sla.breach', 'sla.warning'],
      status: 'active',
      secret: 'whsec_...',
      retryCount: 5,
      lastDelivery: '2024-01-15T10:20:00Z',
      successRate: 98.7,
    },
    {
      id: '3',
      name: 'Asset Changes',
      url: 'https://cmdb.company.com/webhook',
      events: ['asset.created', 'asset.updated', 'asset.deleted'],
      status: 'inactive',
      secret: 'whsec_...',
      retryCount: 3,
      lastDelivery: '2024-01-14T16:30:00Z',
      successRate: 95.1,
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon color="success" />;
      case 'inactive':
        return <WarningIcon color="warning" />;
      case 'error':
        return <ErrorIcon color="error" />;
      case 'syncing':
        return <SyncIcon color="primary" />;
      default:
        return <WarningIcon />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'SSO':
        return <SecurityIcon />;
      case 'EMAIL':
        return <EmailIcon />;
      case 'CHAT':
        return <ChatIcon />;
      case 'PHONE':
        return <PhoneIcon />;
      case 'MONITORING':
        return <StorageIcon />;
      case 'CMDB':
        return <StorageIcon />;
      case 'API':
        return <ApiIcon />;
      case 'WEBHOOK':
        return <WebhookIcon />;
      default:
        return <ExtensionIcon />;
    }
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleEditIntegration = (integration: Integration) => {
    setSelectedIntegration(integration);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedIntegration(null);
  };

  const renderIntegrationsTab = () => (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Active Integrations</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenDialog(true)}>
          Add Integration
        </Button>
      </Box>

      <Grid container spacing={3}>
        {integrations.map((integration) => (
          <Grid item xs={12} md={6} lg={4} key={integration.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                    {getTypeIcon(integration.type)}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="div">
                      {integration.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {integration.provider}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {getStatusIcon(integration.status)}
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {integration.description}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Chip label={integration.type} size="small" sx={{ mr: 1 }} />
                  <Chip
                    label={integration.status}
                    size="small"
                    color={
                      integration.status === 'active'
                        ? 'success'
                        : integration.status === 'error'
                          ? 'error'
                          : 'default'
                    }
                  />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2">Endpoints: {integration.endpoints}</Typography>
                  <Typography variant="body2">Requests: {integration.requests}</Typography>
                  <Typography
                    variant="body2"
                    color={integration.errors > 0 ? 'error' : 'text.secondary'}
                  >
                    Errors: {integration.errors}
                  </Typography>
                </Box>

                <Box
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Last sync: {new Date(integration.lastSync).toLocaleString()}
                  </Typography>
                  <Box>
                    <IconButton size="small" onClick={() => handleEditIntegration(integration)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="primary">
                      <RefreshIcon />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <DeleteIcon />
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

  const renderWebhooksTab = () => (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Webhooks</Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          Add Webhook
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>URL</TableCell>
              <TableCell>Events</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Success Rate</TableCell>
              <TableCell>Last Delivery</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {webhooks.map((webhook) => (
              <TableRow key={webhook.id}>
                <TableCell>{webhook.name}</TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}
                  >
                    {webhook.url}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {webhook.events.map((event) => (
                      <Chip key={event} label={event} size="small" />
                    ))}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={webhook.status}
                    size="small"
                    color={webhook.status === 'active' ? 'success' : 'default'}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LinearProgress
                      variant="determinate"
                      value={webhook.successRate}
                      sx={{ width: 60, mr: 1 }}
                    />
                    <Typography variant="body2">{webhook.successRate}%</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {new Date(webhook.lastDelivery).toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <IconButton size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" color="primary">
                    <RefreshIcon />
                  </IconButton>
                  <IconButton size="small" color="error">
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

  const renderAPITab = () => (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                API Configuration
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                Your API endpoint: https://api.ticketops.com/v1
              </Alert>
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="API Key"
                  value="tok_1234567890abcdef"
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{ mb: 2 }}
                />
                <Button variant="outlined" size="small">
                  Regenerate API Key
                </Button>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Use this API key to authenticate your requests to the TicketOps API.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                API Usage Statistics
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Monthly Requests</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    15,420 / 50,000
                  </Typography>
                </Box>
                <LinearProgress variant="determinate" value={30.84} sx={{ mb: 2 }} />
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Today: 234
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    This Week: 1,876
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Success Rate: 99.2%
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Avg Response: 245ms
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                API Documentation
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Access our comprehensive API documentation to integrate with external systems.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="outlined" startIcon={<LinkIcon />}>
                  View Documentation
                </Button>
                <Button variant="outlined" startIcon={<CloudIcon />}>
                  Download OpenAPI Spec
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Integration Management
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Manage third-party integrations, webhooks, and API configurations
      </Typography>

      <Card>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Integrations" />
          <Tab label="Webhooks" />
          <Tab label="API Management" />
        </Tabs>
        <CardContent>
          {activeTab === 0 && renderIntegrationsTab()}
          {activeTab === 1 && renderWebhooksTab()}
          {activeTab === 2 && renderAPITab()}
        </CardContent>
      </Card>

      {/* Integration Configuration Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedIntegration ? 'Edit Integration' : 'Add New Integration'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Integration Name"
                defaultValue={selectedIntegration?.name || ''}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Provider"
                defaultValue={selectedIntegration?.provider || ''}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                defaultValue={selectedIntegration?.description || ''}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Configuration
              </Typography>
              <TextField fullWidth label="API URL" sx={{ mb: 2 }} />
              <TextField fullWidth label="API Key" type="password" sx={{ mb: 2 }} />
              <FormControlLabel control={<Switch defaultChecked />} label="Enable Integration" />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleCloseDialog}>
            {selectedIntegration ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default IntegrationManagementPage;
