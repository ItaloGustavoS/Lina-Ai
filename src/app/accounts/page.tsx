'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import withAuth from '@/components/withAuth';
import { useSupabase } from '@/hooks/useSupabase';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const AccountsPage = () => {
  const { data: accounts, setData: setAccounts, loading, error } = useSupabase('accounts');
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountType, setNewAccountType] = useState<'bancaria' | 'investimento'>('bancaria');
  const [accountError, setAccountError] = useState<string | null>(null);
  const [editingAccount, setEditingAccount] = useState<any>(null);

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
      if (data) {
        setAccounts([...accounts, data[0]]);
        setNewAccountName('');
      }
    }
  };

  const handleUpdateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAccount) return;
    const { data, error } = await supabase
      .from('accounts')
      .update({ name: editingAccount.name, type: editingAccount.type })
      .eq('id', editingAccount.id)
      .select();
    if (data) {
      setAccounts(accounts.map(a => a.id === editingAccount.id ? data[0] : a));
      setEditingAccount(null);
    }
  };

  const handleDeleteAccount = async (id: string) => {
    const { error } = await supabase.from('accounts').delete().eq('id', id);
    if (!error) {
      setAccounts(accounts.filter(a => a.id !== id));
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

                  <div>
                    <span>{account.name}</span>
                    <span className="text-sm text-gray-500 ml-2">{account.type}</span>
                  </div>
                  <div className="flex gap-2">
                    <Dialog open={editingAccount?.id === account.id} onOpenChange={() => setEditingAccount(editingAccount?.id === account.id ? null : account)}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">Edit</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Account</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleUpdateAccount}>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="name" className="text-right">
                                Name
                              </Label>
                              <Input
                                id="name"
                                value={editingAccount?.name || ''}
                                onChange={(e) => setEditingAccount({ ...editingAccount, name: e.target.value })}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="type" className="text-right">
                                Type
                              </Label>
                              <select
                                id="type"
                                value={editingAccount?.type || 'bancaria'}
                                onChange={(e) => setEditingAccount({ ...editingAccount, type: e.target.value })}
                                className="col-span-3 w-full p-2 border rounded"
                              >
                                <option value="bancaria">Bancária</option>
                                <option value="investimento">Investimento</option>
                              </select>
                            </div>
                          </div>
                          <Button type="submit">Save changes</Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteAccount(account.id)}>Delete</Button>
                  </div>
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
