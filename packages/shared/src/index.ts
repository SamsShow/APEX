// Core utilities
export const exampleSharedValue = 'shared';

// Types
export * from './types';

// Contract interactions
export * from './contracts';

// Pricing models
export * from './pricing';

// Re-export commonly used items
export { ApexOptionsContract, apexContract } from './contracts';
export type {
  OptionContract,
  OptionSeries,
  StrategyLeg,
  CompositeOrder,
  PortfolioPosition,
  UserAccount,
  PricingParams,
  MarketData,
} from './types';
