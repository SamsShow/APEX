export type MarketMover = { symbol: string; changePct: number; last: number };
export const TOP_MOVERS: MarketMover[] = [
  { symbol: 'APEX-OPT-1', changePct: 12.4, last: 1.23 },
  { symbol: 'APEX-OPT-7', changePct: -6.8, last: 0.84 },
  { symbol: 'APEX-OPT-3', changePct: 5.6, last: 1.02 },
  { symbol: 'APEX-OPT-9', changePct: -3.1, last: 0.77 },
];

export type MarketEvent = { id: string; title: string; time: string };
export const MARKET_FEED: MarketEvent[] = [
  { id: '1', title: 'APT volatility spike detected', time: '1m ago' },
  { id: '2', title: 'New series listed: APEX-OPT-SEP', time: '8m ago' },
  { id: '3', title: 'Funding rate update applied', time: '15m ago' },
];
