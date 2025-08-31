import { NextRequest, NextResponse } from 'next/server';

// Mock market data for different symbols
const marketData: Record<string, any> = {
  'APT/USD': {
    symbol: 'APT/USD',
    baseAsset: 'APT',
    quoteAsset: 'USD',
    price: 5.25,
    change24h: 0.15,
    changePercent24h: 2.94,
    high24h: 5.35,
    low24h: 5.1,
    volume24h: 1250000,
    marketCap: 875000000,
    orderBook: {
      bids: [
        [5.2, 1000],
        [5.19, 2500],
        [5.18, 1800],
        [5.17, 3200],
        [5.16, 1500],
        [5.15, 2800],
        [5.14, 2200],
        [5.13, 1900],
        [5.12, 3100],
        [5.11, 1700],
      ],
      asks: [
        [5.21, 1200],
        [5.22, 2100],
        [5.23, 1600],
        [5.24, 2900],
        [5.25, 1300],
        [5.26, 2400],
        [5.27, 2000],
        [5.28, 1800],
        [5.29, 2600],
        [5.3, 1400],
      ],
    },
    recentTrades: [
      {
        id: 'trade_1',
        price: 5.25,
        quantity: 100,
        side: 'buy',
        timestamp: new Date(Date.now() - 30000).toISOString(),
      },
      {
        id: 'trade_2',
        price: 5.24,
        quantity: 250,
        side: 'sell',
        timestamp: new Date(Date.now() - 60000).toISOString(),
      },
      {
        id: 'trade_3',
        price: 5.26,
        quantity: 150,
        side: 'buy',
        timestamp: new Date(Date.now() - 90000).toISOString(),
      },
    ],
    priceHistory: {
      '1m': [
        { timestamp: Date.now() - 60000, price: 5.2 },
        { timestamp: Date.now() - 30000, price: 5.25 },
        { timestamp: Date.now(), price: 5.25 },
      ],
      '5m': [
        { timestamp: Date.now() - 300000, price: 5.15 },
        { timestamp: Date.now() - 240000, price: 5.18 },
        { timestamp: Date.now() - 180000, price: 5.22 },
        { timestamp: Date.now() - 120000, price: 5.2 },
        { timestamp: Date.now() - 60000, price: 5.25 },
        { timestamp: Date.now(), price: 5.25 },
      ],
    },
    lastUpdated: new Date().toISOString(),
  },
  'BTC/USD': {
    symbol: 'BTC/USD',
    baseAsset: 'BTC',
    quoteAsset: 'USD',
    price: 45120.5,
    change24h: -1250.3,
    changePercent24h: -2.7,
    high24h: 46800.0,
    low24h: 44200.0,
    volume24h: 28500000,
    marketCap: 880000000000,
    orderBook: {
      bids: [
        [45100, 0.5],
        [45080, 1.2],
        [45060, 0.8],
        [45040, 2.1],
        [45020, 1.5],
      ],
      asks: [
        [45120, 0.3],
        [45140, 1.8],
        [45160, 1.2],
        [45180, 0.9],
        [45200, 2.5],
      ],
    },
    recentTrades: [
      {
        id: 'btc_trade_1',
        price: 45120.5,
        quantity: 0.05,
        side: 'buy',
        timestamp: new Date(Date.now() - 30000).toISOString(),
      },
    ],
    lastUpdated: new Date().toISOString(),
  },
};

// GET /api/market/[symbol] - Get market data for a symbol
export async function GET(request: NextRequest, { params }: { params: { symbol: string } }) {
  try {
    const { searchParams } = new URL(request.url);
    const includeOrderBook = searchParams.get('includeOrderBook') === 'true';
    const includeTrades = searchParams.get('includeTrades') === 'true';
    const timeframe = searchParams.get('timeframe') || '1m';

    const symbol = decodeURIComponent(params.symbol);
    const data = marketData[symbol];

    if (!data) {
      return NextResponse.json({ error: 'Market data not found for symbol' }, { status: 404 });
    }

    // Build response based on requested data
    const response: any = {
      success: true,
      data: {
        symbol: data.symbol,
        baseAsset: data.baseAsset,
        quoteAsset: data.quoteAsset,
        price: data.price,
        change24h: data.change24h,
        changePercent24h: data.changePercent24h,
        high24h: data.high24h,
        low24h: data.low24h,
        volume24h: data.volume24h,
        marketCap: data.marketCap,
        lastUpdated: data.lastUpdated,
      },
    };

    if (includeOrderBook) {
      response.data.orderBook = data.orderBook;
    }

    if (includeTrades) {
      response.data.recentTrades = data.recentTrades;
    }

    if (data.priceHistory && data.priceHistory[timeframe]) {
      response.data.priceHistory = data.priceHistory[timeframe];
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching market data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
