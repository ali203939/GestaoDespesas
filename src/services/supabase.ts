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
  try {
    // Primeiro, tentar buscar o usuário
    const { data: existingUser, error: searchError } = await supabase
      .from('users')
      .select('*')
      .eq('auth_user_id', userId)
      .single();

    // Se o usuário existe, atualizar
    if (existingUser) {
      const { data, error } = await supabase
        .from('users')
        .update({
          email: email,
          updated_at: new Date().toISOString(),
        })
        .eq('auth_user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar usuário:', error);
        return null;
      }
      return data;
    }

    // Se não existe, inserir
    if (searchError?.code === 'PGRST116') { // No rows found
      const { data, error } = await supabase
        .from('users')
        .insert({
          auth_user_id: userId,
          email: email,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar usuário:', error);
        return null;
      }
      return data;
    }

    // Outro erro na busca
    if (searchError) {
      console.error('Erro ao buscar usuário:', searchError);
      return null;
    }
  } catch (error) {
    console.error('Erro ao criar/atualizar usuário:', error);
    return null;
  }
}
