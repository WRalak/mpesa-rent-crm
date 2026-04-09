interface Notification {
  id: string;
  type: 'payment_due' | 'late_payment' | 'vacancy' | 'maintenance' | 'report' | 'system';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  userId: string;
  propertyId?: string;
  tenantId?: string;
  isRead: boolean;
  createdAt: Date;
  scheduledFor?: Date;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

interface NotificationTemplate {
  type: Notification['type'];
  title: string;
  message: (data: any) => string;
  priority: Notification['priority'];
  actionUrl?: (data: any) => string;
}

export class NotificationEngine {
  private static templates: NotificationTemplate[] = [
    {
      type: 'payment_due',
      title: 'Rent Payment Due',
      message: (data) => `Rent payment of KES ${data.amount} is due for ${data.tenantName} at ${data.propertyName}`,
      priority: 'high',
      actionUrl: (data) => `/payments?tenant=${data.tenantId}`
    },
    {
      type: 'late_payment',
      title: 'Late Payment Alert',
      message: (data) => `${data.tenantName} is ${data.daysLate} days late on rent payment (KES ${data.amount})`,
      priority: 'urgent',
      actionUrl: (data) => `/payments?tenant=${data.tenantId}`
    },
    {
      type: 'vacancy',
      title: 'Property Vacancy',
      message: (data) => `${data.propertyName} has ${data.vacantUnits} vacant units out of ${data.totalUnits}`,
      priority: 'medium',
      actionUrl: (data) => `/properties/${data.propertyId}`
    },
    {
      type: 'maintenance',
      title: 'Maintenance Required',
      message: (data) => `Maintenance request for ${data.issue} at ${data.propertyName}, Unit ${data.unitNumber}`,
      priority: 'medium',
      actionUrl: (data) => `/properties/${data.propertyId}/maintenance`
    },
    {
      type: 'report',
      title: 'Monthly Report Ready',
      message: (data) => `Your ${data.reportType} report for ${data.month} is ready for review`,
      priority: 'low',
      actionUrl: (data) => `/reports/${data.reportId}`
    }
  ];

  static async createNotification(
    type: Notification['type'],
    userId: string,
    data: Record<string, any>,
    options: {
      scheduledFor?: Date;
      propertyId?: string;
      tenantId?: string;
    } = {}
  ): Promise<Notification> {
    const template = this.templates.find(t => t.type === type);
    if (!template) {
      throw new Error(`No template found for notification type: ${type}`);
    }

    const notification: Notification = {
      id: this.generateId(),
      type,
      title: template.title,
      message: template.message(data),
      priority: template.priority,
      userId,
      propertyId: options.propertyId,
      tenantId: options.tenantId,
      isRead: false,
      createdAt: new Date(),
      scheduledFor: options.scheduledFor,
      actionUrl: template.actionUrl ? template.actionUrl(data) : undefined,
      metadata: data
    };

    // In a real app, save to database
    console.log('Notification created:', notification);
    
    return notification;
  }

  static async schedulePaymentReminders(): Promise<void> {
    // This would be run by a cron job daily
    console.log('Scheduling payment reminders...');
    
    // Logic to check for upcoming due dates
    // and create notifications
  }

  static async checkOverduePayments(): Promise<void> {
    // Check for payments that are overdue
    console.log('Checking overdue payments...');
    
    // Logic to identify late payments and create alerts
  }

  static async generateSmartNotifications(userId: string): Promise<Notification[]> {
    const notifications: Notification[] = [];

    // Example: Generate insights-based notifications
    notifications.push(
      await this.createNotification('report', userId, {
        reportType: 'Monthly Performance',
        month: new Date().toLocaleDateString('en-US', { month: 'long' }),
        reportId: 'monthly-report-001'
      })
    );

    return notifications;
  }

  static async sendPushNotification(
    notification: Notification,
    userDeviceTokens: string[]
  ): Promise<void> {
    // Integration with push notification service
    console.log('Sending push notification to devices:', userDeviceTokens);
  }

  static async sendSMSNotification(
    notification: Notification,
    phoneNumber: string
  ): Promise<void> {
    // Integration with SMS service
    console.log('Sending SMS to:', phoneNumber);
  }

  static async sendEmailNotification(
    notification: Notification,
    email: string
  ): Promise<void> {
    // Integration with email service
    console.log('Sending email to:', email);
  }

  private static generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

export class NotificationScheduler {
  private static schedules: Map<string, NodeJS.Timeout> = new Map();

  static scheduleNotification(
    notification: Notification,
    callback: (notification: Notification) => void
  ): void {
    if (!notification.scheduledFor) return;

    const delay = notification.scheduledFor.getTime() - Date.now();
    
    if (delay > 0) {
      const timeoutId = setTimeout(() => {
        callback(notification);
        this.schedules.delete(notification.id);
      }, delay);

      this.schedules.set(notification.id, timeoutId);
    }
  }

  static cancelScheduledNotification(notificationId: string): void {
    const timeoutId = this.schedules.get(notificationId);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.schedules.delete(notificationId);
    }
  }

  static getScheduledNotificationsCount(): number {
    return this.schedules.size;
  }
}

// Notification preferences
export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  paymentReminders: boolean;
  latePaymentAlerts: boolean;
  vacancyAlerts: boolean;
  maintenanceAlerts: boolean;
  weeklyReports: boolean;
  monthlyReports: boolean;
}

export class NotificationPreferencesManager {
  static defaultPreferences(): NotificationPreferences {
    return {
      email: true,
      sms: true,
      push: true,
      paymentReminders: true,
      latePaymentAlerts: true,
      vacancyAlerts: true,
      maintenanceAlerts: true,
      weeklyReports: false,
      monthlyReports: true
    };
  }

  static updatePreferences(
    userId: string,
    preferences: Partial<NotificationPreferences>
  ): NotificationPreferences {
    // In a real app, update in database
    console.log(`Updating preferences for user ${userId}:`, preferences);
    
    return { ...this.defaultPreferences(), ...preferences };
  }

  static shouldSendNotification(
    notification: Notification,
    preferences: NotificationPreferences
  ): boolean {
    switch (notification.type) {
      case 'payment_due':
        return preferences.paymentReminders;
      case 'late_payment':
        return preferences.latePaymentAlerts;
      case 'vacancy':
        return preferences.vacancyAlerts;
      case 'maintenance':
        return preferences.maintenanceAlerts;
      case 'report':
        return notification.title.includes('Weekly') ? 
          preferences.weeklyReports : preferences.monthlyReports;
      default:
        return true;
    }
  }
}
