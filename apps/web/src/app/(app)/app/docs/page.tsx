import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DocsPage() {
  const sections = [
    { id: 'overview', title: 'Overview', icon: '📊' },
    { id: 'quick-start', title: 'Quick Start', icon: '🚀' },
    { id: 'architecture', title: 'Architecture', icon: '🏗️' },
    { id: 'api-reference', title: 'API Reference', icon: '📚' },
    { id: 'trading-guide', title: 'Trading Guide', icon: '📈' },
    { id: 'strategies', title: 'Strategies', icon: '🎯' },
    { id: 'risk-management', title: 'Risk Management', icon: '⚠️' },
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
            <span className="text-blue-400">📚</span>
            Documentation
          </div>
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">Apex Trading Platform</h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-400">
            High-frequency on-chain matching engine for multi-leg options on Aptos. Combining
            sub-second finality with atomic multi-leg execution.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Badge variant="outline" className="border-slate-700 text-slate-300">
              Options Trading
            </Badge>
            <Badge variant="outline" className="border-slate-700 text-slate-300">
              DeFi
            </Badge>
            <Badge variant="outline" className="border-slate-700 text-slate-300">
              Aptos
            </Badge>
            <Badge variant="outline" className="border-slate-700 text-slate-300">
              Web3
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
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
                      >
                        <span className="text-base">{section.icon}</span>
                        <span>{section.title}</span>
                      </button>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <div className="space-y-12">
              {/* Overview */}
              <section id="overview" className="scroll-mt-8">
                <Card className="border-slate-800 bg-slate-900/30 backdrop-blur">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📊</span>
                      <CardTitle className="text-2xl text-white">Overview</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="prose prose-invert max-w-none">
                    <p className="text-slate-300">
                      Apex is a cutting-edge decentralized options trading platform built on the
                      Aptos blockchain. It provides institutional-grade trading capabilities with
                      retail accessibility through innovative on-chain infrastructure.
                    </p>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
                        <h4 className="font-semibold text-white">Key Features</h4>
                        <ul className="mt-2 space-y-1 text-sm text-slate-400">
                          <li>• Multi-leg options trading</li>
                          <li>• Atomic execution</li>
                          <li>• Real-time price feeds</li>
                          <li>• Advanced risk management</li>
                        </ul>
                      </div>
                      <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
                        <h4 className="font-semibold text-white">Supported Assets</h4>
                        <ul className="mt-2 space-y-1 text-sm text-slate-400">
                          <li>• APT (Aptos)</li>
                          <li>• USDC</li>
                          <li>• BTC options</li>
                          <li>• ETH options</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Quick Start */}
              <section id="quick-start" className="scroll-mt-8">
                <Card className="border-slate-800 bg-slate-900/30 backdrop-blur">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🚀</span>
                      <CardTitle className="text-2xl text-white">Quick Start</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-6">
                        <h3 className="font-semibold text-blue-300 mb-3">Prerequisites</h3>
                        <ul className="space-y-2 text-slate-300">
                          <li className="flex items-start gap-2">
                            <span className="text-green-400 mt-1">✓</span>
                            <span>Aptos wallet (Petra, Martian, or Pontem)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-400 mt-1">✓</span>
                            <span>Testnet APT for trading</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-400 mt-1">✓</span>
                            <span>Modern web browser with Web3 support</span>
                          </li>
                        </ul>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
                          <div className="text-center">
                            <div className="text-2xl mb-2">1</div>
                            <h4 className="font-semibold text-white mb-2">Connect Wallet</h4>
                            <p className="text-sm text-slate-400">
                              Click "Connect" in the top navigation and select your Aptos wallet.
                            </p>
                          </div>
                        </div>
                        <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
                          <div className="text-center">
                            <div className="text-2xl mb-2">2</div>
                            <h4 className="font-semibold text-white mb-2">Fund Account</h4>
                            <p className="text-sm text-slate-400">
                              Deposit APT and USDC to your trading account.
                            </p>
                          </div>
                        </div>
                        <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
                          <div className="text-center">
                            <div className="text-2xl mb-2">3</div>
                            <h4 className="font-semibold text-white mb-2">Start Trading</h4>
                            <p className="text-sm text-slate-400">
                              Navigate to Trade and place your first options order.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Trading Guide */}
              <section id="trading-guide" className="scroll-mt-8">
                <Card className="border-slate-800 bg-slate-900/30 backdrop-blur">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📈</span>
                      <CardTitle className="text-2xl text-white">Trading Guide</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
                          <h4 className="font-semibold text-white mb-4">Order Types</h4>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-300">Market Order</span>
                              <Badge variant="secondary" className="text-xs">
                                Immediate
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-300">Limit Order</span>
                              <Badge variant="secondary" className="text-xs">
                                Price Target
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-300">Stop Order</span>
                              <Badge variant="secondary" className="text-xs">
                                Risk Mgmt
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
                          <h4 className="font-semibold text-white mb-4">Trading Interface</h4>
                          <div className="space-y-2 text-sm text-slate-400">
                            <div>• Real-time price charts</div>
                            <div>• Order book depth</div>
                            <div>• Position tracking</div>
                            <div>• Risk analytics</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Risk Management */}
              <section id="risk-management" className="scroll-mt-8">
                <Card className="border-slate-800 bg-slate-900/30 backdrop-blur">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">⚠️</span>
                      <CardTitle className="text-2xl text-white">Risk Management</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-6">
                        <h4 className="font-semibold text-red-300 mb-3">Important Risk Warnings</h4>
                        <ul className="space-y-2 text-slate-300">
                          <li className="flex items-start gap-2">
                            <span className="text-red-400 mt-1">⚠️</span>
                            <span>
                              Options trading involves substantial risk and may not be suitable for
                              all investors
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-red-400 mt-1">⚠️</span>
                            <span>
                              You may lose your entire investment in a short period of time
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-red-400 mt-1">⚠️</span>
                            <span>Only trade with funds you can afford to lose</span>
                          </li>
                        </ul>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
                          <h4 className="font-semibold text-white mb-4">Position Sizing</h4>
                          <ul className="space-y-2 text-sm text-slate-400">
                            <li>• Never risk more than 1-2% per trade</li>
                            <li>• Calculate position size based on stop loss</li>
                            <li>• Consider portfolio correlation</li>
                            <li>• Account for options theta decay</li>
                          </ul>
                        </div>

                        <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
                          <h4 className="font-semibold text-white mb-4">Risk Metrics</h4>
                          <ul className="space-y-2 text-sm text-slate-400">
                            <li>• Monitor delta exposure</li>
                            <li>• Track gamma and theta</li>
                            <li>• Calculate VaR (Value at Risk)</li>
                            <li>• Set maximum drawdown limits</li>
                          </ul>
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
