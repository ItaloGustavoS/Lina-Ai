'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import withAuth from '@/components/withAuth';
import { useSupabase } from '@/hooks/useSupabase';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AccountsPage = () => {
  const { data: accounts, setData: setAccounts, loading, error } = useSupabase('accounts');
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountType, setNewAccountType] = useState<'bancaria' | 'investimento'>('bancaria');
  const [accountError, setAccountError] = useState<string | null>(null);

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setAccountError(null);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (newAccountName && user.id) {
      const { data, error } = await supabase
        .from('accounts')
        .insert([{ name: newAccountName, type: newAccountType, user_id: user.id }])
        .select();
      if (error) {
        setAccountError('Failed to create account. Please try again.');
      } else if (data) {
        setAccounts([...accounts, data[0]]);
        setNewAccountName('');
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading accounts.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Accounts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Add New Account</CardTitle>
          </CardHeader>
          {accountError && (
            <div style={{ color: 'red', padding: '1rem' }}>
              {accountError}
            </div>
          )}
          <CardContent>
            <form onSubmit={handleAddAccount}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Account Name</Label>
                  <Input
                    id="name"
                    value={newAccountName}
                    onChange={(e) => setNewAccountName(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Account Type</Label>
                  <select
                    id="type"
                    value={newAccountType}
                    onChange={(e) => setNewAccountType(e.target.value as 'bancaria' | 'investimento')}
                    className="w-full p-2 border rounded"
                  >
                    <option value="bancaria">Bancária</option>
                    <option value="investimento">Investimento</option>
                  </select>
                </div>
                <Button type="submit">Add Account</Button>
              </div>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Existing Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              {accounts.map((account) => (
                <li key={account.id} className="flex justify-between items-center p-2 border-b">
                  <span>{account.name}</span>
                  <span className="text-sm text-gray-500">{account.type}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default withAuth(AccountsPage);
