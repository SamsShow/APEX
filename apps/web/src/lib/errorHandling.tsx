import React from 'react';
import { z } from 'zod';

// Error types and classifications
export enum ErrorType {
  NETWORK = 'network',
  API = 'api',
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  BUSINESS_LOGIC = 'business_logic',
  SYSTEM = 'system',
  USER_INPUT = 'user_input',
  EXTERNAL_SERVICE = 'external_service',
}

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum ErrorCategory {
  CLIENT = 'client',
  SERVER = 'server',
  NETWORK = 'network',
  BUSINESS = 'business',
  SYSTEM = 'system',
}

// Error context interface
export interface ErrorContext {
  userId?: string;
  sessionId?: string;
  componentName?: string;
  action?: string;
  metadata?: Record<string, any>;
  timestamp: Date;
  url?: string;
  userAgent?: string;
  stackTrace?: string;
}

// Standardized error interface
export interface ApexError {
  id: string;
  type: ErrorType;
  severity: ErrorSeverity;
  category: ErrorCategory;
  message: string;
  code?: string;
  cause?: Error;
  context: ErrorContext;
  recovery?: {
    action: string;
    message: string;
    retryable: boolean;
    maxRetries?: number;
  };
  userMessage?: string;
  technicalDetails?: string;
}

// Error recovery strategies
export interface RecoveryStrategy {
  type: 'retry' | 'fallback' | 'redirect' | 'refresh' | 'notification';
  action: () => void | Promise<void>;
  delay?: number;
  maxRetries?: number;
}

// Error configuration
interface ErrorConfig {
  enableLogging: boolean;
  enableReporting: boolean;
  maxRetries: number;
  retryDelay: number;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

// Default error configuration
const DEFAULT_ERROR_CONFIG: ErrorConfig = {
  enableLogging: true,
  enableReporting: true,
  maxRetries: 3,
  retryDelay: 1000,
  logLevel: 'error',
};

// Error logger class
export class ErrorLogger {
  private config: ErrorConfig;
  private errors: ApexError[] = [];
  private maxErrors = 100;

  constructor(config: Partial<ErrorConfig> = {}) {
    this.config = { ...DEFAULT_ERROR_CONFIG, ...config };
  }

  // Log an error
  log(error: ApexError): void {
    if (!this.config.enableLogging) return;

    // Add to error history
    this.errors.push(error);
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }

    // Console logging based on severity
    const logMethod = this.getLogMethod(error.severity);
    const logMessage = this.formatErrorMessage(error);

    logMethod(logMessage, error);

    // Send to error reporting service if enabled
    if (this.config.enableReporting) {
      this.reportError(error);
    }
  }

