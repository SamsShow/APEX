'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Calculator, TrendingUp, Target } from 'lucide-react';
import { useOptionsPricing } from '@/hooks/useOptionsPricing';
import { usePriceFeeds } from '@/hooks/usePriceFeeds';

export interface StrategyLeg {
  id: string;
  type: 'call' | 'put' | 'stock';
  strikePrice: number;
  quantity: number;
  side: 'long' | 'short';
}

export interface Strategy {
  id: string;
  name: string;
  description: string;
  legs: StrategyLeg[];
  underlyingPrice: number;
  expiryDays: number;
  totalCost: number;
  maxProfit: number;
  maxLoss: number;
  breakevenPoints: number[];
  riskRewardRatio: number;
}

const PREDEFINED_STRATEGIES = {
  long_call: {
    name: 'Long Call',
    description: 'Bullish strategy - profit from price increase',
    legs: [{ id: '1', type: 'call' as const, strikePrice: 0, quantity: 1, side: 'long' as const }],
  },
  long_put: {
    name: 'Long Put',
    description: 'Bearish strategy - profit from price decrease',
    legs: [{ id: '1', type: 'put' as const, strikePrice: 0, quantity: 1, side: 'long' as const }],
  },
  covered_call: {
    name: 'Covered Call',
    description: 'Generate income while holding underlying asset',
    legs: [
      { id: '1', type: 'call' as const, strikePrice: 0, quantity: -1, side: 'short' as const },
      { id: '2', type: 'stock' as const, strikePrice: 0, quantity: 100, side: 'long' as const },
    ],
  },
  protective_put: {
    name: 'Protective Put',
    description: 'Protect existing position from downside risk',
    legs: [
      { id: '1', type: 'put' as const, strikePrice: 0, quantity: 1, side: 'long' as const },
      { id: '2', type: 'stock' as const, strikePrice: 0, quantity: -100, side: 'short' as const },
    ],
  },
  bull_call_spread: {
    name: 'Bull Call Spread',
    description: 'Limited risk bullish strategy',
    legs: [
      { id: '1', type: 'call' as const, strikePrice: 0, quantity: 1, side: 'long' as const },
      { id: '2', type: 'call' as const, strikePrice: 0, quantity: -1, side: 'short' as const },
    ],
  },
  bear_put_spread: {
    name: 'Bear Put Spread',
    description: 'Limited risk bearish strategy',
    legs: [
      { id: '1', type: 'put' as const, strikePrice: 0, quantity: 1, side: 'long' as const },
      { id: '2', type: 'put' as const, strikePrice: 0, quantity: -1, side: 'short' as const },
    ],
  },
  iron_condor: {
    name: 'Iron Condor',
    description: 'Neutral strategy with limited risk and reward',
    legs: [
      { id: '1', type: 'put' as const, strikePrice: 0, quantity: 1, side: 'long' as const },
      { id: '2', type: 'put' as const, strikePrice: 0, quantity: -1, side: 'short' as const },
      { id: '3', type: 'call' as const, strikePrice: 0, quantity: -1, side: 'short' as const },
      { id: '4', type: 'call' as const, strikePrice: 0, quantity: 1, side: 'long' as const },
    ],
  },
};

