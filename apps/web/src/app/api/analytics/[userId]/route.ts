import { NextRequest, NextResponse } from 'next/server';

// Mock analytics data
const analyticsData = {
  userId: 'user_123',
  overview: {
    totalTrades: 156,
    winningTrades: 98,
    losingTrades: 58,
    winRate: 62.8,
    totalPnL: 1250.75,
    totalPnLPercent: 8.92,
    avgTradeSize: 1250.5,
    largestWin: 500.0,
    largestLoss: -250.0,
    sharpeRatio: 1.85,
    maxDrawdown: -8.5,
  },
  performance: {
    daily: [
      { date: '2024-01-01', pnl: 25.5, volume: 12500 },
      { date: '2024-01-02', pnl: -15.25, volume: 15200 },
      { date: '2024-01-03', pnl: 42.8, volume: 18750 },
      { date: '2024-01-04', pnl: 18.9, volume: 22300 },
      { date: '2024-01-05', pnl: -8.75, volume: 16800 },
      { date: '2024-01-06', pnl: 35.6, volume: 21100 },
      { date: '2024-01-07', pnl: 22.45, volume: 19600 },
    ],
    monthly: [
      { month: '2023-12', pnl: 1250.75, volume: 185000 },
      { month: '2024-01', pnl: 890.5, volume: 245000 },
    ],
  },
  riskMetrics: {
    valueAtRisk: -2.5, // 2.5% VaR
    expectedShortfall: -3.8,
    beta: 1.2,
    volatility: 15.8,
    correlation: 0.65,
  },
  assetAllocation: [
    { asset: 'APT', allocation: 45.2, value: 6875.9 },
    { asset: 'BTC', allocation: 32.8, value: 4992.2 },
    { asset: 'ETH', allocation: 15.6, value: 2374.9 },
    { asset: 'USDC', allocation: 6.4, value: 974.0 },
  ],
  strategyPerformance: [
    {
      strategy: 'Long Call Spread',
      trades: 45,
      winRate: 71.1,
      totalPnL: 425.5,
      avgReturn: 2.8,
    },
    {
      strategy: 'Covered Call',
      trades: 32,
      winRate: 59.4,
      totalPnL: 312.25,
      avgReturn: 1.9,
    },
    {
      strategy: 'Iron Condor',
      trades: 28,
      winRate: 67.9,
      totalPnL: 298.75,
      avgReturn: 2.1,
    },
    {
      strategy: 'Protective Put',
      trades: 19,
      winRate: 52.6,
      totalPnL: 156.8,
      avgReturn: 1.6,
    },
  ],
  marketAnalysis: {
    marketSentiment: 'bullish',
    fearGreedIndex: 68,
    volatilityIndex: 18.5,
    sectorPerformance: {
      crypto: 8.2,
      defi: 12.5,
      nft: -3.8,
      layer1: 15.2,
    },
  },
  lastUpdated: new Date().toISOString(),
};

// GET /api/analytics/[userId] - Get user analytics
export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || 'daily';
    const includePerformance = searchParams.get('includePerformance') !== 'false';
    const includeRisk = searchParams.get('includeRisk') !== 'false';

    // In a real app, you'd fetch from database based on userId
    if (params.userId !== 'user_123') {
      return NextResponse.json({ error: 'Analytics not found' }, { status: 404 });
    }

    const response: any = {
      success: true,
      data: {
        userId: analyticsData.userId,
        overview: analyticsData.overview,
        assetAllocation: analyticsData.assetAllocation,
        strategyPerformance: analyticsData.strategyPerformance,
        marketAnalysis: analyticsData.marketAnalysis,
        lastUpdated: analyticsData.lastUpdated,
      },
    };

    if (includePerformance) {
      response.data.performance =
        analyticsData.performance[timeframe as keyof typeof analyticsData.performance] ||
        analyticsData.performance.daily;
    }

    if (includeRisk) {
      response.data.riskMetrics = analyticsData.riskMetrics;
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
