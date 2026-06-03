import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase credentials are not configured');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Obter usuário autenticado do Supabase Auth
export async function getCurrentAuthUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Erro ao obter usuário:', error);
    return null;
  }
  return user;
}

// Interface para retorno do usuário no banco (bigint ids)
export interface UserData {
  id: number;           // bigint
  auth_user_id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

// Obter dados do usuário no banco de dados
export async function getUserData(authUserId: string): Promise<UserData | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('auth_user_id', authUserId)
      .single();

    if (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return null;
  }
}

// Criar ou atualizar usuário usando função PostgreSQL
export async function createOrUpdateUserData(authUserId: string, email: string): Promise<UserData | null> {
  try {
    const { data, error } = await supabase
      .rpc('get_or_create_user', {
        p_auth_user_id: authUserId,
        p_email: email,
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
