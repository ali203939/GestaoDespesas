# 🚀 Guia Completo: Resolver Todos os Erros e Funcionar 100%

Você tem 2 erros em sequência. Este guia resolve **AMBOS** de forma permanente.

---

## 🎯 Resumo dos Problemas

| Erro | Causa | Solução |
|------|-------|---------|
| **403 - RLS Policy Violation** | Política de INSERT incorreta | Criar função PostgreSQL |
| **400 - NOT NULL Constraint** | Coluna `password` sem valor | Remover coluna ou usar função |

**Solução Única:** Usar função PostgreSQL que evita ambos os problemas!

---

## ✅ Passo 1: Limpar a Tabela `users`

**No Supabase → SQL Editor**, execute:

```sql
-- Opção 1: REMOVER COLUNA PASSWORD (recomendado)
ALTER TABLE users
DROP COLUMN IF EXISTS password;

-- Opção 2: OU torná-la nullable se quiser manter
-- ALTER TABLE users ALTER COLUMN password DROP NOT NULL;
```

---

## ✅ Passo 2: Criar a Função PostgreSQL

**No Supabase → SQL Editor**, execute:

```sql
CREATE OR REPLACE FUNCTION public.create_or_update_user(
  p_user_id UUID,
  p_user_email TEXT
)
RETURNS TABLE (id UUID, auth_user_id UUID, email TEXT, created_at TIMESTAMP, updated_at TIMESTAMP) AS $$
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

-- Permitir que usuários autenticados executem a função
GRANT EXECUTE ON FUNCTION public.create_or_update_user(UUID, TEXT) TO authenticated;
```

---

## ✅ Passo 3: Configurar RLS Policies Simples

**Remova todas as policies antigas de INSERT:**

```sql
DROP POLICY IF EXISTS "Users can insert own user record" ON users;
DROP POLICY IF EXISTS "Users can update own user record" ON users;
DROP POLICY IF EXISTS "Allow authenticated users to insert users" ON users;
DROP POLICY IF EXISTS "Allow authenticated users to update users" ON users;
```

**Crie apenas as de SELECT (a função cuida do INSERT/UPDATE):**

```sql
CREATE POLICY "Users can view own user record"
ON users
FOR SELECT
USING (auth_user_id = auth.uid());

CREATE POLICY "Users can update own user record"
ON users
FOR UPDATE
USING (auth_user_id = auth.uid());
```

---

## ✅ Passo 4: Verificar a Estrutura da Tabela `users`

A tabela deve ter **APENAS** essas colunas:

```sql
-- Verificar estrutura
\d users

-- Resultado esperado:
-- id UUID PRIMARY KEY
-- auth_user_id UUID UNIQUE NOT NULL
-- email TEXT NOT NULL
-- created_at TIMESTAMP
-- updated_at TIMESTAMP
```

Se houver outras colunas (como `password`), remova-as:

```sql
ALTER TABLE users DROP COLUMN password;
```

---

## ✅ Passo 5: Aplicação React Já Está Atualizada!

O código do `src/services/supabase.ts` **já foi atualizado** para usar a função:

```typescript
export async function createOrUpdateUserData(userId: string, email: string) {
  try {
    const { data, error } = await supabase
      .rpc('create_or_update_user', {  // ← Chama a função PostgreSQL
        p_user_id: userId,
        p_user_email: email,
      });

    if (error) {
      console.error('Erro ao criar/atualizar usuário:', error);
      return null;
    }
    
    return data?.[0] || null;
  } catch (error) {
    console.error('Erro ao executar função:', error);
    return null;
  }
}
```

✅ Não precisa mexer no código React!

---

## ✅ Passo 6: Testar a Solução

1. **Recarregue a aplicação**: F5 ou Ctrl+Shift+R
2. **Limpe a sessão**: Logout (se estiver logado)
3. **Tente registrar**: Use um **novo email** (ex: teste123@gmail.com)
4. **Verifique o console**: F12 → Console
   - Se ver `Erro ao criar/atualizar usuário`, copie a mensagem
   - Se NÃO ver erro, o registro funcionou! ✅

5. **Se o registro funcionou, tente fazer login** com o mesmo email

6. **Se o login funcionou, tente adicionar uma despesa** no dashboard

---

## 🔍 Se Ainda Não Funcionar

### **Verificação 1: Função Existe?**
No Supabase → **Functions**, procure por `create_or_update_user`
- Se não existir → Execute o SQL do Passo 2 novamente

### **Verificação 2: Quais são as Colunas da Tabela?**
Execute no SQL Editor:
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;
```

Resultado esperado:
```
id            | uuid      | NO
auth_user_id  | uuid      | NO
email         | text      | NO
created_at    | timestamp | YES
updated_at    | timestamp | YES
```

Se tiver coluna `password`, remova:
```sql
ALTER TABLE users DROP COLUMN password;
```

### **Verificação 3: Qual é o Erro Exato?**
Copie a mensagem completa do F12 Console e compartilhe aqui!

---

## 📋 Checklist Final

Marque tudo que completou:

- [ ] Removi a coluna `password` da tabela `users`
- [ ] Criei a função `create_or_update_user` no PostgreSQL
- [ ] Ejecutei `GRANT EXECUTE` para a função
- [ ] Removi as policies antigas de INSERT
- [ ] Criei as policies de SELECT
- [ ] Recarreguei a aplicação React
- [ ] Testei registrar um novo usuário
- [ ] Testei fazer login
- [ ] Testei adicionar uma despesa

✅ Se todos os checkboxes estão marcados, está 100% funcionando!

---

## 🎉 Sucesso!

Depois de completar esses passos, sua integração Supabase estará **totalmente funcional** com:
- ✅ Autenticação segura
- ✅ RLS policies protegendo dados
- ✅ Função PostgreSQL para operações de usuário
- ✅ Sem erros de constraint ou policy violation
