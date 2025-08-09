'use client';

import React from 'react';
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';
import { Network } from '@aptos-labs/ts-sdk';

export function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <AptosWalletAdapterProvider autoConnect={false} dappConfig={{ network: Network.TESTNET }}>
      {children}
    </AptosWalletAdapterProvider>
  );
}
