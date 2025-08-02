import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { supabase } from '@/lib/supabase';
import { PostgrestError } from '@supabase/supabase-js';

interface UseSupabaseResponse<T> {
  data: T[];
  loading: boolean;
  error: PostgrestError | null;
  setData: Dispatch<SetStateAction<T[]>>;
}

export const useSupabase = <T,>(tableName: string): UseSupabaseResponse<T> => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<PostgrestError | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user.id) {
          const { data: result, error: fetchError } = await supabase
            .from(tableName)
            .select('*')
            .eq('user_id', user.id);

          if (fetchError) {
            setError(fetchError);
          } else {
            setData(result as T[]);
          }
        }
      }
      setLoading(false);
    };

    fetchData();
  }, [tableName]);

  return { data, loading, error, setData };
};
