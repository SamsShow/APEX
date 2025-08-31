import { NextRequest } from 'next/server';

// Mock orderbook data
let mockOrderBook = {
  symbol: 'APT/USD',
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
  ] as [number, number][],
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
  ] as [number, number][],
  lastUpdated: Date.now(),
};

// Simulate orderbook updates
const simulateOrderBookUpdates = () => {
  setInterval(() => {
    // Randomly update some bid/ask levels
    const bidIndex = Math.floor(Math.random() * mockOrderBook.bids.length);
    const askIndex = Math.floor(Math.random() * mockOrderBook.asks.length);

    // Update bid quantity
    const bidChange = (Math.random() - 0.5) * 500;
    mockOrderBook.bids[bidIndex][1] = Math.max(100, mockOrderBook.bids[bidIndex][1] + bidChange);

    // Update ask quantity
    const askChange = (Math.random() - 0.5) * 500;
    mockOrderBook.asks[askIndex][1] = Math.max(100, mockOrderBook.asks[askIndex][1] + askChange);

    // Occasionally add/remove levels
    if (Math.random() < 0.1) {
      // Add new bid level
      const newBidPrice = mockOrderBook.bids[0][0] - 0.01;
      mockOrderBook.bids.unshift([newBidPrice, Math.floor(Math.random() * 2000) + 500]);
      mockOrderBook.bids = mockOrderBook.bids.slice(0, 10);
    }

    if (Math.random() < 0.1) {
      // Add new ask level
      const newAskPrice = mockOrderBook.asks[mockOrderBook.asks.length - 1][0] + 0.01;
      mockOrderBook.asks.push([newAskPrice, Math.floor(Math.random() * 2000) + 500]);
      mockOrderBook.asks = mockOrderBook.asks.slice(-10);
    }

    mockOrderBook.lastUpdated = Date.now();
  }, 1000); // Update every second
};

// Start orderbook simulation
let orderBookSimulationStarted = false;

export async function GET(request: NextRequest) {
  // WebSocket handler for Next.js
  const upgradeHeader = request.headers.get('upgrade');

  if (upgradeHeader !== 'websocket') {
    return new Response('Expected websocket', { status: 400 });
  }

  // Start simulation on first connection
  if (!orderBookSimulationStarted) {
    orderBookSimulationStarted = true;
    simulateOrderBookUpdates();
  }

  // For demonstration, return mock orderbook data
  return new Response(
    JSON.stringify({
      message: 'WebSocket endpoint for orderbook',
      status: 'active',
      mockData: mockOrderBook,
    }),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
}
