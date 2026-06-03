import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

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
// Usa uma função PostgreSQL (SECURITY DEFINER) para contornar RLS
export async function createOrUpdateUserData(userId: string, email: string) {
  try {
    const { data, error } = await supabase
      .rpc('create_or_update_user', {
        p_user_id: userId,
        p_user_email: email,
      });

    if (error) {
      console.error('Erro ao criar/atualizar usuário:', error);
      return null;
    }
    
    // A função retorna um array, pega o primeiro elemento
    return data?.[0] || null;
  } catch (error) {
    console.error('Erro ao executar função:', error);
    return null;
  }
}
