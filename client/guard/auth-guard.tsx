'use client';

import { useAuthStore } from '@/store/auth-store';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

export function AuthGuard({ children }: Readonly<{ children: ReactNode }>) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/auth');
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) return <>{children}</>;

  return null;
}
