import { NextRequest, NextResponse } from 'next/server';
import { orders, addOrder } from '@/lib/mockData';

// GET /api/orders - Get all orders for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    const symbol = searchParams.get('symbol');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    let filteredOrders = orders.filter((order) => order.userId === userId);

    if (status) {
      filteredOrders = filteredOrders.filter((order) => order.status === status);
    }

    if (symbol) {
      filteredOrders = filteredOrders.filter((order) => order.symbol === symbol);
    }

    return NextResponse.json({
      success: true,
      data: filteredOrders,
      total: filteredOrders.length,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, symbol, type, side, quantity, strikePrice, expiryDate } = body;

    // Validate required fields
    if (!userId || !symbol || !type || !side || !quantity || !strikePrice || !expiryDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate order parameters
    if (quantity <= 0 || strikePrice <= 0) {
      return NextResponse.json({ error: 'Invalid quantity or strike price' }, { status: 400 });
    }

    if (!['call', 'put'].includes(type)) {
      return NextResponse.json({ error: 'Invalid option type' }, { status: 400 });
    }

    if (!['buy', 'sell'].includes(side)) {
      return NextResponse.json({ error: 'Invalid order side' }, { status: 400 });
    }

    // Create new order
    const newOrder = addOrder({
      userId,
      symbol,
      type,
      side,
      quantity: Number(quantity),
      strikePrice: Number(strikePrice),
      expiryDate,
      status: 'pending',
    });

    // Simulate order processing
    setTimeout(() => {
      const orderIndex = orders.findIndex((o) => o.id === newOrder.id);
      if (orderIndex !== -1) {
        orders[orderIndex].status = Math.random() > 0.3 ? 'active' : 'rejected';
        orders[orderIndex].updatedAt = new Date().toISOString();
      }
    }, 2000);

    return NextResponse.json(
      {
        success: true,
        data: newOrder,
        message: 'Order created successfully',
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
