import React, { useState } from 'react';
import { Box, Typography, Button, Grid } from '@mui/material';
import { Add } from '@mui/icons-material';
import {
  Ticket,
  TicketNotification,
  SystemAnnouncement,
  TicketCategory,
  TicketPriority,
} from '../../../types';
import { TicketDetailModal } from '../../ticket/TicketDetailModal';
import DashboardStats from './DashboardStats';
import MyTickets from './MyTickets';
import AnnouncementsList from './AnnouncementsList';
import NotificationsList from './NotificationsList';
import CreateTicketDialog from './CreateTicketDialog';
import './EmployeeDashboard.css';

interface EmployeeDashboardProps {
  userId: string;
  userName: string;
}

const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ userId, userName }) => {
  const [createTicketOpen, setCreateTicketOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [ticketDetailOpen, setTicketDetailOpen] = useState(false);
  const [newTicketData, setNewTicketData] = useState({
    title: '',
    category: '' as TicketCategory,
    description: '',
    priority: 'Medium' as TicketPriority,
    attachments: [] as File[],
  });

  // Mock data - in production, this would come from API
  const allTickets: Ticket[] = [
    {
      id: 'TK-001',
      ticketNumber: 'TK-001',
      title: 'Laptop not working properly',
      description: 'My laptop keeps freezing and shutting down randomly',
      category: 'Hardware',
      priority: 'High',
      status: 'Open',
      createdBy: userId,
      createdByName: userName,
      assignedTo: 'agent1',
      assignedToName: 'Alice Johnson',
      department: 'IT',
      createdAt: '2024-07-07T08:00:00Z',
      updatedAt: '2024-07-07T12:30:00Z',
      slaBreached: false,
      tags: ['hardware', 'laptop'],
      escalationLevel: 0,
      source: 'web',
    },
    {
      id: 'TK-002',
      ticketNumber: 'TK-002',
      title: 'Request for Adobe Creative Suite',
      description: 'Need Adobe Creative Suite for upcoming marketing project',
      category: 'Software',
      priority: 'Medium',
      status: 'Open',
      createdBy: userId,
      createdByName: userName,
      department: 'Marketing',
      createdAt: '2024-07-06T14:00:00Z',
      updatedAt: '2024-07-06T14:00:00Z',
      slaBreached: false,
      tags: ['software', 'adobe'],
      escalationLevel: 0,
      source: 'web',
    },
    {
      id: 'TK-003',
      ticketNumber: 'TK-003',
      title: 'Network connectivity issues',
      description: 'Unable to connect to company VPN from home',
      category: 'Network',
      priority: 'Medium',
      status: 'Resolved',
      createdBy: userId,
      createdByName: userName,
      assignedTo: 'agent2',
      assignedToName: 'Bob Smith',
      department: 'IT',
      createdAt: '2024-07-05T10:00:00Z',
      updatedAt: '2024-07-05T16:00:00Z',
      resolvedAt: '2024-07-05T16:00:00Z',
      slaBreached: false,
      tags: ['network', 'vpn'],
      escalationLevel: 0,
      source: 'web',
    },
    {
      id: 'TK-004',
      ticketNumber: 'TK-004',
      title: 'Password reset request',
      description: 'Need to reset my password for the company email account',
      category: 'Access',
      priority: 'Medium',
      status: 'Open',
      createdBy: userId,
      createdByName: userName,
      department: 'IT',
      createdAt: '2024-07-07T09:00:00Z',
      updatedAt: '2024-07-07T09:00:00Z',
      slaBreached: false,
      tags: ['access', 'password'],
      escalationLevel: 0,
      source: 'web',
    },
  ];

  // Filter to show only Open tickets on dashboard
  const myTickets = allTickets.filter((ticket) => ticket.status === 'Open');

  const notifications: TicketNotification[] = [
    {
      id: 'N-001',
      type: 'ticket_update',
      title: 'Ticket Updated',
      message: 'Your ticket TK-001 has been updated by Alice Johnson',
      relatedTicketId: 'TK-001',
      isRead: false,
      createdAt: '2024-07-07T12:30:00Z',
    },
    {
      id: 'N-002',
      type: 'ticket_resolved',
      title: 'Ticket Resolved',
      message: 'Your ticket TK-003 has been resolved',
      relatedTicketId: 'TK-003',
      isRead: true,
      createdAt: '2024-07-05T16:00:00Z',
    },
  ];

  const announcements: SystemAnnouncement[] = [
    {
      id: 'A-001',
      title: 'System Maintenance Scheduled',
      content: 'Scheduled maintenance will occur on July 10th from 2-4 AM',
      type: 'maintenance',
      isActive: true,
      createdBy: 'admin',
      createdAt: '2024-07-07T10:00:00Z',
      targetRoles: ['Employee', 'Manager', 'IT Agent'],
    },
    {
      id: 'A-002',
      title: 'New IT Policy Updates',
      content: 'Please review the updated IT security policies in the knowledge base',
      type: 'policy',
      isActive: true,
      createdBy: 'admin',
      createdAt: '2024-07-06T15:00:00Z',
      targetRoles: ['Employee', 'Manager', 'IT Agent'],
    },
  ];

  const handleCreateTicket = () => {
    // In production, this would make an API call
    console.log('Creating ticket:', newTicketData);
    setCreateTicketOpen(false);
    setNewTicketData({
      title: '',
      category: '' as TicketCategory,
      description: '',
      priority: 'Medium',
      attachments: [],
    });
  };

  const handleTicketClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setTicketDetailOpen(true);
  };

  const handleCloseTicketDetail = () => {
    setSelectedTicket(null);
    setTicketDetailOpen(false);
  };

  return (
    <Box className="employee-dashboard">
      <Box className="dashboard-header">
        <Typography variant="h4" component="h1" className="dashboard-title">
          My Dashboard
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<Add />}
          onClick={() => setCreateTicketOpen(true)}
          className="create-ticket-button"
        >
          Create Ticket
        </Button>
      </Box>

      <DashboardStats tickets={allTickets} notifications={notifications} />

      <MyTickets tickets={myTickets} onTicketClick={handleTicketClick} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <AnnouncementsList announcements={announcements} />
        </Grid>
        <Grid item xs={12} md={6}>
          <NotificationsList notifications={notifications} />
        </Grid>
      </Grid>

      <CreateTicketDialog
        open={createTicketOpen}
        onClose={() => setCreateTicketOpen(false)}
        onSubmit={handleCreateTicket}
        ticketData={newTicketData}
        onTicketDataChange={setNewTicketData}
      />

      <TicketDetailModal
        ticket={selectedTicket}
        open={ticketDetailOpen}
        onClose={handleCloseTicketDetail}
        userRole="Employee"
        userId={userId}
      />
    </Box>
  );
};

export default EmployeeDashboard;
