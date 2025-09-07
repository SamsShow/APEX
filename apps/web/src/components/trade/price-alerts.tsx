'use client';

import React, { useState } from 'react';
import { Plus, Trash2, TrendingUp, TrendingDown, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePriceAlerts } from '@/hooks/useNotifications';
import { usePriceFeeds } from '@/hooks/usePriceFeeds';

interface PriceAlertsProps {
  symbol?: string;
  className?: string;
}

export const PriceAlerts: React.FC<PriceAlertsProps> = ({ symbol = 'APT/USD', className }) => {
  const { priceAlerts, createPriceAlert, deletePriceAlert, getActiveAlerts, getTriggeredAlerts } =
    usePriceAlerts();

  const { currentPrice } = usePriceFeeds(symbol);

  const [isCreating, setIsCreating] = useState(false);
  const [targetPrice, setTargetPrice] = useState('');
  const [condition, setCondition] = useState<'above' | 'below' | 'crosses_above' | 'crosses_below'>(
    'above',
  );

  const activeAlerts = getActiveAlerts(symbol);
  const triggeredAlerts = getTriggeredAlerts(symbol);

  const handleCreateAlert = () => {
    const price = parseFloat(targetPrice);
    if (!price || price <= 0) return;

    createPriceAlert(symbol, price, condition);
    setTargetPrice('');
    setIsCreating(false);
  };

  const formatCondition = (cond: string) => {
    switch (cond) {
      case 'above':
        return 'Price goes above';
      case 'below':
        return 'Price goes below';
      case 'crosses_above':
        return 'Price crosses above';
      case 'crosses_below':
        return 'Price crosses below';
      default:
        return cond;
    }
  };

  const getConditionIcon = (cond: string) => {
    switch (cond) {
      case 'above':
      case 'crosses_above':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'below':
      case 'crosses_below':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Target className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-zinc-200">
          <Target className="w-5 h-5" />
          Price Alerts
          <span className="text-sm font-normal text-zinc-400">({activeAlerts.length} active)</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Current Price Display */}
        <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
          <span className="text-sm text-zinc-400">Current Price:</span>
          <span className="text-lg font-mono font-semibold text-zinc-200">
            ${currentPrice?.toFixed(2) || '--'}
          </span>
        </div>

        {/* Create Alert Form */}
        {isCreating ? (
          <div className="space-y-3 p-4 border border-zinc-700 rounded-lg bg-zinc-800/30">
            <h4 className="text-sm font-medium text-zinc-200">Create Price Alert</h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Target Price</label>
                <Input
                  type="number"
                  placeholder="100.00"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  className="bg-zinc-900/50 border-zinc-700 h-10"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Condition</label>
                <Select value={condition} onValueChange={(value: any) => setCondition(value)}>
                  <SelectTrigger className="bg-zinc-900/50 border-zinc-700 h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="above">Goes Above</SelectItem>
                    <SelectItem value="below">Goes Below</SelectItem>
                    <SelectItem value="crosses_above">Crosses Above</SelectItem>
                    <SelectItem value="crosses_below">Crosses Below</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleCreateAlert}
                disabled={!targetPrice || parseFloat(targetPrice) <= 0}
                className="flex-1"
              >
                Create Alert
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreating(false);
                  setTargetPrice('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button onClick={() => setIsCreating(true)} className="w-full" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Price Alert
          </Button>
        )}

        {/* Active Alerts */}
        {activeAlerts.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-zinc-200">Active Alerts</h4>
            <div className="space-y-2">
              {activeAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg border border-zinc-700"
                >
                  <div className="flex items-center gap-3">
                    {getConditionIcon(alert.condition)}
                    <div>
                      <div className="text-sm font-medium text-zinc-200">
                        ${alert.targetPrice.toFixed(2)}
                      </div>
                      <div className="text-xs text-zinc-400">
                        {formatCondition(alert.condition)}
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deletePriceAlert(alert.id)}
                    className="text-zinc-400 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Triggered Alerts */}
        {triggeredAlerts.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-zinc-200">Recent Alerts</h4>
            <div className="space-y-2">
              {triggeredAlerts.slice(0, 5).map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-3 bg-green-900/20 border border-green-700/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <div className="text-sm font-medium text-zinc-200">
                        ${alert.targetPrice.toFixed(2)} triggered
                      </div>
                      <div className="text-xs text-zinc-400">
                        {formatCondition(alert.condition)} •{' '}
                        {alert.triggeredAt?.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deletePriceAlert(alert.id)}
                    className="text-zinc-400 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {activeAlerts.length === 0 && triggeredAlerts.length === 0 && !isCreating && (
          <div className="text-center py-8 text-zinc-500">
            <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">No price alerts yet</p>
            <p className="text-xs text-zinc-600 mt-1">
              Create alerts to get notified when prices hit your targets
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
