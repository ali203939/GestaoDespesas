import { supabase } from './supabase';

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

// ============================================
// EXPENSES - Operações com despesas
// ============================================

export interface Expense {
  id?: string;
  user_id: string;
  descricao: string;
  quantidade: number;
  categoria: string;
  created_at?: string;
  updated_at?: string;
}

export async function getExpenses(userId: string) {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

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
  renda_mensal?: number; 
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


export const getBitcoinRate = async (): Promise<number> => {
  try {

    const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCBRL');
    const data = await response.json();
    return parseFloat(data.price);
  } catch (error) {
    console.error('Erro ao buscar cotação do Bitcoin:', error);
    return 0; 
  }
};
