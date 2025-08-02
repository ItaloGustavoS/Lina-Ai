import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CategoryForm from '../CategoryForm';

jest.mock('@/lib/supabase');

describe('CategoryForm', () => {
  it('renders the form and calls onCategoryAdded on submit', async () => {
    const onCategoryAdded = jest.fn();
    render(<CategoryForm onCategoryAdded={onCategoryAdded} />);

    // Mock localStorage
    Storage.prototype.getItem = jest.fn(() => JSON.stringify({ id: 'user-123' }));

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Category Name/i), { target: { value: 'Test Category' } });
    fireEvent.change(screen.getByLabelText(/Monthly Limit/i), { target: { value: '1000' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Add Category/i }));

    // Wait for the async operation to complete
    await waitFor(() => {
      expect(onCategoryAdded).toHaveBeenCalledWith({
        id: expect.any(String),
        name: 'Test Category',
        monthly_limit: 1000,
        user_id: 'user-123',
      });
    });
  });
});
