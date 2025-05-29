'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';

export function ThemeModeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    if (!theme) {
      setTheme('system');
    }
  }, [theme, setTheme]);

  const isDark = resolvedTheme === 'dark';

  return (
    <Button variant='outline' size='icon' onClick={() => setTheme(isDark ? 'light' : 'dark')}>
      <Sun
        className={`h-[1.2rem] w-[1.2rem] transition-all ${
          isDark ? '-rotate-90 scale-0' : 'rotate-0 scale-100'
        }`}
      />
      <Moon
        className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${
          isDark ? 'rotate-0 scale-100' : 'rotate-90 scale-0'
        }`}
      />
      <span className='sr-only'>Переключить тему</span>
    </Button>
  );
}
