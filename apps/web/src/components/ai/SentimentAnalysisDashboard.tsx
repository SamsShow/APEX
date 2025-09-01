'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  BarChart3,
  MessageSquare,
  Newspaper,
  Coins,
  Cpu,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
} from 'lucide-react';
import {
  sentimentAnalysisEngine,
  SentimentData,
  MarketImpact,
  getSentimentColor,
  getSentimentEmoji,
  formatSentimentScore,
  getImpactColor,
} from '@/lib/sentiment-analysis';
import { usePriceFeeds } from '@/hooks/usePriceFeeds';

interface SentimentAnalysisDashboardProps {
  symbol?: string;
  className?: string;
}

export function SentimentAnalysisDashboard({
  symbol = 'APT',
  className = '',
}: SentimentAnalysisDashboardProps) {
  const { prices } = usePriceFeeds();
  const [sentimentData, setSentimentData] = useState<SentimentData | null>(null);
  const [marketImpact, setMarketImpact] = useState<MarketImpact | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(false);

  const currentPrice = prices[symbol]?.price || 0;

  // Analyze sentiment
  const analyzeSentiment = useCallback(async () => {
    setIsAnalyzing(true);
    try {
      const data = await sentimentAnalysisEngine.analyzeSentiment(symbol);
      setSentimentData(data);

      // Predict market impact
      const impact = await sentimentAnalysisEngine.predictMarketImpact(data);
      setMarketImpact(impact);
    } catch (error) {
      console.error('Failed to analyze sentiment:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [symbol]);

  // Toggle real-time monitoring
  const toggleRealTimeMonitoring = () => {
    if (isRealTimeEnabled) {
      setIsRealTimeEnabled(false);
    } else {
      setIsRealTimeEnabled(true);
      analyzeSentiment(); // Initial analysis
    }
  };

  // Effect for real-time monitoring
  useEffect(() => {
    let cleanup: (() => void) | undefined;

    if (isRealTimeEnabled) {
      cleanup = sentimentAnalysisEngine.startRealTimeMonitoring(symbol, (data) => {
        setSentimentData(data);
        sentimentAnalysisEngine.predictMarketImpact(data).then(setMarketImpact);
      });
    }

    return () => {
      if (cleanup) cleanup();
    };
  }, [isRealTimeEnabled, symbol, currentPrice]);

  // Auto-analyze on mount
  useEffect(() => {
    analyzeSentiment();
  }, [symbol, analyzeSentiment]);

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'social':
        return <MessageSquare className="w-4 h-4" />;
      case 'news':
        return <Newspaper className="w-4 h-4" />;
      case 'onchain':
        return <Coins className="w-4 h-4" />;
      case 'technical':
        return <Cpu className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish':
        return <TrendingUp className="w-5 h-5 text-green-400" />;
      case 'bearish':
        return <TrendingDown className="w-5 h-5 text-red-400" />;
      case 'neutral':
        return <Minus className="w-5 h-5 text-zinc-400" />;
      default:
        return <Activity className="w-5 h-5 text-zinc-400" />;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card className="bg-zinc-900/50 border-zinc-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <CardTitle className="text-zinc-200">AI Sentiment Analysis</CardTitle>
                <p className="text-zinc-400 text-sm">
                  Real-time market sentiment from multiple sources
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={toggleRealTimeMonitoring}
                variant={isRealTimeEnabled ? 'default' : 'outline'}
                size="sm"
                className={isRealTimeEnabled ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                <Activity className={`w-4 h-4 mr-2 ${isRealTimeEnabled ? 'animate-pulse' : ''}`} />
                {isRealTimeEnabled ? 'Live' : 'Start Live'}
              </Button>
              <Button
                onClick={analyzeSentiment}
                disabled={isAnalyzing}
                variant="outline"
                size="sm"
                className="border-zinc-600 hover:border-zinc-500"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {sentimentData && (
            <div className="space-y-4">
              {/* Overall Sentiment */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-zinc-800/50 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {getSentimentIcon(sentimentData.overall)}
                    <span
                      className={`text-xl font-bold capitalize ${getSentimentColor(sentimentData.overall)}`}
                    >
                      {sentimentData.overall}
                    </span>
                  </div>
                  <div className="text-sm text-zinc-400">Overall Sentiment</div>
                </div>

                <div className="text-center p-4 bg-zinc-800/50 rounded-lg">
                  <div className="text-xl font-bold text-zinc-200">
                    {formatSentimentScore(sentimentData.score)}
                  </div>
                  <div className="text-sm text-zinc-400">Sentiment Score</div>
                  <Progress value={Math.abs(sentimentData.score) * 100} className="mt-2 h-2" />
                </div>

                <div className="text-center p-4 bg-zinc-800/50 rounded-lg">
                  <div className="text-xl font-bold text-zinc-200">
                    {(sentimentData.confidence * 100).toFixed(0)}%
                  </div>
                  <div className="text-sm text-zinc-400">Confidence</div>
                  <Progress value={sentimentData.confidence * 100} className="mt-2 h-2" />
                </div>
              </div>

              {/* Market Impact Prediction */}
              {marketImpact && marketImpact.direction !== 'neutral' && (
                <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-600">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    <h3 className="font-medium text-zinc-200">Market Impact Prediction</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-zinc-400 mb-1">Direction</div>
                      <div
                        className={`font-semibold capitalize ${getSentimentColor(marketImpact.direction)}`}
                      >
                        {getSentimentEmoji(marketImpact.direction)} {marketImpact.direction}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-zinc-400 mb-1">Potential Impact</div>
                      <div className={`font-semibold ${getImpactColor(marketImpact.magnitude)}`}>
                        {(marketImpact.magnitude * 100).toFixed(1)}%
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-zinc-400 mb-1">Timeframe</div>
                      <div className="font-semibold text-zinc-200 capitalize">
                        {marketImpact.timeframe}-term
                      </div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="text-sm text-zinc-400 mb-2">Analysis:</div>
                    <ul className="space-y-1">
                      {marketImpact.reasoning.map((reason, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-zinc-300">
                          <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {sentimentData.lastUpdated && (
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <Clock className="w-3 h-3" />
                  Last updated: {sentimentData.lastUpdated.toLocaleTimeString()}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sentiment Sources */}
      {sentimentData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sentimentData.sources.map((source, index) => (
            <Card key={index} className="bg-zinc-900/50 border-zinc-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-zinc-800 rounded-lg">{getSourceIcon(source.type)}</div>
                    <div>
                      <CardTitle className="text-zinc-200 text-lg">{source.name}</CardTitle>
                      <p className="text-zinc-400 text-sm capitalize">{source.type} Analysis</p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`${getSentimentColor(source.sentiment)} border-current`}
                  >
                    {source.sentiment}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Source Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-zinc-800/50 rounded-lg">
                    <div className="text-lg font-bold text-zinc-200">
                      {formatSentimentScore(source.score)}
                    </div>
                    <div className="text-xs text-zinc-400">Sentiment</div>
                  </div>

                  <div className="text-center p-3 bg-zinc-800/50 rounded-lg">
                    <div className="text-lg font-bold text-zinc-200">
                      {(source.influence * 100).toFixed(0)}%
                    </div>
                    <div className="text-xs text-zinc-400">Influence</div>
                  </div>
                </div>

                {/* Volume */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Activity Volume</span>
                    <span className="text-zinc-200">{source.volume.toLocaleString()}</span>
                  </div>
                  <Progress value={Math.min(source.volume / 10000, 1) * 100} className="h-2" />
                </div>

                {/* Recent Activity */}
                <div className="space-y-2">
                  <h4 className="font-medium text-zinc-200 text-sm">Recent Activity</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {source.recentActivity.slice(0, 3).map((activity, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 p-2 bg-zinc-800/30 rounded text-xs"
                      >
                        <div className={`mt-0.5 ${getSentimentColor(activity.sentiment)}`}>
                          {getSentimentIcon(activity.sentiment)}
                        </div>
                        <div className="flex-1">
                          <div className="text-zinc-300 line-clamp-2">{activity.content}</div>
                          <div className="text-zinc-500 mt-1">
                            {activity.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Loading State */}
      {isAnalyzing && (
        <Card className="bg-zinc-900/50 border-zinc-700">
          <CardContent className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-zinc-200 mb-2">Analyzing Market Sentiment</h3>
            <p className="text-zinc-400">
              Our AI is processing data from social media, news sources, on-chain activity, and
              technical indicators...
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
