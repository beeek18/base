'use client';

import { ReactNode } from 'react';

import { AuthGuard } from '@/guard/auth-guard';

export default function MainLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <AuthGuard>{children}</AuthGuard>;
}
