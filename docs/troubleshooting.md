# Troubleshooting Guide

This guide helps you resolve common issues when using the Apex Options Trading Platform.

## 🔍 Quick Diagnosis

### Check Your Setup

1. **Wallet Connected**: Verify wallet is connected and unlocked
2. **Network**: Ensure you're on the correct Aptos network (testnet/mainnet)
3. **Balance**: Check you have sufficient APT for gas fees
4. **Account**: Confirm your account is initialized for trading

### System Status

- **Platform Status**: Check https://status.apextrading.com
- **Network Status**: Verify Aptos network is operational
- **Gas Prices**: Monitor current gas costs

## 🚨 Common Issues & Solutions

### Wallet Connection Issues

#### "Wallet Not Connected"

**Symptoms**: Can't access trading features, wallet button shows "Connect"

**Solutions**:

1. **Install Wallet Extension**:
   - Petra: https://petra.app
   - Martian: https://martianwallet.xyz
   - Fewcha: https://fewcha.app

2. **Refresh Connection**:
   - Click "Disconnect" then "Connect Wallet" again
   - Refresh the browser page
   - Restart your browser

3. **Check Browser**:
   - Ensure you're using Chrome, Firefox, or Edge
   - Disable VPN if experiencing issues
   - Clear browser cache and cookies

#### "Wallet Connection Failed"

**Symptoms**: Error message when trying to connect wallet

**Solutions**:

1. **Check Network**: Ensure you're on the correct Aptos network
2. **Wallet Version**: Update to latest wallet version
3. **Browser Permissions**: Grant website access to wallet
4. **Multiple Wallets**: Disconnect other wallet extensions

### Account Initialization Issues

#### "Account Not Initialized"

**Symptoms**: Platform prompts to initialize account

**Solution**:

```typescript
// The platform will automatically guide you through this process
1. Click "Initialize Account"
2. Confirm transaction in wallet
3. Wait for confirmation (2-5 seconds)
4. Refresh the page if needed
```

**Troubleshooting**:

- Ensure sufficient APT balance (~0.001 APT)
- Check network congestion
- Retry if transaction fails

#### "Initialization Failed"

**Symptoms**: Account initialization transaction fails

**Causes & Solutions**:

1. **Insufficient Balance**:
   - Add more APT to your wallet
   - Check current gas prices

2. **Network Issues**:
   - Wait for network congestion to clear
   - Try during off-peak hours

3. **Wallet Issues**:
   - Ensure wallet is unlocked
   - Try different wallet if available

### Transaction Issues

#### "Transaction Failed"

**Symptoms**: Option creation/cancellation fails

**Common Causes**:

##### Insufficient Balance

```
Error: INSUFFICIENT_BALANCE
Solution: Add more APT to your wallet (minimum 0.001 APT)
```

##### Invalid Parameters

```
Error: INVALID_PARAMETERS
Solutions:
- Check strike price is > 0
- Verify expiry date is in the future
- Ensure quantity is > 0
- Confirm option type is 'call' or 'put'
```

##### Network Timeout

```
Error: NETWORK_TIMEOUT
Solutions:
- Check internet connection
- Wait for network congestion to clear
- Try again in a few minutes
```

##### Account Issues

```
Error: ACCOUNT_NOT_INITIALIZED
Solution: Initialize your account first
```

#### "Transaction Stuck as Pending"

**Symptoms**: Transaction shows as pending for extended time

**Solutions**:

1. **Check Transaction**:
   - Use Aptos Explorer to check transaction status
   - Search by transaction hash

2. **Network Congestion**:
   - Wait for network to process transactions
   - Gas price might be too low

3. **Retry Transaction**:
   - Cancel if possible and recreate
   - Increase gas price for faster processing

### Price Feed Issues

#### "Prices Not Loading"

**Symptoms**: Price data not displaying, shows "Loading..." or errors

**Solutions**:

1. **Check Network**: Ensure stable internet connection
2. **Refresh Data**: Click "Refresh" button in price displays
3. **Clear Cache**: Hard refresh the browser (Ctrl+F5)
4. **Wait**: Price feeds may be temporarily unavailable

