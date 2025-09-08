'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { KeyboardShortcut } from '@/hooks/useKeyboardShortcuts';

interface KeyboardShortcutsHelpProps {
  isOpen: boolean;
  onClose: () => void;
  shortcuts: KeyboardShortcut[];
  title?: string;
}

export const KeyboardShortcutsHelp: React.FC<KeyboardShortcutsHelpProps> = ({
  isOpen,
  onClose,
  shortcuts,
  title = 'Keyboard Shortcuts',
}) => {
  const formatShortcut = (shortcut: KeyboardShortcut): string => {
    const parts = [];
    if (shortcut.ctrlKey) parts.push('Ctrl');
    if (shortcut.altKey) parts.push('Alt');
    if (shortcut.shiftKey) parts.push('Shift');
    parts.push(shortcut.key.toUpperCase());
    return parts.join(' + ');
  };

  const groupedShortcuts = shortcuts.reduce(
    (acc, shortcut) => {
      // Group shortcuts by their action context or create logical groups
      let group = 'General';

      // Order ticket shortcuts
      if (
        ['Enter', 'Escape', 'c', 'p'].includes(shortcut.key) ||
        (shortcut.key >= '0' && shortcut.key <= '9' && !shortcut.altKey) ||
        (shortcut.shiftKey && ['7', '1', '3', '6'].includes(shortcut.key))
      ) {
        group = 'Order Ticket';
      }
      // Navigation shortcuts
      else if (
        shortcut.key === 'm' ||
        (shortcut.altKey && shortcut.key >= '1' && shortcut.key <= '4') ||
        (['q', 'w', 'e', 'r'].includes(shortcut.key) && shortcut.shiftKey)
      ) {
        group = 'Navigation';
      }
      // Trading shortcuts
      else if (shortcut.key === 'r' && !shortcut.shiftKey && !shortcut.ctrlKey) {
        group = 'Trading';
      }
      // Global shortcuts
      else if (shortcut.ctrlKey || shortcut.key === '?' || shortcut.key === 'F1') {
        group = 'Global';
      }

      if (!acc[group]) acc[group] = [];
      acc[group].push(shortcut);
      return acc;
    },
    {} as Record<string, KeyboardShortcut[]>,
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-zinc-900 border-zinc-700">
        <DialogHeader>
          <DialogTitle className="text-zinc-200 flex items-center gap-2">⌨️ {title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {Object.entries(groupedShortcuts).map(([groupName, groupShortcuts]) => (
            <div key={groupName}>
              <h3 className="text-sm font-semibold text-zinc-300 mb-3 uppercase tracking-wide">
                {groupName}
              </h3>
              <div className="space-y-2">
                {groupShortcuts.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 px-3 rounded-md bg-zinc-800/50 border border-zinc-700/50"
                  >
                    <span className="text-sm text-zinc-300">{shortcut.description}</span>
                    <kbd className="px-2 py-1 text-xs font-mono bg-zinc-700 text-zinc-200 rounded border border-zinc-600">
                      {formatShortcut(shortcut)}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-4 border-t border-zinc-700">
          <Button
            onClick={onClose}
            variant="outline"
            className="border-zinc-600 text-zinc-300 hover:bg-zinc-800"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
