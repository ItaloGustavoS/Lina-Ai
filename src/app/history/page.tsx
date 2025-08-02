'use client';

import { useState, useEffect } from 'react';
import withAuth from '@/components/withAuth';
import withPageTransitions from '@/components/withPageTransitions';
import { useSupabase } from '@/hooks/useSupabase';
import { supabase } from '@/lib/supabase';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';

interface Transaction {
  id: string;
  date: string;
  type: string;
  amount: number;
  description: string;
  account: { id: string; name: string };
  category: { id: string; name: string };
}

const HistoryPage = () => {
  const { data: transactions, setData: setTransactions, loading, error } = useSupabase<Transaction>('transactions');
  const { data: accounts } = useSupabase<{id: string, name: string}>('accounts');
  const { data: categories } = useSupabase<{id: string, name: string}>('categories');
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [filters, setFilters] = useState({ type: '', accountId: '', categoryId: '' });

  useEffect(() => {
    let filtered = transactions as Transaction[];
    if (filters.type) {
      filtered = filtered.filter(t => t.type === filters.type);
    }
    if (filters.accountId) {
      filtered = filtered.filter(t => t.account.id === filters.accountId);
    }
    if (filters.categoryId) {
      filtered = filtered.filter(t => t.category.id === filters.categoryId);
    }
    setFilteredTransactions(filtered);
  }, [filters, transactions]);

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const handleDeleteTransaction = async (id: string) => {
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (!error) {
      setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Type', 'Amount', 'Description', 'Account', 'Category'];
    const rows = filteredTransactions.map(t => [
      t.date,
      t.type,
      t.amount,
      t.description,
      t.account?.name,
      t.category?.name
    ].join(','));
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading history.</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Transaction History</h1>
        <Button onClick={exportToCSV}>Export to CSV</Button>
      </div>
      <div className="flex gap-4 mb-4">
        <Select onValueChange={(value) => handleFilterChange('type', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ganho">Ganho</SelectItem>
            <SelectItem value="gasto">Gasto</SelectItem>
            <SelectItem value="investimento">Investimento</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={(value) => handleFilterChange('accountId', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by account" />
          </SelectTrigger>
          <SelectContent>
            {accounts.map(account => (
              <SelectItem key={account.id} value={account.id}>{account.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={(value) => handleFilterChange('categoryId', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Account</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTransactions.map(transaction => (
            <TableRow key={transaction.id}>
              <TableCell>{transaction.date}</TableCell>
              <TableCell>{transaction.type}</TableCell>
              <TableCell>{transaction.amount}</TableCell>
              <TableCell>{transaction.description}</TableCell>
              <TableCell>{transaction.account?.name}</TableCell>
              <TableCell>{transaction.category?.name}</TableCell>
              <TableCell>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteTransaction(transaction.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default withAuth(withPageTransitions(HistoryPage));
