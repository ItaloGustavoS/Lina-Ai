import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AccountForm from '../AccountForm';
import { supabase } from '@/lib/supabase';

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    select: jest.fn().mockResolvedValue({ data: [{ id: '123', name: 'Test Account', type: 'bancaria', user_id: 'user-123' }], error: null }),
  },
}));

describe('AccountForm', () => {
  it('renders the form and calls onAccountAdded on submit', async () => {
    const onAccountAdded = jest.fn();
    render(<AccountForm onAccountAdded={onAccountAdded} />);

    // Mock localStorage
    Storage.prototype.getItem = jest.fn(() => JSON.stringify({ id: 'user-123' }));

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Account Name/i), { target: { value: 'Test Account' } });
    fireEvent.change(screen.getByLabelText(/Account Type/i), { target: { value: 'bancaria' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Add Account/i }));

    // Wait for the async operation to complete
    await waitFor(() => {
      expect(onAccountAdded).toHaveBeenCalledWith({
        id: '123',
        name: 'Test Account',
        type: 'bancaria',
        user_id: 'user-123',
      });
    });
  });
});
