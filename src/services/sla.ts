// SLA Service - Service Level Agreement management
import {
  SLAPolicy,
  SLAMetrics,
  SLABreach,
  BusinessHours,
  SLAReport,
  EscalationRule,
} from '../types/sla';
import { Ticket } from '../types';

class SLAService {
  private slaRules: SLAPolicy[] = [
    {
      id: '1',
      name: 'Critical Priority SLA',
      description: 'SLA for critical priority tickets',
      priority: 'Critical',
      responseTime: 15, // 15 minutes
      resolutionTime: 240, // 4 hours
      businessHours: {
        enabled: true,
        timezone: 'America/New_York',
        workingDays: [1, 2, 3, 4, 5], // Monday to Friday
        startTime: '09:00',
        endTime: '17:00',
        holidays: ['2024-12-25', '2024-01-01'],
      },
      escalationRules: [
        {
          id: '1',
          level: 1,
          triggerAfter: 30,
          action: 'assign',
          targetUsers: ['manager1'],
          targetGroups: ['escalation-team'],
          isActive: true,
        },
      ],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'High Priority SLA',
      description: 'SLA for high priority tickets',
      priority: 'High',
      responseTime: 60, // 1 hour
      resolutionTime: 480, // 8 hours
      businessHours: {
        enabled: true,
        timezone: 'America/New_York',
        workingDays: [1, 2, 3, 4, 5],
        startTime: '09:00',
        endTime: '17:00',
        holidays: ['2024-12-25', '2024-01-01'],
      },
      escalationRules: [
        {
          id: '2',
          level: 1,
          triggerAfter: 120,
          action: 'priority_change',
          targetUsers: [],
          targetGroups: [],
          newPriority: 'Critical',
          isActive: true,
        },
      ],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  private slaBreaches: SLABreach[] = [];

  // Get applicable SLA policy for a ticket
  getSLAPolicy(ticket: Ticket): SLAPolicy | null {
    return (
      this.slaRules.find(
        (rule) =>
          rule.isActive &&
          rule.priority === ticket.priority &&
          (!rule.category || rule.category === ticket.category) &&
          (!rule.department || rule.department === ticket.department)
      ) || null
    );
  }

  // Calculate SLA metrics for a ticket
  calculateSLAMetrics(ticket: Ticket): SLAMetrics | null {
    const policy = this.getSLAPolicy(ticket);
    if (!policy) return null;

    const now = new Date();
    const createdAt = new Date(ticket.createdAt);
    const businessHours = this.calculateBusinessHours(createdAt, now, policy.businessHours);

    const responseTarget = policy.responseTime;
    const resolutionTarget = policy.resolutionTime;

    // Calculate actual response time (if first response exists)
    let responseActual: number | undefined;
    let responseBreached = false;

    // In a real system, you would check for first response from comments/activity
    // For now, we'll simulate based on status
    if (ticket.status !== 'New' && ticket.status !== 'Open') {
      responseActual = Math.floor(Math.random() * responseTarget * 2); // Mock response time
      responseBreached = responseActual > responseTarget;
    }

    // Calculate resolution time
    let resolutionActual: number | undefined;
    let resolutionBreached = false;

    if (ticket.status === 'Resolved' || ticket.status === 'Closed') {
      resolutionActual = businessHours.totalBusinessHours;
      resolutionBreached = resolutionActual > resolutionTarget;
    }

    const totalElapsed = businessHours.totalBusinessHours;
    const timeRemaining = Math.max(0, resolutionTarget - totalElapsed);

    let status: 'on_track' | 'at_risk' | 'breached' = 'on_track';
    if (resolutionBreached || responseBreached) {
      status = 'breached';
    } else if (timeRemaining < resolutionTarget * 0.2) {
      status = 'at_risk';
    }

    return {
      ticketId: ticket.id,
      slaPolicy: policy,
      responseTarget,
      responseActual,
      responseBreached,
      resolutionTarget,
      resolutionActual,
      resolutionBreached,
      status,
      timeRemaining,
      escalationLevel: ticket.escalationLevel,
      createdAt: ticket.createdAt,
      updatedAt: new Date().toISOString(),
    };
  }

  // Calculate business hours between two dates
  calculateBusinessHours(
    start: Date,
    end: Date,
    config: SLAPolicy['businessHours']
  ): BusinessHours {
    if (!config.enabled) {
      const totalHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      return {
        isBusinessHours: true,
        totalBusinessHours: totalHours,
        businessHoursRemaining: Math.max(0, totalHours),
      };
    }

    let totalBusinessHours = 0;
    let current = new Date(start);

    while (current < end) {
      const dayOfWeek = current.getDay();
      const isWorkingDay = config.workingDays.includes(dayOfWeek);
      const isHoliday = config.holidays.includes(current.toISOString().split('T')[0]);

      if (isWorkingDay && !isHoliday) {
        const startTime = new Date(current);
        const [startHour, startMinute] = config.startTime.split(':').map(Number);
        startTime.setHours(startHour, startMinute, 0, 0);

        const endTime = new Date(current);
        const [endHour, endMinute] = config.endTime.split(':').map(Number);
        endTime.setHours(endHour, endMinute, 0, 0);

        const workStart = current < startTime ? startTime : current;
        const workEnd = end < endTime ? end : endTime;

        if (workStart < workEnd) {
          totalBusinessHours += (workEnd.getTime() - workStart.getTime()) / (1000 * 60 * 60);
        }
      }

      current.setDate(current.getDate() + 1);
      current.setHours(0, 0, 0, 0);
    }

    const now = new Date();
    const isCurrentlyBusinessHours = this.isBusinessHours(now, config);

    return {
      isBusinessHours: isCurrentlyBusinessHours,
      totalBusinessHours,
      businessHoursRemaining: Math.max(0, totalBusinessHours),
    };
  }

  // Check if current time is within business hours
  isBusinessHours(date: Date, config: SLAPolicy['businessHours']): boolean {
    if (!config.enabled) return true;

    const dayOfWeek = date.getDay();
    const isWorkingDay = config.workingDays.includes(dayOfWeek);
    const isHoliday = config.holidays.includes(date.toISOString().split('T')[0]);

    if (!isWorkingDay || isHoliday) return false;

    const currentTime = date.getHours() * 60 + date.getMinutes();
    const [startHour, startMinute] = config.startTime.split(':').map(Number);
    const [endHour, endMinute] = config.endTime.split(':').map(Number);
    const startTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;

    return currentTime >= startTime && currentTime <= endTime;
  }

  // Check for SLA breaches and trigger escalations
  checkSLABreaches(tickets: Ticket[]): SLABreach[] {
    const breaches: SLABreach[] = [];

    tickets.forEach((ticket) => {
      const metrics = this.calculateSLAMetrics(ticket);
      if (!metrics) return;

      if (metrics.responseBreached || metrics.resolutionBreached) {
        const existingBreach = this.slaBreaches.find(
          (b) =>
            b.ticketId === ticket.id &&
            b.breachType === (metrics.responseBreached ? 'response' : 'resolution')
        );

        if (!existingBreach) {
          const breach: SLABreach = {
            id: Date.now().toString(),
            ticketId: ticket.id,
            slaPolicy: metrics.slaPolicy,
            breachType: metrics.responseBreached ? 'response' : 'resolution',
            breachTime: new Date().toISOString(),
            breachDuration: metrics.responseBreached
              ? metrics.responseActual! - metrics.responseTarget
              : metrics.resolutionActual! - metrics.resolutionTarget,
            isResolved: false,
            escalationLevel: ticket.escalationLevel,
            notificationsSent: [],
          };

          this.slaBreaches.push(breach);
          breaches.push(breach);
        }
      }
    });

    return breaches;
  }

  // Generate SLA compliance report
  generateSLAReport(startDate: string, endDate: string): SLAReport {
    // Mock implementation - in real system, this would query database
    const mockReport: SLAReport = {
      period: { start: startDate, end: endDate },
      overall: {
        totalTickets: 150,
        slaCompliant: 135,
        slaBreached: 15,
        complianceRate: 0.9,
        avgResponseTime: 45,
        avgResolutionTime: 320,
      },
      byPriority: {
        Critical: {
          totalTickets: 25,
          slaCompliant: 22,
          slaBreached: 3,
          complianceRate: 0.88,
          avgResponseTime: 12,
          avgResolutionTime: 180,
        },
        High: {
          totalTickets: 45,
          slaCompliant: 40,
          slaBreached: 5,
          complianceRate: 0.89,
          avgResponseTime: 35,
          avgResolutionTime: 280,
        },
        Medium: {
          totalTickets: 60,
          slaCompliant: 55,
          slaBreached: 5,
          complianceRate: 0.92,
          avgResponseTime: 65,
          avgResolutionTime: 450,
        },
        Low: {
          totalTickets: 20,
          slaCompliant: 18,
          slaBreached: 2,
          complianceRate: 0.9,
          avgResponseTime: 120,
          avgResolutionTime: 720,
        },
      },
      byCategory: {
        Hardware: {
          totalTickets: 40,
          slaCompliant: 35,
          slaBreached: 5,
          complianceRate: 0.875,
          avgResponseTime: 50,
          avgResolutionTime: 360,
        },
        Software: {
          totalTickets: 60,
          slaCompliant: 55,
          slaBreached: 5,
          complianceRate: 0.92,
          avgResponseTime: 40,
          avgResolutionTime: 300,
        },
        Network: {
          totalTickets: 30,
          slaCompliant: 27,
          slaBreached: 3,
          complianceRate: 0.9,
          avgResponseTime: 45,
          avgResolutionTime: 280,
        },
        HR: {
          totalTickets: 20,
          slaCompliant: 18,
          slaBreached: 2,
          complianceRate: 0.9,
          avgResponseTime: 60,
          avgResolutionTime: 480,
        },
      },
      byDepartment: {
        Engineering: {
          totalTickets: 80,
          slaCompliant: 72,
          slaBreached: 8,
          complianceRate: 0.9,
          avgResponseTime: 42,
          avgResolutionTime: 310,
        },
        'Human Resources': {
          totalTickets: 30,
          slaCompliant: 28,
          slaBreached: 2,
          complianceRate: 0.93,
          avgResponseTime: 55,
          avgResolutionTime: 400,
        },
        IT: {
          totalTickets: 40,
          slaCompliant: 35,
          slaBreached: 5,
          complianceRate: 0.875,
          avgResponseTime: 38,
          avgResolutionTime: 290,
        },
      },
      trends: [
        { date: '2024-01-01', slaCompliant: 30, slaBreached: 5, complianceRate: 0.86 },
        { date: '2024-01-02', slaCompliant: 32, slaBreached: 3, complianceRate: 0.91 },
        { date: '2024-01-03', slaCompliant: 28, slaBreached: 4, complianceRate: 0.88 },
        { date: '2024-01-04', slaCompliant: 35, slaBreached: 2, complianceRate: 0.95 },
        { date: '2024-01-05', slaCompliant: 30, slaBreached: 1, complianceRate: 0.97 },
      ],
    };

    return mockReport;
  }

  // Get all SLA policies
  getAllSLAPolicies(): SLAPolicy[] {
    return this.slaRules;
  }

  // Create new SLA policy
  createSLAPolicy(policy: Omit<SLAPolicy, 'id' | 'createdAt' | 'updatedAt'>): SLAPolicy {
    const newPolicy: SLAPolicy = {
      ...policy,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.slaRules.push(newPolicy);
    return newPolicy;
  }

  // Update SLA policy
  updateSLAPolicy(id: string, updates: Partial<SLAPolicy>): SLAPolicy | null {
    const index = this.slaRules.findIndex((rule) => rule.id === id);
    if (index === -1) return null;

    this.slaRules[index] = {
      ...this.slaRules[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    return this.slaRules[index];
  }

  // Delete SLA policy
  deleteSLAPolicy(id: string): boolean {
    const index = this.slaRules.findIndex((rule) => rule.id === id);
    if (index === -1) return false;

    this.slaRules.splice(index, 1);
    return true;
  }

  // Get SLA breaches
  getSLABreaches(ticketId?: string): SLABreach[] {
    if (ticketId) {
      return this.slaBreaches.filter((breach) => breach.ticketId === ticketId);
    }
    return this.slaBreaches;
  }

  // Resolve SLA breach
  resolveSLABreach(breachId: string): boolean {
    const breach = this.slaBreaches.find((b) => b.id === breachId);
    if (!breach) return false;

    breach.isResolved = true;
    breach.resolvedAt = new Date().toISOString();
    return true;
  }

  // Get tickets at risk of SLA breach
  getTicketsAtRisk(tickets: Ticket[]): Ticket[] {
    return tickets.filter((ticket) => {
      const metrics = this.calculateSLAMetrics(ticket);
      return metrics && metrics.status === 'at_risk';
    });
  }

  // Get escalation rules for a ticket
  getEscalationRules(ticket: Ticket): EscalationRule[] {
    const policy = this.getSLAPolicy(ticket);
    return policy?.escalationRules || [];
  }

  // Trigger escalation
  triggerEscalation(ticket: Ticket, level: number): boolean {
    const rules = this.getEscalationRules(ticket);
    const rule = rules.find((r) => r.level === level && r.isActive);

    if (!rule) return false;

    // In a real system, this would trigger the appropriate actions
    // For now, we'll just log the escalation
    console.log(`Escalating ticket ${ticket.id} to level ${level}:`, rule);

    return true;
  }
}

export const slaService = new SLAService();
