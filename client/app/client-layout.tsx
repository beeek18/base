'use client';

import { ReactNode } from 'react';

import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/providers/auth-provider';
import { ReactQueryClientProvider } from '@/providers/react-query-client-provider';
import { ThemeProvider } from '@/providers/theme-provider';

export default function RootLayoutClient({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <ReactQueryClientProvider>
      <AuthProvider>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <main>{children}</main>
        </ThemeProvider>
      </AuthProvider>
      <Toaster />
    </ReactQueryClientProvider>
  );
}
