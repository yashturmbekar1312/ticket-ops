import { canViewTicket, canEditTicket, canDeleteTicket } from '../utils/permissions';
import { Ticket } from '../types';

describe('Permissions', () => {
  const mockTicket: Ticket = {
    id: '1',
    title: 'Test Ticket',
    description: 'Test Description',
    category: 'Software',
    priority: 'Medium',
    status: 'Open',
    createdBy: 'user1',
    department: 'Engineering',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: [],
  };

  describe('canViewTicket', () => {
    test('IT Admin can view all tickets', () => {
      expect(canViewTicket('IT Admin', mockTicket, 'admin1')).toBe(true);
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
  });

  describe('canEditTicket', () => {
    test('IT Admin can edit all tickets', () => {
      expect(canEditTicket('IT Admin', mockTicket, 'admin1')).toBe(true);
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
  });

  describe('canDeleteTicket', () => {
    test('IT Admin can delete all tickets', () => {
      expect(canDeleteTicket('IT Admin', mockTicket, 'admin1')).toBe(true);
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
  });
});
