'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Wallet, ChevronDown, Copy, ExternalLink, LogOut } from 'lucide-react';
import { useWalletContext } from '@/components/providers/WalletProvider';

const walletIcons: Record<string, string> = {
  Petra: '🟣',
  Martian: '🔴',
  Pontem: '🟠',
  'Trust Wallet': '🟢',
  Fewcha: '🔵',
  'Nightly Wallet': '🌙',
  'MSafe Wallet': '🛡️',
};

export function ConnectWalletButton() {
  const { connect, disconnect, connected, account, wallets, isLoading } = useWallet();
  const { network, setNetwork, isNetworkSwitching } = useWalletContext();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Debug wallet connection state
  React.useEffect(() => {
    console.log('Wallet connection state:', { connected, account, wallets });
  }, [connected, account, wallets]);

  const handleConnect = async (walletName: string) => {
    try {
      console.log(`Attempting to connect to ${walletName}...`);
      await connect(walletName);
      console.log(`Connected to ${walletName} successfully`);
      setIsOpen(false);
    } catch (e) {
      console.error('Failed to connect wallet:', e);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      setIsOpen(false);
    } catch (e) {
      console.error('Failed to disconnect wallet:', e);
    }
  };

  const copyAddress = async () => {
    if (account?.address) {
      const addressString =
        typeof account.address === 'string' ? account.address : account.address.toString();
      await navigator.clipboard.writeText(addressString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const truncateAddress = (address: string | { toString(): string } | undefined) => {
    if (!address) {
      return '0x0000...0000';
    }
    const addressString = typeof address === 'string' ? address : address.toString();
    if (addressString.length < 10) {
      return addressString;
    }
    return `${addressString.slice(0, 6)}...${addressString.slice(-4)}`;
  };

  // Make sure we have both connected state and account object
  if (connected && account) {
    console.log('Rendering connected wallet UI with account:', account);
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="min-w-32 gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            {truncateAddress(account.address)}
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Wallet Connected
            </DialogTitle>
            <DialogDescription>
              Manage your wallet connection and view account details.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Account Info */}
            <div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-zinc-400">Address</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={copyAddress} className="h-6 w-6 p-0">
                    <Copy className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      account?.address
                        ? window.open(
                            `https://explorer.aptoslabs.com/account/${typeof account.address === 'string' ? account.address : account.address.toString()}?network=testnet`,
                            '_blank',
                          )
                        : null
                    }
                    className="h-6 w-6 p-0"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <div className="font-mono text-sm text-zinc-100">
                {account.address
                  ? typeof account.address === 'string'
                    ? account.address
                    : account.address.toString()
                  : 'No address available'}
              </div>
              {copied && <div className="text-xs text-green-400 mt-1">Address copied!</div>}
            </div>

            {/* Network Info */}
            <div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-zinc-400">Network</span>
                <div className="flex gap-1">
                  {(['testnet', 'mainnet', 'devnet'] as const).map((net) => (
                    <button
                      key={net}
                      onClick={() => setNetwork(net)}
                      disabled={isNetworkSwitching}
                      className={`px-2 py-1 text-xs rounded ${
                        network === net
                          ? 'bg-blue-600 text-white'
                          : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                      }`}
                    >
                      {net}
                    </button>
                  ))}
                </div>
              </div>
              <div className="text-sm text-zinc-100 capitalize">
                Aptos {network}
                {isNetworkSwitching && <span className="ml-2 text-yellow-400">(Switching...)</span>}
              </div>
            </div>

            {/* Disconnect Button */}
            <Button
              onClick={handleDisconnect}
              variant="outline"
              className="w-full gap-2 text-red-400 border-red-400/20 hover:bg-red-400/10"
            >
              <LogOut className="w-4 h-4" />
              Disconnect Wallet
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="min-w-32 gap-2">
          <Wallet className="w-4 h-4" />
          Connect Wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Connect Your Wallet
          </DialogTitle>
          <DialogDescription>
            Choose a wallet to connect to Apex Trading Platform on Aptos.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {wallets.length > 0 ? (
            wallets.map((wallet) => (
              <Button
                key={wallet.name}
                onClick={() => handleConnect(wallet.name)}
                disabled={isLoading}
                variant="outline"
                className="w-full justify-start gap-3 h-12"
              >
                <div className="text-lg">{walletIcons[wallet.name] || '👛'}</div>
                <div className="text-left">
                  <div className="font-medium">{wallet.name}</div>
                  <div className="text-xs text-zinc-500">
                    {wallet.readyState === 'Installed'
                      ? 'Installed'
                      : wallet.readyState === 'NotDetected'
                        ? 'Not installed'
                        : 'Loading...'}
                  </div>
                </div>
              </Button>
            ))
          ) : (
            <div className="text-center py-8 text-zinc-500">
              No wallets detected. Please install a compatible Aptos wallet.
            </div>
          )}

          <div className="pt-4 border-t border-zinc-700">
            <div className="text-xs text-zinc-500 text-center">
              Don&apos;t have a wallet?{' '}
              <a
                href="https://petra.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300"
              >
                Get Petra Wallet&apos;
              </a>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
