// Integration and external service types

export interface IntegrationProvider {
  id: string;
  name: string;
  description: string;
  type: 'communication' | 'productivity' | 'monitoring' | 'crm' | 'hr' | 'development' | 'custom';
  category: string;

  // Provider details
  vendor: string;
  version: string;
  logo?: string;
  website?: string;
  documentation?: string;

  // Authentication
  authType: 'oauth2' | 'api_key' | 'basic' | 'token' | 'custom';
  authConfig: {
    oauth2?: {
      clientId: string;
      clientSecret: string;
      authUrl: string;
      tokenUrl: string;
      scope: string[];
    };
    apiKey?: {
      headerName: string;
      paramName?: string;
    };
    basic?: {
      username: string;
      password: string;
    };
    token?: {
      headerName: string;
      prefix?: string;
    };
    custom?: Record<string, any>;
  };

  // API configuration
  baseUrl: string;
  endpoints: IntegrationEndpoint[];

  // Features
  features: {
    bidirectional: boolean;
    realTime: boolean;
    webhook: boolean;
    bulkOperation: boolean;
    customFields: boolean;
    fileSync: boolean;
  };

  // Status
  isActive: boolean;
  isVerified: boolean;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface IntegrationEndpoint {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;

  // Parameters
  queryParams?: EndpointParameter[];
  bodyParams?: EndpointParameter[];
  headers?: EndpointParameter[];

  // Response
  responseType: 'json' | 'xml' | 'text' | 'binary';

  // Rate limiting
  rateLimitPerMinute?: number;
  rateLimitPerHour?: number;

  // Caching
  cacheEnabled: boolean;
  cacheDuration?: number; // seconds
}

export interface EndpointParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required: boolean;
  description?: string;
  defaultValue?: any;
}

export interface IntegrationConnection {
  id: string;
  name: string;
  providerId: string;
  providerName: string;

  // Connection details
  status: 'active' | 'inactive' | 'error' | 'pending';
  config: Record<string, any>;

  // Authentication
  credentials: {
    accessToken?: string;
    refreshToken?: string;
    apiKey?: string;
    tokenExpiry?: string;
  };

  // Sync settings
  syncSettings: {
    enabled: boolean;
    direction: 'inbound' | 'outbound' | 'bidirectional';
    frequency: 'real_time' | 'hourly' | 'daily' | 'weekly' | 'manual';
    lastSync?: string;
    nextSync?: string;
  };

  // Field mapping
  fieldMappings: FieldMapping[];

  // Webhooks
  webhooks: {
    inbound?: string;
    outbound?: string;
    secret?: string;
  };

  // Monitoring
  lastError?: string;
  errorCount: number;

  // Ownership
  createdBy: string;
  createdByName: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface FieldMapping {
  id: string;
  sourceField: string;
  targetField: string;
  transformation?: string;
  isRequired: boolean;
  defaultValue?: any;

  // Data type conversion
  sourceType: 'string' | 'number' | 'boolean' | 'date' | 'object' | 'array';
  targetType: 'string' | 'number' | 'boolean' | 'date' | 'object' | 'array';
}

export interface IntegrationSync {
  id: string;
  connectionId: string;
  connectionName: string;

  // Sync details
  type: 'manual' | 'scheduled' | 'webhook' | 'real_time';
  direction: 'inbound' | 'outbound';

  // Status
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

  // Timing
  startedAt: string;
  completedAt?: string;
  duration?: number; // seconds

  // Results
  recordsProcessed: number;
  recordsCreated: number;
  recordsUpdated: number;
  recordsDeleted: number;
  recordsSkipped: number;
  recordsFailed: number;

  // Error handling
  errors: SyncError[];

  // Triggered by
  triggeredBy: string;
  triggeredByName: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface SyncError {
  id: string;
  recordId: string;
  errorType: 'validation' | 'permission' | 'network' | 'rate_limit' | 'unknown';
  errorMessage: string;
  errorCode?: string;

  // Context
  sourceData: Record<string, any>;
  targetData?: Record<string, any>;

  // Resolution
  isResolved: boolean;
  resolvedAt?: string;
  resolution?: string;

  // Timestamps
  createdAt: string;
}

export interface APIEndpoint {
  id: string;
  name: string;
  description: string;

  // Endpoint configuration
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  version: string;

  // Authentication
  requiresAuth: boolean;
  permissions: string[];

