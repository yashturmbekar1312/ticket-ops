import { Ticket, UserRole } from '../types';

// Role-based access control utilities
export const canViewTicket = (userRole: UserRole, ticket: Ticket, userId: string): boolean => {
  switch (userRole) {
    case 'Admin':
    case 'IT Admin':
      return true;
    case 'Team Lead':
    case 'IT Agent':
      // IT Agents and Team Leads can view all tickets
      return true;
    case 'Manager':
      // Managers can view tickets from their department or assigned to them
      return ticket.department === 'Engineering' || ticket.assignedTo === userId;
    case 'HR':
      // HR can view HR-related tickets or tickets they created
      return ticket.category === 'HR' || ticket.createdBy === userId;
    case 'User':
    case 'Employee':
      // Users/Employees can only view their own tickets
      return ticket.createdBy === userId;
    default:
      return false;
  }
};

export const canEditTicket = (userRole: UserRole, ticket: Ticket, userId: string): boolean => {
  switch (userRole) {
    case 'Admin':
    case 'IT Admin':
      return true;
    case 'Team Lead':
    case 'IT Agent':
      // IT staff can edit tickets assigned to them or any open ticket
      return ticket.assignedTo === userId || ticket.status !== 'Closed';
    case 'Manager':
      return ticket.assignedTo === userId || ticket.department === 'Engineering';
    case 'HR':
      return (
        ticket.category === 'HR' && (ticket.createdBy === userId || ticket.assignedTo === userId)
      );
    case 'User':
    case 'Employee':
      return ticket.createdBy === userId && !['Closed', 'Resolved'].includes(ticket.status);
    default:
      return false;
  }
};

export const canDeleteTicket = (userRole: UserRole, ticket: Ticket, userId: string): boolean => {
  switch (userRole) {
    case 'Admin':
    case 'IT Admin':
      return true;
    case 'Team Lead':
      return ticket.assignedTo === userId || ticket.status === 'New';
    case 'IT Agent':
      return ticket.assignedTo === userId;
    case 'Manager':
      return ticket.assignedTo === userId;
    case 'HR':
      return ticket.category === 'HR' && ticket.createdBy === userId;
    case 'User':
    case 'Employee':
      return ticket.createdBy === userId && ['New', 'Open'].includes(ticket.status);
    default:
      return false;
  }
};

export const canAssignTicket = (userRole: UserRole): boolean => {
  return ['IT Admin', 'Manager'].includes(userRole);
};

export const canEscalateTicket = (userRole: UserRole): boolean => {
  return ['HR', 'Manager', 'IT Admin'].includes(userRole);
};

export const canViewAllTickets = (userRole: UserRole): boolean => {
  return userRole === 'IT Admin';
};

export const canManageUsers = (userRole: UserRole): boolean => {
  return userRole === 'IT Admin';
};

export const canViewReports = (userRole: UserRole): boolean => {
  return ['Manager', 'IT Admin'].includes(userRole);
};

export const getAvailableStatuses = (userRole: UserRole, _currentStatus: string): string[] => {
  const allStatuses = ['Open', 'In Progress', 'Resolved', 'Closed', 'Escalated'];

  switch (userRole) {
    case 'IT Admin':
      return allStatuses;
    case 'Manager':
      return ['Open', 'In Progress', 'Escalated'];
    case 'HR':
      return ['Open', 'In Progress', 'Escalated'];
    case 'Employee':
      return []; // Employees can't change status
    default:
      return [];
  }
};

export const getAvailablePriorities = (userRole: UserRole): string[] => {
  const allPriorities = ['Low', 'Medium', 'High', 'Critical'];

  switch (userRole) {
    case 'IT Admin':
    case 'Manager':
      return allPriorities;
    case 'HR':
      return ['Low', 'Medium', 'High'];
    case 'Employee':
      return ['Low', 'Medium'];
    default:
      return ['Low'];
  }
};

export const getRoleColor = (role: UserRole): string => {
  switch (role) {
    case 'IT Admin':
      return '#f44336';
    case 'Manager':
      return '#ff9800';
    case 'HR':
      return '#4caf50';
    case 'Employee':
      return '#2196f3';
    default:
      return '#9e9e9e';
  }
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Open':
      return '#2196f3';
    case 'In Progress':
      return '#ff9800';
    case 'Resolved':
      return '#4caf50';
    case 'Closed':
      return '#9e9e9e';
    case 'Escalated':
      return '#f44336';
    default:
      return '#9e9e9e';
  }
};

export const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'Critical':
      return '#f44336';
    case 'High':
      return '#ff9800';
    case 'Medium':
      return '#2196f3';
    case 'Low':
      return '#4caf50';
    default:
      return '#9e9e9e';
  }
};
