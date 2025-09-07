'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationPriority } from '@/lib/notifications';
import { cn } from '@/lib/utils';

interface NotificationToastProps {
  notification: any;
  onDismiss: (id: string) => void;
  onAction?: (action: string, data?: any) => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  onDismiss,
  onAction,
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isExiting, setIsExiting] = React.useState(false);

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => onDismiss(notification.id), 300);
  };

  const getPriorityColor = (priority: NotificationPriority) => {
    switch (priority) {
      case NotificationPriority.CRITICAL:
        return 'border-red-500 bg-red-500/10';
      case NotificationPriority.HIGH:
        return 'border-orange-500 bg-orange-500/10';
      case NotificationPriority.MEDIUM:
        return 'border-yellow-500 bg-yellow-500/10';
      case NotificationPriority.LOW:
        return 'border-blue-500 bg-blue-500/10';
      default:
        return 'border-gray-500 bg-gray-500/10';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'price_alert':
        return '🚨';
      case 'order_filled':
        return '✅';
      case 'order_partial':
        return '🔄';
      case 'order_cancelled':
        return '❌';
      case 'order_expired':
        return '⏰';
      case 'position_liquidated':
        return '💥';
      case 'price_breakout':
        return '📈';
      case 'market_news':
        return '📰';
      case 'system_maintenance':
        return '🔧';
      case 'wallet_disconnected':
        return '🔌';
      default:
        return '🔔';
    }
  };

  return (
    <div
      className={cn(
        'max-w-sm w-full bg-zinc-900 border rounded-lg shadow-lg transition-all duration-300 transform',
        getPriorityColor(notification.priority),
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0',
        isExiting && 'translate-y-2 opacity-0 scale-95',
      )}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <span className="text-xl flex-shrink-0 mt-0.5">{getTypeIcon(notification.type)}</span>

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-zinc-200 mb-1">{notification.title}</h4>
            <p className="text-sm text-zinc-400 leading-relaxed">{notification.message}</p>

            {notification.actions && notification.actions.length > 0 && (
              <div className="flex gap-2 mt-3">
                {notification.actions.map((action: any, index: number) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => {
                      onAction?.(action.action, action.data);
                      handleDismiss();
                    }}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="h-6 w-6 p-0 text-zinc-400 hover:text-zinc-200 flex-shrink-0"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export const NotificationContainer: React.FC = () => {
  const { notifications } = useNotifications();
  const [visibleToasts, setVisibleToasts] = React.useState<Set<string>>(new Set());

  // Show new notifications as toasts
  useEffect(() => {
    const newNotifications = notifications.filter(
      (n) => !visibleToasts.has(n.id) && n.status !== 'archived',
    );

    newNotifications.forEach((notification) => {
      setVisibleToasts((prev) => new Set(prev).add(notification.id));

      // Auto-dismiss non-critical notifications after 5 seconds
      if (notification.priority !== NotificationPriority.CRITICAL) {
        setTimeout(() => {
          setVisibleToasts((prev) => {
            const next = new Set(prev);
            next.delete(notification.id);
            return next;
          });
        }, 5000);
      }
    });
  }, [notifications, visibleToasts]);

  const handleDismiss = (id: string) => {
    setVisibleToasts((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const handleAction = (action: string, data?: any) => {
    // Handle notification actions
    console.log('Notification action:', action, data);
    // You can implement routing or other actions here
  };

  const activeToasts = notifications.filter((n) => visibleToasts.has(n.id));

  if (activeToasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      {activeToasts.map((notification) => (
        <NotificationToast
          key={notification.id}
          notification={notification}
          onDismiss={handleDismiss}
          onAction={handleAction}
        />
      ))}
    </div>
  );
};
