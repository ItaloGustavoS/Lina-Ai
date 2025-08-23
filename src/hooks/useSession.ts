import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface Session {
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  login: (user: { id: string; name: string; email: string }) => void;
  logout: () => void;
}

export const useSession = create<Session>()(
  persist(
    (set) => ({
      user: null,
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'session',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
