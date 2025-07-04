import {
  Ticket,
  TicketFormData,
  Comment,
  TicketFilters,
  PaginatedResponse,
  TicketAttachment,
} from '../types';

// Mock data for development
const mockTickets: Ticket[] = [
  {
    id: '1',
    ticketNumber: 'TKT-001',
    title: 'Laptop not working',
    description: "My laptop won't turn on after the latest update",
    category: 'Hardware',
    priority: 'High',
    status: 'Open',
    createdBy: '4',
    createdByName: 'Bob Employee',
    department: 'Engineering',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    slaBreached: false,
    escalationLevel: 0,
    tags: ['laptop', 'hardware', 'urgent'],
    source: 'web',
  },
  {
    id: '2',
    ticketNumber: 'TKT-002',
    title: 'Access to new software',
    description: 'Need access to the new project management tool',
    category: 'Access',
    priority: 'Medium',
    status: 'In Progress',
    createdBy: '4',
    createdByName: 'Bob Employee',
    assignedTo: '1',
    department: 'Engineering',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    slaBreached: false,
    escalationLevel: 0,
    tags: ['access', 'software'],
    source: 'web',
  },
  {
    id: '3',
    ticketNumber: 'TKT-003',
    title: 'New employee onboarding',
    description: 'Set up accounts and equipment for new hire',
    category: 'HR',
    priority: 'Medium',
    status: 'Open',
    createdBy: '3',
    createdByName: 'Alice HR',
    department: 'Human Resources',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
    slaBreached: false,
    escalationLevel: 0,
    tags: ['onboarding', 'new-hire'],
    source: 'web',
  },
  {
    id: '4',
    ticketNumber: 'TKT-004',
    title: 'Network connectivity issues',
    description: 'Intermittent connection drops in the office',
    category: 'Network',
    priority: 'High',
    status: 'Escalated',
    createdBy: '2',
    createdByName: 'Jane Manager',
    assignedTo: '1',
    department: 'Engineering',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    slaBreached: true,
    escalationLevel: 1,
    tags: ['network', 'connectivity'],
    source: 'web',
  },
];

export const ticketService = {
  getTickets: async (filters?: TicketFilters): Promise<PaginatedResponse<Ticket>> => {
    // Mock implementation - filter tickets based on filters
    let filteredTickets = [...mockTickets];

    if (filters?.status?.length) {
      filteredTickets = filteredTickets.filter((ticket) => filters.status!.includes(ticket.status));
    }

    if (filters?.priority?.length) {
      filteredTickets = filteredTickets.filter((ticket) =>
        filters.priority!.includes(ticket.priority)
      );
    }

    if (filters?.category?.length) {
      filteredTickets = filteredTickets.filter((ticket) =>
        filters.category!.includes(ticket.category)
      );
    }

    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredTickets = filteredTickets.filter(
        (ticket) =>
          ticket.title.toLowerCase().includes(searchTerm) ||
          ticket.description.toLowerCase().includes(searchTerm)
      );
    }

    return {
      data: filteredTickets,
      total: filteredTickets.length,
      page: 1,
      limit: 10,
      totalPages: Math.ceil(filteredTickets.length / 10),
    };
  },

  getTicket: async (id: string): Promise<Ticket> => {
    const ticket = mockTickets.find((t) => t.id === id);
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    return ticket;
  },

  createTicket: async (ticketData: TicketFormData): Promise<Ticket> => {
    const { attachments, ...ticketProps } = ticketData;

    // Convert File[] to TicketAttachment[] if needed
    const processedAttachments: TicketAttachment[] | undefined = attachments?.map(
      (file, index) => ({
        id: `${Date.now()}-${index}`,
        filename: file.name,
        url: URL.createObjectURL(file), // Mock URL for development
        size: file.size,
        mimeType: file.type,
        uploadedBy: '4',
        uploadedAt: new Date().toISOString(),
      })
    );

    const newTicket: Ticket = {
      id: Date.now().toString(),
      ticketNumber: `TKT-${Date.now().toString().slice(-5)}`,
      ...ticketProps,
      status: 'Open',
      createdBy: '4', // Mock current user
      createdByName: 'Bob Employee',
      department: 'Engineering',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      slaBreached: false,
      escalationLevel: 0,
      source: 'web',
      attachments: processedAttachments,
    };

    mockTickets.push(newTicket);
    return newTicket;
  },

  updateTicket: async (id: string, updates: Partial<Ticket>): Promise<Ticket> => {
    const ticketIndex = mockTickets.findIndex((t) => t.id === id);
    if (ticketIndex === -1) {
      throw new Error('Ticket not found');
    }

    const updatedTicket = {
      ...mockTickets[ticketIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    mockTickets[ticketIndex] = updatedTicket;
    return updatedTicket;
  },

  deleteTicket: async (id: string): Promise<void> => {
    const ticketIndex = mockTickets.findIndex((t) => t.id === id);
    if (ticketIndex === -1) {
      throw new Error('Ticket not found');
    }

    mockTickets.splice(ticketIndex, 1);
  },

  getComments: async (ticketId: string): Promise<Comment[]> => {
    // Mock comments
    return [
      {
        id: '1',
        ticketId,
        userId: '4',
        userName: 'Bob Employee',
        userRole: 'Employee',
        content: 'I tried restarting but the issue persists.',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        isInternal: false,
        isEdited: false,
      },
      {
        id: '2',
        ticketId,
        userId: '1',
        userName: 'IT Admin',
        userRole: 'IT Admin',
        content: "I'll check the hardware diagnostics.",
        createdAt: new Date(Date.now() - 1800000).toISOString(),
        isInternal: true,
        isEdited: false,
      },
    ];
  },

  addComment: async (
    ticketId: string,
    content: string,
    isInternal: boolean = false
  ): Promise<Comment> => {
    const newComment: Comment = {
      id: Date.now().toString(),
      ticketId,
      userId: '4', // Mock current user
      userName: 'Bob Employee',
      userRole: 'Employee',
      content,
      createdAt: new Date().toISOString(),
      isInternal,
      isEdited: false,
    };

    return newComment;
  },
};
