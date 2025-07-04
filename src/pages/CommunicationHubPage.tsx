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
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemIcon,
  TextField,
  InputAdornment,
  IconButton,
  Badge,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  Alert,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Fab,
  Menu,
  MenuList,
  MenuItem as MenuItemComponent,
  ListItemButton,
} from '@mui/material';
import {
  Chat as ChatIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  VideoCall as VideoIcon,
  Forum as ForumIcon,
  Send as SendIcon,
  EmojiEmotions as EmojiIcon,
  MoreVert as MoreIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Star as StarIcon,
  PushPin as PinIcon,
  Archive as ArchiveIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  VolumeOff as MuteIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Videocam as VideocamIcon,
  VideocamOff as VideocamOffIcon,
  ScreenShare as ScreenShareIcon,
  CallEnd as CallEndIcon,
  PersonAdd as PersonAddIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  TrendingUp as TrendingIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  WhatsApp as WhatsAppIcon,
  Telegram as TelegramIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Instagram as InstagramIcon,
  AttachFile as AttachIcon,
} from '@mui/icons-material';

interface ChatMessage {
  id: string;
  sender: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'file' | 'system';
  isAgent: boolean;
  ticketId?: string;
  attachments?: string[];
  reactions?: { emoji: string; count: number; users: string[] }[];
  isRead: boolean;
  isEdited?: boolean;
  replyTo?: string;
}

interface ChatRoom {
  id: string;
  name: string;
  type: 'direct' | 'group' | 'support' | 'announcement';
  participants: string[];
  lastMessage: ChatMessage;
  unreadCount: number;
  isActive: boolean;
  isPinned: boolean;
  isMuted: boolean;
  createdDate: string;
  description?: string;
  avatar?: string;
  tags?: string[];
}

interface EmailThread {
  id: string;
  subject: string;
  sender: string;
  senderEmail: string;
  recipients: string[];
  cc?: string[];
  bcc?: string[];
  status: 'unread' | 'read' | 'replied' | 'forwarded' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  lastUpdate: string;
  messageCount: number;
  hasAttachments: boolean;
  labels: string[];
  ticketId?: string;
  isSpam: boolean;
  isImportant: boolean;
}

interface CallRecord {
  id: string;
  type: 'incoming' | 'outgoing' | 'missed';
  caller: string;
  callerNumber: string;
  receiver: string;
  receiverNumber: string;
  duration: number;
  startTime: string;
  endTime: string;
  status: 'completed' | 'missed' | 'busy' | 'failed';
  recording?: string;
  notes?: string;
  ticketId?: string;
  rating?: number;
  tags?: string[];
}

interface SocialMediaPost {
  id: string;
  platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'whatsapp' | 'telegram';
  author: string;
  authorHandle: string;
  content: string;
  timestamp: string;
  type: 'mention' | 'direct_message' | 'comment' | 'review';
  sentiment: 'positive' | 'negative' | 'neutral';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'new' | 'acknowledged' | 'responded' | 'escalated' | 'resolved';
  assignedTo?: string;
  ticketId?: string;
  engagementMetrics: {
    likes: number;
    shares: number;
    comments: number;
    reach: number;
  };
}

interface CommunicationMetrics {
  totalMessages: number;
  averageResponseTime: number;
  customerSatisfaction: number;
  activeChats: number;
  resolvedConversations: number;
  emailsProcessed: number;
  callsHandled: number;
  socialMediaInteractions: number;
  channelDistribution: { [key: string]: number };
  agentPerformance: { [key: string]: number };
}

const CommunicationHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedChat, setSelectedChat] = useState<ChatRoom | null>(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);

  // Mock data
  const [chatRooms] = useState<ChatRoom[]>([
    {
      id: '1',
      name: 'IT Support Team',
      type: 'group',
      participants: ['john.doe', 'jane.smith', 'mike.johnson'],
      lastMessage: {
        id: '1',
        sender: 'Jane Smith',
        senderAvatar: '/avatars/jane.jpg',
        content: 'Server maintenance completed successfully',
        timestamp: '2024-03-18T14:30:00Z',
        type: 'text',
        isAgent: true,
        isRead: true,
        reactions: [{ emoji: '👍', count: 3, users: ['john.doe', 'mike.johnson', 'sarah.wilson'] }],
      },
      unreadCount: 0,
      isActive: true,
      isPinned: true,
      isMuted: false,
      createdDate: '2024-03-01',
      description: 'Main IT support coordination channel',
      tags: ['support', 'urgent'],
    },
    {
      id: '2',
      name: 'Customer Support',
      type: 'support',
      participants: ['customer.service'],
      lastMessage: {
        id: '2',
        sender: 'John Customer',
        senderAvatar: '/avatars/customer.jpg',
        content: 'I need help with my account access',
        timestamp: '2024-03-18T15:45:00Z',
        type: 'text',
        isAgent: false,
        isRead: false,
        ticketId: 'TK-001',
      },
      unreadCount: 3,
      isActive: true,
      isPinned: false,
      isMuted: false,
      createdDate: '2024-03-18',
      description: 'Customer support chat',
    },
    {
      id: '3',
      name: 'System Announcements',
      type: 'announcement',
      participants: ['system'],
      lastMessage: {
        id: '3',
        sender: 'System',
        senderAvatar: '/avatars/system.jpg',
        content: 'Scheduled maintenance window: March 20, 2:00 AM - 4:00 AM',
        timestamp: '2024-03-17T10:00:00Z',
        type: 'system',
        isAgent: true,
        isRead: true,
      },
      unreadCount: 0,
      isActive: true,
      isPinned: true,
      isMuted: false,
      createdDate: '2024-03-01',
      description: 'System-wide announcements and notifications',
    },
  ]);

  const [emailThreads] = useState<EmailThread[]>([
    {
      id: 'E001',
      subject: 'Password Reset Request',
      sender: 'John Customer',
      senderEmail: 'john.customer@email.com',
      recipients: ['support@company.com'],
      status: 'unread',
      priority: 'medium',
      lastUpdate: '2024-03-18T16:00:00Z',
      messageCount: 1,
      hasAttachments: false,
      labels: ['support', 'password'],
      isSpam: false,
      isImportant: false,
    },
    {
      id: 'E002',
      subject: 'Software License Inquiry',
      sender: 'Jane Manager',
      senderEmail: 'jane.manager@email.com',
      recipients: ['licensing@company.com'],
      status: 'replied',
      priority: 'high',
      lastUpdate: '2024-03-17T14:30:00Z',
      messageCount: 3,
      hasAttachments: true,
      labels: ['licensing', 'important'],
      ticketId: 'TK-002',
      isSpam: false,
      isImportant: true,
    },
  ]);

  const [callRecords] = useState<CallRecord[]>([
    {
      id: 'C001',
      type: 'incoming',
      caller: 'John Customer',
      callerNumber: '+1-555-0123',
      receiver: 'Support Agent',
      receiverNumber: '+1-555-0100',
      duration: 480,
      startTime: '2024-03-18T09:00:00Z',
      endTime: '2024-03-18T09:08:00Z',
      status: 'completed',
      notes: 'Resolved printer connectivity issue',
      ticketId: 'TK-003',
      rating: 5,
      tags: ['support', 'printer'],
    },
    {
      id: 'C002',
      type: 'outgoing',
      caller: 'IT Support',
      callerNumber: '+1-555-0100',
      receiver: 'Sarah Employee',
      receiverNumber: '+1-555-0456',
      duration: 0,
      startTime: '2024-03-18T11:30:00Z',
      endTime: '2024-03-18T11:30:00Z',
      status: 'missed',
      notes: 'Follow-up on software installation',
      tags: ['follow-up', 'software'],
    },
  ]);

  const [socialMediaPosts] = useState<SocialMediaPost[]>([
    {
      id: 'SM001',
      platform: 'twitter',
      author: 'Frustrated User',
      authorHandle: '@frustrated_user',
      content:
        '@CompanySupport Your app keeps crashing! This is unacceptable! #appcrash #frustrated',
      timestamp: '2024-03-18T16:30:00Z',
      type: 'mention',
      sentiment: 'negative',
      priority: 'high',
      status: 'new',
      assignedTo: 'Social Media Team',
      engagementMetrics: {
        likes: 5,
        shares: 12,
        comments: 8,
        reach: 1250,
      },
    },
    {
      id: 'SM002',
      platform: 'facebook',
      author: 'Happy Customer',
      authorHandle: 'happy.customer',
      content: 'Great service from the support team! Issue resolved quickly. Thank you!',
      timestamp: '2024-03-18T14:15:00Z',
      type: 'comment',
      sentiment: 'positive',
      priority: 'low',
      status: 'acknowledged',
      engagementMetrics: {
        likes: 23,
        shares: 3,
        comments: 5,
        reach: 450,
      },
    },
  ]);

  const [metrics] = useState<CommunicationMetrics>({
    totalMessages: 1247,
    averageResponseTime: 3.5,
    customerSatisfaction: 4.2,
    activeChats: 12,
    resolvedConversations: 89,
    emailsProcessed: 156,
    callsHandled: 34,
    socialMediaInteractions: 78,
    channelDistribution: {
      'Live Chat': 45,
      Email: 30,
      Phone: 15,
      'Social Media': 10,
    },
    agentPerformance: {
      'Agent 1': 4.8,
      'Agent 2': 4.5,
      'Agent 3': 4.2,
      'Agent 4': 3.9,
    },
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      // Send message logic here
      setMessage('');
    }
  };

  const handleChatSelect = (chat: ChatRoom) => {
    setSelectedChat(chat);
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return <FacebookIcon />;
      case 'twitter':
        return <TwitterIcon />;
      case 'instagram':
        return <InstagramIcon />;
      case 'linkedin':
        return <LinkedInIcon />;
      case 'whatsapp':
        return <WhatsAppIcon />;
      case 'telegram':
        return <TelegramIcon />;
      default:
        return <ForumIcon />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'success';
      case 'negative':
        return 'error';
      case 'neutral':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'info';
      case 'acknowledged':
        return 'warning';
      case 'responded':
        return 'primary';
      case 'escalated':
        return 'error';
      case 'resolved':
        return 'success';
      default:
        return 'default';
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderChatTab = () => (
    <Grid container spacing={2} sx={{ height: '600px' }}>
      {/* Chat List */}
      <Grid item xs={12} md={4}>
        <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <TextField
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <List sx={{ flexGrow: 1, overflow: 'auto' }}>
            {chatRooms.map((chat) => (
              <ListItemButton
                key={chat.id}
                selected={selectedChat?.id === chat.id}
                onClick={() => handleChatSelect(chat)}
              >
                <ListItemAvatar>
                  <Badge badgeContent={chat.unreadCount} color="error">
                    <Avatar>{chat.type === 'group' ? <GroupIcon /> : <PersonIcon />}</Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {chat.name}
                      {chat.isPinned && <PinIcon sx={{ ml: 1, fontSize: 16 }} />}
                      {chat.isMuted && <MuteIcon sx={{ ml: 1, fontSize: 16 }} />}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {chat.lastMessage.content.substring(0, 50)}...
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatTime(chat.lastMessage.timestamp)}
                      </Typography>
                    </Box>
                  }
                />
              </ListItemButton>
            ))}
          </List>
        </Paper>
      </Grid>

      {/* Chat Window */}
      <Grid item xs={12} md={8}>
        <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <Box
                sx={{
                  p: 2,
                  borderBottom: 1,
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Avatar sx={{ mr: 2 }}>
                  {selectedChat.type === 'group' ? <GroupIcon /> : <PersonIcon />}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6">{selectedChat.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedChat.participants.length} participants
                  </Typography>
                </Box>
                <IconButton onClick={() => setIsCallActive(true)}>
                  <PhoneIcon />
                </IconButton>
                <IconButton onClick={() => setIsCallActive(true)}>
                  <VideoIcon />
                </IconButton>
                <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                  <MoreIcon />
                </IconButton>
              </Box>

              {/* Messages */}
              <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Avatar sx={{ mr: 2 }}>JS</Avatar>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Jane Smith • {formatTime(selectedChat.lastMessage.timestamp)}
                      </Typography>
                      <Paper sx={{ p: 1, bgcolor: 'grey.100', maxWidth: '70%' }}>
                        <Typography variant="body1">{selectedChat.lastMessage.content}</Typography>
                      </Paper>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* Message Input */}
              <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                <TextField
                  fullWidth
                  multiline
                  maxRows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconButton size="small">
                          <AttachIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small">
                          <EmojiIcon />
                        </IconButton>
                        <IconButton onClick={handleSendMessage} size="small">
                          <SendIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
              </Box>
            </>
          ) : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
              }}
            >
              <Typography variant="body1" color="text.secondary">
                Select a conversation to start messaging
              </Typography>
            </Box>
          )}
        </Paper>
      </Grid>
    </Grid>
  );

  const renderEmailTab = () => (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          placeholder="Search emails..."
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
        <Button variant="contained" startIcon={<AddIcon />}>
          Compose
        </Button>
        <Button variant="outlined" startIcon={<FilterIcon />}>
          Filter
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sender</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Last Update</TableCell>
              <TableCell>Messages</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {emailThreads.map((email) => (
              <TableRow key={email.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 2, width: 32, height: 32 }}>{email.sender.charAt(0)}</Avatar>
                    <Box>
                      <Typography variant="body2">{email.sender}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {email.senderEmail}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: email.status === 'unread' ? 'bold' : 'normal' }}
                    >
                      {email.subject}
                    </Typography>
                    {email.hasAttachments && <AttachIcon sx={{ ml: 1, fontSize: 16 }} />}
                    {email.isImportant && (
                      <StarIcon sx={{ ml: 1, fontSize: 16, color: 'warning.main' }} />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={email.status}
                    color={email.status === 'unread' ? 'info' : 'success'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={email.priority}
                    color={
                      email.priority === 'urgent'
                        ? 'error'
                        : email.priority === 'high'
                          ? 'warning'
                          : 'default'
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {new Date(email.lastUpdate).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Badge badgeContent={email.messageCount} color="primary">
                    <EmailIcon />
                  </Badge>
                </TableCell>
                <TableCell>
                  <IconButton size="small">
                    <ViewIcon />
                  </IconButton>
                  <IconButton size="small">
                    <SendIcon />
                  </IconButton>
                  <IconButton size="small">
                    <ArchiveIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderPhoneTab = () => (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
        <Typography variant="h6">Call Management</Typography>
        <Button variant="contained" startIcon={<PhoneIcon />}>
          Make Call
        </Button>
        <Button variant="outlined" startIcon={<ScheduleIcon />}>
          Schedule Call
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Call History
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>Contact</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Rating</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {callRecords.map((call) => (
                    <TableRow key={call.id}>
                      <TableCell>
                        <Chip
                          icon={call.type === 'incoming' ? <PhoneIcon /> : <CallEndIcon />}
                          label={call.type}
                          color={call.type === 'missed' ? 'error' : 'success'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">{call.caller}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {call.callerNumber}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {call.duration > 0 ? formatDuration(call.duration) : '-'}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={call.status}
                          color={call.status === 'completed' ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{new Date(call.startTime).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {call.rating && (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <StarIcon sx={{ color: 'warning.main', mr: 1 }} />
                            <Typography variant="body2">{call.rating}</Typography>
                          </Box>
                        )}
                      </TableCell>
                      <TableCell>
                        <IconButton size="small">
                          <PhoneIcon />
                        </IconButton>
                        <IconButton size="small">
                          <ViewIcon />
                        </IconButton>
                        {call.notes && (
                          <IconButton size="small">
                            <EditIcon />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Call Statistics
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Total Calls Today" secondary={callRecords.length} />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Average Call Duration"
                  secondary={formatDuration(
                    callRecords.reduce((sum, call) => sum + call.duration, 0) / callRecords.length
                  )}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Missed Calls"
                  secondary={callRecords.filter((call) => call.status === 'missed').length}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Average Rating"
                  secondary={
                    callRecords
                      .filter((call) => call.rating)
                      .reduce((sum, call) => sum + (call.rating || 0), 0) /
                      callRecords.filter((call) => call.rating).length || 0
                  }
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );

  const renderSocialTab = () => (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
        <Typography variant="h6">Social Media Management</Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          Create Post
        </Button>
        <Button variant="outlined" startIcon={<RefreshIcon />}>
          Refresh
        </Button>
      </Box>

      <Grid container spacing={3}>
        {socialMediaPosts.map((post) => (
          <Grid item xs={12} md={6} key={post.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ mr: 2 }}>{getPlatformIcon(post.platform)}</Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2">
                      {post.author} ({post.authorHandle})
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {post.platform} • {formatTime(post.timestamp)}
                    </Typography>
                  </Box>
                  <Chip
                    label={post.sentiment}
                    color={getSentimentColor(post.sentiment) as any}
                    size="small"
                  />
                </Box>

                <Typography variant="body2" sx={{ mb: 2 }}>
                  {post.content}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Chip
                    label={post.type}
                    color={post.type === 'mention' ? 'warning' : 'info'}
                    size="small"
                  />
                  <Chip
                    label={post.priority}
                    color={
                      post.priority === 'urgent'
                        ? 'error'
                        : post.priority === 'high'
                          ? 'warning'
                          : 'default'
                    }
                    size="small"
                  />
                  <Chip
                    label={post.status}
                    color={getStatusColor(post.status) as any}
                    size="small"
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    👍 {post.engagementMetrics.likes}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    🔄 {post.engagementMetrics.shares}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    💬 {post.engagementMetrics.comments}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    👀 {post.engagementMetrics.reach}
                  </Typography>
                </Box>

                {post.assignedTo && (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Assigned to: {post.assignedTo}
                  </Alert>
                )}
              </CardContent>
              <CardActions>
                <Button size="small" startIcon={<SendIcon />}>
                  Respond
                </Button>
                <Button size="small" startIcon={<PersonAddIcon />}>
                  Assign
                </Button>
                <Button size="small" startIcon={<WarningIcon />}>
                  Escalate
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderMetricsTab = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Communication Metrics
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="primary">
                {metrics.totalMessages}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Messages
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="success.main">
                {metrics.averageResponseTime}m
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg Response Time
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="warning.main">
                {metrics.customerSatisfaction}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Customer Satisfaction
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="info.main">
                {metrics.activeChats}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Chats
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Channel Distribution
              </Typography>
              {Object.entries(metrics.channelDistribution).map(([channel, percentage]) => (
                <Box key={channel} sx={{ mb: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">{channel}</Typography>
                    <Typography variant="body2">{percentage}%</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={percentage} />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Agent Performance
              </Typography>
              {Object.entries(metrics.agentPerformance).map(([agent, rating]) => (
                <Box key={agent} sx={{ mb: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">{agent}</Typography>
                    <Typography variant="body2">{rating}/5</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={rating * 20} />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        <ChatIcon sx={{ mr: 2 }} />
        Communication Hub
      </Typography>

      <Paper sx={{ width: '100%' }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Live Chat" icon={<ChatIcon />} />
          <Tab label="Email" icon={<EmailIcon />} />
          <Tab label="Phone" icon={<PhoneIcon />} />
          <Tab label="Social Media" icon={<ForumIcon />} />
          <Tab label="Analytics" icon={<TrendingIcon />} />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {activeTab === 0 && renderChatTab()}
          {activeTab === 1 && renderEmailTab()}
          {activeTab === 2 && renderPhoneTab()}
          {activeTab === 3 && renderSocialTab()}
          {activeTab === 4 && renderMetricsTab()}
        </Box>
      </Paper>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => {
          // TODO: Implement create new chat functionality
        }}
      >
        <AddIcon />
      </Fab>

      {/* Call Dialog */}
      <Dialog open={isCallActive} onClose={() => setIsCallActive(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PhoneIcon sx={{ mr: 1 }} />
            Active Call
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
            <Avatar sx={{ width: 100, height: 100, mb: 2 }}>
              <PersonIcon sx={{ fontSize: 60 }} />
            </Avatar>
            <Typography variant="h6" sx={{ mb: 1 }}>
              John Customer
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              +1-555-0123
            </Typography>
            <Typography variant="h4" sx={{ mb: 4 }}>
              05:32
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <IconButton
                color={isMuted ? 'error' : 'default'}
                onClick={() => setIsMuted(!isMuted)}
                sx={{ bgcolor: 'grey.100' }}
              >
                {isMuted ? <MicOffIcon /> : <MicIcon />}
              </IconButton>
              <IconButton
                color={isVideoEnabled ? 'primary' : 'default'}
                onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                sx={{ bgcolor: 'grey.100' }}
              >
                {isVideoEnabled ? <VideocamIcon /> : <VideocamOffIcon />}
              </IconButton>
              <IconButton sx={{ bgcolor: 'grey.100' }}>
                <ScreenShareIcon />
              </IconButton>
              <IconButton
                color="error"
                onClick={() => setIsCallActive(false)}
                sx={{ bgcolor: 'error.main', color: 'white' }}
              >
                <CallEndIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        <MenuList>
          <MenuItemComponent>
            <ListItemIcon>
              <InfoIcon />
            </ListItemIcon>
            <ListItemText>Chat Info</ListItemText>
          </MenuItemComponent>
          <MenuItemComponent>
            <ListItemIcon>
              <MuteIcon />
            </ListItemIcon>
            <ListItemText>Mute</ListItemText>
          </MenuItemComponent>
          <MenuItemComponent>
            <ListItemIcon>
              <ArchiveIcon />
            </ListItemIcon>
            <ListItemText>Archive</ListItemText>
          </MenuItemComponent>
        </MenuList>
      </Menu>
    </Box>
  );
};

export default CommunicationHubPage;
