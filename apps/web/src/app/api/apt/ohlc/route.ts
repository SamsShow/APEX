import { NextResponse } from 'next/server';

// Returns OHLC candles compatible with Candles component
// Source: CoinGecko OHLC endpoint for APT/USD
// https://api.coingecko.com/api/v3/coins/aptos/ohlc?vs_currency=usd&days=1

export async function GET() {
  try {
    const url = 'https://api.coingecko.com/api/v3/coins/aptos/ohlc?vs_currency=usd&days=1';
    const res = await fetch(url, { next: { revalidate: 30 } });
    if (!res.ok) return NextResponse.json({ error: 'failed' }, { status: 502 });
    const data = (await res.json()) as number[][];
    // data rows: [timestamp(ms), open, high, low, close]
    const candles = data.map((row, i) => ({
      time: i,
      open: row[1],
      high: row[2],
      low: row[3],
      close: row[4],
    }));
    return NextResponse.json({ candles });
  } catch (e) {
    return NextResponse.json({ error: 'exception' }, { status: 500 });
  }
}
