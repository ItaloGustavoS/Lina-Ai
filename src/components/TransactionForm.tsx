'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Account {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

import { Transaction } from '@/lib/types';

interface TransactionFormProps {
  accounts: Account[];
  categories: Category[];
  transaction?: Transaction | null;
  onTransactionAdded?: (transaction: Transaction) => void;
  onTransactionUpdated?: (transaction: Transaction) => void;
}

const TransactionForm = ({ accounts, categories, transaction, onTransactionAdded, onTransactionUpdated }: TransactionFormProps) => {
  const [type, setType] = useState(transaction?.type || 'gasto');
  const [amount, setAmount] = useState(transaction?.amount != null ? String(transaction.amount) : '');
  const [description, setDescription] = useState(transaction?.description || '');
  const [date, setDate] = useState(transaction?.date || '');
  const [dueDate, setDueDate] = useState(transaction?.due_date || '');
  const [accountId, setAccountId] = useState(transaction?.account_id || '');
  const [categoryId, setCategoryId] = useState(transaction?.category_id || '');
  const [transactionError, setTransactionError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTransactionError(null);

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (amount && date && accountId && categoryId && user.id) {
      const transactionData = {
        type,
        amount: parseFloat(amount),
        description,
        date,
        due_date: dueDate,
        account_id: accountId,
        category_id: categoryId,
        user_id: user.id,
      };

      if (transaction) {
        // Update existing transaction
        const { data, error } = await supabase
          .from('transactions')
          .update(transactionData)
          .eq('id', transaction.id)
          .select();
        if (error) {
          setTransactionError('Failed to update transaction. Please try again.');
        } else if (data && onTransactionUpdated) {
          onTransactionUpdated(data[0]);
        }
      } else {
        // Add new transaction
        const { data, error } = await supabase
          .from('transactions')
          .insert([transactionData])
          .select();
        if (error) {
          setTransactionError('Failed to add transaction. Please try again.');
        } else if (data && onTransactionAdded) {
          onTransactionAdded(data[0]);
          // Reset form
          setType('gasto');
          setAmount('');
          setDescription('');
          setDate('');
          setDueDate('');
          setAccountId('');
          setCategoryId('');
        }
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{transaction ? 'Edit Transaction' : 'New Transaction'}</CardTitle>
      </CardHeader>
      {transactionError && (
        <div style={{ color: 'red', padding: '1rem' }}>
          {transactionError}
        </div>
      )}
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="type">Type</Label>
              <Select onValueChange={(value) => setType(value as 'ganho' | 'gasto')} value={type}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ganho">Ganho</SelectItem>
                  <SelectItem value="gasto">Gasto</SelectItem>
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
              <Label htmlFor="due-date">Due Date (Optional)</Label>
              <Input id="due-date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
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
  );
};

export default TransactionForm;
