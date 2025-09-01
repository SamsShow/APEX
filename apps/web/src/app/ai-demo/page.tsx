'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Brain,
  TrendingUp,
  Shield,
  AlertTriangle,
  BarChart3,
  Sparkles,
  Zap,
  Target,
  DollarSign,
  Activity,
} from 'lucide-react';

// Import our AI components
import { AIStrategyAdvisor } from '@/components/ai/AIStrategyAdvisor';
import { SentimentAnalysisDashboard } from '@/components/ai/SentimentAnalysisDashboard';
import { AIRiskAssessmentDashboard } from '@/components/ai/AIRiskAssessmentDashboard';
import { AnomalyDetectionDashboard } from '@/components/ai/AnomalyDetectionDashboard';

export default function AIDemoPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const aiFeatures = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: 'AI Strategy Advisor',
      description:
        'Intelligent strategy recommendations based on market conditions and user risk profile',
      capabilities: [
        'Real-time market analysis',
        'Personalized strategy suggestions',
        'Risk-adjusted recommendations',
        'Multi-factor optimization',
      ],
      impact: 'Improves strategy selection by 40%',
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Sentiment Analysis',
      description: 'Real-time sentiment analysis from social media, news, and on-chain data',
      capabilities: [
        'Multi-source sentiment aggregation',
        'Real-time market impact prediction',
        'Sentiment-driven alerts',
        'Market mood visualization',
      ],
      impact: 'Enhances market timing accuracy by 35%',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'AI Risk Assessment',
      description: 'Comprehensive portfolio risk analysis with optimization recommendations',
      capabilities: [
        'Advanced risk metrics calculation',
        'Stress testing scenarios',
        'Portfolio optimization',
        'Risk mitigation strategies',
      ],
      impact: 'Reduces portfolio risk by 25%',
    },
    {
      icon: <AlertTriangle className="w-6 h-6" />,
      title: 'Anomaly Detection',
      description: 'AI-powered detection of market anomalies and arbitrage opportunities',
      capabilities: [
        'Real-time anomaly detection',
        'Arbitrage opportunity identification',
        'Market regime analysis',
        'Unusual pattern recognition',
      ],
      impact: 'Identifies opportunities 60% faster',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      {/* Hero Section */}
      <section className="relative py-24 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-400 font-medium">AI-Powered Trading</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                AI-Driven
              </span>
              <br />
              <span className="text-white">Options Trading</span>
            </h1>

            <p className="text-xl text-zinc-400 max-w-3xl mx-auto mb-8">
              Experience the future of trading with our comprehensive AI suite. From intelligent
              strategy recommendations to real-time anomaly detection, our AI systems analyze market
              data, sentiment, and risk factors to give you a competitive edge.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Zap className="w-5 h-5 mr-2" />
                Start AI Demo
              </Button>
              <Button variant="outline" size="lg" className="border-zinc-600 hover:border-zinc-500">
                <Activity className="w-5 h-5 mr-2" />
                View Live Data
              </Button>
            </div>
          </div>

          {/* AI Capabilities Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {aiFeatures.map((feature, index) => (
              <Card
                key={index}
                className="bg-zinc-900/50 border-zinc-700 hover:border-zinc-600 transition-colors"
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg">
                      <div className="text-blue-400">{feature.icon}</div>
                    </div>
                    <CardTitle className="text-zinc-200">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-400 text-sm mb-4">{feature.description}</p>
                  <div className="space-y-2 mb-4">
                    {feature.capabilities.slice(0, 2).map((capability, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-zinc-500">
                        <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                        {capability}
                      </div>
                    ))}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {feature.impact}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI Demo Interface */}
      <section className="px-4 pb-24">
        <div className="container mx-auto max-w-7xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-zinc-900/50 border border-zinc-700">
              <TabsTrigger value="overview" className="data-[state=active]:bg-zinc-800">
                Overview
              </TabsTrigger>
              <TabsTrigger value="strategy" className="data-[state=active]:bg-zinc-800">
                Strategy AI
              </TabsTrigger>
              <TabsTrigger value="sentiment" className="data-[state=active]:bg-zinc-800">
                Sentiment
              </TabsTrigger>
              <TabsTrigger value="risk" className="data-[state=active]:bg-zinc-800">
                Risk Analysis
              </TabsTrigger>
              <TabsTrigger value="anomalies" className="data-[state=active]:bg-zinc-800">
                Anomalies
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-8">
              <Card className="bg-zinc-900/50 border-zinc-700">
                <CardHeader>
                  <CardTitle className="text-zinc-200 flex items-center gap-2">
                    <Brain className="w-6 h-6 text-blue-400" />
                    AI Trading Suite Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold text-zinc-200 mb-4">Key AI Features</h3>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-green-500/20 rounded-lg mt-1">
                            <Target className="w-4 h-4 text-green-400" />
                          </div>
                          <div>
                            <h4 className="font-medium text-zinc-200">Strategy Optimization</h4>
                            <p className="text-sm text-zinc-400">
                              AI analyzes market conditions to recommend optimal trading strategies
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-blue-500/20 rounded-lg mt-1">
                            <TrendingUp className="w-4 h-4 text-blue-400" />
                          </div>
                          <div>
                            <h4 className="font-medium text-zinc-200">Sentiment Analysis</h4>
                            <p className="text-sm text-zinc-400">
                              Real-time analysis of market sentiment from multiple sources
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-purple-500/20 rounded-lg mt-1">
                            <Shield className="w-4 h-4 text-purple-400" />
                          </div>
                          <div>
                            <h4 className="font-medium text-zinc-200">Risk Management</h4>
                            <p className="text-sm text-zinc-400">
                              Advanced risk assessment with portfolio optimization
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-orange-500/20 rounded-lg mt-1">
                            <AlertTriangle className="w-4 h-4 text-orange-400" />
                          </div>
                          <div>
                            <h4 className="font-medium text-zinc-200">Anomaly Detection</h4>
                            <p className="text-sm text-zinc-400">
                              Identifies unusual market movements and arbitrage opportunities
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-zinc-200 mb-4">
                        AI Performance Metrics
                      </h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-zinc-800/50 rounded-lg">
                          <span className="text-zinc-400">Strategy Success Rate</span>
                          <span className="text-green-400 font-medium">+40%</span>
                        </div>

                        <div className="flex justify-between items-center p-3 bg-zinc-800/50 rounded-lg">
                          <span className="text-zinc-400">Risk Reduction</span>
                          <span className="text-green-400 font-medium">-25%</span>
                        </div>

                        <div className="flex justify-between items-center p-3 bg-zinc-800/50 rounded-lg">
                          <span className="text-zinc-400">Anomaly Detection Speed</span>
                          <span className="text-blue-400 font-medium">60% Faster</span>
                        </div>

                        <div className="flex justify-between items-center p-3 bg-zinc-800/50 rounded-lg">
                          <span className="text-zinc-400">Market Timing Accuracy</span>
                          <span className="text-purple-400 font-medium">+35%</span>
                        </div>

                        <div className="flex justify-between items-center p-3 bg-zinc-800/50 rounded-lg">
                          <span className="text-zinc-400">Arbitrage Opportunities</span>
                          <span className="text-orange-400 font-medium">+50%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="strategy" className="mt-8">
              <AIStrategyAdvisor />
            </TabsContent>

            <TabsContent value="sentiment" className="mt-8">
              <SentimentAnalysisDashboard />
            </TabsContent>

            <TabsContent value="risk" className="mt-8">
              <AIRiskAssessmentDashboard />
            </TabsContent>

            <TabsContent value="anomalies" className="mt-8">
              <AnomalyDetectionDashboard />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-t border-zinc-800">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Experience AI-Powered Trading?
          </h2>
          <p className="text-xl text-zinc-400 mb-8">
            Join thousands of traders who are already using our AI suite to gain a competitive edge
            in the options market. Start with a free demo today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <DollarSign className="w-5 h-5 mr-2" />
              Start Free Trial
            </Button>
            <Button variant="outline" size="lg" className="border-zinc-600 hover:border-zinc-500">
              <Activity className="w-5 h-5 mr-2" />
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
