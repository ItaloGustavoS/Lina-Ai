'use client';

import withAuth from '@/components/withAuth';
import withPageTransitions from '@/components/withPageTransitions';
import { useSupabase } from '@/hooks/useSupabase';
import { Account } from '@/lib/types';
import AccountForm from '@/components/AccountForm';
import AccountList from '@/components/AccountList';

const AccountsPage = () => {
  const { data: accounts, setData: setAccounts, loading, error } = useSupabase<Account>('accounts');

  const handleAccountAdded = (account: Account) => {
    setAccounts([...accounts, account]);
  };

  const handleAccountUpdated = (updatedAccount: Account) => {
    setAccounts(accounts.map(a => a.id === updatedAccount.id ? updatedAccount : a));
  };

  const handleAccountDeleted = (id: string) => {
    setAccounts(accounts.filter(a => a.id !== id));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading accounts.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Accounts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AccountForm onAccountAdded={handleAccountAdded} />
        <AccountList
          accounts={accounts}
          onAccountUpdated={handleAccountUpdated}
          onAccountDeleted={handleAccountDeleted}
        />
      </div>
    </div>
  );
};

export default withAuth(withPageTransitions(AccountsPage));
