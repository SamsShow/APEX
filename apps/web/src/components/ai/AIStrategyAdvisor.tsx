'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Target, CheckCircle, Sparkles, RefreshCw, BarChart3, Clock } from 'lucide-react';
import {
  aiRecommendationEngine,
  MarketConditions,
  UserProfile,
  StrategyRecommendation,
  getMarketConditionDescription,
  getRiskColor,
  getConfidenceColor,
} from '@/lib/ai-recommendations';
import { usePriceFeeds } from '@/hooks/usePriceFeeds';
import { Strategy } from '@/components/strategy/StrategyBuilder';

interface AIStrategyAdvisorProps {
  onStrategySelect?: (strategy: Strategy) => void;
  className?: string;
}

export const AIStrategyAdvisor = React.memo<AIStrategyAdvisorProps>(
  ({ onStrategySelect, className = '' }) => {
    const { prices } = usePriceFeeds();
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [recommendations, setRecommendations] = useState<StrategyRecommendation[]>([]);
    const [marketConditions, setMarketConditions] = useState<MarketConditions | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    // Simulated user profile - in a real app, this would come from user settings/API
    const userProfile: UserProfile = useMemo(
      () => ({
        riskTolerance: 'medium',
        experience: 'intermediate',
        preferredTimeframe: 'medium',
        capital: 10000,
        currentPositions: [],
      }),
      [],
    );

    // Generate AI recommendations
    const generateRecommendations = useCallback(async () => {
      setIsAnalyzing(true);

      try {
        // Simulate getting historical price data (in real app, this would come from API)
        const aptPrice = prices['APT']?.price || 5.0;
        const mockPriceData = Array.from({ length: 30 }, (_, i) => ({
          price: aptPrice * (1 + (Math.random() - 0.5) * 0.1),
          timestamp: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000),
        }));

        const mockVolumeData = Array.from({ length: 30 }, () => ({
          volume: Math.random() * 1000000 + 500000,
          timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        }));

        // Analyze market conditions
        const conditions = aiRecommendationEngine.analyzeMarketConditions(
          mockPriceData,
          mockVolumeData,
        );

        setMarketConditions(conditions);

        // Generate strategy recommendations
        const aiRecommendations = aiRecommendationEngine.generateStrategyRecommendations(
          conditions,
          userProfile,
          aptPrice,
        );

        setRecommendations(aiRecommendations);
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Failed to generate AI recommendations:', error);
      } finally {
        setIsAnalyzing(false);
      }
    }, [prices]);

    // Auto-generate recommendations on mount and when prices change
    useEffect(() => {
      if (prices['APT']?.price) {
        generateRecommendations();
      }
    }, [prices, generateRecommendations]);

    const handleStrategySelect = (recommendation: StrategyRecommendation) => {
      if (onStrategySelect) {
        onStrategySelect(recommendation.strategy);
      }
    };

    return (
      <div className={`space-y-6 ${className}`}>
        {/* Header */}
        <Card className="bg-zinc-900/50 border-zinc-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Brain className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-zinc-200">AI Strategy Advisor</CardTitle>
                  <p className="text-zinc-400 text-sm">
                    Intelligent strategy recommendations powered by AI
                  </p>
                </div>
              </div>
              <Button
                onClick={generateRecommendations}
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
            {marketConditions && (
              <div className="space-y-4">
                <div className="p-4 bg-zinc-800/50 rounded-lg">
                  <h4 className="font-medium text-zinc-200 mb-2">Market Analysis</h4>
                  <p className="text-sm text-zinc-300">
                    {getMarketConditionDescription(marketConditions)}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                    <div className="text-center">
                      <div className="text-lg font-bold text-zinc-200">
                        {(marketConditions.volatility * 100).toFixed(1)}%
                      </div>
                      <div className="text-xs text-zinc-400">Volatility</div>
                    </div>
                    <div className="text-center">
                      <div
                        className={`text-lg font-bold capitalize ${
                          marketConditions.trend === 'bullish'
                            ? 'text-green-400'
                            : marketConditions.trend === 'bearish'
                              ? 'text-red-400'
                              : 'text-zinc-400'
                        }`}
                      >
                        {marketConditions.trend}
                      </div>
                      <div className="text-xs text-zinc-400">Trend</div>
                    </div>
                    <div className="text-center">
                      <div
                        className={`text-lg font-bold capitalize ${
                          marketConditions.sentiment === 'positive'
                            ? 'text-green-400'
                            : marketConditions.sentiment === 'negative'
                              ? 'text-red-400'
                              : 'text-zinc-400'
                        }`}
                      >
                        {marketConditions.sentiment}
                      </div>
                      <div className="text-xs text-zinc-400">Sentiment</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-zinc-200">
                        {marketConditions.fearGreedIndex.toFixed(0)}
                      </div>
                      <div className="text-xs text-zinc-400">Fear/Greed</div>
                    </div>
                  </div>
                </div>

                {lastUpdated && (
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <Clock className="w-3 h-3" />
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Strategy Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {recommendations.map((recommendation) => (
            <Card key={recommendation.strategy.id} className="bg-zinc-900/50 border-zinc-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    <CardTitle className="text-zinc-200 text-lg">
                      {recommendation.strategy.name}
                    </CardTitle>
                  </div>
                  <Badge
                    variant="outline"
                    className={`${getConfidenceColor(recommendation.confidence)} border-current`}
                  >
                    {(recommendation.confidence * 100).toFixed(0)}% confident
                  </Badge>
                </div>
                <p className="text-zinc-400 text-sm">{recommendation.strategy.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Strategy Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-zinc-800/50 rounded-lg">
                    <div className="text-xl font-bold text-green-400">
                      +{recommendation.expectedReturn.toFixed(1)}%
                    </div>
                    <div className="text-xs text-zinc-400">Expected Return</div>
                  </div>
                  <div className="text-center p-3 bg-zinc-800/50 rounded-lg">
                    <div
                      className={`text-xl font-bold capitalize ${getRiskColor(recommendation.riskLevel)}`}
                    >
                      {recommendation.riskLevel}
                    </div>
                    <div className="text-xs text-zinc-400">Risk Level</div>
                  </div>
                </div>

                {/* Suitability Score */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Profile Match</span>
                    <span className="text-zinc-200">
                      {(recommendation.suitability * 100).toFixed(0)}%
                    </span>
                  </div>
                  <Progress value={recommendation.suitability * 100} className="h-2" />
                </div>

                {/* Reasoning */}
                <div className="space-y-2">
                  <h4 className="font-medium text-zinc-200 text-sm">Why this strategy?</h4>
                  <ul className="space-y-1">
                    {recommendation.reasoning.slice(0, 3).map((reason, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-zinc-400">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Market Conditions */}
                <div className="space-y-2">
                  <h4 className="font-medium text-zinc-200 text-sm">Market Conditions</h4>
                  <div className="flex flex-wrap gap-1">
                    {recommendation.marketConditions.map((condition, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Time Horizon */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">Recommended Timeframe</span>
                  <Badge variant="outline" className="text-zinc-300">
                    <Clock className="w-3 h-3 mr-1" />
                    {recommendation.timeHorizon}
                  </Badge>
                </div>

                {/* Action Button */}
                <Button
                  onClick={() => handleStrategySelect(recommendation)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  size="lg"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Use This Strategy
                </Button>
              </CardContent>
            </Card>
          ))}

          {recommendations.length === 0 && !isAnalyzing && (
            <Card className="bg-zinc-900/50 border-zinc-700 col-span-full">
              <CardContent className="text-center py-12">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 text-zinc-500" />
                <h3 className="text-lg font-medium text-zinc-200 mb-2">No Recommendations Yet</h3>
                <p className="text-zinc-400 mb-4">
                  Click refresh to get AI-powered strategy recommendations based on current market
                  conditions.
                </p>
                <Button onClick={generateRecommendations} variant="outline">
                  Get Recommendations
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Loading State */}
        {isAnalyzing && (
          <Card className="bg-zinc-900/50 border-zinc-700">
            <CardContent className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-zinc-200 mb-2">
                Analyzing Market Conditions
              </h3>
              <p className="text-zinc-400">
                Our AI is analyzing current market data, volatility patterns, and sentiment to
                provide personalized strategy recommendations...
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  },
);

// Display name for debugging
AIStrategyAdvisor.displayName = 'AIStrategyAdvisor';
