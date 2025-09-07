'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  Notification,
  NotificationType,
  NotificationPriority,
  NotificationStatus,
  PriceAlert,
  NotificationPreferences,
  notificationManager,
  requestNotificationPermission,
  createPriceAlertNotification,
  createOrderNotification,
} from '@/lib/notifications';

// Context Types
interface NotificationContextType {
  // Notifications
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'status'>) => string;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  archiveNotification: (id: string) => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;

  // Price Alerts
  priceAlerts: PriceAlert[];
  addPriceAlert: (alert: Omit<PriceAlert, 'id' | 'createdAt' | 'isActive'>) => string;
  updatePriceAlert: (id: string, updates: Partial<PriceAlert>) => boolean;
  deletePriceAlert: (id: string) => boolean;

  // Preferences
  preferences: NotificationPreferences;
  updatePreferences: (preferences: Partial<NotificationPreferences>) => void;
  resetPreferences: () => void;

  // Utilities
  requestPermission: () => Promise<NotificationPermission>;
  checkPriceAlerts: (currentPrice: number, symbol: string) => void;
}

// Create Context
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Provider Component
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences>(
    notificationManager.getPreferences(),
  );

  // Initialize notifications and price alerts
  useEffect(() => {
    setNotifications(notificationManager.getAllNotifications());
    setPriceAlerts(notificationManager.getAllPriceAlerts());

    // Set up listener for notification changes
    const unsubscribe = notificationManager.addListener((updatedNotifications) => {
      setNotifications(updatedNotifications);
    });

    return unsubscribe;
  }, []);

  // Notification methods
  const addNotification = useCallback(
    (notification: Omit<Notification, 'id' | 'timestamp' | 'status'>) => {
      return notificationManager.addNotification(notification);
    },
    [],
  );

  const markAsRead = useCallback((id: string) => {
    notificationManager.markAsRead(id);
  }, []);

  const markAllAsRead = useCallback(() => {
    notificationManager.markAllAsRead();
  }, []);

  const archiveNotification = useCallback((id: string) => {
    notificationManager.archiveNotification(id);
  }, []);

  const deleteNotification = useCallback((id: string) => {
    notificationManager.deleteNotification(id);
  }, []);

  const clearAllNotifications = useCallback(() => {
    notificationManager.clearAllNotifications();
  }, []);

  // Price alert methods
  const addPriceAlert = useCallback((alert: Omit<PriceAlert, 'id' | 'createdAt' | 'isActive'>) => {
    const id = notificationManager.addPriceAlert(alert);
    setPriceAlerts(notificationManager.getAllPriceAlerts());
    return id;
  }, []);

  const updatePriceAlert = useCallback((id: string, updates: Partial<PriceAlert>) => {
    const success = notificationManager.updatePriceAlert(id, updates);
    if (success) {
      setPriceAlerts(notificationManager.getAllPriceAlerts());
    }
    return success;
  }, []);

  const deletePriceAlert = useCallback((id: string) => {
    const success = notificationManager.deletePriceAlert(id);
    if (success) {
      setPriceAlerts(notificationManager.getAllPriceAlerts());
    }
    return success;
  }, []);

  // Preferences methods
  const updatePreferences = useCallback((newPreferences: Partial<NotificationPreferences>) => {
    notificationManager.updatePreferences(newPreferences);
    setPreferences(notificationManager.getPreferences());
  }, []);

  const resetPreferences = useCallback(() => {
    notificationManager.resetPreferences();
    setPreferences(notificationManager.getPreferences());
  }, []);

  // Utilities
  const requestPermission = useCallback(() => {
    return requestNotificationPermission();
  }, []);

  const checkPriceAlerts = useCallback((currentPrice: number, symbol: string) => {
    const triggeredAlerts = notificationManager.checkPriceAlerts(currentPrice, symbol);

    // Create notifications for triggered alerts
    triggeredAlerts.forEach((alert) => {
      const notification = createPriceAlertNotification(alert, currentPrice);
      const notificationId = notificationManager.addNotification(notification);

      // Update alert with notification ID
      notificationManager.updatePriceAlert(alert.id, { notificationId });
    });

    // Refresh price alerts state
    setPriceAlerts(notificationManager.getAllPriceAlerts());
  }, []);

  const unreadCount = notifications.filter((n) => n.status === NotificationStatus.UNREAD).length;

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    archiveNotification,
    deleteNotification,
    clearAllNotifications,
    priceAlerts,
    addPriceAlert,
    updatePriceAlert,
    deletePriceAlert,
    preferences,
    updatePreferences,
    resetPreferences,
    requestPermission,
    checkPriceAlerts,
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

