'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Loader2 } from 'lucide-react';
import { useOptionsContract } from '@/hooks/useOptionsContract';
import { useNotifications } from '@/hooks/useNotifications';
import { Order } from '@/hooks/useOrders';

interface CancelOrderButtonProps {
  order: Order;
  onOrderUpdate?: () => void;
}

export function CancelOrderButton({ order, onOrderUpdate }: CancelOrderButtonProps) {
  const refreshData = () => {
    if (onOrderUpdate) onOrderUpdate();
  };

  const { cancelOrder, isLoading } = useOptionsContract(refreshData);
  const { notifySuccess, notifyError } = useNotifications();
  const [isCancelling, setIsCancelling] = useState(false);

  // Only show cancel button for pending orders
  if (order.status !== 'pending') {
    return null;
  }

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    setIsCancelling(true);

    try {
      const result = await cancelOrder(order.id);

      if (result) {
        notifySuccess('Order Cancelled', `Order ${order.id} has been successfully cancelled`, 3000);

        // Refresh orders list
        if (onOrderUpdate) {
          onOrderUpdate();
        }
      } else {
        notifyError('Cancellation Failed', 'Failed to cancel the order. Please try again.', 5000);
      }
    } catch (error) {
      console.error('Cancel order error:', error);
      notifyError(
        'Cancellation Failed',
        'An unexpected error occurred while cancelling the order.',
        5000,
      );
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleCancel}
      disabled={isCancelling || isLoading}
      className="h-7 px-2 text-xs border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500"
    >
      {isCancelling ? (
        <>
          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
          Cancelling...
        </>
      ) : (
        <>
          <X className="w-3 h-3 mr-1" />
          Cancel
        </>
      )}
    </Button>
  );
}
