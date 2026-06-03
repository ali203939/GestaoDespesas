import { supabase, createOrUpdateUserData } from './supabase';
import type { User } from '@supabase/supabase-js';

interface AuthResponse {
  success: boolean;
  message: string;
  user?: { email: string; id?: string };
}

export async function register(email: string, password: string): Promise<AuthResponse> {
  // Validações
  if (!email || !password) {
    return { success: false, message: 'Email e senha são obrigatórios' };
  }

  if (password.length < 6) {
    return { success: false, message: 'Senha deve ter no mínimo 6 caracteres' };
  }

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, message: 'Email inválido' };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return { success: false, message: error.message };
    }

    if (data.user) {
      // Criar registro do usuário no banco de dados
      await createOrUpdateUserData(data.user.id, email);
    }

    return { success: true, message: 'Cadastro realizado com sucesso! Verifique seu email.' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro ao registrar';
    return { success: false, message: errorMessage };
  }
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  if (!email || !password) {
    return { success: false, message: 'Email e senha são obrigatórios' };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, message: error.message };
    }

    if (data.user) {
      // Garantir que os dados do usuário existem no banco
      await createOrUpdateUserData(data.user.id, email);
    }

    return { 
      success: true, 
      message: 'Login realizado com sucesso!', 
      user: { email, id: data.user?.id } 
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro ao fazer login';
    return { success: false, message: errorMessage };
  }
}

export async function logout(): Promise<AuthResponse> {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: 'Logout realizado com sucesso!' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro ao fazer logout';
    return { success: false, message: errorMessage };
  }
}

export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return { email: user.email, id: user.id };
  } catch (error) {
    console.error('Erro ao obter usuário atual:', error);
    return null;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}

// Subscribe to auth state changes
export function onAuthStateChanged(callback: (user: User | null) => void) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      callback(session?.user ?? null);
    }
  );

  return subscription;
}
