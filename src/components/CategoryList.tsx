'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Category } from '@/lib/types';
import { motion } from 'framer-motion';

interface CategoryWithSpending extends Category {
  totalSpending: number;
}

interface CategoryListProps {
  categories: CategoryWithSpending[];
  onCategoryUpdated: (category: Category) => void;
  onCategoryDeleted: (id: string) => void;
}

const CategoryList = ({ categories, onCategoryUpdated, onCategoryDeleted }: CategoryListProps) => {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    const { data, error } = await supabase
      .from('categories')
      .update({ name: editingCategory.name, monthly_limit: editingCategory.monthly_limit || null })
      .eq('id', editingCategory.id)
      .select();
    if (error) {
      console.error('Error updating category:', error);
    } else if (data) {
      onCategoryUpdated(data[0]);
      setEditingCategory(null);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (!error) {
      onCategoryDeleted(id);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Existing Categories</CardTitle>
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
          {categories.map((category) => (
            <motion.li
              key={category.id}
              className="flex justify-between items-center p-2 border-b"
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}
            >
              <div>
                <span>{category.name}</span>
                <span className="text-sm text-gray-500 ml-2">
                  {category.monthly_limit ? `$${category.totalSpending.toFixed(2)} / $${category.monthly_limit.toFixed(2)}` : 'No limit'}
                </span>
                {category.monthly_limit && category.totalSpending > category.monthly_limit && (
                  <span className="text-sm text-red-500 ml-2">Limit exceeded</span>
                )}
                {category.monthly_limit && category.totalSpending > category.monthly_limit * 0.8 && category.totalSpending <= category.monthly_limit && (
                  <span className="text-sm text-yellow-500 ml-2">Approaching limit</span>
                )}
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
                            onChange={(e) => {
                              if (editingCategory) {
                                setEditingCategory({ ...editingCategory, name: e.target.value })
                              }
                            }}
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
                            onChange={(e) => {
                              if (editingCategory) {
                                setEditingCategory({ ...editingCategory, monthly_limit: parseFloat(e.target.value) })
                              }
                            }}
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
            </motion.li>
          ))}
        </motion.ul>
      </CardContent>
    </Card>
  );
};

export default CategoryList;