#### "Stale Price Data"

**Symptoms**: Prices haven't updated in a while

**Solutions**:

1. **Manual Refresh**: Click refresh buttons
2. **Check Sources**: Multiple price sources are used as fallback
3. **Network Issues**: Verify connection to price feed APIs

### Option Trading Issues

#### "Option Creation Failed"

**Symptoms**: Unable to create new option contracts

**Check These First**:

- [ ] Wallet connected and account initialized
- [ ] Sufficient APT balance
- [ ] Valid option parameters
- [ ] Network not congested

**Advanced Troubleshooting**:

1. **Gas Estimation**: Check if gas estimation is working
2. **Contract Status**: Verify smart contract is deployed and active
3. **Network Selection**: Ensure correct network (testnet vs mainnet)

#### "Can't Cancel Option"

**Symptoms**: Cancel button not working or transaction fails

**Possible Issues**:

1. **Already Exercised**: Option may have been exercised
2. **Expired**: Option may have expired
3. **Not Owner**: Trying to cancel someone else's option
4. **Network Issues**: Transaction network problems

### Performance Issues

#### "Platform Running Slow"

**Symptoms**: Slow loading, delayed responses, freezing

**Solutions**:

1. **Browser Optimization**:
   - Close unnecessary tabs
   - Clear browser cache
   - Disable browser extensions temporarily

2. **Network Issues**:
   - Check internet connection speed
   - Try different network if available

3. **Device Resources**:
   - Close other applications
   - Restart browser
   - Check device memory usage

#### "Data Not Updating"

**Symptoms**: Positions, orders, or prices not refreshing

**Solutions**:

1. **Manual Refresh**: Use refresh buttons on each page
2. **Auto-refresh**: Check if polling is enabled (default 15-30 seconds)
3. **Network Issues**: Verify connection to Aptos network
4. **Cache Issues**: Hard refresh the browser

### Error Messages Guide

#### Common Error Codes

| Error Code                | Meaning                    | Solution                    |
| ------------------------- | -------------------------- | --------------------------- |
| `INSUFFICIENT_BALANCE`    | Not enough APT             | Add more APT to wallet      |
| `ACCOUNT_NOT_INITIALIZED` | Account setup required     | Initialize account first    |
| `INVALID_PARAMETERS`      | Wrong input values         | Check all form fields       |
| `NETWORK_TIMEOUT`         | Connection issue           | Check internet, retry later |
| `WALLET_DISCONNECTED`     | Wallet connection lost     | Reconnect wallet            |
| `CONTRACT_ERROR`          | Smart contract issue       | Contact support             |
| `SEQUENCE_NUMBER_ERROR`   | Transaction ordering issue | Wait and retry              |
| `GAS_PRICE_TOO_LOW`       | Gas price too low          | Increase gas price          |

#### Detailed Error Explanations

##### INSUFFICIENT_BALANCE

Your wallet doesn't have enough APT to cover the transaction and gas fees.

- **Minimum Required**: ~0.001 APT for basic transactions
- **Option Creation**: ~0.003 APT
- **Exercise Transaction**: ~0.004 APT

##### ACCOUNT_NOT_INITIALIZED

You need to set up your trading account before placing orders.

- This is a one-time setup process
- Costs minimal gas (~0.001 APT)
- Required for all trading activities

##### INVALID_PARAMETERS

One or more of your option parameters are incorrect:

- **Strike Price**: Must be greater than 0
- **Expiry Date**: Must be in the future
- **Quantity**: Must be greater than 0
- **Option Type**: Must be 'call' or 'put'

##### NETWORK_TIMEOUT

The Aptos network is experiencing delays:

- Check https://explorer.aptoslabs.com for network status
- Try again during off-peak hours
- Consider increasing gas price for faster processing

## 🛠️ Advanced Troubleshooting

### Developer Tools

#### Browser Console

1. **Open Developer Tools**: F12 or Ctrl+Shift+I
2. **Check Console Tab**: Look for error messages
3. **Network Tab**: Verify API calls are successful
4. **Application Tab**: Check local storage and session data

#### Network Analysis

