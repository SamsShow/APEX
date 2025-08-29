'use client';

import React, { useMemo } from 'react';
import { usePortfolioPnL } from '@/hooks/usePortfolioPnL';
// TODO: Import when implementing enhanced risk calculations
// import { usePriceFeeds } from '@/hooks/usePriceFeeds';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Shield, DollarSign, Activity, Target, Zap } from 'lucide-react';

interface RiskManagementDashboardProps {
  className?: string;
}

export function RiskManagementDashboard({ className = '' }: RiskManagementDashboardProps) {
  const { portfolioSummary, positionPnLs, portfolioGreeks, getHighRiskPositions } =
    usePortfolioPnL();
  // TODO: Use prices for enhanced risk calculations
  // const { prices } = usePriceFeeds();

  // Calculate risk metrics
  const riskMetrics = useMemo(() => {
    const highRiskPositions = getHighRiskPositions;

    // Calculate Value at Risk (VaR) - simplified 95% confidence
    const portfolioVolatility = portfolioSummary.volatility / 100; // Convert to decimal
    const confidenceLevel = 1.96; // 95% confidence for normal distribution
    const timeHorizon = Math.sqrt(1); // 1 day

    const valueAtRisk =
      portfolioSummary.totalMarketValue * portfolioVolatility * confidenceLevel * timeHorizon;

    // Calculate margin requirements (simplified)
    const totalMarginRequired = positionPnLs.reduce((sum, pos) => {
      // Simple margin calculation: 10% of position value for options
      const marginRate =
        pos.symbol.includes('OPTION') || pos.symbol.includes('CALL') || pos.symbol.includes('PUT')
          ? 0.1 // 10% margin for options
          : 0.05; // 5% margin for stocks
      return sum + pos.marketValue * marginRate;
    }, 0);

    // Calculate liquidity ratio
    const currentLiquidity = portfolioSummary.totalMarketValue - totalMarginRequired;
    const liquidityRatio =
      portfolioSummary.totalMarketValue > 0
        ? (currentLiquidity / portfolioSummary.totalMarketValue) * 100
        : 100;

    // Calculate concentration risk
    const topPositionValue = Math.max(...positionPnLs.map((p) => p.marketValue));
    const concentrationRatio =
      portfolioSummary.totalMarketValue > 0
        ? (topPositionValue / portfolioSummary.totalMarketValue) * 100
        : 0;

    // Calculate stress test scenarios
    const stressTests = [
      {
        scenario: 'Market Crash (-20%)',
        impact: portfolioSummary.totalMarketValue * -0.2,
        probability: 'Low',
        risk: 'High',
      },
      {
        scenario: 'Volatility Spike (+50%)',
        impact: portfolioSummary.totalMarketValue * portfolioGreeks.vega * 0.5,
        probability: 'Medium',
        risk: 'Medium',
      },
      {
        scenario: 'Rate Hike (+1%)',
        impact: portfolioSummary.totalMarketValue * portfolioGreeks.rho * 0.01,
        probability: 'High',
        risk: 'Low',
      },
    ];

    return {
      valueAtRisk,
      totalMarginRequired,
      currentLiquidity,
      liquidityRatio,
      concentrationRatio,
      highRiskPositions,
      stressTests,
    };
  }, [portfolioSummary, positionPnLs, portfolioGreeks, getHighRiskPositions]);

  const getRiskLevel = (ratio: number) => {
    if (ratio >= 70) return { level: 'Low', color: 'text-green-400', bg: 'bg-green-900/20' };
    if (ratio >= 40) return { level: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-900/20' };
    return { level: 'High', color: 'text-red-400', bg: 'bg-red-900/20' };
  };

  const formatCurrency = (value: number) => `$${value.toFixed(2)}`;
  const formatPercent = (value: number) => `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;

  const liquidityRisk = getRiskLevel(riskMetrics.liquidityRatio);
  const concentrationRisk = getRiskLevel(100 - riskMetrics.concentrationRatio);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-200">Risk Management</h2>
          <p className="text-zinc-400 mt-1">Monitor portfolio risk and margin requirements</p>
        </div>
        <Badge variant="outline" className="text-xs">
          <Shield className="w-3 h-3 mr-1" />
          Real-time Monitoring
        </Badge>
      </div>

      {/* Risk Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-zinc-900/50 border-zinc-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400">Value at Risk (95%)</p>
                <p className="text-lg font-bold text-red-400">
                  {formatCurrency(riskMetrics.valueAtRisk)}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 border-zinc-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400">Margin Required</p>
                <p className="text-lg font-bold text-zinc-200">
                  {formatCurrency(riskMetrics.totalMarginRequired)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-zinc-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 border-zinc-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400">Liquidity Ratio</p>
                <p className={`text-lg font-bold ${liquidityRisk.color}`}>
                  {riskMetrics.liquidityRatio.toFixed(1)}%
                </p>
              </div>
              <Activity className="w-8 h-8 text-zinc-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 border-zinc-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400">Concentration</p>
                <p className={`text-lg font-bold ${concentrationRisk.color}`}>
                  {riskMetrics.concentrationRatio.toFixed(1)}%
                </p>
              </div>
              <Target className="w-8 h-8 text-zinc-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Risk Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Portfolio Greeks */}
        <Card className="bg-zinc-900/50 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-zinc-200">Portfolio Greeks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-zinc-800/50 rounded">
                <div className="text-lg font-bold text-zinc-200">
                  {portfolioGreeks.delta.toFixed(2)}
                </div>
                <div className="text-xs text-zinc-400">Delta</div>
              </div>
              <div className="text-center p-3 bg-zinc-800/50 rounded">
                <div className="text-lg font-bold text-zinc-200">
                  {portfolioGreeks.gamma.toFixed(4)}
                </div>
                <div className="text-xs text-zinc-400">Gamma</div>
              </div>
              <div className="text-center p-3 bg-zinc-800/50 rounded">
                <div className="text-lg font-bold text-zinc-200">
                  {portfolioGreeks.theta.toFixed(4)}
                </div>
                <div className="text-xs text-zinc-400">Theta</div>
              </div>
              <div className="text-center p-3 bg-zinc-800/50 rounded">
                <div className="text-lg font-bold text-zinc-200">
                  {portfolioGreeks.vega.toFixed(4)}
                </div>
                <div className="text-xs text-zinc-400">Vega</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Indicators */}
        <Card className="bg-zinc-900/50 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-zinc-200">Risk Indicators</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-zinc-400">Liquidity Risk</span>
                <Badge className={`${liquidityRisk.bg} ${liquidityRisk.color}`}>
                  {liquidityRisk.level}
                </Badge>
              </div>
              <Progress value={riskMetrics.liquidityRatio} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-zinc-400">Concentration Risk</span>
                <Badge className={`${concentrationRisk.bg} ${concentrationRisk.color}`}>
                  {concentrationRisk.level}
                </Badge>
              </div>
              <Progress value={riskMetrics.concentrationRatio} className="h-2" />
            </div>

            <div className="pt-2 border-t border-zinc-700">
              <div className="text-sm text-zinc-400 mb-2">High Risk Positions</div>
              <div className="text-lg font-semibold text-zinc-200">
                {riskMetrics.highRiskPositions.length} positions
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* High Risk Positions */}
      {riskMetrics.highRiskPositions.length > 0 && (
        <Card className="bg-zinc-900/50 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-zinc-200 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              High Risk Positions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {riskMetrics.highRiskPositions.map((position) => (
                <div
                  key={position.symbol}
                  className="flex justify-between items-center p-3 bg-zinc-800/50 rounded"
                >
                  <div>
                    <div className="font-medium text-zinc-200">{position.symbol}</div>
                    <div className="text-sm text-zinc-500">
                      {position.side.toUpperCase()} • {formatCurrency(position.marketValue)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-zinc-400">Risk Factors</div>
                    <div className="flex gap-2 mt-1">
                      {Math.abs(position.delta) > 0.5 && (
                        <Badge variant="outline" className="text-xs">
                          High Delta
                        </Badge>
                      )}
                      {Math.abs(position.gamma) > 0.1 && (
                        <Badge variant="outline" className="text-xs">
                          High Gamma
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stress Testing */}
      <Card className="bg-zinc-900/50 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-zinc-200 flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-400" />
            Stress Test Scenarios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {riskMetrics.stressTests.map((test) => (
              <div
                key={test.scenario}
                className="flex justify-between items-center p-3 bg-zinc-800/50 rounded"
              >
                <div>
                  <div className="font-medium text-zinc-200">{test.scenario}</div>
                  <div className="text-sm text-zinc-500">
                    Probability: {test.probability} • Risk: {test.risk}
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`font-semibold ${test.impact >= 0 ? 'text-green-400' : 'text-red-400'}`}
                  >
                    {formatCurrency(test.impact)}
                  </div>
                  <div
                    className={`text-sm ${test.impact >= 0 ? 'text-green-400' : 'text-red-400'}`}
                  >
                    {formatPercent((test.impact / portfolioSummary.totalMarketValue) * 100)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Risk Recommendations */}
      <Card className="bg-zinc-900/50 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-zinc-200">Risk Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {riskMetrics.liquidityRatio < 50 && (
              <div className="flex items-start gap-3 p-3 bg-yellow-900/20 border border-yellow-700/50 rounded">
                <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div>
                  <div className="font-medium text-yellow-400">Low Liquidity</div>
                  <div className="text-sm text-zinc-300">
                    Consider reducing position sizes or adding margin capital to improve liquidity
                    ratio.
                  </div>
                </div>
              </div>
            )}

            {riskMetrics.concentrationRatio > 30 && (
              <div className="flex items-start gap-3 p-3 bg-orange-900/20 border border-orange-700/50 rounded">
                <AlertTriangle className="w-5 h-5 text-orange-400 mt-0.5" />
                <div>
                  <div className="font-medium text-orange-400">High Concentration</div>
                  <div className="text-sm text-zinc-300">
                    Your portfolio is heavily concentrated in one position. Consider
                    diversification.
                  </div>
                </div>
              </div>
            )}

            {riskMetrics.highRiskPositions.length > 2 && (
              <div className="flex items-start gap-3 p-3 bg-red-900/20 border border-red-700/50 rounded">
                <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                <div>
                  <div className="font-medium text-red-400">Multiple High-Risk Positions</div>
                  <div className="text-sm text-zinc-300">
                    You have multiple positions with high delta or gamma. Monitor closely for
                    volatility.
                  </div>
                </div>
              </div>
            )}

            {riskMetrics.liquidityRatio >= 70 &&
              riskMetrics.concentrationRatio <= 20 &&
              riskMetrics.highRiskPositions.length === 0 && (
                <div className="flex items-start gap-3 p-3 bg-green-900/20 border border-green-700/50 rounded">
                  <Shield className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-green-400">Strong Risk Profile</div>
                    <div className="text-sm text-zinc-300">
                      Your portfolio maintains good risk management practices. Continue monitoring.
                    </div>
                  </div>
                </div>
              )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
