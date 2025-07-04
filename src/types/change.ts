// Change Management Types
export interface ChangeRequest {
  id: string;
  title: string;
  description: string;
  requesterId: string;
  requesterName: string;
  assignedTo?: string;
  assignedToName?: string;
  type: ChangeType;
  category: ChangeCategory;
  priority: ChangePriority;
  risk: ChangeRisk;
  status: ChangeStatus;
  approvalStatus: ApprovalStatus;
  implementationPlan: string;
  rollbackPlan: string;
  businessJustification: string;
  impactAssessment: ImpactAssessment;
  scheduledStartDate?: string;
  scheduledEndDate?: string;
  actualStartDate?: string;
  actualEndDate?: string;
  downtime?: number; // in minutes
  affectedSystems: string[];
  affectedUsers: number;
  testingPlan: string;
  communicationPlan: string;
  attachments: string[];
  approvals: ChangeApproval[];
  reviews: ChangeReview[];
  tasks: ChangeTask[];
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
  createdBy: string;
  updatedBy: string;
  changeCoordinator?: string;
  emergencyChange?: boolean;
  relatedIncidents?: string[];
  relatedProblems?: string[];
  kbArticles?: string[];
  parentChange?: string;
  subChanges?: string[];
  version: number;
  tags: string[];
  customFields: Record<string, any>;
}

export type ChangeType = 'standard' | 'normal' | 'emergency' | 'major' | 'minor' | 'preauthorized';

export type ChangeCategory =
  | 'infrastructure'
  | 'application'
  | 'security'
  | 'database'
  | 'network'
  | 'hardware'
  | 'software'
  | 'process'
  | 'documentation'
  | 'other';

export type ChangePriority = 'critical' | 'high' | 'medium' | 'low' | 'planning';

export type ChangeRisk = 'very-high' | 'high' | 'medium' | 'low' | 'very-low';

export type ChangeStatus =
  | 'draft'
  | 'submitted'
  | 'under-review'
  | 'approved'
  | 'rejected'
  | 'scheduled'
  | 'in-progress'
  | 'implemented'
  | 'completed'
  | 'cancelled'
  | 'failed'
  | 'rolled-back';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'expired';

export interface ImpactAssessment {
  businessImpact: 'high' | 'medium' | 'low' | 'none';
  technicalImpact: 'high' | 'medium' | 'low' | 'none';
  urgency: 'high' | 'medium' | 'low';
  complexity: 'high' | 'medium' | 'low';
  riskLevel: ChangeRisk;
  affectedServices: string[];
  affectedDepartments: string[];
  estimatedDowntime: number;
  recoverabilityTime: number;
  complianceRequired: boolean;
  securityImpact: boolean;
  thirdPartyInvolvement: boolean;
  backoutComplexity: 'high' | 'medium' | 'low';
  implementationWindow: string;
  notes: string;
}

export interface ChangeApproval {
  id: string;
  changeId: string;
  approverType: 'cab' | 'ecab' | 'technical' | 'business' | 'security' | 'compliance';
  approverId: string;
  approverName: string;
  approverRole: string;
  status: ApprovalStatus;
  requestedAt: string;
  approvedAt?: string;
  rejectedAt?: string;
  comments: string;
  conditions?: string[];
  sequence: number;
  required: boolean;
  notificationSent: boolean;
  remindersSent: number;
  delegatedTo?: string;
  delegatedToName?: string;
  expiresAt?: string;
  approvalCriteria?: string;
}

export interface ChangeReview {
  id: string;
  changeId: string;
  reviewType: 'peer' | 'technical' | 'security' | 'compliance' | 'post-implementation';
  reviewerId: string;
  reviewerName: string;
  reviewerRole: string;
  status: 'pending' | 'completed' | 'overdue';
  findings: string;
  recommendations: string[];
  riskAssessment: string;
  approvalRecommendation: 'approve' | 'reject' | 'approve-with-conditions';
  conditions?: string[];
  reviewedAt?: string;
  createdAt: string;
  priority: 'high' | 'medium' | 'low';
  estimatedHours: number;
  actualHours?: number;
  attachments: string[];
}