// Hook to use notifications
export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Specialized hooks for specific use cases
export const usePriceAlerts = () => {
  const { priceAlerts, addPriceAlert, updatePriceAlert, deletePriceAlert, checkPriceAlerts } =
    useNotifications();

  const createPriceAlert = useCallback(
    (
      symbol: string,
      targetPrice: number,
      condition: 'above' | 'below' | 'crosses_above' | 'crosses_below',
    ) => {
      return addPriceAlert({
        symbol,
        targetPrice,
        condition,
      });
    },
    [addPriceAlert],
  );

  const getActiveAlerts = useCallback(
    (symbol?: string) => {
      return priceAlerts.filter((alert) => alert.isActive && (!symbol || alert.symbol === symbol));
    },
    [priceAlerts],
  );

  const getTriggeredAlerts = useCallback(
    (symbol?: string) => {
      return priceAlerts.filter(
        (alert) => alert.triggeredAt && (!symbol || alert.symbol === symbol),
      );
    },
    [priceAlerts],
  );

  return {
    priceAlerts,
    createPriceAlert,
    updatePriceAlert,
    deletePriceAlert,
    getActiveAlerts,
    getTriggeredAlerts,
    checkPriceAlerts,
  };
};

export const useOrderNotifications = () => {
  const { addNotification } = useNotifications();

  const notifyOrderFilled = useCallback(
    (orderId: string, symbol: string, filledAmount: number, price: number) => {
      const notification = createOrderNotification(
        orderId,
        NotificationType.ORDER_FILLED,
        symbol,
        `Filled ${filledAmount} at $${price.toFixed(2)}`,
      );
      addNotification(notification);
    },
    [addNotification],
  );

  const notifyOrderPartial = useCallback(
    (
      orderId: string,
      symbol: string,
      filledAmount: number,
      remainingAmount: number,
      price: number,
    ) => {
      const notification = createOrderNotification(
        orderId,
        NotificationType.ORDER_PARTIAL,
        symbol,
        `Partially filled ${filledAmount}/${filledAmount + remainingAmount} at $${price.toFixed(2)}`,
      );
      addNotification(notification);
    },
    [addNotification],
  );

  const notifyOrderCancelled = useCallback(
    (orderId: string, symbol: string, reason?: string) => {
      const notification = createOrderNotification(
        orderId,
        NotificationType.ORDER_CANCELLED,
        symbol,
        reason ? `Cancelled: ${reason}` : 'Order cancelled',
      );
      addNotification(notification);
    },
    [addNotification],
  );

  const notifyOrderExpired = useCallback(
    (orderId: string, symbol: string) => {
      const notification = createOrderNotification(
        orderId,
        NotificationType.ORDER_EXPIRED,
        symbol,
        'Order expired',
      );
      addNotification(notification);
    },
    [addNotification],
  );

  return {
    notifyOrderFilled,
    notifyOrderPartial,
    notifyOrderCancelled,
    notifyOrderExpired,
  };
};

export const useNotificationPreferences = () => {
  const { preferences, updatePreferences, resetPreferences, requestPermission } =
    useNotifications();

  const updateSoundEnabled = useCallback(
    (enabled: boolean) => {
      updatePreferences({ enableSound: enabled });
    },
    [updatePreferences],
  );

  const updateDesktopEnabled = useCallback(
    (enabled: boolean) => {
      updatePreferences({ enableDesktop: enabled });
    },
    [updatePreferences],
  );

  const updatePriceAlertsEnabled = useCallback(
    (enabled: boolean) => {
      updatePreferences({ priceAlerts: enabled });
    },
    [updatePreferences],
  );

  const updateOrderUpdatesEnabled = useCallback(
    (enabled: boolean) => {
      updatePreferences({ orderUpdates: enabled });
    },
    [updatePreferences],
  );

  const updateMinimumPriority = useCallback(
    (priority: NotificationPriority) => {
      updatePreferences({ minimumPriority: priority });
    },
    [updatePreferences],
  );

  const updateQuietHours = useCallback(
    (enabled: boolean, start?: string, end?: string) => {
      updatePreferences({
        quietHours: {
          enabled,
          start: start || preferences.quietHours.start,
          end: end || preferences.quietHours.end,
        },
      });
    },
    [updatePreferences, preferences.quietHours],
  );

  return {
    preferences,
    updateSoundEnabled,
    updateDesktopEnabled,
    updatePriceAlertsEnabled,
    updateOrderUpdatesEnabled,
    updateMinimumPriority,
    updateQuietHours,
    resetPreferences,
    requestPermission,
  };
};
