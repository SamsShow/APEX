'use client';

import { useMemo } from 'react';
import { usePriceFeeds, OptionPriceData } from './usePriceFeeds';

export interface PricingInputs {
  underlyingPrice: number;
  strikePrice: number;
  timeToExpiry: number; // in years
  volatility: number; // as decimal (0.2 = 20%)
  riskFreeRate: number; // as decimal (0.05 = 5%)
  dividendYield: number; // as decimal
}

export interface Greeks {
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  rho: number;
}

// Black-Scholes pricing functions
const normCDF = (x: number): number => {
  // Abramowitz and Stegun approximation
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x);

  const t = 1.0 / (1.0 + p * absX);
  const erf = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);

  return 0.5 * (1.0 + sign * erf);
};

const d1 = (S: number, K: number, r: number, sigma: number, T: number): number => {
  return (Math.log(S / K) + (r + (sigma * sigma) / 2) * T) / (sigma * Math.sqrt(T));
};

const d2 = (S: number, K: number, r: number, sigma: number, T: number): number => {
  return d1(S, K, r, sigma, T) - sigma * Math.sqrt(T);
};

export function calculateBlackScholes(
  inputs: PricingInputs,
  optionType: 'call' | 'put',
): OptionPriceData {
  const {
    underlyingPrice: S,
    strikePrice: K,
    timeToExpiry: T,
    volatility: sigma,
    riskFreeRate: r,
    dividendYield: q,
  } = inputs;

  const d1_val = d1(S, K, r, sigma, T);
  const d2_val = d2(S, K, r, sigma, T);

  let price: number;
  let delta: number;
  let rho: number;

  if (optionType === 'call') {
    price = S * Math.exp(-q * T) * normCDF(d1_val) - K * Math.exp(-r * T) * normCDF(d2_val);
    delta = Math.exp(-q * T) * normCDF(d1_val);
    rho = K * T * Math.exp(-r * T) * normCDF(d2_val);
  } else {
    price = K * Math.exp(-r * T) * normCDF(-d2_val) - S * Math.exp(-q * T) * normCDF(-d1_val);
    delta = -Math.exp(-q * T) * normCDF(-d1_val);
    rho = -K * T * Math.exp(-r * T) * normCDF(-d2_val);
  }

  // Common Greeks
  const gamma =
    (Math.exp(-q * T) * Math.exp((-d1_val * d1_val) / 2)) /
    (S * sigma * Math.sqrt(T)) /
    Math.sqrt(2 * Math.PI);
  let thetaValue = -(
    (S * sigma * Math.exp(-q * T) * Math.exp((-d1_val * d1_val) / 2)) /
    (2 * Math.sqrt(T)) /
    Math.sqrt(2 * Math.PI)
  );

  if (optionType === 'call') {
    thetaValue +=
      r * K * Math.exp(-r * T) * normCDF(d2_val) - q * S * Math.exp(-q * T) * normCDF(d1_val);
  } else {
    thetaValue -=
      r * K * Math.exp(-r * T) * normCDF(-d2_val) - q * S * Math.exp(-q * T) * normCDF(-d1_val);
  }

  const theta = thetaValue;
  const vega =
    (S * Math.exp(-q * T) * Math.sqrt(T) * Math.exp((-d1_val * d1_val) / 2)) /
    Math.sqrt(2 * Math.PI);

  const impliedVolatility = sigma; // For now, return the input volatility

  return {
    underlyingPrice: S,
    strikePrice: K,
    optionType,
    expiryTimestamp: Date.now() + T * 365 * 24 * 60 * 60 * 1000, // Convert years to milliseconds
    theoreticalPrice: price,
    delta,
    gamma,
    theta: theta / 365, // Daily theta
    vega: vega / 100, // Vega per 1% vol change
    rho,
    impliedVolatility,
    lastUpdated: Date.now(),
  };
}

export function useOptionsPricing() {
  const { prices } = usePriceFeeds();

  // Calculate option price using Black-Scholes
  const calculateOptionPrice = useMemo(
    () =>
      (
        underlyingSymbol: string,
        strikePrice: number,
        expiryDays: number,
        optionType: 'call' | 'put',
        volatility?: number,
      ): OptionPriceData | null => {
        const underlyingPrice = prices[underlyingSymbol]?.price;

        if (!underlyingPrice) return null;

        const timeToExpiry = expiryDays / 365; // Convert days to years
        const vol = volatility || 0.2; // Default 20% volatility
        const riskFreeRate = 0.05; // 5% risk-free rate
        const dividendYield = 0.02; // 2% dividend yield for APT

        const inputs: PricingInputs = {
          underlyingPrice,
          strikePrice,
          timeToExpiry,
          volatility: vol,
          riskFreeRate,
          dividendYield,
        };

        return calculateBlackScholes(inputs, optionType);
      },
    [prices],
  );

  // Calculate implied volatility using Newton-Raphson method
  const calculateImpliedVolatility = useMemo(
    () =>
      (
        marketPrice: number,
        underlyingPrice: number,
        strikePrice: number,
        timeToExpiry: number,
        optionType: 'call' | 'put',
      ): number => {
        let sigma = 0.2; // Initial guess
        const tolerance = 0.0001;
        const maxIterations = 100;

        for (let i = 0; i < maxIterations; i++) {
          const inputs: PricingInputs = {
            underlyingPrice,
            strikePrice,
            timeToExpiry,
            volatility: sigma,
            riskFreeRate: 0.05,
            dividendYield: 0.02,
          };

          const bsPrice = calculateBlackScholes(inputs, optionType);
          const diff = bsPrice.theoreticalPrice - marketPrice;

          if (Math.abs(diff) < tolerance) {
            return sigma;
          }

          // Newton-Raphson step
          const vega = bsPrice.vega * 100; // Convert back to per 1% vol change
          if (vega !== 0) {
            sigma = sigma - diff / vega;
          }

          // Ensure sigma stays positive and reasonable
          sigma = Math.max(0.01, Math.min(2.0, sigma));
        }

        return sigma;
      },
    [],
  );

  // Get option chain for a symbol
  const getOptionChain = useMemo(
    () =>
      (underlyingSymbol: string, expiryDays: number, strikes: number[]): OptionPriceData[] => {
        const underlyingPrice = prices[underlyingSymbol]?.price;

        if (!underlyingPrice) return [];

        const timeToExpiry = expiryDays / 365;
        const volatility = 0.2; // Default volatility

        return strikes.flatMap((strike) => {
          const callInputs: PricingInputs = {
            underlyingPrice,
            strikePrice: strike,
            timeToExpiry,
            volatility,
            riskFreeRate: 0.05,
            dividendYield: 0.02,
          };

          const putInputs: PricingInputs = { ...callInputs };

          return [
            calculateBlackScholes(callInputs, 'call'),
            calculateBlackScholes(putInputs, 'put'),
          ];
        });
      },
    [prices],
  );

  return {
    calculateOptionPrice,
    calculateImpliedVolatility,
    getOptionChain,
  };
}