export interface ChangeTask {
  id: string;
  changeId: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedToName: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled' | 'failed';
  priority: 'high' | 'medium' | 'low';
  estimatedHours: number;
  actualHours?: number;
  startDate?: string;
  endDate?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  dependencies: string[];
  notes: string;
  attachments: string[];
  type: 'planning' | 'implementation' | 'testing' | 'documentation' | 'communication' | 'rollback';
  phase: 'pre-implementation' | 'implementation' | 'post-implementation';
  automated: boolean;
  script?: string;
  verificationCriteria: string[];
}

export interface ChangeCalendar {
  id: string;
  title: string;
  changeId: string;
  startDate: string;
  endDate: string;
  type: ChangeType;
  category: ChangeCategory;
  priority: ChangePriority;
  risk: ChangeRisk;
  status: ChangeStatus;
  assignedTo: string;
  assignedToName: string;
  conflictsWith: string[];
  blackoutPeriod: boolean;
  maintenanceWindow: string;
  approvalRequired: boolean;
  approved: boolean;
  color: string;
  recurring: boolean;
  recurrenceRule?: string;
  remindersSent: number;
}

export interface ChangeMetrics {
  totalChanges: number;
  pendingChanges: number;
  approvedChanges: number;
  rejectedChanges: number;
  implementedChanges: number;
  failedChanges: number;
  rolledBackChanges: number;
  successRate: number;
  averageImplementationTime: number;
  averageApprovalTime: number;
  changesByType: { [key in ChangeType]: number };
  changesByCategory: { [key in ChangeCategory]: number };
  changesByRisk: { [key in ChangeRisk]: number };
  emergencyChanges: number;
  unauthorizedChanges: number;
  changeVolume: Array<{
    date: string;
    count: number;
    successful: number;
    failed: number;
  }>;
  topChangeCategories: Array<{
    category: ChangeCategory;
    count: number;
    successRate: number;
  }>;
  avgTimeToImplement: number;
  avgTimeToApprove: number;
  cabMeetingScheduled: number;
  overdueChanges: number;
  upcomingChanges: number;
  changeFrequency: 'daily' | 'weekly' | 'monthly';
  riskDistribution: { [key in ChangeRisk]: number };
  complianceRate: number;
  rollbackRate: number;
}

