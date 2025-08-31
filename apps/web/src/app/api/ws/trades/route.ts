import { NextRequest } from 'next/server';

// Mock trades data
let mockTrades: Array<{
  id: string;
  symbol: string;
  price: number;
  quantity: number;
  side: 'buy' | 'sell';
  timestamp: number;
}> = [
  {
    id: '1',
    symbol: 'APT/USD',
    price: 5.25,
    quantity: 100,
    side: 'buy',
    timestamp: Date.now() - 30000,
  },
  {
    id: '2',
    symbol: 'APT/USD',
    price: 5.24,
    quantity: 250,
    side: 'sell',
    timestamp: Date.now() - 25000,
  },
  {
    id: '3',
    symbol: 'APT/USD',
    price: 5.26,
    quantity: 150,
    side: 'buy',
    timestamp: Date.now() - 20000,
  },
  {
    id: '4',
    symbol: 'APT/USD',
    price: 5.23,
    quantity: 300,
    side: 'sell',
    timestamp: Date.now() - 15000,
  },
  {
    id: '5',
    symbol: 'APT/USD',
    price: 5.27,
    quantity: 200,
    side: 'buy',
    timestamp: Date.now() - 10000,
  },
];

// Simulate trade updates
const simulateTradeUpdates = () => {
  let tradeId = 6;

  setInterval(() => {
    // Generate new trade
    const isBuy = Math.random() > 0.5;
    const basePrice = 5.25;
    const priceVariation = (Math.random() - 0.5) * 0.1; // ±0.05
    const quantity = Math.floor(Math.random() * 500) + 50; // 50-550

    const newTrade = {
      id: tradeId.toString(),
      symbol: 'APT/USD',
      price: Math.round((basePrice + priceVariation) * 100) / 100,
      quantity,
      side: isBuy ? 'buy' : ('sell' as 'buy' | 'sell'),
      timestamp: Date.now(),
    };

    mockTrades.unshift(newTrade);
    mockTrades = mockTrades.slice(0, 100); // Keep only last 100 trades
    tradeId++;
  }, 3000); // New trade every 3 seconds
};

// Start trade simulation
let tradeSimulationStarted = false;

export async function GET(request: NextRequest) {
  // WebSocket handler for Next.js
  const upgradeHeader = request.headers.get('upgrade');

  if (upgradeHeader !== 'websocket') {
    return new Response('Expected websocket', { status: 400 });
  }

  // Start simulation on first connection
  if (!tradeSimulationStarted) {
    tradeSimulationStarted = true;
    simulateTradeUpdates();
  }

  // For demonstration, return mock trades data
  return new Response(
    JSON.stringify({
      message: 'WebSocket endpoint for trades',
      status: 'active',
      recentTrades: mockTrades.slice(0, 10),
      totalTrades: mockTrades.length,
    }),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
}
