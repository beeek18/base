'use client';

import { ReactNode } from 'react';

import { GuestGuard } from '@/guard/guest-guard';
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function AuthLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <GuestGuard>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
        {children}
      </GoogleOAuthProvider>
    </GuestGuard>
  );
}
