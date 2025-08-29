# Apex Options Trading Platform - API Reference

This document provides comprehensive API reference for the Apex Options Trading Platform, including smart contract functions, React hooks, and integration guides.

## 📋 Table of Contents

- [Smart Contract API](#smart-contract-api)
- [React Hooks API](#react-hooks-api)
- [Integration Guide](#integration-guide)
- [Error Handling](#error-handling)
- [WebSocket API](#websocket-api)

## 🔗 Smart Contract API

### Contract Address Configuration

```typescript
export const APEX_CONTRACT_CONFIG = {
  address: '0x9840325ffef7ffc5de961625fd9909d916eecd4fa515ddb2fdf4b38f47f5b083',
  module: 'option_contract',
  network: 'testnet',
};
```

### Core Functions

#### Initialize Account

```move
public entry fun init_account(account: &signer)
```

**Description**: Initializes a user account for options trading.

**Parameters**:

- `account`: Signer reference for the initializing account

**Gas Estimate**: ~0.001 APT

**Errors**:

- `ACCOUNT_ALREADY_INITIALIZED`: Account already exists
- `INSUFFICIENT_BALANCE`: Not enough APT for gas

---

#### Create Option

```move
public entry fun create_option(
    account: &signer,
    strike_price: u64,
    expiry_seconds: u64,
    option_type: u8,
    quantity: u64
)
```

**Description**: Creates a new option contract.

**Parameters**:

- `account`: Signer reference
- `strike_price`: Strike price in smallest unit (e.g., 5000000 for $5.00)
- `expiry_seconds`: Expiration timestamp in seconds
- `option_type`: 0 for Call, 1 for Put
- `quantity`: Number of contracts to create

**Gas Estimate**: ~0.003 APT

**Errors**:

- `ACCOUNT_NOT_INITIALIZED`: Account not set up
- `INVALID_STRIKE_PRICE`: Strike price must be > 0
- `INVALID_EXPIRY`: Expiry must be in future
- `INSUFFICIENT_BALANCE`: Not enough APT

---

#### Cancel Option

```move
public entry fun cancel_option(
    account: &signer,
    option_id: u64
)
```

**Description**: Cancels an existing option position.

**Parameters**:

- `account`: Signer reference
- `option_id`: Unique identifier of the option to cancel

**Gas Estimate**: ~0.002 APT

**Errors**:

- `OPTION_NOT_FOUND`: Option doesn't exist or doesn't belong to user
- `OPTION_ALREADY_EXERCISED`: Option has been exercised
- `OPTION_EXPIRED`: Option has expired

---

#### Exercise Option

```move
public entry fun exercise_option(
    account: &signer,
    option_id: u64,
    settlement_price: u64,
    use_onchain_time: bool,
    current_time: u64
)
```

**Description**: Exercises an option at the given settlement price.

**Parameters**:

- `account`: Signer reference
- `option_id`: Option to exercise
- `settlement_price`: Current market price for settlement
- `use_onchain_time`: Whether to use blockchain timestamp
- `current_time`: Manual timestamp if not using onchain time

**Gas Estimate**: ~0.004 APT

**Errors**:

- `OPTION_NOT_FOUND`: Option doesn't exist
- `OPTION_EXPIRED`: Option has expired
- `INSUFFICIENT_BALANCE`: Not enough APT for settlement
- `INVALID_SETTLEMENT_PRICE`: Settlement price is invalid

---

#### Create Series

```move
public entry fun create_series(
    account: &signer,
    strike_price: u64,
    expiry_seconds: u64,
    option_type: u8
)
```

**Description**: Creates a new option series.

**Parameters**:

- `account`: Signer reference
- `strike_price`: Strike price for the series
- `expiry_seconds`: Expiration timestamp
- `option_type`: 0 for Call, 1 for Put

**Gas Estimate**: ~0.002 APT

---

### View Functions

#### Get Number of Options

```move
#[view]
public fun get_num_options(account_addr: address): u64
```

**Description**: Returns the number of options owned by an account.

**Parameters**:

- `account_addr`: Account address to query

**Returns**: Number of options as u64

---

#### Get Portfolio Legs

```move
#[view]
public fun get_portfolio_legs(account_addr: address): vector<i64>
```

**Description**: Returns all portfolio legs for an account.

**Parameters**:

- `account_addr`: Account address to query

**Returns**: Vector of i64 representing position legs (positive = long, negative = short)

---

## 🎣 React Hooks API

### useOptionsContract

Main hook for all option trading operations.

```typescript
const {
  // State
  isLoading,
  error,
  connected,

  // Write functions
  initAccount,
  createOption,
  cancelOption,
  cancelOrder,
  exerciseOption,
  createSeries,

  // Read functions
  getNumOptions,
  getPortfolioLegs,
  getAptBalance,
  isAccountInitialized,
} = useOptionsContract(onTransactionSuccess?: () => void);
```

#### Function Signatures

##### initAccount

```typescript
initAccount(): Promise<string | null>
```

Returns transaction hash or null on failure.

##### createOption

```typescript
createOption(
  strikePrice: number,
  expirySeconds: number,
  optionType: 'call' | 'put',
  quantity: number
): Promise<string | null>
```

##### cancelOption

```typescript
cancelOption(optionId: number): Promise<string | null>
```

##### cancelOrder

```typescript
cancelOrder(orderId: string): Promise<string | null>
```

##### exerciseOption

```typescript
exerciseOption(
  optionId: number,
  settlementPrice: number
): Promise<string | null>
```

##### createSeries

```typescript
createSeries(
  strikePrice: number,
  expirySeconds: number,
  optionType: 'call' | 'put'
): Promise<string | null>
```

---

### usePositions

Manages portfolio positions and P&L calculations.

```typescript
const {
  positions,
  isLoading,
  error,
  refreshPositions,
  portfolioSummary,
  lastUpdated,
} = usePositions(pollInterval?: number);
```

#### Position Data Structure

```typescript
interface PortfolioPosition {
  symbol: string;
  side: 'long' | 'short';
  quantity: number;
  avgPrice: number;
  unrealizedPnL: number;
  realizedPnL: number;
  currentPrice?: number;
  marketValue: number;
}
```

#### Portfolio Summary

```typescript
interface PortfolioSummary {
  totalValue: number;
  totalUnrealizedPnL: number;
  totalRealizedPnL: number;
  totalPnL: number;
  positionCount: number;
}
```

---

### useOrders

Handles order management and transaction history.

```typescript
const {
  orders,
  isLoading,
  error,
  refreshOrders,
  addOrder,
  updateOrderStatus,
  getOrdersByStatus,
  getOrdersByType,
  orderStats,
  lastUpdated,
} = useOrders(pollInterval?: number);
```

#### Order Data Structure

```typescript
interface Order {
  id: string;
  type: 'create_option' | 'cancel_option' | 'exercise_option' | 'create_series';
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: number;
  txHash?: string;
  details: {
    optionType?: 'call' | 'put';
    strikePrice?: number;
    expirySeconds?: number;
    quantity?: number;
    optionId?: number;
    settlementPrice?: number;
  };
  gasUsed?: string;
  errorMessage?: string;
}
```

#### Order Statistics

```typescript
interface OrderStats {
  total: number;
  pending: number;
  confirmed: number;
  failed: number;
  recentActivity: Order[];
}
```

---

### usePriceFeeds

Provides real-time price data and option pricing calculations.

```typescript
const { prices, isLoading, error, fetchPrice, fetchPrices, refreshPrices, getPrice } =
  usePriceFeeds();
```

#### Price Data Structure

```typescript
interface PriceData {
  symbol: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  lastUpdated: number;
  source: 'oracle' | 'exchange' | 'calculated';
}
```

---

### useOptionsPricing

Calculates option prices using Black-Scholes model.

```typescript
const { calculateOptionPrice, calculateImpliedVolatility, getOptionChain } = useOptionsPricing();
```

#### Option Price Data Structure

```typescript
interface OptionPriceData {
  underlyingPrice: number;
  strikePrice: number;
  optionType: 'call' | 'put';
  expiryTimestamp: number;
  theoreticalPrice: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  rho: number;
  impliedVolatility: number;
  lastUpdated: number;
}
```

---

### useErrorHandler

Comprehensive error handling for blockchain operations.

```typescript
const {
  handleError,
  handleTransactionError,
  handleWalletError,
  handleNetworkError,
  parseAptosError,
} = useErrorHandler();
```

---

### useNotifications

Toast notification system for user feedback.

```typescript
const { notifySuccess, notifyError, notifyWarning, notifyInfo } = useNotifications();
```

## 🔧 Integration Guide

### Setting Up the Provider

```typescript
// In your root layout or _app.tsx
import { NotificationProvider } from '@/hooks/useNotifications';
import { WalletProvider } from '@/components/providers/WalletProvider';

export default function RootLayout({ children }) {
  return (
    <WalletProvider>
      <NotificationProvider>
        {children}
        {/* Notification container will be rendered here */}
      </NotificationProvider>
    </WalletProvider>
  );
}
```

### Basic Trading Flow

```typescript
import { useOptionsContract } from '@/hooks/useOptionsContract';
import { useNotifications } from '@/hooks/useNotifications';

function TradingComponent() {
  const { createOption, isLoading } = useOptionsContract();
  const { notifySuccess, notifyError } = useNotifications();

  const handleCreateOption = async () => {
    try {
      const txHash = await createOption(100, 1640995200, 'call', 1);

      if (txHash) {
        notifySuccess('Option Created!', 'Your option has been successfully created.');
      } else {
        notifyError('Creation Failed', 'Failed to create option. Please try again.');
      }
    } catch (error) {
      notifyError('Error', 'An unexpected error occurred.');
    }
  };

  return (
    <button onClick={handleCreateOption} disabled={isLoading}>
      {isLoading ? 'Creating...' : 'Create Option'}
    </button>
  );
}
```

### Error Handling Example

```typescript
import { useErrorHandler } from '@/hooks/useErrorHandler';

function ErrorHandlingComponent() {
  const { handleTransactionError } = useErrorHandler();

  const handleTransaction = async () => {
    try {
      // Your transaction logic here
      await someTransaction();
    } catch (error) {
      // This will show appropriate error notifications
      handleTransactionError(error, 'Option Creation');
    }
  };
}
```

### Price Feed Integration

```typescript
import { usePriceFeeds } from '@/hooks/usePriceFeeds';

function PriceDisplay() {
  const { prices, fetchPrice } = usePriceFeeds();

  useEffect(() => {
    fetchPrice('APT');
  }, []);

  const aptPrice = prices['APT'];

  return (
    <div>
      {aptPrice ? (
        <div>
          <h3>APT Price</h3>
          <p>${aptPrice.price.toFixed(2)}</p>
          <p className={aptPrice.change24h >= 0 ? 'text-green-500' : 'text-red-500'}>
            {aptPrice.changePercent24h >= 0 ? '+' : ''}{aptPrice.changePercent24h.toFixed(2)}%
          </p>
        </div>
      ) : (
        <p>Loading price...</p>
      )}
    </div>
  );
}
```

### Real-time Updates

```typescript
import { usePositions } from '@/hooks/usePositions';
import { useOrders } from '@/hooks/useOrders';

function Dashboard() {
  const { positions, refreshPositions } = usePositions();
  const { orders, refreshOrders } = useOrders();

  // Refresh data after transactions
  const handleTransactionSuccess = () => {
    refreshPositions();
    refreshOrders();
  };

  const { createOption } = useOptionsContract(handleTransactionSuccess);

  // ... rest of component
}
```

## 🚨 Error Handling

### Error Types

```typescript
interface BlockchainError {
  code: string; // Error code for programmatic handling
  message: string; // Technical error message
  details?: any; // Additional error details
  recoverable: boolean; // Whether user can retry
  userMessage: string; // User-friendly message
  suggestedAction?: string; // Recommended action
}
```

### Common Error Codes

- `INSUFFICIENT_BALANCE`: Not enough APT for transaction
- `ACCOUNT_NOT_INITIALIZED`: User account not set up
- `INVALID_PARAMETERS`: Invalid function parameters
- `NETWORK_TIMEOUT`: Network request timed out
- `WALLET_DISCONNECTED`: Wallet connection lost
- `CONTRACT_ERROR`: Smart contract execution failed

### Error Recovery

```typescript
const { handleTransactionError } = useErrorHandler();

try {
  await createOption(strike, expiry, type, quantity);
} catch (error) {
  const parsedError = handleTransactionError(error, 'Option Creation');

  if (parsedError.recoverable) {
    // Show retry option
    showRetryDialog(parsedError.suggestedAction);
  } else {
    // Show support contact
    showSupportDialog();
  }
}
```

## 🔌 WebSocket API

### Real-time Data Streams

```typescript
// Price updates
const priceWebSocket = new WebSocket('wss://api.apextrading.com/prices');

priceWebSocket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // Update prices in real-time
  updatePrices(data);
};

// Order book updates
const orderBookWebSocket = new WebSocket('wss://api.apextrading.com/orderbook');

orderBookWebSocket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // Update order book in real-time
  updateOrderBook(data);
};
```

### WebSocket Message Types

#### Price Update

```json
{
  "type": "price_update",
  "symbol": "APT",
  "data": {
    "price": 5.67,
    "change24h": 0.23,
    "changePercent24h": 4.12,
    "volume24h": 1250000,
    "timestamp": 1640995200000
  }
}
```

#### Order Book Update

```json
{
  "type": "orderbook_update",
  "symbol": "APT-30DEC2023-CALL-5.00",
  "data": {
    "bids": [
      [5.0, 10],
      [4.95, 25]
    ],
    "asks": [
      [5.05, 15],
      [5.1, 30]
    ],
    "timestamp": 1640995200000
  }
}
```

## 📊 Performance Optimization

### Query Optimization

```typescript
// Use polling intervals appropriate for your use case
const { positions } = usePositions(30000); // 30 second polling
const { orders } = useOrders(15000); // 15 second polling
```

### Caching Strategy

```typescript
// Implement caching for frequently accessed data
const priceCache = new Map();
const CACHE_DURATION = 30000; // 30 seconds

const getCachedPrice = async (symbol: string) => {
  const cached = priceCache.get(symbol);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  const freshData = await fetchPrice(symbol);
  priceCache.set(symbol, { data: freshData, timestamp: Date.now() });
  return freshData;
};
```

### Bundle Optimization

```typescript
// Lazy load heavy components
const StrategyBuilder = lazy(() => import('@/components/trade/StrategyBuilder'));

// Code splitting for routes
const TradePage = lazy(() => import('@/pages/TradePage'));
```

## 🔒 Security Best Practices

### Input Validation

```typescript
const validateOptionParams = (params: CreateOptionParams): boolean => {
  return (
    params.strikePrice > 0 &&
    params.expirySeconds > Date.now() / 1000 &&
    params.quantity > 0 &&
    ['call', 'put'].includes(params.optionType)
  );
};
```

### Transaction Safety

```typescript
const safeTransaction = async (transactionFn: () => Promise<any>) => {
  try {
    // Pre-flight checks
    if (!walletConnected) throw new Error('Wallet not connected');
    if (!accountInitialized) throw new Error('Account not initialized');

    // Execute transaction
    const result = await transactionFn();

    // Post-transaction validation
    if (!result?.hash) throw new Error('Invalid transaction result');

    return result;
  } catch (error) {
    // Comprehensive error handling
    handleTransactionError(error, 'Safe Transaction');
    throw error;
  }
};
```

## 📞 Support & Resources

### Documentation Links

- [User Guide](user-guide.md)
- [Troubleshooting](troubleshooting.md)
- [Migration Guide](migration-guide.md)

### Community Resources

- **Discord**: Real-time developer support
- **GitHub Issues**: Bug reports and feature requests
- **Stack Overflow**: Technical questions with `apex-trading` tag

### API Status

- **Base URL**: `https://api.apextrading.com/v1`
- **Status Page**: `https://status.apextrading.com`
- **Rate Limits**: 1000 requests per minute per IP

---

**For additional support, please contact our developer team at dev@apextrading.com**
