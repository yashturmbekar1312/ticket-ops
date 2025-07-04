import {
  ChangeRequest,
  ChangeMetrics,
  ChangeTemplate,
  ChangeAdvisoryBoard,
  ChangeBlackoutPeriod,
  ChangeConflict,
  ChangeAuditLog,
  ChangeSearchCriteria,
  ChangeListResponse,
  ChangeAnalytics,
  ChangeType,
  ChangePriority,
  ChangeStatus,
  ApprovalStatus,
  ChangeApproval,
  ChangeCalendar,
} from '../types/change';

// Mock data for demonstration
const mockChanges: ChangeRequest[] = [
  {
    id: '1',
    title: 'Database Server Upgrade',
    description: 'Upgrade production database server to latest version',
    requesterId: 'user-1',
    requesterName: 'John Doe',
    assignedTo: 'admin-1',
    assignedToName: 'Admin User',
    type: 'normal',
    category: 'database',
    priority: 'high',
    risk: 'medium',
    status: 'approved',
    approvalStatus: 'approved',
    implementationPlan: 'Step-by-step upgrade procedure',
    rollbackPlan: 'Rollback to previous version if issues occur',
    businessJustification: 'Required for security updates and performance improvements',
    impactAssessment: {
      businessImpact: 'medium',
      technicalImpact: 'high',
      urgency: 'high',
      complexity: 'high',
      riskLevel: 'medium',
      affectedServices: ['customer-portal', 'reporting'],
      affectedDepartments: ['IT', 'Operations'],
      estimatedDowntime: 120,
      recoverabilityTime: 30,
      complianceRequired: true,
      securityImpact: true,
      thirdPartyInvolvement: false,
      backoutComplexity: 'medium',
      implementationWindow: '2AM-6AM',
      notes: 'Requires coordination with operations team',
    },
    scheduledStartDate: '2024-01-15T02:00:00Z',
    scheduledEndDate: '2024-01-15T06:00:00Z',
    downtime: 120,
    affectedSystems: ['db-prod-01', 'db-prod-02'],
    affectedUsers: 1000,
    testingPlan: 'Comprehensive testing in staging environment',
    communicationPlan: 'Email notifications 48 hours before',
    attachments: ['upgrade-plan.pdf', 'rollback-procedure.pdf'],
    approvals: [],
    reviews: [],
    tasks: [],
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z',
    createdBy: 'user-1',
    updatedBy: 'admin-1',
    changeCoordinator: 'coordinator-1',
    emergencyChange: false,
    relatedIncidents: ['INC-001'],
    relatedProblems: ['PRB-001'],
    kbArticles: ['KB-001'],
    version: 1,
    tags: ['database', 'upgrade', 'security'],
    customFields: {},
  },
  {
    id: '2',
    title: 'Network Security Patch',
    description: 'Apply critical security patches to firewall devices',
    requesterId: 'user-2',
    requesterName: 'Jane Smith',
    assignedTo: 'admin-2',
    assignedToName: 'Network Admin',
    type: 'emergency',
    category: 'security',
    priority: 'critical',
    risk: 'low',
    status: 'completed',
    approvalStatus: 'approved',
    implementationPlan: 'Apply patches during maintenance window',
    rollbackPlan: 'Restore from backup configuration',
    businessJustification: 'Critical security vulnerability remediation',
    impactAssessment: {
      businessImpact: 'low',
      technicalImpact: 'medium',
      urgency: 'high',
      complexity: 'low',
      riskLevel: 'low',
      affectedServices: ['network-security'],
      affectedDepartments: ['IT'],
      estimatedDowntime: 15,
      recoverabilityTime: 5,
      complianceRequired: true,
      securityImpact: true,
      thirdPartyInvolvement: false,
      backoutComplexity: 'low',
      implementationWindow: '1AM-3AM',
      notes: 'Emergency patch for CVE-2024-001',
    },
    scheduledStartDate: '2024-01-02T01:00:00Z',
    scheduledEndDate: '2024-01-02T03:00:00Z',
    actualStartDate: '2024-01-02T01:00:00Z',
    actualEndDate: '2024-01-02T01:30:00Z',
    downtime: 15,
    affectedSystems: ['fw-01', 'fw-02'],
    affectedUsers: 0,
    testingPlan: 'Automated security testing',
    communicationPlan: 'Immediate notification to security team',
    attachments: ['security-patch.pdf'],
    approvals: [],
    reviews: [],
    tasks: [],
    createdAt: '2024-01-01T20:00:00Z',
    updatedAt: '2024-01-02T02:00:00Z',
    closedAt: '2024-01-02T02:00:00Z',
    createdBy: 'user-2',
    updatedBy: 'admin-2',
    changeCoordinator: 'coordinator-2',
    emergencyChange: true,
    version: 1,
    tags: ['security', 'patch', 'emergency'],
    customFields: {},
  },
];

