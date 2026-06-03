# 🔧 Guia de Integração com Supabase Backend

Este documento descreve como integrar o frontend React com o backend PostgreSQL via Supabase.

## 📦 Instalação do Supabase Client

```bash
npm install @supabase/supabase-js
```

## 🔑 Configuração Inicial

### 1. Criar arquivo `src/services/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Types para type-safety
export interface User {
  id: number
  email: string
  created_at: string
  updated_at: string
}

export interface Expense {
  id: number
  user_id: number
  descricao: string
  quantidade: number
  categoria: 'Essencial' | 'Comida' | 'Saúde' | 'Transporte' | 'Outros'
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: number
  user_id: number
  renda_mensal: number
  moeda_padrao: string
  tema: string
  created_at: string
  updated_at: string
}
```

---

## 👤 Autenticação (Auth Service)

### 2. Atualizar `src/services/auth.ts` com Supabase

```typescript
import { supabase } from './supabase'

interface AuthResponse {
  success: boolean
  message: string
  user?: { id: number; email: string }
}

// Register
export async function register(
  email: string, 
  password: string
): Promise<AuthResponse> {
  try {
    // Validações
    if (!email || !password) {
      return { success: false, message: 'Email e senha são obrigatórios' }
    }

    if (password.length < 6) {
      return { success: false, message: 'Senha deve ter pelo menos 6 caracteres' }
    }

    // Verificar se usuário já existe
    const { data: existingUsers } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)

    if (existingUsers && existingUsers.length > 0) {
      return { success: false, message: 'Email já cadastrado' }
    }

    // Hash da senha (usar bcrypt em produção!)
    const hashedPassword = btoa(password) // Apenas para demo!

    // Inserir novo usuário
    const { data: newUser, error } = await supabase
      .from('users')
      .insert([{ email, password: hashedPassword }])
      .select()

    if (error || !newUser) {
      return { success: false, message: 'Erro ao registrar usuário' }
    }

    // Criar perfil do usuário
    await supabase
      .from('user_profiles')
      .insert([{ user_id: newUser[0].id }])

    // Salvar sessão local
    localStorage.setItem('current_user', JSON.stringify(newUser[0]))

    return {
      success: true,
      message: 'Cadastro realizado com sucesso',
      user: { id: newUser[0].id, email: newUser[0].email }
    }
  } catch (error) {
    return { success: false, message: 'Erro ao registrar' }
  }
}

// Login
export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  try {
    if (!email || !password) {
      return { success: false, message: 'Email e senha são obrigatórios' }
    }

    const hashedPassword = btoa(password)

    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('password', hashedPassword)

    if (error || !users || users.length === 0) {
      return { success: false, message: 'Email ou senha incorretos' }
    }

    localStorage.setItem('current_user', JSON.stringify(users[0]))

    return {
      success: true,
      message: 'Login realizado com sucesso',
      user: { id: users[0].id, email: users[0].email }
    }
  } catch (error) {
    return { success: false, message: 'Erro ao fazer login' }
  }
}

// Logout
export function logout(): void {
  localStorage.removeItem('current_user')
}

// Get current user
export function getCurrentUser() {
  const stored = localStorage.getItem('current_user')
  return stored ? JSON.parse(stored) : null
}

// Check if authenticated
export function isAuthenticated(): boolean {
  return getCurrentUser() !== null
}
```

---

## 💰 Serviço de Despesas

### 3. Criar `src/services/expenses.ts`

```typescript
import { supabase, Expense } from './supabase'
import { getCurrentUser } from './auth'

// Adicionar despesa
export async function addExpense(
  descricao: string,
  quantidade: number,
  categoria: string
): Promise<{ success: boolean; expense?: Expense; error?: string }> {
  try {
    const user = getCurrentUser()
    if (!user) return { success: false, error: 'Usuário não autenticado' }

    const { data, error } = await supabase
      .from('expenses')
      .insert([{
        user_id: user.id,
        descricao,
        quantidade,
        categoria
      }])
      .select()

    if (error || !data) {
      return { success: false, error: error?.message || 'Erro ao adicionar despesa' }
    }

    return { success: true, expense: data[0] }
  } catch (error) {
    return { success: false, error: 'Erro ao adicionar despesa' }
  }
}

// Listar despesas do usuário
export async function getExpenses(): Promise<{
  success: boolean
  expenses?: Expense[]
  error?: string
}> {
  try {
    const user = getCurrentUser()
    if (!user) return { success: false, error: 'Usuário não autenticado' }

    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, expenses: data || [] }
  } catch (error) {
    return { success: false, error: 'Erro ao buscar despesas' }
  }
}

