'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import withAuth from '@/components/withAuth';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Category {
  id: string;
  name: string;
  monthly_limit: number | null;
}

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryLimit, setNewCategoryLimit] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.id) {
        const { data, error } = await supabase.from('categories').select('*').eq('user_id', user.id);
        if (data) setCategories(data);
      }
    };
    fetchCategories();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (newCategoryName && user.id) {
      const { data, error } = await supabase
        .from('categories')
        .insert([{ name: newCategoryName, monthly_limit: newCategoryLimit || null, user_id: user.id }])
        .select();
      if (data) {
        setCategories([...categories, data[0]]);
        setNewCategoryName('');
        setNewCategoryLimit('');
      }
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Categories</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Add New Category</CardTitle>
          </CardHeader>
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
        <Card>
          <CardHeader>
            <CardTitle>Existing Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              {categories.map((category) => (
                <li key={category.id} className="flex justify-between items-center p-2 border-b">
                  <span>{category.name}</span>
                  <span className="text-sm text-gray-500">
                    {category.monthly_limit ? `$${category.monthly_limit}` : 'No limit'}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default withAuth(CategoriesPage);
