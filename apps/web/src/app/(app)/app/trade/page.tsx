'use client';

import React, { useState } from 'react';
import { StrategyBuilder } from '@/components/trade/StrategyBuilder';
import { OrderTicket } from '@/components/trade/OrderTicket';
import { OrderBook } from '@/components/trade/OrderBook';
import { AptCandles } from '@/components/charts/AptCandles';
import { Depth } from '@/components/charts/Depth';
import { Tape } from '@/components/trade/Tape';
import { HeatmapBook } from '@/components/trade/HeatmapBook';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { KeyboardShortcutsHelp } from '@/components/ui/keyboard-shortcuts-help';
import { usePositions } from '@/hooks/usePositions';
import { useOrders } from '@/hooks/useOrders';
import { useOrderBookWebSocket } from '@/hooks/useWebSocket';
import { usePriceAlerts } from '@/hooks/useNotifications';
import { usePriceFeeds } from '@/hooks/usePriceFeeds';
import {
  useKeyboardShortcuts,
  createTradingPageShortcuts,
  createGlobalShortcuts,
} from '@/hooks/useKeyboardShortcuts';
import { useTheme } from '@/hooks/useTheme';
import { PriceAlerts } from '@/components/trade/price-alerts';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  BookOpen,
  Receipt,
  ChevronUp,
  ChevronDown,
  Monitor,
  HelpCircle,
} from 'lucide-react';

