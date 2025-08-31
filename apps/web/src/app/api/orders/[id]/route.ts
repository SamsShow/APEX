import { NextRequest, NextResponse } from 'next/server';
import { orders, updateOrder, deleteOrder, getOrder } from '@/lib/mockData';

// GET /api/orders/[id] - Get specific order
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const order = getOrder(params.id);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/orders/[id] - Update order (modify parameters)
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const orderIndex = orders.findIndex((o) => o.id === params.id);

    if (orderIndex === -1) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const order = orders[orderIndex];

    // Only allow modifications for pending orders
    if (order.status !== 'pending') {
      return NextResponse.json({ error: 'Can only modify pending orders' }, { status: 400 });
    }

    // Update allowed fields
    const allowedFields = ['quantity', 'strikePrice'];
    const updates: any = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    // Apply updates
    const updatedOrder = updateOrder(params.id, updates);
    if (!updatedOrder) {
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: 'Order updated successfully',
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/orders/[id] - Cancel order
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const orderIndex = orders.findIndex((o) => o.id === params.id);

    if (orderIndex === -1) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const order = orders[orderIndex];

    // Only allow cancellation for active/pending orders
    if (!['pending', 'active'].includes(order.status)) {
      return NextResponse.json(
        { error: 'Can only cancel pending or active orders' },
        { status: 400 },
      );
    }

    // Mark as cancelled
    const cancelledOrder = updateOrder(params.id, { status: 'cancelled' });
    if (!cancelledOrder) {
      return NextResponse.json({ error: 'Failed to cancel order' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: cancelledOrder,
      message: 'Order cancelled successfully',
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
