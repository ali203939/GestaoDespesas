# Debug: Erro 400 - NOT NULL Constraint Violation

## 🔴 Problema
```
HTTP/2 400
null value in column "password" of relation "users" violates not-null constraint
Code: 23502
```

## 🔍 Causa

A tabela `users` foi criada com uma coluna `password` que **não pode ser NULL**, mas sua aplicação não está preenchendo esse campo.

**Por quê?** Porque o Supabase Auth **já armazena a senha com segurança** na tabela de autenticação. A coluna `password` na tabela `users` não é necessária!

---

## ✅ Solução: Remover o Constraint NOT NULL

### Passo 1: Verificar a Estrutura Atual
1. Vá para Supabase → **Databases** → **Tables** → **users**
2. Verifique se a coluna `password` existe
3. Procure pelo ícone ⚠️ que indica NOT NULL constraint

### Passo 2: Remover o Constraint

Execute este SQL no **SQL Editor**:

```sql
-- Tornar a coluna password nullable (opcional)
ALTER TABLE users
ALTER COLUMN password DROP NOT NULL;
```

**OU**, se preferir remover a coluna completamente (recomendado):

```sql
-- Remover a coluna password completamente
ALTER TABLE users
DROP COLUMN IF EXISTS password;
```

---

## 📋 Verificar Estrutura Correta da Tabela

A tabela `users` deve ter **apenas essas colunas**:

```sql
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID UNIQUE NOT NULL,  -- Vinculado ao Supabase Auth
  email TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

Se sua tabela tem coluna `password`, **remova-a**!

---

## 🔒 Por que Não Armazenar Senha na Tabela `users`?

✅ Segurança melhor - Supabase Auth usa bcrypt com salt  
✅ Sem duplicação - Senha já está no auth system  
✅ Menos exposição - Reduz superfície de ataque  
✅ Compliance - Atende LGPD/GDPR mais facilmente

---

## 🔧 Próximos Passos

1. Execute um dos SQLs acima (DROP COLUMN é o mais limpo)
2. Recarregue a aplicação (F5)
3. Tente registrar um novo usuário novamente
4. O erro deve desaparecer!

---

## 📝 Se Quiser Restaurar a Tabela Completa

Se sua tabela está muito bagunçada, recrie-a do zero:

```sql
-- Dropar tabela antiga
DROP TABLE IF EXISTS users CASCADE;

-- Recriar tabela correta
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID UNIQUE NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Criar policies
CREATE POLICY "Users can view own user record"
ON users
FOR SELECT
USING (auth_user_id = auth.uid());

CREATE POLICY "Users can update own user record"
ON users
FOR UPDATE
USING (auth_user_id = auth.uid());

CREATE POLICY "Users can insert own user record"
ON users
FOR INSERT
WITH CHECK (auth_user_id = auth.uid());

-- Ou usar função PostgreSQL (recomendado)
CREATE OR REPLACE FUNCTION public.create_or_update_user(
  p_user_id UUID,
  p_user_email TEXT
)
RETURNS TABLE (id UUID, auth_user_id UUID, email TEXT, created_at TIMESTAMP, updated_at TIMESTAMP)
AS $$
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

GRANT EXECUTE ON FUNCTION public.create_or_update_user(UUID, TEXT) TO authenticated;
```

---

## ✨ Checklist

- [ ] Coluna `password` foi removida ou tornada nullable?
- [ ] Tabela `users` tem apenas: id, auth_user_id, email, created_at, updated_at?
- [ ] RLS está habilitado?
- [ ] Função `create_or_update_user` existe?
- [ ] Aplicação foi recarregada?

Teste novamente!
