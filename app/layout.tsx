import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Pastebin Lite',
  description: 'Share text pastes with optional expiry',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
