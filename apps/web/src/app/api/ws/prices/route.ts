import { NextRequest } from 'next/server';

type PriceData = {
  symbol: string;
  price: number;
  confidence: number;
  lastUpdated: number;
  source: string;
  id: string;
};

// Pyth Network Price Feed IDs (Mainnet)
const PYTH_PRICE_FEEDS = {
  'APT/USD': '0x03ae4db29ed4ae33d323568895aa00337e658e348b3750891cdc3294f7151687',
  'BTC/USD': '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43',
  'ETH/USD': '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace',
} as const;

// Store price data and connections
const priceData: Record<string, PriceData> = {};
let pythWs: WebSocket | null = null;
const connections = new Set<WebSocket>();

// Initialize Pyth connection
const initPythConnection = () => {
  if (pythWs) return; // Already connected

  pythWs = new WebSocket('wss://hermes.pyth.network/ws');

  pythWs.onopen = () => {
    console.log('Connected to Pyth Network');
    pythWs?.send(
      JSON.stringify({
        type: 'subscribe',
        ids: Object.values(PYTH_PRICE_FEEDS),
      }),
    );
  };

  pythWs.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data);

      if (msg?.type === 'price_update' && msg?.price?.price != null) {
        // Find which symbol this update belongs to
        const symbol = Object.keys(PYTH_PRICE_FEEDS).find(
          (key) => PYTH_PRICE_FEEDS[key as keyof typeof PYTH_PRICE_FEEDS] === msg.id,
        );

        if (symbol) {
          const price = Number(msg.price.price);
          const confidence = Number(msg.price.conf ?? 0);

          // Store price data
          priceData[symbol] = {
            symbol,
            price,
            confidence,
            lastUpdated: Date.now(),
            source: 'pyth',
            id: msg.id,
          };

          // Broadcast to all connected clients
          connections.forEach((ws) => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(
                JSON.stringify({
                  type: 'price_update',
                  data: priceData[symbol],
                  timestamp: Date.now(),
                }),
              );
            }
          });
        }
      }
    } catch (err) {
      console.error('Pyth message parse error:', err);
    }
  };

  pythWs.onclose = () => {
    console.log('Pyth connection closed, reconnecting...');
    pythWs = null;
    setTimeout(initPythConnection, 5000);
  };

  pythWs.onerror = (error) => {
    console.error('Pyth connection error:', error);
  };
};

// Fallback price simulation for when Pyth is unavailable
const simulateFallbackPrices = () => {
  const symbols = Object.keys(PYTH_PRICE_FEEDS);

  symbols.forEach((symbol) => {
    if (!priceData[symbol]) {
      // Generate fallback price based on symbol
      let basePrice = 1;
      switch (symbol) {
        case 'APT/USD':
          basePrice = 5.25;
          break;
        case 'BTC/USD':
          basePrice = 45120;
          break;
        case 'ETH/USD':
          basePrice = 2450;
          break;
      }

      priceData[symbol] = {
        symbol,
        price: basePrice,
        confidence: basePrice * 0.01, // 1% confidence
        lastUpdated: Date.now(),
        source: 'fallback',
        id: PYTH_PRICE_FEEDS[symbol as keyof typeof PYTH_PRICE_FEEDS],
      };
    }
  });
};

// Start Pyth connection
let initialized = false;

export async function GET(request: NextRequest) {
  // Initialize Pyth connection on first request
  if (!initialized) {
    initialized = true;
    initPythConnection();
    simulateFallbackPrices(); // Fallback in case Pyth is unavailable
  }

  // WebSocket handler for Next.js
  const upgradeHeader = request.headers.get('upgrade');

  if (upgradeHeader !== 'websocket') {
    // Return current price data for HTTP requests
    return new Response(
      JSON.stringify({
        message: 'Pyth price feed endpoint',
        status: pythWs?.readyState === WebSocket.OPEN ? 'connected' : 'connecting',
        prices: priceData,
        timestamp: Date.now(),
      }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }

  // For WebSocket connections, return upgrade response
  // Note: In Next.js, WebSocket upgrades need to be handled differently
  // This is a simplified implementation

  return new Response(
    JSON.stringify({
      message: 'WebSocket endpoint initialized with Pyth Network',
      status: pythWs?.readyState === WebSocket.OPEN ? 'connected' : 'connecting',
      availableSymbols: Object.keys(PYTH_PRICE_FEEDS),
      currentPrices: priceData,
    }),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
}
