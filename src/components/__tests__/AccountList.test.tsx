import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AccountList from '../AccountList';
import { Account } from '@/lib/types';

jest.mock('@/lib/supabase');

const mockAccounts: Account[] = [
  { id: '1', name: 'Account 1', type: 'bancaria', user_id: 'user-123' },
  { id: '2', name: 'Account 2', type: 'investimento', user_id: 'user-123' },
];

describe('AccountList', () => {
  it('renders a list of accounts and handles editing and deleting', async () => {
    const onAccountUpdated = jest.fn();
    const onAccountDeleted = jest.fn();

    render(
      <AccountList
        accounts={mockAccounts}
        onAccountUpdated={onAccountUpdated}
        onAccountDeleted={onAccountDeleted}
      />
    );

    // Check that the accounts are rendered
    expect(screen.getByText('Account 1')).toBeInTheDocument();
    expect(screen.getByText('Account 2')).toBeInTheDocument();

    // Click the delete button on the first account
    const deleteButtons = screen.getAllByRole('button', { name: /Delete/i });
    fireEvent.click(deleteButtons[0]);

    // Wait for the async operation to complete
    await waitFor(() => {
      expect(onAccountDeleted).toHaveBeenCalledWith('1');
    });
  });
});
