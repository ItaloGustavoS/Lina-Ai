'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import withAuth from '@/components/withAuth';
import withPageTransitions from '@/components/withPageTransitions';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSupabase } from '@/hooks/useSupabase';
import { Transaction, Category } from '@/lib/types';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const analysisPrompts = [
  "Analyze my spending for this month and give me some tips on how to save money.",
  "Identify any recurring subscriptions I might have.",
  "Forecast my spending for the next month based on my history.",
];

const DashboardPage = () => {
  const { data: transactions, setData: setTransactions } = useSupabase<Transaction>('transactions');
  const { data: categories } = useSupabase<Category>('categories');
  const [upcomingBills, setUpcomingBills] = useState<Transaction[]>([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [analysis, setAnalysis] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState(analysisPrompts[0]);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.id) {
        const { data, error } = await supabase
          .from('transactions')
          .select('*, category:categories(name)')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching transactions:', error);
        } else if (data) {
          setTransactions(data);

          const today = new Date();
          const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

          const upcoming = data.filter(t => {
            if (!t.due_date) return false;
            const dueDate = new Date(t.due_date);
            return dueDate >= today && dueDate <= nextWeek;
          });
          setUpcomingBills(upcoming);
        }
      }
    };
    fetchTransactions();
  }, [month, year, setTransactions]);

  const handleAnalyze = async () => {
    setLoadingAnalysis(true);
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        transactions,
        categories,
        prompt: selectedPrompt,
      }),
    });
    const data = await res.json();
    setAnalysis(data.analysis);
    setLoadingAnalysis(false);
  };

  const expenseData = transactions
    .filter(t => t.type === 'gasto')
    .reduce((acc, t) => {
      const categoryName = t.category?.name || 'Uncategorized';
      const existing = acc.find(item => item.name === categoryName);
      if (existing) {
        existing.value += t.amount;
      } else {
        acc.push({ name: categoryName, value: t.amount });
      }
      return acc;
    }, [] as { name: string; value: number }[]);

  const incomeData = transactions
    .filter(t => t.type === 'ganho')
    .reduce((acc, t) => {
      const categoryName = t.category?.name || 'Uncategorized';
      const existing = acc.find(item => item.name === categoryName);
      if (existing) {
        existing.value += t.amount;
      } else {
        acc.push({ name: categoryName, value: t.amount });
      }
      return acc;
    }, [] as { name: string; value: number }[]);

  const barChartData = [{
    name: 'Finances',
    income: incomeData.reduce((acc, i) => acc + i.value, 0),
    expenses: expenseData.reduce((acc, e) => acc + e.value, 0)
  }];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <Select onValueChange={setSelectedPrompt} defaultValue={selectedPrompt}>
            <SelectTrigger>
              <SelectValue placeholder="Select analysis type" />
            </SelectTrigger>
            <SelectContent>
              {analysisPrompts.map(prompt => (
                <SelectItem key={prompt} value={prompt}>{prompt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog>
            <DialogTrigger asChild>
              <Button onClick={handleAnalyze} disabled={loadingAnalysis}>
                {loadingAnalysis ? 'Analyzing...' : 'Analyze Finances'}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Financial Analysis</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                {analysis || 'No analysis available.'}
              </DialogDescription>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label>Month:</label>
          <Input
            type="number"
            min={1}
            max={12}
            value={month}
            onChange={e => {
              const value = parseInt(e.target.value, 10);
              if (!isNaN(value) && value >= 1 && value <= 12) {
                setMonth(value);
              }
            }}
          />
        </div>
        <div>
          <label>Year:</label>
          <Input
            type="number"
            min={1900}
            max={new Date().getFullYear() + 10}
            value={year}
            onChange={e => {
              const val = parseInt(e.target.value);
              const minYear = 1900;
              const maxYear = new Date().getFullYear() + 10;
              if (!isNaN(val) && val >= minYear && val <= maxYear) {
                setYear(val);
              }
            }}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={expenseData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Income vs. Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="#82ca9d" />
                <Bar dataKey="expenses" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Bills</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              {upcomingBills.map(bill => (
                <li key={bill.id} className="flex justify-between items-center p-2 border-b">
                  <span>{bill.description}</span>
                  <span>{bill.due_date && new Date(bill.due_date).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default withAuth(withPageTransitions(DashboardPage));
