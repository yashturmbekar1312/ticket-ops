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
  TextField,
  IconButton,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Avatar,
  LinearProgress,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  AccessTime as AccessTimeIcon,
  MonetizationOn as MonetizationOnIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';

interface TimeEntry {
  id: string;
  user: string;
  project: string;
  task: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  status: 'active' | 'paused' | 'completed' | 'billed';
  billable: boolean;
  billableRate: number;
  tags: string[];
  ticket?: string;
  createdAt: string;
  updatedAt: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  client: string;
  budget: number;
  hourlyRate: number;
  status: 'active' | 'completed' | 'on_hold' | 'cancelled';
  startDate: string;
  endDate: string;
  team: string[];
  totalHours: number;
  billedHours: number;
  remainingBudget: number;
  createdAt: string;
}

interface Task {
  id: string;
  name: string;
  description: string;
  project: string;
  assignee: string;
  estimatedHours: number;
  actualHours: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: string;
  createdAt: string;
}

interface TimeReport {
  period: string;
  totalHours: number;
  billableHours: number;
  nonBillableHours: number;
  totalRevenue: number;
  projects: {
    name: string;
    hours: number;
    revenue: number;
  }[];
  users: {
    name: string;
    hours: number;
    billableHours: number;
  }[];
}

const TimeTrackingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'entry' | 'project' | 'task' | null>(null);
  const [currentTimer, setCurrentTimer] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Mock data
  const timeEntries: TimeEntry[] = [
    {
      id: '1',
      user: 'john.smith@company.com',
      project: 'Website Redesign',
      task: 'Homepage Layout',
      description: 'Working on the new homepage layout design',
      date: '2024-01-15',
      startTime: '09:00',
      endTime: '12:30',
      duration: 210,
      status: 'completed',
      billable: true,
      billableRate: 85,
      tags: ['design', 'frontend'],
      ticket: 'TICK-001',
      createdAt: '2024-01-15T09:00:00Z',
      updatedAt: '2024-01-15T12:30:00Z',
    },
    {
      id: '2',
      user: 'jane.doe@company.com',
      project: 'Mobile App Development',
      task: 'API Integration',
      description: 'Integrating backend APIs for user authentication',
      date: '2024-01-15',
      startTime: '10:00',
      endTime: '16:00',
      duration: 360,
      status: 'completed',
      billable: true,
      billableRate: 95,
      tags: ['backend', 'api'],
      ticket: 'TICK-002',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T16:00:00Z',
    },
    {
      id: '3',
      user: 'bob.johnson@company.com',
      project: 'Internal Tools',
      task: 'Bug Fixes',
      description: 'Fixing reported bugs in the dashboard',
      date: '2024-01-15',
      startTime: '14:00',
      endTime: '17:00',
      duration: 180,
      status: 'completed',
      billable: false,
      billableRate: 0,
      tags: ['bugfix', 'internal'],
      createdAt: '2024-01-15T14:00:00Z',
      updatedAt: '2024-01-15T17:00:00Z',
    },
  ];

  const projects: Project[] = [
    {
      id: '1',
      name: 'Website Redesign',
      description: 'Complete redesign of company website',
      client: 'ABC Corporation',
      budget: 50000,
      hourlyRate: 85,
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2024-03-31',
      team: ['john.smith@company.com', 'jane.doe@company.com'],
      totalHours: 245,
      billedHours: 220,
      remainingBudget: 31500,
      createdAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      name: 'Mobile App Development',
      description: 'Native iOS and Android app development',
      client: 'XYZ Inc.',
      budget: 75000,
      hourlyRate: 95,
      status: 'active',
      startDate: '2024-01-15',
      endDate: '2024-06-30',
      team: ['jane.doe@company.com', 'bob.johnson@company.com'],
      totalHours: 156,
      billedHours: 140,
      remainingBudget: 61700,
      createdAt: '2024-01-15T00:00:00Z',
    },
    {
      id: '3',
      name: 'Internal Tools',
      description: 'Internal productivity tools and systems',
      client: 'Internal',
      budget: 25000,
      hourlyRate: 0,
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      team: ['bob.johnson@company.com'],
      totalHours: 89,
      billedHours: 0,
      remainingBudget: 25000,
      createdAt: '2024-01-01T00:00:00Z',
    },
  ];

  const tasks: Task[] = [
    {
      id: '1',
      name: 'Homepage Layout',
      description: 'Design and implement the new homepage layout',
      project: 'Website Redesign',
      assignee: 'john.smith@company.com',
      estimatedHours: 20,
      actualHours: 18,
      status: 'completed',
      priority: 'high',
      dueDate: '2024-01-20',
      createdAt: '2024-01-10T00:00:00Z',
    },
    {
      id: '2',
      name: 'API Integration',
      description: 'Integrate backend APIs for mobile app',
      project: 'Mobile App Development',
      assignee: 'jane.doe@company.com',
      estimatedHours: 30,
      actualHours: 25,
      status: 'in_progress',
      priority: 'high',
      dueDate: '2024-01-25',
      createdAt: '2024-01-12T00:00:00Z',
    },
    {
      id: '3',
      name: 'Bug Fixes',
      description: 'Fix reported bugs in dashboard',
      project: 'Internal Tools',
      assignee: 'bob.johnson@company.com',
      estimatedHours: 15,
      actualHours: 12,
      status: 'completed',
      priority: 'medium',
      dueDate: '2024-01-18',
      createdAt: '2024-01-14T00:00:00Z',
    },
  ];

  const currentWeekReport: TimeReport = {
    period: 'Week of January 15, 2024',
    totalHours: 167,
    billableHours: 142,
    nonBillableHours: 25,
    totalRevenue: 13490,
    projects: [
      { name: 'Website Redesign', hours: 75, revenue: 6375 },
      { name: 'Mobile App Development', hours: 67, revenue: 6365 },
      { name: 'Internal Tools', hours: 25, revenue: 0 },
    ],
    users: [
      { name: 'John Smith', hours: 58, billableHours: 50 },
      { name: 'Jane Doe', hours: 64, billableHours: 62 },
      { name: 'Bob Johnson', hours: 45, billableHours: 30 },
    ],
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleOpenDialog = (type: 'entry' | 'project' | 'task') => {
    setDialogType(type);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogType(null);
  };

  const handleStartTimer = (entryId: string) => {
    setCurrentTimer(entryId);
    setElapsedTime(0);
  };

  const handleStopTimer = () => {
    setCurrentTimer(null);
    setElapsedTime(0);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'completed':
        return 'primary';
      case 'paused':
        return 'warning';
      case 'billed':
        return 'info';
      default:
        return 'default';
    }
  };

  const renderTimeEntriesTab = () => (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Time Entries</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog('entry')}
        >
          Add Time Entry
        </Button>
      </Box>

      {/* Active Timer */}
      {currentTimer && (
        <Card sx={{ mb: 3, bgcolor: 'primary.50' }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6" color="primary">
                  Timer Running
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Working on: Homepage Layout
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="h4" color="primary">
                  {formatTime(elapsedTime)}
                </Typography>
                <IconButton color="warning" onClick={() => setCurrentTimer(null)}>
                  <PauseIcon />
                </IconButton>
                <IconButton color="error" onClick={handleStopTimer}>
                  <StopIcon />
                </IconButton>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Project</TableCell>
              <TableCell>Task</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Billable</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {timeEntries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                <TableCell>{entry.project}</TableCell>
                <TableCell>{entry.task}</TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}
                  >
                    {entry.description}
                  </Typography>
                </TableCell>
                <TableCell>{formatDuration(entry.duration)}</TableCell>
                <TableCell>
                  <Chip
                    label={entry.status}
                    size="small"
                    color={getStatusColor(entry.status) as any}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      label={entry.billable ? 'Billable' : 'Non-billable'}
                      size="small"
                      color={entry.billable ? 'success' : 'default'}
                    />
                    {entry.billable && (
                      <Typography variant="body2" color="text.secondary">
                        ${entry.billableRate}/hr
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleStartTimer(entry.id)}>
                    <PlayArrowIcon />
                  </IconButton>
                  <IconButton size="small">
                    <EditIcon />
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

  const renderProjectsTab = () => (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Projects</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog('project')}
        >
          Add Project
        </Button>
      </Box>

      <Grid container spacing={3}>
        {projects.map((project) => (
          <Grid item xs={12} md={6} key={project.id}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 2,
                  }}
                >
                  <Box>
                    <Typography variant="h6" component="div">
                      {project.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {project.client}
                    </Typography>
                  </Box>
                  <Chip
                    label={project.status}
                    size="small"
                    color={project.status === 'active' ? 'success' : 'default'}
                  />
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {project.description}
                </Typography>

                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      Budget: ${project.budget.toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">Rate: ${project.hourlyRate}/hr</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">Total Hours: {project.totalHours}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">Billed Hours: {project.billedHours}</Typography>
                  </Grid>
                </Grid>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Budget Remaining: ${project.remainingBudget.toLocaleString()}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={((project.budget - project.remainingBudget) / project.budget) * 100}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Team:
                  </Typography>
                  {project.team.map((member, index) => (
                    <Avatar key={index} sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                      {member.charAt(0).toUpperCase()}
                    </Avatar>
                  ))}
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 2,
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    {new Date(project.startDate).toLocaleDateString()} -{' '}
                    {new Date(project.endDate).toLocaleDateString()}
                  </Typography>
                  <Box>
                    <IconButton size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small">
                      <VisibilityIcon />
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

  const renderTasksTab = () => (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Tasks</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog('task')}
        >
          Add Task
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Task</TableCell>
              <TableCell>Project</TableCell>
              <TableCell>Assignee</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Progress</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      {task.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {task.description}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{task.project}</TableCell>
                <TableCell>{task.assignee}</TableCell>
                <TableCell>
                  <Chip
                    label={task.status.replace('_', ' ')}
                    size="small"
                    color={
                      task.status === 'completed'
                        ? 'success'
                        : task.status === 'in_progress'
                          ? 'primary'
                          : 'default'
                    }
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={task.priority}
                    size="small"
                    color={
                      task.priority === 'urgent'
                        ? 'error'
                        : task.priority === 'high'
                          ? 'warning'
                          : task.priority === 'medium'
                            ? 'primary'
                            : 'default'
                    }
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={(task.actualHours / task.estimatedHours) * 100}
                      sx={{ width: 60 }}
                    />
                    <Typography variant="body2">
                      {task.actualHours}h / {task.estimatedHours}h
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    color={new Date(task.dueDate) < new Date() ? 'error' : 'text.primary'}
                  >
                    {new Date(task.dueDate).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <IconButton size="small">
                    <EditIcon />
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

  const renderReportsTab = () => (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Time Reports</Typography>
        <Box>
          <Button variant="outlined" startIcon={<DownloadIcon />} sx={{ mr: 1 }}>
            Export CSV
          </Button>
          <Button variant="outlined" startIcon={<DownloadIcon />}>
            Export PDF
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <AccessTimeIcon color="primary" />
                <Box>
                  <Typography variant="h6">{currentWeekReport.totalHours}h</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Hours
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <MonetizationOnIcon color="success" />
                <Box>
                  <Typography variant="h6">{currentWeekReport.billableHours}h</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Billable Hours
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <WorkIcon color="warning" />
                <Box>
                  <Typography variant="h6">{currentWeekReport.nonBillableHours}h</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Non-billable Hours
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <ReceiptIcon color="info" />
                <Box>
                  <Typography variant="h6">
                    ${currentWeekReport.totalRevenue.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Revenue
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Project Breakdown */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Hours by Project
              </Typography>
              <List>
                {currentWeekReport.projects.map((project, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <WorkIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={project.name}
                      secondary={`${project.hours}h - $${project.revenue.toLocaleString()}`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* User Breakdown */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Hours by User
              </Typography>
              <List>
                {currentWeekReport.users.map((user, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <PersonIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={user.name}
                      secondary={`${user.hours}h total (${user.billableHours}h billable)`}
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

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Time Tracking & Billing
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Track time, manage projects, and generate billing reports
      </Typography>

      <Card>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Time Entries" />
          <Tab label="Projects" />
          <Tab label="Tasks" />
          <Tab label="Reports" />
        </Tabs>
        <CardContent>
          {activeTab === 0 && renderTimeEntriesTab()}
          {activeTab === 1 && renderProjectsTab()}
          {activeTab === 2 && renderTasksTab()}
          {activeTab === 3 && renderReportsTab()}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogType === 'entry' && 'Add Time Entry'}
          {dialogType === 'project' && 'Add Project'}
          {dialogType === 'task' && 'Add Task'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {dialogType === 'entry' && (
              <>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Project</InputLabel>
                    <Select label="Project">
                      {projects.map((project) => (
                        <MenuItem key={project.id} value={project.id}>
                          {project.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Task</InputLabel>
                    <Select label="Task">
                      {tasks.map((task) => (
                        <MenuItem key={task.id} value={task.id}>
                          {task.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Description" multiline rows={3} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Start Time"
                    type="time"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="End Time"
                    type="time"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel control={<Switch />} label="Billable" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Hourly Rate"
                    type="number"
                    InputProps={{
                      startAdornment: '$',
                    }}
                  />
                </Grid>
              </>
            )}
            {dialogType === 'project' && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Project Name" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Client" />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Description" multiline rows={3} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Budget"
                    type="number"
                    InputProps={{
                      startAdornment: '$',
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Hourly Rate"
                    type="number"
                    InputProps={{
                      startAdornment: '$',
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select label="Status">
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="on_hold">On Hold</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                      <MenuItem value="cancelled">Cancelled</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}
            {dialogType === 'task' && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Task Name" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Project</InputLabel>
                    <Select label="Project">
                      {projects.map((project) => (
                        <MenuItem key={project.id} value={project.id}>
                          {project.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Description" multiline rows={3} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="Estimated Hours" type="number" />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Priority</InputLabel>
                    <Select label="Priority">
                      <MenuItem value="low">Low</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="high">High</MenuItem>
                      <MenuItem value="urgent">Urgent</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Due Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleCloseDialog}>
            {dialogType === 'entry'
              ? 'Add Entry'
              : dialogType === 'project'
                ? 'Create Project'
                : 'Create Task'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TimeTrackingPage;