export default function TradePage() {
  const { refreshPositions } = usePositions();
  const { refreshOrders } = useOrders();
  const { checkPriceAlerts } = usePriceAlerts();
  const { currentPrice } = usePriceFeeds('APT/USD');
  const { toggleTheme } = useTheme();

  // Mobile responsiveness state
  const [activeMobileTab, setActiveMobileTab] = useState<'chart' | 'orderbook' | 'ticket' | 'tape'>(
    'chart',
  );
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Keyboard shortcuts help state
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);

  // WebSocket connections for real-time data
  const { orderBook } = useOrderBookWebSocket('APT/USD');

  // Convert orderbook data for Depth component
  const bids = orderBook.bids.map(([, quantity], index) => ({
    x: index,
    y: quantity,
  }));

  const asks = orderBook.asks.map(([, quantity], index) => ({
    x: index,
    y: quantity,
  }));

  // Price alert monitoring
  React.useEffect(() => {
    if (currentPrice && currentPrice > 0) {
      checkPriceAlerts(currentPrice, 'APT/USD');
    }
  }, [currentPrice, checkPriceAlerts]);

  // Keyboard shortcuts setup
  const refreshData = React.useCallback(() => {
    refreshPositions();
    refreshOrders();
    checkPriceAlerts(currentPrice || 0, 'APT/USD');
  }, [refreshPositions, refreshOrders, checkPriceAlerts, currentPrice]);

  const tradingPageShortcutActions = React.useMemo(
    () => ({
      refreshData,
      toggleMobileMenu: () => setShowMobileMenu(!showMobileMenu),
      switchToChart: () => setActiveMobileTab('chart'),
      switchToOrderbook: () => setActiveMobileTab('orderbook'),
      switchToTicket: () => setActiveMobileTab('ticket'),
      switchToTape: () => setActiveMobileTab('tape'),
    }),
    [refreshData, showMobileMenu],
  );

  const globalShortcutActions = React.useMemo(
    () => ({
      toggleTheme: () => toggleTheme(),
      openHelp: () => setShowShortcutsHelp(true),
      focusSearch: () => {
        // TODO: Implement search focus
        console.log('Search focus not yet implemented');
      },
    }),
    [toggleTheme],
  );

  const tradingPageShortcuts = React.useMemo(
    () => createTradingPageShortcuts(tradingPageShortcutActions),
    [tradingPageShortcutActions],
  );

  const globalShortcuts = React.useMemo(
    () => createGlobalShortcuts(globalShortcutActions),
    [globalShortcutActions],
  );

  // Setup keyboard shortcuts
  useKeyboardShortcuts({
    shortcuts: [...tradingPageShortcuts, ...globalShortcuts],
    enabled: true,
  });

  // Mobile navigation tabs
  const mobileTabs = [
    { id: 'chart', label: 'Chart', icon: BarChart3 },
    { id: 'orderbook', label: 'Order Book', icon: BookOpen },
    { id: 'ticket', label: 'Order', icon: Receipt },
    { id: 'tape', label: 'Tape', icon: Monitor },
  ] as const;
  // Mobile-specific components
  const MobileTabContent = () => {
    switch (activeMobileTab) {
      case 'chart':
        return (
          <div className="space-y-4">
            <ErrorBoundary
              fallback={
                <div className="p-4 text-center text-red-400">Chart temporarily unavailable</div>
              }
            >
              <AptCandles />
            </ErrorBoundary>
            <div>
              <h3 className="mb-2 text-sm font-semibold text-zinc-200">Depth</h3>
              <ErrorBoundary
                fallback={
                  <div className="p-4 text-center text-red-400">Depth chart unavailable</div>
                }
              >
                <Depth bids={bids} asks={asks} />
              </ErrorBoundary>
            </div>
          </div>
        );
      case 'orderbook':
        return (
          <ErrorBoundary
            fallback={<div className="p-4 text-center text-red-400">Order book unavailable</div>}
          >
            <OrderBook />
          </ErrorBoundary>
        );
      case 'ticket':
        return (
          <ErrorBoundary
            fallback={<div className="p-4 text-center text-red-400">Order ticket unavailable</div>}
          >
            <OrderTicket onPositionUpdate={refreshPositions} onOrderUpdate={refreshOrders} />
          </ErrorBoundary>
        );
      case 'tape':
        return (
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-sm font-semibold text-zinc-200">Trade Tape</h3>
              <ErrorBoundary
                fallback={<div className="p-2 text-center text-red-400">Tape unavailable</div>}
              >
                <Tape />
              </ErrorBoundary>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold text-zinc-200">Mini Book Heatmap</h3>
              <ErrorBoundary
                fallback={<div className="p-2 text-center text-red-400">Heatmap unavailable</div>}
              >
                <HeatmapBook />
              </ErrorBoundary>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden lg:grid lg:grid-cols-1 gap-6 2xl:grid-cols-12">
        <section className="2xl:col-span-8 rounded-xl border border-white/10 bg-card/60 p-4 md:p-5 shadow-glow">
          <h2 className="mb-2 text-sm font-semibold text-zinc-200">Chart</h2>
          <ErrorBoundary
            fallback={
              <div className="p-4 text-center text-red-400">Chart temporarily unavailable</div>
            }
          >
            <AptCandles />
          </ErrorBoundary>
          <div className="mt-6">
            <h3 className="mb-2 text-sm font-semibold text-zinc-200">Depth</h3>
            <ErrorBoundary
              fallback={<div className="p-4 text-center text-red-400">Depth chart unavailable</div>}
            >
              <Depth bids={bids} asks={asks} />
            </ErrorBoundary>
          </div>
        </section>
        <section className="2xl:col-span-4 rounded-xl border border-white/10 bg-card/60 p-4 md:p-5 shadow-glow">
          <h2 className="mb-2 text-sm font-semibold text-zinc-200">Order Ticket</h2>
          <ErrorBoundary
            fallback={<div className="p-4 text-center text-red-400">Order ticket unavailable</div>}
          >
            <OrderTicket onPositionUpdate={refreshPositions} onOrderUpdate={refreshOrders} />
          </ErrorBoundary>
        </section>
        <section className="2xl:col-span-8 rounded-xl border border-white/10 bg-card/60 p-4 md:p-5 shadow-glow">
          <h2 className="mb-2 text-sm font-semibold text-zinc-200">Order Book</h2>
          <ErrorBoundary
            fallback={<div className="p-4 text-center text-red-400">Order book unavailable</div>}
          >
            <OrderBook />
          </ErrorBoundary>
        </section>
        <section className="2xl:col-span-4 rounded-xl border border-white/10 bg-card/60 p-4 md:p-5 shadow-glow">
          <h2 className="mb-2 text-sm font-semibold text-zinc-200">Flow</h2>
          <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-1">
            <div>
              <h3 className="mb-2 text-sm font-semibold text-zinc-200">Trade Tape</h3>
              <ErrorBoundary
                fallback={<div className="p-2 text-center text-red-400">Tape unavailable</div>}
              >
                <Tape />
              </ErrorBoundary>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold text-zinc-200">Mini Book Heatmap</h3>
              <ErrorBoundary
                fallback={<div className="p-2 text-center text-red-400">Heatmap unavailable</div>}
              >
                <HeatmapBook />
              </ErrorBoundary>
            </div>
          </div>
        </section>
        <section className="2xl:col-span-8 rounded-xl border border-white/10 bg-card/60 p-4 md:p-5 shadow-glow">
          <h2 className="mb-2 text-sm font-semibold text-zinc-200">Strategy Builder</h2>
          <ErrorBoundary
            fallback={
              <div className="p-4 text-center text-red-400">Strategy builder unavailable</div>
            }
          >
            <StrategyBuilder />
          </ErrorBoundary>
        </section>
        <section className="2xl:col-span-4 rounded-xl border border-white/10 bg-card/60 p-4 md:p-5 shadow-glow">
          <h2 className="mb-2 text-sm font-semibold text-zinc-200">Price Alerts</h2>
          <ErrorBoundary
            fallback={<div className="p-4 text-center text-red-400">Price alerts unavailable</div>}
          >
            <PriceAlerts symbol="APT/USD" />
          </ErrorBoundary>
        </section>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Mobile Tab Navigation */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-semibold text-zinc-200">Trading</h1>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowShortcutsHelp(true)}
                className="text-zinc-400 hover:text-zinc-200 h-8 w-8 p-0"
                title="Keyboard shortcuts help"
              >
                <HelpCircle className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="border-zinc-700"
              >
                {showMobileMenu ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
                Menu
              </Button>
            </div>
          </div>

          {/* Mobile Tabs */}
          <div className="flex gap-1 bg-zinc-900/50 rounded-lg p-1 border border-zinc-700">
            {mobileTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveMobileTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-medium transition-all ${
                    activeMobileTab === tab.id
                      ? 'bg-zinc-700 text-zinc-200 shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Content */}
        <div className="rounded-xl border border-white/10 bg-card/60 p-4 shadow-glow min-h-[500px]">
          <MobileTabContent />
        </div>

        {/* Mobile Strategy Builder - Collapsible */}
        {showMobileMenu && (
          <div className="mt-4 space-y-4">
            <div className="rounded-xl border border-white/10 bg-card/60 p-4 shadow-glow">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-zinc-200">Strategy Builder</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMobileMenu(false)}
                  className="text-zinc-400 hover:text-zinc-200"
                >
                  <ChevronUp className="w-4 h-4" />
                </Button>
              </div>
              <ErrorBoundary
                fallback={
                  <div className="p-4 text-center text-red-400">Strategy builder unavailable</div>
                }
              >
                <StrategyBuilder />
              </ErrorBoundary>
            </div>

            <div className="rounded-xl border border-white/10 bg-card/60 p-4 shadow-glow">
              <h2 className="text-sm font-semibold text-zinc-200 mb-3">Price Alerts</h2>
              <ErrorBoundary
                fallback={
                  <div className="p-4 text-center text-red-400">Price alerts unavailable</div>
                }
              >
                <PriceAlerts symbol="APT/USD" />
              </ErrorBoundary>
            </div>
          </div>
        )}
      </div>

      {/* Keyboard Shortcuts Help Dialog */}
      <KeyboardShortcutsHelp
        isOpen={showShortcutsHelp}
        onClose={() => setShowShortcutsHelp(false)}
        shortcuts={[...tradingPageShortcuts, ...globalShortcuts]}
        title="Trading Page Shortcuts"
      />
    </>
  );
}
