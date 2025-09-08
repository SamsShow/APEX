'use client';

import React, { useState } from 'react';
import { Settings, Bell, BellOff, Monitor, Mail, AlertTriangle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useNotificationPreferences } from '@/hooks/useNotifications';
import { NotificationPriority } from '@/lib/notifications';

interface NotificationSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  isOpen,
  onClose,
  className,
}) => {
  const {
    preferences,
    updateSoundEnabled,
    updateDesktopEnabled,
    updatePriceAlertsEnabled,
    updateOrderUpdatesEnabled,
    updateMinimumPriority,
    updateQuietHours,
    resetPreferences,
    requestPermission,
  } = useNotificationPreferences();

  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    const status = await requestPermission();
    setPermissionStatus(status);
  };

  return (
    <div
      className={`fixed top-16 right-4 z-50 w-96 max-h-[calc(100vh-5rem)] bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl overflow-hidden ${className}`}
    >
      <div className="flex items-center justify-between p-4 border-b border-zinc-700">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-zinc-300" />
          <h3 className="text-lg font-semibold text-zinc-200">Notification Settings</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-zinc-400 hover:text-zinc-200"
        >
          ✕
        </Button>
      </div>

      <div className="max-h-[calc(100vh-8rem)] overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* General Settings */}
          <div>
            <h4 className="text-sm font-medium text-zinc-200 mb-4 flex items-center gap-2">
              <Bell className="w-4 h-4" />
              General Settings
            </h4>

            <div className="space-y-4">
              {/* Sound Notifications */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4 text-zinc-400" />
                  <div>
                    <div className="text-sm font-medium text-zinc-200">Sound Notifications</div>
                    <div className="text-xs text-zinc-500">Play sound for notifications</div>
                  </div>
                </div>
                <Switch checked={preferences.enableSound} onCheckedChange={updateSoundEnabled} />
              </div>

              {/* Desktop Notifications */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Monitor className="w-4 h-4 text-zinc-400" />
                  <div>
                    <div className="text-sm font-medium text-zinc-200">Desktop Notifications</div>
                    <div className="text-xs text-zinc-500">Show browser notifications</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={preferences.enableDesktop}
                    onCheckedChange={updateDesktopEnabled}
                  />
                  {preferences.enableDesktop && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRequestPermission}
                      className="text-xs"
                    >
                      {permissionStatus === 'granted'
                        ? '✅ Granted'
                        : permissionStatus === 'denied'
                          ? '❌ Denied'
                          : 'Request'}
                    </Button>
                  )}
                </div>
              </div>

              {/* Minimum Priority */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-4 h-4 text-zinc-400" />
                  <div>
                    <div className="text-sm font-medium text-zinc-200">Minimum Priority</div>
                    <div className="text-xs text-zinc-500">
                      Only show notifications above this level
                    </div>
                  </div>
                </div>
                <Select
                  value={preferences.minimumPriority}
                  onValueChange={(value: NotificationPriority) => updateMinimumPriority(value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NotificationPriority.LOW}>Low</SelectItem>
                    <SelectItem value={NotificationPriority.MEDIUM}>Medium</SelectItem>
                    <SelectItem value={NotificationPriority.HIGH}>High</SelectItem>
                    <SelectItem value={NotificationPriority.CRITICAL}>Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Notification Types */}
          <div>
            <h4 className="text-sm font-medium text-zinc-200 mb-4 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Notification Types
            </h4>

            <div className="space-y-4">
              {/* Price Alerts */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-green-500/20 flex items-center justify-center">
                    <span className="text-xs">💰</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-zinc-200">Price Alerts</div>
                    <div className="text-xs text-zinc-500">
                      Notifications when prices hit targets
                    </div>
                  </div>
                </div>
                <Switch
                  checked={preferences.priceAlerts}
                  onCheckedChange={updatePriceAlertsEnabled}
                />
              </div>

              {/* Order Updates */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-blue-500/20 flex items-center justify-center">
                    <span className="text-xs">📋</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-zinc-200">Order Updates</div>
                    <div className="text-xs text-zinc-500">
                      Filled, cancelled, and expired orders
                    </div>
                  </div>
                </div>
                <Switch
                  checked={preferences.orderUpdates}
                  onCheckedChange={updateOrderUpdatesEnabled}
                />
              </div>

              {/* Market News */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-yellow-500/20 flex items-center justify-center">
                    <span className="text-xs">📰</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-zinc-200">Market News</div>
                    <div className="text-xs text-zinc-500">Important market announcements</div>
                  </div>
                </div>
                <Switch
                  checked={preferences.marketNews}
                  onCheckedChange={(enabled) => {
                    // This would be implemented in the preferences hook
                  }}
                />
              </div>
            </div>
          </div>

          {/* Quiet Hours */}
          <div>
            <h4 className="text-sm font-medium text-zinc-200 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Quiet Hours
            </h4>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-zinc-200">Enable Quiet Hours</div>
                  <div className="text-xs text-zinc-500">
                    Disable notifications during specified hours
                  </div>
                </div>
                <Switch
                  checked={preferences.quietHours.enabled}
                  onCheckedChange={(enabled) => updateQuietHours(enabled)}
                />
              </div>

              {preferences.quietHours.enabled && (
                <div className="grid grid-cols-2 gap-3 p-3 bg-zinc-800/50 rounded-lg">
                  <div>
                    <label className="text-xs text-zinc-400 mb-1 block">Start Time</label>
                    <input
                      type="time"
                      value={preferences.quietHours.start}
                      onChange={(e) => updateQuietHours(true, e.target.value)}
                      className="w-full bg-zinc-900/50 border border-zinc-700 rounded px-3 py-2 text-sm text-zinc-200"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-400 mb-1 block">End Time</label>
                    <input
                      type="time"
                      value={preferences.quietHours.end}
                      onChange={(e) => updateQuietHours(true, undefined, e.target.value)}
                      className="w-full bg-zinc-900/50 border border-zinc-700 rounded px-3 py-2 text-sm text-zinc-200"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-zinc-700">
            <Button
              variant="outline"
              onClick={resetPreferences}
              className="w-full text-zinc-400 hover:text-zinc-200"
            >
              <BellOff className="w-4 h-4 mr-2" />
              Reset to Defaults
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
