import { supabase } from './supabase';

// TYPES
export interface UserProfile {
  user_id: string;
  name?: string;
  email: string;
  created_at: string;
}

export interface Expense {
  id: number;
  user_id: string;
  descricao: string;
  quantidade: number;
  categoria: 'Essencial' | 'Comida' | 'Saúde' | 'Transporte' | 'Outros';
  created_at: string;
  updated_at: string;
}

// GET EXPENSES
export async function getExpenses() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) return [];

  return data;
}

// CREATE EXPENSE
export async function createExpense(expense: Omit<Expense, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from('expenses')
    .insert({
      user_id: user.id,
      descricao: expense.descricao,
      quantidade: expense.quantidade,
      categoria: expense.categoria
    })
    .select()
    .single();

  if (error) return null;

  return data;
}

// UPDATE
export async function updateExpense(id: number, updates: Partial<Expense>) {
  const { data, error } = await supabase
    .from('expenses')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return null;

  return data;
}

// DELETE
export async function deleteExpense(id: number) {
  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id);

  return !error;
}

// PROFILE
export async function getUserProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  return data;
}

// EXCHANGE
export async function getDollarRate() {
  const res = await fetch('https://economia.awesomeapi.com.br/json/last/USD-BRL');
  const data = await res.json();
  return parseFloat(data.USDBRL.bid);
}