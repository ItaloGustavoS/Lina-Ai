'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Goal } from '@/lib/types';

interface GoalFormProps {
  goal?: Goal | null;
  onGoalAdded?: (goal: Goal) => void;
  onGoalUpdated?: (goal: Goal) => void;
}

const GoalForm = ({ goal, onGoalAdded, onGoalUpdated }: GoalFormProps) => {
  const [name, setName] = useState(goal?.name || '');
  const [targetAmount, setTargetAmount] = useState(goal?.target_amount.toString() || '');
  const [currentAmount, setCurrentAmount] = useState(goal?.current_amount.toString() || '0');
  const [dueDate, setDueDate] = useState(goal?.due_date || '');
  const [goalError, setGoalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGoalError(null);

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (name && targetAmount && dueDate && user.id) {
      const goalData = {
        name,
        target_amount: parseFloat(targetAmount),
        current_amount: parseFloat(currentAmount),
        due_date: dueDate,
        user_id: user.id,
      };

      if (goal) {
        // Update existing goal
        const { data, error } = await supabase
          .from('goals')
          .update(goalData)
          .eq('id', goal.id)
          .select();
        if (error) {
          setGoalError('Failed to update goal. Please try again.');
        } else if (data && onGoalUpdated) {
          onGoalUpdated(data[0]);
        }
      } else {
        // Add new goal
        const { data, error } = await supabase
          .from('goals')
          .insert([goalData])
          .select();
        if (error) {
          setGoalError('Failed to create goal. Please try again.');
        } else if (data && onGoalAdded) {
          onGoalAdded(data[0]);
          setName('');
          setTargetAmount('');
          setCurrentAmount('0');
          setDueDate('');
        }
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{goal ? 'Edit Goal' : 'Add New Goal'}</CardTitle>
      </CardHeader>
      {goalError && (
        <div style={{ color: 'red', padding: '1rem' }}>
          {goalError}
        </div>
      )}
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Goal Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="target-amount">Target Amount</Label>
              <Input
                id="target-amount"
                type="number"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="current-amount">Current Amount</Label>
              <Input
                id="current-amount"
                type="number"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="due-date">Due Date</Label>
              <Input
                id="due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>
            <Button type="submit">{goal ? 'Update Goal' : 'Add Goal'}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default GoalForm;
