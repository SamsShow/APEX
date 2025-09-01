'use client';

export interface MarketDataPoint {
  symbol: string;
  price: number;
  volume: number;
  timestamp: Date;
  changePercent: number;
}

export interface Anomaly {
  id: string;
  type:
    | 'price_spike'
    | 'volume_surge'
    | 'arbitrage_opportunity'
    | 'flash_crash'
    | 'whale_movement'
    | 'sentiment_shift';
  symbol: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number; // 0-1
  description: string;
  potentialImpact: 'bullish' | 'bearish' | 'neutral';
  recommendedAction: string;
  timestamp: Date;
  data: Record<string, unknown>; // Additional anomaly-specific data
}

export interface ArbitrageOpportunity {
  id: string;
  type: 'cross_exchange' | 'options_mispricing' | 'statistical_arbitrage';
  symbols: string[];
  expectedReturn: number;
  confidence: number;
  risk: 'low' | 'medium' | 'high';
  timeframe: string;
  description: string;
  entry: string;
  exit: string;
}

export interface MarketRegime {
  regime: 'trending' | 'ranging' | 'volatile' | 'crash' | 'rally';
  confidence: number;
  description: string;
  duration: string;
  expectedBehavior: string[];
}

class AnomalyDetectionEngine {
  private priceHistory: Map<string, MarketDataPoint[]> = new Map();
  private anomalyHistory: Anomaly[] = [];
  private readonly HISTORY_SIZE = 100; // Keep last 100 data points

  // Update market data and check for anomalies
  updateMarketData(data: MarketDataPoint): Anomaly[] {
    const symbol = data.symbol;

    // Update price history
    if (!this.priceHistory.has(symbol)) {
      this.priceHistory.set(symbol, []);
    }

    const history = this.priceHistory.get(symbol)!;
    history.push(data);

    // Keep only recent history
    if (history.length > this.HISTORY_SIZE) {
      history.shift();
    }

    // Detect anomalies
    const anomalies: Anomaly[] = [];

    // Price spike detection
    const priceSpike = this.detectPriceSpike(history);
    if (priceSpike) anomalies.push(priceSpike);

    // Volume surge detection
    const volumeSurge = this.detectVolumeSurge(history);
    if (volumeSurge) anomalies.push(volumeSurge);

    // Flash crash detection
    const flashCrash = this.detectFlashCrash(history);
    if (flashCrash) anomalies.push(flashCrash);

    // Whale movement detection
    const whaleMovement = this.detectWhaleMovement(data);
    if (whaleMovement) anomalies.push(whaleMovement);

    // Store anomalies
    this.anomalyHistory.push(...anomalies);

    // Keep only recent anomalies (last 50)
    if (this.anomalyHistory.length > 50) {
      this.anomalyHistory = this.anomalyHistory.slice(-50);
    }

    return anomalies;
  }

  private detectPriceSpike(history: MarketDataPoint[]): Anomaly | null {
    if (history.length < 10) return null;

    const recent = history.slice(-5);
    const older = history.slice(-10, -5);

    const recentAvg = recent.reduce((sum, d) => sum + d.price, 0) / recent.length;
    const olderAvg = older.reduce((sum, d) => sum + d.price, 0) / older.length;

    const changePercent = ((recentAvg - olderAvg) / olderAvg) * 100;

    // Detect significant price movements
    if (Math.abs(changePercent) > 10) {
      // 10% threshold
      const severity =
        Math.abs(changePercent) > 20 ? 'high' : Math.abs(changePercent) > 15 ? 'medium' : 'low';

      return {
        id: `price_spike_${Date.now()}`,
        type: 'price_spike',
        symbol: history[0].symbol,
        severity,
        confidence: Math.min(Math.abs(changePercent) / 30, 1), // Higher change = higher confidence
        description: `Price ${changePercent > 0 ? 'spiked up' : 'dropped'} by ${Math.abs(changePercent).toFixed(1)}% in recent trades`,
        potentialImpact: changePercent > 0 ? 'bullish' : 'bearish',
        recommendedAction:
          changePercent > 0
            ? 'Consider taking profits or setting stop losses'
            : 'Monitor for further downside or potential buying opportunity',
        timestamp: new Date(),
        data: { changePercent, recentAvg, olderAvg },
      };
    }

    return null;
  }