// Editar despesa
export async function updateExpense(
  expenseId: number,
  descricao: string,
  quantidade: number,
  categoria: string
): Promise<{ success: boolean; expense?: Expense; error?: string }> {
  try {
    const user = getCurrentUser()
    if (!user) return { success: false, error: 'Usuário não autenticado' }

    const { data, error } = await supabase
      .from('expenses')
      .update({ descricao, quantidade, categoria })
      .eq('id', expenseId)
      .eq('user_id', user.id)
      .select()

    if (error || !data) {
      return { success: false, error: error?.message || 'Erro ao editar despesa' }
    }

    return { success: true, expense: data[0] }
  } catch (error) {
    return { success: false, error: 'Erro ao editar despesa' }
  }
}

// Deletar despesa
export async function deleteExpense(
  expenseId: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = getCurrentUser()
    if (!user) return { success: false, error: 'Usuário não autenticado' }

    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', expenseId)
      .eq('user_id', user.id)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: 'Erro ao deletar despesa' }
  }
}

// Buscar resumo de despesas
export async function getExpenseSummary(): Promise<{
  total: number
  count: number
  byCategory: Record<string, number>
}> {
  try {
    const user = getCurrentUser()
    if (!user) return { total: 0, count: 0, byCategory: {} }

    const { data } = await supabase
      .from('expenses')
      .select('quantidade, categoria')
      .eq('user_id', user.id)

    if (!data) return { total: 0, count: 0, byCategory: {} }

    const total = data.reduce((sum, exp) => sum + exp.quantidade, 0)
    const byCategory: Record<string, number> = {}

    data.forEach(exp => {
      byCategory[exp.categoria] = (byCategory[exp.categoria] || 0) + exp.quantidade
    })

    return { total, count: data.length, byCategory }
  } catch (error) {
    return { total: 0, count: 0, byCategory: {} }
  }
}
```

---

## 👤 Serviço de Perfil

### 4. Criar `src/services/profile.ts`

```typescript
import { supabase, UserProfile } from './supabase'
import { getCurrentUser } from './auth'

// Obter perfil do usuário
export async function getProfile(): Promise<UserProfile | null> {
  try {
    const user = getCurrentUser()
    if (!user) return null

    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    return data || null
  } catch (error) {
    return null
  }
}

// Atualizar renda mensal
export async function updateRenda(renda: number): Promise<boolean> {
  try {
    const user = getCurrentUser()
    if (!user) return false

    const { error } = await supabase
      .from('user_profiles')
      .update({ renda_mensal: renda })
      .eq('user_id', user.id)

    return !error
  } catch (error) {
    return false
  }
}

// Atualizar tema
export async function updateTheme(tema: string): Promise<boolean> {
  try {
    const user = getCurrentUser()
    if (!user) return false

    const { error } = await supabase
      .from('user_profiles')
      .update({ tema })
      .eq('user_id', user.id)

    return !error
  } catch (error) {
    return false
  }
}
```

---

## 🔔 Listeners em Tempo Real (Opcional)

```typescript
// Em AppDashboard.tsx
import { supabase } from '../services/supabase'

useEffect(() => {
  // Subscribe a mudanças em despesas
  const subscription = supabase
    .channel('public:expenses')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'expenses' },
      (payload) => {
        console.log('Mudança em despesas:', payload)
        // Recarregar despesas
        loadExpenses()
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(subscription)
  }
}, [])
```

---

## 🧪 Testes de Integração

### Exemplo de teste com Supabase

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { addExpense, getExpenses } from '../services/expenses'

vi.mock('../services/supabase', () => ({
  supabase: {
    from: vi.fn().mockReturnValue({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockResolvedValue({
          data: [{ id: 1, descricao: 'Teste', quantidade: 100 }],
          error: null
        })
      }),
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({
            data: [{ id: 1, descricao: 'Teste', quantidade: 100 }],
            error: null
          })
        })
      })
    })
  }
}))

describe('Expenses Service', () => {
  it('deve adicionar uma despesa', async () => {
    const result = await addExpense('Teste', 100, 'Comida')
    expect(result.success).toBe(true)
  })
})
```

---

## 🚀 Próximos Passos

1. ✅ Instalar `@supabase/supabase-js`
2. ✅ Criar arquivos de serviços
3. ✅ Atualizar AppDashboard.tsx para usar novos serviços
4. ✅ Implementar listeners em tempo real
5. ✅ Testar integração completa
6. ✅ Deploy em produção

---

**Pronto para integração com backend! 🎉**
