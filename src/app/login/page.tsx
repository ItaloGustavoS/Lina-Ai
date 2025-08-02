'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const LoginPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!name || !email) {
      setError('Please enter both name and email.');
      setIsLoading(false);
      return;
    }

    try {
      // Check if user with email already exists
      const { data: existingUser, error: selectError } = await supabase
        .from('users')
        .select('id, name')
        .eq('email', email)
        .single();

      if (selectError && selectError.code !== 'PGRST116') { // PGRST116 = no rows found
        throw new Error(selectError.message);
      }

      if (existingUser) {
        // User exists, log them in
        localStorage.setItem('user', JSON.stringify({ id: existingUser.id, name: existingUser.name, email }));
        router.push('/dashboard');
      } else {
        // User does not exist, create a new user
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert([{ name, email }])
          .select('id, name')
          .single();

        if (insertError) {
          throw new Error(insertError.message);
        }

        if (newUser) {
          localStorage.setItem('user', JSON.stringify({ id: newUser.id, name: newUser.name, email }));
          router.push('/dashboard');
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
          <CardTitle className="text-2xl font-bold text-white">Welcome to Lina AI</CardTitle>
          <CardDescription className="text-gray-400">
            Enter your details to log in or create an account.
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
              <Label htmlFor="name" className="text-gray-300">Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                className="bg-gray-700 border-gray-600 text-white"
                disabled={isLoading}
              />
            </div>
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
            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Login / Sign Up'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
