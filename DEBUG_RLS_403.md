# Debug: Erro 403 RLS Policy Violation

## 🔴 Problema
```
HTTP/2 403
new row violates row-level security policy for table "users"
Code: 42501
```

## 🔍 Causa Provável

A política de INSERT para a tabela `users` está **muito restritiva** ou **não foi criada corretamente**.

---

## ✅ Solução Rápida

### Passo 1: Verifique as Políticas Existentes
1. Acesse Supabase → **Authentication** → **Policies**
2. Expanda a tabela **users**
3. Procure por "Users can insert own user record"
4. Se NÃO existir, o INSERT falhará

### Passo 2: Se a Política Não Existir, Execute Este SQL

```sql
-- Remover policies antigas de INSERT na tabela users
DROP POLICY IF EXISTS "Users can insert own user record" ON users;

-- Criar a nova policy de INSERT
CREATE POLICY "Users can insert own user record"
ON users
FOR INSERT
WITH CHECK (
  auth_user_id = auth.uid()
);
```

### Passo 3: Adicione uma Política de SELECT (Importante!)

```sql
-- Remover antiga
DROP POLICY IF EXISTS "Users can view own user record" ON users;

-- Criar nova
CREATE POLICY "Users can view own user record"
ON users
FOR SELECT
USING (
  auth_user_id = auth.uid()
);
```

---

## 🚨 Solução Alternativa: Se Persistir o Erro

Se o erro **ainda persistir**, há 2 causas possíveis:

### **Causa 1: RLS está bloqueando mesmo usuários autenticados**
Neste caso, crie uma política que permite INSERT/UPDATE sem verificação ao usuário autenticado:

```sql
-- Política mais permissiva (apenas para debug)
CREATE POLICY "Allow authenticated users to insert users"
ON users
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update users"
ON users
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);
```

⚠️ **AVISO**: Isso é menos seguro. Use apenas para debug!

### **Causa 2: Usar Service Role Key para Inserts**

Se o acesso não for possível com a chave pública, você precisa usar a **Service Role Key** do Supabase para operações de INSERT na tabela `users`.

1. No Supabase, vá para **Project Settings** → **API**
2. Copie a **Service Role Key** (não a Publishable Key)
3. Armazene em `.env.local`:
```
VITE_SUPABASE_SERVICE_ROLE_KEY=seu_service_role_key_aqui
```

4. Atualize [src/services/supabase.ts](src/services/supabase.ts):

```typescript
// Criar cliente com Service Role (apenas para operações de INSERT de users)
export function createServiceRoleClient() {
  const serviceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
  
  if (!serviceKey) {
    console.error('Service Role Key não configurada!');
    return null;
  }
  
  return createClient(
    import.meta.env.VITE_SUPABASE_URL,
    serviceKey
  );
}
```

---

## 🔧 Abordagem Recomendada (Melhor Prática)

A forma **mais segura e correta** é usar uma **função PostgreSQL (stored procedure)** para fazer o INSERT:

```sql
-- Criar função para inserir/atualizar usuário
CREATE OR REPLACE FUNCTION public.create_or_update_user(
  user_id UUID,
  user_email TEXT
)
RETURNS TABLE (
  id UUID,
  auth_user_id UUID,
  email TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  INSERT INTO users (auth_user_id, email, updated_at)
  VALUES (user_id, user_email, NOW())
  ON CONFLICT (auth_user_id) 
  DO UPDATE SET 
    email = user_email,
    updated_at = NOW()
  RETURNING users.*;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Conceder acesso à função para usuários autenticados
GRANT EXECUTE ON FUNCTION public.create_or_update_user TO authenticated;
```

Depois, atualize [src/services/supabase.ts](src/services/supabase.ts):

```typescript
export async function createOrUpdateUserData(userId: string, email: string) {
  const { data, error } = await supabase
    .rpc('create_or_update_user', {
      user_id: userId,
      user_email: email,
    });

  if (error) {
    console.error('Erro ao criar/atualizar usuário:', error);
    return null;
  }
  return data;
}
```

---

## 📋 Checklist de Debug

- [ ] Política "Users can insert own user record" existe?
- [ ] Política "Users can view own user record" existe?
- [ ] RLS está HABILITADO na tabela users?
- [ ] Usuário está logado (autenticado)?
- [ ] `auth_user_id` é passado corretamente?
- [ ] Service Role Key foi testada?
- [ ] Função PostgreSQL foi criada?

---

## 🎯 Próximas Ações

1. Execute o SQL do **Passo 2** (criar políticas se não existirem)
2. Se ainda falhar, execute o SQL da **Causa 1** (política permissiva)
3. Se ainda falhar, implemente a **função PostgreSQL** (melhor prática)

Teste após cada etapa registrando um novo usuário!