export interface ChangeAdvisoryBoard {
  id: string;
  name: string;
  description: string;
  chairperson: string;
  chairpersonName: string;
  members: CABMember[];
  meetingSchedule: string;
  nextMeeting?: string;
  lastMeeting?: string;
  active: boolean;
  changeTypes: ChangeType[];
  riskLevels: ChangeRisk[];
  categories: ChangeCategory[];
  approvalThresholds: {
    riskLevel: ChangeRisk;
    businessImpact: string;
    requiredApprovals: number;
    timeLimit: number;
  }[];
  quorumRequired: number;
  votingRules: string;
  escalationProcedure: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface CABMember {
  id: string;
  userId: string;
  userName: string;
  email: string;
  role: string;
  department: string;
  expertise: string[];
  voteWeight: number;
  primary: boolean;
  backup?: string;
  backupName?: string;
  active: boolean;
  joinedAt: string;
  notificationPreferences: {
    email: boolean;
    sms: boolean;
    inApp: boolean;
  };
  availabilitySchedule: string;
  timeZone: string;
  lastActive?: string;
}

export interface ChangeTemplate {
  id: string;
  name: string;
  description: string;
  category: ChangeCategory;
  type: ChangeType;
  priority: ChangePriority;
  riskLevel: ChangeRisk;
  template: Partial<ChangeRequest>;
  approvalWorkflow: string[];
  requiredFields: string[];
  conditionalFields: Array<{
    field: string;
    condition: string;
    value: any;
    requiredFields: string[];
  }>;
  estimatedDuration: number;
  checklistItems: string[];
  documentationRequired: string[];
  testingRequired: boolean;
  rollbackProcedure: string;
  communicationTemplate: string;
  active: boolean;
  usage: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  version: number;
  tags: string[];
}

export interface ChangeBlackoutPeriod {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  type: 'business-critical' | 'maintenance' | 'compliance' | 'seasonal' | 'other';
  severity: 'complete' | 'partial' | 'advisory';
  affectedSystems: string[];
  affectedServices: string[];
  exceptions: string[];
  approver: string;
  approverName: string;
  createdAt: string;
  createdBy: string;
  active: boolean;
  recurring: boolean;
  recurrenceRule?: string;
  notificationSent: boolean;
  reminderScheduled: boolean;
}

export interface ChangeConflict {
  id: string;
  changeId1: string;
  changeId2: string;
  conflictType: 'resource' | 'system' | 'time' | 'dependency' | 'risk';
  severity: 'high' | 'medium' | 'low';
  description: string;
  resolution: string;
  resolvedAt?: string;
  resolvedBy?: string;
  status: 'identified' | 'under-review' | 'resolved' | 'accepted-risk';
  identifiedAt: string;
  identifiedBy: string;
  impact: string;
  recommendedAction: string;
  notes: string;
}

export interface ChangeNotification {
  id: string;
  changeId: string;
  type: 'approval-request' | 'status-update' | 'reminder' | 'escalation' | 'completion';
  recipient: string;
  recipientName: string;
  recipientType: 'user' | 'group' | 'role';
  channel: 'email' | 'sms' | 'in-app' | 'webhook';
  subject: string;
  message: string;
  sentAt?: string;
  deliveredAt?: string;
  readAt?: string;
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'read';
  priority: 'high' | 'medium' | 'low';
  scheduledFor?: string;
  attempts: number;
  lastAttempt?: string;
  errorMessage?: string;
  templateId?: string;
  variables: Record<string, any>;
}

export interface ChangeAuditLog {
  id: string;
  changeId: string;
  action: string;
  field?: string;
  oldValue?: any;
  newValue?: any;
  userId: string;
  userName: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
  details: string;
  category:
    | 'creation'
    | 'update'
    | 'approval'
    | 'rejection'
    | 'status-change'
    | 'assignment'
    | 'deletion';
  severity: 'low' | 'medium' | 'high';
  automated: boolean;
  source: 'web' | 'api' | 'system' | 'mobile';
  sessionId?: string;
  correlationId?: string;
}

// Search and Filter Types
export interface ChangeSearchCriteria {
  query?: string;
  type?: ChangeType[];
  category?: ChangeCategory[];
  priority?: ChangePriority[];
  risk?: ChangeRisk[];
  status?: ChangeStatus[];
  approvalStatus?: ApprovalStatus[];
  assignedTo?: string[];
  requester?: string[];
  dateRange?: {
    start: string;
    end: string;
    field: 'created' | 'scheduled' | 'completed';
  };
  affectedSystems?: string[];
  emergencyOnly?: boolean;
  tags?: string[];
  customFields?: Record<string, any>;
}

export interface ChangeListResponse {
  changes: ChangeRequest[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
}

export interface ChangeAnalytics {
  successRate: number;
  averageImplementationTime: number;
  averageApprovalTime: number;
  changesByMonth: Array<{
    month: string;
    total: number;
    successful: number;
    failed: number;
  }>;
  riskDistribution: Array<{
    risk: ChangeRisk;
    count: number;
    percentage: number;
  }>;
  categoryBreakdown: Array<{
    category: ChangeCategory;
    count: number;
    successRate: number;
  }>;
  approvalMetrics: {
    averageApprovalTime: number;
    approvalRate: number;
    timeoutRate: number;
    escalationRate: number;
  };
  implementationMetrics: {
    onTimeRate: number;
    averageOverrun: number;
    rollbackRate: number;
    failureRate: number;
  };
  trendsAndPatterns: {
    peakSubmissionTimes: string[];
    seasonalTrends: string[];
    recurringIssues: string[];
    improvementOpportunities: string[];
  };
}
