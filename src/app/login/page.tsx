'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const LoginPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    if (name && email) {
      // In a real app, you'd want to handle errors
      const { data, error } = await supabase.from('users').insert([{ name, email }]).select();
      if (data) {
        localStorage.setItem('user', JSON.stringify({ id: data[0].id, name: data[0].name, email }));
        router.push('/');
        return;
      }

      if (error) {
        // Handle unique constraint violation
        if (error.code === '23505') {
          const { data: userData, error: userError } = await supabase.from('users').select('id, name').eq('email', email).single();
          if (userData) {
            localStorage.setItem('user', JSON.stringify({ id: userData.id, name: userData.name, email }));
            router.push('/');
            return;
          } else if (userError) {
            setLoginError('An error occurred while retrieving your user information. Please try again.');
          } else {
            setLoginError('User already exists, but could not retrieve user information.');
          }
        } else {
          setLoginError('Login failed: ' + (error.message || 'Unknown error.'));
        }
      }
    } else {
      setLoginError('Please enter both name and email.');
    }
  }
        localStorage.setItem('user', JSON.stringify({ id: data[0].id, name, email }));
        router.push('/');
      }
      if (error) {
        // Handle unique constraint violation
        if (error.code === '23505') {
          const { data: userData, error: userError } = await supabase.from('users').select('id').eq('email', email).single();
          if (userData) {
            localStorage.setItem('user', JSON.stringify({ id: userData.id, name, email }));
            router.push('/');
          }
        }
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleLogin} className="bg-gray-800 p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-white">Login</h2>
        {loginError && (
          <div style={{ color: 'red', marginBottom: '1rem' }}>
            {loginError}
          </div>
        )}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-300">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
