import {
  WorkflowRule,
  WorkflowExecution,
  WorkflowTemplate,
  WorkflowMetrics,
  AutomationRule,
  ExecutionStatus,
  TriggerType,
} from '../types/workflow';

class WorkflowService {
  private workflows: WorkflowRule[] = [];
  private executions: WorkflowExecution[] = [];
  private templates: WorkflowTemplate[] = [];
  private automationRules: AutomationRule[] = [];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Initialize mock workflow templates
    this.templates = [
      {
        id: 'template-1',
        name: 'Auto-Assignment Based on Category',
        description: 'Automatically assign tickets based on their category',
        category: 'ticket_management',
        tags: ['assignment', 'automation', 'routing'],
        version: '1.0.0',
        author: 'System',
        isBuiltIn: true,
        template: {
          name: 'Auto-Assignment - {{category}}',
          trigger: {
            type: 'event',
            event: 'ticket.created',
            configuration: {},
          },
          conditions: [
            {
              id: 'cond-1',
              type: 'field',
              field: 'category',
              operator: 'equals',
              value: '{{category}}',
              logicalOperator: 'AND',
            },
          ],
          actions: [
            {
              id: 'action-1',
              type: 'assign',
              configuration: {
                assignTo: '{{assignee}}',
                addComment: true,
                comment: 'Auto-assigned based on category: {{category}}',
              },
              delay: 0,
              continueOnError: true,
              retryCount: 3,
              retryDelay: 30,
            },
          ],
        },
        parameters: [
          {
            name: 'category',
            type: 'select',
            required: true,
            options: [
              { value: 'hardware', label: 'Hardware' },
              { value: 'software', label: 'Software' },
              { value: 'network', label: 'Network' },
              { value: 'security', label: 'Security' },
            ],
            description: 'The ticket category to match',
          },
          {
            name: 'assignee',
            type: 'select',
            required: true,
            options: [
              { value: 'user-1', label: 'John Doe (Hardware Specialist)' },
              { value: 'user-2', label: 'Jane Smith (Software Engineer)' },
              { value: 'user-3', label: 'Bob Johnson (Network Admin)' },
            ],
            description: 'The user to assign tickets to',
          },
        ],
      },
      {
        id: 'template-2',
        name: 'Priority Escalation',
        description: 'Escalate tickets based on priority and age',
        category: 'ticket_management',
        tags: ['escalation', 'priority', 'sla'],
        version: '1.0.0',
        author: 'System',
        isBuiltIn: true,
        template: {
          name: 'Priority Escalation - {{priority}}',
          trigger: {
            type: 'schedule',
            event: 'schedule.cron',
            schedule: {
              expression: '0 */30 * * * *', // Every 30 minutes
              timezone: 'UTC',
              enabled: true,
            },
            configuration: {},
          },
          conditions: [
            {
              id: 'cond-1',
              type: 'field',
              field: 'priority',
              operator: 'equals',
              value: '{{priority}}',
              logicalOperator: 'AND',
            },
            {
              id: 'cond-2',
              type: 'field',
              field: 'status',
              operator: 'not_equals',
              value: 'resolved',
              logicalOperator: 'AND',
            },
            {
              id: 'cond-3',
              type: 'time',
              field: 'createdAt',
              operator: 'greater_than',
              value: '{{escalationTime}}',
              logicalOperator: 'AND',
            },
          ],
          actions: [
            {
              id: 'action-1',
              type: 'escalate',
              configuration: {
                escalateTo: '{{manager}}',
                addComment: true,
                comment: 'Escalated due to priority and age',
              },
              delay: 0,
              continueOnError: true,
              retryCount: 2,
              retryDelay: 60,
            },
          ],
        },
        parameters: [
          {
            name: 'priority',
            type: 'select',
            required: true,
            options: [
              { value: 'Critical', label: 'Critical' },
              { value: 'High', label: 'High' },
              { value: 'Medium', label: 'Medium' },
            ],
            description: 'The priority level to escalate',
          },
          {
            name: 'escalationTime',
            type: 'select',
            required: true,
            options: [
              { value: '1h', label: '1 Hour' },
              { value: '2h', label: '2 Hours' },
              { value: '4h', label: '4 Hours' },
              { value: '8h', label: '8 Hours' },
            ],
            description: 'Time after which to escalate',
          },
          {
            name: 'manager',
            type: 'select',
            required: true,
            options: [
              { value: 'manager-1', label: 'IT Manager' },
              { value: 'manager-2', label: 'Operations Manager' },
            ],
            description: 'Manager to escalate to',
          },
        ],
      },
      {
        id: 'template-3',
        name: 'SLA Breach Notification',
        description: 'Send notifications when SLA is about to be breached',
        category: 'sla_management',
        tags: ['sla', 'notification', 'warning'],
        version: '1.0.0',
        author: 'System',
        isBuiltIn: true,
        template: {
          name: 'SLA Breach Notification',
          trigger: {
            type: 'event',
            event: 'sla.warning',
            configuration: {},
          },
          conditions: [
            {
              id: 'cond-1',
              type: 'field',
              field: 'sla.timeRemaining',
              operator: 'less_than',
              value: '{{warningThreshold}}',
              logicalOperator: 'AND',
            },
          ],
          actions: [
            {
              id: 'action-1',
              type: 'notify',
              configuration: {
                channels: ['email', 'slack'],
                recipients: ['assignee', 'manager'],
                template: 'sla_warning',
                urgency: 'high',
              },
              delay: 0,
              continueOnError: true,
              retryCount: 3,
              retryDelay: 60,
            },
          ],
        },
        parameters: [
          {
            name: 'warningThreshold',
            type: 'select',
            required: true,
            options: [
              { value: '30', label: '30 minutes' },
              { value: '60', label: '1 hour' },
              { value: '120', label: '2 hours' },
            ],
            description: 'Warning threshold in minutes',
          },
        ],
      },
    ];

