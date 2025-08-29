'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useOptionsContract } from '@/hooks/useOptionsContract';
import { OptionType } from '@/lib/shared-types';

export function OrderTicket() {
  const { createOption, isLoading, connected } = useOptionsContract();

  const [strikePrice, setStrikePrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [optionType, setOptionType] = useState<OptionType>('call');
  const [expiryDays, setExpiryDays] = useState('30');

  const handleSubmit = async () => {
    if (!strikePrice || !quantity) return;

    const strike = parseFloat(strikePrice);
    const qty = parseInt(quantity);
    const expirySeconds = Math.floor(Date.now() / 1000) + parseInt(expiryDays) * 24 * 60 * 60;

    await createOption(strike, expirySeconds, optionType, qty);

    // Reset form
    setStrikePrice('');
    setQuantity('');
  };

  if (!connected) {
    return (
      <div className="flex h-[420px] flex-col gap-3 rounded-lg border border-white/10 bg-black/30 p-3">
        <div className="text-sm font-medium text-zinc-200">Order Ticket</div>
        <div className="flex-1 flex items-center justify-center text-zinc-500">
          Connect wallet to place orders
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[420px] flex-col gap-3 rounded-lg border border-white/10 bg-black/30 p-3">
      <div className="text-sm font-medium text-zinc-200">Create Option</div>

      <div className="flex flex-col gap-3 flex-1">
        {/* Option Type */}
        <div>
          <label className="text-xs text-zinc-400 mb-1 block">Type</label>
          <Select value={optionType} onValueChange={(value: OptionType) => setOptionType(value)}>
            <SelectTrigger className="bg-black/50 border-white/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="call">Call</SelectItem>
              <SelectItem value="put">Put</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Strike Price */}
        <div>
          <label className="text-xs text-zinc-400 mb-1 block">Strike Price</label>
          <Input
            type="number"
            placeholder="100"
            value={strikePrice}
            onChange={(e) => setStrikePrice(e.target.value)}
            className="bg-black/50 border-white/10"
          />
        </div>

        {/* Quantity */}
        <div>
          <label className="text-xs text-zinc-400 mb-1 block">Quantity</label>
          <Input
            type="number"
            placeholder="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="bg-black/50 border-white/10"
          />
        </div>

        {/* Expiry */}
        <div>
          <label className="text-xs text-zinc-400 mb-1 block">Expiry (days)</label>
          <Select value={expiryDays} onValueChange={setExpiryDays}>
            <SelectTrigger className="bg-black/50 border-white/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">1 Week</SelectItem>
              <SelectItem value="30">1 Month</SelectItem>
              <SelectItem value="90">3 Months</SelectItem>
              <SelectItem value="180">6 Months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={handleSubmit}
          disabled={isLoading || !strikePrice || !quantity}
        >
          {isLoading ? 'Creating...' : 'Create Option'}
        </Button>
      </div>
    </div>
  );
}
