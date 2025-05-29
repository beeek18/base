'use client';

import { ThemeModeToggle } from '@/components/theme-mode-toggle';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth-store';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Info() {
  const { user, logout } = useAuthStore();
  const pathname = usePathname();

  return (
    <div className='flex flex-col items-center justify-center min-h-screen text-center px-4'>
      <div className='p-4'>
        <ThemeModeToggle />
      </div>
      <div className='mb-6 bg-gray-100 p-4 rounded w-full max-w-md overflow-x-auto'>
        {JSON.stringify(user)}
      </div>
      <div>{pathname}</div>
      <ul className='space-y-4'>
        <li>
          <Link href='/' className='text-blue-500 hover:underline'>
            Go to Home Page
          </Link>
        </li>
        <li>
          <Link href='/admin' className='text-blue-500 hover:underline'>
            Go to Admin Page
          </Link>
        </li>
        <li>
          <Link href='/dashboard' className='text-blue-500 hover:underline'>
            Go to Dashboard Page
          </Link>
        </li>
        <li>
          <Button type='button' onClick={logout}>
            Exit
          </Button>
        </li>
      </ul>
    </div>
  );
}
