'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import withAuth from '@/components/withAuth';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface Transaction {
  type: 'ganho' | 'gasto' | 'investimento';
  amount: number;
  category: { name: string };
  date: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const DashboardPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [analysis, setAnalysis] = useState('');
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.id) {
        const { data, error } = await supabase
          .from('transactions')
          .select('*, category:categories(name)')
          .eq('user_id', user.id)
          .gte('date', `${year}-${month.toString().padStart(2, '0')}-01`)
          .lte('date', `${year}-${month.toString().padStart(2, '0')}-${new Date(year, month, 0).getDate()}`);
        if (data) setTransactions(data);
      }
    };
    fetchTransactions();
  }, [month, year]);

  const handleAnalyze = async () => {
    setLoadingAnalysis(true);
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transactions }),
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

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
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
              <BarChart data={[{ name: 'Finances', income: incomeData.reduce((acc, i) => acc + i.value, 0), expenses: expenseData.reduce((acc, e) => acc + e.value, 0) }]}>
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
      </div>
    </div>
  );
};

export default withAuth(DashboardPage);
