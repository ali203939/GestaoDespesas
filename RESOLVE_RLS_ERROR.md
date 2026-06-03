# Como Resolver: "Row-Level Security Policy" Error

## ⚠️ O Problema
Você recebeu este erro:
```
new row violates row-level security policy for table "users"
Code: 42501
```

**Causa:** As RLS policies não foram criadas/configuradas no Supabase ainda.

---

## ✅ Solução em 5 Passos

### Passo 1: Acesse seu Supabase Project
1. Vá para https://supabase.com/
2. Faça login com suas credenciais
3. Clique no seu projeto **GestaoDespesas**

### Passo 2: Acesse o SQL Editor
1. No painel esquerdo, clique em **SQL Editor** (ou **SQL** dependendo da versão)
2. Clique em **+ New Query**

### Passo 3: Copie e Cole o SQL

Execute os comandos na seguinte ordem:

**1️⃣ PRIMEIRO - Adicione a coluna `auth_user_id`:**
```sql
ALTER TABLE users
ADD COLUMN IF NOT EXISTS auth_user_id UUID UNIQUE;
```
- Clique em **Run** (Ctrl+Enter)
- Espere a resposta

**2️⃣ SEGUNDO - Remova TODAS as políticas antigas:**
```sql
-- Remover policies da tabela users
DROP POLICY IF EXISTS "Users can view own user record" ON users;
DROP POLICY IF EXISTS "Users can update own user record" ON users;
DROP POLICY IF EXISTS "Users can insert own user record" ON users;
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;

-- Remover policies da tabela expenses
DROP POLICY IF EXISTS "Users can view own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can insert own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can update own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can delete own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can view their own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can insert their own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can update their own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can delete their own expenses" ON expenses;

-- Remover policies da tabela user_profiles
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
```
- Clique em **Run**
- Se receber mensagens tipo "policy does not exist" é normal e pode ignorar

**3️⃣ TERCEIRO - Crie as políticas para USERS:**
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

CREATE POLICY "Users can insert own user record"
ON users
FOR INSERT
WITH CHECK (
  auth_user_id = auth.uid()
);
```
- Clique em **Run**

**4️⃣ QUARTO - Crie as políticas para EXPENSES:**
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
- Clique em **Run**

**5️⃣ QUINTO - Crie as políticas para USER_PROFILES:**
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
- Clique em **Run**

### Passo 4: Verifique se RLS está Habilitado
1. No painel esquerdo, clique em **Authentication** (ícone de cadeado)
2. Vá para **Policies** ou **RLS**
3. Certifique-se de que RLS está **HABILITADO** para:
   - ✅ `users`
   - ✅ `expenses`
   - ✅ `user_profiles`

Se RLS não estiver habilitado, clique em **Enable** para cada tabela.

### Passo 5: Teste a Aplicação
1. Volte para sua aplicação React
2. **Faça logout** (limpe a sessão)
3. **Recarregue a página** (F5 ou Ctrl+Shift+R)
4. Tente se registrar novamente com um novo email
5. Após registrar, faça login
6. Tente adicionar uma despesa

---

## � Se Receber: "Policy Already Exists"

Se receber este erro:
```
ERROR: 42710: policy "Users can update own user record" for table "users" already exists
```

**Solução:**

1. No painel esquerdo, clique em **Authentication** (ícone de cadeado)
2. Clique em **Policies**
3. Para cada tabela (users, expenses, user_profiles):
   - Expanda a tabela
   - Delete MANUALMENTE cada política (clique no ícone de lixo 🗑️)
4. Depois execute novamente o SQL de criação das políticas

**OU execute este SQL que deleta TODAS as policies de uma vez:**

```sql
-- Dropar TODAS as policies
DROP POLICY IF EXISTS "Users can view own user record" ON users;
DROP POLICY IF EXISTS "Users can update own user record" ON users;
DROP POLICY IF EXISTS "Users can insert own user record" ON users;
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Users can view own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can insert own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can update own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can delete own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can view their own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can insert their own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can update their own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can delete their own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
```

Clique em **Run** e depois execute novamente os comandos de criação das políticas (passos 3, 4, 5).

---

### Verifique:
1. **Variáveis de ambiente corretas?**
   - Arquivo `.env.local` tem `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`?
   - São as mesmas do seu projeto Supabase?

2. **Console do Navegador:**
   - F12 > Console
   - Procure por mais detalhes do erro
   - Copie a mensagem completa se houver

3. **Tabelas existem?**
   - No Supabase, vá para **Databases** > **Tables**
   - Verifique se `users`, `expenses`, `user_profiles` existem

4. **RLS Policy Correta?**
   - Vá para **Authentication** > **Policies**
   - Confirme que todas as 9 policies foram criadas

---

## 📝 Resumo das RLS Policies

| Tabela | Operação | Limite |
|--------|----------|--------|
| **users** | SELECT | Usuário vê apenas seu próprio registro |
| **users** | UPDATE | Usuário atualiza apenas seu próprio registro |
| **users** | INSERT | Usuário insere apenas com seu auth_user_id |
| **expenses** | SELECT | Usuário vê apenas despesas dele |
| **expenses** | INSERT | Usuário insere apenas despesas dele |
| **expenses** | UPDATE | Usuário atualiza apenas despesas dele |
| **expenses** | DELETE | Usuário deleta apenas despesas dele |
| **user_profiles** | SELECT | Usuário vê apenas seu perfil |
| **user_profiles** | UPDATE | Usuário atualiza apenas seu perfil |
| **user_profiles** | INSERT | Usuário insere apenas seu perfil |

---

## ✨ Pronto!
Após executar todos os passos, sua aplicação funcionará corretamente com Supabase!

Se ainda tiver problemas, verifique os **Passo 4** e **Passo 5** da seção "Se o Erro Persistir".
