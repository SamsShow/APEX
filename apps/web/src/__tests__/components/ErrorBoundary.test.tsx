import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from '@/components/ui/error-boundary';

// Component that throws an error
function ErrorComponent() {
  throw new Error('Test error');
  return <div>This should not render</div>;
}

// Component that doesn't throw an error
function SafeComponent() {
  return <div>Safe component rendered</div>;
}

describe('ErrorBoundary', () => {
  // Mock console.error to avoid noise in tests
  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <SafeComponent />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Safe component rendered')).toBeInTheDocument();
  });

  it('renders error UI when an error occurs', () => {
    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
    expect(screen.getByText('Go Home')).toBeInTheDocument();
  });

  it('renders custom fallback when provided', () => {
    const customFallback = <div>Custom error message</div>;

    render(
      <ErrorBoundary fallback={customFallback}>
        <ErrorComponent />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Custom error message')).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });

  it('calls onError callback when error occurs', () => {
    const mockOnError = jest.fn();

    render(
      <ErrorBoundary onError={mockOnError}>
        <ErrorComponent />
      </ErrorBoundary>,
    );

    expect(mockOnError).toHaveBeenCalledWith(expect.any(Error), expect.any(Object));
  });

  it('resets error state when retry is clicked', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    // Click retry button
    fireEvent.click(screen.getByText('Try Again'));

    // Rerender with safe component
    rerender(
      <ErrorBoundary>
        <SafeComponent />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Safe component rendered')).toBeInTheDocument();
  });

  it('shows error details in development mode', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Error Details (Development)')).toBeInTheDocument();

    process.env.NODE_ENV = originalEnv;
  });

  it('does not show error details in production mode', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>,
    );

    expect(screen.queryByText('Error Details (Development)')).not.toBeInTheDocument();

    process.env.NODE_ENV = originalEnv;
  });
});
