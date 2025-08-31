'use client';

import React, { useMemo } from 'react';
import { usePortfolioPnL } from '@/hooks/usePortfolioPnL';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown } from 'lucide-react';

// Mock performance data - in a real app, this would come from an API
const generateMockPerformanceData = () => {
  const data = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);

  let portfolioValue = 10000;
  let cumulativeReturn = 0;

  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);

    // Simulate some volatility
    const dailyChange = (Math.random() - 0.5) * 0.04; // -2% to +2%
    portfolioValue *= 1 + dailyChange;
    cumulativeReturn += dailyChange;

    data.push({
      date: date.toISOString().split('T')[0],
      portfolioValue,
      dailyReturn: dailyChange,
      cumulativeReturn: cumulativeReturn * 100,
    });
  }

  return data;
};

type TimeRange = '1D' | '1W' | '1M' | '3M' | '1Y' | 'ALL';

export function PortfolioPerformanceChart() {
  const { isLoading } = usePortfolioPnL();
  const [timeRange, setTimeRange] = React.useState<TimeRange>('1M');

  const performanceData = useMemo(() => generateMockPerformanceData(), []);

  const timeRanges: { value: TimeRange; label: string }[] = [
    { value: '1D', label: '1D' },
    { value: '1W', label: '1W' },
    { value: '1M', label: '1M' },
    { value: '3M', label: '3M' },
    { value: '1Y', label: '1Y' },
    { value: 'ALL', label: 'ALL' },
  ];

  // Filter data based on selected time range
  const filteredData = useMemo(() => {
    const now = new Date();
    const cutoff = new Date();

    switch (timeRange) {
      case '1D':
        cutoff.setDate(now.getDate() - 1);
        break;
      case '1W':
        cutoff.setDate(now.getDate() - 7);
        break;
      case '1M':
        cutoff.setMonth(now.getMonth() - 1);
        break;
      case '3M':
        cutoff.setMonth(now.getMonth() - 3);
        break;
      case '1Y':
        cutoff.setFullYear(now.getFullYear() - 1);
        break;
      case 'ALL':
      default:
        return performanceData;
    }

    return performanceData.filter((item) => new Date(item.date) >= cutoff);
  }, [performanceData, timeRange]);

  // Calculate metrics from filtered data
  const metrics = useMemo(() => {
    if (filteredData.length === 0) return null;

    const startValue = filteredData[0].portfolioValue;
    const endValue = filteredData[filteredData.length - 1].portfolioValue;
    const totalReturn = ((endValue - startValue) / startValue) * 100;

    const dailyReturns = filteredData
      .slice(1)
      .map(
        (item, index) =>
          ((item.portfolioValue - filteredData[index].portfolioValue) /
            filteredData[index].portfolioValue) *
          100,
      );

    const avgDailyReturn = dailyReturns.reduce((sum, ret) => sum + ret, 0) / dailyReturns.length;
    const volatility = Math.sqrt(
      dailyReturns.reduce((sum, ret) => sum + Math.pow(ret - avgDailyReturn, 2), 0) /
        dailyReturns.length,
    );

    const positiveDays = dailyReturns.filter((ret) => ret > 0).length;
    const winRate = (positiveDays / dailyReturns.length) * 100;

    return {
      totalReturn,
      avgDailyReturn,
      volatility,
      winRate,
      maxValue: Math.max(...filteredData.map((d) => d.portfolioValue)),
      minValue: Math.min(...filteredData.map((d) => d.portfolioValue)),
    };
  }, [filteredData]);

  // Create simple sparkline data for visualization
  const sparklineData = useMemo(() => {
    const maxValue = Math.max(...filteredData.map((d) => d.portfolioValue));
    const minValue = Math.min(...filteredData.map((d) => d.portfolioValue));
    const range = maxValue - minValue;

    return filteredData.map((item, index) => ({
      x: index,
      y: range > 0 ? ((item.portfolioValue - minValue) / range) * 100 : 50,
      value: item.portfolioValue,
      date: item.date,
    }));
  }, [filteredData]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="h-64 bg-zinc-800/50 rounded animate-pulse" />
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-zinc-100">Portfolio Performance</h3>
          <p className="text-sm text-zinc-400">Track your returns over time</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {timeRanges.map((range) => (
            <Button
              key={range.value}
              variant={timeRange === range.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range.value)}
              className="flex-1 sm:flex-none"
            >
              {range.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Metrics Summary */}
      {metrics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-zinc-900/50 rounded-lg">
            <p className="text-sm text-zinc-400">Total Return</p>
            <p
              className={`text-lg font-semibold ${
                metrics.totalReturn >= 0 ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {formatPercent(metrics.totalReturn)}
            </p>
          </div>
          <div className="text-center p-3 bg-zinc-900/50 rounded-lg">
            <p className="text-sm text-zinc-400">Avg Daily</p>
            <p
              className={`text-lg font-semibold ${
                metrics.avgDailyReturn >= 0 ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {formatPercent(metrics.avgDailyReturn)}
            </p>
          </div>
          <div className="text-center p-3 bg-zinc-900/50 rounded-lg">
            <p className="text-sm text-zinc-400">Volatility</p>
            <p className="text-lg font-semibold text-zinc-100">{metrics.volatility.toFixed(1)}%</p>
          </div>
          <div className="text-center p-3 bg-zinc-900/50 rounded-lg">
            <p className="text-sm text-zinc-400">Win Rate</p>
            <p className="text-lg font-semibold text-zinc-100">{metrics.winRate.toFixed(0)}%</p>
          </div>
        </div>
      )}

      {/* Simple Sparkline Chart */}
      <div className="relative">
        <div className="flex items-end justify-between h-32 mb-4">
          {sparklineData.map((point, index) => (
            <div key={index} className="flex-1 flex justify-center" style={{ height: '100%' }}>
              <div
                className={`w-1 rounded-t ${point.y > 50 ? 'bg-green-400' : 'bg-red-400'}`}
                style={{ height: `${point.y}%` }}
                title={`${point.date}: ${formatCurrency(point.value)}`}
              />
            </div>
          ))}
        </div>

        {/* Value labels */}
        <div className="flex justify-between text-xs text-zinc-500 mb-2">
          <span>{filteredData[0]?.date}</span>
          <span>{filteredData[filteredData.length - 1]?.date}</span>
        </div>
      </div>

      {/* Current vs Start Comparison */}
      <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-sm text-zinc-400">Starting Value</p>
            <p className="text-lg font-semibold text-zinc-100">
              {formatCurrency(filteredData[0]?.portfolioValue || 0)}
            </p>
          </div>
          <div>
            <p className="text-sm text-zinc-400">Current Value</p>
            <p className="text-lg font-semibold text-zinc-100">
              {formatCurrency(filteredData[filteredData.length - 1]?.portfolioValue || 0)}
            </p>
          </div>
        </div>

        {metrics && (
          <div className="flex items-center gap-2">
            {metrics.totalReturn >= 0 ? (
              <TrendingUp className="w-5 h-5 text-green-400" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-400" />
            )}
            <Badge
              variant={metrics.totalReturn >= 0 ? 'default' : 'secondary'}
              className={
                metrics.totalReturn >= 0
                  ? 'bg-green-900/20 text-green-400'
                  : 'bg-red-900/20 text-red-400'
              }
            >
              {formatPercent(metrics.totalReturn)}
            </Badge>
          </div>
        )}
      </div>
    </Card>
  );
}
