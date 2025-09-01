'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Clock,
  RefreshCw,
  Eye,
  Target,
  BarChart3,
} from 'lucide-react';
import {
  anomalyDetectionEngine,
  Anomaly,
  ArbitrageOpportunity,
  MarketRegime,
  getAnomalyColor,
  getAnomalyIcon,
  getRegimeColor,
} from '@/lib/anomaly-detection';
import { usePriceFeeds } from '@/hooks/usePriceFeeds';

interface AnomalyDetectionDashboardProps {
  className?: string;
}

export function AnomalyDetectionDashboard({ className = '' }: AnomalyDetectionDashboardProps) {
  const { prices } = usePriceFeeds();
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [arbitrageOpportunities, setArbitrageOpportunities] = useState<ArbitrageOpportunity[]>([]);
  const [marketRegime, setMarketRegime] = useState<MarketRegime | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Mock market data for demonstration
  const mockMarketData = useMemo(() => {
    return Object.keys(prices).reduce(
      (
        acc: Record<
          string,
          { symbol: string; price: number; volume: number; timestamp: Date; changePercent: number }
        >,
        symbol,
      ) => {
        acc[symbol] = {
          symbol,
          price: prices[symbol].price,
          volume: Math.random() * 1000000 + 100000,
          timestamp: new Date(),
          changePercent: prices[symbol].changePercent24h || 0,
        };
        return acc;
      },
      {},
    );
  }, [prices]);

  // Analyze for anomalies
  const performAnomalyDetection = useCallback(async () => {
    setIsAnalyzing(true);
    try {
      const newAnomalies: Anomaly[] = [];

      // Check each symbol for anomalies
      Object.values(mockMarketData).forEach((data) => {
        const symbolAnomalies = anomalyDetectionEngine.updateMarketData(data);
        newAnomalies.push(...symbolAnomalies);
      });

      setAnomalies(newAnomalies);

      // Detect arbitrage opportunities
      const opportunities = anomalyDetectionEngine.detectArbitrageOpportunities(mockMarketData);
      setArbitrageOpportunities(opportunities);

      // Analyze market regime (using APT as primary)
      if (mockMarketData['APT']) {
        const history = Array.from({ length: 50 }, (_, i) => ({
          ...mockMarketData['APT'],
          timestamp: new Date(Date.now() - i * 60000), // Mock 50 minutes of data
          price: mockMarketData['APT'].price * (1 + (Math.random() - 0.5) * 0.02),
        }));
        const regime = anomalyDetectionEngine.detectMarketRegime(history);
        setMarketRegime(regime);
      }
    } catch (error) {
      console.error('Failed to perform anomaly detection:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [prices]);

  // Auto-analyze on mount and when market data changes
  useEffect(() => {
    if (Object.keys(prices).length > 0) {
      performAnomalyDetection();
    }
  }, [prices, performAnomalyDetection]);

  const anomalyStats = useMemo(() => {
    return anomalyDetectionEngine.getAnomalyStats();
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-red-500 bg-red-500/10';
      case 'high':
        return 'border-orange-500 bg-orange-500/10';
      case 'medium':
        return 'border-yellow-500 bg-yellow-500/10';
      case 'low':
        return 'border-green-500 bg-green-500/10';
      default:
        return 'border-zinc-500 bg-zinc-500/10';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
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

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card className="bg-zinc-900/50 border-zinc-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <CardTitle className="text-zinc-200">AI Anomaly Detection</CardTitle>
                <p className="text-zinc-400 text-sm">
                  Real-time detection of market anomalies and arbitrage opportunities
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={performAnomalyDetection}
                disabled={isAnalyzing}
                variant="outline"
                size="sm"
                className="border-zinc-600 hover:border-zinc-500"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
                {isAnalyzing ? 'Scanning...' : 'Scan Now'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {marketRegime && (
            <div className="space-y-4">
              {/* Market Regime */}
              <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-600">
                <div className="flex items-center gap-3 mb-3">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                  <h3 className="font-medium text-zinc-200">Current Market Regime</h3>
                  <Badge
                    variant="outline"
                    className={`capitalize ${getRegimeColor(marketRegime.regime)} border-current`}
                  >
                    {marketRegime.regime}
                  </Badge>
                </div>
                <p className="text-sm text-zinc-300 mb-2">{marketRegime.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-zinc-400">Confidence:</span>
                    <span className="text-zinc-200 ml-2">
                      {(marketRegime.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-400">Duration:</span>
                    <span className="text-zinc-200 ml-2">{marketRegime.duration}</span>
                  </div>
                </div>
              </div>

              {/* Anomaly Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-zinc-800/50 rounded-lg">
                  <div className="text-xl font-bold text-zinc-200">{anomalyStats.total}</div>
                  <div className="text-xs text-zinc-400">Total Anomalies</div>
                </div>
                <div className="text-center p-3 bg-zinc-800/50 rounded-lg">
                  <div className="text-xl font-bold text-red-400">
                    {anomalyStats.bySeverity.critical || 0}
                  </div>
                  <div className="text-xs text-zinc-400">Critical</div>
                </div>
                <div className="text-center p-3 bg-zinc-800/50 rounded-lg">
                  <div className="text-xl font-bold text-orange-400">
                    {anomalyStats.bySeverity.high || 0}
                  </div>
                  <div className="text-xs text-zinc-400">High</div>
                </div>
                <div className="text-center p-3 bg-zinc-800/50 rounded-lg">
                  <div className="text-xl font-bold text-zinc-200">
                    {anomalyStats.recentActivity}
                  </div>
                  <div className="text-xs text-zinc-400">Last Hour</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Anomalies List */}
      <Card className="bg-zinc-900/50 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-zinc-200">Detected Anomalies</CardTitle>
          <p className="text-zinc-400 text-sm">
            Unusual market movements and trading patterns identified by AI
          </p>
        </CardHeader>
        <CardContent>
          {anomalies.length === 0 ? (
            <div className="text-center py-8 text-zinc-500">
              <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No anomalies detected in current market conditions</p>
              <p className="text-sm mt-1">Monitoring for unusual activity...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {anomalies.slice(0, 5).map((anomaly) => (
                <div
                  key={anomaly.id}
                  className={`p-4 rounded-lg border-2 ${getSeverityColor(anomaly.severity)}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl mt-1">{getAnomalyIcon(anomaly.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-zinc-200">{anomaly.symbol}</h4>
                        <Badge
                          variant="outline"
                          className={`text-xs capitalize ${getAnomalyColor(anomaly.severity)} border-current`}
                        >
                          {anomaly.severity}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {(anomaly.confidence * 100).toFixed(0)}% confidence
                        </Badge>
                      </div>
                      <p className="text-sm text-zinc-300 mb-2">{anomaly.description}</p>
                      <div className="flex items-center gap-4 text-sm text-zinc-400">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          {anomaly.potentialImpact}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {anomaly.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                      <div className="mt-2 p-2 bg-zinc-800/50 rounded text-sm text-zinc-300">
                        <strong>Recommendation:</strong> {anomaly.recommendedAction}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Arbitrage Opportunities */}
      <Card className="bg-zinc-900/50 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-zinc-200">Arbitrage Opportunities</CardTitle>
          <p className="text-zinc-400 text-sm">
            AI-detected price inefficiencies and arbitrage possibilities
          </p>
        </CardHeader>
        <CardContent>
          {arbitrageOpportunities.length === 0 ? (
            <div className="text-center py-8 text-zinc-500">
              <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No arbitrage opportunities detected</p>
              <p className="text-sm mt-1">Markets appear efficiently priced</p>
            </div>
          ) : (
            <div className="space-y-4">
              {arbitrageOpportunities.map((opportunity) => (
                <div
                  key={opportunity.id}
                  className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-600"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-500/20 rounded-lg mt-1">
                      <Target className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-zinc-200">
                          {opportunity.symbols.join(', ')}
                        </h4>
                        <Badge
                          variant="outline"
                          className={`text-xs capitalize ${getRiskColor(opportunity.risk)} border-current`}
                        >
                          {opportunity.risk} risk
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {(opportunity.confidence * 100).toFixed(0)}% confidence
                        </Badge>
                      </div>
                      <p className="text-sm text-zinc-300 mb-2">{opportunity.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-zinc-400">Expected Return</div>
                          <div className="text-green-400 font-medium">
                            +{opportunity.expectedReturn.toFixed(2)}%
                          </div>
                        </div>
                        <div>
                          <div className="text-zinc-400">Timeframe</div>
                          <div className="text-zinc-200">{opportunity.timeframe}</div>
                        </div>
                      </div>
                      <div className="mt-3 space-y-2">
                        <div className="p-2 bg-zinc-900/50 rounded text-sm">
                          <strong className="text-green-400">Entry:</strong> {opportunity.entry}
                        </div>
                        <div className="p-2 bg-zinc-900/50 rounded text-sm">
                          <strong className="text-blue-400">Exit:</strong> {opportunity.exit}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Market Regime Expectations */}
      {marketRegime && (
        <Card className="bg-zinc-900/50 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-zinc-200">Market Behavior Expectations</CardTitle>
            <p className="text-zinc-400 text-sm">
              AI predictions for market behavior based on current regime
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {marketRegime.expectedBehavior.map((behavior, index) => (
                <div key={index} className="flex items-center gap-3 p-2 bg-zinc-800/50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-sm text-zinc-300">{behavior}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isAnalyzing && (
        <Card className="bg-zinc-900/50 border-zinc-700">
          <CardContent className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-zinc-200 mb-2">Scanning for Anomalies</h3>
            <p className="text-zinc-400">
              AI is analyzing market data for unusual patterns, arbitrage opportunities, and regime
              changes...
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
