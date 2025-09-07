import { z } from 'zod';

// Notification Types
export enum NotificationType {
  PRICE_ALERT = 'price_alert',
  ORDER_FILLED = 'order_filled',
  ORDER_PARTIAL = 'order_partial',
  ORDER_CANCELLED = 'order_cancelled',
  ORDER_EXPIRED = 'order_expired',
  POSITION_LIQUIDATED = 'position_liquidated',
  PRICE_BREAKOUT = 'price_breakout',
  MARKET_NEWS = 'market_news',
  SYSTEM_MAINTENANCE = 'system_maintenance',
  WALLET_DISCONNECTED = 'wallet_disconnected',
}

// Notification Priority
export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

// Notification Status
export enum NotificationStatus {
  UNREAD = 'unread',
  READ = 'read',
  ARCHIVED = 'archived',
}

// Notification Interface
export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  status: NotificationStatus;
  title: string;
  message: string;
  data?: Record<string, any>;
  timestamp: Date;
  readAt?: Date;
  archivedAt?: Date;
  actions?: NotificationAction[];
}

// Notification Action
export interface NotificationAction {
  label: string;
  action: string;
  data?: Record<string, any>;
}

// Price Alert Interface
export interface PriceAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  condition: 'above' | 'below' | 'crosses_above' | 'crosses_below';
  isActive: boolean;
  createdAt: Date;
  triggeredAt?: Date;
  notificationId?: string;
}

// Notification Preferences
export interface NotificationPreferences {
  enableSound: boolean;
  enableDesktop: boolean;
  enableEmail: boolean;
  priceAlerts: boolean;
  orderUpdates: boolean;
  marketNews: boolean;
  systemAlerts: boolean;
  minimumPriority: NotificationPriority;
  quietHours: {
    enabled: boolean;
    start: string; // HH:MM format
    end: string; // HH:MM format
  };
}

// Notification Schemas
export const PriceAlertSchema = z.object({
  id: z.string(),
  symbol: z.string(),
  targetPrice: z.number().positive(),
  condition: z.enum(['above', 'below', 'crosses_above', 'crosses_below']),
  isActive: z.boolean(),
  createdAt: z.date(),
  triggeredAt: z.date().optional(),
  notificationId: z.string().optional(),
});

export const NotificationSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(NotificationType),
  priority: z.nativeEnum(NotificationPriority),
  status: z.nativeEnum(NotificationStatus),
  title: z.string(),
  message: z.string(),
  data: z.record(z.any()).optional(),
  timestamp: z.date(),
  readAt: z.date().optional(),
  archivedAt: z.date().optional(),
  actions: z
    .array(
      z.object({
        label: z.string(),
        action: z.string(),
        data: z.record(z.any()).optional(),
      }),
    )
    .optional(),
});

export const NotificationPreferencesSchema = z.object({
  enableSound: z.boolean(),
  enableDesktop: z.boolean(),
  enableEmail: z.boolean(),
  priceAlerts: z.boolean(),
  orderUpdates: z.boolean(),
  marketNews: z.boolean(),
  systemAlerts: z.boolean(),
  minimumPriority: z.nativeEnum(NotificationPriority),
  quietHours: z.object({
    enabled: z.boolean(),
    start: z.string(),
    end: z.string(),
  }),
});

// Default Preferences
export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  enableSound: true,
  enableDesktop: true,
  enableEmail: false,
  priceAlerts: true,
  orderUpdates: true,
  marketNews: false,
  systemAlerts: true,
  minimumPriority: NotificationPriority.MEDIUM,
  quietHours: {
    enabled: false,
    start: '22:00',
    end: '08:00',
  },
};

// Notification Manager Class
export class NotificationManager {
  private notifications: Map<string, Notification> = new Map();
  private priceAlerts: Map<string, PriceAlert> = new Map();
  private preferences: NotificationPreferences = DEFAULT_NOTIFICATION_PREFERENCES;
  private listeners: Set<(notifications: Notification[]) => void> = new Set();

