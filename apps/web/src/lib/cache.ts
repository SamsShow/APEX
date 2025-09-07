import { PriceFeed, OrderBook, ApiResponse } from './validation';

// Cache entry structure
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
  key: string;
}

// Cache configuration
interface CacheConfig {
  defaultTTL: number; // Default TTL in milliseconds
  maxEntries: number; // Maximum number of cache entries
  storageKey: string; // localStorage key for persistence
  enablePersistence: boolean; // Whether to persist to localStorage
}

// Default cache configuration
const DEFAULT_CACHE_CONFIG: CacheConfig = {
  defaultTTL: 5 * 60 * 1000, // 5 minutes
  maxEntries: 100,
  storageKey: 'apex_cache',
  enablePersistence: true,
};

// Price feed specific configuration
const PRICE_FEED_CONFIG = {
  defaultTTL: 30 * 1000, // 30 seconds for price feeds
  maxEntries: 50,
};

// Order book specific configuration
const ORDER_BOOK_CONFIG = {
  defaultTTL: 10 * 1000, // 10 seconds for order books
  maxEntries: 20,
};

// Cache storage
export class CacheManager {
  private cache = new Map<string, CacheEntry<any>>();
  private config: CacheConfig;
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = { ...DEFAULT_CACHE_CONFIG, ...config };
    this.loadFromStorage();
    this.startCleanupInterval();
  }

  // Get cached data
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.saveToStorage();
      return null;
    }

    return entry.data;
  }

  // Set cached data
  set<T>(key: string, data: T, ttl?: number): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.config.defaultTTL,
      key,
    };

    // Remove oldest entries if we're at capacity
    if (this.cache.size >= this.config.maxEntries) {
      this.evictOldest();
    }

    this.cache.set(key, entry);
    this.saveToStorage();
  }

  // Check if key exists and is not expired
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.saveToStorage();
      return false;
    }

    return true;
  }

  // Delete cache entry
  delete(key: string): void {
    this.cache.delete(key);
    this.saveToStorage();
  }

  // Clear all cache entries
  clear(): void {
    this.cache.clear();
    this.saveToStorage();
  }

  // Get cache statistics
  getStats() {
    const entries = Array.from(this.cache.values());
    const totalSize = entries.length;
    const expiredCount = entries.filter((entry) => Date.now() - entry.timestamp > entry.ttl).length;

    return {
      totalEntries: totalSize,
      expiredEntries: expiredCount,
      activeEntries: totalSize - expiredCount,
      maxEntries: this.config.maxEntries,
    };
  }

  // Evict oldest entries when at capacity
  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTimestamp = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTimestamp) {
        oldestTimestamp = entry.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  // Load cache from localStorage
  private loadFromStorage(): void {
    if (!this.config.enablePersistence) return;

    try {
      const stored = localStorage.getItem(this.config.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Only load entries that haven't expired
        const now = Date.now();
        Object.entries(parsed).forEach(([key, entry]: [string, any]) => {
          if (now - entry.timestamp <= entry.ttl) {
            this.cache.set(key, entry);
          }
        });
      }
    } catch (error) {
      console.warn('Failed to load cache from storage:', error);
    }
  }

  // Save cache to localStorage
  private saveToStorage(): void {
    if (!this.config.enablePersistence) return;

    try {
      const cacheObject = Object.fromEntries(this.cache.entries());
      localStorage.setItem(this.config.storageKey, JSON.stringify(cacheObject));
    } catch (error) {
      console.warn('Failed to save cache to storage:', error);
    }
  }

  // Start cleanup interval to remove expired entries
  private startCleanupInterval(): void {
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      const keysToDelete: string[] = [];

      for (const [key, entry] of this.cache.entries()) {
        if (now - entry.timestamp > entry.ttl) {
          keysToDelete.push(key);
        }
      }

      keysToDelete.forEach((key) => this.cache.delete(key));

      if (keysToDelete.length > 0) {
        this.saveToStorage();
      }
    }, 60000); // Clean up every minute
  }

  // Stop cleanup interval
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }
}

// Create cache managers for different data types
export const priceFeedCache = new CacheManager({
  ...DEFAULT_CACHE_CONFIG,
  ...PRICE_FEED_CONFIG,
  storageKey: 'apex_price_cache',
});

export const orderBookCache = new CacheManager({
  ...DEFAULT_CACHE_CONFIG,
  ...ORDER_BOOK_CONFIG,
  storageKey: 'apex_orderbook_cache',
});

export const generalCache = new CacheManager({
  ...DEFAULT_CACHE_CONFIG,
  storageKey: 'apex_general_cache',
});