  private detectVolumeSurge(history: MarketDataPoint[]): Anomaly | null {
    if (history.length < 10) return null;

    const recent = history.slice(-3);
    const older = history.slice(-10, -7);

    const recentVolumeAvg = recent.reduce((sum, d) => sum + d.volume, 0) / recent.length;
    const olderVolumeAvg = older.reduce((sum, d) => sum + d.volume, 0) / older.length;

    const volumeMultiplier = recentVolumeAvg / olderVolumeAvg;

    // Detect volume surges
    if (volumeMultiplier > 3) {
      // 3x volume threshold
      const severity = volumeMultiplier > 5 ? 'high' : 'medium';

      return {
        id: `volume_surge_${Date.now()}`,
        type: 'volume_surge',
        symbol: history[0].symbol,
        severity,
        confidence: Math.min(volumeMultiplier / 10, 1),
        description: `Volume surged ${volumeMultiplier.toFixed(1)}x above normal levels`,
        potentialImpact: 'neutral', // Volume alone doesn't indicate direction
        recommendedAction:
          'Monitor price action closely - high volume often precedes significant moves',
        timestamp: new Date(),
        data: { volumeMultiplier, recentVolumeAvg, olderVolumeAvg },
      };
    }

    return null;
  }

  private detectFlashCrash(history: MarketDataPoint[]): Anomaly | null {
    if (history.length < 5) return null;

    const recent = history.slice(-5);
    const priceChanges = recent.map((d, i) =>
      i > 0 ? ((d.price - recent[i - 1].price) / recent[i - 1].price) * 100 : 0,
    );

    // Check for rapid price decline followed by recovery
    const maxDrop = Math.min(...priceChanges);
    const recovery = priceChanges[priceChanges.length - 1] - maxDrop;

    if (maxDrop < -5 && recovery > Math.abs(maxDrop) * 0.5) {
      // 5% drop with 50% recovery
      return {
        id: `flash_crash_${Date.now()}`,
        type: 'flash_crash',
        symbol: history[0].symbol,
        severity: 'critical',
        confidence: 0.8,
        description: `Flash crash detected: ${Math.abs(maxDrop).toFixed(1)}% drop followed by ${recovery.toFixed(1)}% recovery`,
        potentialImpact: 'neutral',
        recommendedAction:
          'Exercise extreme caution - flash crashes can indicate market manipulation or technical issues',
        timestamp: new Date(),
        data: { maxDrop, recovery, priceChanges },
      };
    }

    return null;
  }

  private detectWhaleMovement(data: MarketDataPoint): Anomaly | null {
    // Simulate whale detection based on volume and price impact
    const volumeThreshold = 1000000; // 1M volume threshold
    const priceImpactThreshold = 2; // 2% price impact

    if (data.volume > volumeThreshold && Math.abs(data.changePercent) > priceImpactThreshold) {
      const isBuy = data.changePercent > 0;

      return {
        id: `whale_movement_${Date.now()}`,
        type: 'whale_movement',
        symbol: data.symbol,
        severity: 'medium',
        confidence: 0.7,
        description: `Large ${isBuy ? 'buy' : 'sell'} order detected (${(data.volume / 1000000).toFixed(1)}M volume)`,
        potentialImpact: isBuy ? 'bullish' : 'bearish',
        recommendedAction: isBuy
          ? 'Consider joining the momentum or setting profit targets'
          : 'Be cautious of further downside pressure',
        timestamp: new Date(),
        data: { volume: data.volume, priceImpact: data.changePercent },
      };
    }

    return null;
  }

  // Detect arbitrage opportunities
  detectArbitrageOpportunities(
    marketData: Record<string, MarketDataPoint>,
  ): ArbitrageOpportunity[] {
    const opportunities: ArbitrageOpportunity[] = [];

    // Cross-exchange arbitrage (simplified)
    const symbols = Object.keys(marketData);
    for (const symbol of symbols) {
      const exchanges = ['binance', 'coinbase', 'kraken']; // Simulated exchanges
      const prices = exchanges.map(
        () => marketData[symbol].price * (1 + (Math.random() - 0.5) * 0.01),
      );

      const maxPrice = Math.max(...prices);
      const minPrice = Math.min(...prices);
      const spread = ((maxPrice - minPrice) / minPrice) * 100;

      if (spread > 1) {
        // 1% spread threshold
        opportunities.push({
          id: `cross_exchange_${symbol}_${Date.now()}`,
          type: 'cross_exchange',
          symbols: [symbol],
          expectedReturn: spread * 0.8, // Accounting for fees
          confidence: Math.min(spread / 5, 1),
          risk: spread > 3 ? 'high' : spread > 2 ? 'medium' : 'low',
          timeframe: 'minutes',
          description: `${spread.toFixed(2)}% price difference across exchanges`,
          entry: `Buy on exchange with lowest price (${minPrice.toFixed(2)})`,
          exit: `Sell on exchange with highest price (${maxPrice.toFixed(2)})`,
        });
      }
    }

    // Options mispricing arbitrage
    opportunities.push(...this.detectOptionsMispricing(marketData));

    return opportunities;
  }