    // Initialize mock workflows
    this.workflows = [
      {
        id: 'workflow-1',
        name: 'Critical Ticket Auto-Assignment',
        description: 'Automatically assign critical tickets to senior engineers',
        isActive: true,
        trigger: {
          type: 'event',
          event: 'ticket.created',
          configuration: {},
        },
        conditions: [
          {
            id: 'cond-1',
            type: 'field',
            field: 'priority',
            operator: 'equals',
            value: 'Critical',
            logicalOperator: 'AND',
          },
        ],
        actions: [
          {
            id: 'action-1',
            type: 'assign',
            configuration: {
              assignTo: 'senior-engineer-pool',
              addComment: true,
              comment: 'Auto-assigned critical ticket to senior engineer',
            },
            delay: 0,
            continueOnError: true,
            retryCount: 3,
            retryDelay: 30,
          },
          {
            id: 'action-2',
            type: 'notify',
            configuration: {
              channels: ['email', 'sms'],
              recipients: ['assignee', 'manager'],
              template: 'critical_ticket_assigned',
            },
            delay: 0,
            continueOnError: true,
            retryCount: 2,
            retryDelay: 60,
          },
        ],
        priority: 1,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        createdBy: 'admin',
        updatedBy: 'admin',
        executionCount: 45,
        lastExecuted: new Date('2024-01-15T14:30:00Z'),
        category: 'ticket_management',
        tags: ['critical', 'assignment', 'notification'],
      },
      {
        id: 'workflow-2',
        name: 'Daily SLA Report',
        description: 'Generate and send daily SLA compliance report',
        isActive: true,
        trigger: {
          type: 'schedule',
          event: 'schedule.cron',
          schedule: {
            expression: '0 9 * * *', // Daily at 9 AM
            timezone: 'UTC',
            enabled: true,
            nextExecution: new Date('2024-01-16T09:00:00Z'),
          },
          configuration: {},
        },
        conditions: [],
        actions: [
          {
            id: 'action-1',
            type: 'script',
            configuration: {
              script: 'generateSLAReport',
              parameters: {
                reportType: 'daily',
                includeBreaches: true,
                includeMetrics: true,
              },
            },
            delay: 0,
            continueOnError: false,
            retryCount: 2,
            retryDelay: 300,
          },
          {
            id: 'action-2',
            type: 'notify',
            configuration: {
              channels: ['email'],
              recipients: ['management', 'sla-team'],
              template: 'daily_sla_report',
              attachments: ['sla_report.pdf'],
            },
            delay: 60,
            continueOnError: true,
            retryCount: 3,
            retryDelay: 120,
          },
        ],
        priority: 2,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        createdBy: 'admin',
        updatedBy: 'admin',
        executionCount: 15,
        lastExecuted: new Date('2024-01-15T09:00:00Z'),
        category: 'reporting',
        tags: ['sla', 'report', 'daily'],
      },
    ];

