import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  Chip,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Paper,
  TablePagination,
  Menu,
  Checkbox,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  PlayArrow,
  CheckCircle,
  Error,
  Warning,
  Info,
  Schedule,
  Group,
  FilterList,
  Search,
  Download,
  Event,
  Assignment,
  Settings,
  ContentCopy,
  Build,
  Security,
  Computer,
  Storage,
  NetworkCheck,
  TrendingUp,
  Speed,
  Policy,
} from '@mui/icons-material';
import { changeService } from '../services/change';
import {
  ChangeRequest,
  ChangeMetrics,
  ChangeTemplate,
  ChangeAdvisoryBoard,
  ChangeType,
  ChangeCategory,
  ChangePriority,
  ChangeRisk,
  ChangeStatus,
  ChangeAnalytics,
} from '../types/change';

interface ChangeManagementPageProps {}

const ChangeManagementPage: React.FC<ChangeManagementPageProps> = () => {
  const [changes, setChanges] = useState<ChangeRequest[]>([]);
  const [templates, setTemplates] = useState<ChangeTemplate[]>([]);
  const [cab, setCAB] = useState<ChangeAdvisoryBoard | null>(null);
  const [metrics, setMetrics] = useState<ChangeMetrics | null>(null);
  const [analytics, setAnalytics] = useState<ChangeAnalytics | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChange, setSelectedChange] = useState<ChangeRequest | null>(null);
  const [changeDialogOpen, setChangeDialogOpen] = useState(false);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ChangeTemplate | null>(null);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(null);
  const [bulkActionMenuAnchor, setBulkActionMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedChanges, setSelectedChanges] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [changeFormData, setChangeFormData] = useState<Partial<ChangeRequest>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setChanges(changeService.getAllChanges());
      setTemplates(changeService.getAllTemplates());
      setCAB(changeService.getCAB());
      setMetrics(changeService.getChangeMetrics());
      setAnalytics(changeService.getChangeAnalytics());
    } catch (err) {
      setError('Failed to load change data');
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const searchResults = changeService.searchChanges({ query });
    setChanges(searchResults.changes);
  };

  const handleCreateChange = () => {
    setSelectedChange(null);
    setChangeFormData({});
    setChangeDialogOpen(true);
  };

  const handleEditChange = (change: ChangeRequest) => {
    setSelectedChange(change);
    setChangeFormData(change);
    setChangeDialogOpen(true);
  };

  const handleDeleteChange = (changeId: string) => {
    if (window.confirm('Are you sure you want to delete this change?')) {
      changeService.deleteChange(changeId);
      loadData();
      setSuccess('Change deleted successfully');
    }
  };

  const handleSaveChange = () => {
    try {
      if (selectedChange) {
        changeService.updateChange(selectedChange.id, changeFormData);
      } else {
        changeService.createChange(changeFormData);
      }
      setChangeDialogOpen(false);
      loadData();
      setSuccess(selectedChange ? 'Change updated successfully' : 'Change created successfully');
    } catch (err) {
      setError('Failed to save change');
    }
  };

  const handleUseTemplate = (template: ChangeTemplate) => {
    setSelectedTemplate(template);
    setChangeFormData(template.template);
    setTemplateDialogOpen(true);
  };

  const handleCreateFromTemplate = () => {
    if (selectedTemplate) {
      const change = changeService.createChangeFromTemplate(selectedTemplate.id, changeFormData);
      if (change) {
        setTemplateDialogOpen(false);
        loadData();
        setSuccess('Change created from template successfully');
      }
    }
  };

  const handleCloneChange = (changeId: string) => {
    const clonedChange = changeService.cloneChange(changeId);
    if (clonedChange) {
      loadData();
      setSuccess('Change cloned successfully');
    }
  };

  const handleBulkAction = (action: string) => {
    if (selectedChanges.length === 0) return;

    switch (action) {
      case 'approve':
        selectedChanges.forEach((id) =>
          changeService.approveChange(id, 'current-user', 'Bulk approval')
        );
        break;
      case 'reject':
        selectedChanges.forEach((id) =>
          changeService.rejectChange(id, 'current-user', 'Bulk rejection')
        );
        break;
      case 'delete':
        if (window.confirm(`Are you sure you want to delete ${selectedChanges.length} changes?`)) {
          selectedChanges.forEach((id) => changeService.deleteChange(id));
        }
        break;
    }

    setSelectedChanges([]);
    setBulkActionMenuAnchor(null);
    loadData();
    setSuccess(`Bulk ${action} completed successfully`);
  };

  const getStatusColor = (status: ChangeStatus) => {
    switch (status) {
      case 'draft':
        return 'default';
      case 'submitted':
        return 'info';
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'in-progress':
        return 'warning';
      case 'completed':
        return 'success';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: ChangeStatus) => {
    switch (status) {
      case 'draft':
        return <Edit />;
      case 'submitted':
        return <Schedule />;
      case 'approved':
        return <CheckCircle />;
      case 'rejected':
        return <Error />;
      case 'in-progress':
        return <PlayArrow />;
      case 'completed':
        return <CheckCircle />;
      case 'failed':
        return <Error />;
      default:
        return <Info />;
    }
  };

  const getRiskColor = (risk: ChangeRisk) => {
    switch (risk) {
      case 'very-high':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      case 'low':
        return 'success';
      case 'very-low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority: ChangePriority) => {
    switch (priority) {
      case 'critical':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      case 'low':
        return 'success';
      case 'planning':
        return 'default';
      default:
        return 'default';
    }
  };

  const getTypeIcon = (type: ChangeType) => {
    switch (type) {
      case 'emergency':
        return <Warning />;
      case 'major':
        return <Assignment />;
      case 'normal':
        return <Build />;
      case 'minor':
        return <Settings />;
      case 'standard':
        return <Policy />;
      case 'preauthorized':
        return <CheckCircle />;
      default:
        return <Info />;
    }
  };

  const getCategoryIcon = (category: ChangeCategory) => {
    switch (category) {
      case 'infrastructure':
        return <Computer />;
      case 'application':
        return <Computer />;
      case 'security':
        return <Security />;
      case 'database':
        return <Storage />;
      case 'network':
        return <NetworkCheck />;
      case 'hardware':
        return <Computer />;
      case 'software':
        return <Computer />;
      default:
        return <Build />;
    }
  };

  const OverviewTab = () => (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Key Metrics */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Assignment color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Changes</Typography>
              </Box>
              <Typography variant="h3" color="primary.main">
                {metrics?.totalChanges || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {metrics?.pendingChanges || 0} pending approval
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Success Rate</Typography>
              </Box>
              <Typography variant="h3" color="success.main">
                {metrics?.successRate.toFixed(1) || 0}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {metrics?.implementedChanges || 0} successful
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Speed color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6">Avg Implementation</Typography>
              </Box>
              <Typography variant="h3" color="warning.main">
                {metrics?.averageImplementationTime || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                minutes average
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Warning color="error" sx={{ mr: 1 }} />
                <Typography variant="h6">Emergency Changes</Typography>
              </Box>
              <Typography variant="h3" color="error.main">
                {metrics?.emergencyChanges || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                this month
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Change by Status */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Changes by Status
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Typography variant="body2">Draft</Typography>
                  <Chip label={changes.filter((c) => c.status === 'draft').length} size="small" />
                </Box>
                <Box
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Typography variant="body2">Submitted</Typography>
                  <Chip
                    label={changes.filter((c) => c.status === 'submitted').length}
                    size="small"
                    color="info"
                  />
                </Box>
                <Box
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Typography variant="body2">Approved</Typography>
                  <Chip
                    label={changes.filter((c) => c.status === 'approved').length}
                    size="small"
                    color="success"
                  />
                </Box>
                <Box
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Typography variant="body2">In Progress</Typography>
                  <Chip
                    label={changes.filter((c) => c.status === 'in-progress').length}
                    size="small"
                    color="warning"
                  />
                </Box>
                <Box
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Typography variant="body2">Completed</Typography>
                  <Chip
                    label={changes.filter((c) => c.status === 'completed').length}
                    size="small"
                    color="success"
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Changes */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Changes
              </Typography>
              <List>
                {changes.slice(0, 5).map((change) => (
                  <ListItem key={change.id} divider>
                    <ListItemIcon>{getTypeIcon(change.type)}</ListItemIcon>
                    <ListItemText
                      primary={change.title}
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip
                            label={change.status}
                            size="small"
                            color={getStatusColor(change.status)}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {new Date(change.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const ChangesTab = () => (
    <Box sx={{ p: 3 }}>
      {/* Search and Actions */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
        <TextField
          placeholder="Search changes..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          InputProps={{
            startAdornment: <Search />,
          }}
          sx={{ minWidth: 300 }}
        />
        <Button
          variant="outlined"
          startIcon={<FilterList />}
          onClick={(e) => setFilterMenuAnchor(e.currentTarget)}
        >
          Filter
        </Button>
        <Button variant="outlined" startIcon={<Download />} disabled={selectedChanges.length === 0}>
          Export
        </Button>
        <Button
          variant="outlined"
          startIcon={<Assignment />}
          disabled={selectedChanges.length === 0}
          onClick={(e) => setBulkActionMenuAnchor(e.currentTarget)}
        >
          Bulk Actions
        </Button>
        <Button variant="contained" startIcon={<Add />} onClick={handleCreateChange}>
          New Change
        </Button>
      </Box>

      {/* Changes Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedChanges.length === changes.length}
                  indeterminate={
                    selectedChanges.length > 0 && selectedChanges.length < changes.length
                  }
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedChanges(changes.map((c) => c.id));
                    } else {
                      setSelectedChanges([]);
                    }
                  }}
                />
              </TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Risk</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Assignee</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {changes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((change) => (
              <TableRow key={change.id}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedChanges.includes(change.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedChanges([...selectedChanges, change.id]);
                      } else {
                        setSelectedChanges(selectedChanges.filter((id) => id !== change.id));
                      }
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    {change.id}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{change.title}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {change.description.length > 50
                      ? `${change.description.substring(0, 50)}...`
                      : change.description}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getTypeIcon(change.type)}
                    <Typography variant="body2" textTransform="capitalize">
                      {change.type}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getCategoryIcon(change.category)}
                    <Typography variant="body2" textTransform="capitalize">
                      {change.category}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={change.priority}
                    size="small"
                    color={getPriorityColor(change.priority)}
                  />
                </TableCell>
                <TableCell>
                  <Chip label={change.risk} size="small" color={getRiskColor(change.risk)} />
                </TableCell>
                <TableCell>
                  <Chip
                    label={change.status}
                    size="small"
                    color={getStatusColor(change.status)}
                    icon={getStatusIcon(change.status)}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 24, height: 24 }}>
                      {change.assignedToName ? change.assignedToName.charAt(0) : 'U'}
                    </Avatar>
                    <Typography variant="body2">{change.assignedToName || 'Unassigned'}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {new Date(change.createdAt).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="View">
                      <IconButton size="small" onClick={() => handleEditChange(change)}>
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => handleEditChange(change)}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Clone">
                      <IconButton size="small" onClick={() => handleCloneChange(change.id)}>
                        <ContentCopy />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" onClick={() => handleDeleteChange(change.id)}>
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={changes.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
        />
      </TableContainer>

      {/* Filter Menu */}
      <Menu
        anchorEl={filterMenuAnchor}
        open={Boolean(filterMenuAnchor)}
        onClose={() => setFilterMenuAnchor(null)}
      >
        <MenuItem onClick={() => setFilterMenuAnchor(null)}>Filter by Status</MenuItem>
        <MenuItem onClick={() => setFilterMenuAnchor(null)}>Filter by Type</MenuItem>
        <MenuItem onClick={() => setFilterMenuAnchor(null)}>Filter by Category</MenuItem>
        <MenuItem onClick={() => setFilterMenuAnchor(null)}>Filter by Priority</MenuItem>
        <MenuItem onClick={() => setFilterMenuAnchor(null)}>Filter by Risk</MenuItem>
      </Menu>

      {/* Bulk Actions Menu */}
      <Menu
        anchorEl={bulkActionMenuAnchor}
        open={Boolean(bulkActionMenuAnchor)}
        onClose={() => setBulkActionMenuAnchor(null)}
      >
        <MenuItem onClick={() => handleBulkAction('approve')}>Approve Selected</MenuItem>
        <MenuItem onClick={() => handleBulkAction('reject')}>Reject Selected</MenuItem>
        <MenuItem onClick={() => handleBulkAction('delete')}>Delete Selected</MenuItem>
      </Menu>
    </Box>
  );

  const TemplatesTab = () => (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6">Change Templates</Typography>
        <Button variant="contained" startIcon={<Add />}>
          Create Template
        </Button>
      </Box>

      <Grid container spacing={3}>
        {templates.map((template) => (
          <Grid item xs={12} md={6} lg={4} key={template.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {getCategoryIcon(template.category)}
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    {template.name}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {template.description}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Chip label={template.type} size="small" />
                  <Chip label={template.category} size="small" />
                  <Chip
                    label={template.priority}
                    size="small"
                    color={getPriorityColor(template.priority)}
                  />
                </Box>
                <Box
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Used {template.usage} times
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleUseTemplate(template)}
                  >
                    Use Template
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const CABTab = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Change Advisory Board
      </Typography>

      {cab && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {cab.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {cab.description}
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Chip label={`${cab.members.length} Members`} icon={<Group />} />
                  <Chip label={cab.meetingSchedule} icon={<Schedule />} />
                  <Chip
                    label={cab.active ? 'Active' : 'Inactive'}
                    color={cab.active ? 'success' : 'default'}
                  />
                </Box>

                <Typography variant="subtitle1" gutterBottom>
                  CAB Members
                </Typography>
                <List>
                  {cab.members.map((member) => (
                    <ListItem key={member.id}>
                      <ListItemIcon>
                        <Avatar sx={{ width: 32, height: 32 }}>{member.userName.charAt(0)}</Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={member.userName}
                        secondary={`${member.role} - ${member.department}`}
                      />
                      <Chip
                        label={member.primary ? 'Primary' : 'Backup'}
                        size="small"
                        color={member.primary ? 'primary' : 'default'}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Next Meeting
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {cab.nextMeeting ? new Date(cab.nextMeeting).toLocaleString() : 'Not scheduled'}
                </Typography>
                <Button variant="outlined" fullWidth sx={{ mt: 2 }} startIcon={<Event />}>
                  Schedule Meeting
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );

  const AnalyticsTab = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Change Analytics
      </Typography>

      {analytics && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Success Rate
                </Typography>
                <Typography variant="h3" color="success.main">
                  {analytics.successRate.toFixed(1)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Overall implementation success
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Avg Implementation Time
                </Typography>
                <Typography variant="h3" color="primary.main">
                  {analytics.averageImplementationTime}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  minutes on average
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Avg Approval Time
                </Typography>
                <Typography variant="h3" color="warning.main">
                  {analytics.averageApprovalTime}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  hours on average
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Trends and Patterns
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      Peak Submission Times
                    </Typography>
                    <List dense>
                      {analytics.trendsAndPatterns.peakSubmissionTimes.map((time, index) => (
                        <ListItem key={index}>
                          <ListItemText primary={time} />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      Improvement Opportunities
                    </Typography>
                    <List dense>
                      {analytics.trendsAndPatterns.improvementOpportunities.map(
                        (opportunity, index) => (
                          <ListItem key={index}>
                            <ListItemText primary={opportunity} />
                          </ListItem>
                        )
                      )}
                    </List>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Change Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Overview" />
        <Tab label="Changes" />
        <Tab label="Templates" />
        <Tab label="CAB" />
        <Tab label="Analytics" />
      </Tabs>

      {activeTab === 0 && <OverviewTab />}
      {activeTab === 1 && <ChangesTab />}
      {activeTab === 2 && <TemplatesTab />}
      {activeTab === 3 && <CABTab />}
      {activeTab === 4 && <AnalyticsTab />}

      {/* Change Dialog */}
      <Dialog
        open={changeDialogOpen}
        onClose={() => setChangeDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{selectedChange ? 'Edit Change' : 'Create New Change'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Title"
                fullWidth
                value={changeFormData.title || ''}
                onChange={(e) => setChangeFormData({ ...changeFormData, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={changeFormData.description || ''}
                onChange={(e) =>
                  setChangeFormData({ ...changeFormData, description: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={changeFormData.type || ''}
                  onChange={(e) =>
                    setChangeFormData({ ...changeFormData, type: e.target.value as ChangeType })
                  }
                >
                  <MenuItem value="standard">Standard</MenuItem>
                  <MenuItem value="normal">Normal</MenuItem>
                  <MenuItem value="emergency">Emergency</MenuItem>
                  <MenuItem value="major">Major</MenuItem>
                  <MenuItem value="minor">Minor</MenuItem>
                  <MenuItem value="preauthorized">Pre-authorized</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={changeFormData.category || ''}
                  onChange={(e) =>
                    setChangeFormData({
                      ...changeFormData,
                      category: e.target.value as ChangeCategory,
                    })
                  }
                >
                  <MenuItem value="infrastructure">Infrastructure</MenuItem>
                  <MenuItem value="application">Application</MenuItem>
                  <MenuItem value="security">Security</MenuItem>
                  <MenuItem value="database">Database</MenuItem>
                  <MenuItem value="network">Network</MenuItem>
                  <MenuItem value="hardware">Hardware</MenuItem>
                  <MenuItem value="software">Software</MenuItem>
                  <MenuItem value="process">Process</MenuItem>
                  <MenuItem value="documentation">Documentation</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={changeFormData.priority || ''}
                  onChange={(e) =>
                    setChangeFormData({
                      ...changeFormData,
                      priority: e.target.value as ChangePriority,
                    })
                  }
                >
                  <MenuItem value="critical">Critical</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="planning">Planning</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Risk</InputLabel>
                <Select
                  value={changeFormData.risk || ''}
                  onChange={(e) =>
                    setChangeFormData({ ...changeFormData, risk: e.target.value as ChangeRisk })
                  }
                >
                  <MenuItem value="very-high">Very High</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="very-low">Very Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Implementation Plan"
                fullWidth
                multiline
                rows={4}
                value={changeFormData.implementationPlan || ''}
                onChange={(e) =>
                  setChangeFormData({ ...changeFormData, implementationPlan: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Rollback Plan"
                fullWidth
                multiline
                rows={3}
                value={changeFormData.rollbackPlan || ''}
                onChange={(e) =>
                  setChangeFormData({ ...changeFormData, rollbackPlan: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Business Justification"
                fullWidth
                multiline
                rows={3}
                value={changeFormData.businessJustification || ''}
                onChange={(e) =>
                  setChangeFormData({ ...changeFormData, businessJustification: e.target.value })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChangeDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveChange} variant="contained">
            {selectedChange ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Template Dialog */}
      <Dialog
        open={templateDialogOpen}
        onClose={() => setTemplateDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create Change from Template</DialogTitle>
        <DialogContent>
          {selectedTemplate && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                {selectedTemplate.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {selectedTemplate.description}
              </Typography>
              <TextField
                label="Title"
                fullWidth
                value={changeFormData.title || ''}
                onChange={(e) => setChangeFormData({ ...changeFormData, title: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={changeFormData.description || ''}
                onChange={(e) =>
                  setChangeFormData({ ...changeFormData, description: e.target.value })
                }
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTemplateDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateFromTemplate} variant="contained">
            Create Change
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ChangeManagementPage;
