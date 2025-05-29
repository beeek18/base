import { RoleBasedGuard } from '@/guard/role-based-guard';
import { ReactNode } from 'react';

export default function AdminLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <RoleBasedGuard roles={['ADMIN']}>{children}</RoleBasedGuard>;
}
