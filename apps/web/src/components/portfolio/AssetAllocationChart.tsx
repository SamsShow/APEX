'use client';

import React, { useMemo } from 'react';
import { usePositions } from '@/hooks/usePositions';
import { usePortfolioPnL } from '@/hooks/usePortfolioPnL';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PieChart, BarChart3, TrendingUp } from 'lucide-react';

interface AssetCategory {
  name: string;
  value: number;
  percentage: number;
  color: string;
  positions: number;
}

export function AssetAllocationChart() {
  const { positions, isLoading } = usePositions();
  const { portfolioSummary } = usePortfolioPnL();

  const assetCategories = useMemo(() => {
    if (!positions.length || portfolioSummary.totalMarketValue === 0) return [];

    const categories: Record<string, AssetCategory> = {};

    positions.forEach((position) => {
      // Determine asset category
      let category = 'Other';
      let color = 'bg-gray-500';

      if (position.symbol.includes('APT')) {
        category = 'APT';
        color = 'bg-blue-500';
      } else if (
        position.symbol.includes('OPTION') ||
        position.symbol.includes('CALL') ||
        position.symbol.includes('PUT')
      ) {
        category = 'Options';
        color = 'bg-purple-500';
      } else if (position.symbol.includes('USDC') || position.symbol.includes('USD')) {
        category = 'Stablecoins';
        color = 'bg-green-500';
      } else if (position.symbol.includes('BTC')) {
        category = 'Bitcoin';
        color = 'bg-orange-500';
      } else if (position.symbol.includes('ETH')) {
        category = 'Ethereum';
        color = 'bg-cyan-500';
      }

      // Calculate position value
      const positionValue =
        Math.abs(position.quantity) * (position.currentPrice || position.avgPrice);

      if (categories[category]) {
        categories[category].value += positionValue;
        categories[category].positions += 1;
      } else {
        categories[category] = {
          name: category,
          value: positionValue,
          percentage: 0,
          color,
          positions: 1,
        };
      }
    });

    // Calculate percentages and sort
    const totalValue = Object.values(categories).reduce((sum, cat) => sum + cat.value, 0);

    return Object.values(categories)
      .map((cat) => ({
        ...cat,
        percentage: (cat.value / totalValue) * 100,
      }))
      .sort((a, b) => b.value - a.value);
  }, [positions, portfolioSummary.totalMarketValue]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="h-64 bg-zinc-800/50 rounded animate-pulse" />
      </Card>
    );
  }

  if (assetCategories.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center text-zinc-400">
            <PieChart className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No assets to display</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-zinc-100">Asset Allocation</h3>
          <p className="text-sm text-zinc-400">Portfolio breakdown by asset type</p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          {assetCategories.length} categories
        </Badge>
      </div>

      {/* Visual Allocation Bars */}
      <div className="space-y-3 mb-6">
        {assetCategories.map((category) => (
          <div key={category.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${category.color}`} />
                <span className="text-sm font-medium text-zinc-200">{category.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {category.positions} position{category.positions !== 1 ? 's' : ''}
                </Badge>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-zinc-200">
                  {formatCurrency(category.value)}
                </div>
                <div className="text-xs text-zinc-400">{formatPercent(category.percentage)}</div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-zinc-800 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${category.color} transition-all duration-500`}
                style={{ width: `${category.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-800">
        <div className="text-center">
          <p className="text-sm text-zinc-400">Total Assets</p>
          <p className="text-lg font-semibold text-zinc-100">{assetCategories.length}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-zinc-400">Largest Holding</p>
          <p className="text-lg font-semibold text-zinc-100">{assetCategories[0]?.name || 'N/A'}</p>
          <p className="text-xs text-zinc-400">
            {assetCategories[0] ? formatPercent(assetCategories[0].percentage) : '0%'}
          </p>
        </div>
      </div>

      {/* Concentration Warning */}
      {assetCategories[0] && assetCategories[0].percentage > 50 && (
        <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-500/20 rounded-lg">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-yellow-400">
              High concentration in {assetCategories[0].name} (
              {formatPercent(assetCategories[0].percentage)})
            </span>
          </div>
        </div>
      )}

      {/* Diversification Score */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-zinc-400">Diversification Score</span>
          <span className="text-sm font-medium text-zinc-200">
            {Math.min(assetCategories.length * 20, 100)}/100
          </span>
        </div>
        <div className="w-full bg-zinc-800 rounded-full h-2">
          <div
            className="h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(assetCategories.length * 20, 100)}%` }}
          />
        </div>
        <p className="text-xs text-zinc-500 mt-1">Based on number of asset categories</p>
      </div>
    </Card>
  );
}
