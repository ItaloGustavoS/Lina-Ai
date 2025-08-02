'use client';

import withAuth from '@/components/withAuth';
import withPageTransitions from '@/components/withPageTransitions';
import { useSupabase } from '@/hooks/useSupabase';
import { Transaction } from '@/lib/types';
import TransactionForm from '@/components/TransactionForm';
import TransactionList from '@/components/TransactionList';

const TransactionsPage = () => {
  const { data: transactions, setData: setTransactions, loading, error } = useSupabase<Transaction>('transactions');
  const { data: accounts } = useSupabase<{id: string, name: string}>('accounts');
  const { data: categories } = useSupabase<{id: string, name: string}>('categories');

  const handleTransactionAdded = (transaction: Transaction) => {
    setTransactions([...transactions, transaction]);
  };

  const handleTransactionUpdated = (updatedTransaction: Transaction) => {
    setTransactions(transactions.map(t => t.id === updatedTransaction.id ? updatedTransaction : t));
  };

  const handleTransactionDeleted = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading transactions.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <h1 className="text-2xl font-bold mb-4">Add Transaction</h1>
        <TransactionForm
          accounts={accounts}
          categories={categories}
          onTransactionAdded={handleTransactionAdded}
        />
      </div>
      <div>
        <TransactionList
          transactions={transactions}
          onTransactionUpdated={handleTransactionUpdated}
          onTransactionDeleted={handleTransactionDeleted}
        />
      </div>
    </div>
  );
};

export default withAuth(withPageTransitions(TransactionsPage));
