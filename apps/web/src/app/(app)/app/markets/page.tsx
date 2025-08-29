'use client';

import React from 'react';
import { MarketDepth } from '@/components/charts/MarketDepth';
import { usePriceFeeds } from '@/hooks/usePriceFeeds';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

export default function MarketsPage() {
  const { prices } = usePriceFeeds();

  const formatCurrency = (value: number) => `$${value.toFixed(2)}`;
  const formatPercent = (value: number) => `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;

  const getPriceChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-400' : 'text-red-400';
  };

  const getPriceChangeIcon = (change: number) => {
    return change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Markets</h1>
        <p className="text-zinc-400 mt-2">
          Real-time market data, order book, and trading insights
        </p>
      </div>

      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(prices).map(([symbol, priceData]) => (
          <Card key={symbol} className="bg-zinc-900/50 border-zinc-700">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg text-zinc-200">{symbol}</CardTitle>
                <Badge variant="outline" className="text-xs">
                  {priceData.source}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Price</span>
                  <span className="text-xl font-bold text-zinc-200">
                    {formatCurrency(priceData.price)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">24h Change</span>
                  <div
                    className={`flex items-center gap-1 ${getPriceChangeColor(priceData.change24h)}`}
                  >
                    {getPriceChangeIcon(priceData.change24h)}
                    <span className="font-semibold">{formatCurrency(priceData.change24h)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">24h %</span>
                  <span
                    className={`font-semibold ${getPriceChangeColor(priceData.changePercent24h)}`}
                  >
                    {formatPercent(priceData.changePercent24h)}
                  </span>
                </div>

                <div className="pt-2 border-t border-zinc-700">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-500">Volume</span>
                    <span className="text-zinc-300">
                      ${(priceData.volume24h / 1000000).toFixed(1)}M
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {Object.keys(prices).length === 0 && (
          <Card className="bg-zinc-900/50 border-zinc-700 md:col-span-3">
            <CardContent className="p-8 text-center">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 text-zinc-500" />
              <p className="text-zinc-400">Loading market data...</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Market Depth */}
      <Card className="bg-zinc-900/50 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-zinc-200">Order Book</CardTitle>
        </CardHeader>
        <CardContent>
          <MarketDepth symbol="APT" maxRows={15} />
        </CardContent>
      </Card>

      {/* Market Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-zinc-900/50 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-zinc-200">Market Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-zinc-400">Market Cap</span>
                <span className="text-zinc-200">$2.1B</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">24h Volume</span>
                <span className="text-zinc-200">$125M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Circulating Supply</span>
                <span className="text-zinc-200">368M APT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Max Supply</span>
                <span className="text-zinc-200">1.01B APT</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-zinc-200">Trading Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-zinc-400">24h Trades</span>
                <span className="text-zinc-200">1,247</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Avg Trade Size</span>
                <span className="text-zinc-200">$2,450</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Open Interest</span>
                <span className="text-zinc-200">$45.2M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Funding Rate</span>
                <span className="text-green-400">+0.02%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