const mockTemplates: ChangeTemplate[] = [
  {
    id: 'template-1',
    name: 'Database Upgrade Template',
    description: 'Standard template for database upgrade changes',
    category: 'database',
    type: 'normal',
    priority: 'medium',
    riskLevel: 'medium',
    template: {
      implementationPlan: 'Standard database upgrade procedure',
      rollbackPlan: 'Standard rollback procedure',
      testingPlan: 'Standard testing checklist',
    },
    approvalWorkflow: ['technical-lead', 'dba-lead', 'cab'],
    requiredFields: ['implementationPlan', 'rollbackPlan', 'testingPlan'],
    conditionalFields: [],
    estimatedDuration: 240,
    checklistItems: ['Backup verification', 'Testing completion', 'Documentation update'],
    documentationRequired: ['Implementation plan', 'Rollback plan', 'Test results'],
    testingRequired: true,
    rollbackProcedure: 'Restore from backup',
    communicationTemplate: 'Database maintenance notification',
    active: true,
    usage: 15,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    createdBy: 'admin-1',
    updatedBy: 'admin-1',
    version: 1,
    tags: ['database', 'upgrade'],
  },
];

const mockCAB: ChangeAdvisoryBoard = {
  id: 'cab-1',
  name: 'IT Change Advisory Board',
  description: 'Primary CAB for IT infrastructure changes',
  chairperson: 'cab-chair-1',
  chairpersonName: 'CAB Chairperson',
  members: [
    {
      id: 'member-1',
      userId: 'user-1',
      userName: 'John Doe',
      email: 'john@example.com',
      role: 'IT Manager',
      department: 'IT',
      expertise: ['infrastructure', 'security'],
      voteWeight: 1,
      primary: true,
      active: true,
      joinedAt: '2024-01-01T00:00:00Z',
      notificationPreferences: {
        email: true,
        sms: false,
        inApp: true,
      },
      availabilitySchedule: '9AM-5PM',
      timeZone: 'UTC',
    },
  ],
  meetingSchedule: 'Weekly Wednesdays 2PM',
  nextMeeting: '2024-01-17T14:00:00Z',
  lastMeeting: '2024-01-10T14:00:00Z',
  active: true,
  changeTypes: ['normal', 'major'],
  riskLevels: ['medium', 'high', 'very-high'],
  categories: ['infrastructure', 'application', 'security'],
  approvalThresholds: [
    {
      riskLevel: 'high',
      businessImpact: 'high',
      requiredApprovals: 3,
      timeLimit: 48,
    },
  ],
  quorumRequired: 3,
  votingRules: 'Simple majority',
  escalationProcedure: 'Escalate to CTO after 48 hours',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  createdBy: 'admin-1',
  updatedBy: 'admin-1',
};

class ChangeService {
  // Change CRUD Operations
  getAllChanges(): ChangeRequest[] {
    return mockChanges;
  }

  getChangeById(id: string): ChangeRequest | undefined {
    return mockChanges.find((change) => change.id === id);
  }

  createChange(change: Partial<ChangeRequest>): ChangeRequest {
    const newChange: ChangeRequest = {
      id: `change-${Date.now()}`,
      title: change.title || '',
      description: change.description || '',
      requesterId: change.requesterId || '',
      requesterName: change.requesterName || '',
      type: change.type || 'normal',
      category: change.category || 'other',
      priority: change.priority || 'medium',
      risk: change.risk || 'medium',
      status: 'draft',
      approvalStatus: 'pending',
      implementationPlan: change.implementationPlan || '',
      rollbackPlan: change.rollbackPlan || '',
      businessJustification: change.businessJustification || '',
      impactAssessment: change.impactAssessment || {
        businessImpact: 'medium',
        technicalImpact: 'medium',
        urgency: 'medium',
        complexity: 'medium',
        riskLevel: 'medium',
        affectedServices: [],
        affectedDepartments: [],
        estimatedDowntime: 0,
        recoverabilityTime: 0,
        complianceRequired: false,
        securityImpact: false,
        thirdPartyInvolvement: false,
        backoutComplexity: 'low',
        implementationWindow: '',
        notes: '',
      },
      affectedSystems: change.affectedSystems || [],
      affectedUsers: change.affectedUsers || 0,
      testingPlan: change.testingPlan || '',
      communicationPlan: change.communicationPlan || '',
      attachments: change.attachments || [],
      approvals: [],
      reviews: [],
      tasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: change.createdBy || '',
      updatedBy: change.updatedBy || '',
      version: 1,
      tags: change.tags || [],
      customFields: change.customFields || {},
    };

    mockChanges.push(newChange);
    return newChange;
  }

