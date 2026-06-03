# Instruções para Configurar o Supabase

## 1. Criar as Tabelas e RLS Policies

Acesse seu projeto no Supabase em: https://supabase.com/

Vá para **SQL Editor** e execute os seguintes comandos:

### A. Adicionar coluna `auth_user_id` na tabela `users`

```sql
ALTER TABLE users
ADD COLUMN IF NOT EXISTS auth_user_id UUID UNIQUE;
```

### B. Remover políticas antigas

```sql
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Users can view their own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can insert their own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can update their own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can delete their own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
```

### C. Criar novas policies para USERS

```sql
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
```

### D. Criar policies para EXPENSES

```sql
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
```

### E. Criar policies para USER_PROFILES

```sql
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

## 2. Ativar RLS (Row Level Security)

No painel do Supabase, vá para **Authentication > Policies** e certifique-se de que RLS está habilitado para as tabelas:
- users
- expenses
- user_profiles

## 3. Testar a Integração

1. Abra seu projeto em desenvolvimento:
```bash
npm run dev
```

2. Acesse `http://localhost:5173`

3. Teste o registro e login com suas credenciais do Supabase

4. Navegue até o dashboard para verificar se tudo está funcionando

## 4. Variáveis de Ambiente

O arquivo `.env.local` já foi criado com suas credenciais:
```
VITE_SUPABASE_URL=https://xpyvjcgdwzfkgipzaruk.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_CgyY7v5ac6H4AKqC-nCIvA_07C9CX2D
```

## 5. Próximos Passos

- [ ] Executar o SQL no Supabase
- [ ] Testar o registro/login
- [ ] Integrar CRUD de despesas no Dashboard
- [ ] Implementar sincronização real-time com Supabase listeners
