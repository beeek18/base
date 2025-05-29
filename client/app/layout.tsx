import '../public/styles/globals.css';

import type { Metadata } from 'next';
import { ReactNode } from 'react';

import RootLayoutClient from './client-layout';
import { geistMono, geistSans } from '@/lib/fonts-google';

export const metadata: Metadata = {
  title: 'Client title',
  description: 'Client description',
  icons: '/favicon.ico',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang='ru'>
      <body className={`${geistSans.className} ${geistMono.variable} antialiased`}>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