  updateChange(id: string, updates: Partial<ChangeRequest>): ChangeRequest | undefined {
    const changeIndex = mockChanges.findIndex((change) => change.id === id);
    if (changeIndex === -1) return undefined;

    const updatedChange = {
      ...mockChanges[changeIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
      version: mockChanges[changeIndex].version + 1,
    };

    mockChanges[changeIndex] = updatedChange;
    return updatedChange;
  }

  deleteChange(id: string): boolean {
    const changeIndex = mockChanges.findIndex((change) => change.id === id);
    if (changeIndex === -1) return false;

    mockChanges.splice(changeIndex, 1);
    return true;
  }

  // Search and Filter
  searchChanges(criteria: ChangeSearchCriteria): ChangeListResponse {
    let filteredChanges = mockChanges;

    if (criteria.query) {
      const query = criteria.query.toLowerCase();
      filteredChanges = filteredChanges.filter(
        (change) =>
          change.title.toLowerCase().includes(query) ||
          change.description.toLowerCase().includes(query) ||
          change.id.toLowerCase().includes(query)
      );
    }

    if (criteria.status && criteria.status.length > 0) {
      filteredChanges = filteredChanges.filter((change) =>
        criteria.status!.includes(change.status)
      );
    }

    if (criteria.type && criteria.type.length > 0) {
      filteredChanges = filteredChanges.filter((change) => criteria.type!.includes(change.type));
    }

    if (criteria.category && criteria.category.length > 0) {
      filteredChanges = filteredChanges.filter((change) =>
        criteria.category!.includes(change.category)
      );
    }

    if (criteria.priority && criteria.priority.length > 0) {
      filteredChanges = filteredChanges.filter((change) =>
        criteria.priority!.includes(change.priority)
      );
    }

    if (criteria.risk && criteria.risk.length > 0) {
      filteredChanges = filteredChanges.filter((change) => criteria.risk!.includes(change.risk));
    }

    if (criteria.emergencyOnly) {
      filteredChanges = filteredChanges.filter((change) => change.emergencyChange);
    }

    return {
      changes: filteredChanges,
      total: filteredChanges.length,
      page: 1,
      pageSize: filteredChanges.length,
      totalPages: 1,
      hasMore: false,
    };
  }

  // Approval Management
  submitForApproval(changeId: string): boolean {
    const change = this.getChangeById(changeId);
    if (!change) return false;

    this.updateChange(changeId, {
      status: 'submitted',
      approvalStatus: 'pending',
    });

    return true;
  }

  approveChange(changeId: string, approverId: string, comments: string): boolean {
    const change = this.getChangeById(changeId);
    if (!change) return false;

    const approval: ChangeApproval = {
      id: `approval-${Date.now()}`,
      changeId,
      approverType: 'technical',
      approverId,
      approverName: 'Approver Name',
      approverRole: 'Technical Lead',
      status: 'approved',
      requestedAt: new Date().toISOString(),
      approvedAt: new Date().toISOString(),
      comments,
      sequence: 1,
      required: true,
      notificationSent: true,
      remindersSent: 0,
    };

    this.updateChange(changeId, {
      status: 'approved',
      approvalStatus: 'approved',
      approvals: [...change.approvals, approval],
    });

    return true;
  }

  rejectChange(changeId: string, approverId: string, comments: string): boolean {
    const change = this.getChangeById(changeId);
    if (!change) return false;

    const approval: ChangeApproval = {
      id: `approval-${Date.now()}`,
      changeId,
      approverType: 'technical',
      approverId,
      approverName: 'Approver Name',
      approverRole: 'Technical Lead',
      status: 'rejected',
      requestedAt: new Date().toISOString(),
      rejectedAt: new Date().toISOString(),
      comments,
      sequence: 1,
      required: true,
      notificationSent: true,
      remindersSent: 0,
    };

    this.updateChange(changeId, {
      status: 'rejected',
      approvalStatus: 'rejected',
      approvals: [...change.approvals, approval],
    });

    return true;
  }

  // Implementation Management
  startImplementation(changeId: string): boolean {
    const change = this.getChangeById(changeId);
    if (!change || change.status !== 'approved') return false;

    this.updateChange(changeId, {
      status: 'in-progress',
      actualStartDate: new Date().toISOString(),
    });

    return true;
  }

  completeImplementation(changeId: string, success: boolean): boolean {
    const change = this.getChangeById(changeId);
    if (!change || change.status !== 'in-progress') return false;

    this.updateChange(changeId, {
      status: success ? 'completed' : 'failed',
      actualEndDate: new Date().toISOString(),
      closedAt: success ? new Date().toISOString() : undefined,
    });

    return true;
  }

  // Calendar Management
  getChangeCalendar(_startDate: string, _endDate: string): ChangeCalendar[] {
    return mockChanges
      .filter((change) => change.scheduledStartDate && change.scheduledEndDate)
      .map((change) => ({
        id: change.id,
        title: change.title,
        changeId: change.id,
        startDate: change.scheduledStartDate!,
        endDate: change.scheduledEndDate!,
        type: change.type,
        category: change.category,
        priority: change.priority,
        risk: change.risk,
        status: change.status,
        assignedTo: change.assignedTo || '',
        assignedToName: change.assignedToName || '',
        conflictsWith: [],
        blackoutPeriod: false,
        maintenanceWindow: change.impactAssessment.implementationWindow,
        approvalRequired: true,
        approved: change.approvalStatus === 'approved',
        color: this.getChangeColor(change.type, change.priority),
        recurring: false,
        remindersSent: 0,
      }));
  }

  private getChangeColor(type: ChangeType, priority: ChangePriority): string {
    if (type === 'emergency') return '#f44336';
    if (priority === 'critical') return '#ff5722';
    if (priority === 'high') return '#ff9800';
    if (priority === 'medium') return '#2196f3';
    return '#4caf50';
  }

  // Conflict Detection
  detectConflicts(changeId: string): ChangeConflict[] {
    const change = this.getChangeById(changeId);
    if (!change) return [];

    const conflicts: ChangeConflict[] = [];

    // Check for overlapping changes on same systems
    const overlappingChanges = mockChanges.filter(
      (otherChange) =>
        otherChange.id !== changeId &&
        otherChange.affectedSystems.some((system) => change.affectedSystems.includes(system)) &&
        this.isDateOverlap(change, otherChange)
    );

    overlappingChanges.forEach((otherChange) => {
      conflicts.push({
        id: `conflict-${Date.now()}-${Math.random()}`,
        changeId1: changeId,
        changeId2: otherChange.id,
        conflictType: 'system',
        severity: 'high',
        description: `Changes affect the same systems: ${change.affectedSystems.join(', ')}`,
        resolution: 'Reschedule one of the changes',
        status: 'identified',
        identifiedAt: new Date().toISOString(),
        identifiedBy: 'system',
        impact: 'Potential service disruption',
        recommendedAction: 'Coordinate with other change owners',
        notes: 'Automatic conflict detection',
      });
    });

    return conflicts;
  }

  private isDateOverlap(change1: ChangeRequest, change2: ChangeRequest): boolean {
    if (
      !change1.scheduledStartDate ||
      !change1.scheduledEndDate ||
      !change2.scheduledStartDate ||
      !change2.scheduledEndDate
    ) {
      return false;
    }

    const start1 = new Date(change1.scheduledStartDate);
    const end1 = new Date(change1.scheduledEndDate);
    const start2 = new Date(change2.scheduledStartDate);
    const end2 = new Date(change2.scheduledEndDate);

    return start1 < end2 && start2 < end1;
  }

  // Templates
  getAllTemplates(): ChangeTemplate[] {
    return mockTemplates;
  }

  getTemplateById(id: string): ChangeTemplate | undefined {
    return mockTemplates.find((template) => template.id === id);
  }

  createChangeFromTemplate(
    templateId: string,
    customData: Partial<ChangeRequest>
  ): ChangeRequest | undefined {
    const template = this.getTemplateById(templateId);
    if (!template) return undefined;

    const changeData = {
      ...template.template,
      ...customData,
      type: template.type,
      category: template.category,
      priority: template.priority,
      risk: template.riskLevel,
    };

    return this.createChange(changeData);
  }

  // Change Advisory Board
  getCAB(): ChangeAdvisoryBoard {
    return mockCAB;
  }

  scheduleCABMeeting(date: string): boolean {
    mockCAB.nextMeeting = date;
    return true;
  }

  // Metrics and Analytics
  getChangeMetrics(): ChangeMetrics {
    const totalChanges = mockChanges.length;
    const pendingChanges = mockChanges.filter(
      (c) => c.status === 'submitted' || c.status === 'under-review'
    ).length;
    const approvedChanges = mockChanges.filter((c) => c.approvalStatus === 'approved').length;
    const rejectedChanges = mockChanges.filter((c) => c.approvalStatus === 'rejected').length;
    const implementedChanges = mockChanges.filter((c) => c.status === 'completed').length;
    const failedChanges = mockChanges.filter((c) => c.status === 'failed').length;
    const rolledBackChanges = mockChanges.filter((c) => c.status === 'rolled-back').length;

    return {
      totalChanges,
      pendingChanges,
      approvedChanges,
      rejectedChanges,
      implementedChanges,
      failedChanges,
      rolledBackChanges,
      successRate: totalChanges > 0 ? (implementedChanges / totalChanges) * 100 : 0,
      averageImplementationTime: 240, // minutes
      averageApprovalTime: 48, // hours
      changesByType: {
        standard: mockChanges.filter((c) => c.type === 'standard').length,
        normal: mockChanges.filter((c) => c.type === 'normal').length,
        emergency: mockChanges.filter((c) => c.type === 'emergency').length,
        major: mockChanges.filter((c) => c.type === 'major').length,
        minor: mockChanges.filter((c) => c.type === 'minor').length,
        preauthorized: mockChanges.filter((c) => c.type === 'preauthorized').length,
      },
      changesByCategory: {
        infrastructure: mockChanges.filter((c) => c.category === 'infrastructure').length,
        application: mockChanges.filter((c) => c.category === 'application').length,
        security: mockChanges.filter((c) => c.category === 'security').length,
        database: mockChanges.filter((c) => c.category === 'database').length,
        network: mockChanges.filter((c) => c.category === 'network').length,
        hardware: mockChanges.filter((c) => c.category === 'hardware').length,
        software: mockChanges.filter((c) => c.category === 'software').length,
        process: mockChanges.filter((c) => c.category === 'process').length,
        documentation: mockChanges.filter((c) => c.category === 'documentation').length,
        other: mockChanges.filter((c) => c.category === 'other').length,
      },
      changesByRisk: {
        'very-high': mockChanges.filter((c) => c.risk === 'very-high').length,
        high: mockChanges.filter((c) => c.risk === 'high').length,
        medium: mockChanges.filter((c) => c.risk === 'medium').length,
        low: mockChanges.filter((c) => c.risk === 'low').length,
        'very-low': mockChanges.filter((c) => c.risk === 'very-low').length,
      },
      emergencyChanges: mockChanges.filter((c) => c.emergencyChange).length,
      unauthorizedChanges: 0,
      changeVolume: [
        { date: '2024-01-01', count: 2, successful: 1, failed: 0 },
        { date: '2024-01-02', count: 1, successful: 1, failed: 0 },
        { date: '2024-01-03', count: 0, successful: 0, failed: 0 },
      ],
      topChangeCategories: [
        { category: 'database', count: 1, successRate: 100 },
        { category: 'security', count: 1, successRate: 100 },
      ],
      avgTimeToImplement: 240,
      avgTimeToApprove: 48,
      cabMeetingScheduled: 1,
      overdueChanges: 0,
      upcomingChanges: 1,
      changeFrequency: 'weekly',
      riskDistribution: {
        'very-high': 0,
        high: 0,
        medium: 2,
        low: 0,
        'very-low': 0,
      },
      complianceRate: 100,
      rollbackRate: 0,
    };
  }

  getChangeAnalytics(): ChangeAnalytics {
    const metrics = this.getChangeMetrics();

    return {
      successRate: metrics.successRate,
      averageImplementationTime: metrics.averageImplementationTime,
      averageApprovalTime: metrics.averageApprovalTime,
      changesByMonth: [
        { month: '2024-01', total: 2, successful: 2, failed: 0 },
        { month: '2024-02', total: 0, successful: 0, failed: 0 },
        { month: '2024-03', total: 0, successful: 0, failed: 0 },
      ],
      riskDistribution: [
        { risk: 'very-high', count: 0, percentage: 0 },
        { risk: 'high', count: 0, percentage: 0 },
        { risk: 'medium', count: 2, percentage: 100 },
        { risk: 'low', count: 0, percentage: 0 },
        { risk: 'very-low', count: 0, percentage: 0 },
      ],
      categoryBreakdown: [
        { category: 'database', count: 1, successRate: 100 },
        { category: 'security', count: 1, successRate: 100 },
      ],
      approvalMetrics: {
        averageApprovalTime: 48,
        approvalRate: 100,
        timeoutRate: 0,
        escalationRate: 0,
      },
      implementationMetrics: {
        onTimeRate: 100,
        averageOverrun: 0,
        rollbackRate: 0,
        failureRate: 0,
      },
      trendsAndPatterns: {
        peakSubmissionTimes: ['Monday 9AM', 'Friday 3PM'],
        seasonalTrends: ['Q4 freeze periods'],
        recurringIssues: ['Database performance'],
        improvementOpportunities: ['Automation opportunities', 'Template standardization'],
      },
    };
  }

  // Audit and Compliance
  getAuditLog(changeId: string): ChangeAuditLog[] {
    return [
      {
        id: 'audit-1',
        changeId,
        action: 'Created',
        userId: 'user-1',
        userName: 'John Doe',
        timestamp: new Date().toISOString(),
        details: 'Change request created',
        category: 'creation',
        severity: 'low',
        automated: false,
        source: 'web',
      },
    ];
  }

  // Blackout Periods
  getBlackoutPeriods(): ChangeBlackoutPeriod[] {
    return [
      {
        id: 'blackout-1',
        name: 'Year-end Freeze',
        description: 'Annual year-end change freeze',
        startDate: '2024-12-20T00:00:00Z',
        endDate: '2025-01-05T00:00:00Z',
        type: 'business-critical',
        severity: 'complete',
        affectedSystems: ['all'],
        affectedServices: ['all'],
        exceptions: ['emergency'],
        approver: 'cto-1',
        approverName: 'CTO',
        createdAt: '2024-01-01T00:00:00Z',
        createdBy: 'admin-1',
        active: true,
        recurring: true,
        recurrenceRule: 'YEARLY',
        notificationSent: true,
        reminderScheduled: true,
      },
    ];
  }

  // Utility Methods
  validateChange(change: Partial<ChangeRequest>): string[] {
    const errors: string[] = [];

    if (!change.title || change.title.trim() === '') {
      errors.push('Title is required');
    }

    if (!change.description || change.description.trim() === '') {
      errors.push('Description is required');
    }

    if (!change.implementationPlan || change.implementationPlan.trim() === '') {
      errors.push('Implementation plan is required');
    }

    if (!change.rollbackPlan || change.rollbackPlan.trim() === '') {
      errors.push('Rollback plan is required');
    }

    if (!change.businessJustification || change.businessJustification.trim() === '') {
      errors.push('Business justification is required');
    }

    return errors;
  }

  getChangeHistory(changeId: string): ChangeRequest[] {
    // In a real system, this would return version history
    const change = this.getChangeById(changeId);
    return change ? [change] : [];
  }

  cloneChange(changeId: string): ChangeRequest | undefined {
    const originalChange = this.getChangeById(changeId);
    if (!originalChange) return undefined;

    const clonedChange = {
      ...originalChange,
      id: undefined,
      title: `Copy of ${originalChange.title}`,
      status: 'draft' as ChangeStatus,
      approvalStatus: 'pending' as ApprovalStatus,
      approvals: [],
      reviews: [],
      tasks: [],
      createdAt: undefined,
      updatedAt: undefined,
      closedAt: undefined,
      actualStartDate: undefined,
      actualEndDate: undefined,
      version: 1,
    };

    return this.createChange(clonedChange);
  }
}

export const changeService = new ChangeService();
