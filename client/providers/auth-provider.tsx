import { STORAGE_ACCESS_TOKEN, STORAGE_REFRESH_TOKEN } from '@/constants/local-storage';
import { useAuthStore } from '@/store/auth-store';
import { ReactNode, useEffect, useState } from 'react';

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const { setSession, refresh } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const accessToken = localStorage.getItem(STORAGE_ACCESS_TOKEN);
        const refreshToken = localStorage.getItem(STORAGE_REFRESH_TOKEN);

        if (!accessToken || !refreshToken) {
          setSession({ accessToken: null, refreshToken: null }, null);
          setLoading(false);
          return;
        }

        await refresh();
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        setSession({ accessToken: null, refreshToken: null }, null);
      } finally {
        setLoading(false);
      }
    })();
  }, [refresh, setSession]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
