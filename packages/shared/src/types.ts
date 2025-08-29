// Apex Options Trading Platform Types
// Based on Move smart contract structures

export type OptionType = 'call' | 'put';
export type OrderSide = 'buy' | 'sell';
export type OptionStatus = 'active' | 'exercised' | 'canceled' | 'expired';

export interface OptionContract {
  id: number;
  owner: string;
  seriesId: number;
  strikePrice: number;
  expirySeconds: number;
  optionType: OptionType;
  quantity: number;
  status: OptionStatus;
  settlementPrice: number;
  payoutAmount: number;
}

export interface OptionSeries {
  id: number;
  strikePrice: number;
  expirySeconds: number;
  optionType: OptionType;
}

export interface StrategyLeg {
  id: string;
  type: OptionType;
  action: OrderSide;
  strike: number;
  expiry: string;
  qty: number;
}

export interface CompositeOrder {
  id: string;
  legs: StrategyLeg[];
  underlying: string;
  expiry: string;
  netPrice: number;
  quantity: number;
  status: 'pending' | 'filled' | 'canceled';
}

// Contract interaction types
export interface ContractConfig {
  address: string;
  module: string;
}

// Move contract constants (matching smart contract)
export const OPTION_TYPE_CALL = 0;
export const OPTION_TYPE_PUT = 1;

export const STATUS_ACTIVE = 0;
export const STATUS_EXERCISED = 1;
export const STATUS_CANCELED = 2;

// Error codes from smart contract
export const CONTRACT_ERRORS = {
  EALREADY_INITIALIZED: 1,
  EINVALID_OPTION_TYPE: 2,
  EINVALID_QUANTITY: 3,
  EINVALID_STRIKE: 4,
  EINVALID_EXPIRY: 5,
  ENOT_FOUND: 6,
  EALREADY_TERMINATED: 7,
  EEXPIRED: 8,
  EINVALID_SERIES: 9,
} as const;

// Black-Scholes pricing parameters
export interface PricingParams {
  spotPrice: number;
  strikePrice: number;
  timeToExpiry: number; // in years
  volatility: number;
  riskFreeRate: number;
  dividendYield: number;
}

// Market data for theoretical pricing
export interface MarketData {
  spotPrice: number;
  volatility: number;
  riskFreeRate: number;
  dividendYield: number;
}

// Order book entry
export interface OrderBookEntry {
  price: number;
  quantity: number;
  total: number;
}

export interface OrderBook {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
}

// Portfolio position
export interface PortfolioPosition {
  symbol: string;
  side: 'long' | 'short';
  quantity: number;
  avgPrice: number;
  unrealizedPnL: number;
  realizedPnL: number;
}

// User account state
export interface UserAccount {
  address: string;
  isInitialized: boolean;
  options: OptionContract[];
  portfolio: PortfolioPosition[];
  balances: Record<string, number>;
}
