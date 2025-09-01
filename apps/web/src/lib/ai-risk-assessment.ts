'use client';

export interface MarketConditionData {
  volatility: number;
  fearGreedIndex: number;
}

export interface UserProfileData {
  riskTolerance: 'low' | 'medium' | 'high';
  experience: 'beginner' | 'intermediate' | 'advanced';
}

export interface PortfolioPosition {
  id: string;
  symbol: string;
  type: 'call' | 'put' | 'stock';
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  marketValue: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  rho: number;
}

export interface RiskMetrics {
  totalValue: number;
  totalPnL: number;
  dailyPnL: number;
  sharpeRatio: number;
  volatility: number;
  maxDrawdown: number;
  winRate: number;
  averageWin: number;
  averageLoss: number;
  riskRewardRatio: number;
  beta: number;
  valueAtRisk: number; // 95% VaR
  expectedShortfall: number; // Conditional VaR
}

export interface RiskAssessment {
  overallRisk: 'low' | 'medium' | 'high' | 'extreme';
  riskScore: number; // 0-100
  riskFactors: RiskFactor[];
  recommendations: RiskRecommendation[];
  optimalAllocation: PortfolioAllocation;
  stressTestResults: StressTestResult[];
}

export interface RiskFactor {
  factor: string;
  level: 'low' | 'medium' | 'high';
  impact: number; // -1 to 1
  description: string;
  mitigation: string;
}

export interface RiskRecommendation {
  type: 'reduce' | 'increase' | 'hedge' | 'diversify' | 'rebalance';
  priority: 'low' | 'medium' | 'high';
  description: string;
  expectedImpact: number; // -1 to 1
  timeframe: 'immediate' | 'short' | 'medium' | 'long';
}

export interface PortfolioAllocation {
  current: Record<string, number>; // symbol -> percentage
  recommended: Record<string, number>; // symbol -> percentage
  changes: AllocationChange[];
}

export interface AllocationChange {
  symbol: string;
  currentPercent: number;
  recommendedPercent: number;
  changeAmount: number;
  reason: string;
}

export interface StressTestResult {
  scenario: string;
  probability: number; // 0-1
  potentialLoss: number;
  potentialLossPercent: number;
  recoveryTime: string;
}

class AIRiskAssessmentEngine {
  // Calculate comprehensive risk metrics
  calculateRiskMetrics(positions: PortfolioPosition[]): RiskMetrics {
    // Handle empty positions array
    if (!positions || positions.length === 0) {
      return {
        totalValue: 0,
        totalPnL: 0,
        dailyPnL: 0,
        sharpeRatio: 0,
        volatility: 0,
        maxDrawdown: 0,
        winRate: 0,
        averageWin: 0,
        averageLoss: 0,
        riskRewardRatio: 0,
        beta: 1.0,
        valueAtRisk: 0,
        expectedShortfall: 0,
      };
    }

    const totalValue = positions.reduce((sum, pos) => sum + pos.marketValue, 0);
    const totalPnL = positions.reduce((sum, pos) => sum + pos.unrealizedPnL, 0);

    // Calculate volatility (simplified)
    const dailyReturns = positions.map((pos) => pos.unrealizedPnLPercent);
    const avgReturn =
      dailyReturns.length > 0
        ? dailyReturns.reduce((sum, ret) => sum + ret, 0) / dailyReturns.length
        : 0;

    const volatility =
      dailyReturns.length > 1
        ? Math.sqrt(
            dailyReturns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) /
              (dailyReturns.length - 1),
          )
        : 0;

    // Calculate Sharpe ratio (simplified, assuming 0% risk-free rate)
    const sharpeRatio = volatility > 0 ? avgReturn / volatility : 0;

    // Calculate max drawdown with proper null checks
    let peak = -Infinity;
    let maxDrawdown = 0;
    let currentValue = 0;

    positions.forEach((pos) => {
      currentValue += pos.marketValue;
      if (currentValue > peak) {
        peak = currentValue;
      } else if (peak > 0) {
        // Prevent division by zero
        const drawdown = ((peak - currentValue) / peak) * 100;
        if (drawdown > maxDrawdown) {
          maxDrawdown = drawdown;
        }
      }
    });

    // Win rate and average win/loss
    const winningTrades = positions.filter((pos) => pos.unrealizedPnL > 0);
    const losingTrades = positions.filter((pos) => pos.unrealizedPnL < 0);

