'use client';

import React, { useState } from 'react';
import { useTransactionHistory, TransactionDetails } from '@/hooks/useTransactionHistory';
import { Button } from '@/components/ui/button';
import { RefreshCw, ExternalLink, Filter, Download } from 'lucide-react';
import { format } from 'date-fns';

interface TransactionHistoryTableProps {
  limit?: number;
  showStats?: boolean;
  showFilters?: boolean;
}

export function TransactionHistoryTable({
  limit = 50,
  showStats = true,
  showFilters = true,
}: TransactionHistoryTableProps) {
  const { transactions, isLoading, error, stats, refreshHistory } = useTransactionHistory(limit);

  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Filter transactions based on selected filters
  const filteredTransactions = React.useMemo(() => {
    let filtered = transactions;

    if (selectedType !== 'all') {
      filtered = filtered.filter((tx) => tx.type === selectedType);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter((tx) => tx.status === selectedStatus);
    }

    return filtered;
  }, [transactions, selectedType, selectedStatus]);

  const getStatusColor = (status: TransactionDetails['status']) => {
    switch (status) {
      case 'success':
        return 'text-green-400';
      case 'failed':
        return 'text-red-400';
      case 'pending':
        return 'text-yellow-400';
      default:
        return 'text-zinc-400';
    }
  };

  const getTypeLabel = (type: TransactionDetails['type']) => {
    switch (type) {
      case 'create_option':
        return 'Create Option';
      case 'cancel_option':
        return 'Cancel Option';
      case 'exercise_option':
        return 'Exercise Option';
      case 'create_series':
        return 'Create Series';
      case 'init_account':
        return 'Initialize Account';
      default:
        return type;
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return format(new Date(timestamp * 1000), 'MMM dd, yyyy HH:mm:ss');
  };

  const openInExplorer = (txHash: string) => {
    window.open(`https://explorer.aptoslabs.com/txn/${txHash}?network=testnet`, '_blank');
  };

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-400 mb-4">Failed to load transaction history</div>
        <div className="text-sm text-zinc-500 mb-4">{error}</div>
        <Button onClick={refreshHistory} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-zinc-900/50 p-4 rounded-lg">
            <div className="text-sm text-zinc-400">Total Transactions</div>
            <div className="text-2xl font-bold">{stats.totalTransactions}</div>
          </div>
          <div className="bg-zinc-900/50 p-4 rounded-lg">
            <div className="text-sm text-zinc-400">Success Rate</div>
            <div className="text-2xl font-bold text-green-400">
              {stats.totalTransactions > 0
                ? `${Math.round((stats.successfulTransactions / stats.totalTransactions) * 100)}%`
                : '0%'}
            </div>
          </div>
          <div className="bg-zinc-900/50 p-4 rounded-lg">
            <div className="text-sm text-zinc-400">Total Gas Spent</div>
            <div className="text-2xl font-bold">{stats.totalGasSpent.toFixed(4)} APT</div>
          </div>
          <div className="bg-zinc-900/50 p-4 rounded-lg">
            <div className="text-sm text-zinc-400">Total Volume</div>
            <div className="text-2xl font-bold">${stats.totalVolume.toFixed(2)}</div>
          </div>
        </div>
      )}

      {showFilters && (
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-zinc-400" />
            <span className="text-sm text-zinc-400">Filters:</span>
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 rounded px-3 py-1 text-sm"
          >
            <option value="all">All Types</option>
            <option value="create_option">Create Option</option>
            <option value="cancel_option">Cancel Option</option>
            <option value="exercise_option">Exercise Option</option>
            <option value="create_series">Create Series</option>
            <option value="init_account">Initialize Account</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 rounded px-3 py-1 text-sm"
          >
            <option value="all">All Status</option>
            <option value="success">Successful</option>
            <option value="failed">Failed</option>
            <option value="pending">Pending</option>
          </select>

          <Button onClick={refreshHistory} variant="outline" size="sm" disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      )}

      <div className="bg-zinc-900/50 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-800/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Gas Fee
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-700">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-zinc-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading transaction history...
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-zinc-400">
                    No transactions found
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.txHash} className="hover:bg-zinc-800/30">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{getTypeLabel(tx.type)}</div>
                      {tx.functionName && (
                        <div className="text-xs text-zinc-500">{tx.functionName}</div>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <div className="text-sm text-zinc-300">
                        {tx.type === 'create_option' && (
                          <div>
                            {tx.quantity}x {tx.optionType?.toUpperCase()} ${tx.strikePrice}
                            <br />
                            <span className="text-xs text-zinc-500">
                              Expires:{' '}
                              {tx.expirySeconds ? formatTimestamp(tx.expirySeconds) : 'N/A'}
                            </span>
                          </div>
                        )}
                        {tx.type === 'exercise_option' && (
                          <div>
                            Option ID: {tx.optionId}
                            <br />
                            <span className="text-xs text-zinc-500">
                              Settlement: ${tx.settlementPrice}
                            </span>
                          </div>
                        )}
                        {tx.type === 'cancel_option' && <div>Option ID: {tx.optionId}</div>}
                        {tx.type === 'create_series' && (
                          <div>
                            {tx.optionType?.toUpperCase()} ${tx.strikePrice}
                            <br />
                            <span className="text-xs text-zinc-500">
                              Expires:{' '}
                              {tx.expirySeconds ? formatTimestamp(tx.expirySeconds) : 'N/A'}
                            </span>
                          </div>
                        )}
                        {tx.type === 'init_account' && <div>Account initialization</div>}
                      </div>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(tx.status)} bg-current/10`}
                      >
                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                      </span>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap text-sm text-zinc-300">
                      {tx.gasFee || '-'}
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap text-sm text-zinc-400">
                      {formatTimestamp(tx.timestamp)}
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <Button
                        onClick={() => openInExplorer(tx.txHash)}
                        variant="ghost"
                        size="sm"
                        className="text-zinc-400 hover:text-white"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {filteredTransactions.length > 0 && (
        <div className="flex justify-between items-center text-sm text-zinc-400">
          <div>
            Showing {filteredTransactions.length} of {transactions.length} transactions
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