    // Initialize mock executions
    this.executions = [
      {
        id: 'exec-1',
        workflowId: 'workflow-1',
        triggeredBy: 'system',
        startTime: new Date('2024-01-15T14:30:00Z'),
        endTime: new Date('2024-01-15T14:30:15Z'),
        status: 'completed',
        context: {
          ticketId: 'ticket-123',
          priority: 'Critical',
          category: 'Hardware',
        },
        steps: [
          {
            id: 'step-1',
            actionId: 'action-1',
            name: 'Assign Ticket',
            status: 'completed',
            startTime: new Date('2024-01-15T14:30:00Z'),
            endTime: new Date('2024-01-15T14:30:05Z'),
            duration: 5000,
            result: { assignedTo: 'user-123', success: true },
            retryCount: 0,
          },
          {
            id: 'step-2',
            actionId: 'action-2',
            name: 'Send Notification',
            status: 'completed',
            startTime: new Date('2024-01-15T14:30:05Z'),
            endTime: new Date('2024-01-15T14:30:15Z'),
            duration: 10000,
            result: { emailSent: true, smsSent: true },
            retryCount: 0,
          },
        ],
        errors: [],
        logs: [
          {
            id: 'log-1',
            level: 'info',
            message: 'Workflow execution started',
            timestamp: new Date('2024-01-15T14:30:00Z'),
          },
          {
            id: 'log-2',
            level: 'info',
            message: 'Ticket assigned successfully',
            timestamp: new Date('2024-01-15T14:30:05Z'),
          },
          {
            id: 'log-3',
            level: 'info',
            message: 'Notifications sent successfully',
            timestamp: new Date('2024-01-15T14:30:15Z'),
          },
        ],
        duration: 15000,
      },
    ];

    // Initialize mock automation rules
    this.automationRules = [
      {
        id: 'auto-1',
        name: 'Auto-Close Resolved Tickets',
        description: 'Automatically close tickets that have been resolved for 7 days',
        trigger: {
          type: 'schedule',
          configuration: {
            cron: '0 0 * * *', // Daily at midnight
            timezone: 'UTC',
          },
        },
        conditions: [
          {
            field: 'status',
            operator: 'equals',
            value: 'resolved',
            logicalOperator: 'AND',
          },
          {
            field: 'resolvedAt',
            operator: 'less_than',
            value: 'now-7d',
            logicalOperator: 'AND',
          },
        ],
        actions: [
          {
            type: 'update_field',
            configuration: {
              field: 'status',
              value: 'closed',
              addComment: true,
              comment: 'Auto-closed after 7 days in resolved state',
            },
          },
        ],
        isActive: true,
        priority: 5,
        scope: {
          type: 'global',
        },
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
    ];
  }

  // Workflow CRUD Operations
  getAllWorkflows(): WorkflowRule[] {
    return this.workflows;
  }

  getWorkflowById(id: string): WorkflowRule | null {
    return this.workflows.find((w) => w.id === id) || null;
  }

