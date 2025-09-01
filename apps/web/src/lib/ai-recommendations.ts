'use client';

import { Strategy } from '@/components/strategy/StrategyBuilder';

export interface MarketConditions {
  volatility: number;
  trend: 'bullish' | 'bearish' | 'neutral';
  sentiment: 'positive' | 'negative' | 'neutral';
  volume: number;
  fearGreedIndex: number;
}

export interface PriceData {
  price: number;
  timestamp: Date;
}

export interface VolumeData {
  volume: number;
  timestamp: Date;
}

export interface StrategyTemplate {
  name: string;
  description: string;
  legs: Array<{
    type: 'call' | 'put' | 'stock';
    strikePrice: number;
    quantity: number;
    side: 'long' | 'short';
  }>;
  marketFit: boolean;
  riskFit: boolean;
  experienceFit: boolean;
}

export interface UserProfile {
  riskTolerance: 'low' | 'medium' | 'high';
  experience: 'beginner' | 'intermediate' | 'advanced';
  preferredTimeframe: 'short' | 'medium' | 'long';
  capital: number;
  currentPositions: unknown[];
}

export interface StrategyRecommendation {
  strategy: Strategy;
  confidence: number; // 0-1
  expectedReturn: number;
  riskLevel: 'low' | 'medium' | 'high';
  reasoning: string[];
  marketConditions: string[];
  timeHorizon: string;
  suitability: number; // 0-1 match with user profile
}

class AIRecommendationEngine {
  private marketData: MarketConditions | null = null;
  private userProfile: UserProfile | null = null;

  // Simulate market condition analysis
  analyzeMarketConditions(priceData: PriceData[], volumeData: VolumeData[]): MarketConditions {
    // Calculate volatility (simplified)
    const returns = priceData
      .slice(1)
      .map((price, i) => Math.log(price.price / priceData[i].price));
    const volatility =
      Math.sqrt(returns.reduce((sum, ret) => sum + ret * ret, 0) / returns.length) * Math.sqrt(252); // Annualized

    // Determine trend
    const recentPrices = priceData.slice(-20);
    const trendSlope = this.calculateTrendSlope(recentPrices);
    const trend = trendSlope > 0.02 ? 'bullish' : trendSlope < -0.02 ? 'bearish' : 'neutral';

    // Simulate sentiment analysis
    const sentiment = this.analyzeSentiment(priceData, volumeData);

    // Fear & Greed Index simulation
    const fearGreedIndex = this.calculateFearGreedIndex(volatility, trend, sentiment);

    return {
      volatility,
      trend,
      sentiment,
      volume: volumeData.reduce((sum, v) => sum + v.volume, 0) / volumeData.length,
      fearGreedIndex,
    };
  }

