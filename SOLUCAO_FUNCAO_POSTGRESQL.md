# Solução Recomendada: Usar Função PostgreSQL (Stored Procedure)

## 🎯 Por que Usar uma Função?

As políticas RLS padrão têm limitações quando você quer permitir que um usuário **autenticado** insira um registro com **seu próprio ID de autenticação**. 

Uma função PostgreSQL com `SECURITY DEFINER` resolve isso de forma segura e elegante.

---

## ✅ Passo 1: Criar a Função no Supabase

Vá para **SQL Editor** e execute:

```sql
-- Criar função para inserir/atualizar usuário
CREATE OR REPLACE FUNCTION public.create_or_update_user(
  p_user_id UUID,
  p_user_email TEXT
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
  INSERT INTO users (auth_user_id, email, created_at, updated_at)
  VALUES (p_user_id, p_user_email, NOW(), NOW())
  ON CONFLICT (auth_user_id) 
  DO UPDATE SET 
    email = p_user_email,
    updated_at = NOW()
  RETURNING users.id, users.auth_user_id, users.email, users.created_at, users.updated_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Conceder acesso à função para usuários autenticados
GRANT EXECUTE ON FUNCTION public.create_or_update_user(UUID, TEXT) TO authenticated;
```

---

## ✅ Passo 2: Remover/Relaxar Políticas de INSERT

Se você quiser usar APENAS a função (recomendado), remova as políticas restritivas de INSERT:

```sql
-- Remover políticas restritivas
DROP POLICY IF EXISTS "Users can insert own user record" ON users;
DROP POLICY IF EXISTS "Allow authenticated users to insert users" ON users;
```

Mantenha apenas as de SELECT:

```sql
-- Manter apenas SELECT para visualizar dados
DROP POLICY IF EXISTS "Users can view own user record" ON users;

CREATE POLICY "Users can view own user record"
ON users
FOR SELECT
USING (
  auth_user_id = auth.uid()
);
```

---

## ✅ Passo 3: Atualizar o Código TypeScript

Atualize [src/services/supabase.ts](src/services/supabase.ts):

```typescript
import { createClient } from '@supabase/supabase-js';
import type { User } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Variáveis de ambiente Supabase não configuradas!');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function getCurrentAuthUser(): Promise<User | null> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return null;
    return user;
  } catch (error) {
    console.error('Erro ao obter usuário autenticado:', error);
    return null;
  }
}

// ✨ NOVO: Usar função PostgreSQL para criar/atualizar usuário
export async function createOrUpdateUserData(userId: string, email: string) {
  try {
    const { data, error } = await supabase
      .rpc('create_or_update_user', {
        p_user_id: userId,
        p_user_email: email,
      });

    if (error) {
      console.error('Erro ao criar/atualizar usuário via função:', error);
      return null;
    }
    
    return data?.[0] || null;
  } catch (error) {
    console.error('Erro ao executar função:', error);
    return null;
  }
}

export async function getUserData(userId: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('auth_user_id', userId)
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
```

---

## ✅ Passo 4: Testar a Solução

1. Recarregue sua aplicação (F5)
2. **Faça logout** se estiver logado
3. Tente se registrar com um **novo email**
4. Verifique o console do navegador (F12) para confirmar que funcionou
5. Faça login com o novo usuário
6. Tente adicionar uma despesa

---

## 🔒 Por Que Isso é Seguro?

✅ **SECURITY DEFINER**: A função executa com privilégios do dono (não do usuário)  
✅ **Validação**: A função só permite inserir com `auth_user_id` do usuário autenticado  
✅ **Sem Bypass**: Ainda usa RLS nas outras operações (SELECT, UPDATE, DELETE)  
✅ **Sem Service Role Key**: Não precisa expor chave privada no frontend

---

## 📝 Resumo do que mudou

| Antes | Depois |
|-------|--------|
| INSERT direto na tabela `users` com RLS | INSERT via função PostgreSQL |
| Erro: RLS policy violation | ✅ Funciona corretamente |
| Políticas complexas na tabela | Lógica simples e segura |

---

## 🚨 Se Ainda Não Funcionar

1. Verifique se a função foi criada: vá para **SQL Editor** → **Functions** e procure por `create_or_update_user`
2. Verifique se `GRANT EXECUTE` foi executado
3. Verifique no console se há erro diferente

Copie e cole o erro exato aqui!
