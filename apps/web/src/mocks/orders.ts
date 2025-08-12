export type Order = {
  id: string;
  symbol: string;
  side: 'Buy' | 'Sell';
  price: number;
  size: number;
  status: 'Open' | 'Filled' | 'Cancelled' | 'Partial';
};

export const ORDERS: Order[] = [
  { id: 'O-1001', symbol: 'APEX-OPT-1', side: 'Buy', price: 1.12, size: 5, status: 'Open' },
  { id: 'O-1002', symbol: 'APEX-OPT-7', side: 'Sell', price: 0.92, size: 3, status: 'Partial' },
  { id: 'O-1003', symbol: 'APEX-OPT-3', side: 'Buy', price: 1.04, size: 4, status: 'Filled' },
];