  private calculateTrendSlope(prices: PriceData[]): number {
    const n = prices.length;
    const sumX = (n * (n - 1)) / 2;
    const sumY = prices.reduce((sum, p) => sum + p.price, 0);
    const sumXY = prices.reduce((sum, p, i) => sum + i * p.price, 0);
    const sumXX = (n * (n - 1) * (2 * n - 1)) / 6;

    return (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  }

  private analyzeSentiment(
    priceData: PriceData[],
    volumeData: VolumeData[],
  ): 'positive' | 'negative' | 'neutral' {
    const recentPrices = priceData.slice(-10);
    const priceChange =
      (recentPrices[recentPrices.length - 1].price - recentPrices[0].price) / recentPrices[0].price;

    const volumeChange =
      volumeData.length > 10
        ? (volumeData[volumeData.length - 1].volume - volumeData[volumeData.length - 11].volume) /
          volumeData[volumeData.length - 11].volume
        : 0;

    if (priceChange > 0.05 && volumeChange > 0.2) return 'positive';
    if (priceChange < -0.05 && volumeChange > 0.2) return 'negative';
    return 'neutral';
  }

  private calculateFearGreedIndex(volatility: number, trend: string, sentiment: string): number {
    // Simplified Fear & Greed Index calculation
    let score = 50; // Neutral starting point

    // Volatility component (higher volatility = more fear)
    if (volatility > 0.8) score -= 20;
    else if (volatility < 0.3) score += 10;

    // Trend component
    if (trend === 'bullish') score += 15;
    else if (trend === 'bearish') score -= 15;

    // Sentiment component
    if (sentiment === 'positive') score += 15;
    else if (sentiment === 'negative') score -= 15;

    return Math.max(0, Math.min(100, score));
  }

  generateStrategyRecommendations(
    marketConditions: MarketConditions,
    userProfile: UserProfile,
    currentPrice: number,
  ): StrategyRecommendation[] {
    const recommendations: StrategyRecommendation[] = [];

    // Strategy templates with AI-driven selection logic
    const strategies = this.getAIStrategyTemplates(currentPrice, marketConditions, userProfile);

    strategies.forEach((strategyTemplate) => {
      const recommendation = this.evaluateStrategy(strategyTemplate, marketConditions, userProfile);
      if (recommendation.confidence > 0.6) {
        // Only recommend high-confidence strategies
        recommendations.push(recommendation);
      }
    });

    // Sort by suitability and confidence
    return recommendations
      .sort((a, b) => b.suitability + b.confidence - (a.suitability + a.confidence))
      .slice(0, 3); // Return top 3 recommendations
  }

  private getAIStrategyTemplates(
    currentPrice: number,
    conditions: MarketConditions,
    profile: UserProfile,
  ): StrategyTemplate[] {
    const baseStrategies = [
      {
        name: 'AI Bull Call Spread',
        description: 'AI-recommended bullish strategy with defined risk',
        legs: [
          {
            type: 'call' as const,
            strikePrice: currentPrice * 1.05,
            quantity: 1,
            side: 'long' as const,
          },
          {
            type: 'call' as const,
            strikePrice: currentPrice * 1.15,
            quantity: -1,
            side: 'short' as const,
          },
        ],
        marketFit: conditions.trend === 'bullish' && conditions.volatility < 0.6,
        riskFit: profile.riskTolerance !== 'low',
        experienceFit: profile.experience !== 'beginner',
      },
      {
        name: 'AI Protective Put',
        description: 'AI-recommended downside protection strategy',
        legs: [
          {
            type: 'put' as const,
            strikePrice: currentPrice * 0.95,
            quantity: 1,
            side: 'long' as const,
          },
          {
            type: 'stock' as const,
            strikePrice: currentPrice,
            quantity: -100,
            side: 'short' as const,
          },
        ],
        marketFit: conditions.trend === 'bearish' || conditions.volatility > 0.7,
        riskFit: profile.riskTolerance === 'low' || profile.riskTolerance === 'medium',
        experienceFit: true,
      },
      {
        name: 'AI Iron Condor',
        description: 'AI-recommended neutral strategy for range-bound markets',
        legs: [
          {
            type: 'put' as const,
            strikePrice: currentPrice * 0.9,
            quantity: 1,
            side: 'long' as const,
          },
          {
            type: 'put' as const,
            strikePrice: currentPrice * 0.95,
            quantity: -1,
            side: 'short' as const,
          },
          {
            type: 'call' as const,
            strikePrice: currentPrice * 1.05,
            quantity: -1,
            side: 'short' as const,
          },
          {
            type: 'call' as const,
            strikePrice: currentPrice * 1.1,
            quantity: 1,
            side: 'long' as const,
          },
        ],
        marketFit: conditions.trend === 'neutral' && conditions.volatility < 0.5,
        riskFit: profile.riskTolerance === 'medium' || profile.riskTolerance === 'high',
        experienceFit: profile.experience === 'advanced',
      },
      {
        name: 'AI Long Straddle',
        description: 'AI-recommended volatility play strategy',
        legs: [
          { type: 'call' as const, strikePrice: currentPrice, quantity: 1, side: 'long' as const },
          { type: 'put' as const, strikePrice: currentPrice, quantity: 1, side: 'long' as const },
        ],
        marketFit: conditions.volatility > 0.8 || conditions.fearGreedIndex < 30,
        riskFit: profile.riskTolerance === 'high',
        experienceFit: profile.experience === 'intermediate' || profile.experience === 'advanced',
      },
      {
        name: 'AI Covered Call',
        description: 'AI-recommended income generation strategy',
        legs: [
          {
            type: 'call' as const,
            strikePrice: currentPrice * 1.1,
            quantity: -1,
            side: 'short' as const,
          },
          {
            type: 'stock' as const,
            strikePrice: currentPrice,
            quantity: 100,
            side: 'long' as const,
          },
        ],
        marketFit: conditions.trend === 'neutral' && conditions.sentiment === 'positive',
        riskFit: profile.riskTolerance === 'low' || profile.riskTolerance === 'medium',
        experienceFit: profile.experience !== 'beginner',
      },
    ];

    return baseStrategies.filter(
      (strategy) => strategy.marketFit && strategy.riskFit && strategy.experienceFit,
    );
  }

  private evaluateStrategy(
    strategyTemplate: StrategyTemplate,
    conditions: MarketConditions,
    profile: UserProfile,
  ): StrategyRecommendation {
    // Calculate expected return based on market conditions
    const expectedReturn = this.calculateExpectedReturn(strategyTemplate, conditions);

    // Determine risk level
    const riskLevel = this.determineRiskLevel(strategyTemplate, profile);

    // Calculate confidence based on market fit
    const confidence = this.calculateConfidence(strategyTemplate, conditions, profile);

    // Generate reasoning
    const reasoning = this.generateReasoning(strategyTemplate, conditions, profile, expectedReturn);

    // Calculate suitability score
    const suitability = this.calculateSuitability(strategyTemplate, profile);

    return {
      strategy: {
        id: `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: strategyTemplate.name,
        description: strategyTemplate.description,
        legs: strategyTemplate.legs.map((leg, index) => ({
          ...leg,
          id: `leg_${index}`,
        })), // eslint-disable-line @typescript-eslint/no-unused-vars
        underlyingPrice: 0, // Will be set by caller
        expiryDays: 30,
        totalCost: 0,
        maxProfit: 0,
        maxLoss: 0,
        breakevenPoints: [],
        riskRewardRatio: 0,
      },
      confidence,
      expectedReturn,
      riskLevel,
      reasoning,
      marketConditions: this.describeMarketConditions(conditions),
      timeHorizon: this.determineTimeHorizon(strategyTemplate, conditions),
      suitability,
    };
  }

  private calculateExpectedReturn(
    strategy: StrategyTemplate,
    conditions: MarketConditions,
  ): number {
    // Simplified expected return calculation
    let baseReturn = 0;

    switch (strategy.name) {
      case 'AI Bull Call Spread':
        baseReturn = conditions.trend === 'bullish' ? 15 : 5;
        break;
      case 'AI Protective Put':
        baseReturn = conditions.trend === 'bearish' ? 8 : 2;
        break;
      case 'AI Iron Condor':
        baseReturn = conditions.trend === 'neutral' ? 12 : 3;
        break;
      case 'AI Long Straddle':
        baseReturn = conditions.volatility > 0.8 ? 25 : 5;
        break;
      case 'AI Covered Call':
        baseReturn = conditions.sentiment === 'positive' ? 10 : 4;
        break;
      default:
        baseReturn = 8;
    }

    // Adjust for volatility
    if (conditions.volatility > 0.8) baseReturn *= 1.3;
    else if (conditions.volatility < 0.3) baseReturn *= 0.7;

    return baseReturn;
  }

  private determineRiskLevel(
    strategy: StrategyTemplate,
    profile: UserProfile,
  ): 'low' | 'medium' | 'high' {
    const strategyRiskMap: Record<string, 'low' | 'medium' | 'high'> = {
      'AI Bull Call Spread': 'medium',
      'AI Protective Put': 'low',
      'AI Iron Condor': 'medium',
      'AI Long Straddle': 'high',
      'AI Covered Call': 'low',
    };

    const baseRisk = strategyRiskMap[strategy.name] || 'medium';

    // Adjust based on user profile
    if (profile.riskTolerance === 'low' && baseRisk === 'high') return 'medium';
    if (profile.riskTolerance === 'high' && baseRisk === 'low') return 'medium';

    return baseRisk;
  }

  private calculateConfidence(
    strategy: StrategyTemplate,
    conditions: MarketConditions,
    profile: UserProfile, // eslint-disable-line @typescript-eslint/no-unused-vars
  ): number {
    let confidence = 0.7; // Base confidence

    // Market fit bonus
    if (strategy.marketFit) confidence += 0.2;

    // Risk alignment bonus
    if (strategy.riskFit) confidence += 0.1;

    // Experience alignment bonus
    if (strategy.experienceFit) confidence += 0.1;

    // Market condition bonuses
    if (conditions.trend === 'bullish' && strategy.name.includes('Bull')) confidence += 0.1;
    if (conditions.volatility > 0.8 && strategy.name.includes('Straddle')) confidence += 0.15;

    return Math.min(1.0, confidence);
  }

  private generateReasoning(
    strategy: StrategyTemplate,
    conditions: MarketConditions,
    profile: UserProfile, // eslint-disable-line @typescript-eslint/no-unused-vars
    expectedReturn: number,
  ): string[] {
    // Note: profile parameter is kept for future enhancements but not currently used
    const reasoning: string[] = [];

    // Market condition reasoning
    if (conditions.trend === 'bullish' && strategy.name.includes('Bull')) {
      reasoning.push("Bullish market trend aligns with this strategy's directional bias");
    }

    if (conditions.volatility > 0.8 && strategy.name.includes('Straddle')) {
      reasoning.push('High volatility environment favors volatility-based strategies');
    }

    if (conditions.trend === 'neutral' && strategy.name.includes('Iron Condor')) {
      reasoning.push('Neutral market conditions are ideal for range-bound strategies');
    }

    // Risk profile reasoning
    if (profile.riskTolerance === 'low' && strategy.name.includes('Protective')) {
      reasoning.push('Matches your conservative risk tolerance with downside protection');
    }

    if (profile.riskTolerance === 'high' && strategy.name.includes('Straddle')) {
      reasoning.push('Aligns with your high risk tolerance for potential high returns');
    }

    // Expected return reasoning
    reasoning.push(
      `Expected ${expectedReturn.toFixed(1)}% return based on current market conditions`,
    );

    // Experience level reasoning
    if (profile.experience === 'beginner' && strategy.name.includes('Covered Call')) {
      reasoning.push('Suitable for beginners with defined risk and income potential');
    }

    return reasoning;
  }

  private describeMarketConditions(conditions: MarketConditions): string[] {
    const descriptions: string[] = [];

    descriptions.push(`Volatility: ${(conditions.volatility * 100).toFixed(1)}%`);
    descriptions.push(`Trend: ${conditions.trend}`);
    descriptions.push(`Sentiment: ${conditions.sentiment}`);
    descriptions.push(`Fear & Greed Index: ${conditions.fearGreedIndex.toFixed(0)}/100`);

    return descriptions;
  }

  private determineTimeHorizon(strategy: StrategyTemplate, conditions: MarketConditions): string {
    // eslint-disable-line @typescript-eslint/no-unused-vars
    // Determine recommended holding period
    if (strategy.name.includes('Iron Condor') || strategy.name.includes('Covered Call')) {
      return '1-3 weeks';
    }
    if (strategy.name.includes('Straddle') || conditions.volatility > 0.8) {
      return '1-2 weeks';
    }
    if (strategy.name.includes('Bull Call') || strategy.name.includes('Protective Put')) {
      return '2-4 weeks';
    }
    return '2-6 weeks';
  }

  private calculateSuitability(strategy: StrategyTemplate, profile: UserProfile): number {
    // eslint-disable-line @typescript-eslint/no-unused-vars
    let suitability = 0.5; // Base suitability

    // Risk tolerance alignment
    if (profile.riskTolerance === 'low' && strategy.name.includes('Protective')) suitability += 0.3;
    if (profile.riskTolerance === 'high' && strategy.name.includes('Straddle')) suitability += 0.3;

    // Experience alignment
    if (profile.experience === 'beginner' && strategy.name.includes('Covered Call'))
      suitability += 0.2;
    if (profile.experience === 'advanced' && strategy.name.includes('Iron Condor'))
      suitability += 0.2;

    // Capital alignment (simplified)
    if (profile.capital > 10000 && strategy.name.includes('Straddle')) suitability += 0.1;

    return Math.min(1.0, suitability);
  }
}

// Export singleton instance
export const aiRecommendationEngine = new AIRecommendationEngine();

// Utility functions for components
export function getMarketConditionDescription(conditions: MarketConditions): string {
  let description = '';

  if (conditions.trend === 'bullish') {
    description += '📈 Bullish market with ';
  } else if (conditions.trend === 'bearish') {
    description += '📉 Bearish market with ';
  } else {
    description += '➡️ Sideways market with ';
  }

  if (conditions.volatility > 0.8) {
    description += 'high volatility. ';
  } else if (conditions.volatility > 0.4) {
    description += 'moderate volatility. ';
  } else {
    description += 'low volatility. ';
  }

  if (conditions.fearGreedIndex > 75) {
    description += 'Market sentiment is extremely greedy.';
  } else if (conditions.fearGreedIndex > 55) {
    description += 'Market sentiment is greedy.';
  } else if (conditions.fearGreedIndex < 25) {
    description += 'Market sentiment is extremely fearful.';
  } else if (conditions.fearGreedIndex < 45) {
    description += 'Market sentiment is fearful.';
  } else {
    description += 'Market sentiment is neutral.';
  }

  return description;
}

export function getRiskColor(riskLevel: 'low' | 'medium' | 'high'): string {
  switch (riskLevel) {
    case 'low':
      return 'text-green-400';
    case 'medium':
      return 'text-yellow-400';
    case 'high':
      return 'text-red-400';
    default:
      return 'text-zinc-400';
  }
}

export function getConfidenceColor(confidence: number): string {
  if (confidence >= 0.8) return 'text-green-400';
  if (confidence >= 0.6) return 'text-yellow-400';
  return 'text-red-400';
}
