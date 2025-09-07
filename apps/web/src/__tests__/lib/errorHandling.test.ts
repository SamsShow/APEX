import {
  ErrorLogger,
  ErrorType,
  ErrorSeverity,
  ErrorCategory,
  ApexError,
  ErrorRecovery,
  NetworkErrorHandler,
  ApiErrorHandler,
  ReactErrorHandler,
  errorLogger,
} from '@/lib/errorHandling';

// Mock console methods
const originalConsole = { ...console };
const mockConsole = {
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  log: jest.fn(),
};

describe('Error Handling System', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.assign(console, mockConsole);
    errorLogger.clearHistory();
  });

  afterEach(() => {
    Object.assign(console, originalConsole);
  });

  describe('ErrorLogger', () => {
    let logger: ErrorLogger;

    beforeEach(() => {
      logger = new ErrorLogger({ enableLogging: true, enableReporting: false });
    });

    it('should create a standardized error', () => {
      const error = logger.createError(ErrorType.API, ErrorSeverity.MEDIUM, 'Test error message', {
        componentName: 'TestComponent',
      });

      expect(error.id).toMatch(/^apex_error_/);
      expect(error.type).toBe(ErrorType.API);
      expect(error.severity).toBe(ErrorSeverity.MEDIUM);
      expect(error.category).toBe(ErrorCategory.SERVER);
      expect(error.message).toBe('Test error message');
      expect(error.context.componentName).toBe('TestComponent');
      expect(error.context.timestamp).toBeInstanceOf(Date);
    });

    it('should handle network errors', () => {
      const networkError = new Error('Network request failed');
      const error = logger.handleNetworkError(networkError, { action: 'fetchData' });

      expect(error.type).toBe(ErrorType.NETWORK);
      expect(error.severity).toBe(ErrorSeverity.HIGH);
      expect(error.recovery?.retryable).toBe(true);
      expect(error.recovery?.maxRetries).toBe(3);
    });

    it('should handle API errors with different status codes', () => {
      // 401 Unauthorized
      let error = logger.handleApiError(401, 'Unauthorized');
      expect(error.type).toBe(ErrorType.AUTHENTICATION);
      expect(error.recovery?.retryable).toBe(false);

      // 403 Forbidden
      error = logger.handleApiError(403, 'Forbidden');
      expect(error.type).toBe(ErrorType.AUTHORIZATION);

      // 500 Server Error
      error = logger.handleApiError(500, 'Internal Server Error');
      expect(error.type).toBe(ErrorType.API);
      expect(error.severity).toBe(ErrorSeverity.HIGH);
      expect(error.recovery?.retryable).toBe(true);
    });

    it('should handle validation errors', () => {
      const validationErrors = ['Field is required', 'Invalid format'];
      const error = logger.handleValidationError(validationErrors, { componentName: 'Form' });

      expect(error.type).toBe(ErrorType.VALIDATION);
      expect(error.severity).toBe(ErrorSeverity.LOW);
      expect(error.message).toContain('Validation failed');
      expect(error.message).toContain('Field is required');
      expect(error.recovery?.retryable).toBe(false);
    });

    it('should handle business logic errors', () => {
      const error = logger.handleBusinessLogicError('Invalid trade parameters', {
        action: 'createOrder',
      });

      expect(error.type).toBe(ErrorType.BUSINESS_LOGIC);
      expect(error.severity).toBe(ErrorSeverity.MEDIUM);
      expect(error.recovery?.retryable).toBe(false);
    });

    it('should generate appropriate user messages', () => {
      const networkError = logger.createError(
        ErrorType.NETWORK,
        ErrorSeverity.HIGH,
        'Network failed',
      );
      const authError = logger.createError(
        ErrorType.AUTHENTICATION,
        ErrorSeverity.HIGH,
        'Auth failed',
      );

      expect(networkError.userMessage).toContain('Connection problem');
      expect(authError.userMessage).toContain('Please log in');
    });

    it('should categorize errors correctly', () => {
      expect(logger.createError(ErrorType.NETWORK, ErrorSeverity.HIGH, 'test').category).toBe(
        ErrorCategory.NETWORK,
      );
      expect(logger.createError(ErrorType.API, ErrorSeverity.HIGH, 'test').category).toBe(
        ErrorCategory.SERVER,
      );
      expect(logger.createError(ErrorType.VALIDATION, ErrorSeverity.LOW, 'test').category).toBe(
        ErrorCategory.CLIENT,
      );
      expect(
        logger.createError(ErrorType.BUSINESS_LOGIC, ErrorSeverity.MEDIUM, 'test').category,
      ).toBe(ErrorCategory.BUSINESS);
    });

    it('should maintain error history', () => {
      const error1 = logger.createError(ErrorType.API, ErrorSeverity.MEDIUM, 'Error 1');
      const error2 = logger.createError(ErrorType.NETWORK, ErrorSeverity.HIGH, 'Error 2');

      logger.log(error1);
      logger.log(error2);

      const history = logger.getErrorHistory();
      expect(history).toHaveLength(2);
      expect(history[0]).toBe(error1);
      expect(history[1]).toBe(error2);
    });

    it('should provide error statistics', () => {
      logger.log(logger.createError(ErrorType.API, ErrorSeverity.HIGH, 'API Error'));
      logger.log(logger.createError(ErrorType.NETWORK, ErrorSeverity.MEDIUM, 'Network Error'));
      logger.log(logger.createError(ErrorType.API, ErrorSeverity.LOW, 'Another API Error'));

      const stats = logger.getStatistics();

      expect(stats.total).toBe(3);
      expect(stats.byType[ErrorType.API]).toBe(2);
      expect(stats.byType[ErrorType.NETWORK]).toBe(1);
      expect(stats.bySeverity[ErrorSeverity.HIGH]).toBe(1);
      expect(stats.bySeverity[ErrorSeverity.MEDIUM]).toBe(1);
      expect(stats.bySeverity[ErrorSeverity.LOW]).toBe(1);
    });

    it('should clear error history', () => {
      logger.log(logger.createError(ErrorType.API, ErrorSeverity.MEDIUM, 'Error'));
      expect(logger.getErrorHistory()).toHaveLength(1);

      logger.clearHistory();
      expect(logger.getErrorHistory()).toHaveLength(0);
    });

    it('should use appropriate console methods based on severity', () => {
      logger.log(logger.createError(ErrorType.SYSTEM, ErrorSeverity.CRITICAL, 'Critical'));
      logger.log(logger.createError(ErrorType.API, ErrorSeverity.MEDIUM, 'Medium'));
      logger.log(logger.createError(ErrorType.VALIDATION, ErrorSeverity.LOW, 'Low'));

      expect(mockConsole.error).toHaveBeenCalled();
      expect(mockConsole.warn).toHaveBeenCalled();
      expect(mockConsole.info).toHaveBeenCalled();
    });
  });

  describe('ErrorRecovery', () => {
    it('should retry with exponential backoff', async () => {
      let attempts = 0;
      const operation = jest.fn().mockImplementation(() => {
        attempts++;
        if (attempts < 3) {
          throw new Error('Temporary failure');
        }
        return 'success';
      });

      const result = await ErrorRecovery.retryWithBackoff(operation, 3, 10);

      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(3);
    });

    it('should throw after max retries', async () => {
      const operation = jest.fn().mockRejectedValue(new Error('Persistent failure'));

      await expect(ErrorRecovery.retryWithBackoff(operation, 2, 10)).rejects.toThrow(
        'Persistent failure',
      );

      expect(operation).toHaveBeenCalledTimes(2);
    });

    it('should create fallback function', () => {
      const fallback = ErrorRecovery.createFallback('default_value');
      const result = fallback(new Error('Test error'));

      expect(result).toBe('default_value');
    });

    it('should handle operation timeouts', async () => {
      const slowOperation = new Promise((resolve) => setTimeout(() => resolve('result'), 100));

      await expect(ErrorRecovery.withTimeout(() => slowOperation, 50)).rejects.toThrow(
        'Operation timed out',
      );
    });
  });

  describe('NetworkErrorHandler', () => {
    it('should detect network errors', () => {
      expect(NetworkErrorHandler.isNetworkError(new Error('Failed to fetch'))).toBe(true);
      expect(NetworkErrorHandler.isNetworkError(new Error('network error'))).toBe(true);
      expect(NetworkErrorHandler.isNetworkError(new Error('Validation error'))).toBe(false);
    });

    it('should determine retryable status codes', () => {
      expect(NetworkErrorHandler.isRetryableError(500)).toBe(true);
      expect(NetworkErrorHandler.isRetryableError(408)).toBe(true); // Request Timeout
      expect(NetworkErrorHandler.isRetryableError(429)).toBe(true); // Too Many Requests
      expect(NetworkErrorHandler.isRetryableError(400)).toBe(false);
      expect(NetworkErrorHandler.isRetryableError(404)).toBe(false);
    });

    it('should calculate retry delays with jitter', () => {
      const delay1 = NetworkErrorHandler.getRetryDelay(0, 1000);
      const delay2 = NetworkErrorHandler.getRetryDelay(1, 1000);

      expect(delay1).toBeGreaterThanOrEqual(1000);
      expect(delay2).toBeGreaterThanOrEqual(2000);
      expect(delay1).toBeLessThan(delay2);
    });
  });

  describe('ApiErrorHandler', () => {
    it('should parse API error responses', () => {
      const mockResponse = {
        status: 500,
        json: jest.fn().mockResolvedValue({ message: 'Server error' }),
      } as any;

      const error = ApiErrorHandler.parseApiError(mockResponse, { message: 'Server error' });

      expect(error.type).toBe(ErrorType.API);
      expect(error.severity).toBe(ErrorSeverity.HIGH);
      expect(error.message).toContain('Server error');
      expect(error.recovery?.retryable).toBe(true);
    });

    it('should handle fetch errors', () => {
      const fetchError = new Error('Failed to fetch');
      const error = ApiErrorHandler.handleFetchError(fetchError);

      expect(error.type).toBe(ErrorType.NETWORK);
      expect(error.severity).toBe(ErrorSeverity.HIGH);
      expect(error.recovery?.retryable).toBe(true);
    });
  });

  describe('ReactErrorHandler', () => {
    it('should handle boundary errors', () => {
      const testError = new Error('Component error');
      const errorInfo = { componentStack: 'Test component stack' };

      const error = ReactErrorHandler.handleBoundaryError(testError, errorInfo, 'TestComponent');

      expect(error.type).toBe(ErrorType.SYSTEM);
      expect(error.severity).toBe(ErrorSeverity.HIGH);
      expect(error.context.componentName).toBe('TestComponent');
      expect(error.context.metadata?.componentStack).toBe('Test component stack');
      expect(error.recovery?.action).toBe('refresh');
    });

    it('should create error boundary component', () => {
      const ErrorBoundary = ReactErrorHandler.createErrorBoundary('TestBoundary');

      expect(typeof ErrorBoundary).toBe('function');
      expect(ErrorBoundary.getDerivedStateFromError).toBeDefined();
    });
  });

  describe('Global Error Logger', () => {
    it('should be available globally', () => {
      expect(errorLogger).toBeDefined();
      expect(typeof errorLogger.log).toBe('function');
      expect(typeof errorLogger.createError).toBe('function');
    });

    it('should maintain global error history', () => {
      const error = errorLogger.createError(ErrorType.API, ErrorSeverity.MEDIUM, 'Global test');
      errorLogger.log(error);

      const history = errorLogger.getErrorHistory();
      expect(history).toContain(error);
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete error flow', () => {
      // Create a network error
      const networkError = new Error('Connection failed');

      // Handle it through the system
      const error = errorLogger.handleNetworkError(networkError, {
        componentName: 'TestComponent',
        action: 'fetchData',
      });

      // Log it
      errorLogger.log(error);

      // Verify it was logged
      const history = errorLogger.getErrorHistory();
      expect(history).toHaveLength(1);
      expect(history[0]).toBe(error);

      // Check statistics
      const stats = errorLogger.getStatistics();
      expect(stats.total).toBe(1);
      expect(stats.byType[ErrorType.NETWORK]).toBe(1);
    });

    it('should handle error recovery', async () => {
      let attempts = 0;
      const operation = jest.fn().mockImplementation(() => {
        attempts++;
        if (attempts === 1) {
          throw new Error('First attempt fails');
        }
        return 'success';
      });

      const result = await ErrorRecovery.retryWithBackoff(operation, 3, 1);

      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(2);
    });

    it('should format error messages correctly', () => {
      const error = errorLogger.createError(
        ErrorType.API,
        ErrorSeverity.MEDIUM,
        'API call failed',
        {
          componentName: 'OrderBook',
          action: 'fetchPrices',
        },
      );

      expect(error.userMessage).toContain('Service temporarily unavailable');
    });
  });
});
