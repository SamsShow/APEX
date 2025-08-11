'use client';

import React, { useMemo, useState } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
import { Button } from '@/components/ui/button';
import { ConnectWalletButton } from '@/components/ui/ConnectWalletButton';

export default function TestPage() {
  const { account, connected, signAndSubmitTransaction } = useWallet();
  const [moduleAddress, setModuleAddress] = useState<string>('');
  const [strike, setStrike] = useState<string>('100');
  const [expiry, setExpiry] = useState<string>(`${Math.floor(Date.now() / 1000) + 3600}`);
  const [optionType, setOptionType] = useState<string>('0'); // 0 = Call, 1 = Put
  const [quantity, setQuantity] = useState<string>('1');
  const [optionId, setOptionId] = useState<string>('0');
  const [currentTime, setCurrentTime] = useState<string>(`${Math.floor(Date.now() / 1000)}`);
  const [settlementPrice, setSettlementPrice] = useState<string>('150');
  const [status, setStatus] = useState<string>('');

  const aptos = useMemo(() => new Aptos(new AptosConfig({ network: Network.TESTNET })), []);

  const getErrorMessage = (e: unknown): string => {
    if (typeof e === 'object' && e !== null && 'message' in e) {
      const msg = (e as { message?: unknown }).message;
      if (typeof msg === 'string') return msg;
      try {
        return JSON.stringify(msg);
      } catch {
        return String(msg);
      }
    }
    return String(e);
  };

  const fn = (name: string) => {
    const addr = (moduleAddress || '').trim();
    if (!addr) throw new Error('Enter the published module address (e.g., 0x... of Apex)');
    return `${addr}::option_contract::${name}`;
  };

  const waitTx = async (hash: string) => {
    setStatus(`Waiting for transaction ${hash} ...`);
    await aptos.waitForTransaction({ transactionHash: hash });
    setStatus(`Confirmed: ${hash}`);
  };

  const onInit = async () => {
    if (!connected || !account) return;
    try {
      setStatus('Submitting init_account ...');
      const payload = {
        sender: account.address,
        data: { function: fn('init_account'), functionArguments: [] },
      } satisfies Parameters<typeof signAndSubmitTransaction>[0];
      const res = await signAndSubmitTransaction(payload);
      await waitTx(res.hash);
    } catch (e: unknown) {
      setStatus(`Error: ${getErrorMessage(e)}`);
    }
  };

  const onCreate = async () => {
    if (!connected || !account) return;
    try {
      setStatus('Submitting create_option ...');
      const payload = {
        sender: account.address,
        data: {
          function: fn('create_option'),
          functionArguments: [Number(strike), Number(expiry), Number(optionType), Number(quantity)],
        },
      } satisfies Parameters<typeof signAndSubmitTransaction>[0];
      const res = await signAndSubmitTransaction(payload);
      await waitTx(res.hash);
    } catch (e: unknown) {
      setStatus(`Error: ${getErrorMessage(e)}`);
    }
  };

  const onCancel = async () => {
    if (!connected || !account) return;
    try {
      setStatus('Submitting cancel_option ...');
      const payload = {
        sender: account.address,
        data: {
          function: fn('cancel_option'),
          functionArguments: [Number(optionId)],
        },
      } satisfies Parameters<typeof signAndSubmitTransaction>[0];
      const res = await signAndSubmitTransaction(payload);
      await waitTx(res.hash);
    } catch (e: unknown) {
      setStatus(`Error: ${getErrorMessage(e)}`);
    }
  };

  const onExercise = async () => {
    if (!connected || !account) return;
    try {
      setStatus('Submitting exercise_option ...');
      const payload = {
        sender: account.address,
        data: {
          function: fn('exercise_option'),
          functionArguments: [Number(optionId), Number(currentTime), Number(settlementPrice)],
        },
      } satisfies Parameters<typeof signAndSubmitTransaction>[0];
      const res = await signAndSubmitTransaction(payload);
      await waitTx(res.hash);
    } catch (e: unknown) {
      setStatus(`Error: ${getErrorMessage(e)}`);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">OptionContract Tester</h1>
        <ConnectWalletButton />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Module Address (publisher)</label>
        <input
          value={moduleAddress}
          onChange={(e) => setModuleAddress(e.target.value)}
          placeholder="0x... (address where Apex::option_contract is published)"
          className="w-full rounded-md border border-gray-300 bg-white/5 p-2"
        />
        <p className="text-xs text-gray-500">
          Example: use your account address where you published the module. Function path is{' '}
          <code>::option_contract</code>.
        </p>
      </div>

      <div className="flex gap-3">
        <Button onClick={onInit} disabled={!connected}>
          Init Account
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Strike Price (u64)</label>
          <input
            value={strike}
            onChange={(e) => setStrike(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white/5 p-2"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Expiry (unix seconds, u64)</label>
          <input
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white/5 p-2"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Option Type</label>
          <select
            value={optionType}
            onChange={(e) => setOptionType(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white/5 p-2"
          >
            <option value="0">Call (0)</option>
            <option value="1">Put (1)</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Quantity (u64)</label>
          <input
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white/5 p-2"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button onClick={onCreate} disabled={!connected}>
          Create Option
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Option ID (u64)</label>
          <input
            value={optionId}
            onChange={(e) => setOptionId(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white/5 p-2"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Current Time (u64)</label>
          <input
            value={currentTime}
            onChange={(e) => setCurrentTime(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white/5 p-2"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Settlement Price (u64)</label>
          <input
            value={settlementPrice}
            onChange={(e) => setSettlementPrice(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white/5 p-2"
          />
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Button onClick={onCancel} variant="secondary" disabled={!connected}>
          Cancel Option
        </Button>
        <Button onClick={onExercise} variant="secondary" disabled={!connected}>
          Exercise Option
        </Button>
      </div>

      <div className="rounded-md border border-gray-200 bg-white/5 p-3 text-sm">
        <div className="font-mono break-all">{status || 'Idle'}</div>
      </div>
    </div>
  );
}
