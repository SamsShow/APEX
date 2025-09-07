'use client';

import React, { useState } from 'react';
import { Bell, X, Settings, Archive, Trash2, Check, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationStatus, NotificationPriority, NotificationType } from '@/lib/notifications';
import { cn } from '@/lib/utils';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  isOpen,
  onClose,
  className,
}) => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    archiveNotification,
    deleteNotification,
    clearAllNotifications,
  } = useNotifications();

  const [filter, setFilter] = useState<'all' | 'unread' | 'archived'>('all');

  if (!isOpen) return null;

  const filteredNotifications = notifications.filter((notification) => {
    switch (filter) {
      case 'unread':
        return notification.status === NotificationStatus.UNREAD;
      case 'archived':
        return notification.status === NotificationStatus.ARCHIVED;
      default:
        return notification.status !== NotificationStatus.ARCHIVED;
    }
  });

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

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.PRICE_ALERT:
        return '🚨';
      case NotificationType.ORDER_FILLED:
        return '✅';
      case NotificationType.ORDER_PARTIAL:
        return '🔄';
      case NotificationType.ORDER_CANCELLED:
        return '❌';
      case NotificationType.ORDER_EXPIRED:
        return '⏰';
      case NotificationType.POSITION_LIQUIDATED:
        return '💥';
      case NotificationType.PRICE_BREAKOUT:
        return '📈';
      case NotificationType.MARKET_NEWS:
        return '📰';
      case NotificationType.SYSTEM_MAINTENANCE:
        return '🔧';
      case NotificationType.WALLET_DISCONNECTED:
        return '🔌';
      default:
        return '🔔';
    }
  };

  return (
    <div
      className={cn(
        'fixed top-16 right-4 z-50 w-96 max-h-[calc(100vh-5rem)] bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl overflow-hidden',
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-700">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-zinc-300" />
          <h3 className="text-lg font-semibold text-zinc-200">Notifications</h3>
          {unreadCount > 0 && (
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-zinc-400 hover:text-zinc-200"
            >
              <CheckCheck className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-200"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex border-b border-zinc-700">
        {[
          {
            key: 'all',
            label: 'All',
            count: notifications.filter((n) => n.status !== NotificationStatus.ARCHIVED).length,
          },
          { key: 'unread', label: 'Unread', count: unreadCount },
          {
            key: 'archived',
            label: 'Archived',
            count: notifications.filter((n) => n.status === NotificationStatus.ARCHIVED).length,
          },
        ].map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setFilter(key as any)}
            className={cn(
              'flex-1 py-2 px-4 text-sm font-medium transition-colors',
              filter === key
                ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/10'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50',
            )}
          >
            {label} {count > 0 && `(${count})`}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="max-h-96 overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
            <Bell className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-center">
              {filter === 'unread' && 'No unread notifications'}
              {filter === 'archived' && 'No archived notifications'}
              {filter === 'all' && 'No notifications yet'}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={markAsRead}
              onArchive={archiveNotification}
              onDelete={deleteNotification}
              getPriorityColor={getPriorityColor}
              getTypeIcon={getTypeIcon}
            />
          ))
        )}
      </div>

      {/* Footer */}
      {filteredNotifications.length > 0 && (
        <div className="border-t border-zinc-700 p-3 flex justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllNotifications}
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              /* Open settings */
            }}
            className="text-zinc-400 hover:text-zinc-200"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      )}
    </div>
  );
};

interface NotificationItemProps {
  notification: any;
  onMarkAsRead: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  getPriorityColor: (priority: NotificationPriority) => string;
  getTypeIcon: (type: NotificationType) => string;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onArchive,
  onDelete,
  getPriorityColor,
  getTypeIcon,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div
      className={cn(
        'border-l-4 p-4 hover:bg-zinc-800/50 transition-colors cursor-pointer',
        getPriorityColor(notification.priority),
        notification.status === NotificationStatus.UNREAD && 'bg-blue-500/5',
      )}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-start gap-3">
        <span className="text-lg flex-shrink-0 mt-0.5">{getTypeIcon(notification.type)}</span>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <h4 className="text-sm font-medium text-zinc-200 truncate pr-2">
              {notification.title}
            </h4>
            <div className="flex items-center gap-1 flex-shrink-0">
              {notification.status === NotificationStatus.UNREAD && (
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
              <span className="text-xs text-zinc-500">{formatTime(notification.timestamp)}</span>
            </div>
          </div>

          <p className="text-sm text-zinc-400 mt-1 line-clamp-2">{notification.message}</p>

          {notification.actions && notification.actions.length > 0 && isExpanded && (
            <div className="flex gap-2 mt-3">
              {notification.actions.map((action: any, index: number) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs h-7"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle action
                    console.log('Action:', action);
                  }}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {notification.status === NotificationStatus.UNREAD && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onMarkAsRead(notification.id);
              }}
              className="h-6 w-6 p-0 text-zinc-400 hover:text-zinc-200"
            >
              <Check className="w-3 h-3" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onArchive(notification.id);
            }}
            className="h-6 w-6 p-0 text-zinc-400 hover:text-zinc-200"
          >
            <Archive className="w-3 h-3" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(notification.id);
            }}
            className="h-6 w-6 p-0 text-zinc-400 hover:text-red-400"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};
