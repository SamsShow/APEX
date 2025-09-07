import React, { useEffect, useRef, useCallback } from 'react';

// Performance monitoring hook for React components
export function usePerformanceMonitor(componentName: string, enabled: boolean = true) {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(Date.now());
  const renderTimes = useRef<number[]>([]);

  useEffect(() => {
    if (!enabled) return;

    renderCount.current += 1;
    const now = Date.now();
    const renderTime = now - lastRenderTime.current;

    renderTimes.current.push(renderTime);

    // Keep only last 10 render times for average calculation
    if (renderTimes.current.length > 10) {
      renderTimes.current.shift();
    }

    const avgRenderTime =
      renderTimes.current.reduce((a, b) => a + b, 0) / renderTimes.current.length;

    // Log performance metrics every 5 renders
    if (renderCount.current % 5 === 0) {
      console.log(`[${componentName}] Performance:`, {
        totalRenders: renderCount.current,
        avgRenderTime: Math.round(avgRenderTime),
        lastRenderTime: renderTime,
      });
    }

    lastRenderTime.current = now;
  });

  return {
    renderCount: renderCount.current,
    reset: useCallback(() => {
      renderCount.current = 0;
      renderTimes.current = [];
    }, []),
  };
}

// Hook for measuring expensive operations
export function useMeasurePerformance<T extends any[]>(
  operationName: string,
  operation: (...args: T) => any,
  enabled: boolean = true,
) {
  return useCallback(
    (...args: T) => {
      if (!enabled) {
        return operation(...args);
      }

      const startTime = performance.now();
      const result = operation(...args);
      const endTime = performance.now();

      const duration = endTime - startTime;

      // Log slow operations (>16ms is roughly 1 frame at 60fps)
      if (duration > 16) {
        console.warn(`[${operationName}] Slow operation: ${duration.toFixed(2)}ms`);
      }

      return result;
    },
    [operation, operationName, enabled],
  );
}

// Hook for debouncing expensive operations
export function useDebounce<T extends any[]>(
  callback: (...args: T) => void,
  delay: number,
  deps: React.DependencyList = [],
) {
  const timeoutRef = useRef<NodeJS.Timeout>();

  const debouncedCallback = useCallback((...args: T) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, deps);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
}

// Hook for throttling expensive operations
export function useThrottle<T extends any[]>(
  callback: (...args: T) => void,
  delay: number,
  deps: React.DependencyList = [],
) {
  const lastCallRef = useRef<number>(0);

  const throttledCallback = useCallback((...args: T) => {
    const now = Date.now();
    if (now - lastCallRef.current >= delay) {
      lastCallRef.current = now;
      callback(...args);
    }
  }, deps);

  return throttledCallback;
}

// Hook for virtual scrolling optimization
export function useVirtualScroll<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan: number = 5,
) {
  const [scrollTop, setScrollTop] = React.useState(0);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan,
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  return {
    visibleItems,
    totalHeight,
    offsetY,
    onScroll: (event: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(event.currentTarget.scrollTop);
    },
  };
}

// Performance optimization utilities
export const performanceUtils = {
  // Check if device should use reduced animations
  shouldReduceMotion: () => {
    if (typeof window === 'undefined') return false;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    return mediaQuery.matches;
  },

  // Check if device is low-end
  isLowEndDevice: () => {
    if (typeof navigator === 'undefined') return false;

    // Check for hardware concurrency
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
      return true;
    }

    // Check for memory (if available)
    // @ts-ignore - memory API is not in all browsers
    if (navigator.deviceMemory && navigator.deviceMemory < 4) {
      return true;
    }

    return false;
  },

  // Get optimal batch size for operations
  getOptimalBatchSize: (itemCount: number) => {
    const isLowEnd = performanceUtils.isLowEndDevice();
    return isLowEnd ? Math.min(itemCount, 10) : Math.min(itemCount, 50);
  },

  // Measure and log bundle size impact
  logBundleSize: (componentName: string, sizeKB: number) => {
    console.log(`[${componentName}] Bundle size: ${sizeKB}KB`);
  },
};

// React optimization helpers
export const ReactOptimizations = {
  // Memoize expensive computations
  memoizeComputation: <T>(computation: () => T, deps: React.DependencyList) => {
    return React.useMemo(computation, deps);
  },

  // Create optimized callback
  createOptimizedCallback: <T extends any[]>(
    callback: (...args: T) => void,
    deps: React.DependencyList,
  ) => {
    return React.useCallback(callback, deps);
  },

  // Create optimized event handler
  createEventHandler: <T extends React.SyntheticEvent>(
    handler: (event: T) => void,
    deps: React.DependencyList = [],
  ) => {
    return React.useCallback(handler, deps);
  },
};