  // Create a standardized error
  createError(
    type: ErrorType,
    severity: ErrorSeverity,
    message: string,
    context: Partial<ErrorContext> = {},
    cause?: Error,
    recovery?: ApexError['recovery'],
  ): ApexError {
    const errorId = `apex_error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const fullContext: ErrorContext = {
      timestamp: new Date(),
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      stackTrace: cause?.stack,
      ...context,
    };

    return {
      id: errorId,
      type,
      severity,
      category: this.getCategoryFromType(type),
      message,
      cause,
      context: fullContext,
      recovery,
      userMessage: this.generateUserMessage(type, message),
      technicalDetails: cause?.message,
    };
  }

  // Handle different types of errors
  handleNetworkError(error: Error, context: Partial<ErrorContext> = {}): ApexError {
    return this.createError(
      ErrorType.NETWORK,
      ErrorSeverity.HIGH,
      'Network request failed',
      context,
      error,
      {
        action: 'retry',
        message: 'Please check your internet connection and try again.',
        retryable: true,
        maxRetries: 3,
      },
    );
  }

  handleApiError(status: number, message: string, context: Partial<ErrorContext> = {}): ApexError {
    const severity = status >= 500 ? ErrorSeverity.HIGH : ErrorSeverity.MEDIUM;
    const type =
      status === 401
        ? ErrorType.AUTHENTICATION
        : status === 403
          ? ErrorType.AUTHORIZATION
          : ErrorType.API;

    let recovery: ApexError['recovery'];
    if (status === 401) {
      recovery = {
        action: 'redirect',
        message: 'Please log in again.',
        retryable: false,
      };
    } else if (status >= 500) {
      recovery = {
        action: 'retry',
        message: 'The server encountered an error. Please try again.',
        retryable: true,
        maxRetries: 2,
      };
    }

    return this.createError(type, severity, message, context, undefined, recovery);
  }

  handleValidationError(errors: string[], context: Partial<ErrorContext> = {}): ApexError {
    return this.createError(
      ErrorType.VALIDATION,
      ErrorSeverity.LOW,
      `Validation failed: ${errors.join(', ')}`,
      context,
      undefined,
      {
        action: 'notification',
        message: 'Please correct the highlighted fields.',
        retryable: false,
      },
    );
  }

  handleBusinessLogicError(message: string, context: Partial<ErrorContext> = {}): ApexError {
    return this.createError(
      ErrorType.BUSINESS_LOGIC,
      ErrorSeverity.MEDIUM,
      message,
      context,
      undefined,
      {
        action: 'notification',
        message: 'Please review your input and try again.',
        retryable: false,
      },
    );
  }

  // Get error history
  getErrorHistory(): ApexError[] {
    return [...this.errors];
  }

  // Clear error history
  clearHistory(): void {
    this.errors = [];
  }

  // Get error statistics
  getStatistics() {
    const stats = {
      total: this.errors.length,
      byType: {} as Record<ErrorType, number>,
      bySeverity: {} as Record<ErrorSeverity, number>,
      byCategory: {} as Record<ErrorCategory, number>,
      recent: this.errors.slice(-10),
    };

    this.errors.forEach((error) => {
      stats.byType[error.type] = (stats.byType[error.type] || 0) + 1;
      stats.bySeverity[error.severity] = (stats.bySeverity[error.severity] || 0) + 1;
      stats.byCategory[error.category] = (stats.byCategory[error.category] || 0) + 1;
    });

    return stats;
  }

  private getLogMethod(severity: ErrorSeverity): Function {
    switch (severity) {
      case ErrorSeverity.CRITICAL:
      case ErrorSeverity.HIGH:
        return console.error;
      case ErrorSeverity.MEDIUM:
        return console.warn;
      case ErrorSeverity.LOW:
        return console.info;
      default:
        return console.log;
    }
  }

  private formatErrorMessage(error: ApexError): string {
    const contextInfo = error.context.componentName ? `[${error.context.componentName}] ` : '';

    const actionInfo = error.context.action ? ` during ${error.context.action}` : '';

    return `${contextInfo}${error.type.toUpperCase()}: ${error.message}${actionInfo}`;
  }

  private getCategoryFromType(type: ErrorType): ErrorCategory {
    switch (type) {
      case ErrorType.NETWORK:
        return ErrorCategory.NETWORK;
      case ErrorType.API:
      case ErrorType.AUTHENTICATION:
      case ErrorType.AUTHORIZATION:
        return ErrorCategory.SERVER;
      case ErrorType.VALIDATION:
      case ErrorType.USER_INPUT:
        return ErrorCategory.CLIENT;
      case ErrorType.BUSINESS_LOGIC:
        return ErrorCategory.BUSINESS;
      case ErrorType.SYSTEM:
      case ErrorType.EXTERNAL_SERVICE:
      default:
        return ErrorCategory.SYSTEM;
    }
  }

  private generateUserMessage(type: ErrorType, message: string): string {
    switch (type) {
      case ErrorType.NETWORK:
        return 'Connection problem. Please check your internet and try again.';
      case ErrorType.AUTHENTICATION:
        return 'Please log in to continue.';
      case ErrorType.AUTHORIZATION:
        return "You don't have permission to perform this action.";
      case ErrorType.VALIDATION:
        return 'Please check your input and try again.';
      case ErrorType.API:
        return 'Service temporarily unavailable. Please try again later.';
      default:
        return 'Something went wrong. Please try again.';
    }
  }

  private async reportError(error: ApexError): Promise<void> {
    // In a real application, this would send to an error reporting service
    // like Sentry, LogRocket, or Rollbar
    try {
      // For now, we'll just store it locally
      // In production, you would send to your error reporting service
      console.log('Error reported:', {
        id: error.id,
        type: error.type,
        severity: error.severity,
        message: error.message,
        context: error.context,
      });
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  }
}

// Global error logger instance
export const errorLogger = new ErrorLogger();

// Error recovery utilities
export class ErrorRecovery {
  static async retryWithBackoff<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000,
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;

        if (attempt < maxRetries - 1) {
          const delay = baseDelay * Math.pow(2, attempt);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError!;
  }

  static createFallback<T>(fallbackValue: T) {
    return (error: Error): T => {
      console.warn('Using fallback due to error:', error.message);
      return fallbackValue;
    };
  }

  static async withTimeout<T>(operation: () => Promise<T>, timeoutMs: number = 10000): Promise<T> {
    return Promise.race([
      operation(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Operation timed out')), timeoutMs),
      ),
    ]);
  }
}

// Network error handling utilities
export class NetworkErrorHandler {
  static isNetworkError(error: Error): boolean {
    return (
      error.message.includes('fetch') ||
      error.message.includes('network') ||
      error.message.includes('Failed to fetch') ||
      !navigator.onLine
    );
  }

  static isRetryableError(status?: number): boolean {
    // Retry on network errors and server errors
    return !status || status >= 500 || status === 408 || status === 429;
  }

  static getRetryDelay(attempt: number, baseDelay: number = 1000): number {
    // Exponential backoff with jitter
    const exponentialDelay = baseDelay * Math.pow(2, attempt);
    const jitter = Math.random() * 1000;
    return exponentialDelay + jitter;
  }
}

// API error handling utilities
export class ApiErrorHandler {
  static parseApiError(response: Response, responseData?: any): ApexError {
    const status = response.status;
    let message = `API Error: ${status}`;

    if (responseData?.message) {
      message = responseData.message;
    } else if (responseData?.error) {
      message = responseData.error;
    }

    return errorLogger.handleApiError(status, message);
  }

  static handleFetchError(error: Error): ApexError {
    if (NetworkErrorHandler.isNetworkError(error)) {
      return errorLogger.handleNetworkError(error);
    }

    return errorLogger.createError(
      ErrorType.API,
      ErrorSeverity.HIGH,
      'API request failed',
      {},
      error,
      {
        action: 'retry',
        message: 'Please try again.',
        retryable: true,
        maxRetries: 3,
      },
    );
  }
}

// React error boundary utilities
export class ReactErrorHandler {
  static handleBoundaryError(
    error: Error,
    errorInfo: { componentStack: string },
    componentName?: string,
  ): ApexError {
    return errorLogger.createError(
      ErrorType.SYSTEM,
      ErrorSeverity.HIGH,
      `React Error Boundary: ${error.message}`,
      {
        componentName,
        metadata: {
          componentStack: errorInfo.componentStack,
        },
      },
      error,
      {
        action: 'refresh',
        message: 'The page encountered an error. Please refresh to continue.',
        retryable: false,
      },
    );
  }

  static createErrorBoundary(
    componentName: string,
    fallback?: React.ComponentType<{ error?: Error }>,
  ) {
    return class extends React.Component<
      { children: React.ReactNode; fallback?: React.ComponentType<{ error?: Error }> },
      { hasError: boolean; error?: Error }
    > {
      constructor(props: any) {
        super(props);
        this.state = { hasError: false };
      }

      static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
      }

      componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        errorLogger.log(ReactErrorHandler.handleBoundaryError(error, errorInfo, componentName));
      }

      render() {
        if (this.state.hasError) {
          const FallbackComponent = this.props.fallback || fallback || DefaultErrorFallback;
          return <FallbackComponent error={this.state.error} />;
        }

        return this.props.children;
      }
    };
  }
}

// Default error fallback component
const DefaultErrorFallback: React.FC<{ error?: Error }> = ({ error }) => (
  <div className="flex items-center justify-center h-64 rounded-lg border border-red-500/20 bg-red-500/5">
    <div className="text-center">
      <div className="text-red-400 text-sm mb-2">Something went wrong</div>
      {error && <div className="text-red-500/70 text-xs">{error.message}</div>}
      <button
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
      >
        Reload Page
      </button>
    </div>
  </div>
);

// Error boundary HOC
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string,
) {
  const ErrorBoundary = ReactErrorHandler.createErrorBoundary(componentName);

  const WrappedComponent = (props: P) => (
    <ErrorBoundary>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
}

// Error context provider
export const ErrorContext = React.createContext<{
  logError: (error: ApexError) => void;
  getErrorHistory: () => ApexError[];
  clearErrors: () => void;
  getStatistics: () => any;
}>({
  logError: () => {},
  getErrorHistory: () => [],
  clearErrors: () => {},
  getStatistics: () => ({}),
});

export const ErrorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = React.useMemo(
    () => ({
      logError: (error: ApexError) => errorLogger.log(error),
      getErrorHistory: () => errorLogger.getErrorHistory(),
      clearErrors: () => errorLogger.clearHistory(),
      getStatistics: () => errorLogger.getStatistics(),
    }),
    [],
  );

  return <ErrorContext.Provider value={value}>{children}</ErrorContext.Provider>;
};

// Hook for using error context
export function useErrorContext() {
  return React.useContext(ErrorContext);
}

// Global error handlers
if (typeof window !== 'undefined') {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const error = errorLogger.createError(
      ErrorType.SYSTEM,
      ErrorSeverity.MEDIUM,
      'Unhandled Promise Rejection',
      {
        metadata: {
          reason: event.reason,
          promise: event.promise,
        },
      },
      event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
    );
    errorLogger.log(error);
  });

  // Handle global JavaScript errors
  window.addEventListener('error', (event) => {
    const error = errorLogger.createError(
      ErrorType.SYSTEM,
      ErrorSeverity.HIGH,
      `Global Error: ${event.message}`,
      {
        metadata: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      },
      event.error,
    );
    errorLogger.log(error);
  });
}
