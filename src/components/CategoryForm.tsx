'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Category } from '@/lib/types';

interface CategoryFormProps {
  onCategoryAdded: (category: Category) => void;
}

const CategoryForm = ({ onCategoryAdded }: CategoryFormProps) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryLimit, setNewCategoryLimit] = useState('');
  const [categoryError, setCategoryError] = useState<string | null>(null);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setCategoryError(null);

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (newCategoryName && user.id) {
      const { data, error } = await supabase
        .from('categories')
        .insert([{ name: newCategoryName, monthly_limit: newCategoryLimit || null, user_id: user.id }])
        .select();
      if (error) {
        setCategoryError('Failed to create category. Please try again.');
      } else if (data) {
        onCategoryAdded(data[0]);
        setNewCategoryName('');
        setNewCategoryLimit('');
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Category</CardTitle>
      </CardHeader>
      {categoryError && (
        <div style={{ color: 'red', padding: '1rem' }}>
          {categoryError}
        </div>
      )}
      <CardContent>
        <form onSubmit={handleAddCategory}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="limit">Monthly Limit (Optional)</Label>
              <Input
                id="limit"
                type="number"
                value={newCategoryLimit}
                onChange={(e) => setNewCategoryLimit(e.target.value)}
              />
            </div>
            <Button type="submit">Add Category</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CategoryForm;
