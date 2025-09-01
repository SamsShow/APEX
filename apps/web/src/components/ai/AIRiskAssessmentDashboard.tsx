'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Shield,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Target,
  BarChart3,
  PieChart,
  RefreshCw,
  Clock,
} from 'lucide-react';
import {
  aiRiskAssessmentEngine,
  RiskAssessment,
  RiskMetrics,
  PortfolioPosition,
  getRiskColor,
  getRiskIcon,
  formatCurrency,
  formatPercent,
} from '@/lib/ai-risk-assessment';
import { usePortfolioPnL } from '@/hooks/usePortfolioPnL';
import { usePriceFeeds } from '@/hooks/usePriceFeeds';

interface AIRiskAssessmentDashboardProps {
  className?: string;
}

export function AIRiskAssessmentDashboard({ className = '' }: AIRiskAssessmentDashboardProps) {
  const { positionPnLs } = usePortfolioPnL();
  const { prices } = usePriceFeeds();
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessment | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Convert position data to the format expected by the risk engine
  const positions: PortfolioPosition[] = useMemo(() => {
    return positionPnLs.map((pos) => ({
      id: pos.symbol,
      symbol: pos.symbol,
      type: 'stock' as const, // Simplified for demo
      quantity: Math.abs(pos.marketValue / (pos.avgPrice || 1)),
      avgPrice: pos.avgPrice,
      currentPrice: prices[pos.symbol]?.price || pos.marketValue,
      marketValue: pos.marketValue,
      unrealizedPnL: pos.unrealizedPnL,
      unrealizedPnLPercent: pos.unrealizedPnLPercent,
      delta: 0.5, // Simplified
      gamma: 0.1,
      theta: -0.05,
      vega: 0.3,
      rho: 0.2,
    }));
  }, [positionPnLs, prices]);

  // Calculate risk metrics
  const riskMetrics: RiskMetrics = useMemo(() => {
    return aiRiskAssessmentEngine.calculateRiskMetrics(positions);
  }, [positions]);

  // Perform risk assessment
  const performRiskAssessment = useCallback(async () => {
    setIsAnalyzing(true);
    setError(null);

    try {
      // Simulate market conditions
      const marketConditions = {
        volatility: 0.3,
        fearGreedIndex: 60,
      };

      // Simulate user profile
      const userProfile = {
        riskTolerance: 'medium' as const,
        experience: 'intermediate' as const,
      };

      const assessment = await aiRiskAssessmentEngine.assessPortfolioRisk(
        positions,
        marketConditions,
        userProfile,
      );

      setRiskAssessment(assessment);
    } catch (error) {
      console.error('Failed to perform risk assessment:', error);
      setRiskAssessment(null); // Reset assessment on error
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsAnalyzing(false);
    }
  }, [positions]);

  // Auto-assess on mount and when positions change
  useEffect(() => {
    if (positions.length > 0) {
      performRiskAssessment().catch((error) => {
        console.error('Error performing risk assessment:', error);
        setIsAnalyzing(false);
        setError(error instanceof Error ? error.message : 'Unknown error occurred');
      });
    } else {
      // Clear assessment if no positions
      setRiskAssessment(null);
      setError(null);
    }
  }, [positions, performRiskAssessment]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-400';
      case 'medium':
        return 'text-yellow-400';
      case 'low':
        return 'text-green-400';
      default:
        return 'text-zinc-400';
    }
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'reduce':
        return <TrendingDown className="w-4 h-4" />;
      case 'increase':
        return <TrendingUp className="w-4 h-4" />;
      case 'hedge':
        return <Shield className="w-4 h-4" />;
      case 'diversify':
        return <PieChart className="w-4 h-4" />;
      case 'rebalance':
        return <BarChart3 className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card className="bg-zinc-900/50 border-zinc-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <Shield className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <CardTitle className="text-zinc-200">AI Risk Assessment</CardTitle>
                <p className="text-zinc-400 text-sm">
                  Comprehensive portfolio risk analysis and optimization recommendations
                </p>
              </div>
            </div>
            <Button
              onClick={performRiskAssessment}
              disabled={isAnalyzing}
              variant="outline"
              size="sm"
              className="border-zinc-600 hover:border-zinc-500"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
              {isAnalyzing ? 'Analyzing...' : 'Refresh'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {riskAssessment && (
            <div className="space-y-6">
              {/* Overall Risk Score */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-zinc-800/50 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-2xl">{getRiskIcon(riskAssessment.overallRisk)}</span>
                    <span
                      className={`text-xl font-bold capitalize ${getRiskColor(riskAssessment.overallRisk)}`}
                    >
                      {riskAssessment.overallRisk}
                    </span>
                  </div>
                  <div className="text-sm text-zinc-400">Overall Risk Level</div>
                </div>

                <div className="text-center p-4 bg-zinc-800/50 rounded-lg">
                  <div className="text-xl font-bold text-zinc-200">
                    {riskAssessment.riskScore.toFixed(0)}/100
                  </div>
                  <div className="text-sm text-zinc-400">Risk Score</div>
                  <Progress value={riskAssessment.riskScore} className="mt-2 h-2" />
                </div>

                <div className="text-center p-4 bg-zinc-800/50 rounded-lg">
                  <div className="text-xl font-bold text-zinc-200">{positions.length}</div>
                  <div className="text-sm text-zinc-400">Active Positions</div>
                </div>
              </div>

              {/* Key Risk Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-zinc-800/50 rounded-lg">
                  <div className="text-lg font-bold text-zinc-200">
                    {riskMetrics.volatility.toFixed(1)}%
                  </div>
                  <div className="text-xs text-zinc-400">Volatility</div>
                </div>

                <div className="text-center p-3 bg-zinc-800/50 rounded-lg">
                  <div className="text-lg font-bold text-zinc-200">
                    {riskMetrics.maxDrawdown.toFixed(1)}%
                  </div>
                  <div className="text-xs text-zinc-400">Max Drawdown</div>
                </div>

                <div className="text-center p-3 bg-zinc-800/50 rounded-lg">
                  <div
                    className={`text-lg font-bold ${riskMetrics.sharpeRatio >= 1 ? 'text-green-400' : 'text-red-400'}`}
                  >
                    {riskMetrics.sharpeRatio.toFixed(2)}
                  </div>
                  <div className="text-xs text-zinc-400">Sharpe Ratio</div>
                </div>

                <div className="text-center p-3 bg-zinc-800/50 rounded-lg">
                  <div className="text-lg font-bold text-zinc-200">
                    {formatCurrency(riskMetrics.valueAtRisk)}
                  </div>
                  <div className="text-xs text-zinc-400">VaR (95%)</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Risk Factors */}
      {riskAssessment && riskAssessment.riskFactors.length > 0 && (
        <Card className="bg-zinc-900/50 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-zinc-200">Risk Factors Identified</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {riskAssessment.riskFactors.map((factor, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-zinc-800/50 rounded-lg">
                  <div className="flex-shrink-0">
                    <AlertTriangle
                      className={`w-5 h-5 ${
                        factor.level === 'high'
                          ? 'text-red-400'
                          : factor.level === 'medium'
                            ? 'text-yellow-400'
                            : 'text-green-400'
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-zinc-200">{factor.factor}</h4>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          factor.level === 'high'
                            ? 'text-red-400 border-red-400'
                            : factor.level === 'medium'
                              ? 'text-yellow-400 border-yellow-400'
                              : 'text-green-400 border-green-400'
                        }`}
                      >
                        {factor.level.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-zinc-400 mb-2">{factor.description}</p>
                    <div className="text-sm text-zinc-300">
                      <strong>Mitigation:</strong> {factor.mitigation}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Recommendations */}
      {riskAssessment && riskAssessment.recommendations.length > 0 && (
        <Card className="bg-zinc-900/50 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-zinc-200">AI Recommendations</CardTitle>
            <p className="text-zinc-400 text-sm">
              Personalized suggestions to optimize your portfolio risk and returns
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {riskAssessment.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-zinc-800/50 rounded-lg">
                  <div className="flex-shrink-0 mt-1">{getRecommendationIcon(rec.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-zinc-200">{rec.description}</h4>
                      <Badge
                        variant="outline"
                        className={`text-xs ${getPriorityColor(rec.priority)} border-current`}
                      >
                        {rec.priority.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-zinc-400">
                      <div className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        Expected Impact: {formatPercent(rec.expectedImpact * 100)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {rec.timeframe}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Portfolio Allocation */}
      {riskAssessment && (
        <Card className="bg-zinc-900/50 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-zinc-200">Portfolio Allocation Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {riskAssessment.optimalAllocation.changes.map((change, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg"
                >
                  <div>
                    <div className="font-medium text-zinc-200">{change.symbol}</div>
                    <div className="text-sm text-zinc-400">{change.reason}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-zinc-400">
                      Current: {change.currentPercent.toFixed(1)}%
                    </div>
                    <div
                      className={`text-sm font-medium ${
                        change.changeAmount > 0 ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {change.changeAmount > 0 ? '+' : ''}
                      {change.changeAmount.toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stress Test Results */}
      {riskAssessment && riskAssessment.stressTestResults.length > 0 && (
        <Card className="bg-zinc-900/50 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-zinc-200">Stress Test Scenarios</CardTitle>
            <p className="text-zinc-400 text-sm">
              Simulated portfolio performance under adverse market conditions
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {riskAssessment.stressTestResults.map((test, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium text-zinc-200">{test.scenario}</div>
                    <div className="text-sm text-zinc-400">
                      Probability: {(test.probability * 100).toFixed(1)}% • Recovery:{' '}
                      {test.recoveryTime}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-red-400">
                      -{formatCurrency(test.potentialLoss)}
                    </div>
                    <div className="text-sm text-zinc-400">
                      ({test.potentialLossPercent.toFixed(1)}%)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="bg-zinc-900/50 border-red-500/50">
          <CardContent className="text-center py-12">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-400" />
            <h3 className="text-lg font-medium text-zinc-200 mb-2">Risk Assessment Error</h3>
            <p className="text-zinc-400 mb-4">{error}</p>
            <Button
              onClick={performRiskAssessment}
              variant="outline"
              className="border-red-500/50 text-red-400 hover:bg-red-500/10"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry Analysis
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isAnalyzing && (
        <Card className="bg-zinc-900/50 border-zinc-700">
          <CardContent className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-zinc-200 mb-2">Analyzing Portfolio Risk</h3>
            <p className="text-zinc-400">
              Our AI is performing comprehensive risk assessment, stress testing, and generating
              personalized recommendations...
            </p>
          </CardContent>
        </Card>
      )}

      {/* No Data State */}
      {positions.length === 0 && !isAnalyzing && (
        <Card className="bg-zinc-900/50 border-zinc-700">
          <CardContent className="text-center py-12">
            <Shield className="w-12 h-12 mx-auto mb-4 text-zinc-500" />
            <h3 className="text-lg font-medium text-zinc-200 mb-2">No Positions to Analyze</h3>
            <p className="text-zinc-400">
              Add some positions to your portfolio to get AI-powered risk assessment and
              optimization recommendations.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
