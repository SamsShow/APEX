import { PricingParams, MarketData, OptionType } from './types';

/**
 * Standard Normal CDF approximation using Abramowitz and Stegun approximation
 */
function normalCDF(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x) / Math.sqrt(2.0);

  const t = 1.0 / (1.0 + p * absX);
  const erf = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);

  return 0.5 * (1.0 + sign * erf);
}

/**
 * Black-Scholes option pricing model
 */
export function blackScholesPrice(params: PricingParams, optionType: OptionType): number {
  const { spotPrice, strikePrice, timeToExpiry, volatility, riskFreeRate, dividendYield } = params;

  const d1 =
    (Math.log(spotPrice / strikePrice) +
      (riskFreeRate - dividendYield + (volatility * volatility) / 2) * timeToExpiry) /
    (volatility * Math.sqrt(timeToExpiry));

  const d2 = d1 - volatility * Math.sqrt(timeToExpiry);

  if (optionType === 'call') {
    return (
      spotPrice * Math.exp(-dividendYield * timeToExpiry) * normalCDF(d1) -
      strikePrice * Math.exp(-riskFreeRate * timeToExpiry) * normalCDF(d2)
    );
  } else {
    return (
      strikePrice * Math.exp(-riskFreeRate * timeToExpiry) * normalCDF(-d2) -
      spotPrice * Math.exp(-dividendYield * timeToExpiry) * normalCDF(-d1)
    );
  }
}

/**
 * Calculate option Greeks
 */
export function calculateGreeks(params: PricingParams, optionType: OptionType) {
  const { spotPrice, strikePrice, timeToExpiry, volatility, riskFreeRate, dividendYield } = params;

  const d1 =
    (Math.log(spotPrice / strikePrice) +
      (riskFreeRate - dividendYield + (volatility * volatility) / 2) * timeToExpiry) /
    (volatility * Math.sqrt(timeToExpiry));

  const d2 = d1 - volatility * Math.sqrt(timeToExpiry);

  const n_d1 = Math.exp((-d1 * d1) / 2) / Math.sqrt(2 * Math.PI);
  const n_d2 = Math.exp((-d2 * d2) / 2) / Math.sqrt(2 * Math.PI);

  // Delta
  const delta =
    optionType === 'call'
      ? Math.exp(-dividendYield * timeToExpiry) * normalCDF(d1)
      : Math.exp(-dividendYield * timeToExpiry) * (normalCDF(d1) - 1);

  // Gamma
  const gamma =
    (Math.exp(-dividendYield * timeToExpiry) * n_d1) /
    (spotPrice * volatility * Math.sqrt(timeToExpiry));

  // Theta
  const theta_call =
    ((-spotPrice * n_d1 * volatility * Math.exp(-dividendYield * timeToExpiry)) /
      (2 * Math.sqrt(timeToExpiry)) -
      riskFreeRate * strikePrice * Math.exp(-riskFreeRate * timeToExpiry) * normalCDF(d2) +
      dividendYield * spotPrice * Math.exp(-dividendYield * timeToExpiry) * normalCDF(d1)) /
    365;

  const theta_put =
    ((-spotPrice * n_d1 * volatility * Math.exp(-dividendYield * timeToExpiry)) /
      (2 * Math.sqrt(timeToExpiry)) +
      riskFreeRate * strikePrice * Math.exp(-riskFreeRate * timeToExpiry) * normalCDF(-d2) -
      dividendYield * spotPrice * Math.exp(-dividendYield * timeToExpiry) * normalCDF(-d1)) /
    365;

  const theta = optionType === 'call' ? theta_call : theta_put;

  // Vega
  const vega =
    (spotPrice * Math.exp(-dividendYield * timeToExpiry) * Math.sqrt(timeToExpiry) * n_d1) / 100;

  // Rho
  const rho_call =
    (strikePrice * timeToExpiry * Math.exp(-riskFreeRate * timeToExpiry) * normalCDF(d2)) / 100;
  const rho_put =
    (-strikePrice * timeToExpiry * Math.exp(-riskFreeRate * timeToExpiry) * normalCDF(-d2)) / 100;
  const rho = optionType === 'call' ? rho_call : rho_put;

  return { delta, gamma, theta, vega, rho };
}

/**
 * Calculate implied volatility using Newton-Raphson method
 */
export function calculateImpliedVolatility(
  marketPrice: number,
  params: Omit<PricingParams, 'volatility'>,
  optionType: OptionType,
  tolerance: number = 0.0001,
  maxIterations: number = 100,
): number {
  let volatility = 0.2; // Initial guess

  for (let i = 0; i < maxIterations; i++) {
    const price = blackScholesPrice({ ...params, volatility }, optionType);
    const vega = calculateGreeks({ ...params, volatility }, optionType).vega;

    const error = price - marketPrice;
    if (Math.abs(error) < tolerance) {
      break;
    }

    volatility -= error / (vega * 100); // Vega is usually in percent
    volatility = Math.max(0.01, Math.min(2.0, volatility)); // Clamp between 1% and 200%
  }

  return volatility;
}

/**
 * Generate pricing parameters from market data and option details
 */
export function createPricingParams(
  spotPrice: number,
  strikePrice: number,
  expiryDate: Date,
  volatility: number,
  riskFreeRate: number = 0.05,
  dividendYield: number = 0,
): PricingParams {
  const now = new Date();
  const timeToExpiry = (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 365); // Convert to years

  return {
    spotPrice,
    strikePrice,
    timeToExpiry: Math.max(0.001, timeToExpiry), // Ensure positive time
    volatility,
    riskFreeRate,
    dividendYield,
  };
}

/**
 * Calculate theoretical price for an option
 */
export function calculateTheoreticalPrice(
  spotPrice: number,
  strikePrice: number,
  expiryDate: Date,
  volatility: number,
  optionType: OptionType,
  riskFreeRate: number = 0.05,
  dividendYield: number = 0,
): number {
  const params = createPricingParams(
    spotPrice,
    strikePrice,
    expiryDate,
    volatility,
    riskFreeRate,
    dividendYield,
  );
  return blackScholesPrice(params, optionType);
}

/**
 * Calculate payoff at expiration
 */
export function calculatePayoff(
  spotPrice: number,
  strikePrice: number,
  optionType: OptionType,
  position: 'long' | 'short' = 'long',
): number {
  let payoff = 0;

  if (optionType === 'call') {
    payoff = Math.max(spotPrice - strikePrice, 0);
  } else {
    payoff = Math.max(strikePrice - spotPrice, 0);
  }

  return position === 'long' ? payoff : -payoff;
}

/**
 * Calculate break-even points for strategies
 */
export function calculateBreakEvenPoints(
  strikes: number[],
  optionTypes: OptionType[],
  positions: ('long' | 'short')[],
): number[] {
  if (strikes.length === 1) {
    return [strikes[0]];
  }

  // For spreads, find the net zero payoff point
  const breakEvens: number[] = [];

  // Simple implementation for basic strategies
  if (strikes.length === 2) {
    const [strike1, strike2] = strikes;
    const [type1, type2] = optionTypes;
    const [pos1, pos2] = positions;

    if (type1 === type2) {
      // Same type - bull/bear spread
      if (pos1 === 'long' && pos2 === 'short') {
        breakEvens.push(strike1 + (strike2 - strike1) * (type1 === 'call' ? 1 : -1));
      }
    } else {
      // Different types - straddle/strangle
      breakEvens.push(strike1, strike2);
    }
  }

  return breakEvens;
}
