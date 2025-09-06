import { renderHook, act, waitFor } from '@testing-library/react';
import { useOptionsContract } from '@/hooks/useOptionsContract';
import { useWallet } from '@aptos-labs/wallet-adapter-react';

// Mock the wallet adapter
jest.mock('@aptos-labs/wallet-adapter-react', () => ({
  useWallet: jest.fn(),
}));

// Mock the error handler
jest.mock('@/hooks/useErrorHandler', () => ({
  useErrorHandler: jest.fn(() => ({
    handleTransactionError: jest.fn((error) => ({
      userMessage: 'Transaction failed',
      technicalDetails: error.message,
    })),
  })),
}));

const mockUseWallet = useWallet as jest.MockedFunction<typeof useWallet>;

describe('useOptionsContract', () => {
  const mockSignAndSubmitTransaction = jest.fn();
  const mockOnTransactionSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseWallet.mockReturnValue({
      account: {
        address: '0x123',
        publicKey: '0x456',
      },
      connected: true,
      signAndSubmitTransaction: mockSignAndSubmitTransaction,
    } as any);
  });

  describe('initial state', () => {
    it('should return correct initial state when wallet is connected', () => {
      const { result } = renderHook(() => useOptionsContract());

      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.connected).toBe(true);
      expect(typeof result.current.initAccount).toBe('function');
      expect(typeof result.current.createOption).toBe('function');
      expect(typeof result.current.cancelOption).toBe('function');
      expect(typeof result.current.exerciseOption).toBe('function');
    });

    it('should return correct initial state when wallet is not connected', () => {
      mockUseWallet.mockReturnValue({
        account: null,
        connected: false,
        signAndSubmitTransaction: mockSignAndSubmitTransaction,
      } as any);

      const { result } = renderHook(() => useOptionsContract());

      expect(result.current.connected).toBe(false);
    });
  });

  describe('initAccount', () => {
    it('should initialize account successfully', async () => {
      const mockResponse = { hash: '0x789' };
      mockSignAndSubmitTransaction.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useOptionsContract(mockOnTransactionSuccess));

      let hash: string | null = null;

      await act(async () => {
        hash = await result.current.initAccount();
      });

      expect(mockSignAndSubmitTransaction).toHaveBeenCalledWith({
        function:
          '0x9840325ffef7ffc5de961625fd9909d916eecd4fa515ddb2fdf4b38f47f5b083::option_contract::init_account',
        typeArguments: [],
        functionArguments: [],
      });
      expect(hash).toBe('0x789');
      expect(mockOnTransactionSuccess).toHaveBeenCalled();
    });

    it('should handle initialization failure', async () => {
      const error = new Error('Transaction failed');
      mockSignAndSubmitTransaction.mockRejectedValue(error);

      const { result } = renderHook(() => useOptionsContract());

      let hash: string | null = null;

      await act(async () => {
        hash = await result.current.initAccount();
      });

      expect(hash).toBeNull();
      expect(result.current.error).toBe('Transaction failed');
    });

    it('should not initialize when wallet is not connected', async () => {
      mockUseWallet.mockReturnValue({
        account: null,
        connected: false,
        signAndSubmitTransaction: mockSignAndSubmitTransaction,
      } as any);

      const { result } = renderHook(() => useOptionsContract());

      let hash: string | null = null;

      await act(async () => {
        hash = await result.current.initAccount();
      });

      expect(mockSignAndSubmitTransaction).not.toHaveBeenCalled();
      expect(hash).toBeNull();
    });
  });

  describe('createOption', () => {
    const optionParams = {
      strikePrice: 100,
      expirySeconds: 86400,
      optionType: 'call' as const,
      quantity: 1,
    };

    it('should create option successfully', async () => {
      const mockResponse = { hash: '0xabc' };
      mockSignAndSubmitTransaction.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useOptionsContract(mockOnTransactionSuccess));

      let hash: string | null = null;

      await act(async () => {
        hash = await result.current.createOption(
          optionParams.strikePrice,
          optionParams.expirySeconds,
          optionParams.optionType,
          optionParams.quantity,
        );
      });

      expect(mockSignAndSubmitTransaction).toHaveBeenCalledWith({
        data: {
          function:
            '0x9840325ffef7ffc5de961625fd9909d916eecd4fa515ddb2fdf4b38f47f5b083::option_contract::create_option',
          typeArguments: [],
          functionArguments: [100, 86400, 0, 1], // call = 0
        },
      });
      expect(hash).toBe('0xabc');
      expect(mockOnTransactionSuccess).toHaveBeenCalled();
    });

    it('should handle put options correctly', async () => {
      const mockResponse = { hash: '0xdef' };
      mockSignAndSubmitTransaction.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useOptionsContract());

      await act(async () => {
        await result.current.createOption(100, 86400, 'put', 1);
      });

      expect(mockSignAndSubmitTransaction).toHaveBeenCalledWith({
        data: {
          function:
            '0x9840325ffef7ffc5de961625fd9909d916eecd4fa515ddb2fdf4b38f47f5b083::option_contract::create_option',
          typeArguments: [],
          functionArguments: [100, 86400, 1, 1], // put = 1
        },
      });
    });

    it('should handle creation failure', async () => {
      const error = new Error('Creation failed');
      mockSignAndSubmitTransaction.mockRejectedValue(error);

      const { result } = renderHook(() => useOptionsContract());

      let hash: string | null = null;

      await act(async () => {
        hash = await result.current.createOption(100, 86400, 'call', 1);
      });

      expect(hash).toBeNull();
      expect(result.current.error).toBe('Transaction failed');
    });
  });

  describe('cancelOption', () => {
    it('should cancel option successfully', async () => {
      const mockResponse = { hash: '0xcancel' };
      mockSignAndSubmitTransaction.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useOptionsContract(mockOnTransactionSuccess));

      let hash: string | null = null;

      await act(async () => {
        hash = await result.current.cancelOption(123);
      });

      expect(mockSignAndSubmitTransaction).toHaveBeenCalledWith({
        data: {
          function:
            '0x9840325ffef7ffc5de961625fd9909d916eecd4fa515ddb2fdf4b38f47f5b083::option_contract::cancel_option',
          typeArguments: [],
          functionArguments: [123],
        },
      });
      expect(hash).toBe('0xcancel');
      expect(mockOnTransactionSuccess).toHaveBeenCalled();
    });

    it('should handle cancellation failure', async () => {
      const error = new Error('Cancellation failed');
      mockSignAndSubmitTransaction.mockRejectedValue(error);

      const { result } = renderHook(() => useOptionsContract());

      let hash: string | null = null;

      await act(async () => {
        hash = await result.current.cancelOption(123);
      });

      expect(hash).toBeNull();
      expect(result.current.error).toBe('Transaction failed');
    });
  });

  describe('exerciseOption', () => {
    it('should exercise option successfully', async () => {
      const mockResponse = { hash: '0xexercise' };
      mockSignAndSubmitTransaction.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useOptionsContract(mockOnTransactionSuccess));

      let hash: string | null = null;

      await act(async () => {
        hash = await result.current.exerciseOption(123, 105);
      });

      expect(mockSignAndSubmitTransaction).toHaveBeenCalledWith({
        data: {
          function:
            '0x9840325ffef7ffc5de961625fd9909d916eecd4fa515ddb2fdf4b38f47f5b083::option_contract::exercise_option',
          typeArguments: [],
          functionArguments: [123, 105],
        },
      });
      expect(hash).toBe('0xexercise');
      expect(mockOnTransactionSuccess).toHaveBeenCalled();
    });

    it('should handle exercise failure', async () => {
      const error = new Error('Exercise failed');
      mockSignAndSubmitTransaction.mockRejectedValue(error);

      const { result } = renderHook(() => useOptionsContract());

      let hash: string | null = null;

      await act(async () => {
        hash = await result.current.exerciseOption(123, 105);
      });

      expect(hash).toBeNull();
      expect(result.current.error).toBe('Transaction failed');
    });
  });

  describe('loading states', () => {
    it('should set loading state during operations', async () => {
      mockSignAndSubmitTransaction.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ hash: '0x123' }), 100)),
      );

      const { result } = renderHook(() => useOptionsContract());

      expect(result.current.isLoading).toBe(false);

      act(() => {
        result.current.initAccount();
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('should reset loading state on error', async () => {
      const error = new Error('Transaction failed');
      mockSignAndSubmitTransaction.mockRejectedValue(error);

      const { result } = renderHook(() => useOptionsContract());

      act(() => {
        result.current.initAccount();
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });
  });
});
