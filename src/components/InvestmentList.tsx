'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from './ui/button';

interface Investment {
  id: string;
  ticker: string;
  quantity: number;
  purchase_price: number;
  purchase_date: string;
}

const InvestmentList = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvestments = async () => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.id) {
        const { data, error } = await supabase
          .from('investments')
          .select('*')
          .eq('user_id', user.id);

        if (data) {
          setInvestments(data);
        }
      }
      setLoading(false);
    };

    fetchInvestments();
  }, []);

  const handleUpdate = async (investmentId: string, ticker: string) => {
    const response = await fetch(`/api/investments/${ticker}`);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const latestPrice = data.results[0].regularMarketPrice;

      const { error: updateError } = await supabase
        .from('investments')
        .update({ current_price: latestPrice })
        .eq('id', investmentId);

      if (updateError) {
        console.error('Error updating investment:', updateError);
        return;
      }

      const { error: historyError } = await supabase
        .from('investment_history')
        .insert([
          {
            investment_id: investmentId,
            date: new Date().toISOString().split('T')[0],
            price: latestPrice,
          },
        ]);

      if (historyError) {
        console.error('Error inserting investment history:', historyError);
      }

      // Refetch investments to update the UI
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.id) {
        const { data, error } = await supabase
          .from('investments')
          .select('*')
          .eq('user_id', user.id);

        if (data) {
          setInvestments(data);
        }
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Ticker</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Purchase Price</TableHead>
          <TableHead>Purchase Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {investments.map((investment) => (
          <TableRow key={investment.id}>
            <TableCell>{investment.ticker}</TableCell>
            <TableCell>{investment.quantity}</TableCell>
            <TableCell>{investment.purchase_price}</TableCell>
            <TableCell>{new Date(investment.purchase_date).toLocaleDateString()}</TableCell>
            <TableCell>
              <Button onClick={() => handleUpdate(investment.id, investment.ticker)}>Update</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default InvestmentList;
