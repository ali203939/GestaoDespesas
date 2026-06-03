# 🔧 Correção: Erro 404 e Schema SQL

## 🔴 Problema

```
404 - Failed to load resource: the server responded with a status of 404
Erro ao criar/atualizar usuário: Object
```

## 🔍 Causa

A função PostgreSQL `create_or_update_user` **NÃO EXISTE** ou tem um **nome incorreto**.

Além disso, o schema SQL que você forneceu usa:
- `id` como **BIGINT** (não UUID)
- `descricao` em português
- `quantidade` (não `amount`)
- `categoria` em português

---

## ✅ Solução: Criar a Função Correta

### Passo 1: Copiar Este SQL Exatamente Como Está

No **Supabase → SQL Editor**, execute:

```sql
-- 1. Criar a função para obter ou criar usuário
CREATE OR REPLACE FUNCTION public.get_or_create_user(
  p_auth_user_id UUID,
  p_email TEXT
)
RETURNS TABLE (
  id BIGINT,
  auth_user_id UUID,
  email TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  INSERT INTO users (auth_user_id, email, created_at, updated_at)
  VALUES (p_auth_user_id, p_email, NOW(), NOW())
  ON CONFLICT (auth_user_id) 
  DO UPDATE SET 
    email = p_email,
    updated_at = NOW()
  RETURNING users.id, users.auth_user_id, users.email, users.created_at, users.updated_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Dar permissão para usuários autenticados
GRANT EXECUTE ON FUNCTION public.get_or_create_user(UUID, TEXT) TO authenticated;
```

---

### Passo 2: Atualizar o Código TypeScript

Atualize **src/services/api.ts**:

```typescript
import { supabase } from './supabase';

// Interface para despesa (usando os nomes do schema SQL)
export interface Expense {
  id: number;           // bigint
  user_id: number;      // bigint
  descricao: string;    // descrição em português
  quantidade: number;   // valor da despesa
  categoria: 'Essencial' | 'Comida' | 'Saúde' | 'Transporte' | 'Outros';
  created_at: string;
  updated_at: string;
}

// Interface para perfil
export interface UserProfile {
  id: number;
  user_id: number;
  renda_mensal: number;
  moeda_padrao: string;
  tema: string;
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

// Obter taxa de dólar
export async function getDollarRate(): Promise<number> {
  try {
    const response = await fetch('https://api.awesomeapi.com.br/last/USD-BRL');
    const data = await response.json();
    return parseFloat(data.USDBRL.bid);
  } catch (error) {
    console.error('Erro ao buscar taxa de dólar:', error);
    return 5.0;
  }
}
```

---

### Passo 3: Atualizar **src/services/supabase.ts**

```typescript
import { createClient } from '@supabase/supabase-js';
import type { User } from '@supabase/supabase-js';

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

// Interface para retorno do usuário no banco
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
```

---

### Passo 4: Atualizar **src/hooks/useDatabase.ts**

```typescript
import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { getCurrentAuthUser, getUserData, type UserData } from '../services/supabase';
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
```

---

### Passo 5: Atualizar **src/AppDashboard.tsx**

```typescript
import { useAuthUser, useUserData, useExpenses } from './hooks/useDatabase';
import type { Expense } from './services/api';
import { createExpense, deleteExpense, updateExpense } from './services/api';

export default function AppDashboard() {
  const { user } = useAuthUser();
  const { userData, loading: userLoading } = useUserData(user?.id || null);
  const { expenses, loading: expensesLoading, setExpenses } = useExpenses(userData?.id || null);

  const [renda, setRenda] = useState(0);
  const [descricao, setDescricao] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [categoria, setCategoria] = useState<'Essencial' | 'Comida' | 'Saúde' | 'Transporte' | 'Outros'>('Essencial');

  const handleAddExpense = async () => {
    if (!userData?.id || !descricao || !quantidade) return;

    const newExpense = await createExpense({
      user_id: userData.id,
      descricao,
      quantidade: parseFloat(quantidade),
      categoria,
    });

    if (newExpense) {
      setExpenses([newExpense, ...expenses]);
      setDescricao('');
      setQuantidade('');
    }
  };

  const handleDeleteExpense = async (id: number) => {
    const success = await deleteExpense(id);
    if (success) {
      setExpenses(expenses.filter(e => e.id !== id));
    }
  };

  const saldo = renda - expenses.reduce((sum, exp) => sum + exp.quantidade, 0);

  if (userLoading || expensesLoading) return <div>Carregando...</div>;
  if (!userData) return <div>Erro ao carregar dados do usuário</div>;

  return (
    <div>
      <h1>Dashboard de Despesas</h1>
      
      <div>
        <label>Renda Mensal: R$</label>
        <input
          type="number"
          value={renda}
          onChange={(e) => setRenda(parseFloat(e.target.value) || 0)}
          placeholder="0,00"
        />
      </div>

      <div>
        <label>Descrição:</label>
        <input
          type="text"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Ex: Aluguel"
        />
      </div>

      <div>
        <label>Valor (R$):</label>
        <input
          type="number"
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
          placeholder="0,00"
        />
      </div>

      <div>
        <label>Categoria:</label>
        <select value={categoria} onChange={(e) => setCategoria(e.target.value as any)}>
          <option value="Essencial">Essencial</option>
          <option value="Comida">Comida</option>
          <option value="Saúde">Saúde</option>
          <option value="Transporte">Transporte</option>
          <option value="Outros">Outros</option>
        </select>
      </div>

      <button onClick={handleAddExpense}>Adicionar Despesa</button>

      <div>
        <h2>Saldo: R$ {saldo.toFixed(2)}</h2>
      </div>

      <div>
        <h3>Despesas Registradas:</h3>
        {expenses.map((expense) => (
          <div key={expense.id}>
            <p>{expense.descricao} - R$ {expense.quantidade.toFixed(2)} ({expense.categoria})</p>
            <button onClick={() => handleDeleteExpense(expense.id)}>Deletar</button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 📋 Checklist

- [ ] Criei a função `get_or_create_user` no PostgreSQL
- [ ] Executei `GRANT EXECUTE`
- [ ] Atualizei `src/services/supabase.ts`
- [ ] Atualizei `src/services/api.ts` com nomes em português
- [ ] Atualizei `src/hooks/useDatabase.ts`
- [ ] Atualizei `src/AppDashboard.tsx`
- [ ] Recarreguei a aplicação (F5)
- [ ] Testei registrar um usuário
- [ ] Testei adicionar uma despesa
- [ ] Testei fazer logout e login novamente (despesas carregam)

✅ Tudo pronto!
