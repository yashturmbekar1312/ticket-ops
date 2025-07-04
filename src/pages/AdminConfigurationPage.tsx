import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  TextField,
  Button,
  FormControl,
  FormControlLabel,
  Switch,
  Alert,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';
import {
  Business,
  Email,
  Security,
  Group,
  Rule,
  Add,
  Edit,
  Delete,
  Save,
} from '@mui/icons-material';
import { useAuth } from '../hooks/auth';

interface OrganizationSettings {
  companyName: string;
  domain: string;
  helpdeskUrl: string;
  timezone: string;
  businessHours: {
    enabled: boolean;
    workingDays: number[];
    startTime: string;
    endTime: string;
    holidays: string[];
  };
  contactInfo: {
    supportEmail: string;
    phone: string;
    address: string;
  };
}

interface EmailSettings {
  enabled: boolean;
  smtpHost: string;
  smtpPort: number;
  username: string;
  password: string;
  encryption: 'none' | 'ssl' | 'tls';
  fromAddress: string;
  fromName: string;
  replyToAddress: string;
  autoCreateTickets: boolean;
  incomingEmailConfig: {
    enabled: boolean;
    imapHost: string;
    imapPort: number;
    username: string;
    password: string;
    folder: string;
    deleteAfterImport: boolean;
  };
}

interface SecuritySettings {
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSymbols: boolean;
    maxAge: number;
  };
  sessionSettings: {
    timeout: number;
    maxConcurrentSessions: number;
    rememberMe: boolean;
  };
  accessControl: {
    ipWhitelist: string[];
    allowedDomains: string[];
    mfaRequired: boolean;
  };
  auditSettings: {
    enabled: boolean;
    retentionDays: number;
    logLevel: 'basic' | 'detailed' | 'verbose';
  };
}

interface Department {
  id: string;
  name: string;
  description: string;
  managerId: string;
  members: string[];
  isActive: boolean;
  createdAt: string;
}

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: string;
  conditions: any[];
  actions: any[];
  isActive: boolean;
  executionCount: number;
  lastExecuted?: string;
  createdAt: string;
}

