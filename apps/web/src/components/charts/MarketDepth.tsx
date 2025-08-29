'use client';

import React, { useMemo } from 'react';
import { usePriceFeeds } from '@/hooks/usePriceFeeds';
// TODO: Import when implementing real option pricing
// import { useOptionsPricing } from '@/hooks/useOptionsPricing';

interface OrderBookEntry {
  price: number;
  quantity: number;
  total: number;
  percentage: number;
}

interface MarketDepthProps {
  symbol?: string;
  maxRows?: number;
  showHeader?: boolean;
  className?: string;
}

export function MarketDepth({
  symbol = 'APT',
  maxRows = 10,
  showHeader = true,
  className = '',
}: MarketDepthProps) {
  const { prices } = usePriceFeeds();
  // TODO: Use calculateOptionPrice when implementing real option pricing
  // const { calculateOptionPrice } = useOptionsPricing();

  // Mock order book data - in a real implementation, this would come from a WebSocket or API
  const orderBook = useMemo(() => {
    const currentPrice = prices[symbol]?.price || 5.0;
    const spread = 0.05; // 5 cent spread

    // Generate mock bids (buy orders) below current price
    const bids: OrderBookEntry[] = [];
    let bidTotal = 0;
    for (let i = 1; i <= maxRows; i++) {
      const price = currentPrice - i * spread;
      const quantity = Math.random() * 100 + 10; // Random quantity 10-110
      bidTotal += quantity;
      bids.push({
        price,
        quantity,
        total: bidTotal,
        percentage: 0, // Will be calculated after all entries
      });
    }

    // Generate mock asks (sell orders) above current price
    const asks: OrderBookEntry[] = [];
    let askTotal = 0;
    for (let i = 1; i <= maxRows; i++) {
      const price = currentPrice + i * spread;
      const quantity = Math.random() * 100 + 10; // Random quantity 10-110
      askTotal += quantity;
      asks.push({
        price,
        quantity,
        total: askTotal,
        percentage: 0, // Will be calculated after all entries
      });
    }

    // Calculate percentages for visualization
    const maxBidTotal = Math.max(...bids.map((b) => b.total));
    const maxAskTotal = Math.max(...asks.map((a) => a.total));

    bids.forEach((bid) => {
      bid.percentage = (bid.total / maxBidTotal) * 100;
    });

    asks.forEach((ask) => {
      ask.percentage = (ask.total / maxAskTotal) * 100;
    });

    return { bids, asks, currentPrice };
  }, [prices, symbol, maxRows]);

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;
  const formatQuantity = (quantity: number) => quantity.toFixed(1);

  return (
    <div className={`bg-zinc-900/50 rounded-lg overflow-hidden ${className}`}>
      {showHeader && (
        <div className="px-4 py-3 bg-zinc-800/50 border-b border-zinc-700">
          <h3 className="text-sm font-semibold text-zinc-200">Market Depth - {symbol}</h3>
          <p className="text-xs text-zinc-400 mt-1">
            Last Price: {formatPrice(orderBook.currentPrice)}
          </p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 p-4">
        {/* Bids (Buy Orders) */}
        <div className="space-y-1">
          <h4 className="text-xs font-medium text-green-400 mb-2">BIDS</h4>
          {orderBook.bids.slice(0, maxRows).map((bid, index) => (
            <div
              key={`bid-${index}`}
              className="relative flex justify-between items-center py-1 px-2 rounded text-xs"
            >
              {/* Background bar for volume visualization */}
              <div
                className="absolute left-0 top-0 bottom-0 bg-green-500/20 rounded"
                style={{ width: `${bid.percentage}%` }}
              />

              <span className="text-green-400 font-mono relative z-10">
                {formatPrice(bid.price)}
              </span>
              <span className="text-zinc-300 font-mono relative z-10">
                {formatQuantity(bid.quantity)}
              </span>
              <span className="text-zinc-500 font-mono text-xs relative z-10">
                {formatQuantity(bid.total)}
              </span>
            </div>
          ))}
        </div>

        {/* Spread Indicator */}
        <div className="flex flex-col justify-center items-center space-y-2">
          <div className="text-center">
            <div className="text-xs text-zinc-500">SPREAD</div>
            <div className="text-sm font-mono text-zinc-300">
              {formatPrice(orderBook.asks[0]?.price - orderBook.bids[0]?.price || 0.05)}
            </div>
          </div>
          <div className="w-full h-px bg-zinc-600"></div>
          <div className="text-center">
            <div className="text-xs text-zinc-500">MID PRICE</div>
            <div className="text-sm font-mono text-zinc-300">
              {formatPrice(orderBook.currentPrice)}
            </div>
          </div>
        </div>

        {/* Asks (Sell Orders) */}
        <div className="space-y-1">
          <h4 className="text-xs font-medium text-red-400 mb-2">ASKS</h4>
          {orderBook.asks.slice(0, maxRows).map((ask, index) => (
            <div
              key={`ask-${index}`}
              className="relative flex justify-between items-center py-1 px-2 rounded text-xs"
            >
              {/* Background bar for volume visualization */}
              <div
                className="absolute right-0 top-0 bottom-0 bg-red-500/20 rounded"
                style={{ width: `${ask.percentage}%` }}
              />

              <span className="text-zinc-500 font-mono text-xs relative z-10">
                {formatQuantity(ask.total)}
              </span>
              <span className="text-zinc-300 font-mono relative z-10">
                {formatQuantity(ask.quantity)}
              </span>
              <span className="text-red-400 font-mono relative z-10">{formatPrice(ask.price)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="px-4 py-3 bg-zinc-800/30 border-t border-zinc-700">
        <div className="grid grid-cols-3 gap-4 text-xs">
          <div className="text-center">
            <div className="text-zinc-500">Bid Volume</div>
            <div className="text-green-400 font-semibold">
              {formatQuantity(orderBook.bids[orderBook.bids.length - 1]?.total || 0)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-zinc-500">Liquidity</div>
            <div className="text-zinc-300 font-semibold">
              $
              {(
                (orderBook.bids[orderBook.bids.length - 1]?.total || 0) +
                (orderBook.asks[orderBook.asks.length - 1]?.total || 0)
              ).toFixed(1)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-zinc-500">Ask Volume</div>
            <div className="text-red-400 font-semibold">
              {formatQuantity(orderBook.asks[orderBook.asks.length - 1]?.total || 0)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Compact version for smaller spaces
export function MarketDepthCompact({
  symbol = 'APT',
  maxRows = 5,
  className = '',
}: Omit<MarketDepthProps, 'showHeader'>) {
  return (
    <MarketDepth
      symbol={symbol}
      maxRows={maxRows}
      showHeader={false}
      className={`text-xs ${className}`}
    />
  );
}