  // Notification Management
  addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'status'>): string {
    const id = crypto.randomUUID();
    const fullNotification: Notification = {
      ...notification,
      id,
      timestamp: new Date(),
      status: NotificationStatus.UNREAD,
    };

    this.notifications.set(id, fullNotification);
    this.notifyListeners();
    this.handleNotification(fullNotification);

    return id;
  }

  getNotification(id: string): Notification | undefined {
    return this.notifications.get(id);
  }

  getAllNotifications(): Notification[] {
    return Array.from(this.notifications.values()).sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
    );
  }

  getUnreadNotifications(): Notification[] {
    return this.getAllNotifications().filter((n) => n.status === NotificationStatus.UNREAD);
  }

  markAsRead(id: string): boolean {
    const notification = this.notifications.get(id);
    if (notification && notification.status === NotificationStatus.UNREAD) {
      notification.status = NotificationStatus.READ;
      notification.readAt = new Date();
      this.notifications.set(id, notification);
      this.notifyListeners();
      return true;
    }
    return false;
  }

  markAllAsRead(): void {
    this.notifications.forEach((notification) => {
      if (notification.status === NotificationStatus.UNREAD) {
        notification.status = NotificationStatus.READ;
        notification.readAt = new Date();
      }
    });
    this.notifyListeners();
  }

  archiveNotification(id: string): boolean {
    const notification = this.notifications.get(id);
    if (notification) {
      notification.status = NotificationStatus.ARCHIVED;
      notification.archivedAt = new Date();
      this.notifications.set(id, notification);
      this.notifyListeners();
      return true;
    }
    return false;
  }

  deleteNotification(id: string): boolean {
    return this.notifications.delete(id);
  }

  clearAllNotifications(): void {
    this.notifications.clear();
    this.notifyListeners();
  }

  // Price Alert Management
  addPriceAlert(alert: Omit<PriceAlert, 'id' | 'createdAt' | 'isActive'>): string {
    const id = crypto.randomUUID();
    const fullAlert: PriceAlert = {
      ...alert,
      id,
      createdAt: new Date(),
      isActive: true,
    };

    this.priceAlerts.set(id, fullAlert);
    return id;
  }

  getPriceAlert(id: string): PriceAlert | undefined {
    return this.priceAlerts.get(id);
  }

  getAllPriceAlerts(): PriceAlert[] {
    return Array.from(this.priceAlerts.values());
  }

  updatePriceAlert(id: string, updates: Partial<PriceAlert>): boolean {
    const alert = this.priceAlerts.get(id);
    if (alert) {
      this.priceAlerts.set(id, { ...alert, ...updates });
      return true;
    }
    return false;
  }

  deletePriceAlert(id: string): boolean {
    return this.priceAlerts.delete(id);
  }

  checkPriceAlerts(currentPrice: number, symbol: string): PriceAlert[] {
    const triggeredAlerts: PriceAlert[] = [];

    this.priceAlerts.forEach((alert) => {
      if (!alert.isActive || alert.symbol !== symbol || alert.triggeredAt) {
        return;
      }

      let triggered = false;

      switch (alert.condition) {
        case 'above':
          triggered = currentPrice >= alert.targetPrice;
          break;
        case 'below':
          triggered = currentPrice <= alert.targetPrice;
          break;
        case 'crosses_above':
          // This would need previous price context to detect crossing
          triggered = currentPrice >= alert.targetPrice;
          break;
        case 'crosses_below':
          // This would need previous price context to detect crossing
          triggered = currentPrice <= alert.targetPrice;
          break;
      }

      if (triggered) {
        alert.triggeredAt = new Date();
        alert.isActive = false;
        triggeredAlerts.push(alert);
      }
    });

    return triggeredAlerts;
  }

  // Preferences Management
  getPreferences(): NotificationPreferences {
    return { ...this.preferences };
  }

  updatePreferences(preferences: Partial<NotificationPreferences>): void {
    this.preferences = { ...this.preferences, ...preferences };
  }

  resetPreferences(): void {
    this.preferences = { ...DEFAULT_NOTIFICATION_PREFERENCES };
  }

  // Event Listeners
  addListener(callback: (notifications: Notification[]) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners(): void {
    const notifications = this.getAllNotifications();
    this.listeners.forEach((callback) => callback(notifications));
  }

  // Handle Notification (Sound, Desktop, etc.)
  private handleNotification(notification: Notification): void {
    // Check quiet hours
    if (this.isInQuietHours()) {
      return;
    }

    // Check preferences
    if (!this.shouldShowNotification(notification)) {
      return;
    }

    // Browser notification
    if (this.preferences.enableDesktop && 'Notification' in window) {
      this.showBrowserNotification(notification);
    }

    // Sound notification
    if (this.preferences.enableSound) {
      this.playNotificationSound(notification.priority);
    }
  }

  private shouldShowNotification(notification: Notification): boolean {
    // Check priority threshold
    const priorityOrder = {
      [NotificationPriority.LOW]: 0,
      [NotificationPriority.MEDIUM]: 1,
      [NotificationPriority.HIGH]: 2,
      [NotificationPriority.CRITICAL]: 3,
    };

    if (priorityOrder[notification.priority] < priorityOrder[this.preferences.minimumPriority]) {
      return false;
    }

    // Check type preferences
    switch (notification.type) {
      case NotificationType.PRICE_ALERT:
        return this.preferences.priceAlerts;
      case NotificationType.ORDER_FILLED:
      case NotificationType.ORDER_PARTIAL:
      case NotificationType.ORDER_CANCELLED:
      case NotificationType.ORDER_EXPIRED:
      case NotificationType.POSITION_LIQUIDATED:
        return this.preferences.orderUpdates;
      case NotificationType.MARKET_NEWS:
        return this.preferences.marketNews;
      case NotificationType.SYSTEM_MAINTENANCE:
      case NotificationType.WALLET_DISCONNECTED:
        return this.preferences.systemAlerts;
      default:
        return true;
    }
  }

  private isInQuietHours(): boolean {
    if (!this.preferences.quietHours.enabled) {
      return false;
    }

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const [startHour, startMinute] = this.preferences.quietHours.start.split(':').map(Number);
    const [endHour, endMinute] = this.preferences.quietHours.end.split(':').map(Number);
    const startTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;

    if (startTime <= endTime) {
      return currentTime >= startTime && currentTime <= endTime;
    } else {
      // Overnight quiet hours (e.g., 22:00 to 08:00)
      return currentTime >= startTime || currentTime <= endTime;
    }
  }

  private showBrowserNotification(notification: Notification): void {
    if (Notification.permission === 'granted') {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        tag: notification.id,
        requireInteraction: notification.priority === NotificationPriority.CRITICAL,
      });

      browserNotification.onclick = () => {
        window.focus();
        browserNotification.close();
      };

      // Auto-close non-critical notifications
      if (notification.priority !== NotificationPriority.CRITICAL) {
        setTimeout(() => browserNotification.close(), 5000);
      }
    }
  }

  private playNotificationSound(priority: NotificationPriority): void {
    // Create audio context and play appropriate sound
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Different frequencies for different priorities
      const frequencies = {
        [NotificationPriority.LOW]: 440,
        [NotificationPriority.MEDIUM]: 550,
        [NotificationPriority.HIGH]: 660,
        [NotificationPriority.CRITICAL]: 880,
      };

      oscillator.frequency.setValueAtTime(frequencies[priority], audioContext.currentTime);
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.warn('Could not play notification sound:', error);
    }
  }
}

