'use client';

import { useEffect, useCallback } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  description: string;
  action: () => void;
  preventDefault?: boolean;
}

export interface KeyboardShortcutConfig {
  shortcuts: KeyboardShortcut[];
  enabled?: boolean;
}

export function useKeyboardShortcuts(config: KeyboardShortcutConfig) {
  const { shortcuts, enabled = true } = config;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Don't trigger shortcuts when user is typing in input fields
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.contentEditable === 'true'
      ) {
        return;
      }

      for (const shortcut of shortcuts) {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = !!event.ctrlKey === !!shortcut.ctrlKey;
        const altMatch = !!event.altKey === !!shortcut.altKey;
        const shiftMatch = !!event.shiftKey === !!shortcut.shiftKey;

        if (keyMatch && ctrlMatch && altMatch && shiftMatch) {
          if (shortcut.preventDefault !== false) {
            event.preventDefault();
          }
          shortcut.action();
          break; // Only trigger the first matching shortcut
        }
      }
    },
    [shortcuts, enabled],
  );

  useEffect(() => {
    if (enabled) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown, enabled]);

  return {
    enabled,
  };
}

// Predefined shortcut configurations for different contexts

export const createOrderTicketShortcuts = (actions: {
  submitOrder: () => void;
  clearForm: () => void;
  setCallOption: () => void;
  setPutOption: () => void;
  setQuantity: (qty: number) => void;
  setExpiry: (days: number) => void;
}): KeyboardShortcut[] => [
  {
    key: 'Enter',
    description: 'Submit order',
    action: actions.submitOrder,
  },
  {
    key: 'Escape',
    description: 'Clear form',
    action: actions.clearForm,
  },
  {
    key: 'c',
    description: 'Switch to Call option',
    action: actions.setCallOption,
  },
  {
    key: 'p',
    description: 'Switch to Put option',
    action: actions.setPutOption,
  },
  // Quantity shortcuts
  {
    key: '1',
    description: 'Set quantity to 1',
    action: () => actions.setQuantity(1),
  },
  {
    key: '2',
    description: 'Set quantity to 2',
    action: () => actions.setQuantity(2),
  },
  {
    key: '5',
    description: 'Set quantity to 5',
    action: () => actions.setQuantity(5),
  },
  {
    key: '0',
    description: 'Set quantity to 10',
    action: () => actions.setQuantity(10),
  },
  // Expiry shortcuts
  {
    key: '7',
    shiftKey: true,
    description: 'Set expiry to 1 week',
    action: () => actions.setExpiry(7),
  },
  {
    key: '1',
    shiftKey: true,
    description: 'Set expiry to 1 month',
    action: () => actions.setExpiry(30),
  },
  {
    key: '3',
    shiftKey: true,
    description: 'Set expiry to 3 months',
    action: () => actions.setExpiry(90),
  },
  {
    key: '6',
    shiftKey: true,
    description: 'Set expiry to 6 months',
    action: () => actions.setExpiry(180),
  },
];

export const createTradingPageShortcuts = (actions: {
  refreshData: () => void;
  toggleMobileMenu: () => void;
  switchToChart: () => void;
  switchToOrderbook: () => void;
  switchToTicket: () => void;
  switchToTape: () => void;
}): KeyboardShortcut[] => [
  {
    key: 'r',
    description: 'Refresh all data',
    action: actions.refreshData,
  },
  {
    key: 'F5',
    description: 'Refresh all data',
    action: actions.refreshData,
  },
  {
    key: 'm',
    description: 'Toggle mobile menu',
    action: actions.toggleMobileMenu,
  },
  // Mobile tab navigation
  {
    key: 'q',
    description: 'Switch to Chart tab',
    action: actions.switchToChart,
  },
  {
    key: 'w',
    description: 'Switch to Order Book tab',
    action: actions.switchToOrderbook,
  },
  {
    key: 'e',
    description: 'Switch to Order Ticket tab',
    action: actions.switchToTicket,
  },
  {
    key: 'r',
    shiftKey: true,
    description: 'Switch to Tape tab',
    action: actions.switchToTape,
  },
  // Alternative number-based navigation
  {
    key: '1',
    altKey: true,
    description: 'Switch to Chart tab',
    action: actions.switchToChart,
  },
  {
    key: '2',
    altKey: true,
    description: 'Switch to Order Book tab',
    action: actions.switchToOrderbook,
  },
  {
    key: '3',
    altKey: true,
    description: 'Switch to Order Ticket tab',
    action: actions.switchToTicket,
  },
  {
    key: '4',
    altKey: true,
    description: 'Switch to Tape tab',
    action: actions.switchToTape,
  },
];

export const createGlobalShortcuts = (actions: {
  toggleTheme: () => void;
  openHelp: () => void;
  focusSearch: () => void;
}): KeyboardShortcut[] => [
  {
    key: 't',
    ctrlKey: true,
    description: 'Toggle theme',
    action: actions.toggleTheme,
  },
  {
    key: '/',
    ctrlKey: true,
    description: 'Focus search',
    action: actions.focusSearch,
  },
  {
    key: '?',
    description: 'Show keyboard shortcuts help',
    action: actions.openHelp,
  },
  {
    key: 'F1',
    description: 'Show keyboard shortcuts help',
    action: actions.openHelp,
  },
];
