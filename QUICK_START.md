# ⚡ Quick Start - Supabase Integration

## 🚀 5 Minutos para Começar

### 1. Variáveis de Ambiente (✅ Já feito)
Arquivo `.env.local` foi criado com suas credenciais:
```
VITE_SUPABASE_URL=https://xpyvjcgdwzfkgipzaruk.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_CgyY7v5ac6H4AKqC-nCIvA_07C9CX2D
```

### 2. Executar SQL no Supabase (⏱️ ~2 minutos)

1. Abra: https://supabase.com
2. Vá para seu projeto
3. Clique em **SQL Editor**
4. Execute este SQL completo:

```sql
-- ============================================
-- CORREÇÕES PARA O SCHEMA ATUAL
-- ============================================

-- Adiciona vínculo com auth.users
ALTER TABLE users
ADD COLUMN IF NOT EXISTS auth_user_id UUID UNIQUE;

-- Remove policies antigas
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Users can view their own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can insert their own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can update their own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can delete their own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;

-- ============================================
-- USERS
-- ============================================

CREATE POLICY "Users can view own user record"
ON users
FOR SELECT
USING (
auth_user_id = auth.uid()
);

CREATE POLICY "Users can update own user record"
ON users
FOR UPDATE
USING (
auth_user_id = auth.uid()
);

-- ============================================
-- EXPENSES
-- ============================================

CREATE POLICY "Users can view own expenses"
ON expenses
FOR SELECT
USING (
user_id IN (
SELECT id
FROM users
WHERE auth_user_id = auth.uid()
)
);

CREATE POLICY "Users can insert own expenses"
ON expenses
FOR INSERT
WITH CHECK (
user_id IN (
SELECT id
FROM users
WHERE auth_user_id = auth.uid()
)
);

CREATE POLICY "Users can update own expenses"
ON expenses
FOR UPDATE
USING (
user_id IN (
SELECT id
FROM users
WHERE auth_user_id = auth.uid()
)
);

CREATE POLICY "Users can delete own expenses"
ON expenses
FOR DELETE
USING (
user_id IN (
SELECT id
FROM users
WHERE auth_user_id = auth.uid()
)
);

-- ============================================
-- USER PROFILES
-- ============================================

CREATE POLICY "Users can view own profile"
ON user_profiles
FOR SELECT
USING (
user_id IN (
SELECT id
FROM users
WHERE auth_user_id = auth.uid()
)
);

CREATE POLICY "Users can update own profile"
ON user_profiles
FOR UPDATE
USING (
user_id IN (
SELECT id
FROM users
WHERE auth_user_id = auth.uid()
)
);

CREATE POLICY "Users can insert own profile"
ON user_profiles
FOR INSERT
WITH CHECK (
user_id IN (
SELECT id
FROM users
WHERE auth_user_id = auth.uid()
)
);
```

### 3. Testar (⏱️ ~2 minutos)

```bash
npm run dev
```

Acesse: http://localhost:5173

- [x] Clique em "Cadastre-se"
- [x] Crie uma conta com email e senha
- [x] Faça login
- [x] Você deve ver o dashboard

### 4. Integrar Dashboard (⏱️ ~1 minuto)

**Opção A: Copiar e colar (mais fácil)**

1. Abra `APPDASHBOARD_EXAMPLE.tsx`
2. Copie todo o conteúdo
3. Cole em `src/AppDashboard.tsx`
4. Salve o arquivo

**Opção B: Entender a estrutura**

No dashboard, você pode usar:

```typescript
import { useAuthUser, useExpenses } from './hooks/useDatabase';
import { createExpense, deleteExpense, updateExpense } from './services/api';

export function Dashboard() {
  const { user } = useAuthUser();
  const { expenses } = useExpenses(user?.id);
  
  // Adicionar despesa
  const handleAdd = async () => {
    await createExpense({
      user_id: user.id,
      description: 'Almoço',
      amount: 25.50,
      category: 'Comida',
      date: new Date().toISOString().split('T')[0]
    });
  };
  
  return <div>/* seu componente */</div>;
}
```

---

## 📚 Estrutura de Pastas

```
src/
├── services/
│   ├── auth.ts          ✅ Autenticação
│   ├── api.ts           ✅ CRUD de despesas
│   └── supabase.ts      ✅ Cliente Supabase
├── hooks/
│   └── useDatabase.ts   ✅ Hooks customizados
├── pages/
│   ├── Login.tsx        ✅ Atualizado
│   ├── Register.tsx     ✅ Atualizado
│   └── Dashboard.tsx    ⏳ Usar exemplo
├── components/
│   └── ProtectedRoute.tsx ✅ Atualizado
└── App.tsx              ✅ Atualizado
```

---

## 🔥 Funcionalidades Prontas para Usar

### 1. Autenticação
```typescript
import { register, login, logout, getCurrentUser } from './services/auth';

// Registrar
await register('email@example.com', 'password123');

// Login
await login('email@example.com', 'password123');

// Logout
await logout();

// Obter usuário atual
const user = await getCurrentUser();
```

### 2. Despesas
```typescript
import { getExpenses, createExpense, updateExpense, deleteExpense } from './services/api';

// Buscar despesas
const expenses = await getExpenses(userId);

// Adicionar
await createExpense({
  user_id: userId,
  description: 'Almoço',
  amount: 25.50,
  category: 'Comida',
  date: '2026-06-03'
});

// Editar
await updateExpense(id, { amount: 30.00 });

// Deletar
await deleteExpense(id);
```

### 3. Hooks
```typescript
import { useAuthUser, useExpenses, useUserProfile } from './hooks/useDatabase';

const { user, loading } = useAuthUser();
const { expenses, loading } = useExpenses(user?.id);
const { profile, loading } = useUserProfile(user?.id);
```

---

## 🎯 Checklist Rápido

- [ ] SQL executado no Supabase
- [ ] `npm run dev` funciona
- [ ] Conseguir registrar novo usuário
- [ ] Conseguir fazer login
- [ ] Conseguir fazer logout
- [ ] Dashboard carrega
- [ ] Integrar exemplo em AppDashboard.tsx
- [ ] Testar adicionar despesa
- [ ] Testar editar despesa
- [ ] Testar deletar despesa

---

## ⚠️ Se Algo Deu Errado

### Erro: "Supabase credentials are not configured"
```bash
# Reiniciar servidor
npm run dev
```

### Erro: "Policy violation"
```bash
# Certifique-se que rodou TODO o SQL
# Vá em Supabase > SQL Editor e execute tudo novamente
```

### Erro: "Column auth_user_id not found"
```sql
-- Execute manualmente
ALTER TABLE users
ADD COLUMN IF NOT EXISTS auth_user_id UUID UNIQUE;
```

---

## 🔗 Links Úteis

- 📖 [Documentação Completa](./SUPABASE_INTEGRATION.md)
- 🆘 [Troubleshooting](./SUPABASE_RESUMO.md)
- 📋 [Checklist](./CHECKLIST.md)
- 📂 [Exemplo Dashboard](./APPDASHBOARD_EXAMPLE.tsx)
- 🗄️ [Setup SQL](./SUPABASE_SETUP.md)

---

**Tempo estimado: 5 minutos ⏱️**

**Pronto para começar?** Vá para **Passo 2** acima! 🚀
