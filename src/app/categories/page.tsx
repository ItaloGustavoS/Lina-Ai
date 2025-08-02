'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import withAuth from '@/components/withAuth';
import { useSupabase } from '@/hooks/useSupabase';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const CategoriesPage = () => {
  const { data: categories, setData: setCategories, loading, error } = useSupabase('categories');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryLimit, setNewCategoryLimit] = useState('');
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<any>(null);

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
        setCategories([...categories, data[0]]);
        setNewCategoryName('');
        setNewCategoryLimit('');
      }
    }
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    const { data, error } = await supabase
      .from('categories')
      .update({ name: editingCategory.name, monthly_limit: editingCategory.monthly_limit || null })
      .eq('id', editingCategory.id)
      .select();
    if (data) {
      setCategories(categories.map(c => c.id === editingCategory.id ? data[0] : c));
      setEditingCategory(null);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (!error) {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading categories.</p>;

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
                  <div>
                    <span>{category.name}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      {category.monthly_limit ? `$${category.monthly_limit}` : 'No limit'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Dialog open={editingCategory?.id === category.id} onOpenChange={() => setEditingCategory(editingCategory?.id === category.id ? null : category)}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">Edit</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Category</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleUpdateCategory}>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="name" className="text-right">
                                Name
                              </Label>
                              <Input
                                id="name"
                                value={editingCategory?.name || ''}
                                onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="limit" className="text-right">
                                Limit
                              </Label>
                              <Input
                                id="limit"
                                type="number"
                                value={editingCategory?.monthly_limit || ''}
                                onChange={(e) => setEditingCategory({ ...editingCategory, monthly_limit: e.target.value })}
                                className="col-span-3"
                              />
                            </div>
                          </div>
                          <Button type="submit">Save changes</Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteCategory(category.id)}>Delete</Button>
                  </div>
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
