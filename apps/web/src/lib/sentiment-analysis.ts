'use client';

export interface SentimentData {
  overall: 'bullish' | 'bearish' | 'neutral';
  score: number; // -1 to 1, where -1 is extremely bearish, 1 is extremely bullish
  confidence: number; // 0-1
  sources: SentimentSource[];
  lastUpdated: Date;
}

export interface SentimentSource {
  name: string;
  type: 'social' | 'news' | 'onchain' | 'technical';
  sentiment: 'bullish' | 'bearish' | 'neutral';
  score: number; // -1 to 1
  volume: number; // mentions, posts, transactions, etc.
  influence: number; // 0-1, how much this source influences overall sentiment
  recentActivity: SentimentActivity[];
}

export interface SentimentActivity {
  timestamp: Date;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  content: string;
  impact: number; // -1 to 1
}

export interface MarketImpact {
  direction: 'bullish' | 'bearish' | 'neutral';
  magnitude: number; // 0-1
  timeframe: 'short' | 'medium' | 'long';
  confidence: number;
  reasoning: string[];
}

class SentimentAnalysisEngine {
  private sentimentData: SentimentData | null = null;
  private updateInterval: NodeJS.Timeout | null = null;

  // Simulate real-time sentiment analysis
  async analyzeSentiment(symbol: string): Promise<SentimentData> {
    // Simulate API calls to various sentiment sources
    const sources = await this.fetchSentimentSources(symbol);

    // Aggregate sentiment from all sources
    const aggregatedScore = this.aggregateSentiment(sources);
    const overall = this.determineOverallSentiment(aggregatedScore);
    const confidence = this.calculateConfidence(sources);

    return {
      overall,
      score: aggregatedScore,
      confidence,
      sources,
      lastUpdated: new Date(),
    };
  }

  private async fetchSentimentSources(symbol: string): Promise<SentimentSource[]> {
    // Simulate fetching from different sources with realistic delays
    const sources: SentimentSource[] = [];

    // Social Media Sentiment (Twitter, Reddit, etc.)
    sources.push(await this.getSocialSentiment(symbol));

    // News Sentiment
    sources.push(await this.getNewsSentiment(symbol));

    // On-chain Sentiment (wallet activity, DEX volume, etc.)
    sources.push(await this.getOnChainSentiment(symbol));

    // Technical Analysis Sentiment
    sources.push(await this.getTechnicalSentiment(symbol));

    return sources;
  }

  private async getSocialSentiment(symbol: string): Promise<SentimentSource> {
    // Simulate social media analysis
    await new Promise((resolve) => setTimeout(resolve, 100));

    const baseSentiment = Math.random() - 0.5; // -0.5 to 0.5
    const volume = Math.floor(Math.random() * 10000) + 1000;

    const recentActivity: SentimentActivity[] = Array.from({ length: 5 }, (_, i) => ({
      timestamp: new Date(Date.now() - i * 60000), // Every minute
      sentiment: Math.random() > 0.5 ? 'bullish' : Math.random() > 0.5 ? 'bearish' : 'neutral',
      content: `Social media post about ${symbol}`,
      impact: (Math.random() - 0.5) * 0.2,
    }));

    return {
      name: 'Social Media',
      type: 'social',
      sentiment: baseSentiment > 0.2 ? 'bullish' : baseSentiment < -0.2 ? 'bearish' : 'neutral',
      score: baseSentiment,
      volume,
      influence: 0.3,
      recentActivity,
    };
  }

  private async getNewsSentiment(symbol: string): Promise<SentimentSource> {
    await new Promise((resolve) => setTimeout(resolve, 150));

    const baseSentiment = (Math.random() - 0.5) * 0.8;
    const volume = Math.floor(Math.random() * 100) + 10;

    const recentActivity: SentimentActivity[] = Array.from({ length: 3 }, (_, i) => ({
      timestamp: new Date(Date.now() - i * 3600000), // Every hour
      sentiment: Math.random() > 0.6 ? 'bullish' : Math.random() > 0.4 ? 'bearish' : 'neutral',
      content: `News article about ${symbol}`,
      impact: (Math.random() - 0.5) * 0.3,
    }));

    return {
      name: 'News & Media',
      type: 'news',
      sentiment: baseSentiment > 0.15 ? 'bullish' : baseSentiment < -0.15 ? 'bearish' : 'neutral',
      score: baseSentiment,
      volume,
      influence: 0.25,
      recentActivity,
    };
  }