```bash
# Check Aptos network status
curl https://fullnode.testnet.aptoslabs.com/v1

# Check your internet connection
ping google.com

# Test DNS resolution
nslookup fullnode.testnet.aptoslabs.com
```

### Smart Contract Issues

#### Contract Address Problems

**Symptoms**: Transactions fail with contract-related errors

**Verification Steps**:

1. **Check Contract Address**:

   ```typescript
   // In browser console
   console.log(window.location.origin);
   // Should show correct contract address
   ```

2. **Network Verification**:
   - Ensure you're on the correct network
   - Testnet vs Mainnet addresses are different

3. **Contract Deployment**:
   - Verify contract is deployed on current network
   - Check contract status on Aptos Explorer

#### Gas Estimation Issues

**Symptoms**: Gas estimation fails or shows incorrect values

**Solutions**:

1. **Refresh Estimates**: Click refresh on gas estimation
2. **Network Congestion**: Wait for network to clear
3. **Manual Gas**: Set custom gas limit if needed

### Wallet-Specific Issues

#### Petra Wallet

**Common Issues**:

- **Connection Drops**: Refresh page and reconnect
- **Transaction Signing**: Ensure popup isn't blocked
- **Network Selection**: Verify correct network selected

#### Martian Wallet

**Common Issues**:

- **Extension Conflicts**: Disable other wallet extensions
- **Permission Issues**: Grant full permissions to site
- **Update Required**: Check for wallet updates

### System Requirements

#### Minimum Requirements

- **Browser**: Chrome 90+, Firefox 88+, Edge 90+
- **RAM**: 4GB minimum, 8GB recommended
- **Internet**: Stable broadband connection
- **Wallet**: Latest version of supported wallet

#### Recommended Setup

- **Browser**: Chrome with hardware acceleration enabled
- **RAM**: 8GB or more
- **Internet**: 25 Mbps or faster
- **Device**: Desktop/laptop (mobile experience may vary)

## 📞 Getting Help

### Support Channels

#### Immediate Help

1. **Discord Community**: Real-time support from community
2. **GitHub Issues**: Report bugs and get developer help
3. **Documentation**: Check this troubleshooting guide

#### Contact Support

- **Email**: support@apextrading.com
- **Response Time**: 24-48 hours
- **Include Details**: Browser, wallet, error messages, transaction hashes

### Information to Provide

When reporting issues, please include:

- **Browser & Version**: Chrome 120.0.6099
- **Wallet Type**: Petra, Martian, etc.
- **Network**: Testnet or Mainnet
- **Error Message**: Exact error text
- **Transaction Hash**: If applicable
- **Steps to Reproduce**: Detailed steps
- **Screenshots**: If visual issues

### Bug Report Template

```markdown
## Bug Report

**Title**: [Brief description of the issue]

**Environment**:

- Browser: [Chrome/Firefox/Edge]
- Wallet: [Petra/Martian/Fewcha]
- Network: [Testnet/Mainnet]
- Device: [Desktop/Mobile]

**Description**:
[Describe what happened and what you expected]

**Steps to Reproduce**:

1. [First step]
2. [Second step]
3. [Third step]

**Error Messages**:
```

[Error message here]

```

**Transaction Hash** (if applicable):
[Hash here]

**Screenshots**:
[Attach screenshots]

**Additional Context**:
[Any other relevant information]
```

## 🚀 Prevention Tips

### Best Practices

1. **Regular Updates**: Keep wallet and browser updated
2. **Backup Recovery**: Secure wallet recovery phrases
3. **Monitor Balances**: Regularly check APT balances
4. **Test Small**: Start with small transactions

### Security Measures

1. **Private Keys**: Never share private keys or recovery phrases
2. **Phishing Awareness**: Only use official URLs
3. **Two-Factor**: Enable 2FA where available
4. **Secure Network**: Avoid public WiFi for trading

### Maintenance

1. **Clear Cache**: Regularly clear browser cache
2. **Update Software**: Keep all software updated
3. **Monitor Usage**: Track gas usage and transaction costs
4. **Backup Data**: Backup important transaction records

---

**If you can't resolve an issue using this guide, please contact our support team with the information requested above. We're here to help!** 🚀
