'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import withAuth from '@/components/withAuth';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Account {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

const TransactionsPage = () => {
  const [type, setType] = useState('gasto');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [accountId, setAccountId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.id) {
        const { data: accountsData } = await supabase.from('accounts').select('id, name').eq('user_id', user.id);
        if (accountsData) setAccounts(accountsData);
        const { data: categoriesData } = await supabase.from('categories').select('id, name').eq('user_id', user.id);
        if (categoriesData) setCategories(categoriesData);
      }
    };
    fetchData();
  }, []);

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (amount && date && accountId && categoryId && user.id) {
      const { data, error } = await supabase
        .from('transactions')
        .insert([{
          type,
          amount: parseFloat(amount),
          description,
          date,
          account_id: accountId,
          category_id: categoryId,
          user_id: user.id,
        }])
        .select();
      if (data) {
        // Reset form
        setType('gasto');
        setAmount('');
        setDescription('');
        setDate('');
        setAccountId('');
        setCategoryId('');
      }
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Add Transaction</h1>
      <Card>
        <CardHeader>
          <CardTitle>New Transaction</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddTransaction}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Select onValueChange={setType} defaultValue={type}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ganho">Ganho</SelectItem>
                    <SelectItem value="gasto">Gasto</SelectItem>
                    <SelectItem value="investimento">Investimento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount</Label>
                <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="account">Account</Label>
                <Select onValueChange={setAccountId} value={accountId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map(account => (
                      <SelectItem key={account.id} value={account.id}>{account.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={setCategoryId} value={categoryId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Button type="submit" className="w-full">Add Transaction</Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default withAuth(TransactionsPage);
