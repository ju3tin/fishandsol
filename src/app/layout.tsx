// app/layout.tsx
import { SolanaProviders } from './providers';

export const metadata = {
  title: 'Token Checker',
  description: 'Check SPL token ownership from Phantom wallet',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SolanaProviders>{children}</SolanaProviders>
      </body>
    </html>
  );
}
