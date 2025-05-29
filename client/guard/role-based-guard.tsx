'use client';

import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useMemo } from 'react';

import { UserRole, useAuthStore } from '@/store/auth-store';

interface RoleBasedGuardProps {
  children: ReactNode;
  roles: UserRole[];
}

export function RoleBasedGuard({ children, roles }: Readonly<RoleBasedGuardProps>) {
  const router = useRouter();
  const { user } = useAuthStore();

  const userRoles = useMemo(() => user?.roles ?? [], [user?.roles]);

  useEffect(() => {
    const hasAccess = userRoles.some((role) => roles.includes(role));
    if (!hasAccess) {
      router.replace('/dashboard');
    }
  }, [userRoles, roles, router]);

  const hasAccess = userRoles.some((role) => roles.includes(role));

  if (hasAccess) {
    return <>{children}</>;
  }

  return null;
}
