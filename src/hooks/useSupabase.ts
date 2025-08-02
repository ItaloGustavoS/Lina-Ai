import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export const useSupabase = (tableName: string) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.id) {
        const { data, error } = await supabase.from(tableName).select('*').eq('user_id', user.id);
        if (error) {
          setError(error);
        } else {
          setData(data);
        }
      }
      setLoading(false);
    };

    fetchData();
  }, [tableName]);

  return { data, loading, error, setData };
};
