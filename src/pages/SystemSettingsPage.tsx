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
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Checkbox,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Email as EmailIcon,
  Security as SecurityIcon,
  Backup as BackupIcon,
  Schedule as ScheduleIcon,
  Speed as SpeedIcon,
  Save as SaveIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  CloudDownload as CloudDownloadIcon,
  Restore as RestoreIcon,
} from '@mui/icons-material';

interface SystemSettings {
  general: {
    companyName: string;
    timezone: string;
    language: string;
    dateFormat: string;
    timeFormat: string;
    currency: string;
    theme: 'light' | 'dark' | 'auto';
  };
  email: {
    smtpServer: string;
    smtpPort: number;
    smtpUsername: string;
    smtpPassword: string;
    fromAddress: string;
    fromName: string;
    encryption: 'none' | 'tls' | 'ssl';
    enabled: boolean;
  };
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    slackIntegration: boolean;
    teamsIntegration: boolean;
    digestFrequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
  };
  security: {
    passwordPolicy: {
      minLength: number;
      requireUppercase: boolean;
      requireLowercase: boolean;
      requireNumbers: boolean;
      requireSpecialChars: boolean;
      expirationDays: number;
    };
    sessionTimeout: number;
    maxLoginAttempts: number;
    lockoutDuration: number;
    twoFactorEnabled: boolean;
    ipWhitelist: string[];
  };
  performance: {
    cacheEnabled: boolean;
    cacheTimeout: number;
    maxFileSize: number;
    maxAttachments: number;
    compressionEnabled: boolean;
    cdnEnabled: boolean;
  };
  backup: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    retention: number;
    location: 'local' | 'cloud';
    lastBackup: string;
  };
  api: {
    enabled: boolean;
    rateLimit: number;
    rateLimitWindow: number;
    keyExpiration: number;
    allowedOrigins: string[];
    webhookRetries: number;
  };
  maintenance: {
    maintenanceMode: boolean;
    maintenanceMessage: string;
    scheduledMaintenance: string;
    autoUpdates: boolean;
    updateChannel: 'stable' | 'beta' | 'alpha';
  };
}

const SystemSettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState<SystemSettings>({
    general: {
      companyName: 'TicketOps Corporation',
      timezone: 'America/New_York',
      language: 'en-US',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12h',
      currency: 'USD',
      theme: 'light',
    },
    email: {
      smtpServer: 'smtp.gmail.com',
      smtpPort: 587,
      smtpUsername: 'noreply@ticketops.com',
      smtpPassword: '••••••••••••',
      fromAddress: 'noreply@ticketops.com',
      fromName: 'TicketOps System',
      encryption: 'tls',
      enabled: true,
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      slackIntegration: true,
      teamsIntegration: false,
      digestFrequency: 'daily',
    },
    security: {
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        expirationDays: 90,
      },
      sessionTimeout: 60,
      maxLoginAttempts: 5,
      lockoutDuration: 30,
      twoFactorEnabled: true,
      ipWhitelist: ['192.168.1.0/24', '10.0.0.0/8'],
    },
    performance: {
      cacheEnabled: true,
      cacheTimeout: 300,
      maxFileSize: 10,
      maxAttachments: 5,
      compressionEnabled: true,
      cdnEnabled: false,
    },
    backup: {
      enabled: true,
      frequency: 'daily',
      retention: 30,
      location: 'cloud',
      lastBackup: '2024-01-15T02:00:00Z',
    },
    api: {
      enabled: true,
      rateLimit: 1000,
      rateLimitWindow: 60,
      keyExpiration: 365,
      allowedOrigins: ['https://ticketops.com', 'https://app.ticketops.com'],
      webhookRetries: 3,
    },
    maintenance: {
      maintenanceMode: false,
      maintenanceMessage: 'System is under maintenance. Please check back later.',
      scheduledMaintenance: '',
      autoUpdates: true,
      updateChannel: 'stable',
    },
  });

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSettingChange = (section: keyof SystemSettings, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const handleNestedSettingChange = (
    section: keyof SystemSettings,
    nestedKey: string,
    key: string,
    value: any
  ) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [nestedKey]: {
          ...(prev[section] as any)[nestedKey],
          [key]: value,
        },
      },
    }));
  };

  const renderGeneralTab = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        General Settings
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Company Name"
            value={settings.general.companyName}
            onChange={(e) => handleSettingChange('general', 'companyName', e.target.value)}
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Timezone</InputLabel>
            <Select
              value={settings.general.timezone}
              label="Timezone"
              onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
            >
              <MenuItem value="America/New_York">Eastern Time (US & Canada)</MenuItem>
              <MenuItem value="America/Chicago">Central Time (US & Canada)</MenuItem>
              <MenuItem value="America/Denver">Mountain Time (US & Canada)</MenuItem>
              <MenuItem value="America/Los_Angeles">Pacific Time (US & Canada)</MenuItem>
              <MenuItem value="UTC">UTC</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Language</InputLabel>
            <Select
              value={settings.general.language}
              label="Language"
              onChange={(e) => handleSettingChange('general', 'language', e.target.value)}
            >
              <MenuItem value="en-US">English (US)</MenuItem>
              <MenuItem value="en-GB">English (UK)</MenuItem>
              <MenuItem value="es-ES">Spanish</MenuItem>
              <MenuItem value="fr-FR">French</MenuItem>
              <MenuItem value="de-DE">German</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Date Format</InputLabel>
            <Select
              value={settings.general.dateFormat}
              label="Date Format"
              onChange={(e) => handleSettingChange('general', 'dateFormat', e.target.value)}
            >
              <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
              <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
              <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Time Format</InputLabel>
            <Select
              value={settings.general.timeFormat}
              label="Time Format"
              onChange={(e) => handleSettingChange('general', 'timeFormat', e.target.value)}
            >
              <MenuItem value="12h">12 Hour</MenuItem>
              <MenuItem value="24h">24 Hour</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Currency</InputLabel>
            <Select
              value={settings.general.currency}
              label="Currency"
              onChange={(e) => handleSettingChange('general', 'currency', e.target.value)}
            >
              <MenuItem value="USD">USD ($)</MenuItem>
              <MenuItem value="EUR">EUR (€)</MenuItem>
              <MenuItem value="GBP">GBP (£)</MenuItem>
              <MenuItem value="JPY">JPY (¥)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );

  const renderEmailTab = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Email Configuration
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.email.enabled}
                onChange={(e) => handleSettingChange('email', 'enabled', e.target.checked)}
              />
            }
            label="Enable Email Notifications"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="SMTP Server"
            value={settings.email.smtpServer}
            onChange={(e) => handleSettingChange('email', 'smtpServer', e.target.value)}
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="SMTP Port"
            type="number"
            value={settings.email.smtpPort}
            onChange={(e) => handleSettingChange('email', 'smtpPort', parseInt(e.target.value))}
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="SMTP Username"
            value={settings.email.smtpUsername}
            onChange={(e) => handleSettingChange('email', 'smtpUsername', e.target.value)}
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="SMTP Password"
            type={showPassword ? 'text' : 'password'}
            value={settings.email.smtpPassword}
            onChange={(e) => handleSettingChange('email', 'smtpPassword', e.target.value)}
            InputProps={{
              endAdornment: (
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              ),
            }}
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="From Address"
            value={settings.email.fromAddress}
            onChange={(e) => handleSettingChange('email', 'fromAddress', e.target.value)}
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="From Name"
            value={settings.email.fromName}
            onChange={(e) => handleSettingChange('email', 'fromName', e.target.value)}
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Encryption</InputLabel>
            <Select
              value={settings.email.encryption}
              label="Encryption"
              onChange={(e) => handleSettingChange('email', 'encryption', e.target.value)}
            >
              <MenuItem value="none">None</MenuItem>
              <MenuItem value="tls">TLS</MenuItem>
              <MenuItem value="ssl">SSL</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button variant="outlined" startIcon={<EmailIcon />}>
            Send Test Email
          </Button>
        </Grid>
      </Grid>
    </Box>
  );

  const renderSecurityTab = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Security Settings
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Password Policy
          </Typography>
          <Card variant="outlined" sx={{ p: 2, mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Minimum Length"
                  type="number"
                  value={settings.security.passwordPolicy.minLength}
                  onChange={(e) =>
                    handleNestedSettingChange(
                      'security',
                      'passwordPolicy',
                      'minLength',
                      parseInt(e.target.value)
                    )
                  }
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Password Expiration (days)"
                  type="number"
                  value={settings.security.passwordPolicy.expirationDays}
                  onChange={(e) =>
                    handleNestedSettingChange(
                      'security',
                      'passwordPolicy',
                      'expirationDays',
                      parseInt(e.target.value)
                    )
                  }
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={settings.security.passwordPolicy.requireUppercase}
                      onChange={(e) =>
                        handleNestedSettingChange(
                          'security',
                          'passwordPolicy',
                          'requireUppercase',
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Require Uppercase Letters"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={settings.security.passwordPolicy.requireLowercase}
                      onChange={(e) =>
                        handleNestedSettingChange(
                          'security',
                          'passwordPolicy',
                          'requireLowercase',
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Require Lowercase Letters"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={settings.security.passwordPolicy.requireNumbers}
                      onChange={(e) =>
                        handleNestedSettingChange(
                          'security',
                          'passwordPolicy',
                          'requireNumbers',
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Require Numbers"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={settings.security.passwordPolicy.requireSpecialChars}
                      onChange={(e) =>
                        handleNestedSettingChange(
                          'security',
                          'passwordPolicy',
                          'requireSpecialChars',
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Require Special Characters"
                />
              </Grid>
            </Grid>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Session Timeout (minutes)"
            type="number"
            value={settings.security.sessionTimeout}
            onChange={(e) =>
              handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))
            }
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Max Login Attempts"
            type="number"
            value={settings.security.maxLoginAttempts}
            onChange={(e) =>
              handleSettingChange('security', 'maxLoginAttempts', parseInt(e.target.value))
            }
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Lockout Duration (minutes)"
            type="number"
            value={settings.security.lockoutDuration}
            onChange={(e) =>
              handleSettingChange('security', 'lockoutDuration', parseInt(e.target.value))
            }
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.security.twoFactorEnabled}
                onChange={(e) =>
                  handleSettingChange('security', 'twoFactorEnabled', e.target.checked)
                }
              />
            }
            label="Enable Two-Factor Authentication"
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            IP Whitelist
          </Typography>
          <TextField
            fullWidth
            label="Allowed IP Addresses (comma separated)"
            value={settings.security.ipWhitelist.join(', ')}
            onChange={(e) =>
              handleSettingChange(
                'security',
                'ipWhitelist',
                e.target.value.split(',').map((ip) => ip.trim())
              )
            }
            helperText="Leave empty to allow all IPs"
            sx={{ mb: 2 }}
          />
        </Grid>
      </Grid>
    </Box>
  );

  const renderPerformanceTab = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Performance & Storage
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Caching
          </Typography>
          <Card variant="outlined" sx={{ p: 2, mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.performance.cacheEnabled}
                      onChange={(e) =>
                        handleSettingChange('performance', 'cacheEnabled', e.target.checked)
                      }
                    />
                  }
                  label="Enable Caching"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Cache Timeout (seconds)"
                  type="number"
                  value={settings.performance.cacheTimeout}
                  onChange={(e) =>
                    handleSettingChange('performance', 'cacheTimeout', parseInt(e.target.value))
                  }
                />
              </Grid>
            </Grid>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            File Uploads
          </Typography>
          <Card variant="outlined" sx={{ p: 2, mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Max File Size (MB)"
                  type="number"
                  value={settings.performance.maxFileSize}
                  onChange={(e) =>
                    handleSettingChange('performance', 'maxFileSize', parseInt(e.target.value))
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Max Attachments per Ticket"
                  type="number"
                  value={settings.performance.maxAttachments}
                  onChange={(e) =>
                    handleSettingChange('performance', 'maxAttachments', parseInt(e.target.value))
                  }
                />
              </Grid>
            </Grid>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.performance.compressionEnabled}
                onChange={(e) =>
                  handleSettingChange('performance', 'compressionEnabled', e.target.checked)
                }
              />
            }
            label="Enable Compression"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.performance.cdnEnabled}
                onChange={(e) => handleSettingChange('performance', 'cdnEnabled', e.target.checked)}
              />
            }
            label="Enable CDN"
          />
        </Grid>
      </Grid>
    </Box>
  );

  const renderMaintenanceTab = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Maintenance & Updates
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Alert severity="info" sx={{ mb: 2 }}>
            System maintenance settings allow you to control system updates and schedule maintenance
            windows.
          </Alert>
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.maintenance.maintenanceMode}
                onChange={(e) =>
                  handleSettingChange('maintenance', 'maintenanceMode', e.target.checked)
                }
              />
            }
            label="Maintenance Mode"
          />
          <Typography variant="body2" color="text.secondary">
            When enabled, users will see a maintenance message instead of the application.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Maintenance Message"
            multiline
            rows={3}
            value={settings.maintenance.maintenanceMessage}
            onChange={(e) =>
              handleSettingChange('maintenance', 'maintenanceMessage', e.target.value)
            }
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Scheduled Maintenance"
            type="datetime-local"
            value={settings.maintenance.scheduledMaintenance}
            onChange={(e) =>
              handleSettingChange('maintenance', 'scheduledMaintenance', e.target.value)
            }
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Update Channel</InputLabel>
            <Select
              value={settings.maintenance.updateChannel}
              label="Update Channel"
              onChange={(e) => handleSettingChange('maintenance', 'updateChannel', e.target.value)}
            >
              <MenuItem value="stable">Stable</MenuItem>
              <MenuItem value="beta">Beta</MenuItem>
              <MenuItem value="alpha">Alpha</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.maintenance.autoUpdates}
                onChange={(e) =>
                  handleSettingChange('maintenance', 'autoUpdates', e.target.checked)
                }
              />
            }
            label="Enable Automatic Updates"
          />
          <Typography variant="body2" color="text.secondary">
            When enabled, the system will automatically apply updates during maintenance windows.
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );

  const renderBackupTab = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Backup & Recovery
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Alert severity="success" sx={{ mb: 2 }}>
            Last backup: {new Date(settings.backup.lastBackup).toLocaleString()}
          </Alert>
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.backup.enabled}
                onChange={(e) => handleSettingChange('backup', 'enabled', e.target.checked)}
              />
            }
            label="Enable Automatic Backups"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Backup Frequency</InputLabel>
            <Select
              value={settings.backup.frequency}
              label="Backup Frequency"
              onChange={(e) => handleSettingChange('backup', 'frequency', e.target.value)}
            >
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Retention Period (days)"
            type="number"
            value={settings.backup.retention}
            onChange={(e) => handleSettingChange('backup', 'retention', parseInt(e.target.value))}
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Backup Location</InputLabel>
            <Select
              value={settings.backup.location}
              label="Backup Location"
              onChange={(e) => handleSettingChange('backup', 'location', e.target.value)}
            >
              <MenuItem value="local">Local Storage</MenuItem>
              <MenuItem value="cloud">Cloud Storage</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="outlined" startIcon={<BackupIcon />}>
              Create Backup Now
            </Button>
            <Button variant="outlined" startIcon={<RestoreIcon />}>
              Restore from Backup
            </Button>
            <Button variant="outlined" startIcon={<CloudDownloadIcon />}>
              Download Backup
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        System Settings
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Configure global system settings, security, and preferences
      </Typography>

      <Card>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab icon={<SettingsIcon />} label="General" />
          <Tab icon={<EmailIcon />} label="Email" />
          <Tab icon={<SecurityIcon />} label="Security" />
          <Tab icon={<SpeedIcon />} label="Performance" />
          <Tab icon={<ScheduleIcon />} label="Maintenance" />
          <Tab icon={<BackupIcon />} label="Backup" />
        </Tabs>
        <CardContent>
          {activeTab === 0 && renderGeneralTab()}
          {activeTab === 1 && renderEmailTab()}
          {activeTab === 2 && renderSecurityTab()}
          {activeTab === 3 && renderPerformanceTab()}
          {activeTab === 4 && renderMaintenanceTab()}
          {activeTab === 5 && renderBackupTab()}
        </CardContent>
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="outlined">Reset to Defaults</Button>
          <Button variant="contained" startIcon={<SaveIcon />}>
            Save Settings
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default SystemSettingsPage;
