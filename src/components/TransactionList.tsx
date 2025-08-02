'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Transaction } from '@/lib/types';
import TransactionForm from './TransactionForm';
import { useSupabase } from '@/hooks/useSupabase';
import { motion } from 'framer-motion';

interface TransactionListProps {
  transactions: Transaction[];
  onTransactionUpdated: (transaction: Transaction) => void;
  onTransactionDeleted: (id: string) => void;
}

const TransactionList = ({ transactions, onTransactionUpdated, onTransactionDeleted }: TransactionListProps) => {
  const { data: accounts } = useSupabase<{id: string, name: string}>('accounts');
  const { data: categories } = useSupabase<{id: string, name: string}>('categories');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleDeleteTransaction = async (id: string) => {
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (!error) {
      onTransactionDeleted(id);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <motion.ul
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          initial="hidden"
          animate="show"
        >
          {transactions.map((transaction) => (
            <motion.li
              key={transaction.id}
              className="flex justify-between items-center p-2 border-b"
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}
            >
              <div>
                <span>{transaction.description}</span>
                <span className="text-sm text-gray-500 ml-2">{transaction.type}</span>
              </div>
              <div className="flex gap-2">
                <Dialog open={editingTransaction?.id === transaction.id} onOpenChange={() => setEditingTransaction(editingTransaction?.id === transaction.id ? null : transaction)}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">Edit</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Transaction</DialogTitle>
                    </DialogHeader>
                    <TransactionForm
                      accounts={accounts}
                      categories={categories}
                      transaction={editingTransaction}
                      onTransactionUpdated={(updatedTransaction) => {
                        onTransactionUpdated(updatedTransaction);
                        setEditingTransaction(null);
                      }}
                    />
                  </DialogContent>
                </Dialog>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteTransaction(transaction.id)}>Delete</Button>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </CardContent>
    </Card>
  );
};

export default TransactionList;
