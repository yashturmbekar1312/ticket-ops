export interface WorkflowRule {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  trigger: WorkflowTrigger;
  conditions: WorkflowCondition[];
  actions: WorkflowAction[];
  priority: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
  executionCount: number;
  lastExecuted?: Date;
  category: WorkflowCategory;
  tags: string[];
}

export interface WorkflowTrigger {
  type: TriggerType;
  event: string;
  schedule?: CronSchedule;
  configuration: Record<string, any>;
}

export interface WorkflowCondition {
  id: string;
  type: 'field' | 'script' | 'time' | 'user' | 'custom';
  field?: string;
  operator: ConditionOperator;
  value: any;
  script?: string;
  logicalOperator?: 'AND' | 'OR';
}

export interface WorkflowAction {
  id: string;
  type: ActionType;
  configuration: Record<string, any>;
  delay?: number;
  continueOnError: boolean;
  retryCount: number;
  retryDelay: number;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  triggeredBy: string;
  startTime: Date;
  endTime?: Date;
  status: ExecutionStatus;
  context: Record<string, any>;
  steps: WorkflowStep[];
  errors: WorkflowError[];
  logs: WorkflowLog[];
  duration?: number;
}

export interface WorkflowStep {
  id: string;
  actionId: string;
  name: string;
  status: StepStatus;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  result?: any;
  error?: string;
  retryCount: number;
}

export interface WorkflowError {
  id: string;
  stepId?: string;
  message: string;
  stack?: string;
  timestamp: Date;
  type: 'validation' | 'execution' | 'system';
}

export interface WorkflowLog {
  id: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  timestamp: Date;
  data?: Record<string, any>;
}

export interface CronSchedule {
  expression: string;
  timezone: string;
  nextExecution?: Date;
  enabled: boolean;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: WorkflowCategory;
  tags: string[];
  version: string;
  author: string;
  isBuiltIn: boolean;
  template: Partial<WorkflowRule>;
  parameters: TemplateParameter[];
  documentation?: string;
  examples?: WorkflowExample[];
}

export interface TemplateParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'select' | 'multiselect';
  required: boolean;
  defaultValue?: any;
  options?: { value: any; label: string }[];
  description: string;
  validation?: string;
}

export interface WorkflowExample {
  title: string;
  description: string;
  configuration: Record<string, any>;
}

export interface WorkflowMetrics {
  totalWorkflows: number;
  activeWorkflows: number;
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  averageExecutionTime: number;
  executionsByStatus: Record<ExecutionStatus, number>;
  executionsByTrigger: Record<TriggerType, number>;
  topWorkflows: WorkflowUsage[];
  recentActivity: WorkflowActivity[];
}

export interface WorkflowUsage {
  workflowId: string;
  workflowName: string;
  executionCount: number;
  successRate: number;
  averageTime: number;
}

export interface WorkflowActivity {
  id: string;
  workflowId: string;
  workflowName: string;
  action: string;
  timestamp: Date;
  user: string;
  details: Record<string, any>;
}

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: AutomationTrigger;
  conditions: AutomationCondition[];
  actions: AutomationAction[];
  isActive: boolean;
  priority: number;
  scope: AutomationScope;
  createdAt: Date;
  updatedAt: Date;
}

export interface AutomationTrigger {
  type:
    | 'ticket_created'
    | 'ticket_updated'
    | 'ticket_assigned'
    | 'sla_breach'
    | 'schedule'
    | 'webhook';
  configuration: Record<string, any>;
}

export interface AutomationCondition {
  field: string;
  operator:
    | 'equals'
    | 'not_equals'
    | 'contains'
    | 'not_contains'
    | 'greater_than'
    | 'less_than'
    | 'in'
    | 'not_in';
  value: any;
  logicalOperator?: 'AND' | 'OR';
}

export interface AutomationAction {
  type:
    | 'assign_ticket'
    | 'update_field'
    | 'send_email'
    | 'create_task'
    | 'escalate'
    | 'close_ticket'
    | 'add_comment'
    | 'webhook';
  configuration: Record<string, any>;
}

export interface AutomationScope {
  type: 'global' | 'department' | 'team' | 'user';
  value?: string;
}