  private detectOptionsMispricing(
    marketData: Record<string, MarketDataPoint>,
  ): ArbitrageOpportunity[] {
    const opportunities: ArbitrageOpportunity[] = [];

    // Simulate options pricing checks
    Object.keys(marketData).forEach((symbol) => {
      const spotPrice = marketData[symbol].price;

      // Simulate call/put prices (simplified)
      const strikePrice = spotPrice * 1.05;
      const callPrice = Math.max(spotPrice - strikePrice + 1, 0.1) * 0.1; // Simplified
      const putPrice = Math.max(strikePrice - spotPrice + 1, 0.1) * 0.1;

      const intrinsicCall = Math.max(spotPrice - strikePrice, 0);
      const intrinsicPut = Math.max(strikePrice - spotPrice, 0);

      // Check for mispricing
      const callMispricing = ((callPrice - intrinsicCall) / intrinsicCall) * 100;
      const putMispricing = ((putPrice - intrinsicPut) / intrinsicPut) * 100;

      if (Math.abs(callMispricing) > 20 || Math.abs(putMispricing) > 20) {
        opportunities.push({
          id: `options_mispricing_${symbol}_${Date.now()}`,
          type: 'options_mispricing',
          symbols: [symbol],
          expectedReturn:
            Math.abs(callMispricing) > Math.abs(putMispricing)
              ? Math.abs(callMispricing)
              : Math.abs(putMispricing),
          confidence: 0.6,
          risk: 'medium',
          timeframe: 'hours',
          description: `Options pricing anomaly detected (${Math.max(Math.abs(callMispricing), Math.abs(putMispricing)).toFixed(1)}% mispricing)`,
          entry:
            callMispricing > 20
              ? 'Sell overpriced call option'
              : putMispricing > 20
                ? 'Sell overpriced put option'
                : 'Buy underpriced option',
          exit: 'Close position when pricing normalizes',
        });
      }
    });

    return opportunities;
  }

  // Detect market regime changes
  detectMarketRegime(history: MarketDataPoint[]): MarketRegime {
    if (history.length < 20) {
      return {
        regime: 'ranging',
        confidence: 0.5,
        description: 'Insufficient data for regime analysis',
        duration: 'unknown',
        expectedBehavior: ['Monitor closely'],
      };
    }

    const prices = history.map((d) => d.price);
    const returns = prices.slice(1).map((price, i) => (price - prices[i]) / prices[i]);
    const volatility = Math.sqrt(returns.reduce((sum, ret) => sum + ret * ret, 0) / returns.length);

    // Trend analysis
    const trendSlope = this.calculateTrendSlope(prices);
    const trendStrength = Math.abs(trendSlope);

    // Volume analysis
    const volumes = history.map((d) => d.volume);
    const avgVolume = volumes.reduce((sum, vol) => sum + vol, 0) / volumes.length;
    const recentVolume = volumes.slice(-5).reduce((sum, vol) => sum + vol, 0) / 5;
    const volumeRatio = recentVolume / avgVolume;

    let regime: MarketRegime['regime'];
    let confidence: number;
    let description: string;
    let expectedBehavior: string[];

    if (volatility > 0.05 && volumeRatio > 1.5) {
      regime = 'volatile';
      confidence = 0.8;
      description = 'High volatility with increased volume - potential breakout or breakdown';
      expectedBehavior = [
        'Use wider stop losses',
        'Consider volatility-based strategies',
        'Monitor for trend continuation or reversal',
      ];
    } else if (trendStrength > 0.02) {
      regime = trendSlope > 0 ? 'rally' : 'crash';
      confidence = Math.min(trendStrength * 50, 0.9);
      description = `Strong ${trendSlope > 0 ? 'upward' : 'downward'} trend detected`;
      expectedBehavior = ['Follow the trend', 'Use trailing stops', 'Consider momentum strategies'];
    } else if (trendStrength > 0.005) {
      regime = 'trending';
      confidence = 0.7;
      description = 'Moderate trend with steady price movement';
      expectedBehavior = [
        'Trade in direction of trend',
        'Use trend-following indicators',
        'Monitor for trend exhaustion',
      ];
    } else {
      regime = 'ranging';
      confidence = 0.6;
      description = 'Price moving within a range - low trend strength';
      expectedBehavior = [
        'Look for range trading opportunities',
        'Use support/resistance levels',
        'Consider mean-reversion strategies',
      ];
    }

    return {
      regime,
      confidence,
      description,
      duration: this.estimateRegimeDuration(regime, history),
      expectedBehavior,
    };
  }

