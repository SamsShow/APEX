'use client';

import React, { createContext, useContext, useState } from 'react';
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';
import { Network } from '@aptos-labs/ts-sdk';
// Wallet adapters are configured automatically in newer versions
// import { PetraWallet } from 'petra-plugin-wallet-adapter';
// import { MartianWallet } from '@martianwallet/aptos-wallet-adapter';
// import { PontemWallet } from '@pontem/wallet-adapter-plugin';
// import { TrustWallet } from '@trustwallet/aptos-wallet-adapter';
// import { FewchaWallet } from 'fewcha-plugin-wallet-adapter';

// Wallets are now configured automatically by the wallet adapter
// const wallets = [
//   new PetraWallet(),
//   new MartianWallet(),
//   new PontemWallet(),
//   new TrustWallet(),
//   new FewchaWallet(),
// ];

export type NetworkType = 'mainnet' | 'testnet' | 'devnet';

interface WalletContextType {
  network: NetworkType;
  setNetwork: (network: NetworkType) => void;
  isNetworkSwitching: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function useWalletContext() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWalletContext must be used within a WalletProvider');
  }
  return context;
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [network, setNetwork] = useState<NetworkType>('testnet');
  const [isNetworkSwitching, setIsNetworkSwitching] = useState(false);

  const handleNetworkChange = (newNetwork: NetworkType) => {
    setIsNetworkSwitching(true);
    setNetwork(newNetwork);
    // In a real implementation, you'd trigger a wallet network switch here
    setTimeout(() => setIsNetworkSwitching(false), 1000);
  };

  const getNetworkConfig = (network: NetworkType) => {
    switch (network) {
      case 'mainnet':
        return Network.MAINNET;
      case 'testnet':
        return Network.TESTNET;
      case 'devnet':
        return Network.DEVNET;
      default:
        return Network.TESTNET;
    }
  };

  return (
    <WalletContext.Provider
      value={{ network, setNetwork: handleNetworkChange, isNetworkSwitching }}
    >
      <AptosWalletAdapterProvider
        autoConnect={true}
        dappConfig={{
          network: getNetworkConfig(network),
          aptosConnectDappId: 'apex-trading-platform',
          mizuwallet: {
            manifestURL: 'https://assets.mz.xyz/manifest.json',
          },
        }}
      >
        {children}
      </AptosWalletAdapterProvider>
    </WalletContext.Provider>
  );
}