export interface BusinessRule {
  id: string;
  name: string;
  description: string;
  category: BusinessRuleCategory;
  type: BusinessRuleType;
  conditions: BusinessRuleCondition[];
  actions: BusinessRuleAction[];
  priority: number;
  isActive: boolean;
  validFrom?: Date;
  validUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface BusinessRuleCondition {
  field: string;
  operator: string;
  value: any;
  dataType: 'string' | 'number' | 'boolean' | 'date' | 'array';
}

export interface BusinessRuleAction {
  type: 'validate' | 'transform' | 'calculate' | 'enforce' | 'notify';
  configuration: Record<string, any>;
}

export interface ApprovalWorkflow {
  id: string;
  name: string;
  description: string;
  triggerConditions: ApprovalTrigger[];
  steps: ApprovalStep[];
  settings: ApprovalSettings;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApprovalTrigger {
  entity: 'ticket' | 'change' | 'purchase' | 'access_request';
  conditions: ApprovalCondition[];
}

export interface ApprovalCondition {
  field: string;
  operator: string;
  value: any;
}

export interface ApprovalStep {
  id: string;
  name: string;
  type: 'sequential' | 'parallel' | 'any_one' | 'majority';
  approvers: ApprovalApprover[];
  timeLimit?: number;
  escalation?: ApprovalEscalation;
  skipConditions?: ApprovalCondition[];
}

export interface ApprovalApprover {
  type: 'user' | 'role' | 'group' | 'manager' | 'dynamic';
  value: string;
  weight?: number;
}

export interface ApprovalEscalation {
  afterMinutes: number;
  approvers: ApprovalApprover[];
  notifyOriginal: boolean;
}

export interface ApprovalSettings {
  allowSelfApproval: boolean;
  allowDelegation: boolean;
  notifyOnPending: boolean;
  notifyOnApproved: boolean;
  notifyOnRejected: boolean;
  autoApproveAfterDays?: number;
}

export interface ApprovalRequest {
  id: string;
  workflowId: string;
  entityType: string;
  entityId: string;
  requester: string;
  currentStep: number;
  status: ApprovalStatus;
  approvals: ApprovalDecision[];
  comments: ApprovalComment[];
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  dueDate?: Date;
}

export interface ApprovalDecision {
  id: string;
  stepId: string;
  approverId: string;
  decision: 'approved' | 'rejected' | 'delegated';
  comments?: string;
  timestamp: Date;
  delegatedTo?: string;
}

export interface ApprovalComment {
  id: string;
  userId: string;
  comment: string;
  timestamp: Date;
  isPrivate: boolean;
}

export interface EscalationRule {
  id: string;
  name: string;
  description: string;
  trigger: EscalationTrigger;
  conditions: EscalationCondition[];
  actions: EscalationAction[];
  priority: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EscalationTrigger {
  type: 'time_based' | 'sla_breach' | 'manual' | 'condition_met';
  configuration: Record<string, any>;
}

export interface EscalationCondition {
  field: string;
  operator: string;
  value: any;
  timeFrame?: string;
}

export interface EscalationAction {
  type: 'notify' | 'reassign' | 'escalate_to_manager' | 'create_incident' | 'update_priority';
  configuration: Record<string, any>;
  delay?: number;
}

export interface NotificationRule {
  id: string;
  name: string;
  description: string;
  trigger: NotificationTrigger;
  conditions: NotificationCondition[];
  channels: NotificationChannel[];
  recipients: NotificationRecipient[];
  template: NotificationTemplate;
  frequency: NotificationFrequency;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationTrigger {
  type: 'event' | 'schedule' | 'threshold' | 'change';
  event?: string;
  schedule?: CronSchedule;
  threshold?: ThresholdConfig;
}

export interface NotificationCondition {
  field: string;
  operator: string;
  value: any;
}

export interface NotificationChannel {
  type: 'email' | 'sms' | 'slack' | 'teams' | 'webhook' | 'push' | 'in_app';
  configuration: Record<string, any>;
}

export interface NotificationRecipient {
  type: 'user' | 'role' | 'group' | 'dynamic';
  value: string;
  preferences?: NotificationPreferences;
}

export interface NotificationPreferences {
  channels: string[];
  quiet_hours?: { start: string; end: string };
  frequency?: 'immediate' | 'digest' | 'weekly';
}

export interface NotificationTemplate {
  subject: string;
  body: string;
  format: 'text' | 'html' | 'markdown';
  variables: string[];
}

export interface NotificationFrequency {
  type: 'immediate' | 'batched' | 'digest';
  interval?: number;
  maxPerInterval?: number;
}

export interface ThresholdConfig {
  metric: string;
  operator: string;
  value: number;
  timeWindow: string;
}

export type TriggerType = 'event' | 'schedule' | 'manual' | 'webhook' | 'condition';
export type ActionType =
  | 'assign'
  | 'update'
  | 'notify'
  | 'escalate'
  | 'create'
  | 'close'
  | 'comment'
  | 'script'
  | 'api_call'
  | 'delay';
export type ConditionOperator =
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'not_contains'
  | 'greater_than'
  | 'less_than'
  | 'in'
  | 'not_in'
  | 'regex'
  | 'exists'
  | 'not_exists';
export type ExecutionStatus =
  | 'pending'
  | 'running'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'timeout';
export type StepStatus = 'pending' | 'running' | 'completed' | 'failed' | 'skipped' | 'cancelled';
export type WorkflowCategory =
  | 'ticket_management'
  | 'sla_management'
  | 'asset_management'
  | 'incident_response'
  | 'change_management'
  | 'reporting'
  | 'custom';
export type BusinessRuleCategory =
  | 'validation'
  | 'calculation'
  | 'transformation'
  | 'routing'
  | 'approval'
  | 'compliance';
export type BusinessRuleType =
  | 'field_validation'
  | 'auto_assignment'
  | 'priority_calculation'
  | 'sla_calculation'
  | 'approval_routing'
  | 'data_transformation';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'expired';
