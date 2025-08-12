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
  // series creation
  const [seriesStrike, setSeriesStrike] = useState<string>('100');
  const [seriesExpiry, setSeriesExpiry] = useState<string>(
    `${Math.floor(Date.now() / 1000) + 7200}`,
  );
  const [seriesType, setSeriesType] = useState<string>('0');
  // current time now sourced on-chain in contract
  const [settlementPrice, setSettlementPrice] = useState<string>('150');
  const [status, setStatus] = useState<string>('');

  const aptos = useMemo(() => new Aptos(new AptosConfig({ network: Network.TESTNET })), []);

  const findOptionsResourceType = async (owner: string): Promise<string | null> => {
    try {
      const list = (await aptos.getAccountResources({
        accountAddress: String(owner),
      })) as unknown as Array<{
        type: string;
      }>;
      const hit = list.find((r) => r.type.endsWith('::option_contract::Options'));
      return hit?.type ?? null;
    } catch {
      return null;
    }
  };

  // Recursively walk unknown resource shapes to collect numeric `id` fields
  const collectNumericIds = (node: unknown, acc: number[] = []): number[] => {
    if (node == null) return acc;
    if (Array.isArray(node)) {
      for (const item of node) collectNumericIds(item, acc);
      return acc;
    }
    if (typeof node === 'object') {
      const obj = node as Record<string, unknown>;
      for (const [key, value] of Object.entries(obj)) {
        if (key.toLowerCase() === 'id') {
          if (typeof value === 'number' && Number.isFinite(value)) {
            acc.push(value);
          } else if (typeof value === 'string') {
            const m = value.match(/^\d+$/);
            if (m) {
              const n = Number(value);
              if (Number.isFinite(n)) acc.push(n);
            }
          }
        }
        collectNumericIds(value, acc);
      }
      return acc;
    }
    return acc;
  };

  const getExerciseParamCount = async (): Promise<number | null> => {
    try {
      const addr = (moduleAddress || '').trim();
      if (!addr) return null;
      const mod = (await aptos.getAccountModule({
        accountAddress: addr,
        moduleName: 'option_contract',
      })) as unknown as {
        abi?: { exposed_functions?: Array<{ name: string; is_entry: boolean; params: string[] }> };
      };
      const funcs = mod.abi?.exposed_functions ?? [];
      const ex = funcs.find((f) => f.name === 'exercise_option' && f.is_entry);
      if (!ex) return null;
      const params = ex.params ?? [];
      const first = params[0] ?? '';
      const hasSigner = typeof first === 'string' && first.includes('signer'); // handles 'signer' or '&signer'
      const userParamCount = hasSigner ? Math.max(0, params.length - 1) : params.length;
      return userParamCount;
    } catch {
      return null;
    }
  };

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

  const viewCall = async <T,>(
    func: `${string}::${string}::${string}`,
    args: (string | number | boolean)[],
  ): Promise<T> => {
    const res = (await aptos.view({
      payload: { function: func, functionArguments: args },
    })) as unknown as T;
    return res;
  };

  const fn = (name: string) => {
    const addr = (moduleAddress || '').trim();
    if (!addr) throw new Error('Enter the published module address (e.g., 0x... of Apex)');
    return `${addr}::option_contract::${name}` as `${string}::${string}::${string}`;
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

  const onCreateSeries = async () => {
    if (!connected || !account) return;
    try {
      setStatus('Submitting create_series ...');
      const payload = {
        sender: account.address,
        data: {
          function: fn('create_series'),
          typeArguments: [],
          functionArguments: [Number(seriesStrike), Number(seriesExpiry), Number(seriesType)],
        },
      } satisfies Parameters<typeof signAndSubmitTransaction>[0];
      const res = await signAndSubmitTransaction(payload);
      await waitTx(res.hash);
    } catch (e: unknown) {
      setStatus(`Error: ${getErrorMessage(e)}`);
    }
  };

  const onGetSeriesCount = async () => {
    try {
      const addr = (moduleAddress || '').trim();
      if (!addr) throw new Error('Enter module address');
      const out = (
        await viewCall<[string | number]>(
          `${addr}::option_contract::get_series_count` as `${string}::${string}::${string}`,
          [addr],
        )
      )[0];
      setStatus(`Series count: ${String(out)}`);
    } catch (e) {
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
      // After creation succeeds, try to auto-load the freshly created id
      await onLoadLatestId();
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
      setStatus('Submitting exercise ...');
      const canonical = fn('exercise');
      const legacy = fn('exercise_option');
      const idNum = Number(optionId);
      const priceNum = Number(settlementPrice);

      // Try canonical first
      try {
        const payload = {
          sender: account.address,
          data: { function: canonical, typeArguments: [], functionArguments: [idNum, priceNum] },
        } satisfies Parameters<typeof signAndSubmitTransaction>[0];
        const res = await signAndSubmitTransaction(payload);
        await waitTx(res.hash);
        return;
      } catch (e) {
        // Fallback to legacy permutations
        const msg = getErrorMessage(e);
        setStatus(`Canonical exercise failed: ${msg}; falling back`);
      }

      const count = await getExerciseParamCount();
      setStatus(`exercise_option: detected params=${String(count ?? 'unknown')} (will try 3→2→4)`);
      const nowSecs = Math.floor(Date.now() / 1000);
      const orders: Array<number[]> = [
        [idNum, nowSecs, priceNum],
        [idNum, priceNum],
        [idNum, priceNum, 1, 0],
      ];
      for (const args of orders) {
        try {
          const res = await signAndSubmitTransaction({
            sender: account.address,
            data: { function: legacy, typeArguments: [], functionArguments: args },
          });
          await waitTx(res.hash);
          return;
        } catch (e) {
          setStatus(`Legacy attempt ${JSON.stringify(args)} failed: ${getErrorMessage(e)}`);
        }
      }
      throw new Error('exercise failed for all signatures');
    } catch (e: unknown) {
      setStatus(`Error: ${getErrorMessage(e)}`);
    }
  };

  const onLoadPortfolioLegs = async () => {
    try {
      if (!account) return;
      const addr = (moduleAddress || '').trim();
      if (!addr) throw new Error('Enter module address');
      const legs = (await viewCall<unknown[]>(
        `${addr}::option_contract::get_portfolio_legs` as `${string}::${string}::${string}`,
        [String(account.address)],
      )) as unknown as (string | number)[];
      setStatus(`Portfolio legs: ${JSON.stringify(legs)}`);
    } catch (e) {
      setStatus(`Error: ${getErrorMessage(e)}`);
    }
  };

  const onLoadLatestId = async () => {
    try {
      if (!account) return;
      const addr = (moduleAddress || '').trim();
      if (!addr) throw new Error('Enter the published module address');
      setStatus('Loading latest option id ...');
      let count = 0;
      try {
        const result = (await aptos.view({
          payload: {
            function:
              `${addr}::option_contract::get_num_options` as `${string}::${string}::${string}`,
            functionArguments: [account.address],
          },
        })) as unknown as [string | number];
        const n = Number(result?.[0] ?? 0);
        if (Number.isFinite(n) && n >= 0) count = n;
        else throw new Error('bad view');
      } catch {
        // Fallback A: detect exact Options type and read next_id/items
        try {
          const detectedType =
            (await findOptionsResourceType(String(account.address))) ??
            (`${addr}::option_contract::Options` as `${string}::${string}::${string}`);
          const resource = (await aptos.getAccountResource({
            accountAddress: String(account.address),
            resourceType: detectedType as `${string}::${string}::${string}`,
          })) as unknown as { data?: { next_id?: string | number; items?: unknown[] } };
          const nextId = Number(resource?.data?.next_id ?? 0);
          const itemsLen = Array.isArray(resource?.data?.items)
            ? (resource!.data!.items as unknown[]).length
            : 0;
          count = Number.isFinite(nextId) && nextId > 0 ? nextId : itemsLen;
        } catch {
          // Fallback B: scan all resources under USER account for any numeric `id`s (StrategyPortfolio, etc.)
          const modulePrefix = `${addr}::option_contract`;
          const scan = async (who: string): Promise<number | null> => {
            const all = (await aptos.getAccountResources({
              accountAddress: who,
            })) as unknown as Array<{ type: string; data?: unknown }>;
            const ids: number[] = [];
            for (const r of all) {
              if (!r.type.startsWith(modulePrefix)) continue;
              collectNumericIds(r.data, ids);
            }
            if (ids.length > 0) {
              const maxId = ids.reduce((m, v) => (v > m ? v : m), ids[0]);
              return maxId;
            }
            return null;
          };

          let latest = await scan(String(account.address));
          if (latest == null) {
            // Fallback C: some deployments might store under module address. Try there too.
            latest = await scan(addr);
          }
          if (latest != null) {
            setOptionId(String(latest));
            setStatus(`Found option id in resources: ${String(latest)}`);
            return;
          }
          count = 0;
        }
      }
      if (Number.isNaN(count)) throw new Error('Could not determine latest id');
      if (count === 0) {
        setStatus('No options found for your address. Create one first.');
        return;
      }
      setOptionId(String(count - 1));
      setStatus(`Loaded latest option id: ${String(count - 1)} (total ${count})`);
    } catch (e) {
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

      {/* Series creation */}
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 font-medium opacity-80">Series</div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Series Strike (u64)</label>
          <input
            value={seriesStrike}
            onChange={(e) => setSeriesStrike(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white/5 p-2"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Series Expiry (u64)</label>
          <input
            value={seriesExpiry}
            onChange={(e) => setSeriesExpiry(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white/5 p-2"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Series Type</label>
          <select
            value={seriesType}
            onChange={(e) => setSeriesType(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white/5 p-2"
          >
            <option value="0">Call (0)</option>
            <option value="1">Put (1)</option>
          </select>
        </div>
        <div className="flex items-end gap-3">
          <Button onClick={onCreateSeries} disabled={!connected}>
            Create Series
          </Button>
          <Button onClick={onGetSeriesCount} variant="outline" disabled={!connected}>
            Get Series Count
          </Button>
        </div>
      </div>

      {/* Option creation */}
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
        <Button onClick={onLoadLatestId} variant="outline" disabled={!connected}>
          Load Latest ID
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
        {/* current time removed; contract uses on-chain timestamp */}
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
        <Button onClick={onCancel} variant="outline" disabled={!connected}>
          Cancel Option
        </Button>
        <Button onClick={onExercise} variant="outline" disabled={!connected}>
          Exercise Option
        </Button>
        <Button onClick={onLoadPortfolioLegs} variant="outline" disabled={!connected}>
          Load Portfolio Legs
        </Button>
      </div>

      <div className="rounded-md border border-gray-200 bg-white/5 p-3 text-sm">
        <div className="font-mono break-all">{status || 'Idle'}</div>
      </div>
    </div>
  );
}
