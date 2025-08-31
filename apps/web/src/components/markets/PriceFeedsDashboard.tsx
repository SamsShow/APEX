'use client';

import React from 'react';
import { usePythPrices, PYTH_PRICE_FEEDS } from '@/lib/pyth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function PriceFeedsDashboard() {
  const prices = usePythPrices(Object.keys(PYTH_PRICE_FEEDS) as any);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'text-green-400';
      case 'connecting':
        return 'text-yellow-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getConfidenceColor = (confidence: number | null, price: number | null) => {
    if (!confidence || !price) return 'text-gray-400';
    const confidencePercent = (confidence / price) * 100;
    if (confidencePercent < 0.1) return 'text-green-400';
    if (confidencePercent < 1) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <Card className="border-zinc-800 bg-zinc-900/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-zinc-100">
          <div className="w-2 h-2 rounded-full bg-green-400"></div>
          Pyth Price Feeds
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(prices).map(([symbol, data]) => (
            <div
              key={symbol}
              className="flex items-center justify-between p-3 rounded-lg border border-zinc-700 bg-zinc-800/30"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    data.status === 'connected'
                      ? 'bg-green-400'
                      : data.status === 'connecting'
                        ? 'bg-yellow-400 animate-pulse'
                        : 'bg-red-400'
                  }`}
                ></div>
                <div>
                  <div className="text-sm font-medium text-zinc-100">{symbol}</div>
                  <div className="text-xs text-zinc-500">
                    {PYTH_PRICE_FEEDS[symbol as keyof typeof PYTH_PRICE_FEEDS]?.slice(0, 8)}...
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 text-right">
                <div>
                  <div className="text-sm font-mono text-zinc-100">
                    {data.price ? `$${data.price.toFixed(data.price > 100 ? 2 : 4)}` : '—'}
                  </div>
                  <div className={`text-xs ${getStatusColor(data.status)} capitalize`}>
                    {data.status}
                  </div>
                </div>

                {data.confidence && (
                  <div>
                    <div
                      className={`text-xs font-mono ${getConfidenceColor(data.confidence, data.price)}`}
                    >
                      ±{data.confidence.toFixed(data.price && data.price > 100 ? 2 : 4)}
                    </div>
                    <div className="text-xs text-zinc-500">confidence</div>
                  </div>
                )}

                <div>
                  <div className="text-xs text-zinc-500">
                    {data.lastUpdated
                      ? `${Math.round((Date.now() - data.lastUpdated) / 1000)}s ago`
                      : '—'}
                  </div>
                  <div className="text-xs text-zinc-600">updated</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 rounded-lg border border-zinc-700 bg-zinc-800/20">
          <div className="text-xs text-zinc-400">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <span>Connected to Pyth Network</span>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
              <span>Connecting/Reconnecting</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-400"></div>
              <span>Connection Error</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
