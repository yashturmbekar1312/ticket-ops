import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Avatar,
  Tab,
  Tabs,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  Rating,
  LinearProgress,
  Fab,
  Tooltip,
  Badge,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Share as ShareIcon,
  Print as PrintIcon,
  LiveHelp as LiveHelpIcon,
  Support as SupportIcon,
  Phone as PhoneIcon,
  Chat as ChatIcon,
  Assignment as TicketIcon,
  ShoppingCart as ServiceIcon,
  MenuBook as KnowledgeIcon,
  Announcement as AnnouncementIcon,
  AccessTime as TimeIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  PlayArrow as PlayArrowIcon,
  Bookmark as BookmarkIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  CloudUpload as UploadIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { useAuth } from '../hooks/auth';

interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  lastUpdated: string;
  views: number;
  likes: number;
  dislikes: number;
  rating: number;
  isHelpful: boolean;
  attachments: string[];
  relatedArticles: string[];
  videoUrl?: string;
  estimatedReadTime: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  isPublic: boolean;
  lastReviewed: string;
}

interface SupportTicket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  createdDate: string;
  lastUpdate: string;
  assignedAgent?: string;
  resolution?: string;
  satisfactionRating?: number;
  estimatedResolution?: string;
}

interface ServiceRequest {
  id: string;
  serviceName: string;
  description: string;
  status: 'pending' | 'approved' | 'in_progress' | 'completed' | 'rejected';
  requestedDate: string;
  completionDate?: string;
  cost: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'maintenance' | 'outage' | 'update';
  publishedDate: string;
  expiryDate?: string;
  isActive: boolean;
  priority: 'low' | 'medium' | 'high';
  targetAudience: string[];
}

const CustomerPortalPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'ticket' | 'service' | 'article' | 'chat'>('ticket');
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  // Mock data
  const [knowledgeArticles] = useState<KnowledgeArticle[]>([
    {
      id: '1',
      title: 'How to Reset Your Password',
      content: `Follow these steps to reset your password:
      
1. Go to the login page
2. Click "Forgot Password"
3. Enter your email address
4. Check your email for reset instructions
5. Create a new password

If you continue to experience issues, please contact IT support.`,
      category: 'Account Management',
      tags: ['password', 'login', 'account', 'security'],
      author: 'IT Support Team',
      lastUpdated: '2024-03-15',
      views: 1247,
      likes: 89,
      dislikes: 5,
      rating: 4.8,
      isHelpful: true,
      attachments: ['password_reset_guide.pdf'],
      relatedArticles: ['2', '3'],
      estimatedReadTime: 3,
      difficulty: 'beginner',
      isPublic: true,
      lastReviewed: '2024-03-01',
    },
    {
      id: '2',
      title: 'Setting Up VPN on Windows',
      content: `Complete guide to setting up VPN connection on Windows:
      
1. Open Settings > Network & Internet
2. Click on VPN
3. Click "Add a VPN connection"
4. Enter the following details:
   - VPN provider: Windows (built-in)
   - Connection name: Company VPN
   - Server name: vpn.company.com
   - VPN type: IKEv2
   - Username and password: Your domain credentials
5. Click Save
6. Click Connect

For troubleshooting, check the network diagnostics tool.`,
      category: 'Network & Connectivity',
      tags: ['vpn', 'windows', 'network', 'remote'],
      author: 'Network Team',
      lastUpdated: '2024-03-10',
      views: 892,
      likes: 67,
      dislikes: 8,
      rating: 4.5,
      isHelpful: true,
      attachments: ['vpn_setup_video.mp4', 'vpn_troubleshooting.pdf'],
      relatedArticles: ['4', '5'],
      videoUrl: 'https://example.com/vpn-setup-video',
      estimatedReadTime: 5,
      difficulty: 'intermediate',
      isPublic: true,
      lastReviewed: '2024-03-05',
    },
    {
      id: '3',
      title: 'Office 365 Email Setup',
      content: `Configure Office 365 email on various devices:
      
**Desktop Outlook:**
1. Open Outlook
2. Go to File > Add Account
3. Enter your email address
4. Enter your password
5. Click Next and follow the prompts

**Mobile Devices:**
1. Download Outlook app
2. Open the app
3. Enter your email and password
4. Allow the app to access your account

**Webmail:**
Access your email at outlook.office365.com using your credentials.`,
      category: 'Email & Communication',
      tags: ['email', 'office365', 'outlook', 'setup'],
      author: 'IT Support Team',
      lastUpdated: '2024-03-12',
      views: 654,
      likes: 45,
      dislikes: 3,
      rating: 4.7,
      isHelpful: true,
      attachments: ['email_setup_guide.pdf'],
      relatedArticles: ['6', '7'],
      estimatedReadTime: 4,
      difficulty: 'beginner',
      isPublic: true,
      lastReviewed: '2024-03-08',
    },
  ]);

  const [supportTickets] = useState<SupportTicket[]>([
    {
      id: 'TK-001',
      title: 'Unable to access shared drive',
      description: 'Cannot connect to the shared network drive. Getting "access denied" error.',
      status: 'in_progress',
      priority: 'medium',
      category: 'Network & Connectivity',
      createdDate: '2024-03-18',
      lastUpdate: '2024-03-18',
      assignedAgent: 'John Smith',
      estimatedResolution: '2024-03-20',
    },
    {
      id: 'TK-002',
      title: 'Software installation request',
      description: 'Need Adobe Creative Suite installed on my workstation.',
      status: 'open',
      priority: 'low',
      category: 'Software',
      createdDate: '2024-03-17',
      lastUpdate: '2024-03-17',
    },
    {
      id: 'TK-003',
      title: 'Email not syncing',
      description: 'Outlook not receiving new emails since yesterday.',
      status: 'resolved',
      priority: 'high',
      category: 'Email & Communication',
      createdDate: '2024-03-15',
      lastUpdate: '2024-03-16',
      assignedAgent: 'Sarah Johnson',
      resolution: 'Recreated Outlook profile. Email sync restored.',
      satisfactionRating: 5,
    },
  ]);

  const [serviceRequests] = useState<ServiceRequest[]>([
    {
      id: 'SR-001',
      serviceName: 'New Employee Onboarding',
      description: 'Setup for new team member starting Monday',
      status: 'in_progress',
      requestedDate: '2024-03-15',
      cost: 2500.0,
      priority: 'medium',
    },
    {
      id: 'SR-002',
      serviceName: 'Conference Room Booking',
      description: 'Board room for quarterly meeting',
      status: 'completed',
      requestedDate: '2024-03-10',
      completionDate: '2024-03-10',
      cost: 0.0,
      priority: 'low',
    },
  ]);

  const [announcements] = useState<Announcement[]>([
    {
      id: '1',
      title: 'Scheduled Maintenance - Email Services',
      content:
        'Email services will be unavailable from 2:00 AM to 4:00 AM EST on March 22nd for routine maintenance.',
      type: 'maintenance',
      publishedDate: '2024-03-18',
      expiryDate: '2024-03-22',
      isActive: true,
      priority: 'high',
      targetAudience: ['All Users'],
    },
    {
      id: '2',
      title: 'New IT Support Hours',
      content: 'Starting March 25th, IT Support will be available 24/7 for critical issues.',
      type: 'info',
      publishedDate: '2024-03-17',
      isActive: true,
      priority: 'medium',
      targetAudience: ['All Users'],
    },
    {
      id: '3',
      title: 'Security Update Required',
      content: 'Please install the latest security updates on your workstation by end of week.',
      type: 'warning',
      publishedDate: '2024-03-16',
      expiryDate: '2024-03-23',
      isActive: true,
      priority: 'high',
      targetAudience: ['All Users'],
    },
  ]);

  const categories = [
    'all',
    'Account Management',
    'Network & Connectivity',
    'Email & Communication',
    'Software',
    'Hardware',
    'Security',
  ];

  const filteredArticles = knowledgeArticles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleArticleClick = (article: KnowledgeArticle) => {
    setSelectedArticle(article);
    setDialogType('article');
    setOpenDialog(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'info';
      case 'in_progress':
        return 'warning';
      case 'resolved':
        return 'success';
      case 'closed':
        return 'default';
      case 'pending':
        return 'warning';
      case 'approved':
        return 'info';
      case 'completed':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getAnnouncementIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <InfoIcon />;
      case 'warning':
        return <WarningIcon />;
      case 'maintenance':
        return <SettingsIcon />;
      case 'outage':
        return <WarningIcon />;
      case 'update':
        return <InfoIcon />;
      default:
        return <AnnouncementIcon />;
    }
  };

  const renderDashboardTab = () => (
    <Box>
      <Grid container spacing={3}>
        {/* Welcome Section */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Welcome back, {user?.name || 'User'}!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Your one-stop portal for IT support, service requests, and knowledge resources.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <TicketIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">{supportTickets.length}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Tickets
                  </Typography>
                </Box>
              </Box>
              <LinearProgress variant="determinate" value={75} color="primary" />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <ServiceIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">{serviceRequests.length}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Service Requests
                  </Typography>
                </Box>
              </Box>
              <LinearProgress variant="determinate" value={60} color="success" />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                  <KnowledgeIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">{knowledgeArticles.length}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Knowledge Articles
                  </Typography>
                </Box>
              </Box>
              <LinearProgress variant="determinate" value={85} color="info" />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <AnnouncementIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {announcements.filter((a) => a.isActive).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Announcements
                  </Typography>
                </Box>
              </Box>
              <LinearProgress variant="determinate" value={40} color="warning" />
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                <HistoryIcon sx={{ mr: 1 }} />
                Recent Activity
              </Typography>
              <List>
                {supportTickets.slice(0, 3).map((ticket) => (
                  <ListItem key={ticket.id} divider>
                    <ListItemIcon>
                      <Avatar
                        sx={{
                          bgcolor: getStatusColor(ticket.status) + '.main',
                          width: 32,
                          height: 32,
                        }}
                      >
                        <TicketIcon fontSize="small" />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={ticket.title}
                      secondary={`${ticket.id} - ${ticket.status} - ${ticket.lastUpdate}`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Announcements */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                <AnnouncementIcon sx={{ mr: 1 }} />
                System Announcements
              </Typography>
              <List>
                {announcements
                  .filter((a) => a.isActive)
                  .slice(0, 3)
                  .map((announcement) => (
                    <ListItem key={announcement.id} divider>
                      <ListItemIcon>
                        <Avatar
                          sx={{
                            bgcolor: announcement.type === 'warning' ? 'warning.main' : 'info.main',
                            width: 32,
                            height: 32,
                          }}
                        >
                          {getAnnouncementIcon(announcement.type)}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={announcement.title}
                        secondary={announcement.publishedDate}
                      />
                    </ListItem>
                  ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<AddIcon />}
                    onClick={() => {
                      setDialogType('ticket');
                      setOpenDialog(true);
                    }}
                  >
                    Create Ticket
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<ServiceIcon />}
                    onClick={() => {
                      setDialogType('service');
                      setOpenDialog(true);
                    }}
                  >
                    Request Service
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<ChatIcon />}
                    onClick={() => setChatOpen(true)}
                  >
                    Live Chat
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<SearchIcon />}
                    onClick={() => setActiveTab(1)}
                  >
                    Search Knowledge
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderKnowledgeTab = () => (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          placeholder="Search knowledge base..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          sx={{ minWidth: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            label="Category"
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {filteredArticles.map((article) => (
          <Grid item xs={12} md={6} lg={4} key={article.id}>
            <Card
              sx={{ height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
              onClick={() => handleArticleClick(article)}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" component="h2" sx={{ flexGrow: 1 }}>
                    {article.title}
                  </Typography>
                  <Chip
                    label={article.difficulty}
                    size="small"
                    color={
                      article.difficulty === 'beginner'
                        ? 'success'
                        : article.difficulty === 'intermediate'
                          ? 'warning'
                          : 'error'
                    }
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {article.content.substring(0, 150)}...
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <TimeIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {article.estimatedReadTime} min read
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • {article.views} views
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Rating value={article.rating} readOnly size="small" />
                  <Typography variant="body2" color="text.secondary">
                    ({article.rating})
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {article.tags.slice(0, 3).map((tag) => (
                    <Chip key={tag} label={tag} size="small" variant="outlined" />
                  ))}
                </Box>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => handleArticleClick(article)}>
                  Read More
                </Button>
                <IconButton size="small">
                  <BookmarkIcon />
                </IconButton>
                <IconButton size="small">
                  <ShareIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderTicketsTab = () => (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
        <Typography variant="h6">My Support Tickets</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setDialogType('ticket');
            setOpenDialog(true);
          }}
        >
          Create New Ticket
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ticket ID</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Last Update</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {supportTickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>{ticket.id}</TableCell>
                <TableCell>{ticket.title}</TableCell>
                <TableCell>{ticket.category}</TableCell>
                <TableCell>
                  <Chip
                    label={ticket.status.replace('_', ' ')}
                    color={getStatusColor(ticket.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={ticket.priority}
                    color={
                      ticket.priority === 'critical'
                        ? 'error'
                        : ticket.priority === 'high'
                          ? 'warning'
                          : 'default'
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>{ticket.createdDate}</TableCell>
                <TableCell>{ticket.lastUpdate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderServicesTab = () => (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6">My Service Requests</Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Request ID</TableCell>
              <TableCell>Service</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Requested Date</TableCell>
              <TableCell>Cost</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {serviceRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.id}</TableCell>
                <TableCell>{request.serviceName}</TableCell>
                <TableCell>
                  <Chip
                    label={request.status.replace('_', ' ')}
                    color={getStatusColor(request.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={request.priority}
                    color={
                      request.priority === 'critical'
                        ? 'error'
                        : request.priority === 'high'
                          ? 'warning'
                          : 'default'
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>{request.requestedDate}</TableCell>
                <TableCell>${request.cost.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          <SupportIcon sx={{ mr: 2 }} />
          IT Support Portal
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Contact Support">
            <IconButton color="primary">
              <Badge badgeContent={2} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          <Tooltip title="Live Chat">
            <IconButton color="primary" onClick={() => setChatOpen(true)}>
              <ChatIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Call Support">
            <IconButton color="primary">
              <PhoneIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Paper sx={{ width: '100%' }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Dashboard" icon={<SupportIcon />} />
          <Tab label="Knowledge Base" icon={<KnowledgeIcon />} />
          <Tab label="My Tickets" icon={<TicketIcon />} />
          <Tab label="Service Requests" icon={<ServiceIcon />} />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {activeTab === 0 && renderDashboardTab()}
          {activeTab === 1 && renderKnowledgeTab()}
          {activeTab === 2 && renderTicketsTab()}
          {activeTab === 3 && renderServicesTab()}
        </Box>
      </Paper>

      {/* Floating Action Button for Quick Actions */}
      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setChatOpen(true)}
      >
        <LiveHelpIcon />
      </Fab>

      {/* Knowledge Article Dialog */}
      <Dialog
        open={openDialog && dialogType === 'article'}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedArticle?.title}
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <Chip label={selectedArticle?.category} size="small" />
            <Chip label={selectedArticle?.difficulty} size="small" />
            <Chip label={`${selectedArticle?.estimatedReadTime} min read`} size="small" />
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedArticle && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line', mb: 3 }}>
                {selectedArticle.content}
              </Typography>

              {selectedArticle.videoUrl && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Video Tutorial
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<PlayArrowIcon />}
                    onClick={() => window.open(selectedArticle.videoUrl, '_blank')}
                  >
                    Watch Video
                  </Button>
                </Box>
              )}

              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Button variant="outlined" startIcon={<ThumbUpIcon />} size="small">
                  Helpful ({selectedArticle.likes})
                </Button>
                <Button variant="outlined" startIcon={<ThumbDownIcon />} size="small">
                  Not Helpful ({selectedArticle.dislikes})
                </Button>
                <Button variant="outlined" startIcon={<ShareIcon />} size="small">
                  Share
                </Button>
                <Button variant="outlined" startIcon={<PrintIcon />} size="small">
                  Print
                </Button>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Last updated: {selectedArticle.lastUpdated} by {selectedArticle.author}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Views: {selectedArticle.views} • Rating: {selectedArticle.rating}/5
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Create Ticket Dialog */}
      <Dialog
        open={openDialog && dialogType === 'ticket'}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create Support Ticket</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField label="Subject" fullWidth required />
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select label="Category">
                <MenuItem value="hardware">Hardware</MenuItem>
                <MenuItem value="software">Software</MenuItem>
                <MenuItem value="network">Network & Connectivity</MenuItem>
                <MenuItem value="email">Email & Communication</MenuItem>
                <MenuItem value="account">Account Management</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select label="Priority">
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="critical">Critical</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Description"
              multiline
              rows={4}
              fullWidth
              required
              placeholder="Please describe your issue in detail..."
            />
            <Button variant="outlined" startIcon={<UploadIcon />} component="label">
              Attach Files
              <input type="file" multiple hidden />
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained">Create Ticket</Button>
        </DialogActions>
      </Dialog>

      {/* Live Chat Dialog */}
      <Dialog open={chatOpen} onClose={() => setChatOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ChatIcon sx={{ mr: 1 }} />
            Live Chat Support
            <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{ width: 8, height: 8, bgcolor: 'success.main', borderRadius: '50%', mr: 1 }}
              />
              <Typography variant="body2" color="success.main">
                Online
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ height: 400, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ flexGrow: 1, p: 2, bgcolor: 'grey.50', borderRadius: 1, mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Chat will be available here. Our support team typically responds within 2-3 minutes.
              </Typography>
            </Box>
            <TextField
              placeholder="Type your message..."
              fullWidth
              size="small"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small">
                      <SendIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default CustomerPortalPage;
