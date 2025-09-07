import {
  notificationManager,
  NotificationType,
  NotificationPriority,
  NotificationStatus,
  createPriceAlertNotification,
  createOrderNotification,
} from '@/lib/notifications';

describe('Notification System', () => {
  beforeEach(() => {
    // Clear all notifications and alerts before each test
    notificationManager.clearAllNotifications();
    notificationManager.getAllPriceAlerts().forEach((alert) => {
      notificationManager.deletePriceAlert(alert.id);
    });
  });

  describe('NotificationManager', () => {
    it('should add and retrieve notifications', () => {
      const notification = {
        type: NotificationType.PRICE_ALERT,
        priority: NotificationPriority.HIGH,
        title: 'Test Notification',
        message: 'This is a test notification',
      };

      const id = notificationManager.addNotification(notification);
      const retrieved = notificationManager.getNotification(id);

      expect(retrieved).toBeDefined();
      expect(retrieved?.title).toBe('Test Notification');
      expect(retrieved?.status).toBe(NotificationStatus.UNREAD);
    });

    it('should mark notifications as read', () => {
      const notification = {
        type: NotificationType.PRICE_ALERT,
        priority: NotificationPriority.HIGH,
        title: 'Test Notification',
        message: 'This is a test notification',
      };

      const id = notificationManager.addNotification(notification);
      expect(notificationManager.markAsRead(id)).toBe(true);

      const retrieved = notificationManager.getNotification(id);
      expect(retrieved?.status).toBe(NotificationStatus.READ);
      expect(retrieved?.readAt).toBeDefined();
    });

    it('should return unread count correctly', () => {
      // Add 3 notifications
      notificationManager.addNotification({
        type: NotificationType.PRICE_ALERT,
        priority: NotificationPriority.HIGH,
        title: 'Notification 1',
        message: 'Message 1',
      });

      notificationManager.addNotification({
        type: NotificationType.ORDER_FILLED,
        priority: NotificationPriority.MEDIUM,
        title: 'Notification 2',
        message: 'Message 2',
      });

      notificationManager.addNotification({
        type: NotificationType.SYSTEM_MAINTENANCE,
        priority: NotificationPriority.LOW,
        title: 'Notification 3',
        message: 'Message 3',
      });

      expect(notificationManager.getUnreadNotifications()).toHaveLength(3);

      // Mark one as read
      const notifications = notificationManager.getAllNotifications();
      notificationManager.markAsRead(notifications[0].id);

      expect(notificationManager.getUnreadNotifications()).toHaveLength(2);
    });

    it('should archive notifications', () => {
      const notification = {
        type: NotificationType.PRICE_ALERT,
        priority: NotificationPriority.HIGH,
        title: 'Test Notification',
        message: 'This is a test notification',
      };

      const id = notificationManager.addNotification(notification);
      expect(notificationManager.archiveNotification(id)).toBe(true);

      const retrieved = notificationManager.getNotification(id);
      expect(retrieved?.status).toBe(NotificationStatus.ARCHIVED);
      expect(retrieved?.archivedAt).toBeDefined();
    });

    it('should delete notifications', () => {
      const notification = {
        type: NotificationType.PRICE_ALERT,
        priority: NotificationPriority.HIGH,
        title: 'Test Notification',
        message: 'This is a test notification',
      };

      const id = notificationManager.addNotification(notification);
      expect(notificationManager.deleteNotification(id)).toBe(true);
      expect(notificationManager.getNotification(id)).toBeUndefined();
    });
  });

  describe('Price Alerts', () => {
    it('should create and manage price alerts', () => {
      const alertId = notificationManager.addPriceAlert({
        symbol: 'APT/USD',
        targetPrice: 100,
        condition: 'above',
      });

      const alert = notificationManager.getPriceAlert(alertId);
      expect(alert).toBeDefined();
      expect(alert?.symbol).toBe('APT/USD');
      expect(alert?.targetPrice).toBe(100);
      expect(alert?.condition).toBe('above');
      expect(alert?.isActive).toBe(true);
    });

    it('should trigger price alerts', () => {
      // Create alerts
      notificationManager.addPriceAlert({
        symbol: 'APT/USD',
        targetPrice: 100,
        condition: 'above',
      });

      notificationManager.addPriceAlert({
        symbol: 'APT/USD',
        targetPrice: 120,
        condition: 'below',
      });

      // Check alerts at price 110
      const triggeredAlerts = notificationManager.checkPriceAlerts(110, 'APT/USD');

      expect(triggeredAlerts).toHaveLength(2); // Both alerts should trigger at price 110

      // Find the "above 100" alert
      const aboveAlert = triggeredAlerts.find((alert) => alert.targetPrice === 100);
      expect(aboveAlert).toBeDefined();
      expect(aboveAlert?.condition).toBe('above');

      // Find the "below 120" alert
      const belowAlert = triggeredAlerts.find((alert) => alert.targetPrice === 120);
      expect(belowAlert).toBeDefined();
      expect(belowAlert?.condition).toBe('below');

      // Verify both alerts are now inactive
      triggeredAlerts.forEach((triggeredAlert) => {
        const alert = notificationManager.getPriceAlert(triggeredAlert.id);
        expect(alert?.isActive).toBe(false);
        expect(alert?.triggeredAt).toBeDefined();
      });
    });

    it('should delete price alerts', () => {
      const alertId = notificationManager.addPriceAlert({
        symbol: 'APT/USD',
        targetPrice: 100,
        condition: 'above',
      });

      expect(notificationManager.deletePriceAlert(alertId)).toBe(true);
      expect(notificationManager.getPriceAlert(alertId)).toBeUndefined();
    });
  });

  describe('Notification Helpers', () => {
    it('should create price alert notifications', () => {
      const alert = {
        id: 'test-alert',
        symbol: 'APT/USD',
        targetPrice: 100,
        condition: 'above' as const,
        isActive: true,
        createdAt: new Date(),
        triggeredAt: new Date(),
      };

      const notification = createPriceAlertNotification(alert, 105);

      expect(notification.type).toBe(NotificationType.PRICE_ALERT);
      expect(notification.priority).toBe(NotificationPriority.HIGH);
      expect(notification.title).toBe('Price Alert: APT/USD');
      expect(notification.message).toContain('above');
      expect(notification.message).toContain('$100.00');
      expect(notification.message).toContain('$105.00');
      expect(notification.actions).toHaveLength(2);
    });

    it('should create order notifications', () => {
      const notification = createOrderNotification(
        'test-order',
        NotificationType.ORDER_FILLED,
        'APT/USD',
        'Filled 5 at $100',
      );

      expect(notification.type).toBe(NotificationType.ORDER_FILLED);
      expect(notification.priority).toBe(NotificationPriority.HIGH);
      expect(notification.title).toBe('Order Filled');
      expect(notification.message).toBe('✅ APT/USD: Filled 5 at $100');
      expect(notification.actions).toHaveLength(1);
    });
  });

  describe('Preferences', () => {
    it('should update notification preferences', () => {
      notificationManager.updatePreferences({
        enableSound: false,
        enableDesktop: true,
        minimumPriority: NotificationPriority.HIGH,
      });

      const preferences = notificationManager.getPreferences();
      expect(preferences.enableSound).toBe(false);
      expect(preferences.enableDesktop).toBe(true);
      expect(preferences.minimumPriority).toBe(NotificationPriority.HIGH);
    });

    it('should reset preferences to defaults', () => {
      notificationManager.updatePreferences({
        enableSound: false,
        enableDesktop: false,
        minimumPriority: NotificationPriority.CRITICAL,
      });

      notificationManager.resetPreferences();

      const preferences = notificationManager.getPreferences();
      expect(preferences.enableSound).toBe(true);
      expect(preferences.enableDesktop).toBe(true);
      expect(preferences.minimumPriority).toBe(NotificationPriority.MEDIUM);
    });
  });

  describe('Quiet Hours', () => {
    beforeEach(() => {
      // Mock current time to be within quiet hours (22:00 - 08:00)
      jest.spyOn(Date.prototype, 'getHours').mockReturnValue(2); // 2 AM
      jest.spyOn(Date.prototype, 'getMinutes').mockReturnValue(30);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should respect quiet hours', () => {
      notificationManager.updatePreferences({
        quietHours: {
          enabled: true,
          start: '22:00',
          end: '08:00',
        },
      });

      // This should not trigger sound due to quiet hours
      const notification = {
        type: NotificationType.PRICE_ALERT,
        priority: NotificationPriority.CRITICAL,
        title: 'Test Alert',
        message: 'Test message',
      };

      notificationManager.addNotification(notification);

      // The notification should still be created, just no sound/browser notification
      const notifications = notificationManager.getAllNotifications();
      expect(notifications).toHaveLength(1);
      expect(notifications[0].title).toBe('Test Alert');
    });
  });
});