  private calculateTrendSlope(prices: number[]): number {
    const n = prices.length;
    const sumX = (n * (n - 1)) / 2;
    const sumY = prices.reduce((sum, price) => sum + price, 0);
    const sumXY = prices.reduce((sum, price, i) => sum + i * price, 0);
    const sumXX = (n * (n - 1) * (2 * n - 1)) / 6;

    return (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  }

  private estimateRegimeDuration(
    regime: MarketRegime['regime'],
    history: MarketDataPoint[],
  ): string {
    // Simplified duration estimation based on recent volatility
    const recentPrices = history.slice(-20);
    const volatility = this.calculateVolatility(recentPrices);

    switch (regime) {
      case 'volatile':
        return volatility > 0.03 ? 'days to weeks' : 'hours to days';
      case 'trending':
        return 'days to weeks';
      case 'ranging':
        return 'weeks to months';
      case 'rally':
      case 'crash':
        return 'hours to days';
      default:
        return 'unknown';
    }
  }

  private calculateVolatility(history: MarketDataPoint[]): number {
    const prices = history.map((d) => d.price);
    const returns = prices.slice(1).map((price, i) => Math.log(price / prices[i]));
    return Math.sqrt(returns.reduce((sum, ret) => sum + ret * ret, 0) / returns.length);
  }

  // Get recent anomalies
  getRecentAnomalies(limit: number = 10): Anomaly[] {
    return this.anomalyHistory.slice(-limit).reverse();
  }

  // Get anomaly statistics
  getAnomalyStats() {
    const stats = {
      total: this.anomalyHistory.length,
      byType: {} as Record<string, number>,
      bySeverity: {} as Record<string, number>,
      recentActivity: 0,
    };

    const oneHourAgo = Date.now() - 60 * 60 * 1000;

    this.anomalyHistory.forEach((anomaly) => {
      stats.byType[anomaly.type] = (stats.byType[anomaly.type] || 0) + 1;
      stats.bySeverity[anomaly.severity] = (stats.bySeverity[anomaly.severity] || 0) + 1;

      if (anomaly.timestamp.getTime() > oneHourAgo) {
        stats.recentActivity++;
      }
    });

    return stats;
  }
}

// Export singleton instance
export const anomalyDetectionEngine = new AnomalyDetectionEngine();

// Utility functions
export function getAnomalyColor(severity: string): string {
  switch (severity) {
    case 'critical':
      return 'text-red-400';
    case 'high':
      return 'text-orange-400';
    case 'medium':
      return 'text-yellow-400';
    case 'low':
      return 'text-green-400';
    default:
      return 'text-zinc-400';
  }
}

export function getAnomalyIcon(type: string): string {
  switch (type) {
    case 'price_spike':
      return '📈';
    case 'volume_surge':
      return '🌊';
    case 'arbitrage_opportunity':
      return '💰';
    case 'flash_crash':
      return '⚡';
    case 'whale_movement':
      return '🐋';
    case 'sentiment_shift':
      return '💭';
    default:
      return '⚠️';
  }
}

export function getRegimeColor(regime: string): string {
  switch (regime) {
    case 'rally':
      return 'text-green-400';
    case 'crash':
      return 'text-red-400';
    case 'volatile':
      return 'text-orange-400';
    case 'trending':
      return 'text-blue-400';
    case 'ranging':
      return 'text-zinc-400';
    default:
      return 'text-zinc-400';
  }
}
