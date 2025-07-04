import { canViewTicket, canEditTicket, canDeleteTicket } from '../utils/permissions';

describe('Permissions', () => {
  const mockTicket = {
    id: '1',
    ticketNumber: 'TKT-001',
    title: 'Test Ticket',
    description: 'Test Description',
    category: 'Software' as const,
    priority: 'Medium' as const,
    status: 'Open' as const,
    createdBy: 'user1',
    createdByName: 'Test User',
    department: 'Engineering',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    slaBreached: false,
    escalationLevel: 0,
    tags: [],
    source: 'web' as const,
  };

  describe('canViewTicket', () => {
    test('IT Admin can view all tickets', () => {
      expect(canViewTicket('IT Admin', mockTicket, 'admin1')).toBe(true);
    });

    test('Admin can view all tickets', () => {
      expect(canViewTicket('Admin', mockTicket, 'admin1')).toBe(true);
    });

    test('IT Agent can view all tickets', () => {
      expect(canViewTicket('IT Agent', mockTicket, 'agent1')).toBe(true);
    });

    test('Team Lead can view all tickets', () => {
      expect(canViewTicket('Team Lead', mockTicket, 'lead1')).toBe(true);
    });

    test('Manager can view Engineering department tickets', () => {
      expect(canViewTicket('Manager', mockTicket, 'manager1')).toBe(true);
    });

    test('Manager cannot view tickets from other departments', () => {
      const hrTicket = { ...mockTicket, department: 'HR' };
      expect(canViewTicket('Manager', hrTicket, 'manager1')).toBe(false);
    });

    test('HR can view HR category tickets', () => {
      const hrTicket = { ...mockTicket, category: 'HR' as const };
      expect(canViewTicket('HR', hrTicket, 'hr1')).toBe(true);
    });

    test('HR can view their own tickets', () => {
      expect(canViewTicket('HR', mockTicket, 'user1')).toBe(true);
    });

    test('Employee can only view their own tickets', () => {
      expect(canViewTicket('Employee', mockTicket, 'user1')).toBe(true);
      expect(canViewTicket('Employee', mockTicket, 'user2')).toBe(false);
    });

    test('User can only view their own tickets', () => {
      expect(canViewTicket('User', mockTicket, 'user1')).toBe(true);
      expect(canViewTicket('User', mockTicket, 'user2')).toBe(false);
    });
  });

  describe('canEditTicket', () => {
    test('IT Admin can edit all tickets', () => {
      expect(canEditTicket('IT Admin', mockTicket, 'admin1')).toBe(true);
    });

    test('Admin can edit all tickets', () => {
      expect(canEditTicket('Admin', mockTicket, 'admin1')).toBe(true);
    });

    test('IT Agent can edit all tickets', () => {
      expect(canEditTicket('IT Agent', mockTicket, 'agent1')).toBe(true);
    });

    test('Team Lead can edit all tickets', () => {
      expect(canEditTicket('Team Lead', mockTicket, 'lead1')).toBe(true);
    });

    test('Manager can edit Engineering department tickets', () => {
      expect(canEditTicket('Manager', mockTicket, 'manager1')).toBe(true);
    });

    test('Manager cannot edit tickets from other departments', () => {
      const hrTicket = { ...mockTicket, department: 'HR' };
      expect(canEditTicket('Manager', hrTicket, 'manager1')).toBe(false);
    });

    test('HR can edit HR category tickets', () => {
      const hrTicket = { ...mockTicket, category: 'HR' as const };
      expect(canEditTicket('HR', hrTicket, 'hr1')).toBe(true);
    });

    test('HR can edit their own tickets', () => {
      expect(canEditTicket('HR', mockTicket, 'user1')).toBe(true);
    });

    test('Employee can edit their own open tickets', () => {
      expect(canEditTicket('Employee', mockTicket, 'user1')).toBe(true);
    });

    test('Employee cannot edit closed tickets', () => {
      const closedTicket = { ...mockTicket, status: 'Closed' as const };
      expect(canEditTicket('Employee', closedTicket, 'user1')).toBe(false);
    });

    test('Employee cannot edit other users tickets', () => {
      expect(canEditTicket('Employee', mockTicket, 'user2')).toBe(false);
    });

    test('User can edit their own open tickets', () => {
      expect(canEditTicket('User', mockTicket, 'user1')).toBe(true);
    });

    test('User cannot edit closed tickets', () => {
      const closedTicket = { ...mockTicket, status: 'Closed' as const };
      expect(canEditTicket('User', closedTicket, 'user1')).toBe(false);
    });

    test('User cannot edit other users tickets', () => {
      expect(canEditTicket('User', mockTicket, 'user2')).toBe(false);
    });
  });

  describe('canDeleteTicket', () => {
    test('IT Admin can delete all tickets', () => {
      expect(canDeleteTicket('IT Admin', mockTicket, 'admin1')).toBe(true);
    });

    test('Admin can delete all tickets', () => {
      expect(canDeleteTicket('Admin', mockTicket, 'admin1')).toBe(true);
    });

    test('IT Agent can delete all tickets', () => {
      expect(canDeleteTicket('IT Agent', mockTicket, 'agent1')).toBe(true);
    });

    test('Team Lead can delete all tickets', () => {
      expect(canDeleteTicket('Team Lead', mockTicket, 'lead1')).toBe(true);
    });

    test('Manager can delete Engineering department tickets', () => {
      expect(canDeleteTicket('Manager', mockTicket, 'manager1')).toBe(true);
    });

    test('Manager cannot delete tickets from other departments', () => {
      const hrTicket = { ...mockTicket, department: 'HR' };
      expect(canDeleteTicket('Manager', hrTicket, 'manager1')).toBe(false);
    });

    test('HR can delete HR category tickets', () => {
      const hrTicket = { ...mockTicket, category: 'HR' as const };
      expect(canDeleteTicket('HR', hrTicket, 'hr1')).toBe(true);
    });

    test('HR can delete their own tickets', () => {
      expect(canDeleteTicket('HR', mockTicket, 'user1')).toBe(true);
    });

    test('Employee can delete their own open tickets', () => {
      expect(canDeleteTicket('Employee', mockTicket, 'user1')).toBe(true);
    });

    test('Employee cannot delete closed tickets', () => {
      const closedTicket = { ...mockTicket, status: 'Closed' as const };
      expect(canDeleteTicket('Employee', closedTicket, 'user1')).toBe(false);
    });

    test('Employee cannot delete other users tickets', () => {
      expect(canDeleteTicket('Employee', mockTicket, 'user2')).toBe(false);
    });

    test('User can delete their own open tickets', () => {
      expect(canDeleteTicket('User', mockTicket, 'user1')).toBe(true);
    });

    test('User cannot delete closed tickets', () => {
      const closedTicket = { ...mockTicket, status: 'Closed' as const };
      expect(canDeleteTicket('User', closedTicket, 'user1')).toBe(false);
    });

    test('User cannot delete other users tickets', () => {
      expect(canDeleteTicket('User', mockTicket, 'user2')).toBe(false);
    });
  });
});
