import { supabase } from './supabase';

// ============================================
// EXPENSES - Operações com despesas
// ============================================

export interface Expense {
  id: number;
  user_id: number;
  descricao: string;
  quantidade: number;
  categoria: 'Essencial' | 'Comida' | 'Saúde' | 'Transporte' | 'Outros';
  created_at: string;
  updated_at: string;
}

// Buscar despesas do usuário
export async function getExpenses(userId: number): Promise<Expense[]> {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar despesas:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erro ao buscar despesas:', error);
    return [];
  }
}

// Criar despesa
export async function createExpense(expense: Omit<Expense, 'id' | 'created_at' | 'updated_at'>): Promise<Expense | null> {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .insert([{
        user_id: expense.user_id,
        descricao: expense.descricao,
        quantidade: expense.quantidade,
        categoria: expense.categoria,
      }])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar despesa:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Erro ao criar despesa:', error);
    return null;
  }
}

// Atualizar despesa
export async function updateExpense(
  id: number,
  updates: Partial<Expense>
): Promise<Expense | null> {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar despesa:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Erro ao atualizar despesa:', error);
    return null;
  }
}

// Deletar despesa
export async function deleteExpense(id: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar despesa:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro ao deletar despesa:', error);
    return false;
  }
}

// ============================================
// USER PROFILES - Operações com perfil
// ============================================

export interface UserProfile {
  id: number;
  user_id: number;
  renda_mensal: number;
  moeda_padrao: string;
  tema: string;
  created_at: string;
  updated_at: string;
}

// Buscar perfil do usuário
export async function getUserProfile(userId: number): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Erro ao buscar perfil:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return null;
  }
}

// Atualizar perfil do usuário
export async function updateUserProfile(
  userId: number,
  updates: Partial<UserProfile>
): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar perfil:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    return null;
  }
}

// ============================================
// EXCHANGE RATES - Taxa de câmbio
// ============================================

export interface ExchangeRate {
  bid: string;
  name: string;
}

export const getDollarRate = async (): Promise<number> => {
  try {
    const response = await fetch('https://economia.awesomeapi.com.br/json/last/USD-BRL');
    if (!response.ok) throw new Error('Falha na requisição');
    
    const data = await response.json();
    // Retorna o valor de compra (bid) convertido para número
    return parseFloat(data.USDBRL.bid);
  } catch (error) {
    console.error("Erro ao buscar API:", error);
    throw error;
  }
};
  category: string;
  date: string;
  created_at?: string;
  updated_at?: string;
}

export async function getExpenses(userId: string) {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao buscar despesas:', error);
    return [];
  }
}

export async function createExpense(expense: Expense) {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .insert([expense])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao criar despesa:', error);
    return null;
  }
}

export async function updateExpense(id: string, expense: Partial<Expense>) {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .update(expense)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao atualizar despesa:', error);
    return null;
  }
}

export async function deleteExpense(id: string) {
  try {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erro ao deletar despesa:', error);
    return false;
  }
}

// ============================================
// USER PROFILES - Dados adicionais do usuário
// ============================================

export interface UserProfile {
  id?: string;
  user_id: string;
  name?: string;
  phone?: string;
  avatar_url?: string;
  currency?: string;
  created_at?: string;
  updated_at?: string;
}

export async function getUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch (error) {
    console.error('Erro ao buscar perfil do usuário:', error);
    return null;
  }
}

export async function updateUserProfile(userId: string, profile: Partial<UserProfile>) {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({
        ...profile,
        user_id: userId,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    return null;
  }
}
