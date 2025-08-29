'use client';

import React from 'react';
import { TransactionHistoryTable } from '@/components/transactions/TransactionHistoryTable';

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Transaction History</h1>
        <p className="text-zinc-400 mt-2">View all your trading activity and transaction details</p>
      </div>

      <TransactionHistoryTable showStats={true} showFilters={true} />
    </div>
  );
}