    const winRate = positions.length > 0 ? (winningTrades.length / positions.length) * 100 : 0;
    const averageWin =
      winningTrades.length > 0
        ? winningTrades.reduce((sum, pos) => sum + pos.unrealizedPnL, 0) / winningTrades.length
        : 0;
    const averageLoss =
      losingTrades.length > 0
        ? Math.abs(
            losingTrades.reduce((sum, pos) => sum + pos.unrealizedPnL, 0) / losingTrades.length,
          )
        : 0;

    const riskRewardRatio = averageLoss > 0 ? averageWin / averageLoss : 0;

    // Calculate Value at Risk (simplified) with safety checks
    const valueAtRisk =
      isFinite(totalValue) && isFinite(volatility)
        ? totalValue * volatility * 1.645 // 95% confidence
        : 0;
    const expectedShortfall =
      isFinite(totalValue) && isFinite(volatility)
        ? totalValue * volatility * 2.0 // Conditional VaR
        : 0;

    return {
      totalValue,
      totalPnL,
      dailyPnL: totalPnL * 0.1, // Simplified daily calculation
      sharpeRatio,
      volatility: volatility * 100, // Convert to percentage
      maxDrawdown,
      winRate,
      averageWin,
      averageLoss,
      riskRewardRatio,
      beta: 1.2, // Simplified beta calculation
      valueAtRisk,
      expectedShortfall,
    };
  }

  // Perform comprehensive risk assessment
  async assessPortfolioRisk(
    positions: PortfolioPosition[],
    marketConditions: MarketConditionData,
    userProfile: UserProfileData,
  ): Promise<RiskAssessment> {
    const metrics = this.calculateRiskMetrics(positions);

    // Determine overall risk level
    const overallRisk = this.determineOverallRisk(metrics, marketConditions, userProfile);
    const riskScore = this.calculateRiskScore(metrics, marketConditions, userProfile);

    // Identify risk factors
    const riskFactors = this.identifyRiskFactors(positions, metrics, marketConditions);

    // Generate recommendations
    const recommendations = this.generateRiskRecommendations(
      positions,
      metrics,
      riskFactors,
      userProfile,
    );

    // Calculate optimal allocation
    const optimalAllocation = this.calculateOptimalAllocation(positions, metrics, userProfile);

    // Run stress tests
    const stressTestResults = this.runStressTests(positions, metrics);

    return {
      overallRisk,
      riskScore,
      riskFactors,
      recommendations,
      optimalAllocation,
      stressTestResults,
    };
  }

  private determineOverallRisk(
    metrics: RiskMetrics,
    marketConditions: MarketConditionData,
    userProfile: UserProfileData,
  ): 'low' | 'medium' | 'high' | 'extreme' {
    let riskScore = 0;

    // Volatility risk
    if (metrics.volatility > 50) riskScore += 25;
    else if (metrics.volatility > 30) riskScore += 15;
    else if (metrics.volatility > 20) riskScore += 5;

    // Drawdown risk
    if (metrics.maxDrawdown > 20) riskScore += 25;
    else if (metrics.maxDrawdown > 10) riskScore += 15;
    else if (metrics.maxDrawdown > 5) riskScore += 5;

    // VaR risk
    const varPercent = (metrics.valueAtRisk / metrics.totalValue) * 100;
    if (varPercent > 10) riskScore += 25;
    else if (varPercent > 5) riskScore += 15;
    else if (varPercent > 2) riskScore += 5;

    // Market condition risk
    if (marketConditions?.volatility > 0.8) riskScore += 10;
    if (marketConditions?.fearGreedIndex < 30) riskScore += 10;

    // User profile adjustment
    if (userProfile?.riskTolerance === 'low') riskScore += 10;
    if (userProfile?.riskTolerance === 'high') riskScore -= 10;

    if (riskScore >= 50) return 'extreme';
    if (riskScore >= 30) return 'high';
    if (riskScore >= 15) return 'medium';
    return 'low';
  }

  private calculateRiskScore(
    metrics: RiskMetrics,
    marketConditions: MarketConditionData,
    userProfile: UserProfileData,
  ): number {
    // Normalize various risk metrics to 0-100 scale
    const volatilityScore = Math.min(metrics.volatility / 2, 100);
    const drawdownScore = Math.min(metrics.maxDrawdown * 2, 100);
    const varScore = Math.min((metrics.valueAtRisk / metrics.totalValue) * 500, 100);

    let score = (volatilityScore + drawdownScore + varScore) / 3;

    // Adjust based on market conditions
    if (marketConditions?.volatility > 0.8) score += 10;
    if (marketConditions?.fearGreedIndex < 30) score += 10;

    // Adjust based on user profile
    if (userProfile?.riskTolerance === 'low') score += 15;
    if (userProfile?.riskTolerance === 'high') score -= 15;

    return Math.max(0, Math.min(100, score));
  }

  private identifyRiskFactors(
    positions: PortfolioPosition[],
    metrics: RiskMetrics,
    marketConditions: MarketConditionData,
  ): RiskFactor[] {
    const factors: RiskFactor[] = [];

    // Concentration risk
    const topPosition = Math.max(
      ...positions.map((p) => (p.marketValue / metrics.totalValue) * 100),
    );
    if (topPosition > 30) {
      factors.push({
        factor: 'Portfolio Concentration',
        level: 'high',
        impact: 0.8,
        description: `${topPosition.toFixed(1)}% of portfolio in single position`,
        mitigation: 'Diversify across multiple assets and strategies',
      });
    }

    // Volatility risk
    if (metrics.volatility > 40) {
      factors.push({
        factor: 'High Portfolio Volatility',
        level: 'high',
        impact: 0.7,
        description: `Portfolio volatility at ${metrics.volatility.toFixed(1)}%`,
        mitigation: 'Add stabilizing positions or reduce leveraged exposure',
      });
    }

    // Market risk
    if (marketConditions?.volatility > 0.8) {
      factors.push({
        factor: 'Market Volatility',
        level: 'high',
        impact: 0.6,
        description: 'Current market conditions are highly volatile',
        mitigation: 'Consider reducing position sizes or implementing hedging strategies',
      });
    }

    // Liquidity risk
    const illiquidPositions = positions.filter((p) => p.marketValue < 1000);
    if (illiquidPositions.length > positions.length * 0.5) {
      factors.push({
        factor: 'Liquidity Risk',
        level: 'medium',
        impact: 0.4,
        description: 'Multiple positions with low liquidity',
        mitigation: 'Focus on more liquid assets or reduce position sizes',
      });
    }

    // Greeks risk
    const netDelta = positions.reduce((sum, p) => sum + p.delta * p.quantity, 0);
    if (Math.abs(netDelta) > 1) {
      factors.push({
        factor: 'Delta Exposure',
        level: 'medium',
        impact: 0.5,
        description: `Net delta exposure of ${netDelta.toFixed(2)}`,
        mitigation: 'Balance delta exposure through hedging or position adjustment',
      });
    }

    return factors;
  }

  private generateRiskRecommendations(
    positions: PortfolioPosition[],
    metrics: RiskMetrics,
    riskFactors: RiskFactor[],
    userProfile: UserProfileData, // eslint-disable-line @typescript-eslint/no-unused-vars
  ): RiskRecommendation[] {
    // Note: userProfile parameter is kept for future enhancements but not currently used
    const recommendations: RiskRecommendation[] = [];

    // Recommendations based on risk factors
    riskFactors.forEach((factor) => {
      switch (factor.factor) {
        case 'Portfolio Concentration':
          recommendations.push({
            type: 'diversify',
            priority: 'high',
            description: 'Diversify portfolio to reduce concentration risk',
            expectedImpact: -0.3,
            timeframe: 'medium',
          });
          break;
        case 'High Portfolio Volatility':
          recommendations.push({
            type: 'hedge',
            priority: 'high',
            description: 'Implement hedging strategies to reduce volatility',
            expectedImpact: -0.4,
            timeframe: 'short',
          });
          break;
        case 'Market Volatility':
          recommendations.push({
            type: 'reduce',
            priority: 'medium',
            description: 'Reduce position sizes during volatile market conditions',
            expectedImpact: -0.2,
            timeframe: 'immediate',
          });
          break;
      }
    });

    // Sharpe ratio recommendations
    if (metrics.sharpeRatio < 1) {
      recommendations.push({
        type: 'rebalance',
        priority: 'medium',
        description: 'Rebalance portfolio to improve risk-adjusted returns',
        expectedImpact: 0.2,
        timeframe: 'medium',
      });
    }

    // Win rate recommendations
    if (metrics.winRate < 50) {
      recommendations.push({
        type: 'rebalance',
        priority: 'medium',
        description: 'Review and optimize trading strategy performance',
        expectedImpact: 0.3,
        timeframe: 'medium',
      });
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  private calculateOptimalAllocation(
    positions: PortfolioPosition[],
    metrics: RiskMetrics,
    userProfile: UserProfileData,
  ): PortfolioAllocation {
    const current: Record<string, number> = {};
    const recommended: Record<string, number> = {};

    // Calculate current allocation
    positions.forEach((pos) => {
      current[pos.symbol] = (pos.marketValue / metrics.totalValue) * 100;
    });

    // Generate recommended allocation based on risk profile
    const riskMultiplier =
      userProfile?.riskTolerance === 'low'
        ? 0.5
        : userProfile?.riskTolerance === 'high'
          ? 1.5
          : 1.0;

    positions.forEach((pos) => {
      let recommendedPercent = current[pos.symbol] || 0;

      // Adjust based on performance
      if (pos.unrealizedPnLPercent > 10) {
        recommendedPercent *= 0.9; // Take some profits
      } else if (pos.unrealizedPnLPercent < -10) {
        recommendedPercent *= 0.8; // Reduce losing positions
      }

      // Apply risk adjustment
      recommendedPercent *= riskMultiplier;

      // Ensure reasonable bounds
      recommendedPercent = Math.max(5, Math.min(40, recommendedPercent));
      recommended[pos.symbol] = recommendedPercent;
    });

    // Calculate changes
    const changes: AllocationChange[] = [];
    Object.keys(current).forEach((symbol) => {
      const currentPercent = current[symbol];
      const recommendedPercent = recommended[symbol];
      const changeAmount = recommendedPercent - currentPercent;

      if (Math.abs(changeAmount) > 5) {
        // Only show significant changes
        changes.push({
          symbol,
          currentPercent,
          recommendedPercent,
          changeAmount,
          reason:
            changeAmount > 0
              ? 'Increase position for better diversification'
              : 'Reduce position to manage risk',
        });
      }
    });

    return { current, recommended, changes };
  }

  private runStressTests(positions: PortfolioPosition[], metrics: RiskMetrics): StressTestResult[] {
    // Note: userProfile parameter removed as it's not used in this function
    const scenarios = [
      { name: 'Market Crash (-20%)', probability: 0.1, multiplier: 0.8 },
      { name: 'Moderate Decline (-10%)', probability: 0.2, multiplier: 0.9 },
      { name: 'High Volatility (+50%)', probability: 0.15, multiplier: 1.5 },
      { name: 'Liquidity Crisis', probability: 0.05, multiplier: 0.7 },
    ];

    return scenarios.map((scenario) => {
      const potentialLoss = metrics.totalValue * (1 - scenario.multiplier);
      const potentialLossPercent = (potentialLoss / metrics.totalValue) * 100;

      let recoveryTime = '1-3 months';
      if (potentialLossPercent > 30) recoveryTime = '3-6 months';
      if (potentialLossPercent > 50) recoveryTime = '6-12 months';

      return {
        scenario: scenario.name,
        probability: scenario.probability,
        potentialLoss,
        potentialLossPercent,
        recoveryTime,
      };
    });
  }
}

// Export singleton instance
export const aiRiskAssessmentEngine = new AIRiskAssessmentEngine();

// Utility functions
export function getRiskColor(risk: 'low' | 'medium' | 'high' | 'extreme'): string {
  switch (risk) {
    case 'low':
      return 'text-green-400';
    case 'medium':
      return 'text-yellow-400';
    case 'high':
      return 'text-orange-400';
    case 'extreme':
      return 'text-red-400';
    default:
      return 'text-zinc-400';
  }
}

export function getRiskIcon(risk: 'low' | 'medium' | 'high' | 'extreme'): string {
  switch (risk) {
    case 'low':
      return '🛡️';
    case 'medium':
      return '⚠️';
    case 'high':
      return '🚨';
    case 'extreme':
      return '💥';
    default:
      return '❓';
  }
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

export function formatPercent(value: number, decimals: number = 1): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
}
