'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Goal } from '@/lib/types';
import GoalForm from './GoalForm';
import { motion } from 'framer-motion';

interface GoalListProps {
  goals: Goal[];
  onGoalUpdated: (goal: Goal) => void;
  onGoalDeleted: (id: string) => void;
}

const GoalList = ({ goals, onGoalUpdated, onGoalDeleted }: GoalListProps) => {
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const handleDeleteGoal = async (id: string) => {
    const { error } = await supabase.from('goals').delete().eq('id', id);
    if (!error) {
      onGoalDeleted(id);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Goals</CardTitle>
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
          {goals.map((goal) => (
            <motion.li
              key={goal.id}
              className="flex justify-between items-center p-2 border-b"
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}
            >
              <div>
                <span>{goal.name}</span>
                <span className="text-sm text-gray-500 ml-2">
                  {`$${goal.current_amount} / $${goal.target_amount}`}
                </span>
              </div>
              <div className="flex gap-2">
                <Dialog open={editingGoal?.id === goal.id} onOpenChange={() => setEditingGoal(editingGoal?.id === goal.id ? null : goal)}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">Edit</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Goal</DialogTitle>
                    </DialogHeader>
                    <GoalForm
                      goal={editingGoal}
                      onGoalUpdated={(updatedGoal) => {
                        onGoalUpdated(updatedGoal);
                        setEditingGoal(null);
                      }}
                    />
                  </DialogContent>
                </Dialog>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteGoal(goal.id)}>Delete</Button>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </CardContent>
    </Card>
  );
};

export default GoalList;
