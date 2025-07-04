// Notification Service - Real-time notifications and communication
import {
  NotificationEvent,
  NotificationPreference,
  InAppNotification,
  NotificationTemplate,
  NotificationChannel,
  NotificationDelivery,
  WebSocketMessage,
} from '../types/notifications';
import { Ticket } from '../types';

class NotificationService {
  private notifications: InAppNotification[] = [];
  private preferences: NotificationPreference[] = [];
  private templates: NotificationTemplate[] = [];
  private channels: NotificationChannel[] = [];
  private deliveries: NotificationDelivery[] = [];
  private websocketConnections: Map<string, WebSocket> = new Map();

  constructor() {
    this.initializeDefaultTemplates();
    this.initializeDefaultChannels();
  }

  // Initialize default notification templates
  private initializeDefaultTemplates(): void {
    this.templates = [
      {
        id: '1',
        name: 'Ticket Created',
        description: 'Notification sent when a new ticket is created',
        channel: 'email',
        eventType: 'ticket_created',
        subject: 'New Ticket Created: {{ticket.title}}',
        body: `
          <h2>New Ticket Created</h2>
          <p>A new ticket has been created and requires your attention.</p>
          <table>
            <tr><td><strong>Ticket ID:</strong></td><td>{{ticket.ticketNumber}}</td></tr>
            <tr><td><strong>Title:</strong></td><td>{{ticket.title}}</td></tr>
            <tr><td><strong>Priority:</strong></td><td>{{ticket.priority}}</td></tr>
            <tr><td><strong>Category:</strong></td><td>{{ticket.category}}</td></tr>
            <tr><td><strong>Created By:</strong></td><td>{{ticket.createdByName}}</td></tr>
            <tr><td><strong>Department:</strong></td><td>{{ticket.department}}</td></tr>
          </table>
          <p><strong>Description:</strong></p>
          <p>{{ticket.description}}</p>
          <p><a href="{{baseUrl}}/tickets/{{ticket.id}}">View Ticket</a></p>
        `,
        variables: [
          'ticket.ticketNumber',
          'ticket.title',
          'ticket.priority',
          'ticket.category',
          'ticket.createdByName',
          'ticket.department',
          'ticket.description',
          'ticket.id',
          'baseUrl',
        ],
        conditions: {},
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Ticket Assigned',
        description: 'Notification sent when a ticket is assigned',
        channel: 'email',
        eventType: 'ticket_assigned',
        subject: 'Ticket Assigned: {{ticket.title}}',
        body: `
          <h2>Ticket Assigned to You</h2>
          <p>A ticket has been assigned to you.</p>
          <table>
            <tr><td><strong>Ticket ID:</strong></td><td>{{ticket.ticketNumber}}</td></tr>
            <tr><td><strong>Title:</strong></td><td>{{ticket.title}}</td></tr>
            <tr><td><strong>Priority:</strong></td><td>{{ticket.priority}}</td></tr>
            <tr><td><strong>Category:</strong></td><td>{{ticket.category}}</td></tr>
            <tr><td><strong>Due Date:</strong></td><td>{{ticket.dueDate}}</td></tr>
          </table>
          <p><a href="{{baseUrl}}/tickets/{{ticket.id}}">View Ticket</a></p>
        `,
        variables: [
          'ticket.ticketNumber',
          'ticket.title',
          'ticket.priority',
          'ticket.category',
          'ticket.dueDate',
          'ticket.id',
          'baseUrl',
        ],
        conditions: {},
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        name: 'SLA Breach Alert',
        description: 'Critical notification for SLA breaches',
        channel: 'email',
        eventType: 'sla_breach',
        subject: 'SLA BREACH ALERT: {{ticket.title}}',
        body: `
          <h2 style="color: red;">SLA BREACH ALERT</h2>
          <p>A ticket has breached its SLA requirements and requires immediate attention.</p>
          <table>
            <tr><td><strong>Ticket ID:</strong></td><td>{{ticket.ticketNumber}}</td></tr>
            <tr><td><strong>Title:</strong></td><td>{{ticket.title}}</td></tr>
            <tr><td><strong>Priority:</strong></td><td>{{ticket.priority}}</td></tr>
            <tr><td><strong>SLA Target:</strong></td><td>{{sla.target}} minutes</td></tr>
            <tr><td><strong>Time Elapsed:</strong></td><td>{{sla.elapsed}} minutes</td></tr>
            <tr><td><strong>Breach Duration:</strong></td><td>{{sla.breachDuration}} minutes</td></tr>
          </table>
          <p><a href="{{baseUrl}}/tickets/{{ticket.id}}">View Ticket Immediately</a></p>
        `,
        variables: [
          'ticket.ticketNumber',
          'ticket.title',
          'ticket.priority',
          'sla.target',
          'sla.elapsed',
          'sla.breachDuration',
          'ticket.id',
          'baseUrl',
        ],
        conditions: { slaBreached: true },
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  // Initialize default notification channels
  private initializeDefaultChannels(): void {
    this.channels = [
      {
        id: '1',
        name: 'Email Notifications',
        type: 'email',
        config: {
          email: {
            smtpHost: 'smtp.gmail.com',
            smtpPort: 587,
            username: 'notifications@ticketops.com',
            password: 'app-password',
            from: 'TicketOps <notifications@ticketops.com>',
            encryption: 'tls',
          },
        },
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Slack Integration',
        type: 'slack',
        config: {
          slack: {
            botToken: 'xoxb-your-slack-bot-token',
            channel: '#ticket-notifications',
            webhookUrl: 'https://hooks.slack.com/services/YOUR/WEBHOOK/URL',
          },
        },
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  // Create a new notification event
  async createNotification(
    event: Omit<NotificationEvent, 'id' | 'status' | 'createdAt' | 'updatedAt'>
  ): Promise<NotificationEvent> {
    const notification: NotificationEvent = {
      ...event,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Process the notification
    await this.processNotification(notification);

    return notification;
  }

  // Process a notification event
  private async processNotification(notification: NotificationEvent): Promise<void> {
    // Get notification preferences for recipients
    const preferences = this.getUserPreferences(notification.recipients);

    // Send notifications through configured channels
    for (const channelId of notification.channels) {
      const channel = this.channels.find((c) => c.id === channelId && c.isActive);
      if (!channel) continue;

      const template = this.getTemplate(notification.type, channel.type);
      if (!template) continue;

      // Filter recipients based on preferences
      const filteredRecipients = preferences.filter((pref) => {
        const channelEnabled = this.isChannelEnabled(pref, channel.type);
        const eventEnabled = this.isEventEnabled(pref, notification.type);
        const inQuietHours = this.isInQuietHours(pref);

        return channelEnabled && eventEnabled && !inQuietHours;
      });

      // Send notifications
      for (const recipient of filteredRecipients) {
        await this.sendNotification(notification, channel, template, recipient.userId);
      }
    }

    // Create in-app notifications
    for (const recipientId of notification.recipients) {
      await this.createInAppNotification({
        userId: recipientId,
        title: notification.title,
        message: notification.message,
        type: this.mapPriorityToType(notification.priority),
        ticketId: notification.ticketId,
        actionUrl: `/tickets/${notification.ticketId}`,
        actionText: 'View Ticket',
        isRead: false,
      });
    }

    // Send real-time updates via WebSocket
    this.sendWebSocketMessage(
      {
        type: 'notification',
        data: notification,
        timestamp: new Date().toISOString(),
      },
      notification.recipients
    );
  }

  // Send notification through a specific channel
  private async sendNotification(
    event: NotificationEvent,
    channel: NotificationChannel,
    template: NotificationTemplate,
    recipientId: string
  ): Promise<void> {
    const delivery: NotificationDelivery = {
      id: Date.now().toString(),
      notificationId: event.id,
      channel: channel.id,
      recipient: recipientId,
      status: 'pending',
      attempts: 0,
      lastAttempt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      // Render template with event data
      const renderedContent = this.renderTemplate(template, event.data);

      // Send through appropriate channel
      switch (channel.type) {
        case 'email':
          await this.sendEmail(channel, renderedContent, recipientId);
          break;
        case 'slack':
          await this.sendSlack(channel, renderedContent, recipientId);
          break;
        case 'teams':
          await this.sendTeams(channel, renderedContent, recipientId);
          break;
        case 'webhook':
          await this.sendWebhook(channel, renderedContent, recipientId);
          break;
      }

      delivery.status = 'sent';
      delivery.attempts = 1;
    } catch (error) {
      delivery.status = 'failed';
      delivery.errorMessage = error instanceof Error ? error.message : 'Unknown error';
      delivery.attempts = 1;
    }

    this.deliveries.push(delivery);
  }

  // Send email notification
  private async sendEmail(
    channel: NotificationChannel,
    content: any,
    recipientId: string
  ): Promise<void> {
    // Mock email sending - in real implementation, use nodemailer or similar
    console.log('Sending email notification:', {
      channel: channel.name,
      recipient: recipientId,
      subject: content.subject,
      body: content.body,
    });

    // Simulate async email sending
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // Send Slack notification
  private async sendSlack(
    channel: NotificationChannel,
    content: any,
    recipientId: string
  ): Promise<void> {
    // Mock Slack sending - in real implementation, use Slack API
    console.log('Sending Slack notification:', {
      channel: channel.name,
      recipient: recipientId,
      message: content.body,
    });

    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // Send Teams notification
  private async sendTeams(
    channel: NotificationChannel,
    content: any,
    recipientId: string
  ): Promise<void> {
    // Mock Teams sending - in real implementation, use Teams webhook
    console.log('Sending Teams notification:', {
      channel: channel.name,
      recipient: recipientId,
      message: content.body,
    });

    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // Send webhook notification
  private async sendWebhook(
    channel: NotificationChannel,
    content: any,
    recipientId: string
  ): Promise<void> {
    // Mock webhook sending - in real implementation, use fetch or axios
    console.log('Sending webhook notification:', {
      channel: channel.name,
      recipient: recipientId,
      payload: content,
    });

    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // Create in-app notification
  async createInAppNotification(
    data: Omit<InAppNotification, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<InAppNotification> {
    const notification: InAppNotification = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.notifications.push(notification);
    return notification;
  }

  // Get in-app notifications for a user
  getInAppNotifications(userId: string, limit: number = 50): InAppNotification[] {
    return this.notifications
      .filter((n) => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  // Mark notification as read
  markAsRead(notificationId: string): boolean {
    const notification = this.notifications.find((n) => n.id === notificationId);
    if (!notification) return false;

    notification.isRead = true;
    notification.readAt = new Date().toISOString();
    notification.updatedAt = new Date().toISOString();

    return true;
  }

  // Mark all notifications as read for a user
  markAllAsRead(userId: string): number {
    let count = 0;
    this.notifications.forEach((notification) => {
      if (notification.userId === userId && !notification.isRead) {
        notification.isRead = true;
        notification.readAt = new Date().toISOString();
        notification.updatedAt = new Date().toISOString();
        count++;
      }
    });
    return count;
  }

  // Get user notification preferences
  getUserPreferences(userIds: string[]): NotificationPreference[] {
    return this.preferences.filter((pref) => userIds.includes(pref.userId));
  }

  // Update user notification preferences
  updateUserPreferences(
    userId: string,
    preferences: Partial<NotificationPreference>
  ): NotificationPreference {
    const index = this.preferences.findIndex((p) => p.userId === userId);

    if (index >= 0) {
      this.preferences[index] = {
        ...this.preferences[index],
        ...preferences,
        updatedAt: new Date().toISOString(),
      };
      return this.preferences[index];
    } else {
      const newPreferences: NotificationPreference = {
        id: Date.now().toString(),
        userId,
        channels: { email: true, sms: false, push: true, inApp: true },
        events: {
          ticketCreated: true,
          ticketUpdated: true,
          ticketAssigned: true,
          ticketCommented: true,
          ticketResolved: true,
          ticketClosed: true,
          slaBreached: true,
          escalation: true,
          reminder: true,
        },
        schedule: {
          enabled: false,
          quietHours: { start: '22:00', end: '08:00' },
          weekends: false,
          holidays: false,
        },
        frequency: {
          immediate: true,
          batched: false,
          batchInterval: 60,
          digest: false,
          digestTime: '09:00',
        },
        ...preferences,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      this.preferences.push(newPreferences);
      return newPreferences;
    }
  }

  // Send WebSocket message
  sendWebSocketMessage(message: WebSocketMessage, userIds?: string[]): void {
    if (userIds) {
      userIds.forEach((userId) => {
        const connection = this.websocketConnections.get(userId);
        if (connection && connection.readyState === WebSocket.OPEN) {
          connection.send(JSON.stringify(message));
        }
      });
    } else {
      this.websocketConnections.forEach((connection) => {
        if (connection.readyState === WebSocket.OPEN) {
          connection.send(JSON.stringify(message));
        }
      });
    }
  }

  // Helper methods
  private getTemplate(eventType: string, channelType: string): NotificationTemplate | null {
    return (
      this.templates.find(
        (t) => t.eventType === eventType && t.channel === channelType && t.isActive
      ) || null
    );
  }

  private renderTemplate(template: NotificationTemplate, data: Record<string, any>): any {
    let subject = template.subject || '';
    let body = template.body;

    // Simple template rendering - in real implementation, use a template engine
    Object.entries(data).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      subject = subject.replace(new RegExp(placeholder, 'g'), String(value));
      body = body.replace(new RegExp(placeholder, 'g'), String(value));
    });

    return { subject, body };
  }

  private isChannelEnabled(preferences: NotificationPreference, channelType: string): boolean {
    switch (channelType) {
      case 'email':
        return preferences.channels.email;
      case 'sms':
        return preferences.channels.sms;
      case 'push':
        return preferences.channels.push;
      default:
        return preferences.channels.inApp;
    }
  }

  private isEventEnabled(preferences: NotificationPreference, eventType: string): boolean {
    switch (eventType) {
      case 'ticket_created':
        return preferences.events.ticketCreated;
      case 'ticket_updated':
        return preferences.events.ticketUpdated;
      case 'ticket_assigned':
        return preferences.events.ticketAssigned;
      case 'ticket_commented':
        return preferences.events.ticketCommented;
      case 'ticket_resolved':
        return preferences.events.ticketResolved;
      case 'ticket_closed':
        return preferences.events.ticketClosed;
      case 'sla_breach':
        return preferences.events.slaBreached;
      case 'escalation':
        return preferences.events.escalation;
      case 'reminder':
        return preferences.events.reminder;
      default:
        return false;
    }
  }

  private isInQuietHours(preferences: NotificationPreference): boolean {
    if (!preferences.schedule.enabled) return false;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const [startHour, startMinute] = preferences.schedule.quietHours.start.split(':').map(Number);
    const [endHour, endMinute] = preferences.schedule.quietHours.end.split(':').map(Number);
    const startTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;

    return currentTime >= startTime || currentTime <= endTime;
  }

  private mapPriorityToType(priority: string): 'info' | 'success' | 'warning' | 'error' {
    switch (priority) {
      case 'critical':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      case 'low':
        return 'info';
      default:
        return 'info';
    }
  }

  // Quick notification methods for common events
  async notifyTicketCreated(ticket: Ticket, recipients: string[]): Promise<void> {
    await this.createNotification({
      type: 'ticket_created',
      ticketId: ticket.id,
      userId: ticket.createdBy,
      data: { ticket, baseUrl: window.location.origin },
      title: `New Ticket Created: ${ticket.title}`,
      message: `A new ${ticket.priority} priority ticket has been created in ${ticket.category}`,
      priority: 'medium',
      recipients,
      channels: ['1'], // Email channel
    });
  }

  async notifyTicketAssigned(ticket: Ticket, assigneeId: string): Promise<void> {
    await this.createNotification({
      type: 'ticket_assigned',
      ticketId: ticket.id,
      userId: ticket.createdBy,
      data: { ticket, baseUrl: window.location.origin },
      title: `Ticket Assigned: ${ticket.title}`,
      message: `You have been assigned a ${ticket.priority} priority ticket`,
      priority: 'medium',
      recipients: [assigneeId],
      channels: ['1'], // Email channel
    });
  }

  async notifySLABreach(ticket: Ticket, slaData: any): Promise<void> {
    await this.createNotification({
      type: 'sla_breach',
      ticketId: ticket.id,
      userId: ticket.createdBy,
      data: { ticket, sla: slaData, baseUrl: window.location.origin },
      title: `SLA BREACH: ${ticket.title}`,
      message: `Ticket ${ticket.ticketNumber} has breached SLA requirements`,
      priority: 'critical',
      recipients: [ticket.assignedTo || ticket.createdBy],
      channels: ['1', '2'], // Email and Slack
    });
  }
}

export const notificationService = new NotificationService();