// Cache key generators
export const cacheKeys = {
  priceFeed: (symbol: string) => `price_feed_${symbol}`,
  orderBook: (symbol: string) => `order_book_${symbol}`,
  marketData: (symbol: string, type: string) => `market_data_${symbol}_${type}`,
  apiResponse: (endpoint: string, params?: Record<string, any>) => {
    const paramString = params ? `_${JSON.stringify(params)}` : '';
    return `api_${endpoint}${paramString}`;
  },
};

// Cached API wrapper
export class CachedApiClient {
  private cache: CacheManager;

  constructor(cache: CacheManager) {
    this.cache = cache;
  }

  async get<T>(
    url: string,
    options: {
      ttl?: number;
      forceRefresh?: boolean;
      validator?: (data: any) => data is T;
    } = {},
  ): Promise<T | null> {
    const { ttl, forceRefresh = false, validator } = options;
    const cacheKey = cacheKeys.apiResponse(url);

    // Return cached data if available and not forcing refresh
    if (!forceRefresh) {
      const cached = this.cache.get<T>(cacheKey);
      if (cached !== null) {
        return cached;
      }
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Validate data if validator provided
      if (validator && !validator(data)) {
        console.warn('CachedApiClient: Data validation failed');
        return null;
      }

      // Cache the response
      this.cache.set(cacheKey, data, ttl);

      return data;
    } catch (error) {
      console.error('CachedApiClient: Failed to fetch data:', error);
      return null;
    }
  }

  async post<T>(
    url: string,
    body: any,
    options: {
      ttl?: number;
      validator?: (data: any) => data is T;
    } = {},
  ): Promise<T | null> {
    const { ttl, validator } = options;
    const cacheKey = cacheKeys.apiResponse(url, body);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Validate data if validator provided
      if (validator && !validator(data)) {
        console.warn('CachedApiClient: Data validation failed');
        return null;
      }

      // Cache the response
      this.cache.set(cacheKey, data, ttl);

      return data;
    } catch (error) {
      console.error('CachedApiClient: Failed to post data:', error);
      return null;
    }
  }
}

// Background refresh utilities
export class BackgroundRefresher {
  private refreshIntervals = new Map<string, NodeJS.Timeout>();
  private cache: CacheManager;

  constructor(cache: CacheManager) {
    this.cache = cache;
  }

  // Start background refresh for a cache key
  startRefresh(
    key: string,
    refreshFn: () => Promise<any>,
    interval: number = 30000, // 30 seconds default
  ): void {
    // Clear existing interval if any
    this.stopRefresh(key);

    const intervalId = setInterval(async () => {
      try {
        const data = await refreshFn();
        if (data) {
          this.cache.set(key, data);
        }
      } catch (error) {
        console.warn(`Background refresh failed for ${key}:`, error);
      }
    }, interval);

    this.refreshIntervals.set(key, intervalId);
  }

  // Stop background refresh for a cache key
  stopRefresh(key: string): void {
    const intervalId = this.refreshIntervals.get(key);
    if (intervalId) {
      clearInterval(intervalId);
      this.refreshIntervals.delete(key);
    }
  }

  // Stop all background refreshes
  stopAll(): void {
    this.refreshIntervals.forEach((intervalId) => clearInterval(intervalId));
    this.refreshIntervals.clear();
  }
}

// Create background refreshers
export const priceFeedRefresher = new BackgroundRefresher(priceFeedCache);
export const orderBookRefresher = new BackgroundRefresher(orderBookCache);

// Cache utilities
export const cacheUtils = {
  // Get cache statistics
  getStats: () => ({
    priceFeed: priceFeedCache.getStats(),
    orderBook: orderBookCache.getStats(),
    general: generalCache.getStats(),
  }),

  // Clear all caches
  clearAll: () => {
    priceFeedCache.clear();
    orderBookCache.clear();
    generalCache.clear();
  },

  // Warm up cache with initial data
  async warmup(initialData: {
    priceFeeds?: Record<string, PriceFeed>;
    orderBooks?: Record<string, OrderBook>;
  }): Promise<void> {
    const { priceFeeds = {}, orderBooks = {} } = initialData;

    // Cache price feeds
    Object.entries(priceFeeds).forEach(([symbol, data]) => {
      priceFeedCache.set(cacheKeys.priceFeed(symbol), data);
    });

    // Cache order books
    Object.entries(orderBooks).forEach(([symbol, data]) => {
      orderBookCache.set(cacheKeys.orderBook(symbol), data);
    });
  },
};

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    priceFeedRefresher.stopAll();
  });
}
