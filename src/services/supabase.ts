import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase credentials are not configured');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper para obter o usuário atual
export async function getCurrentAuthUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Erro ao obter usuário:', error);
    return null;
  }
  return user;
}

// Helper para obter os dados do usuário no banco
export async function getUserData(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('auth_user_id', userId)
    .single();

  if (error) {
    console.error('Erro ao buscar dados do usuário:', error);
    return null;
  }
  return data;
}

// Helper para criar/atualizar dados do usuário
export async function createOrUpdateUserData(userId: string, email: string) {
  const { data, error } = await supabase
    .from('users')
    .upsert({
      auth_user_id: userId,
      email: email,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('Erro ao criar/atualizar usuário:', error);
    return null;
  }
  return data;
}
