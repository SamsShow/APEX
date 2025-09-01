'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface TransactionDetails {
  function: string;
  typeArguments: string[];
  functionArguments: unknown[];
  estimatedGas?: string;
  estimatedCost?: string;
}

interface TransactionDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  title: string;
  description: string;
  details: TransactionDetails;
  action: string;
}

export function TransactionDialog({
  isOpen,
  onConfirm,
  onCancel,
  isLoading = false,
  title,
  description,
  details,
  action,
}: TransactionDialogProps) {
  const formatFunctionName = (fullFunction: string) => {
    const parts = fullFunction.split('::');
    return parts[parts.length - 1];
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Transaction Details */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-400">Function:</span>
              <span className="text-sm text-zinc-200 font-mono">
                {formatFunctionName(details.function)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-400">Contract:</span>
              <span className="text-sm text-zinc-200 font-mono">
                {formatAddress(details.function.split('::')[0])}
              </span>
            </div>

            {details.functionArguments.length > 0 && (
              <div className="space-y-1">
                <span className="text-sm text-zinc-400">Arguments:</span>
                <div className="bg-zinc-800/50 rounded p-2 text-xs font-mono text-zinc-300">
                  {details.functionArguments.map((arg, index) => (
                    <div key={index}>
                      {typeof arg === 'object' ? JSON.stringify(arg) : String(arg)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cost Estimation */}
            <div className="border-t border-zinc-700 pt-3 space-y-2">
              {details.estimatedGas && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-400">Estimated Gas:</span>
                  <span className="text-sm text-zinc-200">{details.estimatedGas} APT</span>
                </div>
              )}

              {details.estimatedCost && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-400">Estimated Cost:</span>
                  <span className="text-sm text-zinc-200">{details.estimatedCost} APT</span>
                </div>
              )}
            </div>
          </div>

          {/* Warning */}
          <div className="bg-yellow-900/20 border border-yellow-700/50 rounded p-3">
            <div className="flex items-start space-x-2">
              <div className="text-yellow-400 text-sm">⚠️</div>
              <div className="text-xs text-yellow-200">
                Please review the transaction details carefully. Once confirmed, this action cannot
                be undone.
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 bg-zinc-800 border-zinc-600 text-zinc-300 hover:bg-zinc-700"
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing...
                </div>
              ) : (
                action
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
