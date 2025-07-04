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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Alert,
  Avatar,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Psychology as ProblemIcon,
  BugReport as BugIcon,
  Search as SearchIcon,
  TrendingUp as TrendingIcon,
  Assignment as IncidentIcon,
  CheckCircle as ResolvedIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Assessment as AnalysisIcon,
  AutoFixHigh as WorkaroundIcon,
  Pending as PendingIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { useAuth } from '../hooks/auth';

interface Problem {
  id: string;
  title: string;
  description: string;
  category: string;
  status:
    | 'identified'
    | 'investigating'
    | 'root_cause_found'
    | 'workaround_implemented'
    | 'resolved'
    | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  impact: 'low' | 'medium' | 'high' | 'critical';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  createdDate: string;
  lastUpdate: string;
  assignedTo: string;
  assignedTeam: string;
  relatedIncidents: string[];
  rootCause?: string;
  workaround?: string;
  resolution?: string;
  knownErrorId?: string;
  estimatedResolution?: string;
  actualResolution?: string;
  preventiveMeasures?: string[];
  lessonsLearned?: string;
  businessImpact: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  affectedServices: string[];
  stakeholders: string[];
  cost: number;
  timeSpent: number;
  customerImpact: number;
  tags: string[];
  attachments: string[];
}

interface KnownError {
  id: string;
  problemId: string;
  title: string;
  description: string;
  symptoms: string[];
  workaround: string;
  resolution: string;
  status: 'active' | 'resolved' | 'obsolete';
  createdDate: string;
  lastUpdate: string;
  usageCount: number;
  effectivenessRating: number;
  category: string;
  tags: string[];
  relatedArticles: string[];
}

interface RootCauseAnalysis {
  id: string;
  problemId: string;
  method: 'five_whys' | 'fishbone' | 'fault_tree' | 'timeline' | 'other';
  findings: string[];
  rootCause: string;
  contributingFactors: string[];
  evidence: string[];
  analysisDate: string;
  analyst: string;
  reviewedBy?: string;
  reviewDate?: string;
  approved: boolean;
}

interface Incident {
  id: string;
  title: string;
  status: string;
  priority: string;
  createdDate: string;
  resolvedDate?: string;
  category: string;
  impact: string;
  affectedUsers: number;
}

