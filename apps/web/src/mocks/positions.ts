export type Position = {
  symbol: string;
  side: 'Long' | 'Short';
  qty: number;
  avgPrice: number;
  pnl: number;
};

export const POSITIONS: Position[] = [
  { symbol: 'APEX-OPT-1', side: 'Long', qty: 4, avgPrice: 1.12, pnl: 24.5 },
  { symbol: 'APEX-OPT-2', side: 'Short', qty: 2, avgPrice: 0.88, pnl: -6.1 },
  { symbol: 'APEX-OPT-3', side: 'Long', qty: 6, avgPrice: 1.05, pnl: 18.2 },
];
