'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useSession } from '@/hooks/useSession';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useSession();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!email || !password) {
      setError('Please enter both email and password.');
      setIsLoading(false);
      return;
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        let userFriendlyMessage = "An unknown error occurred. Please try again.";
        // Map common Supabase auth errors to user-friendly messages
        if (authError.message?.toLowerCase().includes("invalid login credentials")) {
          userFriendlyMessage = "Invalid email or password. Please check your credentials and try again.";
        } else if (authError.message?.toLowerCase().includes("email not confirmed")) {
          userFriendlyMessage = "Your email address has not been confirmed. Please check your inbox for a confirmation email.";
        } else if (authError.message?.toLowerCase().includes("user not found")) {
          userFriendlyMessage = "No account found with this email address.";
        }
        throw new Error(userFriendlyMessage);
      }

      if (authData.user) {
        const { data: user, error: userError } = await supabase
          .from('users')
          .select('id, name, email')
          .eq('id', authData.user.id)
          .single();

        if (userError) {
          throw new Error(userError.message);
        }

        if (user) {
          login({ id: user.id, name: user.name, email: user.email });
          router.push('/dashboard');
        } else {
          // This case should ideally not happen if registration is done correctly
          throw new Error('User not found in our records after login.');
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Welcome back to Lina AI</CardTitle>
          <CardDescription className="text-gray-400">
            Enter your credentials to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/20 text-red-400 rounded-md">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john.doe@example.com"
                required
                className="bg-gray-700 border-gray-600 text-white"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                required
                className="bg-gray-700 border-gray-600 text-white"
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-gray-400">
            Don't have an account yet?{' '}
            <Link href="/register" className="font-medium text-indigo-400 hover:text-indigo-500">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