const ProblemManagementPage: React.FC = () => {
  const {} = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'create' | 'edit' | 'view' | 'rca' | 'known_error'>(
    'create'
  );
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Mock data
  const [problems] = useState<Problem[]>([
    {
      id: 'PRB-001',
      title: 'Recurring Email Server Outages',
      description: 'Email server experiences intermittent outages affecting 500+ users weekly',
      category: 'Infrastructure',
      status: 'investigating',
      priority: 'high',
      impact: 'high',
      urgency: 'medium',
      createdDate: '2024-03-10',
      lastUpdate: '2024-03-18',
      assignedTo: 'Senior Infrastructure Engineer',
      assignedTeam: 'Infrastructure Team',
      relatedIncidents: ['INC-001', 'INC-005', 'INC-012', 'INC-018'],
      businessImpact: 'Loss of productivity, delayed communications, customer complaints',
      riskLevel: 'high',
      affectedServices: ['Email Service', 'Calendar Service', 'Mobile Email'],
      stakeholders: ['IT Director', 'Business Units', 'Customer Support'],
      cost: 25000,
      timeSpent: 40,
      customerImpact: 500,
      tags: ['email', 'outage', 'recurring', 'infrastructure'],
      attachments: ['server_logs.zip', 'performance_metrics.xlsx'],
    },
    {
      id: 'PRB-002',
      title: 'Slow Database Performance',
      description: 'Application database showing degraded performance during peak hours',
      category: 'Database',
      status: 'root_cause_found',
      priority: 'medium',
      impact: 'medium',
      urgency: 'medium',
      createdDate: '2024-03-05',
      lastUpdate: '2024-03-17',
      assignedTo: 'Database Administrator',
      assignedTeam: 'Database Team',
      relatedIncidents: ['INC-003', 'INC-007', 'INC-014'],
      rootCause: 'Inefficient query execution due to missing indexes and outdated statistics',
      workaround: 'Restart database service during off-peak hours to clear cache',
      businessImpact: 'Slow application response times, user frustration',
      riskLevel: 'medium',
      affectedServices: ['Customer Portal', 'Internal Applications'],
      stakeholders: ['Development Team', 'Customer Support'],
      cost: 12000,
      timeSpent: 25,
      customerImpact: 200,
      tags: ['database', 'performance', 'query', 'optimization'],
      attachments: ['query_analysis.pdf', 'performance_baseline.xlsx'],
    },
    {
      id: 'PRB-003',
      title: 'VPN Connection Issues',
      description: 'Remote users experiencing frequent VPN disconnections',
      category: 'Network',
      status: 'workaround_implemented',
      priority: 'high',
      impact: 'high',
      urgency: 'high',
      createdDate: '2024-03-12',
      lastUpdate: '2024-03-18',
      assignedTo: 'Network Engineer',
      assignedTeam: 'Network Team',
      relatedIncidents: ['INC-009', 'INC-015', 'INC-020'],
      rootCause: 'VPN concentrator overload during peak usage hours',
      workaround: 'Load balancing across multiple VPN servers',
      knownErrorId: 'KE-001',
      businessImpact: 'Remote work productivity loss, increased support tickets',
      riskLevel: 'high',
      affectedServices: ['VPN Service', 'Remote Access'],
      stakeholders: ['Remote Employees', 'IT Support', 'Management'],
      cost: 8000,
      timeSpent: 30,
      customerImpact: 150,
      tags: ['vpn', 'network', 'remote', 'connection'],
      attachments: ['vpn_logs.log', 'network_diagram.png'],
    },
  ]);

  const [knownErrors] = useState<KnownError[]>([
    {
      id: 'KE-001',
      problemId: 'PRB-003',
      title: 'VPN Concentrator Overload',
      description: 'VPN concentrator reaches capacity during peak hours causing disconnections',
      symptoms: [
        'Users receive "connection failed" errors',
        'Frequent disconnections during 9-11 AM and 1-3 PM',
        'Slow VPN connection establishment',
      ],
      workaround: 'Connect to alternate VPN server or retry connection during off-peak hours',
      resolution: 'Implement load balancing across multiple VPN concentrators',
      status: 'active',
      createdDate: '2024-03-15',
      lastUpdate: '2024-03-18',
      usageCount: 45,
      effectivenessRating: 3.8,
      category: 'Network',
      tags: ['vpn', 'capacity', 'load-balancing'],
      relatedArticles: ['KB-001', 'KB-015'],
    },
    {
      id: 'KE-002',
      problemId: 'PRB-002',
      title: 'Database Query Performance',
      description: 'Specific database queries cause performance degradation',
      symptoms: [
        'Application response times > 30 seconds',
        'Database CPU usage spikes to 90%+',
        'Query timeout errors in application logs',
      ],
      workaround: 'Restart database service to clear query cache',
      resolution: 'Optimize queries and rebuild indexes',
      status: 'resolved',
      createdDate: '2024-03-08',
      lastUpdate: '2024-03-17',
      usageCount: 23,
      effectivenessRating: 4.2,
      category: 'Database',
      tags: ['database', 'performance', 'queries'],
      relatedArticles: ['KB-008', 'KB-012'],
    },
  ]);

  const [rootCauseAnalyses] = useState<RootCauseAnalysis[]>([
    {
      id: 'RCA-001',
      problemId: 'PRB-002',
      method: 'five_whys',
      findings: [
        'Why is the database slow? - Query execution times are high',
        'Why are query times high? - Missing indexes on frequently queried columns',
        'Why are indexes missing? - Database schema changes not followed by index updates',
        "Why weren't indexes updated? - No automated process for index maintenance",
        'Why no automated process? - Lack of database maintenance procedures',
      ],
      rootCause: 'Absence of automated database maintenance procedures',
      contributingFactors: [
        'Rapid application development without DBA review',
        'Lack of query performance monitoring',
        'Missing database maintenance documentation',
      ],
      evidence: [
        'Query execution plans showing full table scans',
        'Database performance metrics showing degradation',
        'Application error logs with timeout errors',
      ],
      analysisDate: '2024-03-16',
      analyst: 'Senior Database Administrator',
      reviewedBy: 'IT Manager',
      reviewDate: '2024-03-17',
      approved: true,
    },
  ]);

  const [relatedIncidents] = useState<Incident[]>([
    {
      id: 'INC-001',
      title: 'Email service down',
      status: 'resolved',
      priority: 'high',
      createdDate: '2024-03-10',
      resolvedDate: '2024-03-10',
      category: 'Infrastructure',
      impact: 'high',
      affectedUsers: 500,
    },
    {
      id: 'INC-005',
      title: 'Email connectivity issues',
      status: 'resolved',
      priority: 'medium',
      createdDate: '2024-03-12',
      resolvedDate: '2024-03-12',
      category: 'Infrastructure',
      impact: 'medium',
      affectedUsers: 250,
    },
    {
      id: 'INC-012',
      title: 'Mail server not responding',
      status: 'resolved',
      priority: 'high',
      createdDate: '2024-03-15',
      resolvedDate: '2024-03-15',
      category: 'Infrastructure',
      impact: 'high',
      affectedUsers: 600,
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'identified':
        return 'info';
      case 'investigating':
        return 'warning';
      case 'root_cause_found':
        return 'primary';
      case 'workaround_implemented':
        return 'success';
      case 'resolved':
        return 'success';
      case 'closed':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'identified':
        return <InfoIcon />;
      case 'investigating':
        return <SearchIcon />;
      case 'root_cause_found':
        return <AnalysisIcon />;
      case 'workaround_implemented':
        return <WorkaroundIcon />;
      case 'resolved':
        return <ResolvedIcon />;
      case 'closed':
        return <ResolvedIcon />;
      default:
        return <PendingIcon />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const filteredProblems = problems.filter((problem) => {
    const matchesSearch =
      problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      problem.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || problem.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || problem.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleViewProblem = (problem: Problem) => {
    setSelectedProblem(problem);
    setDialogType('view');
    setOpenDialog(true);
  };

  const handleEditProblem = (problem: Problem) => {
    setSelectedProblem(problem);
    setDialogType('edit');
    setOpenDialog(true);
  };

  const handleCreateRCA = (problem: Problem) => {
    setSelectedProblem(problem);
    setDialogType('rca');
    setOpenDialog(true);
  };

  const renderProblemsTab = () => (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search problems..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          sx={{ minWidth: 300 }}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />,
          }}
        />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Status"
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="identified">Identified</MenuItem>
            <MenuItem value="investigating">Investigating</MenuItem>
            <MenuItem value="root_cause_found">Root Cause Found</MenuItem>
            <MenuItem value="workaround_implemented">Workaround Implemented</MenuItem>
            <MenuItem value="resolved">Resolved</MenuItem>
            <MenuItem value="closed">Closed</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Priority</InputLabel>
          <Select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            label="Priority"
          >
            <MenuItem value="all">All Priority</MenuItem>
            <MenuItem value="critical">Critical</MenuItem>
            <MenuItem value="high">High</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="low">Low</MenuItem>
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
          Create Problem
        </Button>
      </Box>

      <Grid container spacing={3}>
        {filteredProblems.map((problem) => (
          <Grid item xs={12} md={6} lg={4} key={problem.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ mr: 2, bgcolor: getPriorityColor(problem.priority) + '.main' }}>
                    <ProblemIcon />
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h2">
                      {problem.id}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {problem.category}
                    </Typography>
                  </Box>
                  <Chip
                    icon={getStatusIcon(problem.status)}
                    label={problem.status.replace('_', ' ')}
                    color={getStatusColor(problem.status) as any}
                    size="small"
                  />
                </Box>

                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  {problem.title}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {problem.description.substring(0, 100)}...
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Chip
                    label={`Priority: ${problem.priority}`}
                    color={getPriorityColor(problem.priority) as any}
                    size="small"
                  />
                  <Chip
                    label={`Impact: ${problem.impact}`}
                    color={getPriorityColor(problem.impact) as any}
                    size="small"
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Assigned:</strong> {problem.assignedTo}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Related Incidents:</strong> {problem.relatedIncidents.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Last Update:</strong> {problem.lastUpdate}
                  </Typography>
                </Box>

                <LinearProgress
                  variant="determinate"
                  value={
                    problem.status === 'closed'
                      ? 100
                      : problem.status === 'resolved'
                        ? 90
                        : problem.status === 'workaround_implemented'
                          ? 70
                          : problem.status === 'root_cause_found'
                            ? 50
                            : problem.status === 'investigating'
                              ? 30
                              : 10
                  }
                  sx={{ mb: 2 }}
                />
              </CardContent>

              <CardActions>
                <Button size="small" onClick={() => handleViewProblem(problem)}>
                  View Details
                </Button>
                <IconButton size="small" onClick={() => handleEditProblem(problem)}>
                  <EditIcon />
                </IconButton>
                <IconButton size="small" onClick={() => handleCreateRCA(problem)}>
                  <AnalysisIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderKnownErrorsTab = () => (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
        <Typography variant="h6">Known Error Database</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setDialogType('known_error');
            setOpenDialog(true);
          }}
        >
          Add Known Error
        </Button>
      </Box>

      <Grid container spacing={3}>
        {knownErrors.map((knownError) => (
          <Grid item xs={12} md={6} key={knownError.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ mr: 2, bgcolor: 'error.main' }}>
                    <BugIcon />
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">{knownError.id}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {knownError.category}
                    </Typography>
                  </Box>
                  <Chip
                    label={knownError.status}
                    color={knownError.status === 'active' ? 'error' : 'success'}
                    size="small"
                  />
                </Box>

                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  {knownError.title}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {knownError.description}
                </Typography>

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="body2">
                      <strong>Symptoms</strong>
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List dense>
                      {knownError.symptoms.map((symptom, index) => (
                        <ListItem key={index}>
                          <ListItemText primary={symptom} />
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="body2">
                      <strong>Workaround</strong>
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2">{knownError.workaround}</Typography>
                  </AccordionDetails>
                </Accordion>

                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Chip label={`Used ${knownError.usageCount} times`} size="small" />
                  <Chip label={`Rating: ${knownError.effectivenessRating}/5`} size="small" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderAnalyticsTab = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Problem Management Analytics
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="primary">
                {problems.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Problems
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="warning.main">
                {problems.filter((p) => p.status === 'investigating').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Under Investigation
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="success.main">
                {problems.filter((p) => p.status === 'resolved').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Resolved
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="error.main">
                {problems.filter((p) => p.priority === 'critical').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Critical Priority
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Problem Resolution Time
              </Typography>
              <Box
                sx={{
                  height: 300,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Chart placeholder - Average resolution time: 15 days
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Problems by Category
              </Typography>
              <Box
                sx={{
                  height: 300,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Chart placeholder - Category breakdown
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Related Incidents Impact
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Problem ID</TableCell>
                      <TableCell>Related Incidents</TableCell>
                      <TableCell>Total Cost</TableCell>
                      <TableCell>Affected Users</TableCell>
                      <TableCell>Time Spent</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {problems.map((problem) => (
                      <TableRow key={problem.id}>
                        <TableCell>{problem.id}</TableCell>
                        <TableCell>{problem.relatedIncidents.length}</TableCell>
                        <TableCell>${problem.cost.toLocaleString()}</TableCell>
                        <TableCell>{problem.customerImpact}</TableCell>
                        <TableCell>{problem.timeSpent} hours</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderRCATab = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Root Cause Analysis
      </Typography>

      <Grid container spacing={3}>
        {rootCauseAnalyses.map((rca) => (
          <Grid item xs={12} key={rca.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                    <AnalysisIcon />
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">RCA for {rca.problemId}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Method: {rca.method.replace('_', ' ')} | Analyst: {rca.analyst}
                    </Typography>
                  </Box>
                  <Chip
                    label={rca.approved ? 'Approved' : 'Pending Review'}
                    color={rca.approved ? 'success' : 'warning'}
                    size="small"
                  />
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Root Cause
                    </Typography>
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {rca.rootCause}
                    </Alert>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Contributing Factors
                    </Typography>
                    <List dense>
                      {rca.contributingFactors.map((factor, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <WarningIcon color="warning" />
                          </ListItemIcon>
                          <ListItemText primary={factor} />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                </Grid>

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="body2">
                      <strong>Analysis Details</strong>
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Findings
                      </Typography>
                      <List dense>
                        {rca.findings.map((finding, index) => (
                          <ListItem key={index}>
                            <ListItemText primary={`${index + 1}. ${finding}`} />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  </AccordionDetails>
                </Accordion>

                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Chip label={`Analyzed: ${rca.analysisDate}`} size="small" />
                  {rca.reviewedBy && <Chip label={`Reviewed by: ${rca.reviewedBy}`} size="small" />}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        <ProblemIcon sx={{ mr: 2 }} />
        Problem Management
      </Typography>

      <Paper sx={{ width: '100%' }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Problems" icon={<ProblemIcon />} />
          <Tab label="Known Errors" icon={<BugIcon />} />
          <Tab label="Root Cause Analysis" icon={<AnalysisIcon />} />
          <Tab label="Analytics" icon={<TrendingIcon />} />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {activeTab === 0 && renderProblemsTab()}
          {activeTab === 1 && renderKnownErrorsTab()}
          {activeTab === 2 && renderRCATab()}
          {activeTab === 3 && renderAnalyticsTab()}
        </Box>
      </Paper>

      {/* Problem Details Dialog */}
      <Dialog
        open={openDialog && dialogType === 'view'}
        onClose={() => setOpenDialog(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Problem Details: {selectedProblem?.id}</DialogTitle>
        <DialogContent>
          {selectedProblem && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    {selectedProblem.title}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3 }}>
                    {selectedProblem.description}
                  </Typography>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      Business Impact
                    </Typography>
                    <Alert severity="warning">{selectedProblem.businessImpact}</Alert>
                  </Box>

                  {selectedProblem.rootCause && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        Root Cause
                      </Typography>
                      <Alert severity="error">{selectedProblem.rootCause}</Alert>
                    </Box>
                  )}

                  {selectedProblem.workaround && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        Workaround
                      </Typography>
                      <Alert severity="info">{selectedProblem.workaround}</Alert>
                    </Box>
                  )}

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      Related Incidents
                    </Typography>
                    <List dense>
                      {selectedProblem.relatedIncidents.map((incidentId) => {
                        const incident = relatedIncidents.find((i) => i.id === incidentId);
                        return (
                          <ListItem key={incidentId}>
                            <ListItemIcon>
                              <IncidentIcon />
                            </ListItemIcon>
                            <ListItemText
                              primary={incident?.title || incidentId}
                              secondary={`${incident?.status} - ${incident?.createdDate}`}
                            />
                          </ListItem>
                        );
                      })}
                    </List>
                  </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Problem Information
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemText
                            primary="Status"
                            secondary={
                              <Chip
                                label={selectedProblem.status.replace('_', ' ')}
                                color={getStatusColor(selectedProblem.status) as any}
                                size="small"
                              />
                            }
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Priority"
                            secondary={
                              <Chip
                                label={selectedProblem.priority}
                                color={getPriorityColor(selectedProblem.priority) as any}
                                size="small"
                              />
                            }
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Assigned To"
                            secondary={selectedProblem.assignedTo}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="Team" secondary={selectedProblem.assignedTeam} />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="Created" secondary={selectedProblem.createdDate} />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Cost Impact"
                            secondary={`$${selectedProblem.cost.toLocaleString()}`}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Affected Users"
                            secondary={selectedProblem.customerImpact}
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
          <Button variant="contained" onClick={() => handleEditProblem(selectedProblem!)}>
            Edit Problem
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create/Edit Problem Dialog */}
      <Dialog
        open={openDialog && (dialogType === 'create' || dialogType === 'edit')}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{dialogType === 'create' ? 'Create New Problem' : 'Edit Problem'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Problem Title"
              defaultValue={selectedProblem?.title || ''}
              fullWidth
              required
            />
            <TextField
              label="Description"
              defaultValue={selectedProblem?.description || ''}
              multiline
              rows={4}
              fullWidth
              required
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select defaultValue={selectedProblem?.category || ''} label="Category">
                    <MenuItem value="Infrastructure">Infrastructure</MenuItem>
                    <MenuItem value="Database">Database</MenuItem>
                    <MenuItem value="Network">Network</MenuItem>
                    <MenuItem value="Application">Application</MenuItem>
                    <MenuItem value="Security">Security</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select defaultValue={selectedProblem?.priority || ''} label="Priority">
                    <MenuItem value="critical">Critical</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="low">Low</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <TextField
              label="Business Impact"
              defaultValue={selectedProblem?.businessImpact || ''}
              multiline
              rows={2}
              fullWidth
              required
            />
            <TextField
              label="Assigned To"
              defaultValue={selectedProblem?.assignedTo || ''}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained">{dialogType === 'create' ? 'Create' : 'Update'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProblemManagementPage;
