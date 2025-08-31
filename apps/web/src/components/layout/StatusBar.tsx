'use client';

import React from 'react';
import { AptPriceTicker } from '@/components/markets/AptPriceTicker';
import { usePriceWebSocket, useOrderBookWebSocket, useTradesWebSocket } from '@/hooks/useWebSocket';

export function StatusBar() {
  const { connectionStatus: priceStatus } = usePriceWebSocket();
  const { connectionStatus: orderBookStatus } = useOrderBookWebSocket('APT/USD');
  const { connectionStatus: tradesStatus } = useTradesWebSocket('APT/USD');

  // Overall connection status
  const overallStatus = React.useMemo(() => {
    const statuses = [priceStatus, orderBookStatus, tradesStatus];
    if (statuses.every((s) => s === 'connected')) return 'connected';
    if (statuses.some((s) => s === 'error')) return 'error';
    if (statuses.some((s) => s === 'connecting')) return 'connecting';
    return 'disconnected';
  }, [priceStatus, orderBookStatus, tradesStatus]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-400';
      case 'connecting':
        return 'bg-yellow-400 animate-pulse';
      case 'error':
        return 'bg-red-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting';
      case 'error':
        return 'Error';
      case 'disconnected':
        return 'Disconnected';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="sticky bottom-0 z-20 flex h-10 w-full items-center gap-4 border-t border-zinc-800/50 bg-zinc-900/80 px-4 text-xs backdrop-blur-lg">
      <div className="flex items-center gap-2">
        <div className="h-1.5 w-1.5 rounded-full bg-amber-400"></div>
        <span className="text-zinc-400 font-medium">Testnet</span>
      </div>

      <div className="flex items-center gap-2 ml-4">
        <div className={`h-1.5 w-1.5 rounded-full ${getStatusColor(overallStatus)}`}></div>
        <span className="text-zinc-400 font-medium">{getStatusText(overallStatus)}</span>
      </div>

      {/* WebSocket connection details */}
      <div className="flex items-center gap-6 ml-4">
        <div className="flex items-center gap-1">
          <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(priceStatus)}`}></div>
          <span className="text-zinc-500 text-[10px]">Prices</span>
        </div>
        <div className="flex items-center gap-1">
          <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(orderBookStatus)}`}></div>
          <span className="text-zinc-500 text-[10px]">OrderBook</span>
        </div>
        <div className="flex items-center gap-1">
          <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(tradesStatus)}`}></div>
          <span className="text-zinc-500 text-[10px]">Trades</span>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-4">
        <div className="text-zinc-400">
          <span className="font-medium">Latency:</span>{' '}
          <span className="text-green-400">{overallStatus === 'connected' ? '23ms' : '--ms'}</span>
        </div>
        <div className="w-64">
          <AptPriceTicker />
        </div>
      </div>
    </div>
  );
}
