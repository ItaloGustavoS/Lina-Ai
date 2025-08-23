import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

interface Session {
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  login: (user: { id: string; name: string; email: string }) => void;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  isLoading: boolean;
}

export const useSession = create<Session>((set) => ({
  user: null,
  isLoading: true,
  login: (user) => set({ user }),
  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },
  checkSession: async () => {
    try {
      const { data: { session }, } = await supabase.auth.getSession();
      if (session) {
        const { data: user, error } = await supabase
          .from('users')
          .select('id, name, email')
          .eq('id', session.user.id)
          .single();

        if (error) {
          throw error;
        }

        if (user) {
          set({ user });
        }
      }
    } catch (error) {
      console.error('Error checking session:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
