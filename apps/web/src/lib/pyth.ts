'use client';

import React from 'react';

// Minimal Pyth Hermes WS client for a single feed id
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
