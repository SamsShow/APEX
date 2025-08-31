// Shared mock data for API endpoints using singleton pattern
// In a real application, this would be replaced with a database

export interface Order {
  id: string;
  userId: string;
  symbol: string;
  type: 'call' | 'put';
  side: 'buy' | 'sell';
  quantity: number;
  strikePrice: number;
  expiryDate: string;
  status: 'pending' | 'active' | 'filled' | 'cancelled' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

// Singleton pattern to ensure shared state across all imports
class OrderStore {
  private static instance: OrderStore;
  private _orders: Order[];

  private constructor() {
    this._orders = [
      {
        id: '1',
        userId: 'user_123',
        symbol: 'APT/USD',
        type: 'call',
        side: 'buy',
        quantity: 100,
        strikePrice: 5.25,
        expiryDate: '2024-02-01',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        userId: 'user_123',
        symbol: 'BTC/USD',
        type: 'put',
        side: 'sell',
        quantity: 10,
        strikePrice: 45000,
        expiryDate: '2024-02-15',
        status: 'filled',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  static getInstance(): OrderStore {
    if (!OrderStore.instance) {
      OrderStore.instance = new OrderStore();
    }
    return OrderStore.instance;
  }

  get orders(): Order[] {
    return this._orders;
  }

  addOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Order {
    const newOrder: Order = {
      ...order,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this._orders.push(newOrder);
    return newOrder;
  }

  updateOrder(id: string, updates: Partial<Order>): Order | null {
    const orderIndex = this._orders.findIndex((o) => o.id === id);
    if (orderIndex === -1) return null;

    this._orders[orderIndex] = {
      ...this._orders[orderIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this._orders[orderIndex];
  }

  deleteOrder(id: string): Order | null {
    const orderIndex = this._orders.findIndex((o) => o.id === id);
    if (orderIndex === -1) return null;

    const deletedOrder = this._orders[orderIndex];
    this._orders.splice(orderIndex, 1);
    return deletedOrder;
  }

  getOrder(id: string): Order | undefined {
    return this._orders.find((o) => o.id === id);
  }
}

const orderStore = OrderStore.getInstance();

// Export the store instance methods
export const orders = orderStore.orders;
export const addOrder = (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) =>
  orderStore.addOrder(order);
export const updateOrder = (id: string, updates: Partial<Order>) =>
  orderStore.updateOrder(id, updates);
export const deleteOrder = (id: string) => orderStore.deleteOrder(id);
export const getOrder = (id: string) => orderStore.getOrder(id);
