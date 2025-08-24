import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import { fetchUserProfile } from '@/services/user'

interface Session {
  user: { id: string; name: string; email: string } | null
  login: (user: { id: string; name: string; email: string }) => void
  logout: () => Promise<void>
  isLoading: boolean
}

export const useSession = create<Session>((set) => {
  // initial state
  set({ user: null, isLoading: true })

  // subscribe to auth changes
  supabase.auth.onAuthStateChange(async (_event, session) => {
    if (session?.user) {
      try {
        const user = await fetchUserProfile(session.user.id)
        set({ user })
      } catch (e) {
        console.error('profile fetch error:', e)
        set({ user: null })
      }
    } else {
      set({ user: null })
    }
    set({ isLoading: false })
  })

  return {
    user: null,
    isLoading: true,
    login: (user) => {
      set({ user, isLoading: false });
    },
    logout: async () => {
      set({ isLoading: true });
      await supabase.auth.signOut();
      set({ user: null, isLoading: false });
    },
  }
})
