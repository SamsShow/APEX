'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
// TODO: Import when implementing real order execution
// import { useOptionsContract } from '@/hooks/useOptionsContract';
import { usePriceFeeds } from '@/hooks/usePriceFeeds';
import { useNotifications } from '@/hooks/useNotifications';
import {
  Clock,
  TrendingUp,
  TrendingDown,
  Target,
  AlertCircle,
  CheckCircle,
  XCircle,
} from 'lucide-react';

export interface AdvancedOrder {
  id: string;
  type: 'limit' | 'stop' | 'stop_limit' | 'trailing_stop';
  side: 'buy' | 'sell';
  symbol: string;
  quantity: number;
  limitPrice?: number;
  stopPrice?: number;
  trailingStopPercent?: number;
  timeInForce: 'GTC' | 'IOC' | 'FOK' | 'GTD';
  expiryDate?: Date;
  status: 'pending' | 'active' | 'filled' | 'cancelled' | 'expired';
  createdAt: Date;
}

interface AdvancedOrderPanelProps {
  symbol?: string;
  onOrderPlaced?: (order: AdvancedOrder) => void;
  className?: string;
}

export function AdvancedOrderPanel({
  symbol = 'APT',
  onOrderPlaced,
  className = '',
}: AdvancedOrderPanelProps) {
  const { prices } = usePriceFeeds();
  // TODO: Use createOption when implementing real order execution
  // const { createOption } = useOptionsContract();
  const { notifySuccess, notifyError } = useNotifications();

  const [orderForm, setOrderForm] = useState<{
    type: 'limit' | 'stop' | 'stop_limit' | 'trailing_stop';
    side: 'buy' | 'sell';
    quantity: number;
    limitPrice: string;
    stopPrice: string;
    trailingStopPercent: string;
    timeInForce: 'GTC' | 'IOC' | 'FOK' | 'GTD';
    expiryDate: string;
  }>({
    type: 'limit',
    side: 'buy',
    quantity: 1,
    limitPrice: '',
    stopPrice: '',
    trailingStopPercent: '',
    timeInForce: 'GTC',
    expiryDate: '',
  });

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [activeOrders, setActiveOrders] = useState<AdvancedOrder[]>([]);

  const currentPrice = prices[symbol]?.price || 0;
  const priceChange = prices[symbol]?.changePercent24h || 0;

  const handlePlaceOrder = async () => {
    if (!orderForm.quantity || orderForm.quantity <= 0) {
      notifyError('Invalid Quantity', 'Please enter a valid quantity');
      return;
    }

    // Validate price fields based on order type
    const type = orderForm.type as 'limit' | 'stop' | 'stop_limit' | 'trailing_stop';

    if (type === 'limit' && !orderForm.limitPrice) {
      notifyError('Missing Price', 'Please enter a limit price');
      return;
    }

    if (type === 'stop' && !orderForm.stopPrice) {
      notifyError('Missing Price', 'Please enter a stop price');
      return;
    }

    if (type === 'stop_limit' && (!orderForm.stopPrice || !orderForm.limitPrice)) {
      notifyError('Missing Prices', 'Please enter both stop and limit prices');
      return;
    }

    if (type === 'trailing_stop' && !orderForm.trailingStopPercent) {
      notifyError('Missing Percentage', 'Please enter trailing stop percentage');
      return;
    }

    setIsPlacingOrder(true);

    try {
      const order: AdvancedOrder = {
        id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: orderForm.type,
        side: orderForm.side,
        symbol,
        quantity: orderForm.quantity,
        limitPrice: orderForm.limitPrice ? parseFloat(orderForm.limitPrice) : undefined,
        stopPrice: orderForm.stopPrice ? parseFloat(orderForm.stopPrice) : undefined,
        trailingStopPercent: orderForm.trailingStopPercent
          ? parseFloat(orderForm.trailingStopPercent)
          : undefined,
        timeInForce: orderForm.timeInForce,
        expiryDate: orderForm.expiryDate ? new Date(orderForm.expiryDate) : undefined,
        status: 'pending',
        createdAt: new Date(),
      };

      // For demo purposes, we'll simulate order placement
      // In a real implementation, this would call the order management system
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate order activation
      const activeOrder = { ...order, status: 'active' as const };
      setActiveOrders((prev) => [...prev, activeOrder]);

      notifySuccess(
        'Order Placed',
        `${orderForm.type.toUpperCase()} order for ${orderForm.quantity} ${symbol} has been placed`,
      );

      if (onOrderPlaced) {
        onOrderPlaced(activeOrder);
      }

      // Reset form
      setOrderForm({
        type: 'limit',
        side: 'buy',
        quantity: 1,
        limitPrice: '',
        stopPrice: '',
        trailingStopPercent: '',
        timeInForce: 'GTC',
        expiryDate: '',
      });
    } catch (error) {
      console.error('Failed to place order:', error);
      notifyError('Order Failed', 'Failed to place the order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const cancelOrder = (orderId: string) => {
    setActiveOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: 'cancelled' as const } : order,
      ),
    );
    notifySuccess('Order Cancelled', 'The order has been cancelled successfully');
  };

  const getOrderTypeDescription = (type: string) => {
    switch (type) {
      case 'limit':
        return 'Buy or sell at a specific price or better';
      case 'stop':
        return 'Trigger a market order when price reaches stop level';
      case 'stop_limit':
        return 'Trigger a limit order when price reaches stop level';
      case 'trailing_stop':
        return 'Stop loss that trails the price movement';
      default:
        return '';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock className="w-4 h-4 text-blue-400" />;
      case 'filled':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'expired':
        return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      default:
        return <Clock className="w-4 h-4 text-zinc-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-blue-400';
      case 'filled':
        return 'text-green-400';
      case 'cancelled':
        return 'text-red-400';
      case 'expired':
        return 'text-yellow-400';
      default:
        return 'text-zinc-400';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Form */}
        <Card className="bg-zinc-900/50 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-zinc-200">Advanced Order</CardTitle>
            <p className="text-zinc-400 text-sm">
              Place limit, stop, and other advanced order types
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current Price Display */}
            <div className="p-3 bg-zinc-800/50 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-zinc-400">{symbol} Price</div>
                  <div className="text-xl font-bold text-zinc-200">${currentPrice.toFixed(2)}</div>
                </div>
                <div
                  className={`flex items-center gap-1 ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}
                >
                  {priceChange >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span className="text-sm font-semibold">
                    {priceChange >= 0 ? '+' : ''}
                    {priceChange.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Order Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-200">Order Type</label>
              <Select
                value={orderForm.type}
                onValueChange={(value: 'limit' | 'stop' | 'stop_limit' | 'trailing_stop') =>
                  setOrderForm((prev) => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="limit">
                    <div>
                      <div className="font-medium">Limit Order</div>
                      <div className="text-xs text-zinc-500">Buy/sell at specific price</div>
                    </div>
                  </SelectItem>
                  <SelectItem value="stop">
                    <div>
                      <div className="font-medium">Stop Order</div>
                      <div className="text-xs text-zinc-500">Market order at stop price</div>
                    </div>
                  </SelectItem>
                  <SelectItem value="stop_limit">
                    <div>
                      <div className="font-medium">Stop Limit</div>
                      <div className="text-xs text-zinc-500">Limit order at stop price</div>
                    </div>
                  </SelectItem>
                  <SelectItem value="trailing_stop">
                    <div>
                      <div className="font-medium">Trailing Stop</div>
                      <div className="text-xs text-zinc-500">Dynamic stop loss</div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-zinc-500">{getOrderTypeDescription(orderForm.type)}</p>
            </div>

            {/* Side */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-200">Side</label>
              <Select
                value={orderForm.side}
                onValueChange={(value: 'buy' | 'sell') =>
                  setOrderForm((prev) => ({ ...prev, side: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buy">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span>Buy</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="sell">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-4 h-4 text-red-400" />
                      <span>Sell</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-200">Quantity</label>
              <Input
                type="number"
                min="0.1"
                step="0.1"
                value={orderForm.quantity}
                onChange={(e) =>
                  setOrderForm((prev) => ({ ...prev, quantity: parseFloat(e.target.value) || 0 }))
                }
                placeholder="Enter quantity"
              />
            </div>

            {/* Price Fields */}
            {orderForm.type === 'limit' && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-200">Limit Price</label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={orderForm.limitPrice}
                  onChange={(e) =>
                    setOrderForm((prev) => ({ ...prev, limitPrice: e.target.value }))
                  }
                  placeholder={`$${currentPrice.toFixed(2)}`}
                />
              </div>
            )}

            {(orderForm.type === 'stop' || orderForm.type === 'stop_limit') && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-200">Stop Price</label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={orderForm.stopPrice}
                  onChange={(e) => setOrderForm((prev) => ({ ...prev, stopPrice: e.target.value }))}
                  placeholder={`$${currentPrice.toFixed(2)}`}
                />
              </div>
            )}

            {orderForm.type === 'stop_limit' && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-200">Limit Price</label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={orderForm.limitPrice}
                  onChange={(e) =>
                    setOrderForm((prev) => ({ ...prev, limitPrice: e.target.value }))
                  }
                  placeholder={`$${(parseFloat(orderForm.stopPrice || '0') * 1.01).toFixed(2)}`}
                />
              </div>
            )}

            {orderForm.type === 'trailing_stop' && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-200">Trailing Stop (%)</label>
                <Input
                  type="number"
                  min="0.1"
                  max="20"
                  step="0.1"
                  value={orderForm.trailingStopPercent}
                  onChange={(e) =>
                    setOrderForm((prev) => ({ ...prev, trailingStopPercent: e.target.value }))
                  }
                  placeholder="5.0"
                />
              </div>
            )}

            {/* Time in Force */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-200">Time in Force</label>
              <Select
                value={orderForm.timeInForce}
                onValueChange={(value: 'GTC' | 'IOC' | 'FOK' | 'GTD') =>
                  setOrderForm((prev) => ({ ...prev, timeInForce: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GTC">Good Till Cancelled</SelectItem>
                  <SelectItem value="IOC">Immediate or Cancel</SelectItem>
                  <SelectItem value="FOK">Fill or Kill</SelectItem>
                  <SelectItem value="GTD">Good Till Date</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Place Order Button */}
            <Button
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder}
              className="w-full"
              size="lg"
            >
              {isPlacingOrder ? 'Placing Order...' : `Place ${orderForm.type.toUpperCase()} Order`}
            </Button>
          </CardContent>
        </Card>

        {/* Active Orders */}
        <Card className="bg-zinc-900/50 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-zinc-200">Active Orders</CardTitle>
            <p className="text-zinc-400 text-sm">Monitor and manage your pending orders</p>
          </CardHeader>
          <CardContent>
            {activeOrders.length === 0 ? (
              <div className="text-center py-8 text-zinc-500">
                <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No active orders</p>
                <p className="text-sm mt-1">Place an order to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(order.status)}
                      <div>
                        <div className="font-medium text-zinc-200">
                          {order.side.toUpperCase()} {order.quantity} {order.symbol}
                        </div>
                        <div className="text-sm text-zinc-500">
                          {order.type.toUpperCase()} • {order.timeInForce}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-zinc-200">
                        {order.limitPrice && `$${order.limitPrice.toFixed(2)}`}
                        {order.stopPrice && `$${order.stopPrice.toFixed(2)}`}
                        {order.trailingStopPercent && `${order.trailingStopPercent}%`}
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-xs ${getStatusColor(order.status)}`}
                      >
                        {order.status.toUpperCase()}
                      </Badge>
                      {order.status === 'active' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="ml-2"
                          onClick={() => cancelOrder(order.id)}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Order Types Explanation */}
      <Card className="bg-zinc-900/50 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-zinc-200">Order Types Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-zinc-200 mb-1">Limit Order</h4>
                <p className="text-sm text-zinc-500">
                  Buy or sell at a specific price or better. Your order will only execute at your
                  limit price or better.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-zinc-200 mb-1">Stop Order</h4>
                <p className="text-sm text-zinc-500">
                  Triggers a market order when the price reaches your stop level. Best for cutting
                  losses or entering positions.
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-zinc-200 mb-1">Stop-Limit Order</h4>
                <p className="text-sm text-zinc-500">
                  Combines stop and limit orders. Triggers a limit order when stop price is reached.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-zinc-200 mb-1">Trailing Stop</h4>
                <p className="text-sm text-zinc-500">
                  Dynamic stop loss that trails price movements. Adjusts automatically as price
                  moves in your favor.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