  private async getOnChainSentiment(symbol: string): Promise<SentimentSource> {
    await new Promise((resolve) => setTimeout(resolve, 80));

    // On-chain sentiment is more objective - based on actual transaction data
    const baseSentiment = (Math.random() - 0.5) * 0.6;
    const volume = Math.floor(Math.random() * 1000000) + 100000;

    const recentActivity: SentimentActivity[] = Array.from({ length: 10 }, (_, i) => ({
      timestamp: new Date(Date.now() - i * 300000), // Every 5 minutes
      sentiment: Math.random() > 0.55 ? 'bullish' : Math.random() > 0.45 ? 'bearish' : 'neutral',
      content: `Large ${symbol} transaction detected`,
      impact: (Math.random() - 0.5) * 0.15,
    }));

    return {
      name: 'On-Chain Activity',
      type: 'onchain',
      sentiment: baseSentiment > 0.1 ? 'bullish' : baseSentiment < -0.1 ? 'bearish' : 'neutral',
      score: baseSentiment,
      volume,
      influence: 0.35,
      recentActivity,
    };
  }

  private async getTechnicalSentiment(symbol: string): Promise<SentimentSource> {
    await new Promise((resolve) => setTimeout(resolve, 120));

    // Technical analysis based on indicators
    const baseSentiment = (Math.random() - 0.5) * 0.7;
    const volume = Math.floor(Math.random() * 1000) + 100;

    const recentActivity: SentimentActivity[] = Array.from({ length: 4 }, (_, i) => ({
      timestamp: new Date(Date.now() - i * 1800000), // Every 30 minutes
      sentiment: Math.random() > 0.5 ? 'bullish' : Math.random() > 0.5 ? 'bearish' : 'neutral',
      content: `Technical indicator signal for ${symbol}`,
      impact: (Math.random() - 0.5) * 0.25,
    }));

    return {
      name: 'Technical Analysis',
      type: 'technical',
      sentiment: baseSentiment > 0.1 ? 'bullish' : baseSentiment < -0.1 ? 'bearish' : 'neutral',
      score: baseSentiment,
      volume,
      influence: 0.1,
      recentActivity,
    };
  }

  private aggregateSentiment(sources: SentimentSource[]): number {
    let weightedSum = 0;
    let totalWeight = 0;

    sources.forEach((source) => {
      weightedSum += source.score * source.influence;
      totalWeight += source.influence;
    });

    return totalWeight > 0 ? weightedSum / totalWeight : 0;
  }

  private determineOverallSentiment(score: number): 'bullish' | 'bearish' | 'neutral' {
    if (score > 0.2) return 'bullish';
    if (score < -0.2) return 'bearish';
    return 'neutral';
  }

  private calculateConfidence(sources: SentimentSource[]): number {
    // Confidence based on volume, consistency, and source diversity
    const volumeScore = Math.min(sources.reduce((sum, s) => sum + s.volume, 0) / 100000, 1);
    const consistencyScore = 1 - this.calculateSentimentVariance(sources);
    const diversityScore = sources.length / 4; // Max 4 sources

    return (volumeScore + consistencyScore + diversityScore) / 3;
  }

  private calculateSentimentVariance(sources: SentimentSource[]): number {
    const scores = sources.map((s) => s.score);
    const mean = scores.reduce((sum, s) => sum + s, 0) / scores.length;
    const variance = scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / scores.length;
    return Math.sqrt(variance);
  }

