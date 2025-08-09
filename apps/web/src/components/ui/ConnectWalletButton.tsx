'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useWallet } from '@aptos-labs/wallet-adapter-react';

export function ConnectWalletButton() {
  const { connect, disconnect, connected, account, wallets } = useWallet();

  const onClick = async () => {
    if (connected) return disconnect();
    try {
      const preferred = wallets.find((w) => w.name === 'Petra') ?? wallets[0];
      if (!preferred) throw new Error('No wallet available');
      await connect(preferred.name as unknown as string);
    } catch (e) {
      console.error(e);
    }
  };

  const label = connected
    ? `${String(account?.address).slice(0, 6)}…${String(account?.address).slice(-4)}`
    : 'Connect Wallet';

  return (
    <Button variant={connected ? 'outline' : 'default'} onClick={onClick} className="min-w-32">
      {label}
    </Button>
  );
}
