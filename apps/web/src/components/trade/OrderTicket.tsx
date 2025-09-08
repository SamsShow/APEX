'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { HelpCircle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TransactionDialog } from '@/components/ui/transaction-dialog';
import { KeyboardShortcutsHelp } from '@/components/ui/keyboard-shortcuts-help';
import { useOptionsContract } from '@/hooks/useOptionsContract';
import { useNotifications } from '@/hooks/useNotifications';
import { usePerformanceMonitor, useDebounce } from '@/hooks/usePerformance';
import { useKeyboardShortcuts, createOrderTicketShortcuts } from '@/hooks/useKeyboardShortcuts';
import { OptionType, APEX_CONTRACT_CONFIG } from '@/lib/shared-types';
import {
  validateStrikePrice,
  validateQuantity,
  validateCreateOption,
  sanitizeNumber,
} from '@/lib/validation';

interface OrderTicketProps {
  onPositionUpdate?: () => void;
  onOrderUpdate?: () => void;
}

export const OrderTicket = React.memo<OrderTicketProps>(({ onPositionUpdate, onOrderUpdate }) => {
  // Performance monitoring
  usePerformanceMonitor('OrderTicket', process.env.NODE_ENV === 'development');

  const refreshData = React.useCallback(() => {
    if (onPositionUpdate) onPositionUpdate();
    if (onOrderUpdate) onOrderUpdate();
  }, [onPositionUpdate, onOrderUpdate]);

  const { createOption, isLoading, connected } = useOptionsContract(refreshData);
  const { notifySuccess, notifyError } = useNotifications();

  const [strikePrice, setStrikePrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [optionType, setOptionType] = useState<OptionType>('call');
  const [expiryDays, setExpiryDays] = useState('30');

  // Validation state
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isValidating, setIsValidating] = useState(false);

  // Transaction confirmation dialog state
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingTransaction, setPendingTransaction] = useState<{
    strike: number;
    qty: number;
    type: OptionType;
    expirySeconds: number;
  } | null>(null);

  // Keyboard shortcuts help state
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);

  // Validation functions with debouncing
  const validateForm = React.useCallback(async () => {
    setIsValidating(true);
    const errors: Record<string, string> = {};

    // Sanitize inputs
    const sanitizedStrike = sanitizeNumber(strikePrice);
    const sanitizedQuantity = sanitizeNumber(quantity);
    const sanitizedExpiryDays = sanitizeNumber(expiryDays);

    // Validate strike price
    if (sanitizedStrike === null) {
      errors.strikePrice = 'Strike price must be a valid number';
    } else {
      const strikeValidation = validateStrikePrice(sanitizedStrike);
      if (!strikeValidation.success) {
        errors.strikePrice = strikeValidation.errors?.[0] || 'Invalid strike price';
      }
    }

    // Validate quantity
    if (sanitizedQuantity === null) {
      errors.quantity = 'Quantity must be a valid number';
    } else {
      const quantityValidation = validateQuantity(sanitizedQuantity);
      if (!quantityValidation.success) {
        errors.quantity = quantityValidation.errors?.[0] || 'Invalid quantity';
      }
    }

    // Validate expiry days
    if (sanitizedExpiryDays === null) {
      errors.expiryDays = 'Expiry days must be a valid number';
    } else if (sanitizedExpiryDays <= 0) {
      errors.expiryDays = 'Expiry days must be greater than 0';
    } else if (sanitizedExpiryDays > 365) {
      errors.expiryDays = 'Expiry days cannot exceed 365';
    }

    setValidationErrors(errors);
    setIsValidating(false);
    return Object.keys(errors).length === 0;
  }, [strikePrice, quantity, expiryDays]);

  // Validate individual fields on blur with debouncing
  const validateField = React.useCallback(
    (fieldName: string, value: string) => {
      const errors = { ...validationErrors };

      switch (fieldName) {
        case 'strikePrice': {
          const sanitizedStrike = sanitizeNumber(value);
          if (sanitizedStrike === null) {
            errors.strikePrice = 'Strike price must be a valid number';
          } else {
            const strikeValidation = validateStrikePrice(sanitizedStrike);
            if (!strikeValidation.success) {
              errors.strikePrice = strikeValidation.errors?.[0] || 'Invalid strike price';
            } else {
              delete errors.strikePrice;
            }
          }
          break;
        }

        case 'quantity': {
          const sanitizedQuantity = sanitizeNumber(value);
          if (sanitizedQuantity === null) {
            errors.quantity = 'Quantity must be a valid number';
          } else {
            const quantityValidation = validateQuantity(sanitizedQuantity);
            if (!quantityValidation.success) {
              errors.quantity = quantityValidation.errors?.[0] || 'Invalid quantity';
            } else {
              delete errors.quantity;
            }
          }
          break;
        }
      }

      setValidationErrors(errors);
    },
    [validationErrors],
  );

  // Debounced validation for better performance
  const debouncedValidateField = useDebounce(validateField, 300);

  const handleSubmit = React.useCallback(async () => {
    if (!strikePrice || !quantity) return;

    // Validate form
    const isValid = await validateForm();
    if (!isValid) {
      notifyError('Please fix the validation errors');
      return;
    }

    const strike = sanitizeNumber(strikePrice)!;
    const qty = sanitizeNumber(quantity)!;
    const expirySeconds = Math.floor(Date.now() / 1000) + parseInt(expiryDays) * 24 * 60 * 60;

    // Final validation with complete data
    const optionData = {
      strikePrice: strike,
      expirySeconds,
      optionType,
      quantity: qty,
    };

    const finalValidation = validateCreateOption(optionData);
    if (!finalValidation.success) {
      notifyError('Validation failed: ' + (finalValidation.errors?.[0] || 'Unknown error'));
      return;
    }

    // Show confirmation dialog
    setPendingTransaction({
      strike,
      qty,
      type: optionType,
      expirySeconds,
    });
    setShowConfirmDialog(true);
  }, [
    quantity,
    expiryDays,
    optionType,
    validateForm,
    createOption,
    notifySuccess,
    notifyError,
    setStrikePrice,
    setQuantity,
    setShowConfirmDialog,
    setPendingTransaction,
  ]);

  const handleConfirmTransaction = async () => {
    if (!pendingTransaction) return;

    try {
      const { strike, qty, type, expirySeconds } = pendingTransaction;
      const result = await createOption(strike, expirySeconds, type, qty);

      if (result) {
        notifySuccess(
          'Option Created Successfully!',
          `${qty} ${type.toUpperCase()} option(s) created with strike $${strike}`,
          5000,
        );
      } else {
        notifyError('Transaction Failed', 'Failed to create option. Please try again.', 5000);
      }

      // Reset form and dialog state
      setStrikePrice('');
      setQuantity('');
      setShowConfirmDialog(false);
      setPendingTransaction(null);
    } catch (error) {
      console.error('Transaction error:', error);
      notifyError('Transaction Failed', 'An unexpected error occurred. Please try again.', 5000);
      setShowConfirmDialog(false);
      setPendingTransaction(null);
    }
  }, [
    strikePrice,
    quantity,
    expiryDays,
    optionType,
    validateForm,
    createOption,
    notifySuccess,
    notifyError,
    setStrikePrice,
    setQuantity,
    setShowConfirmDialog,
    setPendingTransaction,
  ]);

  const handleCancelTransaction = () => {
    setShowConfirmDialog(false);
    setPendingTransaction(null);
  };

  // Keyboard shortcuts actions
  const keyboardShortcutActions = React.useMemo(
    () => ({
      submitOrder: handleSubmit,
      clearForm: () => {
        setStrikePrice('');
        setQuantity('');
        setValidationErrors({});
        setPendingTransaction(null);
        setShowConfirmDialog(false);
      },
      setCallOption: () => setOptionType('call'),
      setPutOption: () => setOptionType('put'),
      setQuantity: (qty: number) => setQuantity(qty.toString()),
      setExpiry: (days: number) => setExpiryDays(days.toString()),
    }),
    [handleSubmit],
  );

  // Create keyboard shortcuts
  const orderTicketShortcuts = React.useMemo(
    () => createOrderTicketShortcuts(keyboardShortcutActions),
    [keyboardShortcutActions],
  );

  // Setup keyboard shortcuts hook
  useKeyboardShortcuts({
    shortcuts: orderTicketShortcuts,
    enabled: connected && !showConfirmDialog,
  });

  if (!connected) {
    return (
      <div className="flex h-[420px] flex-col gap-3 rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
        <div className="text-sm font-medium text-zinc-200">Order Ticket</div>

        {/* Connection Status */}
        <div className="flex items-center gap-2 p-2 rounded border border-red-500/20 bg-red-500/5">
          <div className="w-2 h-2 rounded-full bg-red-400"></div>
          <span className="text-xs text-zinc-300">Wallet Not Connected</span>
        </div>

        <div className="flex-1 flex items-center justify-center text-zinc-500">
          Connect wallet to place orders
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[420px] md:h-[480px] flex-col gap-3 rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 md:p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-zinc-200">Create Option</div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowShortcutsHelp(true)}
          className="text-zinc-400 hover:text-zinc-200 h-6 w-6 p-0"
          title="Keyboard shortcuts help"
        >
          <HelpCircle className="w-4 h-4" />
        </Button>
      </div>

      {/* Connection Status */}
      <div className="flex items-center gap-2 p-2 rounded border border-zinc-700 bg-zinc-800/30">
        <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400' : 'bg-red-400'}`}></div>
        <span className="text-xs text-zinc-300">
          {connected ? 'Live Contract Calls' : 'Connect Wallet Required'}
        </span>
        {connected && (
          <span className="text-xs text-zinc-500 ml-auto hidden sm:inline">Aptos Testnet</span>
        )}
      </div>

      <div className="flex flex-col gap-4 flex-1">
        {/* Option Type */}
        <div>
          <label className="text-xs text-zinc-400 mb-2 block">Type</label>
          <Select value={optionType} onValueChange={(value: OptionType) => setOptionType(value)}>
            <SelectTrigger className="bg-zinc-900/50 border-zinc-700 hover:bg-zinc-800/50 h-12 md:h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="call">📈 Call Option</SelectItem>
              <SelectItem value="put">📉 Put Option</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Strike Price */}
        <div>
          <label className="text-xs text-zinc-400 mb-2 block">Strike Price ($)</label>
          <Input
            type="number"
            placeholder="100"
            value={strikePrice}
            onChange={(e) => {
              setStrikePrice(e.target.value);
              // Clear validation error when user starts typing
              if (validationErrors.strikePrice) {
                setValidationErrors((prev) => ({ ...prev, strikePrice: '' }));
              }
            }}
            onBlur={(e) => debouncedValidateField('strikePrice', e.target.value)}
            className={`bg-zinc-900/50 border-zinc-700 hover:bg-zinc-800/50 focus:bg-zinc-800/50 h-12 md:h-10 text-base md:text-sm ${
              validationErrors.strikePrice ? 'border-red-500 focus:border-red-500' : ''
            }`}
            inputMode="decimal"
          />
          {validationErrors.strikePrice && (
            <p className="text-xs text-red-400 mt-1">{validationErrors.strikePrice}</p>
          )}
        </div>

        {/* Quantity */}
        <div>
          <label className="text-xs text-zinc-400 mb-2 block">Quantity</label>
          <Input
            type="number"
            placeholder="1"
            value={quantity}
            onChange={(e) => {
              setQuantity(e.target.value);
              // Clear validation error when user starts typing
              if (validationErrors.quantity) {
                setValidationErrors((prev) => ({ ...prev, quantity: '' }));
              }
            }}
            onBlur={(e) => debouncedValidateField('quantity', e.target.value)}
            className={`bg-zinc-900/50 border-zinc-700 hover:bg-zinc-800/50 focus:bg-zinc-800/50 h-12 md:h-10 text-base md:text-sm ${
              validationErrors.quantity ? 'border-red-500 focus:border-red-500' : ''
            }`}
            inputMode="numeric"
          />
          {validationErrors.quantity && (
            <p className="text-xs text-red-400 mt-1">{validationErrors.quantity}</p>
          )}
        </div>

        {/* Expiry */}
        <div>
          <label className="text-xs text-zinc-400 mb-2 block">Expiry</label>
          <Select value={expiryDays} onValueChange={setExpiryDays}>
            <SelectTrigger className="bg-zinc-900/50 border-zinc-700 hover:bg-zinc-800/50 h-12 md:h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">📅 1 Week</SelectItem>
              <SelectItem value="30">📅 1 Month</SelectItem>
              <SelectItem value="90">📅 3 Months</SelectItem>
              <SelectItem value="180">📅 6 Months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 mt-2">
        <Button
          size="sm"
          variant="outline"
          onClick={handleSubmit}
          disabled={
            isLoading ||
            !strikePrice ||
            !quantity ||
            Object.keys(validationErrors).length > 0 ||
            isValidating
          }
          className="h-12 md:h-10 px-6 md:px-4 text-base md:text-sm font-medium min-w-[140px] md:min-w-[120px]"
        >
          {isValidating ? '🔄 Validating...' : isLoading ? '⚡ Creating...' : '🚀 Create Option'}
        </Button>
      </div>

      {/* Transaction Confirmation Dialog */}
      {pendingTransaction && (
        <TransactionDialog
          isOpen={showConfirmDialog}
          onConfirm={handleConfirmTransaction}
          onCancel={handleCancelTransaction}
          isLoading={isLoading}
          title="Confirm Option Creation"
          description={`Create a ${pendingTransaction.type.toUpperCase()} option with strike price $${pendingTransaction.strike}`}
          details={{
            function: `${APEX_CONTRACT_CONFIG.address}::${APEX_CONTRACT_CONFIG.module}::create_option`,
            typeArguments: [],
            functionArguments: [
              pendingTransaction.strike,
              pendingTransaction.expirySeconds,
              pendingTransaction.type === 'call' ? 0 : 1,
              pendingTransaction.qty,
            ],
            estimatedGas: '0.001',
            estimatedCost: '0.001',
          }}
          action="Create Option"
        />
      )}

      {/* Keyboard Shortcuts Help Dialog */}
      <KeyboardShortcutsHelp
        isOpen={showShortcutsHelp}
        onClose={() => setShowShortcutsHelp(false)}
        shortcuts={orderTicketShortcuts}
        title="Order Ticket Shortcuts"
      />
    </div>
  );
});

// Display name for debugging
OrderTicket.displayName = 'OrderTicket';
