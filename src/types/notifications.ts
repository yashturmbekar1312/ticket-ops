// Real-time notifications and communication types

export interface NotificationChannel {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'push' | 'slack' | 'teams' | 'webhook';
  config: {
    email?: {
      smtpHost: string;
      smtpPort: number;
      username: string;
      password: string;
      from: string;
      encryption: 'none' | 'tls' | 'ssl';
    };
    sms?: {
      provider: 'twilio' | 'aws' | 'custom';
      accountId: string;
      authToken: string;
      fromNumber: string;
    };
    push?: {
      provider: 'firebase' | 'apns' | 'custom';
      serverKey: string;
      bundleId: string;
    };
    slack?: {
      botToken: string;
      channel: string;
      webhookUrl: string;
    };
    teams?: {
      webhookUrl: string;
    };
    webhook?: {
      url: string;
      method: 'POST' | 'PUT' | 'PATCH';
      headers: Record<string, string>;
      authentication?: {
        type: 'bearer' | 'basic' | 'api_key';
        token: string;
        username?: string;
        password?: string;
      };
    };
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  description: string;
  channel: string;
  eventType: string;

  // Template content
  subject?: string; // For email/SMS
  body: string;
  htmlBody?: string; // For email
  variables: string[]; // Available template variables

  // Conditions
  conditions: {
    ticketStatus?: string[];
    ticketPriority?: string[];
    ticketCategory?: string[];
    userRole?: string[];
    department?: string[];
    slaBreached?: boolean;
    escalationLevel?: number;
  };

  // Settings
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationEvent {
  id: string;
  type:
    | 'ticket_created'
    | 'ticket_updated'
    | 'ticket_assigned'
    | 'ticket_commented'
    | 'ticket_resolved'
    | 'ticket_closed'
    | 'sla_breach'
    | 'escalation'
    | 'reminder';

  // Event data
  ticketId: string;
  userId: string;
  data: Record<string, any>;

  // Notification details
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';

  // Delivery
  recipients: string[];
  channels: string[];

  // Status
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  sentAt?: string;
  deliveredAt?: string;
  failureReason?: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface NotificationPreference {
  id: string;
  userId: string;

  // Channel preferences
  channels: {
    email: boolean;
    sms: boolean;
    push: boolean;
    inApp: boolean;
  };

  // Event preferences
  events: {
    ticketCreated: boolean;
    ticketUpdated: boolean;
    ticketAssigned: boolean;
    ticketCommented: boolean;
    ticketResolved: boolean;
    ticketClosed: boolean;
    slaBreached: boolean;
    escalation: boolean;
    reminder: boolean;
  };

  // Schedule preferences
  schedule: {
    enabled: boolean;
    quietHours: {
      start: string; // HH:MM
      end: string; // HH:MM
    };
    weekends: boolean;
    holidays: boolean;
  };

  // Frequency preferences
  frequency: {
    immediate: boolean;
    batched: boolean;
    batchInterval: number; // minutes
    digest: boolean;
    digestTime: string; // HH:MM
  };

  createdAt: string;
  updatedAt: string;
}

export interface InAppNotification {
  id: string;
  userId: string;

  // Notification content
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';

  // Associated data
  ticketId?: string;
  actionUrl?: string;
  actionText?: string;

  // Status
  isRead: boolean;
  readAt?: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface NotificationDelivery {
  id: string;
  notificationId: string;
  channel: string;
  recipient: string;

  // Delivery status
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'bounced';
  attempts: number;
  lastAttempt: string;

  // Response data
  externalId?: string;
  response?: Record<string, any>;
  errorMessage?: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface NotificationRule {
  id: string;
  name: string;
  description: string;

  // Trigger conditions
  trigger: {
    event: string;
    conditions: Record<string, any>;
    delay?: number; // minutes
  };

  // Action configuration
  action: {
    type: 'notification' | 'email' | 'webhook' | 'assignment' | 'escalation';
    config: Record<string, any>;
  };

  // Status
  isActive: boolean;
  executionCount: number;
  lastExecuted?: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface WebSocketMessage {
  type: 'notification' | 'ticket_update' | 'user_activity' | 'system_message';
  data: Record<string, any>;
  timestamp: string;
  userId?: string;
  sessionId?: string;
}

export interface PushSubscription {
  id: string;
  userId: string;
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  userAgent: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