const AdminConfigurationPage: React.FC = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Configuration states
  const [orgSettings, setOrgSettings] = useState<OrganizationSettings>({
    companyName: 'TicketOps Enterprise',
    domain: 'ticketops.com',
    helpdeskUrl: 'support.ticketops.com',
    timezone: 'America/New_York',
    businessHours: {
      enabled: true,
      workingDays: [1, 2, 3, 4, 5],
      startTime: '09:00',
      endTime: '17:00',
      holidays: ['2024-12-25', '2024-01-01', '2024-07-04'],
    },
    contactInfo: {
      supportEmail: 'support@ticketops.com',
      phone: '+1-555-SUPPORT',
      address: '123 Business St, City, State 12345',
    },
  });

  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    enabled: true,
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    username: 'notifications@ticketops.com',
    password: '',
    encryption: 'tls',
    fromAddress: 'notifications@ticketops.com',
    fromName: 'TicketOps Support',
    replyToAddress: 'noreply@ticketops.com',
    autoCreateTickets: true,
    incomingEmailConfig: {
      enabled: true,
      imapHost: 'imap.gmail.com',
      imapPort: 993,
      username: 'support@ticketops.com',
      password: '',
      folder: 'INBOX',
      deleteAfterImport: false,
    },
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSymbols: false,
      maxAge: 90,
    },
    sessionSettings: {
      timeout: 480, // 8 hours
      maxConcurrentSessions: 3,
      rememberMe: true,
    },
    accessControl: {
      ipWhitelist: [],
      allowedDomains: ['ticketops.com', 'company.com'],
      mfaRequired: false,
    },
    auditSettings: {
      enabled: true,
      retentionDays: 365,
      logLevel: 'detailed',
    },
  });

  const [departments] = useState<Department[]>([
    {
      id: '1',
      name: 'IT Support',
      description: 'Technical support and infrastructure',
      managerId: 'user-1',
      members: ['user-1', 'user-2', 'user-3'],
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      name: 'Human Resources',
      description: 'Employee relations and onboarding',
      managerId: 'user-4',
      members: ['user-4', 'user-5'],
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '3',
      name: 'Finance',
      description: 'Financial operations and accounting',
      managerId: 'user-6',
      members: ['user-6', 'user-7'],
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
    },
  ]);

  const [automationRules] = useState<AutomationRule[]>([
    {
      id: '1',
      name: 'Auto-assign Critical Tickets',
      description: 'Automatically assign critical tickets to senior IT staff',
      trigger: 'ticket_created',
      conditions: [{ field: 'priority', operator: 'equals', value: 'Critical' }],
      actions: [{ type: 'assign', value: 'senior-it-team' }],
      isActive: true,
      executionCount: 45,
      lastExecuted: '2024-01-15T10:30:00Z',
      createdAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      name: 'SLA Breach Notification',
      description: 'Send notifications when SLA is about to breach',
      trigger: 'sla_warning',
      conditions: [{ field: 'sla_remaining', operator: 'less_than', value: '30' }],
      actions: [{ type: 'notify', value: 'managers' }],
      isActive: true,
      executionCount: 23,
      lastExecuted: '2024-01-15T14:20:00Z',
      createdAt: '2024-01-01T00:00:00Z',
    },
  ]);

  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [departmentDialogOpen, setDepartmentDialogOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<AutomationRule | null>(null);
  const [ruleDialogOpen, setRuleDialogOpen] = useState(false);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSave = async () => {
    setLoading(true);
    setSaveStatus('saving');

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleTestEmailConnection = async () => {
    setLoading(true);
    try {
      // Simulate email connection test
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert('Email connection test successful!');
    } catch (error) {
      alert('Email connection test failed!');
    } finally {
      setLoading(false);
    }
  };

  const organizationTab = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Organization Settings
      </Typography>

      <Grid container spacing={3}>
        {/* Company Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Company Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Company Name"
                    value={orgSettings.companyName}
                    onChange={(e) =>
                      setOrgSettings({ ...orgSettings, companyName: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Domain"
                    value={orgSettings.domain}
                    onChange={(e) => setOrgSettings({ ...orgSettings, domain: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Helpdesk Portal URL"
                    value={orgSettings.helpdeskUrl}
                    onChange={(e) =>
                      setOrgSettings({ ...orgSettings, helpdeskUrl: e.target.value })
                    }
                    helperText="e.g., support.company.com"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Timezone</InputLabel>
                    <Select
                      value={orgSettings.timezone}
                      onChange={(e) => setOrgSettings({ ...orgSettings, timezone: e.target.value })}
                    >
                      <MenuItem value="America/New_York">Eastern Time</MenuItem>
                      <MenuItem value="America/Chicago">Central Time</MenuItem>
                      <MenuItem value="America/Denver">Mountain Time</MenuItem>
                      <MenuItem value="America/Los_Angeles">Pacific Time</MenuItem>
                      <MenuItem value="UTC">UTC</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Contact Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Contact Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Support Email"
                    value={orgSettings.contactInfo.supportEmail}
                    onChange={(e) =>
                      setOrgSettings({
                        ...orgSettings,
                        contactInfo: { ...orgSettings.contactInfo, supportEmail: e.target.value },
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={orgSettings.contactInfo.phone}
                    onChange={(e) =>
                      setOrgSettings({
                        ...orgSettings,
                        contactInfo: { ...orgSettings.contactInfo, phone: e.target.value },
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Address"
                    value={orgSettings.contactInfo.address}
                    onChange={(e) =>
                      setOrgSettings({
                        ...orgSettings,
                        contactInfo: { ...orgSettings.contactInfo, address: e.target.value },
                      })
                    }
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Business Hours */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Business Hours
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={orgSettings.businessHours.enabled}
                        onChange={(e) =>
                          setOrgSettings({
                            ...orgSettings,
                            businessHours: {
                              ...orgSettings.businessHours,
                              enabled: e.target.checked,
                            },
                          })
                        }
                      />
                    }
                    label="Enable Business Hours"
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Start Time"
                    type="time"
                    value={orgSettings.businessHours.startTime}
                    onChange={(e) =>
                      setOrgSettings({
                        ...orgSettings,
                        businessHours: {
                          ...orgSettings.businessHours,
                          startTime: e.target.value,
                        },
                      })
                    }
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="End Time"
                    type="time"
                    value={orgSettings.businessHours.endTime}
                    onChange={(e) =>
                      setOrgSettings({
                        ...orgSettings,
                        businessHours: {
                          ...orgSettings.businessHours,
                          endTime: e.target.value,
                        },
                      })
                    }
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Working Days
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                      <Chip
                        key={index}
                        label={day}
                        clickable
                        color={
                          orgSettings.businessHours.workingDays.includes(index)
                            ? 'primary'
                            : 'default'
                        }
                        onClick={() => {
                          const workingDays = [...orgSettings.businessHours.workingDays];
                          const dayIndex = workingDays.indexOf(index);
                          if (dayIndex > -1) {
                            workingDays.splice(dayIndex, 1);
                          } else {
                            workingDays.push(index);
                          }
                          setOrgSettings({
                            ...orgSettings,
                            businessHours: { ...orgSettings.businessHours, workingDays },
                          });
                        }}
                      />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const emailTab = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Email Configuration
      </Typography>

      <Grid container spacing={3}>
        {/* SMTP Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Outgoing Email (SMTP)
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={emailSettings.enabled}
                        onChange={(e) =>
                          setEmailSettings({ ...emailSettings, enabled: e.target.checked })
                        }
                      />
                    }
                    label="Enable Email Notifications"
                  />
                </Grid>
                <Grid item xs={12} md={8}>
                  <TextField
                    fullWidth
                    label="SMTP Host"
                    value={emailSettings.smtpHost}
                    onChange={(e) =>
                      setEmailSettings({ ...emailSettings, smtpHost: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Port"
                    type="number"
                    value={emailSettings.smtpPort}
                    onChange={(e) =>
                      setEmailSettings({ ...emailSettings, smtpPort: parseInt(e.target.value) })
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Username"
                    value={emailSettings.username}
                    onChange={(e) =>
                      setEmailSettings({ ...emailSettings, username: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    value={emailSettings.password}
                    onChange={(e) =>
                      setEmailSettings({ ...emailSettings, password: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Encryption</InputLabel>
                    <Select
                      value={emailSettings.encryption}
                      onChange={(e) =>
                        setEmailSettings({
                          ...emailSettings,
                          encryption: e.target.value as 'none' | 'ssl' | 'tls',
                        })
                      }
                    >
                      <MenuItem value="none">None</MenuItem>
                      <MenuItem value="ssl">SSL</MenuItem>
                      <MenuItem value="tls">TLS</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="From Address"
                    value={emailSettings.fromAddress}
                    onChange={(e) =>
                      setEmailSettings({ ...emailSettings, fromAddress: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="From Name"
                    value={emailSettings.fromName}
                    onChange={(e) =>
                      setEmailSettings({ ...emailSettings, fromName: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    onClick={handleTestEmailConnection}
                    disabled={loading}
                    startIcon={<Email />}
                  >
                    Test Connection
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Incoming Email */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Incoming Email (IMAP)
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={emailSettings.incomingEmailConfig.enabled}
                        onChange={(e) =>
                          setEmailSettings({
                            ...emailSettings,
                            incomingEmailConfig: {
                              ...emailSettings.incomingEmailConfig,
                              enabled: e.target.checked,
                            },
                          })
                        }
                      />
                    }
                    label="Auto-Create Tickets from Email"
                  />
                </Grid>
                <Grid item xs={12} md={8}>
                  <TextField
                    fullWidth
                    label="IMAP Host"
                    value={emailSettings.incomingEmailConfig.imapHost}
                    onChange={(e) =>
                      setEmailSettings({
                        ...emailSettings,
                        incomingEmailConfig: {
                          ...emailSettings.incomingEmailConfig,
                          imapHost: e.target.value,
                        },
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Port"
                    type="number"
                    value={emailSettings.incomingEmailConfig.imapPort}
                    onChange={(e) =>
                      setEmailSettings({
                        ...emailSettings,
                        incomingEmailConfig: {
                          ...emailSettings.incomingEmailConfig,
                          imapPort: parseInt(e.target.value),
                        },
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Username"
                    value={emailSettings.incomingEmailConfig.username}
                    onChange={(e) =>
                      setEmailSettings({
                        ...emailSettings,
                        incomingEmailConfig: {
                          ...emailSettings.incomingEmailConfig,
                          username: e.target.value,
                        },
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    value={emailSettings.incomingEmailConfig.password}
                    onChange={(e) =>
                      setEmailSettings({
                        ...emailSettings,
                        incomingEmailConfig: {
                          ...emailSettings.incomingEmailConfig,
                          password: e.target.value,
                        },
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Folder"
                    value={emailSettings.incomingEmailConfig.folder}
                    onChange={(e) =>
                      setEmailSettings({
                        ...emailSettings,
                        incomingEmailConfig: {
                          ...emailSettings.incomingEmailConfig,
                          folder: e.target.value,
                        },
                      })
                    }
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const departmentsTab = () => (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Departments & Groups</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setSelectedDepartment(null);
            setDepartmentDialogOpen(true);
          }}
        >
          Add Department
        </Button>
      </Box>

      <Grid container spacing={3}>
        {departments.map((dept) => (
          <Grid item xs={12} md={6} lg={4} key={dept.id}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">{dept.name}</Typography>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSelectedDepartment(dept);
                        setDepartmentDialogOpen(true);
                      }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton size="small">
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {dept.description}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1,
                  }}
                >
                  <Typography variant="body2">
                    <strong>Members:</strong> {dept.members.length}
                  </Typography>
                  <Chip
                    label={dept.isActive ? 'Active' : 'Inactive'}
                    color={dept.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Manager: {dept.managerId || 'Unassigned'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const securityTab = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Security & Compliance
      </Typography>

      <Grid container spacing={3}>
        {/* Password Policy */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Password Policy
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Minimum Length"
                    type="number"
                    value={securitySettings.passwordPolicy.minLength}
                    onChange={(e) =>
                      setSecuritySettings({
                        ...securitySettings,
                        passwordPolicy: {
                          ...securitySettings.passwordPolicy,
                          minLength: parseInt(e.target.value),
                        },
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={securitySettings.passwordPolicy.requireUppercase}
                        onChange={(e) =>
                          setSecuritySettings({
                            ...securitySettings,
                            passwordPolicy: {
                              ...securitySettings.passwordPolicy,
                              requireUppercase: e.target.checked,
                            },
                          })
                        }
                      />
                    }
                    label="Require Uppercase Letters"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={securitySettings.passwordPolicy.requireNumbers}
                        onChange={(e) =>
                          setSecuritySettings({
                            ...securitySettings,
                            passwordPolicy: {
                              ...securitySettings.passwordPolicy,
                              requireNumbers: e.target.checked,
                            },
                          })
                        }
                      />
                    }
                    label="Require Numbers"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={securitySettings.passwordPolicy.requireSymbols}
                        onChange={(e) =>
                          setSecuritySettings({
                            ...securitySettings,
                            passwordPolicy: {
                              ...securitySettings.passwordPolicy,
                              requireSymbols: e.target.checked,
                            },
                          })
                        }
                      />
                    }
                    label="Require Symbols"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Password Expiry (days)"
                    type="number"
                    value={securitySettings.passwordPolicy.maxAge}
                    onChange={(e) =>
                      setSecuritySettings({
                        ...securitySettings,
                        passwordPolicy: {
                          ...securitySettings.passwordPolicy,
                          maxAge: parseInt(e.target.value),
                        },
                      })
                    }
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Session Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Session Management
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Session Timeout (minutes)"
                    type="number"
                    value={securitySettings.sessionSettings.timeout}
                    onChange={(e) =>
                      setSecuritySettings({
                        ...securitySettings,
                        sessionSettings: {
                          ...securitySettings.sessionSettings,
                          timeout: parseInt(e.target.value),
                        },
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Max Concurrent Sessions"
                    type="number"
                    value={securitySettings.sessionSettings.maxConcurrentSessions}
                    onChange={(e) =>
                      setSecuritySettings({
                        ...securitySettings,
                        sessionSettings: {
                          ...securitySettings.sessionSettings,
                          maxConcurrentSessions: parseInt(e.target.value),
                        },
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={securitySettings.sessionSettings.rememberMe}
                        onChange={(e) =>
                          setSecuritySettings({
                            ...securitySettings,
                            sessionSettings: {
                              ...securitySettings.sessionSettings,
                              rememberMe: e.target.checked,
                            },
                          })
                        }
                      />
                    }
                    label="Allow Remember Me"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Access Control */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Access Control
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={securitySettings.accessControl.mfaRequired}
                        onChange={(e) =>
                          setSecuritySettings({
                            ...securitySettings,
                            accessControl: {
                              ...securitySettings.accessControl,
                              mfaRequired: e.target.checked,
                            },
                          })
                        }
                      />
                    }
                    label="Require Multi-Factor Authentication"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Allowed Domains
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {securitySettings.accessControl.allowedDomains.map((domain, index) => (
                      <Chip
                        key={index}
                        label={domain}
                        onDelete={() => {
                          const domains = [...securitySettings.accessControl.allowedDomains];
                          domains.splice(index, 1);
                          setSecuritySettings({
                            ...securitySettings,
                            accessControl: {
                              ...securitySettings.accessControl,
                              allowedDomains: domains,
                            },
                          });
                        }}
                      />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const automationTab = () => (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Automation Rules</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setSelectedRule(null);
            setRuleDialogOpen(true);
          }}
        >
          Create Rule
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Rule Name</TableCell>
              <TableCell>Trigger</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Executions</TableCell>
              <TableCell>Last Executed</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {automationRules.map((rule) => (
              <TableRow key={rule.id}>
                <TableCell>
                  <Typography variant="subtitle2">{rule.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {rule.description}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip label={rule.trigger} variant="outlined" size="small" />
                </TableCell>
                <TableCell>
                  <Chip
                    label={rule.isActive ? 'Active' : 'Inactive'}
                    color={rule.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{rule.executionCount}</TableCell>
                <TableCell>
                  {rule.lastExecuted ? new Date(rule.lastExecuted).toLocaleString() : 'Never'}
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSelectedRule(rule);
                      setRuleDialogOpen(true);
                    }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton size="small">
                    <Delete />
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
          You don't have permission to access system configuration. Please contact your
          administrator.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          System Configuration
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSave}
            disabled={loading}
            color={saveStatus === 'saved' ? 'success' : 'primary'}
          >
            {saveStatus === 'saving'
              ? 'Saving...'
              : saveStatus === 'saved'
                ? 'Saved'
                : 'Save Changes'}
          </Button>
        </Box>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="admin configuration tabs">
          <Tab
            label="Organization"
            icon={<Business />}
            iconPosition="start"
            sx={{ minHeight: 'auto' }}
          />
          <Tab label="Email" icon={<Email />} iconPosition="start" sx={{ minHeight: 'auto' }} />
          <Tab
            label="Departments"
            icon={<Group />}
            iconPosition="start"
            sx={{ minHeight: 'auto' }}
          />
          <Tab
            label="Security"
            icon={<Security />}
            iconPosition="start"
            sx={{ minHeight: 'auto' }}
          />
          <Tab label="Automation" icon={<Rule />} iconPosition="start" sx={{ minHeight: 'auto' }} />
        </Tabs>
      </Box>

      {tabValue === 0 && organizationTab()}
      {tabValue === 1 && emailTab()}
      {tabValue === 2 && departmentsTab()}
      {tabValue === 3 && securityTab()}
      {tabValue === 4 && automationTab()}

      {/* Department Dialog */}
      <Dialog
        open={departmentDialogOpen}
        onClose={() => setDepartmentDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{selectedDepartment ? 'Edit Department' : 'Add New Department'}</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Department management form implementation in progress...
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDepartmentDialogOpen(false)}>Cancel</Button>
          <Button variant="contained">{selectedDepartment ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>

      {/* Automation Rule Dialog */}
      <Dialog
        open={ruleDialogOpen}
        onClose={() => setRuleDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>{selectedRule ? 'Edit Automation Rule' : 'Create New Rule'}</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Automation rule builder implementation in progress...
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRuleDialogOpen(false)}>Cancel</Button>
          <Button variant="contained">{selectedRule ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminConfigurationPage;
