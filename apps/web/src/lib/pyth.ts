'use client';

import React from 'react';

// Pyth Network Price Feed IDs (Mainnet)
// Documentation: https://pyth.network/developers/price-feed-ids
export const PYTH_PRICE_FEEDS = {
  // Aptos
  'APT/USD': '0x03ae4db29ed4ae33d323568895aa00337e658e348b3750891cdc3294f7151687',
  // Bitcoin
  'BTC/USD': '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43',
  // Ethereum
  'ETH/USD': '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace',
  // Solana
  'SOL/USD': '0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d',
} as const;

export type PriceFeedSymbol = keyof typeof PYTH_PRICE_FEEDS;

// Enhanced Pyth Hermes WS client with multiple feed support
// Docs: wss://hermes.pyth.network/ws → send { type: 'subscribe', ids: [priceId] }

export function usePythPrice(priceId: string | undefined) {
  const [price, setPrice] = React.useState<number | null>(null);
  const [confidence, setConfidence] = React.useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (!priceId) return;
    let ws: WebSocket | null = null;
    let alive = true;

    function connect() {
      ws = new WebSocket('wss://hermes.pyth.network/ws');
      ws.onopen = () => {
        ws?.send(JSON.stringify({ type: 'subscribe', ids: [priceId] }));
      };
      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data as string);
          // Price update message structure: { type: 'price_update', ... price: { price, conf }, time }
          if (msg?.type === 'price_update' && msg?.price?.price != null) {
            const p = Number(msg.price.price);
            const c = Number(msg.price.conf ?? 0);
            if (alive) {
              setPrice(p);
              setConfidence(c);
              setLastUpdated(Date.now());
            }
          }
        } catch (err) {
          // Swallow malformed frames but keep connection alive
          if (process.env.NODE_ENV !== 'production') {
            console.debug('pyth:onmessage parse error', err);
          }
        }
      };
      ws.onclose = () => {
        if (!alive) return;
        setTimeout(connect, 1500);
      };
      ws.onerror = () => {
        ws?.close();
      };
    }

    connect();
    return () => {
      alive = false;
      ws?.close();
    };
  }, [priceId]);

  return { price, confidence, lastUpdated } as const;
}

// Hook for multiple price feeds
export function usePythPrices(symbols: PriceFeedSymbol[]) {
  const [prices, setPrices] = React.useState<
    Record<
      PriceFeedSymbol,
      {
        price: number | null;
        confidence: number | null;
        lastUpdated: number | null;
        status: 'connecting' | 'connected' | 'error';
      }
    >
  >({} as any);

  React.useEffect(() => {
    const priceIds = symbols.map((symbol) => PYTH_PRICE_FEEDS[symbol]).filter(Boolean);

    if (priceIds.length === 0) return;

    let ws: WebSocket | null = null;
    let alive = true;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;

    function connect() {
      if (!alive) return;

      ws = new WebSocket('wss://hermes.pyth.network/ws');

      ws.onopen = () => {
        reconnectAttempts = 0;
        ws?.send(JSON.stringify({ type: 'subscribe', ids: priceIds }));

        // Update status for all symbols
        setPrices((prev) => {
          const updated = { ...prev };
          symbols.forEach((symbol) => {
            if (updated[symbol]) {
              updated[symbol] = { ...updated[symbol], status: 'connected' };
            } else {
              updated[symbol] = {
                price: null,
                confidence: null,
                lastUpdated: null,
                status: 'connected',
              };
            }
          });
          return updated;
        });
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data as string);
          if (msg?.type === 'price_update' && msg?.price?.price != null) {
            // Find which symbol this price update belongs to
            const symbol = symbols.find((s) => PYTH_PRICE_FEEDS[s] === msg.id);
            if (symbol && alive) {
              const p = Number(msg.price.price);
              const c = Number(msg.price.conf ?? 0);

              setPrices((prev) => ({
                ...prev,
                [symbol]: {
                  price: p,
                  confidence: c,
                  lastUpdated: Date.now(),
                  status: 'connected',
                },
              }));
            }
          }
        } catch (err) {
          if (process.env.NODE_ENV !== 'production') {
            console.debug('pyth:multi-price parse error', err);
          }
        }
      };

      ws.onclose = () => {
        if (!alive) return;

        // Update status for all symbols
        setPrices((prev) => {
          const updated = { ...prev };
          symbols.forEach((symbol) => {
            if (updated[symbol]) {
              updated[symbol] = { ...updated[symbol], status: 'connecting' };
            }
          });
          return updated;
        });

        if (reconnectAttempts < maxReconnectAttempts) {
          reconnectAttempts++;
          setTimeout(connect, 1500 * reconnectAttempts);
        } else {
          // Mark all as error after max attempts
          setPrices((prev) => {
            const updated = { ...prev };
            symbols.forEach((symbol) => {
              if (updated[symbol]) {
                updated[symbol] = { ...updated[symbol], status: 'error' };
              }
            });
            return updated;
          });
        }
      };

      ws.onerror = () => {
        // Mark all as error on connection error
        setPrices((prev) => {
          const updated = { ...prev };
          symbols.forEach((symbol) => {
            if (updated[symbol]) {
              updated[symbol] = { ...updated[symbol], status: 'error' };
            }
          });
          return updated;
        });
      };
    }

    // Initialize with connecting status
    setPrices((prev) => {
      const updated = { ...prev };
      symbols.forEach((symbol) => {
        updated[symbol] = {
          price: null,
          confidence: null,
          lastUpdated: null,
          status: 'connecting',
        };
      });
      return updated;
    });

    connect();

    return () => {
      alive = false;
      ws?.close();
    };
  }, [symbols]);

  return prices;
}

// Hook for single symbol with fallback
export function usePythPriceWithFallback(symbol: PriceFeedSymbol) {
  const priceId = PYTH_PRICE_FEEDS[symbol];
  const pythData = usePythPrice(priceId);
  const fallbackPrice = useFallbackAptPrice(symbol === 'APT/USD' && !pythData.price);

  return {
    ...pythData,
    price: pythData.price ?? fallbackPrice,
    source: pythData.price ? 'pyth' : fallbackPrice ? 'fallback' : null,
  };
}

// Optional fallback via public API (e.g., CoinGecko) if needed
export function useFallbackAptPrice(enabled: boolean) {
  const [price, setPrice] = React.useState<number | null>(null);
  React.useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    async function fetchPrice() {
      try {
        const res = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=aptos&vs_currencies=usd',
        );
        const json = await res.json();
        const p = json?.aptos?.usd;
        if (!cancelled && typeof p === 'number') setPrice(p);
      } catch (err) {
        if (process.env.NODE_ENV !== 'production') {
          console.debug('fallback price fetch failed', err);
        }
      }
    }
    fetchPrice();
    const timer = setInterval(fetchPrice, 10000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [enabled]);
  return price;
}
