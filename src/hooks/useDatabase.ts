import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';

import {
  getExpenses,
  getUserProfile,
  type Expense,
  type UserProfile
} from '../services/api';

import { onAuthStateChanged } from '../services/auth';

// ============================================
// AUTH HOOK
// ============================================

export function useAuthUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const subscription = onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe?.();
    };
  }, []);

  return { user, loading };
}

// ============================================
// EXPENSES HOOK (CORRIGIDO)
// ============================================

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        const data = await getExpenses(); // ❌ sem userId
        setExpenses(data);
        setError(null);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Erro ao carregar despesas';

        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadExpenses();
  }, []);

  return { expenses, loading, error, setExpenses };
}

// ============================================
// PROFILE HOOK (CORRIGIDO)
// ============================================

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getUserProfile(); // ❌ sem userId
        setProfile(data);
        setError(null);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Erro ao carregar perfil';

        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  return { profile, loading, error, setProfile };
}