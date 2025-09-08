import { renderHook, act, waitFor } from '@testing-library/react';
import { usePositions } from '@/hooks/usePositions';
import { useWallet } from '@aptos-labs/wallet-adapter-react';

// Mock the wallet adapter
jest.mock('@aptos-labs/wallet-adapter-react', () => ({
  useWallet: jest.fn(),
}));

// Mock Aptos SDK
jest.mock('@aptos-labs/ts-sdk', () => ({
  Aptos: jest.fn().mockImplementation(() => ({
    view: jest.fn(),
  })),
  AptosConfig: jest.fn(),
  Network: {
    TESTNET: 'testnet',
  },
}));

const mockUseWallet = useWallet as jest.MockedFunction<typeof useWallet>;

describe('usePositions', () => {
  const mockView = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseWallet.mockReturnValue({
      account: {
        address: '0x123',
        publicKey: '0x456',
      },
      connected: true,
    } as any);

    // Setup Aptos mock
    const { Aptos } = require('@aptos-labs/ts-sdk');
    Aptos.mockImplementation(() => ({
      view: mockView,
    }));
  });

  describe('initial state', () => {
    it('should return correct initial state when wallet is connected', async () => {
      // Mock successful blockchain call for initial load
      mockView.mockResolvedValue([[]]);

      const { result } = renderHook(() => usePositions());

      // Wait for initial load to complete
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.positions.length).toBeGreaterThan(0); // Should have mock data
      expect(result.current.error).toBeNull();
      expect(result.current.lastUpdated).not.toBeNull();
      expect(typeof result.current.refreshPositions).toBe('function');
      expect(result.current.portfolioSummary.positionCount).toBeGreaterThan(0);
    });

    it('should return correct initial state when wallet is not connected', () => {
      mockUseWallet.mockReturnValue({
        account: null,
        connected: false,
      } as any);

      const { result } = renderHook(() => usePositions());

      expect(result.current.positions).toEqual([]);
    });
  });

  describe('fetchPositions', () => {
    it('should fetch positions successfully from blockchain', async () => {
      const mockPortfolioLegs = [[10, -5, 8]]; // Mock portfolio legs data

      // Set up the mock before rendering
      mockView.mockResolvedValue(mockPortfolioLegs);

      const { result } = renderHook(() => usePositions());

      // Wait for fetch to complete
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockView).toHaveBeenCalledWith({
        payload: {
          function: expect.stringContaining('::get_portfolio_legs'),
          typeArguments: [],
          functionArguments: ['0x123'],
        },
      });

      expect(result.current.positions.length).toBe(3);
      expect(result.current.positions[0]).toMatchObject({
        symbol: expect.stringContaining('APEX-OPT-123'),
        side: 'long',
        quantity: 10,
      });
      expect(result.current.positions[1]).toMatchObject({
        symbol: expect.stringContaining('APEX-OPT-123'),
        side: 'short',
        quantity: 5,
      });
      expect(result.current.lastUpdated).not.toBeNull();
    });

    it('should handle empty portfolio legs', async () => {
      const mockPortfolioLegs = [[]]; // Empty portfolio
      mockView.mockResolvedValue(mockPortfolioLegs);

      const { result } = renderHook(() => usePositions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.positions).toEqual([]);
      expect(result.current.portfolioSummary.positionCount).toBe(0);
    });

    it('should handle blockchain query failure and fallback to mock data', async () => {
      mockView.mockRejectedValue(new Error('Blockchain error'));

      const { result } = renderHook(() => usePositions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBeNull(); // Should not set error for fallback
      expect(result.current.positions.length).toBeGreaterThan(0); // Should have mock data
    });

    it('should not fetch when wallet is not connected', () => {
      mockUseWallet.mockReturnValue({
        account: null,
        connected: false,
      } as any);

      renderHook(() => usePositions());

      expect(mockView).not.toHaveBeenCalled();
    });
  });

  describe('portfolioSummary', () => {
    it('should calculate portfolio summary correctly', () => {
      const { result } = renderHook(() => usePositions());

      // Simulate positions with known values
      act(() => {
        // Override the positions state for testing
        result.current.positions = [
          {
            symbol: 'APEX-OPT-1',
            side: 'long',
            quantity: 5,
            avgPrice: 1.0,
            unrealizedPnL: 2.5,
            realizedPnL: 0,
            currentPrice: 1.5,
            marketValue: 7.5,
          },
          {
            symbol: 'APEX-OPT-2',
            side: 'short',
            quantity: 3,
            avgPrice: 2.0,
            unrealizedPnL: -1.5,
            realizedPnL: 1.0,
            currentPrice: 1.5,
            marketValue: 4.5,
          },
        ];
      });

      expect(result.current.portfolioSummary.totalValue).toBe(12);
      expect(result.current.portfolioSummary.totalUnrealizedPnL).toBe(1);
      expect(result.current.portfolioSummary.totalRealizedPnL).toBe(1);
      expect(result.current.portfolioSummary.totalPnL).toBe(2);
      expect(result.current.portfolioSummary.positionCount).toBe(2);
    });

    it('should handle empty positions', () => {
      const { result } = renderHook(() => usePositions());

      expect(result.current.portfolioSummary.totalValue).toBe(0);
      expect(result.current.portfolioSummary.totalUnrealizedPnL).toBe(0);
      expect(result.current.portfolioSummary.totalRealizedPnL).toBe(0);
      expect(result.current.portfolioSummary.totalPnL).toBe(0);
      expect(result.current.portfolioSummary.positionCount).toBe(0);
    });
  });

  describe('polling', () => {
    it('should poll for updates when connected', async () => {
      jest.useFakeTimers();

      mockView.mockResolvedValue([[]]);

      renderHook(() => usePositions(1000)); // 1 second interval

      // Initial call should have happened
      expect(mockView).toHaveBeenCalledTimes(1);

      // Advance timer and wait for next poll
      jest.advanceTimersByTime(1000);
      await waitFor(() => {
        expect(mockView).toHaveBeenCalledTimes(2);
      });

      jest.useRealTimers();
    });

    it('should not poll when pollInterval is 0', () => {
      mockView.mockResolvedValue([[]]);

      renderHook(() => usePositions(0));

      expect(mockView).toHaveBeenCalledTimes(1); // Only initial call
    });

    it('should not poll when wallet is not connected', () => {
      mockUseWallet.mockReturnValue({
        account: null,
        connected: false,
      } as any);

      renderHook(() => usePositions(1000));

      expect(mockView).not.toHaveBeenCalled();
    });
  });

  describe('refreshPositions', () => {
    it('should manually refresh positions', async () => {
      mockView.mockResolvedValue([[]]);

      const { result } = renderHook(() => usePositions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const initialCallCount = mockView.mock.calls.length;
      mockView.mockResolvedValue([[]]);

      act(() => {
        result.current.refreshPositions();
      });

      expect(mockView).toHaveBeenCalledTimes(initialCallCount + 1);
    });
  });

  describe('position data structure', () => {
    it('should create correct position objects from blockchain data', async () => {
      const mockPortfolioLegs = [[15, -8, 12]]; // Positive and negative legs
      mockView.mockResolvedValue(mockPortfolioLegs);

      const { result } = renderHook(() => usePositions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const positions = result.current.positions;

      // Check long position
      const longPosition = positions.find((p) => p.side === 'long' && p.quantity === 15);
      expect(longPosition).toBeDefined();
      expect(longPosition?.symbol).toContain('APEX-OPT-123');
      expect(longPosition?.avgPrice).toBe(1.0);
      expect(longPosition?.unrealizedPnL).toBe(0.25); // Mock P&L calculation

      // Check short position
      const shortPosition = positions.find((p) => p.side === 'short' && p.quantity === 8);
      expect(shortPosition).toBeDefined();
      expect(shortPosition?.unrealizedPnL).toBe(-0.15); // Mock P&L calculation
    });

    it('should include user address in position symbols', async () => {
      const mockPortfolioLegs = [[5]];
      mockView.mockResolvedValue(mockPortfolioLegs);

      const { result } = renderHook(() => usePositions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.positions[0].symbol).toContain('123'); // Last 4 chars of address
    });
  });

  describe('error handling', () => {
    it('should handle view function errors gracefully', async () => {
      mockView.mockRejectedValue(new Error('Contract call failed'));

      const { result } = renderHook(() => usePositions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Should fallback to mock data without setting error
      expect(result.current.error).toBeNull();
      expect(result.current.positions.length).toBeGreaterThan(0);
    });

    it('should reset loading state on error', async () => {
      mockView.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => usePositions());

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });
  });

  describe('custom poll interval', () => {
    it('should use custom poll interval', async () => {
      jest.useFakeTimers();

      mockView.mockResolvedValue([[]]);

      const customInterval = 5000; // 5 seconds
      renderHook(() => usePositions(customInterval));

      expect(mockView).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(4000); // Less than interval
      expect(mockView).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(1000); // Total 5 seconds
      await waitFor(() => {
        expect(mockView).toHaveBeenCalledTimes(2);
      });

      jest.useRealTimers();
    });
  });
});
