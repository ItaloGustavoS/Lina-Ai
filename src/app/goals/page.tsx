'use client';

import withAuth from '@/components/withAuth';
import withPageTransitions from '@/components/withPageTransitions';
import { useSupabase } from '@/hooks/useSupabase';
import { Goal } from '@/lib/types';
import GoalForm from '@/components/GoalForm';
import GoalList from '@/components/GoalList';

const GoalsPage = () => {
  const { data: goals, setData: setGoals, loading, error } = useSupabase<Goal>('goals');

  const handleGoalAdded = (goal: Goal) => {
    setGoals([...goals, goal]);
  };

  const handleGoalUpdated = (updatedGoal: Goal) => {
    setGoals(goals.map(g => g.id === updatedGoal.id ? updatedGoal : g));
  };

  const handleGoalDeleted = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading goals.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <h1 className="text-2xl font-bold mb-4">Add Goal</h1>
        <GoalForm onGoalAdded={handleGoalAdded} />
      </div>
      <div>
        <GoalList
          goals={goals}
          onGoalUpdated={handleGoalUpdated}
          onGoalDeleted={handleGoalDeleted}
        />
      </div>
    </div>
  );
};

export default withAuth(withPageTransitions(GoalsPage));
