import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { getUserData, type UserData } from '../services/supabase';
import { getExpenses, getUserProfile, type Expense, type UserProfile } from '../services/api';
import { onAuthStateChanged } from '../services/auth';

export function useAuthUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const subscription = onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return { user, loading };
}

export function useUserData(authUserId: string | null) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authUserId) {
      setLoading(false);
      return;
    }

    const loadUserData = async () => {
      try {
        const data = await getUserData(authUserId);
        setUserData(data);
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [authUserId]);

  return { userData, loading };
}

export function useExpenses(userId: number | null) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const loadExpenses = async () => {
      try {
        const data = await getExpenses(userId);
        setExpenses(data);
        setError(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao carregar despesas';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadExpenses();
  }, [userId]);

  return { expenses, loading, error, setExpenses };
}

export function useUserProfile(userId: number | null) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const loadProfile = async () => {
      try {
        const data = await getUserProfile(userId);
        setProfile(data);
        setError(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao carregar perfil';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [userId]);

  return { profile, loading, error, setProfile };
}
