// User roles - Updated with new roles
export type UserRole = "User" | "IT Agent" | "Team Lead" | "Admin" | "Employee" | "HR" | "Manager" | "IT Admin";

// User interface - Enhanced with more fields
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
  phone?: string;
  avatar?: string;
  preferences?: UserPreferences;
  ssoId?: string;
  ldapId?: string;
  lastLogin?: string;
}

// User preferences
export interface UserPreferences {
  notifications: {
    email: boolean;
    sms: boolean;
    inApp: boolean;
  };
  language: string;
  timezone: string;
  theme: 'light' | 'dark' | 'auto';
}

// Ticket status - Updated with new statuses
export type TicketStatus =
  | "New"
  | "Open" 
  | "Assigned"
  | "In Progress"
  | "Resolved"
  | "Closed"
  | "Escalated"
  | "Pending"
  | "Cancelled";

// Ticket priority
export type TicketPriority = "Low" | "Medium" | "High" | "Critical" | "Urgent";

// Ticket category - Enhanced categories
export type TicketCategory =
  | "Hardware"
  | "Software"
  | "Network"
  | "Access"
  | "HR"
  | "Security"
  | "Maintenance"
  | "Account"
  | "Training"
  | "Other";

// SLA Configuration
export interface SLAConfig {
  priority: TicketPriority;
  responseTime: number; // in hours
  resolutionTime: number; // in hours
  escalationTime: number; // in hours
}

// Ticket interface - Enhanced with SLA and more fields
export interface Ticket {
  id: string;
  ticketNumber: string; // Auto-generated
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  createdBy: string;
  createdByName: string;
  assignedTo?: string;
  assignedToName?: string;
  department: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  closedAt?: string;
  dueDate?: string;
  slaBreached: boolean;
  timeToResolution?: number; // in hours
  customerSatisfaction?: number; // 1-5 rating
  tags: string[];
  attachments?: TicketAttachment[];
  watchers?: string[]; // User IDs watching this ticket
  relatedTickets?: string[]; // Related ticket IDs
  escalationLevel: number; // 0 = no escalation, 1+ = escalation levels
  lastActivity?: string;
  source: 'web' | 'email' | 'phone' | 'chat' | 'api';
}

// Ticket attachment
export interface TicketAttachment {
  id: string;
  filename: string;
  url: string;
  size: number;
  mimeType: string;
  uploadedBy: string;
  uploadedAt: string;
}

// Enhanced Comment interface
export interface Comment {
  id: string;
  ticketId: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  content: string;
  createdAt: string;
  updatedAt?: string;
  isInternal: boolean;
  isEdited: boolean;
  mentions?: string[]; // User IDs mentioned in comment
  attachments?: TicketAttachment[];
}

// Activity log entry
export interface ActivityLog {
  id: string;
  ticketId: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: string;
  oldValue?: string;
  newValue?: string;
}

// Knowledge base article
export interface KnowledgeBaseArticle {
  id: string;
  title: string;
  content: string;
  summary: string;
  tags: string[];
  category: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  isPublished: boolean;
  helpfulCount: number;
  relatedArticles?: string[];
}

// Asset management
export interface Asset {
  id: string;
  name: string;
  type: 'laptop' | 'desktop' | 'monitor' | 'printer' | 'phone' | 'tablet' | 'software' | 'license' | 'other';
  serialNumber?: string;
  assetTag?: string;
  assignedTo?: string;
  assignedToName?: string;
  department: string;
  status: 'active' | 'maintenance' | 'retired' | 'lost' | 'disposed';
  purchaseDate?: string;
  warrantyExpiry?: string;
  cost?: number;
  location?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// SLA Metrics
export interface SLAMetrics {
  ticketId: string;
  priority: TicketPriority;
  responseTime: number; // actual time in hours
  resolutionTime?: number; // actual time in hours
  responseTarget: number; // target time in hours
  resolutionTarget: number; // target time in hours
  responseBreached: boolean;
  resolutionBreached: boolean;
  escalated: boolean;
  escalationLevel: number;
}

// Dashboard statistics
export interface DashboardStats {
  totalTickets: number;
  openTickets: number;
  resolvedTickets: number;
  closedTickets: number;
  overdue: number;
  slaBreached: number;
  avgResolutionTime: number;
  customerSatisfactionAvg: number;
  ticketsByCategory: Record<TicketCategory, number>;
  ticketsByPriority: Record<TicketPriority, number>;
  ticketsByStatus: Record<TicketStatus, number>;
  recentActivity: ActivityLog[];
  topResolvers: Array<{ userId: string; userName: string; count: number }>;
}

// Automation rule
export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  trigger: AutomationTrigger;
  conditions: AutomationCondition[];
  actions: AutomationAction[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  lastExecuted?: string;
  executionCount: number;
}

export interface AutomationTrigger {
  type: 'ticket_created' | 'ticket_updated' | 'comment_added' | 'sla_breach' | 'schedule';
  schedule?: string; // cron expression for scheduled triggers
}

export interface AutomationCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'in' | 'not_in';
  value: string | string[] | number;
}

