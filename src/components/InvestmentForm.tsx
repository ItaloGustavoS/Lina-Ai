'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const InvestmentForm = () => {
  const [ticker, setTicker] = useState('');
  const [quantity, setQuantity] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (ticker && quantity && purchasePrice && purchaseDate && user.id) {
      const quantityNum = parseInt(quantity, 10);
      const purchasePriceNum = parseFloat(purchasePrice);

      if (isNaN(quantityNum) || quantityNum <= 0) {
        setError('Please enter a valid quantity.');
        return;
      }

      if (isNaN(purchasePriceNum) || purchasePriceNum <= 0) {
        setError('Please enter a valid purchase price.');
        return;
      }

      const { data, error } = await supabase
        .from('investments')
        .insert([
          {
            user_id: user.id,
            ticker,
            quantity: parseInt(quantity),
            purchase_price: parseFloat(purchasePrice),
            purchase_date: purchaseDate,
          },
        ]);

      if (error) {
        setError('Failed to add investment. Please try again.');
      } else {
        setSuccess('Investment added successfully!');
        setTicker('');
        setQuantity('');
        setPurchasePrice('');
        setPurchaseDate('');
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Investment</CardTitle>
      </CardHeader>
      {error && (
        <div style={{ color: 'red', padding: '1rem' }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ color: 'green', padding: '1rem' }}>
          {success}
        </div>
      )}
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="ticker">Ticker</Label>
              <Input
                id="ticker"
                value={ticker}
                onChange={(e) => setTicker(e.target.value.toUpperCase())}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="purchase-price">Purchase Price</Label>
              <Input
                id="purchase-price"
                type="number"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="purchase-date">Purchase Date</Label>
              <Input
                id="purchase-date"
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                required
              />
            </div>
            <div className="md:col-span-2">
              <Button type="submit" className="w-full">Add Investment</Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default InvestmentForm;
