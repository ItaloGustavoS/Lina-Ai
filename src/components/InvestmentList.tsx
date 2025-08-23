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
import { useSession } from '@/hooks/useSession';

interface Investment {
  id: string;
  ticker: string;
  quantity: number;
  purchase_price: number;
  purchase_date: string;
}

const InvestmentList = () => {
  const { user } = useSession();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvestments = async () => {
    if (user) {
      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        setError(error.message || 'Unknown error');
      } else if (data) {
        setInvestments(data);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInvestments();
  }, []);

  const handleUpdate = async (investmentId: string, ticker: string) => {
    try {
      const response = await fetch(`/api/investments/${ticker}`);
      if (!response.ok) {
        setError('Failed to fetch investment data.');
        return;
      }
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const latestPrice = data.results[0].regularMarketPrice;

        const { error } = await supabase.rpc('update_investment', {
          investment_id_param: investmentId,
          new_price: latestPrice,
        });

        if (error) {
          setError('Failed to update investment.');
          return;
        }

        fetchInvestments();
      }
    } catch (e) {
      setError('Failed to update investment.');
    }
  };

  if (error) {
    return <div className="text-red-500">Error loading investments: {error}</div>;
  }

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
