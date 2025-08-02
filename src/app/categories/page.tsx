'use client';

import withAuth from '@/components/withAuth';
import withPageTransitions from '@/components/withPageTransitions';
import { useSupabase } from '@/hooks/useSupabase';
import { Category, Transaction } from '@/lib/types';
import CategoryForm from '@/components/CategoryForm';
import CategoryList from '@/components/CategoryList';

const CategoriesPage = () => {
  const { data: categories, setData: setCategories, loading, error } = useSupabase<Category>('categories');
  const { data: transactions } = useSupabase<Transaction>('transactions');

  const handleCategoryAdded = (category: Category) => {
    setCategories([...categories, category]);
  };

  const handleCategoryUpdated = (updatedCategory: Category) => {
    setCategories(categories.map(c => c.id === updatedCategory.id ? updatedCategory : c));
  };

  const handleCategoryDeleted = (id: string) => {
    setCategories(categories.filter(c => c.id !== id));
  };

  const categorySpending = categories.map(category => {
    const total = transactions
      .filter(t => t.category_id === category.id && t.type === 'gasto')
      .reduce((acc, t) => acc + t.amount, 0);
    return { ...category, totalSpending: total };
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading categories.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Categories</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CategoryForm onCategoryAdded={handleCategoryAdded} />
        <CategoryList
          categories={categorySpending}
          onCategoryUpdated={handleCategoryUpdated}
          onCategoryDeleted={handleCategoryDeleted}
        />
      </div>
    </div>
  );
};

export default withAuth(withPageTransitions(CategoriesPage));
