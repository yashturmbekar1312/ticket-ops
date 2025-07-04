// SLA (Service Level Agreement) types and interfaces

export interface SLAPolicy {
  id: string;
  name: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical' | 'Urgent';
  category?: string;
  department?: string;

  // Response time in minutes
  responseTime: number;

  // Resolution time in minutes
  resolutionTime: number;

  // Business hours configuration
  businessHours: {
    enabled: boolean;
    timezone: string;
    workingDays: number[]; // 0-6 (Sunday-Saturday)
    startTime: string; // HH:MM
    endTime: string; // HH:MM
    holidays: string[]; // ISO date strings
  };

  // Escalation rules
  escalationRules: EscalationRule[];

  // Status
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EscalationRule {
  id: string;
  level: number;
  triggerAfter: number; // minutes after SLA breach
  action: 'email' | 'assign' | 'priority_change' | 'status_change';
  targetUsers: string[];
  targetGroups: string[];
  emailTemplate?: string;
  newPriority?: string;
  newStatus?: string;
  isActive: boolean;
}

export interface SLABreach {
  id: string;
  ticketId: string;
  slaPolicy: SLAPolicy;
  breachType: 'response' | 'resolution';
  breachTime: string;
  breachDuration: number; // minutes
  isResolved: boolean;
  resolvedAt?: string;
  escalationLevel: number;
  notificationsSent: string[];
}

export interface SLAMetrics {
  ticketId: string;
  slaPolicy: SLAPolicy;

  // Response metrics
  responseTarget: number;
  responseActual?: number;
  responseBreached: boolean;

  // Resolution metrics
  resolutionTarget: number;
  resolutionActual?: number;
  resolutionBreached: boolean;

  // Overall status
  status: 'on_track' | 'at_risk' | 'breached';
  timeRemaining: number;

  // Escalation
  escalationLevel: number;
  lastEscalatedAt?: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface BusinessHours {
  isBusinessHours: boolean;
  nextBusinessHour?: string;
  businessHoursRemaining: number;
  totalBusinessHours: number;
}

export interface SLAReport {
  period: {
    start: string;
    end: string;
  };

  overall: {
    totalTickets: number;
    slaCompliant: number;
    slaBreached: number;
    complianceRate: number;
    avgResponseTime: number;
    avgResolutionTime: number;
  };

  byPriority: Record<
    string,
    {
      totalTickets: number;
      slaCompliant: number;
      slaBreached: number;
      complianceRate: number;
      avgResponseTime: number;
      avgResolutionTime: number;
    }
  >;

  byCategory: Record<
    string,
    {
      totalTickets: number;
      slaCompliant: number;
      slaBreached: number;
      complianceRate: number;
      avgResponseTime: number;
      avgResolutionTime: number;
    }
  >;

  byDepartment: Record<
    string,
    {
      totalTickets: number;
      slaCompliant: number;
      slaBreached: number;
      complianceRate: number;
      avgResponseTime: number;
      avgResolutionTime: number;
    }
  >;

  trends: {
    date: string;
    slaCompliant: number;
    slaBreached: number;
    complianceRate: number;
  }[];
}
