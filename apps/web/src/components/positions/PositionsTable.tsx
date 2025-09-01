'use client';

import React, { useState } from 'react';
import { usePositions } from '@/hooks/usePositions';
import { usePortfolioPnL } from '@/hooks/usePortfolioPnL';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, ArrowUpDown } from 'lucide-react';

type SortField = 'symbol' | 'pnl' | 'value' | 'quantity';
type SortDirection = 'asc' | 'desc';

export function PositionsTable() {
  const { positions, isLoading, error, refreshPositions } = usePositions();
  const { positionPnLs } = usePortfolioPnL();
  const [sortField, setSortField] = useState<SortField>('symbol');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [showClosed, setShowClosed] = useState(false);

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-lg border border-white/10 bg-black/30">
        <div className="p-8 text-center text-zinc-400">Loading positions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="overflow-hidden rounded-lg border border-white/10 bg-black/30">
        <div className="p-8 text-center text-red-400">
          Error loading positions: {error}
          <Button onClick={refreshPositions} variant="outline" size="sm" className="ml-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Combine positions with P&L data
  const positionsWithPnL = positions.map((position) => {
    const pnlData = positionPnLs.find((p) => p.symbol === position.symbol);
    return {
      ...position,
      ...pnlData,
      // Fallback values if pnlData is not found
      unrealizedPnL: pnlData?.unrealizedPnL || 0,
      unrealizedPnLPercent: pnlData?.unrealizedPnLPercent || 0,
      marketValue: pnlData?.marketValue || position.quantity * position.avgPrice,
      dailyPnL: pnlData?.dailyPnL || 0,
      dailyPnLPercent: pnlData?.dailyPnLPercent || 0,
      delta: pnlData?.delta || 0,
      gamma: pnlData?.gamma || 0,
      theta: pnlData?.theta || 0,
    };
  });

  // Filter and sort positions
  const filteredPositions = positionsWithPnL.filter(
    (pos) => showClosed || Math.abs(pos.quantity) > 0,
  );

  const sortedPositions = [...filteredPositions].sort((a, b) => {
    let aValue: string | number, bValue: string | number;

    switch (sortField) {
      case 'symbol':
        aValue = a.symbol;
        bValue = b.symbol;
        break;
      case 'pnl':
        aValue = a.unrealizedPnL;
        bValue = b.unrealizedPnL;
        break;
      case 'value':
        aValue = a.marketValue;
        bValue = b.marketValue;
        break;
      case 'quantity':
        aValue = Math.abs(a.quantity);
        bValue = Math.abs(b.quantity);
        break;
      default:
        return 0;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-zinc-200 transition-colors"
    >
      {children}
      <ArrowUpDown
        className={`w-3 h-3 ${sortField === field ? 'text-zinc-200' : 'text-zinc-500'}`}
      />
    </button>
  );

  if (sortedPositions.length === 0) {
    return (
      <div className="overflow-hidden rounded-lg border border-white/10 bg-black/30">
        <div className="p-8 text-center text-zinc-400">
          No positions found. Create some options to see them here.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowClosed(!showClosed)}
            className="flex items-center gap-2"
          >
            {showClosed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showClosed ? 'Hide Closed' : 'Show Closed'}
          </Button>
        </div>
        <div className="text-sm text-zinc-400">
          {sortedPositions.length} position{sortedPositions.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-white/10 bg-black/30">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 text-xs text-zinc-400">
                <th className="px-4 py-3 text-left">
                  <SortButton field="symbol">Symbol</SortButton>
                </th>
                <th className="px-4 py-3 text-left">Side</th>
                <th className="px-4 py-3 text-right">
                  <SortButton field="quantity">Quantity</SortButton>
                </th>
                <th className="px-4 py-3 text-right">Avg Price</th>
                <th className="px-4 py-3 text-right">Current</th>
                <th className="px-4 py-3 text-right">
                  <SortButton field="value">Market Value</SortButton>
                </th>
                <th className="px-4 py-3 text-right">
                  <SortButton field="pnl">Unrealized P&L</SortButton>
                </th>
                <th className="px-4 py-3 text-right">Daily P&L</th>
                <th className="px-4 py-3 text-center">Greeks</th>
              </tr>
            </thead>
            <tbody>
              {sortedPositions.map((position) => {
                const isProfit = position.unrealizedPnL >= 0;
                const isOption =
                  position.symbol.includes('OPTION') ||
                  position.symbol.includes('CALL') ||
                  position.symbol.includes('PUT');

                return (
                  <tr
                    key={position.symbol}
                    className="border-b border-white/5 hover:bg-zinc-900/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <div className="text-sm font-medium text-zinc-200">{position.symbol}</div>
                        {isOption && (
                          <Badge variant="outline" className="text-xs mt-1">
                            Option
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={position.side === 'long' ? 'default' : 'secondary'}
                        className="capitalize"
                      >
                        {position.side}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right text-zinc-300">{position.quantity}</td>
                    <td className="px-4 py-3 text-right text-zinc-300">
                      {formatCurrency(position.avgPrice)}
                    </td>
                    <td className="px-4 py-3 text-right text-zinc-300">
                      {position.currentPrice ? formatCurrency(position.currentPrice) : 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-right text-zinc-300">
                      <SortButton field="value">{formatCurrency(position.marketValue)}</SortButton>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div>
                        <div
                          className={`font-medium ${isProfit ? 'text-green-400' : 'text-red-400'}`}
                        >
                          {formatCurrency(position.unrealizedPnL)}
                        </div>
                        <div
                          className={`text-xs ${
                            position.unrealizedPnLPercent >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}
                        >
                          {formatPercent(position.unrealizedPnLPercent)}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div>
                        <div
                          className={`font-medium ${
                            position.dailyPnL >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}
                        >
                          {formatCurrency(position.dailyPnL)}
                        </div>
                        <div
                          className={`text-xs ${
                            position.dailyPnLPercent >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}
                        >
                          {formatPercent(position.dailyPnLPercent)}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {isOption && (
                        <div className="flex justify-center gap-2 text-xs">
                          <div className="text-center">
                            <div className="text-zinc-400">Δ</div>
                            <div className="text-zinc-200">
                              {position.delta?.toFixed(2) || '0.00'}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-zinc-400">Γ</div>
                            <div className="text-zinc-200">
                              {position.gamma?.toFixed(3) || '0.000'}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-zinc-400">Θ</div>
                            <div className="text-zinc-200">
                              {position.theta?.toFixed(3) || '0.000'}
                            </div>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 bg-zinc-900/50">
          <div className="text-sm text-zinc-400">
            Showing {sortedPositions.length} of {positions.length} positions
          </div>
          <div className="flex gap-2">
            <Button onClick={refreshPositions} variant="outline" size="sm">
              Refresh
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
