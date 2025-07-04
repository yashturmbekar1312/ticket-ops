// Automation and workflow types

export interface AutomationRule {
  id: string;
  name: string;
  description: string;

  // Rule configuration
  trigger: AutomationTrigger;
  conditions: AutomationCondition[];
  actions: AutomationAction[];

  // Execution settings
  isActive: boolean;
  priority: number;
  executeOnce: boolean;

  // Timing
  delay?: number; // seconds
  schedule?: {
    type: 'immediate' | 'delayed' | 'scheduled';
    cronExpression?: string;
    timezone?: string;
  };

  // Limits
  maxExecutions?: number;
  rateLimitPerHour?: number;

  // Monitoring
  executionCount: number;
  lastExecuted?: string;
  lastExecutionStatus: 'success' | 'failed' | 'skipped';
  lastError?: string;

  // Ownership
  createdBy: string;
  createdByName: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface AutomationTrigger {
  type:
    | 'ticket_created'
    | 'ticket_updated'
    | 'ticket_assigned'
    | 'ticket_commented'
    | 'ticket_resolved'
    | 'ticket_closed'
    | 'sla_breach'
    | 'time_based'
    | 'webhook'
    | 'email';

  // Trigger-specific configuration
  config: {
    // For ticket events
    ticketFields?: string[];

    // For time-based triggers
    schedule?: string; // cron expression
    timezone?: string;

    // For webhook triggers
    webhookUrl?: string;
    webhookSecret?: string;

    // For email triggers
    emailAddress?: string;
    emailSubjectPattern?: string;
    emailBodyPattern?: string;
  };
}

export interface AutomationCondition {
  id: string;
  field: string;
  operator:
    | 'equals'
    | 'not_equals'
    | 'contains'
    | 'not_contains'
    | 'greater_than'
    | 'less_than'
    | 'greater_equal'
    | 'less_equal'
    | 'in'
    | 'not_in'
    | 'is_empty'
    | 'is_not_empty';
  value: any;
  logic: 'and' | 'or';

  // Advanced conditions
  customScript?: string;

  // Nested conditions
  subConditions?: AutomationCondition[];
}

export interface AutomationAction {
  id: string;
  type:
    | 'update_ticket'
    | 'assign_ticket'
    | 'send_email'
    | 'send_notification'
    | 'create_task'
    | 'webhook'
    | 'escalate'
    | 'add_comment'
    | 'custom_script';

  // Action configuration
  config: {
    // For update_ticket
    fieldUpdates?: Record<string, any>;

    // For assign_ticket
    assigneeId?: string;
    assignmentReason?: string;

    // For send_email
    to?: string[];
    cc?: string[];
    bcc?: string[];
    subject?: string;
    emailBody?: string;
    templateId?: string;

    // For send_notification
    notificationChannel?: string;
    message?: string;

    // For create_task
    taskTitle?: string;
    taskDescription?: string;
    taskAssignee?: string;
    taskDueDate?: string;

    // For webhook
    url?: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    headers?: Record<string, string>;
    webhookBody?: string;

    // For escalate
    escalationLevel?: number;
    escalationReason?: string;

    // For add_comment
    comment?: string;
    isPrivate?: boolean;

    // For custom_script
    script?: string;
    scriptLanguage?: 'javascript' | 'python';
  };

  // Execution settings
  continueOnError: boolean;
  retryCount: number;
  retryDelay: number; // seconds
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;

  // Workflow configuration
  type: 'approval' | 'escalation' | 'resolution' | 'custom';
  version: number;

  // Workflow structure
  steps: WorkflowStep[];
  transitions: WorkflowTransition[];

  // Triggers
  triggers: {
    ticketStatus?: string[];
    ticketPriority?: string[];
    ticketCategory?: string[];
    userRole?: string[];
    department?: string[];
    customConditions?: string;
  };

  // Settings
  isActive: boolean;
  allowParallelExecution: boolean;
  timeoutMinutes: number;

  // Ownership
  createdBy: string;
  createdByName: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  type: 'approval' | 'task' | 'notification' | 'condition' | 'delay' | 'custom';

  // Step configuration
  config: {
    // For approval steps
    approvers?: string[];
    approvalMode?: 'any' | 'all' | 'majority';
    allowReassignment?: boolean;

    // For task steps
    assignee?: string;
    taskTitle?: string;
    taskDescription?: string;
    dueDate?: string;

    // For notification steps
    recipients?: string[];
    notificationTemplate?: string;

    // For condition steps
    conditions?: AutomationCondition[];

    // For delay steps
    delayMinutes?: number;

    // For custom steps
    customScript?: string;
    customConfig?: Record<string, any>;
  };

  // Position
  position: {
    x: number;
    y: number;
  };

  // Execution settings
  isRequired: boolean;
  timeoutMinutes: number;
  retryCount: number;

  // Status
  status: 'pending' | 'active' | 'completed' | 'failed' | 'skipped';
}

export interface WorkflowTransition {
  id: string;
  fromStepId: string;
  toStepId: string;

  // Transition conditions
  conditions: AutomationCondition[];

  // Transition actions
  actions: AutomationAction[];

  // Settings
  isDefault: boolean;
  priority: number;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  ticketId: string;

  // Execution details
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  currentStepId?: string;

  // Timing
  startedAt: string;
  completedAt?: string;
  duration?: number; // seconds

  // Context
  context: Record<string, any>;
  variables: Record<string, any>;

  // Results
  results: StepResult[];

  // Error handling
  error?: string;
  errorStep?: string;
  retryCount: number;

  // Ownership
  triggeredBy: string;
  triggeredByName: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface StepResult {
  stepId: string;
  stepName: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';

  // Execution details
  startedAt: string;
  completedAt?: string;
  duration?: number; // seconds

  // Results
  output?: Record<string, any>;
  error?: string;

  // Approval specific
  approvals?: ApprovalResult[];

  // Task specific
  taskId?: string;
  taskStatus?: string;
}

export interface ApprovalResult {
  approverId: string;
  approverName: string;
  decision: 'approved' | 'rejected' | 'pending';
  comments?: string;
  decidedAt?: string;
}

export interface AutomationLog {
  id: string;
  ruleId: string;
  ruleName: string;
  ticketId: string;

  // Execution details
  status: 'success' | 'failed' | 'skipped';

  // Timing
  startedAt: string;
  completedAt?: string;
  duration: number; // milliseconds

  // Results
  actionsExecuted: number;
  error?: string;

  // Context
  triggerData: Record<string, any>;
  conditions: Record<string, any>;
  results: Record<string, any>;

  // Timestamps
  createdAt: string;
}

export interface MacroDefinition {
  id: string;
  name: string;
  description: string;

  // Macro configuration
  actions: AutomationAction[];

  // Visibility
  isPublic: boolean;
  allowedRoles: string[];
  allowedUsers: string[];

  // Usage
  usageCount: number;

  // Ownership
  createdBy: string;
  createdByName: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface ScheduledTask {
  id: string;
  name: string;
  description: string;

  // Task configuration
  type: 'automation_rule' | 'report_generation' | 'data_cleanup' | 'backup' | 'custom';
  config: Record<string, any>;

  // Scheduling
  schedule: {
    cronExpression: string;
    timezone: string;
    nextRun: string;
  };

  // Execution settings
  isActive: boolean;
  maxExecutionTime: number; // seconds
  retryCount: number;

  // Monitoring
  lastRun?: string;
  lastRunStatus: 'success' | 'failed' | 'timeout';
  lastError?: string;

  // Ownership
  createdBy: string;
  createdByName: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}