  // Parameters
  queryParams: APIParameter[];
  bodyParams: APIParameter[];
  headers: APIParameter[];

  // Response
  responseSchema: Record<string, any>;
  responseExamples: Record<string, any>;

  // Rate limiting
  rateLimitPerMinute: number;
  rateLimitPerHour: number;
  rateLimitPerDay: number;

  // Caching
  cacheEnabled: boolean;
  cacheDuration: number; // seconds

  // Monitoring
  isActive: boolean;

  // Usage statistics
  totalRequests: number;
  avgResponseTime: number;
  errorRate: number;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface APIParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'file';
  description: string;
  required: boolean;
  defaultValue?: any;

  // Validation
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    enum?: string[];
  };
}

export interface APIKey {
  id: string;
  name: string;
  description: string;

  // Key details
  key: string;
  hashedKey: string;

  // Permissions
  permissions: string[];
  allowedEndpoints: string[];
  allowedIPs: string[];

  // Rate limiting
  rateLimitPerMinute: number;
  rateLimitPerHour: number;
  rateLimitPerDay: number;

  // Usage tracking
  totalRequests: number;
  lastUsed?: string;

  // Status
  isActive: boolean;
  expiresAt?: string;

  // Ownership
  createdBy: string;
  createdByName: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface WebhookEndpoint {
  id: string;
  name: string;
  description: string;

  // Endpoint configuration
  url: string;
  method: 'POST' | 'PUT' | 'PATCH';

  // Authentication
  authType: 'none' | 'basic' | 'bearer' | 'hmac' | 'custom';
  credentials: Record<string, any>;

  // Event configuration
  events: string[];
  filters: Record<string, any>;

  // Payload configuration
  payloadTemplate?: string;
  headers: Record<string, string>;

  // Retry configuration
  retryCount: number;
  retryDelay: number; // seconds
  retryBackoff: 'linear' | 'exponential';

  // Timeout
  timeoutSeconds: number;

  // Status
  isActive: boolean;

  // Monitoring
  totalDeliveries: number;
  successfulDeliveries: number;
  failedDeliveries: number;
  avgResponseTime: number;
  lastDelivery?: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface WebhookDelivery {
  id: string;
  webhookId: string;

  // Event details
  event: string;
  eventId: string;

  // Delivery details
  url: string;
  method: string;
  headers: Record<string, string>;
  payload: Record<string, any>;

  // Response
  responseStatus?: number;
  responseHeaders?: Record<string, string>;
  responseBody?: string;
  responseTime: number; // milliseconds

  // Status
  status: 'pending' | 'success' | 'failed' | 'timeout';

  // Retry information
  attemptNumber: number;
  maxAttempts: number;
  nextAttempt?: string;

  // Error details
  error?: string;
  errorCode?: string;

  // Timestamps
  createdAt: string;
  deliveredAt?: string;
}

export interface ChatIntegration {
  id: string;
  name: string;
  platform: 'slack' | 'teams' | 'discord' | 'telegram' | 'custom';

  // Connection details
  botToken: string;
  botName: string;

  // Channel configuration
  channels: ChatChannel[];

  // Features
  features: {
    ticketCreation: boolean;
    ticketUpdates: boolean;
    commands: boolean;
    notifications: boolean;
    fileSharing: boolean;
  };

  // Commands
  commands: ChatCommand[];

  // Status
  isActive: boolean;
  connectionStatus: 'connected' | 'disconnected' | 'error';

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface ChatChannel {
  id: string;
  name: string;
  channelId: string;
  type: 'public' | 'private' | 'dm';

  // Configuration
  allowTicketCreation: boolean;
  allowTicketUpdates: boolean;
  allowCommands: boolean;

  // Notifications
  notificationEvents: string[];

  // Permissions
  allowedRoles: string[];
  allowedUsers: string[];
}

export interface ChatCommand {
  id: string;
  command: string;
  description: string;

  // Parameters
  parameters: ChatCommandParameter[];

  // Action
  action: 'create_ticket' | 'update_ticket' | 'search_tickets' | 'custom';
  config: Record<string, any>;

  // Permissions
  requiredRoles: string[];

  // Usage
  usageCount: number;

  // Status
  isActive: boolean;
}

export interface ChatCommandParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'choice';
  required: boolean;
  description: string;
  choices?: string[];
  defaultValue?: any;
}
