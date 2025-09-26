const select = jest.fn().mockResolvedValue({ data: [], error: null });
const insert = jest.fn().mockResolvedValue({ data: [], error: null });
const update = jest.fn().mockReturnThis();
const deleteFn = jest.fn().mockReturnThis();
const eq = jest.fn().mockResolvedValue({ data: null, error: null });

export const supabase = {
  from: jest.fn((table: string) => {
    if (table === 'accounts') {
      return {
        select: jest.fn().mockResolvedValue({ data: [{ id: '123', name: 'Test Account', type: 'bancaria' }], error: null }),
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockResolvedValue({ data: [{ id: '123', name: 'Test Account', type: 'bancaria', user_id: 'user-123' }], error: null }),
        }),
        update: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ data: null, error: null }),
      };
    }
    if (table === 'categories') {
      return {
        select: jest.fn().mockResolvedValue({ data: [{ id: '456', name: 'Test Category', monthly_limit: 1000 }], error: null }),
        insert: jest.fn().mockReturnValue({
            select: jest.fn().mockResolvedValue({ data: [{ id: '456', name: 'Test Category', monthly_limit: 1000, user_id: 'user-123' }], error: null }),
        }),
        update: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ data: null, error: null }),
      };
    }
    if (table === 'transactions') {
        return {
            select: jest.fn().mockResolvedValue({ data: [], error: null }),
            insert: jest.fn().mockReturnValue({
                select: jest.fn().mockResolvedValue({ data: [], error: null }),
            }),
            update: jest.fn().mockReturnThis(),
            delete: jest.fn().mockReturnThis(),
            eq: jest.fn().mockResolvedValue({ data: null, error: null }),
        }
    }
    return {
      select,
      insert,
      update,
      delete: deleteFn,
      eq,
    };
  }),
};
