export interface Account {
  id: string;
  name: string;
  type: 'bancaria' | 'investimento';
  user_id: string;
}

export interface Category {
  id: string;
  name: string;
  monthly_limit: number | null;
  user_id: string;
}

export interface Transaction {
  id: string;
  type: 'ganho' | 'gasto';
  amount: number;
  description: string;
  date: string;
  due_date: string | null;
  account_id: string;
  category_id: string;
  user_id: string;
  category?: { name: string } | null;
}

export interface Goal {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  due_date: string;
  user_id: string;
}
