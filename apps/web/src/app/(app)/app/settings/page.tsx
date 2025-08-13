'use client';

import React from 'react';

type Settings = {
  theme: 'system' | 'light' | 'dark';
  compactMode: boolean;
  animations: boolean;
  showHeatmap: boolean;
  priceSource: 'pyth' | 'coingecko';
};

const DEFAULT_SETTINGS: Settings = {
  theme: 'system',
  compactMode: false,
  animations: true,
  showHeatmap: true,
  priceSource: 'pyth',
};

export default function SettingsPage() {
  const [settings, setSettings] = React.useState<Settings>(DEFAULT_SETTINGS);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem('apex.settings');
      if (raw) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(raw) });
    } catch (err) {
      // ignore read errors
    }
  }, []);

  React.useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem('apex.settings', JSON.stringify(settings));
    } catch (err) {
      // ignore write errors
    }
  }, [settings, mounted]);

  function update<K extends keyof Settings>(key: K, value: Settings[K]) {
    setSettings((s) => ({ ...s, [key]: value }));
  }

  return (
    <div className="rounded-xl border border-white/10 bg-card/60 p-5 shadow-glow">
      <h2 className="mb-4 text-sm font-semibold text-zinc-200">Settings</h2>
      <div className="grid gap-6 md:grid-cols-2">
        <section className="space-y-3">
          <div>
            <div className="mb-1 text-xs font-medium text-zinc-400">Theme</div>
            <div className="flex gap-2">
              {(['system', 'light', 'dark'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => update('theme', t)}
                  className={
                    'rounded-lg border px-3 py-1 text-sm ' +
                    (settings.theme === t
                      ? 'border-white/30 bg-white/10 text-zinc-100'
                      : 'border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10')
                  }
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-300">Compact mode</span>
            <input
              type="checkbox"
              checked={settings.compactMode}
              onChange={(e) => update('compactMode', e.target.checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-300">Animations</span>
            <input
              type="checkbox"
              checked={settings.animations}
              onChange={(e) => update('animations', e.target.checked)}
            />
          </div>
        </section>
        <section className="space-y-3">
          <div>
            <div className="mb-1 text-xs font-medium text-zinc-400">Live Price Source</div>
            <div className="flex gap-2">
              {(['pyth', 'coingecko'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => update('priceSource', s)}
                  className={
                    'rounded-lg border px-3 py-1 text-sm ' +
                    (settings.priceSource === s
                      ? 'border-white/30 bg-white/10 text-zinc-100'
                      : 'border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10')
                  }
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-300">Show order book heatmap</span>
            <input
              type="checkbox"
              checked={settings.showHeatmap}
              onChange={(e) => update('showHeatmap', e.target.checked)}
            />
          </div>
        </section>
      </div>
      {!mounted && <div className="mt-6 text-xs text-zinc-500">Loading settings…</div>}
    </div>
  );
}