export interface AutomationAction {
  type: 'assign_ticket' | 'update_status' | 'update_priority' | 'send_notification' | 'add_comment' | 'escalate';
  parameters: Record<string, any>;
}

// Notification
export interface Notification {
  id: string;
  userId: string;
  type: 'ticket_assigned' | 'ticket_updated' | 'comment_added' | 'sla_warning' | 'escalation' | 'mention';
  title: string;
  message: string;
  ticketId?: string;
  isRead: boolean;
  createdAt: string;
  metadata?: Record<string, any>;
}

// System announcement
export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'maintenance' | 'success';
  targetRoles: UserRole[];
  isActive: boolean;
  startDate: string;
  endDate?: string;
  createdBy: string;
  createdAt: string;
}

// Integration configuration
export interface IntegrationConfig {
  id: string;
  type: 'slack' | 'teams' | 'email' | 'webhook' | 'ldap' | 'sso';
  name: string;
  settings: Record<string, any>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Comment interface (keeping original for backward compatibility)
export interface LegacyComment {
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

// Ticket filters - Enhanced with new options
export interface TicketFilters {
  status?: TicketStatus[];
  priority?: TicketPriority[];
  category?: TicketCategory[];
  assignedTo?: string[];
  createdBy?: string[];
  department?: string[];
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  tags?: string[];
  slaBreached?: boolean;
  overdue?: boolean;
  source?: Array<'web' | 'email' | 'phone' | 'chat' | 'api'>;
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

// Form types - Enhanced with new forms
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
  attachments?: File[];
  watchers?: string[];
}

export interface CommentFormData {
  content: string;
  isInternal: boolean;
  attachments?: File[];
  mentions?: string[];
}

export interface UserFormData {
  name: string;
  email: string;
  role: UserRole;
  department: string;
  phone?: string;
  managerId?: string;
  isActive: boolean;
}

export interface KnowledgeBaseFormData {
  title: string;
  content: string;
  summary: string;
  tags: string[];
  category: string;
  isPublished: boolean;
}

export interface AssetFormData {
  name: string;
  type: Asset['type'];
  serialNumber?: string;
  assetTag?: string;
  assignedTo?: string;
  department: string;
  status: Asset['status'];
  purchaseDate?: string;
  warrantyExpiry?: string;
  cost?: number;
  location?: string;
  notes?: string;
}

// Search and filter types
export interface SearchFilters {
  query?: string;
  category?: string;
  department?: string;
  dateRange?: {
    from: string;
    to: string;
  };
  sort?: {
    field: string;
    direction: 'asc' | 'desc';
  };
}

// Report types
export interface ReportConfig {
  id: string;
  name: string;
  type: 'tickets' | 'sla' | 'satisfaction' | 'performance' | 'custom';
  filters: TicketFilters;
  dateRange: {
    from: string;
    to: string;
  };
  groupBy?: string;
  metrics: string[];
  format: 'table' | 'chart' | 'pdf' | 'excel';
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    recipients: string[];
  };
}

// Bulk action types
export interface BulkAction {
  type: 'assign' | 'status_update' | 'priority_update' | 'add_tags' | 'remove_tags' | 'delete';
  ticketIds: string[];
  parameters: Record<string, any>;
}

// Audit log
export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resourceType: 'ticket' | 'user' | 'asset' | 'kb_article' | 'system';
  resourceId: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}
