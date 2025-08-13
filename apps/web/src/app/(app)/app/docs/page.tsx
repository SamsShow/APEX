export default function DocsPage() {
  const sections = [
    { id: 'intro', title: 'Introduction' },
    { id: 'getting-started', title: 'Getting Started' },
    { id: 'wallet', title: 'Connect Wallet' },
    { id: 'markets', title: 'Markets & Data' },
    { id: 'trade', title: 'Placing Orders' },
    { id: 'strategies', title: 'Strategies' },
    { id: 'risk', title: 'Risk & Limits' },
    { id: 'shortcuts', title: 'Shortcuts' },
    { id: 'faq', title: 'FAQ' },
  ];
  return (
    <div className="grid gap-6 md:grid-cols-12">
      <aside className="md:col-span-3">
        <div className="sticky top-20 rounded-xl border border-white/10 bg-black/30 p-4 text-sm">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
            On this page
          </div>
          <nav className="space-y-2">
            {sections.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="block text-zinc-400 hover:text-zinc-100">
                {s.title}
              </a>
            ))}
          </nav>
        </div>
      </aside>
      <article className="prose prose-invert max-w-none md:col-span-9">
        <h1 className="mb-1">Apex Trading Docs</h1>
        <p className="!mt-0 text-zinc-400">
          Learn how to connect your wallet, explore markets, build strategies, and place orders on
          Apex.
        </p>

        <h2 id="intro">Introduction</h2>
        <p>
          Apex is a high-frequency on-chain matching engine for multi-leg options on Aptos. It
          combines sub-second finality with atomic multi-leg execution.
        </p>

        <h2 id="getting-started">Getting Started</h2>
        <ol>
          <li>
            Open the app and go to <code>/app</code>.
          </li>
          <li>Connect your Aptos wallet (Petra and other adapters supported).</li>
          <li>Navigate using the sidebar: Markets, Trade, Positions, Portfolio, Orders.</li>
        </ol>

        <h2 id="wallet">Connect Wallet</h2>
        <p>
          Use the <strong>Connect</strong> button in the top bar. After connecting, balances and
          transfers appear in <strong>Wallet</strong>. Always verify the network (Testnet/Mainnet)
          before trading.
        </p>

        <h2 id="markets">Markets & Data</h2>
        <p>
          The Markets page shows APT live price, candles, top movers, and a watchlist. Candles are
          sourced from the built-in OHLC API; live prices stream via Pyth when configured.
        </p>

        <h2 id="trade">Placing Orders</h2>
        <p>
          The Trade terminal includes chart, depth, order ticket, order book, tape, and mini
          heatmap. Fill the ticket and submit. Open and historical orders are visible in{' '}
          <strong>Orders</strong>.
        </p>

        <h2 id="strategies">Strategies</h2>
        <p>
          Use presets in the Strategy Builder: <em>Straddle</em>, <em>Bull Call Spread</em>,
          <em> Iron Condor</em>. The payoff chart visualizes expected PnL at expiry. Adjust strikes,
          qty, and legs to refine your strategy.
        </p>

        <h2 id="risk">Risk & Limits</h2>
        <ul>
          <li>Always review max loss and breakevens on the payoff chart.</li>
          <li>Confirm network and collateral requirements before submitting orders.</li>
          <li>Use small sizes to test strategies on Testnet.</li>
        </ul>

        <h2 id="shortcuts">Shortcuts</h2>
        <p>
          Press <kbd>⌘</kbd>/<kbd>Ctrl</kbd> + <kbd>K</kbd> to open the Command Palette. Use it to
          jump between pages.
        </p>

        <h2 id="faq">FAQ</h2>
        <p>
          <strong>Where does price data come from?</strong> Live prices use Pyth; candles come from
          the OHLC endpoint and can be swapped for your backend.
        </p>
        <p>
          <strong>How are multi-leg orders executed?</strong> Orders are batched and submitted
          atomically to the on-chain engine once integrated.
        </p>
        <p>
          <strong>How do I report issues?</strong> Use the repository issue tracker or in-app
          support.
        </p>
      </article>
    </div>
  );
}