  createWorkflow(
    workflow: Omit<WorkflowRule, 'id' | 'createdAt' | 'updatedAt' | 'executionCount'>
  ): WorkflowRule {
    const newWorkflow: WorkflowRule = {
      ...workflow,
      id: `workflow-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      executionCount: 0,
    };
    this.workflows.push(newWorkflow);
    return newWorkflow;
  }

  updateWorkflow(id: string, updates: Partial<WorkflowRule>): WorkflowRule | null {
    const index = this.workflows.findIndex((w) => w.id === id);
    if (index === -1) return null;

    const updatedWorkflow = {
      ...this.workflows[index],
      ...updates,
      updatedAt: new Date(),
    };
    this.workflows[index] = updatedWorkflow;
    return updatedWorkflow;
  }

  deleteWorkflow(id: string): boolean {
    const index = this.workflows.findIndex((w) => w.id === id);
    if (index === -1) return false;

    this.workflows.splice(index, 1);
    return true;
  }

  // Workflow Execution
  executeWorkflow(workflowId: string, context: Record<string, any>): Promise<WorkflowExecution> {
    const workflow = this.getWorkflowById(workflowId);
    if (!workflow) {
      return Promise.reject(new Error('Workflow not found'));
    }

    return new Promise((resolve) => {
      const execution: WorkflowExecution = {
        id: `exec-${Date.now()}`,
        workflowId,
        triggeredBy: 'manual',
        startTime: new Date(),
        status: 'running',
        context,
        steps: [],
        errors: [],
        logs: [],
        duration: 0,
      };

      this.executions.push(execution);

      // Simulate workflow execution
      setTimeout(() => {
        execution.status = 'completed';
        execution.endTime = new Date();
        execution.duration = execution.endTime.getTime() - execution.startTime.getTime();

        // Update workflow execution count
        workflow.executionCount++;
        workflow.lastExecuted = new Date();

        resolve(execution);
      }, 2000);
    });
  }

  getWorkflowExecutions(workflowId?: string): WorkflowExecution[] {
    if (workflowId) {
      return this.executions.filter((e) => e.workflowId === workflowId);
    }
    return this.executions;
  }

  getExecutionById(id: string): WorkflowExecution | null {
    return this.executions.find((e) => e.id === id) || null;
  }

  // Workflow Templates
  getAllTemplates(): WorkflowTemplate[] {
    return this.templates;
  }

  getTemplateById(id: string): WorkflowTemplate | null {
    return this.templates.find((t) => t.id === id) || null;
  }

  createWorkflowFromTemplate(templateId: string, parameters: Record<string, any>): WorkflowRule {
    const template = this.getTemplateById(templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    // Replace template parameters with actual values
    const workflowData = this.replaceTemplateParameters(template.template, parameters);

    return this.createWorkflow({
      ...workflowData,
      name: workflowData.name || template.name,
      description: template.description,
      category: template.category,
      tags: template.tags,
      isActive: true,
      priority: 5,
      createdBy: 'current-user',
      updatedBy: 'current-user',
    } as Omit<WorkflowRule, 'id' | 'createdAt' | 'updatedAt' | 'executionCount'>);
  }

  private replaceTemplateParameters(template: any, parameters: Record<string, any>): any {
    const templateString = JSON.stringify(template);
    let replacedString = templateString;

    // Replace template variables like {{variable}}
    Object.entries(parameters).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      replacedString = replacedString.replace(regex, String(value));
    });

    return JSON.parse(replacedString);
  }

  // Workflow Metrics
  getWorkflowMetrics(): WorkflowMetrics {
    const totalWorkflows = this.workflows.length;
    const activeWorkflows = this.workflows.filter((w) => w.isActive).length;
    const totalExecutions = this.executions.length;
    const successfulExecutions = this.executions.filter((e) => e.status === 'completed').length;
    const failedExecutions = this.executions.filter((e) => e.status === 'failed').length;

    const averageExecutionTime =
      this.executions.reduce((sum, exec) => {
        return sum + (exec.duration || 0);
      }, 0) / Math.max(totalExecutions, 1);

    const executionsByStatus = this.executions.reduce(
      (acc, exec) => {
        acc[exec.status] = (acc[exec.status] || 0) + 1;
        return acc;
      },
      {} as Record<ExecutionStatus, number>
    );

    const executionsByTrigger = this.workflows.reduce(
      (acc, workflow) => {
        acc[workflow.trigger.type] = (acc[workflow.trigger.type] || 0) + workflow.executionCount;
        return acc;
      },
      {} as Record<TriggerType, number>
    );

    const topWorkflows = this.workflows
      .map((w) => ({
        workflowId: w.id,
        workflowName: w.name,
        executionCount: w.executionCount,
        successRate: 95, // Mock value
        averageTime: averageExecutionTime,
      }))
      .sort((a, b) => b.executionCount - a.executionCount)
      .slice(0, 10);

    return {
      totalWorkflows,
      activeWorkflows,
      totalExecutions,
      successfulExecutions,
      failedExecutions,
      averageExecutionTime,
      executionsByStatus,
      executionsByTrigger,
      topWorkflows,
      recentActivity: [], // Mock empty for now
    };
  }

  // Automation Rules
  getAllAutomationRules(): AutomationRule[] {
    return this.automationRules;
  }

  createAutomationRule(
    rule: Omit<AutomationRule, 'id' | 'createdAt' | 'updatedAt'>
  ): AutomationRule {
    const newRule: AutomationRule = {
      ...rule,
      id: `auto-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.automationRules.push(newRule);
    return newRule;
  }

  // Trigger Workflow
  triggerWorkflow(trigger: string, context: Record<string, any>): Promise<WorkflowExecution[]> {
    const matchingWorkflows = this.workflows.filter(
      (w) => w.isActive && w.trigger.event === trigger
    );

    const executions = matchingWorkflows.map((workflow) =>
      this.executeWorkflow(workflow.id, context)
    );

    return Promise.all(executions);
  }

  // Validation
  validateWorkflow(workflow: Partial<WorkflowRule>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!workflow.name) {
      errors.push('Workflow name is required');
    }

    if (!workflow.trigger) {
      errors.push('Workflow trigger is required');
    }

    if (!workflow.actions || workflow.actions.length === 0) {
      errors.push('At least one action is required');
    }

    // Validate trigger
    if (workflow.trigger) {
      if (!workflow.trigger.type) {
        errors.push('Trigger type is required');
      }
      if (workflow.trigger.type === 'schedule' && !workflow.trigger.schedule) {
        errors.push('Schedule configuration is required for scheduled triggers');
      }
    }

    // Validate actions
    if (workflow.actions) {
      workflow.actions.forEach((action, index) => {
        if (!action.type) {
          errors.push(`Action ${index + 1}: Type is required`);
        }
        if (!action.configuration) {
          errors.push(`Action ${index + 1}: Configuration is required`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

export const workflowService = new WorkflowService();