export function StrategyBuilder() {
  const { calculateOptionPrice } = useOptionsPricing();
  const { prices } = usePriceFeeds();

  const [selectedStrategy, setSelectedStrategy] = useState<string>('');
  const [customStrategy, setCustomStrategy] = useState<Strategy>({
    id: 'custom',
    name: 'Custom Strategy',
    description: 'Build your own strategy',
    legs: [],
    underlyingPrice: 0,
    expiryDays: 30,
    totalCost: 0,
    maxProfit: 0,
    maxLoss: 0,
    breakevenPoints: [],
    riskRewardRatio: 0,
  });

  const [underlyingPrice, setUnderlyingPrice] = useState(5.0);
  const [expiryDays, setExpiryDays] = useState(30);

  // Update underlying price from price feeds
  React.useEffect(() => {
    const aptPrice = prices['APT']?.price;
    if (aptPrice) {
      setUnderlyingPrice(aptPrice);
    }
  }, [prices]);

  // Load predefined strategy
  const loadPredefinedStrategy = (strategyKey: string) => {
    const strategy = PREDEFINED_STRATEGIES[strategyKey as keyof typeof PREDEFINED_STRATEGIES];
    if (strategy) {
      setSelectedStrategy(strategyKey);
      setCustomStrategy((prev) => ({
        ...prev,
        name: strategy.name,
        description: strategy.description,
        legs: strategy.legs.map((leg) => ({ ...leg, strikePrice: underlyingPrice * 1.1 })), // Set reasonable strikes
      }));
    }
  };

  // Add new leg to custom strategy
  const addLeg = () => {
    const newLeg: StrategyLeg = {
      id: Date.now().toString(),
      type: 'call',
      strikePrice: underlyingPrice * 1.1,
      quantity: 1,
      side: 'long',
    };

    setCustomStrategy((prev) => ({
      ...prev,
      legs: [...prev.legs, newLeg],
    }));
  };

  // Remove leg from strategy
  const removeLeg = (legId: string) => {
    setCustomStrategy((prev) => ({
      ...prev,
      legs: prev.legs.filter((leg) => leg.id !== legId),
    }));
  };

  // Update leg
  const updateLeg = (legId: string, updates: Partial<StrategyLeg>) => {
    setCustomStrategy((prev) => ({
      ...prev,
      legs: prev.legs.map((leg) => (leg.id === legId ? { ...leg, ...updates } : leg)),
    }));
  };

  // Calculate strategy metrics
  const strategyMetrics = useMemo(() => {
    const legs = customStrategy.legs;
    let totalCost = 0;
    let maxProfit = 0;
    let maxLoss = 0;
    const breakevenPoints: number[] = [];

    legs.forEach((leg) => {
      if (leg.type === 'call' || leg.type === 'put') {
        const optionPrice = calculateOptionPrice('APT', leg.strikePrice, expiryDays, leg.type);

        if (optionPrice) {
          const legCost =
            optionPrice.theoreticalPrice * Math.abs(leg.quantity) * (leg.side === 'long' ? 1 : -1);
          totalCost += legCost;

          // Calculate max profit/loss for this leg
          if (leg.type === 'call') {
            if (leg.side === 'long') {
              maxProfit += Infinity; // Unlimited upside
              maxLoss += legCost;
              breakevenPoints.push(leg.strikePrice + optionPrice.theoreticalPrice);
            } else {
              maxProfit += legCost;
              maxLoss += Infinity;
              breakevenPoints.push(leg.strikePrice + optionPrice.theoreticalPrice);
            }
          } else {
            // put
            if (leg.side === 'long') {
              maxProfit += leg.strikePrice - optionPrice.theoreticalPrice;
              maxLoss += legCost;
              breakevenPoints.push(leg.strikePrice - optionPrice.theoreticalPrice);
            } else {
              maxProfit += legCost;
              maxLoss += leg.strikePrice - optionPrice.theoreticalPrice;
              breakevenPoints.push(leg.strikePrice - optionPrice.theoreticalPrice);
            }
          }
        }
      }
    });

    const riskRewardRatio = maxLoss > 0 ? maxProfit / maxLoss : 0;

    return {
      totalCost,
      maxProfit,
      maxLoss,
      breakevenPoints: Array.from(new Set(breakevenPoints)).sort((a, b) => a - b),
      riskRewardRatio,
    };
  }, [customStrategy.legs, expiryDays, calculateOptionPrice]);

  // Update strategy with calculated metrics
  React.useEffect(() => {
    setCustomStrategy((prev) => ({
      ...prev,
      ...strategyMetrics,
      underlyingPrice,
      expiryDays,
    }));
  }, [strategyMetrics, underlyingPrice, expiryDays]);

  return (
    <div className="space-y-6">
      {/* Strategy Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Strategy Builder</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Predefined Strategies</label>
              <Select value={selectedStrategy} onValueChange={loadPredefinedStrategy}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a strategy" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PREDEFINED_STRATEGIES).map(([key, strategy]) => (
                    <SelectItem key={key} value={key}>
                      {strategy.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Underlying Price</label>
              <Input
                type="number"
                value={underlyingPrice}
                onChange={(e) => setUnderlyingPrice(parseFloat(e.target.value))}
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Expiry (Days)</label>
              <Input
                type="number"
                value={expiryDays}
                onChange={(e) => setExpiryDays(parseInt(e.target.value))}
                min="1"
                max="365"
              />
            </div>
          </div>

          {selectedStrategy && (
            <div className="mt-4 p-4 bg-zinc-900/50 rounded-lg">
              <h3 className="font-semibold">{customStrategy.name}</h3>
              <p className="text-sm text-zinc-400">{customStrategy.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Strategy Legs */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Strategy Legs</CardTitle>
            <Button onClick={addLeg} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Leg
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {customStrategy.legs.map((leg, index) => (
              <div key={leg.id} className="flex items-center gap-4 p-4 bg-zinc-900/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Leg {index + 1}</span>
                  <Badge variant={leg.side === 'long' ? 'default' : 'secondary'}>
                    {leg.side.toUpperCase()}
                  </Badge>
                </div>

                <Select
                  value={leg.type}
                  onValueChange={(value: 'call' | 'put' | 'stock') =>
                    updateLeg(leg.id, { type: value })
                  }
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="call">Call</SelectItem>
                    <SelectItem value="put">Put</SelectItem>
                    <SelectItem value="stock">Stock</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  type="number"
                  placeholder="Strike"
                  value={leg.strikePrice}
                  onChange={(e) => updateLeg(leg.id, { strikePrice: parseFloat(e.target.value) })}
                  className="w-24"
                  step="0.01"
                />

                <Input
                  type="number"
                  placeholder="Qty"
                  value={leg.quantity}
                  onChange={(e) => updateLeg(leg.id, { quantity: parseInt(e.target.value) })}
                  className="w-20"
                  min="1"
                />

                <Select
                  value={leg.side}
                  onValueChange={(value: 'long' | 'short') => updateLeg(leg.id, { side: value })}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="long">Long</SelectItem>
                    <SelectItem value="short">Short</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  onClick={() => removeLeg(leg.id)}
                  variant="outline"
                  size="sm"
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}

            {customStrategy.legs.length === 0 && (
              <div className="text-center py-8 text-zinc-400">
                <Calculator className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Add strategy legs to see analysis</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Strategy Analysis */}
      {customStrategy.legs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Strategy Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Cost:</span>
                  <span className="font-semibold">${customStrategy.totalCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Max Profit:</span>
                  <span className="font-semibold text-green-400">
                    {customStrategy.maxProfit === Infinity
                      ? 'Unlimited'
                      : `$${customStrategy.maxProfit.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Max Loss:</span>
                  <span className="font-semibold text-red-400">
                    {customStrategy.maxLoss === Infinity
                      ? 'Unlimited'
                      : `$${customStrategy.maxLoss.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Risk/Reward:</span>
                  <span className="font-semibold">
                    {customStrategy.maxLoss > 0 && customStrategy.maxProfit !== Infinity
                      ? `${customStrategy.riskRewardRatio.toFixed(2)}:1`
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Breakeven Points</CardTitle>
            </CardHeader>
            <CardContent>
              {customStrategy.breakevenPoints.length > 0 ? (
                <div className="space-y-2">
                  {customStrategy.breakevenPoints.map((point, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-zinc-400" />
                      <span>${point.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-zinc-400">No breakeven points calculated</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Payoff Diagram Placeholder */}
      {customStrategy.legs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Strategy Payoff Diagram</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-zinc-900/50 rounded-lg flex items-center justify-center">
              <div className="text-center text-zinc-400">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Payoff diagram visualization</p>
                <p className="text-sm">Coming soon...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
