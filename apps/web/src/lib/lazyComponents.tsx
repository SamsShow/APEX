import React from 'react';

// Lazy load heavy components to improve initial bundle size
export const LazyAnalyticsDashboard = React.lazy(() =>
  import('@/components/analytics/AnalyticsDashboard').then((module) => ({
    default: module.AnalyticsDashboard,
  })),
);

export const LazyAIRiskAssessmentDashboard = React.lazy(() =>
  import('@/components/ai/AIRiskAssessmentDashboard').then((module) => ({
    default: module.AIRiskAssessmentDashboard,
  })),
);

export const LazyAIStrategyAdvisor = React.lazy(() =>
  import('@/components/ai/AIStrategyAdvisor').then((module) => ({
    default: module.AIStrategyAdvisor,
  })),
);

export const LazyAnomalyDetectionDashboard = React.lazy(() =>
  import('@/components/ai/AnomalyDetectionDashboard').then((module) => ({
    default: module.AnomalyDetectionDashboard,
  })),
);

export const LazySentimentAnalysisDashboard = React.lazy(() =>
  import('@/components/ai/SentimentAnalysisDashboard').then((module) => ({
    default: module.SentimentAnalysisDashboard,
  })),
);

export const LazyRiskManagementDashboard = React.lazy(() =>
  import('@/components/risk/RiskManagementDashboard').then((module) => ({
    default: module.RiskManagementDashboard,
  })),
);

export const LazyStrategyBuilder = React.lazy(() =>
  import('@/components/strategy/StrategyBuilder').then((module) => ({
    default: module.StrategyBuilder,
  })),
);

export const LazyPriceFeedsDashboard = React.lazy(() =>
  import('@/components/markets/PriceFeedsDashboard').then((module) => ({
    default: module.PriceFeedsDashboard,
  })),
);

// Loading fallback component
export const LoadingFallback = React.memo(() => (
  <div className="flex items-center justify-center h-64 rounded-lg border border-zinc-800 bg-zinc-900/50">
    <div className="flex items-center gap-3">
      <div className="w-6 h-6 border-2 border-zinc-600 border-t-zinc-400 rounded-full animate-spin"></div>
      <span className="text-zinc-400 text-sm">Loading...</span>
    </div>
  </div>
));

LoadingFallback.displayName = 'LoadingFallback';

// Error fallback component
export const ErrorFallback = React.memo(({ error }: { error?: Error }) => (
  <div className="flex items-center justify-center h-64 rounded-lg border border-red-500/20 bg-red-500/5">
    <div className="text-center">
      <div className="text-red-400 text-sm mb-2">Failed to load component</div>
      {error && <div className="text-red-500/70 text-xs">{error.message}</div>}
    </div>
  </div>
));

ErrorFallback.displayName = 'ErrorFallback';

// Wrapper component for lazy loading with error boundaries
export function withLazyLoading<P extends object>(
  LazyComponent: React.LazyExoticComponent<React.ComponentType<P>>,
  fallback: React.ComponentType = LoadingFallback,
) {
  const WrappedComponent = (props: P) => (
    <React.Suspense fallback={<fallback />}>
      <LazyComponent {...props} />
    </React.Suspense>
  );

  WrappedComponent.displayName = `LazyComponent(${LazyComponent.displayName || 'Unknown'})`;
  return WrappedComponent;
}

// Preload function for critical components
export const preloadComponent = (componentName: string) => {
  switch (componentName) {
    case 'AnalyticsDashboard':
      import('@/components/analytics/AnalyticsDashboard');
      break;
    case 'AIRiskAssessmentDashboard':
      import('@/components/ai/AIRiskAssessmentDashboard');
      break;
    case 'AIStrategyAdvisor':
      import('@/components/ai/AIStrategyAdvisor');
      break;
    case 'AnomalyDetectionDashboard':
      import('@/components/ai/AnomalyDetectionDashboard');
      break;
    case 'SentimentAnalysisDashboard':
      import('@/components/ai/SentimentAnalysisDashboard');
      break;
    case 'RiskManagementDashboard':
      import('@/components/risk/RiskManagementDashboard');
      break;
    case 'StrategyBuilder':
      import('@/components/strategy/StrategyBuilder');
      break;
    case 'PriceFeedsDashboard':
      import('@/components/markets/PriceFeedsDashboard');
      break;
  }
};

// Intersection Observer hook for lazy loading on viewport entry
export function useLazyLoadOnView(
  ref: React.RefObject<Element>,
  callback: () => void,
  options: IntersectionObserverInit = {},
) {
  React.useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            callback();
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      },
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref, callback, options]);
}
