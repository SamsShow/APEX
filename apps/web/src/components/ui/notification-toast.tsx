'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { Notification } from '@/hooks/useNotifications';

interface NotificationToastProps {
  notification: Notification;
  onRemove: (id: string) => void;
}

const getIcon = (type: Notification['type']) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'error':
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    case 'warning':
      return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    case 'info':
      return <Info className="w-5 h-5 text-blue-500" />;
    default:
      return <Info className="w-5 h-5 text-blue-500" />;
  }
};

const getBorderColor = (type: Notification['type']) => {
  switch (type) {
    case 'success':
      return 'border-green-500';
    case 'error':
      return 'border-red-500';
    case 'warning':
      return 'border-yellow-500';
    case 'info':
      return 'border-blue-500';
    default:
      return 'border-blue-500';
  }
};

const getBackgroundColor = (type: Notification['type']) => {
  switch (type) {
    case 'success':
      return 'bg-green-50 dark:bg-green-950/20';
    case 'error':
      return 'bg-red-50 dark:bg-red-950/20';
    case 'warning':
      return 'bg-yellow-50 dark:bg-yellow-950/20';
    case 'info':
      return 'bg-blue-50 dark:bg-blue-950/20';
    default:
      return 'bg-blue-50 dark:bg-blue-950/20';
  }
};

export function NotificationToast({ notification, onRemove }: NotificationToastProps) {
  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;

    if (diff < 60000) {
      // Less than 1 minute
      return 'Just now';
    } else if (diff < 3600000) {
      // Less than 1 hour
      return `${Math.floor(diff / 60000)}m ago`;
    } else if (diff < 86400000) {
      // Less than 1 day
      return `${Math.floor(diff / 3600000)}h ago`;
    } else {
      return new Date(timestamp).toLocaleDateString();
    }
  };

  return (
    <div
      className={`relative p-4 rounded-lg border-l-4 shadow-lg backdrop-blur-sm bg-white/95 dark:bg-zinc-900/95 ${getBorderColor(
        notification.type,
      )} ${getBackgroundColor(notification.type)} animate-in slide-in-from-right-2 duration-300`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">{getIcon(notification.type)}</div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {notification.title}
              </h4>

              {notification.message && (
                <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-1">
                  {notification.message}
                </p>
              )}

              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {formatTimestamp(notification.timestamp)}
                </span>

                {notification.action && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={notification.action.onClick}
                    className="h-6 px-2 text-xs"
                  >
                    {notification.action.label}
                  </Button>
                )}
              </div>
            </div>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => onRemove(notification.id)}
              className="h-6 w-6 p-0 hover:bg-zinc-200 dark:hover:bg-zinc-800"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
