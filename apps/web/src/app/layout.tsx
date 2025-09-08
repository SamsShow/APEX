import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import '@fontsource/jersey-25';
import { WalletProvider } from '@/components/providers/WalletProvider';
import { NotificationProvider } from '@/hooks/useNotifications';
import { ThemeProvider } from '@/hooks/useTheme';
import { NotificationContainer } from '@/components/ui/notification-container';
import { ErrorBoundary } from '@/components/ui/error-boundary';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: {
    default: 'Apex — Hyper-fast On-chain Matching Engine',
    template: '%s — Apex',
  },
  description:
    'Apex is a high-frequency on-chain matching engine on Aptos for multi-leg options with atomic execution and sub-second finality.',
  icons: [
    { rel: 'icon', url: '/apexaptoswhite.svg' },
    { rel: 'shortcut icon', url: '/apexaptoswhite.svg' },
    { rel: 'apple-touch-icon', url: '/apexaptoswhite.svg' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ErrorBoundary
          onError={(error, errorInfo) => {
            // Log to external service in production
            console.error('Global Error Boundary:', error, errorInfo);
          }}
        >
          <ThemeProvider defaultTheme="system" storageKey="apex-theme">
            <WalletProvider>
              <NotificationProvider>
                {children}
                <NotificationContainer />
              </NotificationProvider>
            </WalletProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
