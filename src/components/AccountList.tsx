'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Account } from '@/lib/types';
import { motion } from 'framer-motion';

interface AccountListProps {
  accounts: Account[];
  onAccountUpdated: (account: Account) => void;
  onAccountDeleted: (id: string) => void;
}

const AccountList = ({ accounts, onAccountUpdated, onAccountDeleted }: AccountListProps) => {
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  const handleUpdateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAccount) return;
    const { data, error } = await supabase
      .from('accounts')
      .update({ name: editingAccount.name, type: editingAccount.type })
      .eq('id', editingAccount.id)
      .select();
    if (error) {
      console.error('Error updating account:', error);
    } else if (data) {
      onAccountUpdated(data[0]);
      setEditingAccount(null);
    }
  };

  const handleDeleteAccount = async (id: string) => {
    const { error } = await supabase.from('accounts').delete().eq('id', id);
    if (!error) {
      onAccountDeleted(id);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Existing Accounts</CardTitle>
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
          {accounts.map((account) => (
            <motion.li
              key={account.id}
              className="flex justify-between items-center p-2 border-b"
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}
            >
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
                            onChange={(e) => {
                              if (editingAccount) {
                                setEditingAccount({ ...editingAccount, name: e.target.value })
                              }
                            }}
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
                            onChange={(e) => {
                              if (editingAccount) {
                                setEditingAccount({ ...editingAccount, type: e.target.value as 'bancaria' | 'investimento' })
                              }
                            }}
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
            </motion.li>
          ))}
        </motion.ul>
      </CardContent>
    </Card>
  );
};

export default AccountList;
