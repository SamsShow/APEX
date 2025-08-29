# Apex Options Trading Platform

A high-frequency, on-chain options trading platform built on Aptos blockchain with atomic execution and real-time pricing.

## 🚀 Features

### Core Trading Features

- **Real-time Options Trading** - Create, cancel, and exercise options with live pricing
- **Portfolio Management** - Track positions, P&L, and performance metrics
- **Order Management** - Comprehensive order history with real-time status updates
- **Price Feeds** - Live price data with Black-Scholes option pricing models
- **Risk Management** - Position limits and margin calculations

### Technical Features

- **Aptos Integration** - Native Aptos wallet adapter with transaction signing
- **Real-time Updates** - Live data polling and automatic position updates
- **Professional UI** - Modern React/TypeScript interface with dark theme
- **Comprehensive Error Handling** - User-friendly error messages and recovery
- **Notification System** - Toast notifications for all transaction events

## 🛠️ Quick Start

### Prerequisites

- Node.js 18+
- pnpm package manager
- Aptos wallet (Petra, Martian, etc.)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd apex-trading-platform

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open http://localhost:3001
```

### Smart Contract Deployment

```bash
# Navigate to contracts
cd packages/option-contracts

# Build contracts
aptos move compile

# Deploy to testnet
aptos move publish --profile testnet
```

## 📖 User Guide

### Getting Started

1. **Connect Wallet**
   - Click "Connect Wallet" in the header
   - Select your preferred Aptos wallet
   - Approve the connection

2. **Initialize Account**
   - The platform will automatically prompt you to initialize your account
   - This is required for trading and costs minimal gas

3. **Start Trading**
   - Navigate to the Trade page
   - Fill in option parameters (strike price, quantity, expiry)
   - Review and confirm the transaction

### Trading Interface

#### Order Ticket

- **Type**: Choose Call or Put option
- **Strike Price**: Price at which the option can be exercised
- **Quantity**: Number of contracts to create
- **Expiry**: Time until option expiration

#### Transaction Confirmation

- Review all transaction details
- Check estimated gas costs
- Confirm or cancel the transaction

#### Order Management

- View all pending, confirmed, and failed orders
- Cancel pending orders
- Track transaction history

### Portfolio Management

#### Positions

- Real-time P&L calculations
- Position sizing and Greeks
- Automatic updates after transactions

#### Risk Metrics

- Portfolio exposure
- Margin requirements
- Risk-adjusted returns

## 🔧 API Reference

### Smart Contract Functions

#### Initialize Account

```move
public entry fun init_account(account: &signer)
```

Initializes user account for options trading.

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

Creates a new option contract.

**Parameters:**

- `strike_price`: Option strike price
- `expiry_seconds`: Expiration timestamp
- `option_type`: 0 for Call, 1 for Put
- `quantity`: Number of contracts

#### Cancel Option

```move
public entry fun cancel_option(
    account: &signer,
    option_id: u64
)
```

Cancels an existing option position.

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

Exercises an option at the specified settlement price.

### React Hooks

#### useOptionsContract

Main hook for all option trading operations.

```typescript
const { initAccount, createOption, cancelOption, exerciseOption, isLoading, error } =
  useOptionsContract(onTransactionSuccess);
```

#### usePositions

Manages portfolio positions and P&L.

```typescript
const { positions, portfolioSummary, refreshPositions, isLoading } = usePositions();
```

#### useOrders

Handles order management and history.

```typescript
const { orders, orderStats, refreshOrders, addOrder } = useOrders();
```

#### usePriceFeeds

Provides real-time price data and option pricing.

```typescript
const { prices, fetchPrice, calculateOptionPrice } = usePriceFeeds();
```

## 🎨 UI Components

### Core Components

- **OrderTicket**: Option creation interface
- **PositionsTable**: Portfolio positions display
- **OrdersTable**: Order history and management
- **TransactionDialog**: Confirmation dialogs
- **NotificationContainer**: Toast notifications

### Theming

- Dark theme optimized for trading
- Responsive design for desktop and mobile
- Professional color scheme with proper contrast

## 🔒 Security

### Smart Contract Security

- Comprehensive input validation
- Access control mechanisms
- Gas limit optimizations
- Emergency pause functionality

### Frontend Security

- TypeScript for type safety
- Input sanitization
- Secure wallet integration
- Error boundary protection

## 📊 Architecture

### Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Blockchain**: Aptos Move smart contracts
- **Styling**: Tailwind CSS
- **State Management**: React hooks
- **Wallet**: Aptos wallet adapter

### Project Structure

```
apex-trading-platform/
├── apps/
│   └── web/                 # Next.js frontend
├── packages/
│   └── option-contracts/    # Move smart contracts
├── docs/                    # Documentation
└── README.md
```

### Data Flow

1. User interacts with React components
2. Components call custom hooks
3. Hooks interact with Aptos wallet adapter
4. Transactions submitted to Aptos network
5. Smart contracts execute business logic
6. UI updates with new data from blockchain

## 🚀 Deployment

### Environment Setup

```bash
# Set environment variables
cp .env.example .env.local

# Configure Aptos network
VITE_APTOS_NETWORK=testnet
VITE_CONTRACT_ADDRESS=your_deployed_contract_address
```

### Production Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

### Smart Contract Deployment

```bash
# Deploy to testnet
aptos move publish --profile testnet

# Deploy to mainnet
aptos move publish --profile mainnet
```

## 🧪 Testing

### Unit Tests

```bash
# Run frontend tests
pnpm test

# Run contract tests
cd packages/option-contracts
aptos move test
```

### Integration Testing

```bash
# Test with Aptos testnet
pnpm test:e2e

# Manual testing checklist
- [ ] Wallet connection
- [ ] Account initialization
- [ ] Option creation
- [ ] Position tracking
- [ ] Order cancellation
- [ ] Error handling
```

## 📈 Performance

### Optimization Features

- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js built-in optimization
- **Caching**: Smart contract query caching
- **Lazy Loading**: Component and data lazy loading

### Monitoring

- Real-time performance metrics
- Error tracking and reporting
- User analytics and behavior tracking

## 🤝 Contributing

### Development Workflow

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Standards

- TypeScript strict mode enabled
- ESLint configuration enforced
- Prettier code formatting
- Comprehensive test coverage

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation

- [User Guide](docs/user-guide.md)
- [API Reference](docs/api-reference.md)
- [Troubleshooting](docs/troubleshooting.md)

### Community

- [Discord](https://discord.gg/apex-trading)
- [Twitter](https://twitter.com/apextrading)
- [GitHub Issues](https://github.com/apex-trading/platform/issues)

### Contact

- **Email**: support@apextrading.com
- **Telegram**: @apextrading_support

---

**Built with ❤️ for the Aptos ecosystem**

_Hyper-fast, secure, and user-friendly options trading for everyone._
