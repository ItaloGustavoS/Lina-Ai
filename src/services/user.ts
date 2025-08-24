import { supabase } from '@/lib/supabase'

export async function fetchUserProfile(id: string) {
  const { data, error } = await supabase
    .from('users')
    .select('id, name, email')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}