// Global notification manager instance
export const notificationManager = new NotificationManager();

// Utility functions
export function createPriceAlertNotification(
  alert: PriceAlert,
  currentPrice: number,
): Omit<Notification, 'id' | 'timestamp' | 'status'> {
  const direction =
    alert.condition === 'above' || alert.condition === 'crosses_above' ? '📈' : '📉';
  const condition = alert.condition.replace('_', ' ');

  return {
    type: NotificationType.PRICE_ALERT,
    priority: NotificationPriority.HIGH,
    title: `Price Alert: ${alert.symbol}`,
    message: `${direction} ${alert.symbol} ${condition} $${alert.targetPrice.toFixed(2)} (Current: $${currentPrice.toFixed(2)})`,
    data: {
      symbol: alert.symbol,
      targetPrice: alert.targetPrice,
      currentPrice,
      alertId: alert.id,
    },
    actions: [
      {
        label: 'View Chart',
        action: 'view_chart',
        data: { symbol: alert.symbol },
      },
      {
        label: 'Create Order',
        action: 'create_order',
        data: { symbol: alert.symbol, price: currentPrice },
      },
    ],
  };
}

export function createOrderNotification(
  orderId: string,
  type: NotificationType,
  symbol: string,
  details: string,
): Omit<Notification, 'id' | 'timestamp' | 'status'> {
  const typeConfig = {
    [NotificationType.ORDER_FILLED]: {
      priority: NotificationPriority.HIGH,
      title: 'Order Filled',
      icon: '✅',
    },
    [NotificationType.ORDER_PARTIAL]: {
      priority: NotificationPriority.MEDIUM,
      title: 'Order Partially Filled',
      icon: '🔄',
    },
    [NotificationType.ORDER_CANCELLED]: {
      priority: NotificationPriority.MEDIUM,
      title: 'Order Cancelled',
      icon: '❌',
    },
    [NotificationType.ORDER_EXPIRED]: {
      priority: NotificationPriority.LOW,
      title: 'Order Expired',
      icon: '⏰',
    },
  };

  const config = typeConfig[type as keyof typeof typeConfig];

  return {
    type,
    priority: config.priority,
    title: config.title,
    message: `${config.icon} ${symbol}: ${details}`,
    data: {
      orderId,
      symbol,
    },
    actions: [
      {
        label: 'View Orders',
        action: 'view_orders',
        data: { orderId },
      },
    ],
  };
}

export function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    return Promise.resolve('denied');
  }

  if (Notification.permission === 'granted') {
    return Promise.resolve('granted');
  }

  if (Notification.permission === 'denied') {
    return Promise.resolve('denied');
  }

  return Notification.requestPermission();
}
