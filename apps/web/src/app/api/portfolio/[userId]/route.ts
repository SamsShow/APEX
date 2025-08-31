import { NextRequest, NextResponse } from 'next/server';

// Mock portfolio data
const mockPortfolio = {
  userId: 'user_123',
  totalValue: 15250.75,
  totalPnL: 1250.75,
  totalPnLPercent: 8.92,
  availableBalance: 8750.5,
  marginUsed: 2500.0,
  marginAvailable: 6250.5,
  positions: [
    {
      id: 'pos_1',
      symbol: 'APT/USD',
      side: 'long',
      quantity: 100,
      avgPrice: 5.15,
      currentPrice: 5.25,
      marketValue: 525.0,
      unrealizedPnL: 10.0,
      unrealizedPnLPercent: 1.94,
      liquidationPrice: 4.85,
    },
    {
      id: 'pos_2',
      symbol: 'BTC/USD',
      side: 'short',
      quantity: 0.05,
      avgPrice: 45200.0,
      currentPrice: 45120.5,
      marketValue: 2256.03,
      unrealizedPnL: 39.75,
      unrealizedPnLPercent: 1.79,
      liquidationPrice: 46500.0,
    },
  ],
  assets: [
    {
      symbol: 'APT',
      balance: 1250.75,
      value: 6569.44,
      price: 5.25,
      change24h: 2.94,
    },
    {
      symbol: 'USDC',
      balance: 8750.5,
      value: 8750.5,
      price: 1.0,
      change24h: 0.0,
    },
  ],
  lastUpdated: new Date().toISOString(),
};

// GET /api/portfolio/[userId] - Get user portfolio
export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    // In a real app, you'd fetch from database based on userId
    if (params.userId !== 'user_123') {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
    }

    // Simulate real-time updates
    const updatedPortfolio = {
      ...mockPortfolio,
      totalValue: mockPortfolio.totalValue + (Math.random() - 0.5) * 10,
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: updatedPortfolio,
    });
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
