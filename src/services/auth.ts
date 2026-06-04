import { supabase } from './supabase';
import type { User } from '@supabase/supabase-js';

export async function register(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) return { success: false, message: error.message };

  return { success: true, user: data.user };
}

export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) return { success: false, message: error.message };

  return { success: true, user: data.user };
}

export async function logout() {
  await supabase.auth.signOut();
  return { success: true };
}

export function onAuthStateChanged(callback: (user: User | null) => void) {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user || null);
  });

  return data.subscription;
}