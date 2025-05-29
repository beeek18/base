'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth-store';
import { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';

const authSchema = z.object({
  email: z.string().email({ message: 'Неверный email' }),
  password: z.string().min(6, { message: 'Пароль должен быть не менее 6 символов' }),
});

export type AuthFormData = z.infer<typeof authSchema>;

export function AuthForm() {
  const [isRegistering, setIsRegistering] = useState(false);
  const { register, login, googleAuth } = useAuthStore();

  const form = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: AuthFormData) => {
    if (isRegistering) {
      register(data);
      console.log('Регистрация:', data);
    } else {
      login(data);
      console.log('Вход:', data);
    }
  };

  const google = useGoogleLogin({
    onSuccess: (codeResponse) => googleAuth(codeResponse.access_token),
    onError: (error) => console.log('Login Failed:', error),
  });

  return (
    <div className='flex flex-col gap-6'>
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl'>{isRegistering ? 'Регистрация' : 'Вход'}</CardTitle>
          <CardDescription>
            {isRegistering
              ? 'Введите данные для создания аккаунта'
              : 'Введите ваш email и пароль для входа'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex items-center mb-6 space-x-3'>
            <span
              className={cn(
                'select-none text-sm',
                !isRegistering ? 'text-gray-900' : 'text-gray-500',
              )}
            >
              Вход
            </span>
            <Switch
              id='mode-switch'
              checked={isRegistering}
              onCheckedChange={(checked) => setIsRegistering(checked)}
            />
            <span
              className={cn(
                'select-none text-sm',
                isRegistering ? 'text-gray-900' : 'text-gray-500',
              )}
            >
              Регистрация
            </span>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-6'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder='m@example.com' {...field} type='email' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex items-center justify-between'>
                      <FormLabel>Пароль</FormLabel>
                      {!isRegistering && (
                        <a href='#' className='text-sm underline-offset-4 hover:underline'>
                          Забыли пароль?
                        </a>
                      )}
                    </div>
                    <FormControl>
                      <Input {...field} type='password' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type='submit' className='w-full'>
                {isRegistering ? 'Зарегистрироваться' : 'Войти'}
              </Button>

              <Button variant='outline' className='w-full' type='button' onClick={() => google()}>
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
                  <path
                    d='M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z'
                    fill='currentColor'
                  />
                </svg>
                Войти через Google
              </Button>

              <div className='text-center mt-4 text-sm'>
                {isRegistering ? 'Уже есть аккаунт? ' : 'Нет аккаунта? '}
                <button
                  type='button'
                  className='underline underline-offset-4 text-blue-600 hover:text-blue-800'
                  onClick={() => setIsRegistering(!isRegistering)}
                >
                  {isRegistering ? 'Войдите' : 'Зарегистрируйтесь'}
                </button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
