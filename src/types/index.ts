// User roles
export type UserRole = "Employee" | "HR" | "Manager" | "IT Admin";

// User interface
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department: string;
  managerId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Ticket status
export type TicketStatus =
  | "Open"
  | "In Progress"
  | "Resolved"
  | "Closed"
  | "Escalated";

// Ticket priority
export type TicketPriority = "Low" | "Medium" | "High" | "Critical";

// Ticket category
export type TicketCategory =
  | "Hardware"
  | "Software"
  | "Network"
  | "HR"
  | "Access"
  | "Other";

// Ticket interface
export interface Ticket {
  id: string;
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  createdBy: string;
  assignedTo?: string;
  department: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  tags: string[];
  attachments?: string[];
}

// Comment interface
export interface Comment {
  id: string;
  ticketId: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  content: string;
  createdAt: string;
  isInternal: boolean;
}

// Auth state
export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

// Ticket filters
export interface TicketFilters {
  status?: TicketStatus[];
  priority?: TicketPriority[];
  category?: TicketCategory[];
  assignedTo?: string[];
  department?: string[];
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface TicketFormData {
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  assignedTo?: string;
  tags: string[];
}