  async predictMarketImpact(sentimentData: SentimentData): Promise<MarketImpact> {
    // Analyze how sentiment might impact price movement
    const sentimentStrength = Math.abs(sentimentData.score);
    const confidence = sentimentData.confidence;

    let direction: 'bullish' | 'bearish' | 'neutral' = 'neutral';
    let magnitude = 0;
    let timeframe: 'short' | 'medium' | 'long' = 'short';

    if (sentimentStrength > 0.3 && confidence > 0.6) {
      direction = sentimentData.score > 0 ? 'bullish' : 'bearish';
      magnitude = Math.min(sentimentStrength * confidence, 0.8);

      // Determine timeframe based on sentiment sources
      const hasNewsSentiment = sentimentData.sources.some(
        (s) => s.type === 'news' && Math.abs(s.score) > 0.2,
      );
      const hasOnChainSentiment = sentimentData.sources.some(
        (s) => s.type === 'onchain' && Math.abs(s.score) > 0.2,
      );

      if (hasNewsSentiment) {
        timeframe = 'medium'; // News can have medium-term impact
      } else if (hasOnChainSentiment) {
        timeframe = 'short'; // On-chain activity is more immediate
      }
    }

    const reasoning = this.generateImpactReasoning(sentimentData, direction, magnitude, timeframe);

    return {
      direction,
      magnitude,
      timeframe,
      confidence: confidence * (sentimentStrength > 0.3 ? 1 : 0.5),
      reasoning,
    };
  }

  private generateImpactReasoning(
    sentimentData: SentimentData,
    direction: string,
    magnitude: number,
    timeframe: string,
  ): string[] {
    const reasoning: string[] = [];

    if (direction !== 'neutral') {
      reasoning.push(
        `${direction.charAt(0).toUpperCase() + direction.slice(1)} sentiment detected with ${(magnitude * 100).toFixed(1)}% potential impact`,
      );
    }

    if (sentimentData.confidence > 0.7) {
      reasoning.push('High confidence in sentiment analysis based on multiple data sources');
    }

    const strongSources = sentimentData.sources.filter((s) => Math.abs(s.score) > 0.2);
    if (strongSources.length > 0) {
      reasoning.push(`Strong signals from: ${strongSources.map((s) => s.name).join(', ')}`);
    }

    if (timeframe === 'short') {
      reasoning.push('Expected impact within hours to days');
    } else if (timeframe === 'medium') {
      reasoning.push('Expected impact within days to weeks');
    } else {
      reasoning.push('Long-term sentiment trend identified');
    }

    return reasoning;
  }

  // Start real-time sentiment monitoring
  startRealTimeMonitoring(symbol: string, callback: (data: SentimentData) => void): () => void {
    const updateSentiment = async () => {
      try {
        const data = await this.analyzeSentiment(symbol);
        this.sentimentData = data;
        callback(data);
      } catch (error) {
        console.error('Failed to update sentiment:', error);
      }
    };

    // Initial update
    updateSentiment();

    // Set up interval for real-time updates (every 30 seconds)
    this.updateInterval = setInterval(updateSentiment, 30000);

    // Return cleanup function
    return () => {
      if (this.updateInterval) {
        clearInterval(this.updateInterval);
        this.updateInterval = null;
      }
    };
  }
}

// Export singleton instance
export const sentimentAnalysisEngine = new SentimentAnalysisEngine();

// Utility functions
export function getSentimentColor(sentiment: 'bullish' | 'bearish' | 'neutral'): string {
  switch (sentiment) {
    case 'bullish':
      return 'text-green-400';
    case 'bearish':
      return 'text-red-400';
    case 'neutral':
      return 'text-zinc-400';
    default:
      return 'text-zinc-400';
  }
}

export function getSentimentEmoji(sentiment: 'bullish' | 'bearish' | 'neutral'): string {
  switch (sentiment) {
    case 'bullish':
      return '📈';
    case 'bearish':
      return '📉';
    case 'neutral':
      return '➡️';
    default:
      return '❓';
  }
}

export function formatSentimentScore(score: number): string {
  const percentage = Math.abs(score * 100);
  const direction = score >= 0 ? 'Bullish' : 'Bearish';
  return `${direction} ${percentage.toFixed(1)}%`;
}

export function getImpactColor(magnitude: number): string {
  if (magnitude > 0.6) return 'text-red-400';
  if (magnitude > 0.3) return 'text-yellow-400';
  return 'text-green-400';
}
