'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DocsPage() {
  const sections = [
    { id: 'overview', title: 'Overview', icon: '📊' },
    { id: 'quick-start', title: 'Quick Start', icon: '🚀' },
    { id: 'ai-features', title: 'AI Features', icon: '🤖' },
    { id: 'architecture', title: 'Architecture', icon: '🏗️' },
    { id: 'smart-contracts', title: 'Smart Contracts', icon: '📜' },
    { id: 'api-reference', title: 'API Reference', icon: '📚' },
    { id: 'trading-guide', title: 'Trading Guide', icon: '📈' },
    { id: 'order-types', title: 'Order Types', icon: '📝' },
    { id: 'options-pricing', title: 'Options Pricing', icon: '🧮' },
    { id: 'strategies', title: 'Strategies', icon: '🎯' },
    { id: 'risk-management', title: 'Risk Management', icon: '⚠️' },
    { id: 'market-data', title: 'Market Data', icon: '📊' },
    { id: 'integration', title: 'Integration', icon: '🔗' },
    { id: 'security', title: 'Security', icon: '🔒' },
    { id: 'performance', title: 'Performance', icon: '⚡' },
    { id: 'troubleshooting', title: 'Troubleshooting', icon: '🔧' },
  ];

  const handleSectionClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-slate-800/50 px-4 py-2 text-sm text-slate-300">
            <span className="text-zinc-400">📚</span>
            Documentation
          </div>
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">Apex Trading Platform</h1>
          <p className="mx-auto max-w-3xl text-lg text-slate-400 leading-relaxed">
            Professional-grade decentralized options trading platform built on Aptos blockchain.
            Features high-frequency on-chain matching engine with sub-second finality, atomic
            multi-leg execution, and institutional-grade risk management tools.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Badge variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800/50">
              Options Trading
            </Badge>
            <Badge variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800/50">
              DeFi Protocol
            </Badge>
            <Badge variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800/50">
              Aptos Blockchain
            </Badge>
            <Badge variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800/50">
              Web3 Infrastructure
            </Badge>
            <Badge variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800/50">
              High Frequency
            </Badge>
            <Badge variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800/50">
              Atomic Execution
            </Badge>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1">
            <div className="sticky top-8">
              <Card className="border-slate-800 bg-slate-900/50 backdrop-blur">
                <CardHeader className="pb-4">
                  <CardTitle className="text-sm font-semibold text-slate-300">
                    Table of Contents
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <nav className="space-y-1">
                    {sections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => handleSectionClick(section.id)}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-400 transition-all duration-200 hover:bg-zinc-800/50 hover:text-zinc-200"
                      >
                        <span className="text-base">{section.icon}</span>
                        <span className="font-medium">{section.title}</span>
                      </button>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <div className="space-y-16">
              {/* Overview */}
              <section id="overview" className="scroll-mt-8">
                <Card className="border-zinc-800 bg-slate-900/30 backdrop-blur">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📊</span>
                      <CardTitle className="text-2xl text-white">Platform Overview</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="prose prose-invert max-w-none">
                    <p className="text-slate-300 text-lg leading-relaxed">
                      Apex is a professional-grade decentralized options trading platform built on
                      the Aptos blockchain. It combines institutional-grade trading infrastructure
                      with retail accessibility, offering high-frequency on-chain matching with
                      sub-second finality and atomic multi-leg execution.
                    </p>

                    <div className="mt-8 grid gap-6 lg:grid-cols-3">
                      <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-6">
                        <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                          <span className="text-zinc-400">🚀</span>
                          Core Features
                        </h4>
                        <ul className="space-y-3 text-sm text-slate-400">
                          <li className="flex items-start gap-2">
                            <span className="text-zinc-400 mt-1">•</span>
                            <span>
                              <strong className="text-zinc-300">Multi-leg Options:</strong> Complex
                              strategies with atomic execution
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-zinc-400 mt-1">•</span>
                            <span>
                              <strong className="text-zinc-300">High Frequency:</strong> Sub-second
                              trade execution
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-zinc-400 mt-1">•</span>
                            <span>
                              <strong className="text-zinc-300">Real-time Data:</strong> Live price
                              feeds via Pyth Network
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-zinc-400 mt-1">•</span>
                            <span>
                              <strong className="text-zinc-300">Risk Management:</strong> Advanced
                              position monitoring
                            </span>
                          </li>
                        </ul>
                      </div>

                      <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-6">
                        <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                          <span className="text-zinc-400">💰</span>
                          Supported Assets
                        </h4>
                        <ul className="space-y-3 text-sm text-slate-400">
                          <li className="flex items-start gap-2">
                            <span className="text-zinc-400 mt-1">•</span>
                            <span>
                              <strong className="text-zinc-300">APT:</strong> Native Aptos token
                              options
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-zinc-400 mt-1">•</span>
                            <span>
                              <strong className="text-zinc-300">USDC:</strong> USD-pegged stablecoin
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-zinc-400 mt-1">•</span>
                            <span>
                              <strong className="text-zinc-300">BTC:</strong> Bitcoin options
                              contracts
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-zinc-400 mt-1">•</span>
                            <span>
                              <strong className="text-zinc-300">ETH:</strong> Ethereum options
                              contracts
                            </span>
                          </li>
                        </ul>
                      </div>

                      <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-6">
                        <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                          <span className="text-zinc-400">🏗️</span>
                          Technical Specs
                        </h4>
                        <ul className="space-y-3 text-sm text-slate-400">
                          <li className="flex items-start gap-2">
                            <span className="text-zinc-400 mt-1">•</span>
                            <span>
                              <strong className="text-zinc-300">Language:</strong> Move programming
                              language
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-zinc-400 mt-1">•</span>
                            <span>
                              <strong className="text-zinc-300">Network:</strong> Aptos mainnet &
                              testnet
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-zinc-400 mt-1">•</span>
                            <span>
                              <strong className="text-zinc-300">Finality:</strong> Sub-second block
                              time
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-zinc-400 mt-1">•</span>
                            <span>
                              <strong className="text-zinc-300">Security:</strong> Formal
                              verification ready
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="mt-8 rounded-xl border border-zinc-700 bg-zinc-900/30 p-6">
                      <h4 className="font-semibold text-white mb-4">Platform Architecture</h4>
                      <div className="grid gap-6 md:grid-cols-2">
                        <div>
                          <h5 className="text-zinc-300 mb-3 font-medium">Frontend Layer</h5>
                          <ul className="space-y-2 text-sm text-slate-400">
                            <li>• React/Next.js application with TypeScript</li>
                            <li>• Real-time WebSocket connections</li>
                            <li>• Advanced charting with Lightweight Charts</li>
                            <li>• Wallet integration (Petra, Martian, Pontem)</li>
                            <li>• Responsive design with Tailwind CSS</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="text-zinc-300 mb-3 font-medium">Smart Contract Layer</h5>
                          <ul className="space-y-2 text-sm text-slate-400">
                            <li>• Move language smart contracts</li>
                            <li>• On-chain order matching engine</li>
                            <li>• Automated market maker for liquidity</li>
                            <li>• Multi-signature governance system</li>
                            <li>• Emergency pause functionality</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Quick Start */}
              <section id="quick-start" className="scroll-mt-8">
                <Card className="border-zinc-800 bg-slate-900/30 backdrop-blur">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🚀</span>
                      <CardTitle className="text-2xl text-white">Quick Start Guide</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      <div className="rounded-xl bg-zinc-500/10 border border-zinc-500/20 p-8">
                        <h3 className="font-semibold text-zinc-300 mb-4 text-lg">
                          System Requirements
                        </h3>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <h4 className="font-medium text-zinc-300 mb-3">
                              Hardware Requirements
                            </h4>
                            <ul className="space-y-2 text-slate-400">
                              <li className="flex items-start gap-2">
                                <span className="text-green-400 mt-1">✓</span>
                                <span>
                                  Modern web browser (Chrome 90+, Firefox 88+, Safari 14+)
                                </span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-green-400 mt-1">✓</span>
                                <span>Minimum 4GB RAM recommended</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-green-400 mt-1">✓</span>
                                <span>Stable internet connection</span>
                              </li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium text-zinc-300 mb-3">
                              Software Requirements
                            </h4>
                            <ul className="space-y-2 text-slate-400">
                              <li className="flex items-start gap-2">
                                <span className="text-green-400 mt-1">✓</span>
                                <span>Aptos-compatible wallet extension</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-green-400 mt-1">✓</span>
                                <span>Web3 browser support enabled</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-green-400 mt-1">✓</span>
                                <span>JavaScript enabled</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-xl bg-zinc-900/50 border border-zinc-700 p-6">
                        <h3 className="font-semibold text-zinc-300 mb-6 text-lg">
                          Step-by-Step Setup
                        </h3>
                        <div className="grid gap-6 lg:grid-cols-4">
                          <div className="text-center">
                            <div className="w-12 h-12 bg-zinc-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold text-zinc-200">
                              1
                            </div>
                            <h4 className="font-semibold text-white mb-3">Install Wallet</h4>
                            <p className="text-sm text-slate-400 leading-relaxed">
                              Download and install Petra, Martian, or Pontem wallet extension from
                              your browser&apos;s extension store.
                            </p>
                            <div className="mt-4 space-y-2 text-xs text-slate-500">
                              <div>• Create new wallet or import existing</div>
                              <div>• Backup your seed phrase securely</div>
                              <div>• Enable Aptos testnet in wallet settings</div>
                            </div>
                          </div>

                          <div className="text-center">
                            <div className="w-12 h-12 bg-zinc-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold text-zinc-200">
                              2
                            </div>
                            <h4 className="font-semibold text-white mb-3">Fund Wallet</h4>
                            <p className="text-sm text-slate-400 leading-relaxed">
                              Get testnet APT tokens from the Aptos faucet and deposit USDC for
                              trading.
                            </p>
                            <div className="mt-4 space-y-2 text-xs text-slate-500">
                              <div>• Visit Aptos devnet faucet</div>
                              <div>• Request testnet APT tokens</div>
                              <div>• Bridge or acquire test USDC</div>
                            </div>
                          </div>

                          <div className="text-center">
                            <div className="w-12 h-12 bg-zinc-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold text-zinc-200">
                              3
                            </div>
                            <h4 className="font-semibold text-white mb-3">Connect Platform</h4>
                            <p className="text-sm text-slate-400 leading-relaxed">
                              Visit Apex platform and connect your wallet to start trading options.
                            </p>
                            <div className="mt-4 space-y-2 text-xs text-slate-500">
                              <div>• Click &quot;Connect Wallet&quot; button</div>
                              <div>• Select your wallet extension</div>
                              <div>• Approve connection request</div>
                            </div>
                          </div>

                          <div className="text-center">
                            <div className="w-12 h-12 bg-zinc-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold text-zinc-200">
                              4
                            </div>
                            <h4 className="font-semibold text-white mb-3">Start Trading</h4>
                            <p className="text-sm text-slate-400 leading-relaxed">
                              Explore markets, build strategies, and place your first options trade.
                            </p>
                            <div className="mt-4 space-y-2 text-xs text-slate-500">
                              <div>• Browse available markets</div>
                              <div>• Use strategy builder</div>
                              <div>• Place test orders</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-xl border border-zinc-700 bg-zinc-900/30 p-6">
                        <h3 className="font-semibold text-zinc-300 mb-4 text-lg">
                          Network Configuration
                        </h3>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-3">
                            <h4 className="font-medium text-zinc-300">Testnet (Recommended)</h4>
                            <ul className="space-y-1 text-sm text-slate-400">
                              <li>• Full featured environment</li>
                              <li>• Free test tokens available</li>
                              <li>• Practice trading strategies</li>
                              <li>• Test integrations safely</li>
                            </ul>
                          </div>
                          <div className="space-y-3">
                            <h4 className="font-medium text-zinc-300">Mainnet</h4>
                            <ul className="space-y-1 text-sm text-slate-400">
                              <li>• Live trading environment</li>
                              <li>• Real APT and USDC tokens</li>
                              <li>• Production-ready features</li>
                              <li>• Higher network fees</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* AI Features */}
              <section id="ai-features" className="scroll-mt-8">
                <Card className="border-zinc-800 bg-slate-900/30 backdrop-blur">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🤖</span>
                      <CardTitle className="text-2xl text-white">AI-Powered Features</CardTitle>
                    </div>
                    <p className="text-slate-400 mt-2">
                      Advanced artificial intelligence capabilities that enhance trading performance
                      and risk management
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      {/* AI Overview */}
                      <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-6">
                        <h3 className="font-semibold text-blue-300 mb-4 text-lg flex items-center gap-2">
                          <span className="text-xl">🧠</span>
                          AI Overview
                        </h3>
                        <p className="text-slate-300 leading-relaxed">
                          Apex integrates cutting-edge AI technologies to provide traders with
                          intelligent insights, automated analysis, and predictive capabilities. Our
                          AI systems continuously learn from market data to improve performance and
                          help traders make better decisions.
                        </p>
                      </div>

                      {/* AI Features Grid */}
                      <div className="grid gap-6 md:grid-cols-2">
                        {/* Strategy Advisor */}
                        <div className="rounded-xl bg-zinc-500/10 border border-zinc-500/20 p-6">
                          <h4 className="font-semibold text-zinc-300 mb-3 flex items-center gap-2">
                            <span className="text-lg">🎯</span>
                            AI Strategy Advisor
                          </h4>
                          <p className="text-slate-400 text-sm mb-4">
                            Intelligent strategy recommendations based on market conditions,
                            volatility patterns, and user risk profiles.
                          </p>
                          <ul className="space-y-2 text-sm text-slate-400">
                            <li className="flex items-center gap-2">
                              <span className="text-green-400">✓</span>
                              Real-time market analysis
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="text-green-400">✓</span>
                              Personalized recommendations
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="text-green-400">✓</span>
                              Risk-adjusted strategies
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="text-green-400">✓</span>
                              Performance optimization
                            </li>
                          </ul>
                        </div>

                        {/* Sentiment Analysis */}
                        <div className="rounded-xl bg-purple-500/10 border border-purple-500/20 p-6">
                          <h4 className="font-semibold text-purple-300 mb-3 flex items-center gap-2">
                            <span className="text-lg">📊</span>
                            Sentiment Analysis
                          </h4>
                          <p className="text-slate-400 text-sm mb-4">
                            Multi-source sentiment analysis from social media, news, and on-chain
                            data for market timing insights.
                          </p>
                          <ul className="space-y-2 text-sm text-slate-400">
                            <li className="flex items-center gap-2">
                              <span className="text-green-400">✓</span>
                              Social media monitoring
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="text-green-400">✓</span>
                              News sentiment analysis
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="text-green-400">✓</span>
                              On-chain data processing
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="text-green-400">✓</span>
                              Market impact prediction
                            </li>
                          </ul>
                        </div>

                        {/* Risk Assessment */}
                        <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-6">
                          <h4 className="font-semibold text-red-300 mb-3 flex items-center gap-2">
                            <span className="text-lg">⚠️</span>
                            AI Risk Assessment
                          </h4>
                          <p className="text-slate-400 text-sm mb-4">
                            Comprehensive portfolio risk analysis with stress testing and
                            optimization recommendations.
                          </p>
                          <ul className="space-y-2 text-sm text-slate-400">
                            <li className="flex items-center gap-2">
                              <span className="text-green-400">✓</span>
                              Portfolio risk metrics
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="text-green-400">✓</span>
                              Stress test scenarios
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="text-green-400">✓</span>
                              VaR calculations
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="text-green-400">✓</span>
                              Optimization suggestions
                            </li>
                          </ul>
                        </div>

                        {/* Anomaly Detection */}
                        <div className="rounded-xl bg-orange-500/10 border border-orange-500/20 p-6">
                          <h4 className="font-semibold text-orange-300 mb-3 flex items-center gap-2">
                            <span className="text-lg">🔍</span>
                            Anomaly Detection
                          </h4>
                          <p className="text-slate-400 text-sm mb-4">
                            Real-time detection of market anomalies and arbitrage opportunities
                            using advanced pattern recognition.
                          </p>
                          <ul className="space-y-2 text-sm text-slate-400">
                            <li className="flex items-center gap-2">
                              <span className="text-green-400">✓</span>
                              Price spike detection
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="text-green-400">✓</span>
                              Volume surge monitoring
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="text-green-400">✓</span>
                              Arbitrage opportunities
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="text-green-400">✓</span>
                              Market regime analysis
                            </li>
                          </ul>
                        </div>
                      </div>

                      {/* AI Performance Metrics */}
                      <div className="rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 p-6">
                        <h3 className="font-semibold text-blue-300 mb-4 text-lg flex items-center gap-2">
                          <span className="text-xl">📈</span>
                          AI Performance Improvements
                        </h3>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                          <div className="text-center p-4 bg-zinc-800/30 rounded-lg">
                            <div className="text-2xl font-bold text-green-400 mb-1">+40%</div>
                            <div className="text-sm text-slate-400">Strategy Success Rate</div>
                          </div>
                          <div className="text-center p-4 bg-zinc-800/30 rounded-lg">
                            <div className="text-2xl font-bold text-green-400 mb-1">-25%</div>
                            <div className="text-sm text-slate-400">Portfolio Risk</div>
                          </div>
                          <div className="text-center p-4 bg-zinc-800/30 rounded-lg">
                            <div className="text-2xl font-bold text-blue-400 mb-1">60%</div>
                            <div className="text-sm text-slate-400">Faster Detection</div>
                          </div>
                          <div className="text-center p-4 bg-zinc-800/30 rounded-lg">
                            <div className="text-2xl font-bold text-purple-400 mb-1">+35%</div>
                            <div className="text-sm text-slate-400">Market Timing</div>
                          </div>
                        </div>
                      </div>

                      {/* AI Integration Guide */}
                      <div className="rounded-xl bg-zinc-500/10 border border-zinc-500/20 p-6">
                        <h3 className="font-semibold text-zinc-300 mb-4 text-lg flex items-center gap-2">
                          <span className="text-xl">🔧</span>
                          Using AI Features
                        </h3>
                        <div className="space-y-4">
                          <div className="border-l-4 border-blue-400 pl-4">
                            <h4 className="font-medium text-zinc-300 mb-2">Access AI Features</h4>
                            <p className="text-slate-400 text-sm">
                              AI features are integrated throughout the platform. Navigate to the
                              Analytics section to access AI-powered insights, or use the demo
                              section to explore capabilities without connecting a wallet.
                            </p>
                          </div>
                          <div className="border-l-4 border-purple-400 pl-4">
                            <h4 className="font-medium text-zinc-300 mb-2">Real-time Analysis</h4>
                            <p className="text-slate-400 text-sm">
                              AI systems continuously analyze market data and update recommendations
                              in real-time. Enable live monitoring for the most current insights.
                            </p>
                          </div>
                          <div className="border-l-4 border-green-400 pl-4">
                            <h4 className="font-medium text-zinc-300 mb-2">Risk Management</h4>
                            <p className="text-slate-400 text-sm">
                              Always combine AI recommendations with your own risk assessment. AI
                              provides data-driven insights but should complement, not replace, your
                              trading judgment.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Architecture */}
              <section id="architecture" className="scroll-mt-8">
                <Card className="border-zinc-800 bg-slate-900/30 backdrop-blur">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🏗️</span>
                      <CardTitle className="text-2xl text-white">System Architecture</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      <div className="rounded-xl border border-zinc-700 bg-zinc-900/30 p-6">
                        <h3 className="font-semibold text-zinc-300 mb-6 text-lg">
                          Multi-Layer Architecture
                        </h3>
                        <div className="grid gap-6 lg:grid-cols-2">
                          <div className="space-y-4">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 bg-zinc-600 rounded-lg flex items-center justify-center text-zinc-300 font-bold">
                                1
                              </div>
                              <div>
                                <h4 className="font-semibold text-white">Frontend Layer</h4>
                                <p className="text-sm text-slate-400 mt-1">
                                  React/Next.js application with TypeScript, providing real-time
                                  trading interface and wallet integration.
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 bg-zinc-600 rounded-lg flex items-center justify-center text-zinc-300 font-bold">
                                2
                              </div>
                              <div>
                                <h4 className="font-semibold text-white">API Gateway</h4>
                                <p className="text-sm text-slate-400 mt-1">
                                  RESTful and WebSocket APIs for market data, order management, and
                                  real-time updates.
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 bg-zinc-600 rounded-lg flex items-center justify-center text-zinc-300 font-bold">
                                3
                              </div>
                              <div>
                                <h4 className="font-semibold text-white">Matching Engine</h4>
                                <p className="text-sm text-slate-400 mt-1">
                                  High-frequency on-chain order matching with sub-second execution
                                  and atomic settlement.
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 bg-zinc-600 rounded-lg flex items-center justify-center text-zinc-300 font-bold">
                                4
                              </div>
                              <div>
                                <h4 className="font-semibold text-white">Blockchain Layer</h4>
                                <p className="text-sm text-slate-400 mt-1">
                                  Aptos blockchain with Move smart contracts for decentralized
                                  custody and settlement.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-6">
                          <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                            <span className="text-zinc-400">⚡</span>
                            Performance Characteristics
                          </h4>
                          <ul className="space-y-3 text-sm text-slate-400">
                            <li className="flex items-start gap-2">
                              <span className="text-zinc-400 mt-1">•</span>
                              <span>
                                <strong className="text-zinc-300">Latency:</strong> Sub-100ms order
                                execution
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-zinc-400 mt-1">•</span>
                              <span>
                                <strong className="text-zinc-300">Throughput:</strong> 10,000+
                                orders/second
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-zinc-400 mt-1">•</span>
                              <span>
                                <strong className="text-zinc-300">Finality:</strong> Sub-second
                                block confirmation
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-zinc-400 mt-1">•</span>
                              <span>
                                <strong className="text-zinc-300">Uptime:</strong> 99.9%
                                availability target
                              </span>
                            </li>
                          </ul>
                        </div>

                        <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-6">
                          <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                            <span className="text-zinc-400">🔒</span>
                            Security Features
                          </h4>
                          <ul className="space-y-3 text-sm text-slate-400">
                            <li className="flex items-start gap-2">
                              <span className="text-zinc-400 mt-1">•</span>
                              <span>
                                <strong className="text-zinc-300">Multi-sig:</strong> Governance and
                                emergency controls
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-zinc-400 mt-1">•</span>
                              <span>
                                <strong className="text-zinc-300">Audits:</strong> Regular smart
                                contract audits
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-zinc-400 mt-1">•</span>
                              <span>
                                <strong className="text-zinc-300">Insurance:</strong> Trading loss
                                protection fund
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-zinc-400 mt-1">•</span>
                              <span>
                                <strong className="text-zinc-300">Monitoring:</strong> 24/7 system
                                monitoring
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Smart Contracts */}
              <section id="smart-contracts" className="scroll-mt-8">
                <Card className="border-zinc-800 bg-slate-900/30 backdrop-blur">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📜</span>
                      <CardTitle className="text-2xl text-white">Smart Contracts</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      <p className="text-slate-300 text-lg">
                        Apex smart contracts are written in Move language, providing secure,
                        efficient, and formally verifiable on-chain logic for options trading.
                      </p>

                      <div className="grid gap-6 lg:grid-cols-2">
                        <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-6">
                          <h4 className="font-semibold text-white mb-4">Core Contracts</h4>
                          <div className="space-y-4">
                            <div className="p-4 bg-zinc-800/50 rounded-lg">
                              <h5 className="font-medium text-zinc-300 mb-2">OptionsFactory</h5>
                              <p className="text-sm text-slate-400 mb-2">
                                Deploys new options contracts with standardized parameters
                              </p>
                              <ul className="text-xs text-slate-500 space-y-1">
                                <li>• Creates standardized option instruments</li>
                                <li>• Manages contract metadata and parameters</li>
                                <li>• Handles option lifecycle management</li>
                              </ul>
                            </div>

                            <div className="p-4 bg-zinc-800/50 rounded-lg">
                              <h5 className="font-medium text-zinc-300 mb-2">OrderBook</h5>
                              <p className="text-sm text-slate-400 mb-2">
                                Manages limit order book and matching logic
                              </p>
                              <ul className="text-xs text-slate-500 space-y-1">
                                <li>• Maintains bid/ask order queues</li>
                                <li>• Executes price-time priority matching</li>
                                <li>• Handles order cancellations and modifications</li>
                              </ul>
                            </div>

                            <div className="p-4 bg-zinc-800/50 rounded-lg">
                              <h5 className="font-medium text-zinc-300 mb-2">ClearingHouse</h5>
                              <p className="text-sm text-slate-400 mb-2">
                                Manages collateral, margin, and settlement
                              </p>
                              <ul className="text-xs text-slate-500 space-y-1">
                                <li>• Tracks margin requirements</li>
                                <li>• Handles collateral movements</li>
                                <li>• Processes settlement and payouts</li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-6">
                          <h4 className="font-semibold text-white mb-4">Contract Features</h4>
                          <div className="space-y-4">
                            <div className="flex items-start gap-3">
                              <div className="w-2 h-2 bg-zinc-400 rounded-full mt-2"></div>
                              <div>
                                <h5 className="font-medium text-zinc-300">Resource Accounts</h5>
                                <p className="text-sm text-slate-400">
                                  Isolated execution environments for each trading pair
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <div className="w-2 h-2 bg-zinc-400 rounded-full mt-2"></div>
                              <div>
                                <h5 className="font-medium text-zinc-300">Table Storage</h5>
                                <p className="text-sm text-slate-400">
                                  Efficient storage for large datasets like order books
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <div className="w-2 h-2 bg-zinc-400 rounded-full mt-2"></div>
                              <div>
                                <h5 className="font-medium text-zinc-300">Events System</h5>
                                <p className="text-sm text-slate-400">
                                  Real-time event emission for trade confirmations
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <div className="w-2 h-2 bg-zinc-400 rounded-full mt-2"></div>
                              <div>
                                <h5 className="font-medium text-zinc-300">Access Control</h5>
                                <p className="text-sm text-slate-400">
                                  Role-based permissions for governance and operations
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* API Reference */}
              <section id="api-reference" className="scroll-mt-8">
                <Card className="border-zinc-800 bg-slate-900/30 backdrop-blur">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📚</span>
                      <CardTitle className="text-2xl text-white">API Reference</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      <div className="rounded-xl bg-zinc-900/50 border border-zinc-700 p-6">
                        <h3 className="font-semibold text-zinc-300 mb-6 text-lg">
                          REST API Endpoints
                        </h3>
                        <div className="space-y-6">
                          <div className="border border-zinc-700 rounded-lg p-4">
                            <div className="flex items-center gap-3 mb-3">
                              <Badge
                                variant="outline"
                                className="border-green-500/30 text-green-400 bg-green-500/10"
                              >
                                GET
                              </Badge>
                              <code className="text-zinc-300 font-mono">/api/v1/markets</code>
                            </div>
                            <p className="text-slate-400 text-sm mb-3">
                              Retrieve available trading markets and instruments
                            </p>
                            <div className="bg-zinc-800/50 rounded p-3">
                              <h5 className="text-zinc-300 text-sm font-medium mb-2">Response</h5>
                              <pre className="text-xs text-slate-400 overflow-x-auto">
                                {`{
  "markets": [
    {
      "symbol": "APT/USD",
      "baseAsset": "APT",
      "quoteAsset": "USD",
      "status": "active"
    }
  ]
}`}
                              </pre>
                            </div>
                          </div>

                          <div className="border border-zinc-700 rounded-lg p-4">
                            <div className="flex items-center gap-3 mb-3">
                              <Badge
                                variant="outline"
                                className="border-blue-500/30 text-blue-400 bg-blue-500/10"
                              >
                                POST
                              </Badge>
                              <code className="text-zinc-300 font-mono">/api/v1/orders</code>
                            </div>
                            <p className="text-slate-400 text-sm mb-3">
                              Place a new order on the matching engine
                            </p>
                            <div className="bg-zinc-800/50 rounded p-3">
                              <h5 className="text-zinc-300 text-sm font-medium mb-2">
                                Request Body
                              </h5>
                              <pre className="text-xs text-slate-400 overflow-x-auto">
                                {`{
  "market": "APT/USD",
  "side": "buy",
  "type": "limit",
  "price": "5.25",
  "quantity": "100",
  "leverage": "1"
}`}
                              </pre>
                            </div>
                          </div>

                          <div className="border border-zinc-700 rounded-lg p-4">
                            <div className="flex items-center gap-3 mb-3">
                              <Badge
                                variant="outline"
                                className="border-purple-500/30 text-purple-400 bg-purple-500/10"
                              >
                                WS
                              </Badge>
                              <code className="text-zinc-300 font-mono">/api/v1/ws</code>
                            </div>
                            <p className="text-slate-400 text-sm mb-3">
                              WebSocket connection for real-time market data
                            </p>
                            <div className="bg-zinc-800/50 rounded p-3">
                              <h5 className="text-zinc-300 text-sm font-medium mb-2">
                                Subscribe Message
                              </h5>
                              <pre className="text-xs text-slate-400 overflow-x-auto">
                                {`{
  "type": "subscribe",
  "channels": ["ticker", "trades", "orderbook"],
  "market": "APT/USD"
}`}
                              </pre>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-xl border border-zinc-700 bg-zinc-900/30 p-6">
                        <h3 className="font-semibold text-zinc-300 mb-4 text-lg">Authentication</h3>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <h4 className="font-medium text-zinc-300 mb-3">
                              API Key Authentication
                            </h4>
                            <ul className="space-y-2 text-sm text-slate-400">
                              <li>• Generate API keys in account settings</li>
                              <li>• Include in X-API-Key header</li>
                              <li>• Use for private endpoints</li>
                              <li>• Rotate keys regularly for security</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium text-zinc-300 mb-3">Rate Limits</h4>
                            <ul className="space-y-2 text-sm text-slate-400">
                              <li>• 1000 requests per minute (public)</li>
                              <li>• 100 requests per minute (private)</li>
                              <li>• WebSocket: 100 messages per second</li>
                              <li>• Rate limit headers included in responses</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Trading Guide */}
              <section id="trading-guide" className="scroll-mt-8">
                <Card className="border-zinc-800 bg-slate-900/30 backdrop-blur">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📈</span>
                      <CardTitle className="text-2xl text-white">Trading Interface</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      <div className="grid gap-6 lg:grid-cols-2">
                        <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-6">
                          <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                            <span className="text-zinc-400">📊</span>
                            Charts & Analysis
                          </h4>
                          <ul className="space-y-3 text-sm text-slate-400">
                            <li className="flex items-start gap-2">
                              <span className="text-zinc-400 mt-1">•</span>
                              <span>
                                <strong className="text-zinc-300">Candlestick Charts:</strong>{' '}
                                Multiple timeframes with technical indicators
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-zinc-400 mt-1">•</span>
                              <span>
                                <strong className="text-zinc-300">Order Book:</strong> Real-time
                                depth visualization
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-zinc-400 mt-1">•</span>
                              <span>
                                <strong className="text-zinc-300">Market Depth:</strong> Bid/ask
                                volume distribution
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-zinc-400 mt-1">•</span>
                              <span>
                                <strong className="text-zinc-300">Trade Tape:</strong> Recent
                                transaction history
                              </span>
                            </li>
                          </ul>
                        </div>

                        <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-6">
                          <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                            <span className="text-zinc-400">🎛️</span>
                            Order Management
                          </h4>
                          <ul className="space-y-3 text-sm text-slate-400">
                            <li className="flex items-start gap-2">
                              <span className="text-zinc-400 mt-1">•</span>
                              <span>
                                <strong className="text-zinc-300">Order Ticket:</strong>{' '}
                                Comprehensive order placement interface
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-zinc-400 mt-1">•</span>
                              <span>
                                <strong className="text-zinc-300">Position Manager:</strong>{' '}
                                Real-time P&L tracking
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-zinc-400 mt-1">•</span>
                              <span>
                                <strong className="text-zinc-300">Risk Dashboard:</strong> Margin
                                utilization and exposure
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-zinc-400 mt-1">•</span>
                              <span>
                                <strong className="text-zinc-300">Portfolio View:</strong> Asset
                                allocation and performance
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Order Types */}
              <section id="order-types" className="scroll-mt-8">
                <Card className="border-zinc-800 bg-slate-900/30 backdrop-blur">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📝</span>
                      <CardTitle className="text-2xl text-white">Order Types</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-zinc-600 rounded-lg flex items-center justify-center">
                              <span className="text-zinc-300 font-bold">M</span>
                            </div>
                            <div>
                              <h4 className="font-semibold text-white">Market Order</h4>
                              <Badge
                                variant="secondary"
                                className="text-xs bg-zinc-700 text-zinc-300"
                              >
                                Immediate Execution
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-slate-400 mb-3">
                            Execute immediately at the best available price in the order book.
                          </p>
                          <ul className="text-xs text-slate-500 space-y-1">
                            <li>• Guaranteed execution</li>
                            <li>• Price slippage possible</li>
                            <li>• Best for urgent trades</li>
                          </ul>
                        </div>

                        <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-zinc-600 rounded-lg flex items-center justify-center">
                              <span className="text-zinc-300 font-bold">L</span>
                            </div>
                            <div>
                              <h4 className="font-semibold text-white">Limit Order</h4>
                              <Badge
                                variant="secondary"
                                className="text-xs bg-zinc-700 text-zinc-300"
                              >
                                Price Target
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-slate-400 mb-3">
                            Set a specific price target for order execution.
                          </p>
                          <ul className="text-xs text-slate-500 space-y-1">
                            <li>• Price guarantee</li>
                            <li>• May not execute immediately</li>
                            <li>• Best for patient traders</li>
                          </ul>
                        </div>

                        <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-zinc-600 rounded-lg flex items-center justify-center">
                              <span className="text-zinc-300 font-bold">S</span>
                            </div>
                            <div>
                              <h4 className="font-semibold text-white">Stop Order</h4>
                              <Badge
                                variant="secondary"
                                className="text-xs bg-zinc-700 text-zinc-300"
                              >
                                Risk Management
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-slate-400 mb-3">
                            Automatically execute when price reaches a specified level.
                          </p>
                          <ul className="text-xs text-slate-500 space-y-1">
                            <li>• Risk management tool</li>
                            <li>• Converts to market order</li>
                            <li>• Helps limit losses</li>
                          </ul>
                        </div>
                      </div>

                      <div className="rounded-xl border border-zinc-700 bg-zinc-900/30 p-6">
                        <h3 className="font-semibold text-zinc-300 mb-4 text-lg">
                          Advanced Order Features
                        </h3>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <h4 className="font-medium text-zinc-300 mb-3">
                              Time-in-Force Options
                            </h4>
                            <ul className="space-y-2 text-sm text-slate-400">
                              <li>
                                • <strong className="text-zinc-300">GTC:</strong> Good &apos;Til
                                Canceled
                              </li>
                              <li>
                                • <strong className="text-zinc-300">IOC:</strong> Immediate or
                                Cancel
                              </li>
                              <li>
                                • <strong className="text-zinc-300">FOK:</strong> Fill or Kill
                              </li>
                              <li>
                                • <strong className="text-zinc-300">GTD:</strong> Good &apos;Til
                                Date
                              </li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium text-zinc-300 mb-3">Execution Options</h4>
                            <ul className="space-y-2 text-sm text-slate-400">
                              <li>
                                • <strong className="text-zinc-300">Post-Only:</strong> Maker orders
                                only
                              </li>
                              <li>
                                • <strong className="text-zinc-300">Reduce-Only:</strong> Position
                                reduction only
                              </li>
                              <li>
                                • <strong className="text-zinc-300">Bracket Orders:</strong>{' '}
                                OCO/Bracket groups
                              </li>
                              <li>
                                • <strong className="text-zinc-300">Iceberg:</strong> Hidden large
                                orders
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Options Pricing */}
              <section id="options-pricing" className="scroll-mt-8">
                <Card className="border-zinc-800 bg-slate-900/30 backdrop-blur">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🧮</span>
                      <CardTitle className="text-2xl text-white">Options Pricing</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      <p className="text-slate-300 text-lg">
                        Apex uses advanced mathematical models to price options contracts, ensuring
                        fair and efficient market pricing.
                      </p>

                      <div className="grid gap-6 lg:grid-cols-2">
                        <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-6">
                          <h4 className="font-semibold text-white mb-4">Black-Scholes Model</h4>
                          <div className="space-y-4">
                            <p className="text-sm text-slate-400">
                              The foundation of modern options pricing, adapted for blockchain
                              execution.
                            </p>
                            <div className="bg-zinc-800/50 p-4 rounded-lg">
                              <code className="text-xs text-zinc-300 font-mono">
                                C = S₀N(d₁) - Ke^(-rT)N(d₂)
                                <br />P = Ke^(-rT)N(-d₂) - S₀N(-d₁)
                              </code>
                            </div>
                            <ul className="text-sm text-slate-400 space-y-1">
                              <li>
                                • <strong className="text-zinc-300">S₀:</strong> Current stock price
                              </li>
                              <li>
                                • <strong className="text-zinc-300">K:</strong> Strike price
                              </li>
                              <li>
                                • <strong className="text-zinc-300">T:</strong> Time to expiration
                              </li>
                              <li>
                                • <strong className="text-zinc-300">r:</strong> Risk-free rate
                              </li>
                              <li>
                                • <strong className="text-zinc-300">σ:</strong> Volatility
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-6">
                          <h4 className="font-semibold text-white mb-4">Greeks Parameters</h4>
                          <div className="space-y-4">
                            <div className="grid gap-3">
                              <div className="flex justify-between items-center p-3 bg-zinc-800/50 rounded">
                                <span className="text-zinc-300 font-medium">Delta (Δ)</span>
                                <span className="text-slate-400 text-sm">Price sensitivity</span>
                              </div>
                              <div className="flex justify-between items-center p-3 bg-zinc-800/50 rounded">
                                <span className="text-zinc-300 font-medium">Gamma (Γ)</span>
                                <span className="text-slate-400 text-sm">Delta sensitivity</span>
                              </div>
                              <div className="flex justify-between items-center p-3 bg-zinc-800/50 rounded">
                                <span className="text-zinc-300 font-medium">Theta (Θ)</span>
                                <span className="text-slate-400 text-sm">Time decay</span>
                              </div>
                              <div className="flex justify-between items-center p-3 bg-zinc-800/50 rounded">
                                <span className="text-zinc-300 font-medium">Vega (V)</span>
                                <span className="text-slate-400 text-sm">
                                  Volatility sensitivity
                                </span>
                              </div>
                              <div className="flex justify-between items-center p-3 bg-zinc-800/50 rounded">
                                <span className="text-zinc-300 font-medium">Rho (ρ)</span>
                                <span className="text-slate-400 text-sm">
                                  Interest rate sensitivity
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-xl border border-zinc-700 bg-zinc-900/30 p-6">
                        <h3 className="font-semibold text-zinc-300 mb-4 text-lg">
                          Pricing Adjustments
                        </h3>
                        <div className="grid gap-4 md:grid-cols-3">
                          <div>
                            <h4 className="font-medium text-zinc-300 mb-3">Volatility Skew</h4>
                            <p className="text-sm text-slate-400">
                              Accounts for the tendency of options with different strikes to have
                              different implied volatilities.
                            </p>
                          </div>
                          <div>
                            <h4 className="font-medium text-zinc-300 mb-3">Jump Diffusion</h4>
                            <p className="text-sm text-slate-400">
                              Incorporates sudden price jumps that can occur in cryptocurrency
                              markets.
                            </p>
                          </div>
                          <div>
                            <h4 className="font-medium text-zinc-300 mb-3">Liquidity Premium</h4>
                            <p className="text-sm text-slate-400">
                              Adjusts pricing based on order book depth and available liquidity.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Strategies */}
              <section id="strategies" className="scroll-mt-8">
                <Card className="border-zinc-800 bg-slate-900/30 backdrop-blur">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🎯</span>
                      <CardTitle className="text-2xl text-white">Trading Strategies</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-6">
                          <h4 className="font-semibold text-white mb-3">Long Call</h4>
                          <Badge
                            variant="secondary"
                            className="text-xs bg-green-500/20 text-green-400 mb-3"
                          >
                            Bullish
                          </Badge>
                          <p className="text-sm text-slate-400 mb-4">
                            Buy a call option expecting the underlying asset to rise.
                          </p>
                          <div className="text-xs text-slate-500">
                            <div className="flex justify-between">
                              <span>Max Loss:</span>
                              <span className="text-red-400">Premium Paid</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Max Profit:</span>
                              <span className="text-green-400">Unlimited</span>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-6">
                          <h4 className="font-semibold text-white mb-3">Covered Call</h4>
                          <Badge
                            variant="secondary"
                            className="text-xs bg-blue-500/20 text-blue-400 mb-3"
                          >
                            Income
                          </Badge>
                          <p className="text-sm text-slate-400 mb-4">
                            Sell call options against owned assets to generate income.
                          </p>
                          <div className="text-xs text-slate-500">
                            <div className="flex justify-between">
                              <span>Max Loss:</span>
                              <span className="text-red-400">Asset Value - Premium</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Max Profit:</span>
                              <span className="text-green-400">Strike Price + Premium</span>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-6">
                          <h4 className="font-semibold text-white mb-3">Iron Condor</h4>
                          <Badge
                            variant="secondary"
                            className="text-xs bg-purple-500/20 text-purple-400 mb-3"
                          >
                            Neutral
                          </Badge>
                          <p className="text-sm text-slate-400 mb-4">
                            Sell out-of-money calls and puts with protective positions.
                          </p>
                          <div className="text-xs text-slate-500">
                            <div className="flex justify-between">
                              <span>Max Loss:</span>
                              <span className="text-red-400">Net Premium Received</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Max Profit:</span>
                              <span className="text-green-400">Limited</span>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-6">
                          <h4 className="font-semibold text-white mb-3">Bull Call Spread</h4>
                          <Badge
                            variant="secondary"
                            className="text-xs bg-green-500/20 text-green-400 mb-3"
                          >
                            Bullish
                          </Badge>
                          <p className="text-sm text-slate-400 mb-4">
                            Buy call, sell higher strike call for defined risk.
                          </p>
                          <div className="text-xs text-slate-500">
                            <div className="flex justify-between">
                              <span>Max Loss:</span>
                              <span className="text-red-400">Net Premium Paid</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Max Profit:</span>
                              <span className="text-green-400">
                                Strike Difference - Net Premium
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-6">
                          <h4 className="font-semibold text-white mb-3">Protective Put</h4>
                          <Badge
                            variant="secondary"
                            className="text-xs bg-orange-500/20 text-orange-400 mb-3"
                          >
                            Protective
                          </Badge>
                          <p className="text-sm text-slate-400 mb-4">
                            Buy puts to protect long positions from downside risk.
                          </p>
                          <div className="text-xs text-slate-500">
                            <div className="flex justify-between">
                              <span>Max Loss:</span>
                              <span className="text-red-400">Strike - Asset Price + Premium</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Max Profit:</span>
                              <span className="text-green-400">Unlimited</span>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-6">
                          <h4 className="font-semibold text-white mb-3">Straddle</h4>
                          <Badge
                            variant="secondary"
                            className="text-xs bg-yellow-500/20 text-yellow-400 mb-3"
                          >
                            Volatility
                          </Badge>
                          <p className="text-sm text-slate-400 mb-4">
                            Buy both call and put at same strike for volatility plays.
                          </p>
                          <div className="text-xs text-slate-500">
                            <div className="flex justify-between">
                              <span>Max Loss:</span>
                              <span className="text-red-400">Total Premium Paid</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Max Profit:</span>
                              <span className="text-green-400">Unlimited</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-xl border border-zinc-700 bg-zinc-900/30 p-6">
                        <h3 className="font-semibold text-zinc-300 mb-4 text-lg">
                          Strategy Builder
                        </h3>
                        <p className="text-slate-400 mb-4">
                          Use our visual strategy builder to combine multiple options legs and
                          visualize payoff diagrams in real-time.
                        </p>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <h4 className="font-medium text-zinc-300 mb-3">Visual Payoff Charts</h4>
                            <ul className="space-y-1 text-sm text-slate-400">
                              <li>• Real-time profit/loss visualization</li>
                              <li>• Break-even analysis</li>
                              <li>• Risk/reward metrics</li>
                              <li>• Greeks exposure display</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium text-zinc-300 mb-3">Multi-leg Support</h4>
                            <ul className="space-y-1 text-sm text-slate-400">
                              <li>• Up to 8 legs per strategy</li>
                              <li>• Complex combinations</li>
                              <li>• Position sizing optimization</li>
                              <li>• Automated execution</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Risk Management */}
              <section id="risk-management" className="scroll-mt-8">
                <Card className="border-zinc-800 bg-slate-900/30 backdrop-blur">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">⚠️</span>
                      <CardTitle className="text-2xl text-white">Risk Management</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-6">
                        <h4 className="font-semibold text-red-300 mb-4 text-lg">
                          ⚠️ Important Risk Warnings
                        </h4>
                        <div className="grid gap-4 md:grid-cols-2">
                          <ul className="space-y-3 text-slate-300">
                            <li className="flex items-start gap-2">
                              <span className="text-red-400 mt-1">•</span>
                              <span>
                                Options trading involves substantial risk and may not be suitable
                                for all investors
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-red-400 mt-1">•</span>
                              <span>
                                You may lose your entire investment in a short period of time
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-red-400 mt-1">•</span>
                              <span>Only trade with funds you can afford to lose completely</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-red-400 mt-1">•</span>
                              <span>Past performance does not guarantee future results</span>
                            </li>
                          </ul>
                          <ul className="space-y-3 text-slate-300">
                            <li className="flex items-start gap-2">
                              <span className="text-red-400 mt-1">•</span>
                              <span>
                                Options are complex instruments and require advanced knowledge
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-red-400 mt-1">•</span>
                              <span>Time decay can significantly affect option values</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-red-400 mt-1">•</span>
                              <span>Leverage can amplify both gains and losses</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-red-400 mt-1">•</span>
                              <span>Always test strategies on testnet first</span>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-6">
                          <h4 className="font-semibold text-white mb-4">Position Sizing Rules</h4>
                          <ul className="space-y-3 text-sm text-slate-400">
                            <li className="flex items-start gap-2">
                              <span className="text-zinc-400 mt-1">•</span>
                              <span>
                                <strong className="text-zinc-300">1% Rule:</strong> Never risk more
                                than 1% of portfolio per trade
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-zinc-400 mt-1">•</span>
                              <span>
                                <strong className="text-zinc-300">2% Rule:</strong> Maximum 2% total
                                portfolio risk per strategy
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-zinc-400 mt-1">•</span>
                              <span>
                                <strong className="text-zinc-300">5% Rule:</strong> No more than 5%
                                in any single underlying asset
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-zinc-400 mt-1">•</span>
                              <span>
                                <strong className="text-zinc-300">10% Rule:</strong> Maximum 10%
                                portfolio exposure to options
                              </span>
                            </li>
                          </ul>
                        </div>

                        <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-6">
                          <h4 className="font-semibold text-white mb-4">Risk Metrics to Monitor</h4>
                          <ul className="space-y-3 text-sm text-slate-400">
                            <li className="flex items-start gap-2">
                              <span className="text-zinc-400 mt-1">•</span>
                              <span>
                                <strong className="text-zinc-300">Delta:</strong> Overall
                                directional exposure
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-zinc-400 mt-1">•</span>
                              <span>
                                <strong className="text-zinc-300">Gamma:</strong> Exposure to price
                                movement
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-zinc-400 mt-1">•</span>
                              <span>
                                <strong className="text-zinc-300">Theta:</strong> Time decay impact
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-zinc-400 mt-1">•</span>
                              <span>
                                <strong className="text-zinc-300">Vega:</strong> Volatility
                                sensitivity
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="rounded-xl border border-zinc-700 bg-zinc-900/30 p-6">
                        <h3 className="font-semibold text-zinc-300 mb-4 text-lg">
                          Advanced Risk Controls
                        </h3>
                        <div className="grid gap-4 md:grid-cols-3">
                          <div>
                            <h4 className="font-medium text-zinc-300 mb-3">Stop Loss Orders</h4>
                            <p className="text-sm text-slate-400">
                              Automatic position closure at predefined loss levels to limit downside
                              risk.
                            </p>
                          </div>
                          <div>
                            <h4 className="font-medium text-zinc-300 mb-3">Position Limits</h4>
                            <p className="text-sm text-slate-400">
                              Maximum position sizes and exposure limits to prevent
                              over-concentration.
                            </p>
                          </div>
                          <div>
                            <h4 className="font-medium text-zinc-300 mb-3">Circuit Breakers</h4>
                            <p className="text-sm text-slate-400">
                              Trading halts during extreme volatility to prevent panic selling.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Market Data */}
              <section id="market-data" className="scroll-mt-8">
                <Card className="border-zinc-800 bg-slate-900/30 backdrop-blur">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📊</span>
                      <CardTitle className="text-2xl text-white">Market Data</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      <p className="text-slate-300 text-lg">
                        Apex provides comprehensive market data through multiple sources and
                        delivery methods to ensure traders have access to real-time and historical
                        information.
                      </p>

                      <div className="grid gap-6 lg:grid-cols-2">
                        <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-6">
                          <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                            <span className="text-zinc-400">📡</span>
                            Data Sources
                          </h4>
                          <ul className="space-y-3 text-sm text-slate-400">
                            <li className="flex items-start gap-2">
                              <span className="text-zinc-400 mt-1">•</span>
                              <span>
                                <strong className="text-zinc-300">Pyth Network:</strong>{' '}
                                Decentralized price feeds with 50+ data providers
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-zinc-400 mt-1">•</span>
                              <span>
                                <strong className="text-zinc-300">On-chain Data:</strong> Direct
                                blockchain price discovery
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-zinc-400 mt-1">•</span>
                              <span>
                                <strong className="text-zinc-300">Order Book:</strong> Real-time
                                bid/ask depth and liquidity
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-zinc-400 mt-1">•</span>
                              <span>
                                <strong className="text-zinc-300">Trade History:</strong> Complete
                                transaction records
                              </span>
                            </li>
                          </ul>
                        </div>

                        <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-6">
                          <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                            <span className="text-zinc-400">⚡</span>
                            Data Delivery
                          </h4>
                          <ul className="space-y-3 text-sm text-slate-400">
                            <li className="flex items-start gap-2">
                              <span className="text-zinc-400 mt-1">•</span>
                              <span>
                                <strong className="text-zinc-300">WebSocket:</strong> Real-time
                                streaming for live updates
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-zinc-400 mt-1">•</span>
                              <span>
                                <strong className="text-zinc-300">REST API:</strong> Historical data
                                and snapshots
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-zinc-400 mt-1">•</span>
                              <span>
                                <strong className="text-zinc-300">IPFS:</strong> Decentralized data
                                storage
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-zinc-400 mt-1">•</span>
                              <span>
                                <strong className="text-zinc-300">Filecoin:</strong> Long-term data
                                archiving
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="rounded-xl border border-zinc-700 bg-zinc-900/30 p-6">
                        <h3 className="font-semibold text-zinc-300 mb-4 text-lg">
                          Data Quality & Reliability
                        </h3>
                        <div className="grid gap-4 md:grid-cols-3">
                          <div>
                            <h4 className="font-medium text-zinc-300 mb-3">Price Accuracy</h4>
                            <ul className="space-y-1 text-sm text-slate-400">
                              <li>• Sub-millisecond latency</li>
                              <li>• Cross-market validation</li>
                              <li>• Outlier detection algorithms</li>
                              <li>• Consensus-based pricing</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium text-zinc-300 mb-3">Data Integrity</h4>
                            <ul className="space-y-1 text-sm text-slate-400">
                              <li>• Cryptographic signatures</li>
                              <li>• Timestamp verification</li>
                              <li>• Chain of custody tracking</li>
                              <li>• Audit trail maintenance</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium text-zinc-300 mb-3">Availability</h4>
                            <ul className="space-y-1 text-sm text-slate-400">
                              <li>• 99.9% uptime guarantee</li>
                              <li>• Multi-region replication</li>
                              <li>• Automatic failover</li>
                              <li>• Disaster recovery</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Integration */}
              <section id="integration" className="scroll-mt-8">
                <Card className="border-zinc-800 bg-slate-900/30 backdrop-blur">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🔗</span>
                      <CardTitle className="text-2xl text-white">Integration Guide</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      <p className="text-slate-300 text-lg">
                        Integrate Apex into your applications with our comprehensive SDKs, APIs, and
                        developer tools.
                      </p>

                      <div className="grid gap-6 lg:grid-cols-2">
                        <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-6">
                          <h4 className="font-semibold text-white mb-4">SDKs & Libraries</h4>
                          <div className="space-y-4">
                            <div className="p-4 bg-zinc-800/50 rounded-lg">
                              <h5 className="font-medium text-zinc-300 mb-2">
                                JavaScript/TypeScript SDK
                              </h5>
                              <p className="text-sm text-slate-400 mb-2">
                                Complete SDK for web applications with React hooks and utilities.
                              </p>
                              <code className="text-xs text-zinc-300 bg-zinc-900 p-2 rounded block">
                                npm install @apex/trading-sdk
                              </code>
                            </div>

                            <div className="p-4 bg-zinc-800/50 rounded-lg">
                              <h5 className="font-medium text-zinc-300 mb-2">Python SDK</h5>
                              <p className="text-sm text-slate-400 mb-2">
                                Python library for algorithmic trading and data analysis.
                              </p>
                              <code className="text-xs text-zinc-300 bg-zinc-900 p-2 rounded block">
                                pip install apex-trading
                              </code>
                            </div>

                            <div className="p-4 bg-zinc-800/50 rounded-lg">
                              <h5 className="font-medium text-zinc-300 mb-2">Rust SDK</h5>
                              <p className="text-sm text-slate-400 mb-2">
                                High-performance Rust library for trading systems.
                              </p>
                              <code className="text-xs text-zinc-300 bg-zinc-900 p-2 rounded block">
                                cargo add apex-trading-sdk
                              </code>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-6">
                          <h4 className="font-semibold text-white mb-4">Integration Examples</h4>
                          <div className="space-y-4">
                            <div className="p-4 bg-zinc-800/50 rounded-lg">
                              <h5 className="font-medium text-zinc-300 mb-2">
                                Basic Order Placement
                              </h5>
                              <pre className="text-xs text-slate-400 overflow-x-auto">
                                {`import { ApexClient } from '@apex/trading-sdk';

const client = new ApexClient({
  apiKey: 'your-api-key',
  network: 'mainnet'
});

const order = await client.placeOrder({
  market: 'APT/USD',
  side: 'buy',
  type: 'limit',
  price: 5.25,
  quantity: 100
});`}
                              </pre>
                            </div>

                            <div className="p-4 bg-zinc-800/50 rounded-lg">
                              <h5 className="font-medium text-zinc-300 mb-2">
                                Real-time Data Stream
                              </h5>
                              <pre className="text-xs text-slate-400 overflow-x-auto">
                                {`const subscription = client.subscribe('ticker', (data) => {
  console.log('Price update:', data);
});

// Cleanup
subscription.unsubscribe();`}
                              </pre>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-xl border border-zinc-700 bg-zinc-900/30 p-6">
                        <h3 className="font-semibold text-zinc-300 mb-4 text-lg">
                          Webhooks & Callbacks
                        </h3>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <h4 className="font-medium text-zinc-300 mb-3">Order Events</h4>
                            <ul className="space-y-1 text-sm text-slate-400">
                              <li>• order_placed - New order created</li>
                              <li>• order_filled - Order partially/fully filled</li>
                              <li>• order_cancelled - Order cancelled</li>
                              <li>• order_expired - Order expired</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium text-zinc-300 mb-3">Market Events</h4>
                            <ul className="space-y-1 text-sm text-slate-400">
                              <li>• trade_executed - New trade occurred</li>
                              <li>• price_update - Price change notification</li>
                              <li>• market_status - Market status change</li>
                              <li>• liquidation - Position liquidation</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Security */}
              <section id="security" className="scroll-mt-8">
                <Card className="border-zinc-800 bg-slate-900/30 backdrop-blur">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🔒</span>
                      <CardTitle className="text-2xl text-white">Security & Audits</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      <p className="text-slate-300 text-lg">
                        Security is our highest priority. Apex employs multiple layers of protection
                        and undergoes regular independent audits.
                      </p>

                      <div className="grid gap-6 lg:grid-cols-2">
                        <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-6">
                          <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                            <span className="text-zinc-400">🛡️</span>
                            Security Measures
                          </h4>
                          <ul className="space-y-3 text-sm text-slate-400">
                            <li className="flex items-start gap-2">
                              <span className="text-zinc-400 mt-1">•</span>
                              <span>
                                <strong className="text-zinc-300">Multi-signature:</strong> All
                                critical operations require multiple approvals
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-zinc-400 mt-1">•</span>
                              <span>
                                <strong className="text-zinc-300">Time-locked:</strong> Emergency
                                changes have mandatory delay periods
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-zinc-400 mt-1">•</span>
                              <span>
                                <strong className="text-zinc-300">Circuit Breakers:</strong>{' '}
                                Automatic trading halts during extreme volatility
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-zinc-400 mt-1">•</span>
                              <span>
                                <strong className="text-zinc-300">Insurance Fund:</strong> Dedicated
                                fund for covering potential losses
                              </span>
                            </li>
                          </ul>
                        </div>

                        <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-6">
                          <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                            <span className="text-zinc-400">🔍</span>
                            Audit History
                          </h4>
                          <div className="space-y-4">
                            <div className="p-3 bg-zinc-800/50 rounded">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-zinc-300 font-medium">Trail of Bits</span>
                                <Badge
                                  variant="secondary"
                                  className="text-xs bg-green-500/20 text-green-400"
                                >
                                  Completed
                                </Badge>
                              </div>
                              <p className="text-xs text-slate-400">
                                Smart contract security audit - March 2024
                              </p>
                            </div>

                            <div className="p-3 bg-zinc-800/50 rounded">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-zinc-300 font-medium">OpenZeppelin</span>
                                <Badge
                                  variant="secondary"
                                  className="text-xs bg-green-500/20 text-green-400"
                                >
                                  Completed
                                </Badge>
                              </div>
                              <p className="text-xs text-slate-400">
                                Protocol review and recommendations - February 2024
                              </p>
                            </div>

                            <div className="p-3 bg-zinc-800/50 rounded">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-zinc-300 font-medium">Certora</span>
                                <Badge
                                  variant="secondary"
                                  className="text-xs bg-yellow-500/20 text-yellow-400"
                                >
                                  In Progress
                                </Badge>
                              </div>
                              <p className="text-xs text-slate-400">
                                Formal verification of core contracts - Ongoing
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-xl border border-zinc-700 bg-zinc-900/30 p-6">
                        <h3 className="font-semibold text-zinc-300 mb-4 text-lg">
                          Bug Bounty Program
                        </h3>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <h4 className="font-medium text-zinc-300 mb-3">Reward Tiers</h4>
                            <ul className="space-y-2 text-sm text-slate-400">
                              <li>
                                • <strong className="text-zinc-300">Critical:</strong> $100,000 -
                                Protocol-breaking vulnerabilities
                              </li>
                              <li>
                                • <strong className="text-zinc-300">High:</strong> $25,000 - Major
                                fund loss potential
                              </li>
                              <li>
                                • <strong className="text-zinc-300">Medium:</strong> $5,000 -
                                Limited fund impact
                              </li>
                              <li>
                                • <strong className="text-zinc-300">Low:</strong> $1,000 - Minor
                                issues
                              </li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium text-zinc-300 mb-3">Program Details</h4>
                            <ul className="space-y-2 text-sm text-slate-400">
                              <li>• Public disclosure after fix</li>
                              <li>• No restrictions on participants</li>
                              <li>• Continuous assessment</li>
                              <li>• Quarterly leaderboard rewards</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Performance */}
              <section id="performance" className="scroll-mt-8">
                <Card className="border-zinc-800 bg-slate-900/30 backdrop-blur">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">⚡</span>
                      <CardTitle className="text-2xl text-white">Performance Metrics</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      <div className="grid gap-6 lg:grid-cols-3">
                        <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-6 text-center">
                          <div className="text-3xl font-bold text-zinc-300 mb-2">&lt;100ms</div>
                          <h4 className="font-semibold text-white mb-2">Order Execution</h4>
                          <p className="text-sm text-slate-400">
                            Average time from order submission to confirmation
                          </p>
                        </div>

                        <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-6 text-center">
                          <div className="text-3xl font-bold text-zinc-300 mb-2">10,000+</div>
                          <h4 className="font-semibold text-white mb-2">Orders/Second</h4>
                          <p className="text-sm text-slate-400">
                            Maximum throughput during peak trading hours
                          </p>
                        </div>

                        <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-6 text-center">
                          <div className="text-3xl font-bold text-zinc-300 mb-2">99.9%</div>
                          <h4 className="font-semibold text-white mb-2">Uptime</h4>
                          <p className="text-sm text-slate-400">Service availability guarantee</p>
                        </div>
                      </div>

                      <div className="grid gap-6 lg:grid-cols-2">
                        <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-6">
                          <h4 className="font-semibold text-white mb-4">Latency Breakdown</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-zinc-800/50 rounded">
                              <span className="text-zinc-300">Network Propagation</span>
                              <span className="text-slate-400">~50ms</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-zinc-800/50 rounded">
                              <span className="text-zinc-300">Order Matching</span>
                              <span className="text-slate-400">&lt;5ms</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-zinc-800/50 rounded">
                              <span className="text-zinc-300">Settlement</span>
                              <span className="text-slate-400">~25ms</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-zinc-800/50 rounded">
                              <span className="text-zinc-300">Confirmation</span>
                              <span className="text-slate-400">~20ms</span>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-6">
                          <h4 className="font-semibold text-white mb-4">Scalability Features</h4>
                          <ul className="space-y-3 text-sm text-slate-400">
                            <li className="flex items-start gap-2">
                              <span className="text-zinc-400 mt-1">•</span>
                              <span>
                                <strong className="text-zinc-300">Horizontal Scaling:</strong>{' '}
                                Multiple matching engines
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-zinc-400 mt-1">•</span>
                              <span>
                                <strong className="text-zinc-300">Load Balancing:</strong> Automatic
                                traffic distribution
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-zinc-400 mt-1">•</span>
                              <span>
                                <strong className="text-zinc-300">Caching Layer:</strong>{' '}
                                Redis-based performance optimization
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-zinc-400 mt-1">•</span>
                              <span>
                                <strong className="text-zinc-300">CDN Integration:</strong> Global
                                content delivery
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Troubleshooting */}
              <section id="troubleshooting" className="scroll-mt-8">
                <Card className="border-zinc-800 bg-slate-900/30 backdrop-blur">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🔧</span>
                      <CardTitle className="text-2xl text-white">Troubleshooting</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      <div className="rounded-xl bg-zinc-900/50 border border-zinc-700 p-6">
                        <h3 className="font-semibold text-zinc-300 mb-6 text-lg">
                          Common Issues & Solutions
                        </h3>
                        <div className="space-y-6">
                          <div className="border border-zinc-700 rounded-lg p-4">
                            <div className="flex items-center gap-3 mb-3">
                              <Badge
                                variant="outline"
                                className="border-red-500/30 text-red-400 bg-red-500/10"
                              >
                                Issue
                              </Badge>
                              <h4 className="font-semibold text-white">Transaction Failed</h4>
                            </div>
                            <p className="text-slate-400 text-sm mb-3">
                              Transaction submission failed with error message.
                            </p>
                            <div className="space-y-2">
                              <h5 className="text-zinc-300 text-sm font-medium">
                                Possible Causes:
                              </h5>
                              <ul className="text-sm text-slate-400 space-y-1 ml-4">
                                <li>• Insufficient gas fees</li>
                                <li>• Network congestion</li>
                                <li>• Invalid order parameters</li>
                                <li>• Wallet connection issues</li>
                              </ul>
                            </div>
                            <div className="mt-4 p-3 bg-zinc-800/50 rounded">
                              <h5 className="text-zinc-300 text-sm font-medium mb-2">Solutions:</h5>
                              <ul className="text-sm text-slate-400 space-y-1">
                                <li>1. Check wallet balance and gas fees</li>
                                <li>2. Try again during off-peak hours</li>
                                <li>3. Verify order parameters are valid</li>
                                <li>4. Refresh wallet connection</li>
                              </ul>
                            </div>
                          </div>

                          <div className="border border-zinc-700 rounded-lg p-4">
                            <div className="flex items-center gap-3 mb-3">
                              <Badge
                                variant="outline"
                                className="border-yellow-500/30 text-yellow-400 bg-yellow-500/10"
                              >
                                Issue
                              </Badge>
                              <h4 className="font-semibold text-white">Slow Performance</h4>
                            </div>
                            <p className="text-slate-400 text-sm mb-3">
                              Interface is slow or unresponsive.
                            </p>
                            <div className="space-y-2">
                              <h5 className="text-zinc-300 text-sm font-medium">
                                Possible Causes:
                              </h5>
                              <ul className="text-sm text-slate-400 space-y-1 ml-4">
                                <li>• Browser cache issues</li>
                                <li>• Network connectivity problems</li>
                                <li>• High system load</li>
                                <li>• Outdated browser version</li>
                              </ul>
                            </div>
                            <div className="mt-4 p-3 bg-zinc-800/50 rounded">
                              <h5 className="text-zinc-300 text-sm font-medium mb-2">Solutions:</h5>
                              <ul className="text-sm text-slate-400 space-y-1">
                                <li>1. Hard refresh (Ctrl+Shift+R)</li>
                                <li>2. Check internet connection</li>
                                <li>3. Close other browser tabs</li>
                                <li>4. Update browser to latest version</li>
                              </ul>
                            </div>
                          </div>

                          <div className="border border-zinc-700 rounded-lg p-4">
                            <div className="flex items-center gap-3 mb-3">
                              <Badge
                                variant="outline"
                                className="border-blue-500/30 text-blue-400 bg-blue-500/10"
                              >
                                Issue
                              </Badge>
                              <h4 className="font-semibold text-white">Wallet Connection Failed</h4>
                            </div>
                            <p className="text-slate-400 text-sm mb-3">
                              Unable to connect wallet extension.
                            </p>
                            <div className="space-y-2">
                              <h5 className="text-zinc-300 text-sm font-medium">
                                Possible Causes:
                              </h5>
                              <ul className="text-sm text-slate-400 space-y-1 ml-4">
                                <li>• Wallet extension not installed</li>
                                <li>• Browser permissions blocked</li>
                                <li>• Wallet locked or logged out</li>
                                <li>• Incorrect network selected</li>
                              </ul>
                            </div>
                            <div className="mt-4 p-3 bg-zinc-800/50 rounded">
                              <h5 className="text-zinc-300 text-sm font-medium mb-2">Solutions:</h5>
                              <ul className="text-sm text-slate-400 space-y-1">
                                <li>1. Install wallet extension</li>
                                <li>2. Grant website permissions</li>
                                <li>3. Unlock wallet and login</li>
                                <li>4. Switch to Aptos network</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-xl border border-zinc-700 bg-zinc-900/30 p-6">
                        <h3 className="font-semibold text-zinc-300 mb-4 text-lg">Getting Help</h3>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <h4 className="font-medium text-zinc-300 mb-3">Support Channels</h4>
                            <ul className="space-y-2 text-sm text-slate-400">
                              <li>
                                • <strong className="text-zinc-300">Discord:</strong> Real-time
                                community support
                              </li>
                              <li>
                                • <strong className="text-zinc-300">GitHub:</strong> Bug reports and
                                feature requests
                              </li>
                              <li>
                                • <strong className="text-zinc-300">Documentation:</strong>{' '}
                                Comprehensive guides
                              </li>
                              <li>
                                • <strong className="text-zinc-300">Email:</strong>{' '}
                                support@apex.trade
                              </li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium text-zinc-300 mb-3">Diagnostic Tools</h4>
                            <ul className="space-y-2 text-sm text-slate-400">
                              <li>
                                • <strong className="text-zinc-300">System Status:</strong> Check
                                service availability
                              </li>
                              <li>
                                • <strong className="text-zinc-300">Network Test:</strong> Verify
                                connectivity
                              </li>
                              <li>
                                • <strong className="text-zinc-300">Log Viewer:</strong> Debug
                                information
                              </li>
                              <li>
                                • <strong className="text-zinc-300">Performance Monitor:</strong>{' '}
                                System metrics
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
