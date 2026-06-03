# 🗄️ Estrutura do Banco de Dados

## Tabelas Principais

### 1. `users`
Tabela de usuários vinculada com autenticação do Supabase

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

**Colunas:**
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID | Identificador único |
| `auth_user_id` | UUID | Vinculado com auth.users |
| `email` | TEXT | Email do usuário |
| `created_at` | TIMESTAMP | Criado em |
| `updated_at` | TIMESTAMP | Atualizado em |

**Índices:**
- PK: `id`
- UNIQUE: `auth_user_id`

---

### 2. `expenses`
Tabela de despesas/gastos do usuário

```sql
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

**Colunas:**
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID | Identificador único |
| `user_id` | UUID | Usuário dono (FK) |
| `description` | TEXT | Descrição/nome do gasto |
| `amount` | DECIMAL | Valor numérico (até 99,999.99) |
| `category` | TEXT | Categoria (Essencial, Comida, etc) |
| `date` | DATE | Data do gasto |
| `created_at` | TIMESTAMP | Criado em |
| `updated_at` | TIMESTAMP | Atualizado em |

**Índices:**
- PK: `id`
- FK: `user_id` → `users.id`

**Categorias Suportadas:**
- `Essencial` - Necessidades básicas
- `Comida` - Alimentação
- `Saúde` - Saúde e bem-estar
- `Transporte` - Transporte
- `Outros` - Outros gastos

---

### 3. `user_profiles`
Tabela com informações adicionais do usuário (opcional)

```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  name TEXT,
  phone TEXT,
  avatar_url TEXT,
  currency TEXT DEFAULT 'BRL',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

**Colunas:**
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID | Identificador único |
| `user_id` | UUID | Usuário (FK, UNIQUE) |
| `name` | TEXT | Nome completo |
| `phone` | TEXT | Telefone |
| `avatar_url` | TEXT | URL do avatar |
| `currency` | TEXT | Moeda (padrão: BRL) |
| `created_at` | TIMESTAMP | Criado em |
| `updated_at` | TIMESTAMP | Atualizado em |

**Índices:**
- PK: `id`
- FK+UNIQUE: `user_id` → `users.id`

---

## Row Level Security (RLS)

### Policies para `users`

**SELECT** - Usuário vê seu próprio registro
```sql
CREATE POLICY "Users can view own user record"
ON users
FOR SELECT
USING (
  auth_user_id = auth.uid()
);
```

**UPDATE** - Usuário atualiza seu próprio registro
```sql
CREATE POLICY "Users can update own user record"
ON users
FOR UPDATE
USING (
  auth_user_id = auth.uid()
);
```

---

### Policies para `expenses`

**SELECT** - Ver próprias despesas
```sql
CREATE POLICY "Users can view own expenses"
ON expenses
FOR SELECT
USING (
  user_id IN (
    SELECT id FROM users WHERE auth_user_id = auth.uid()
  )
);
```

**INSERT** - Adicionar despesa própria
```sql
CREATE POLICY "Users can insert own expenses"
ON expenses
FOR INSERT
WITH CHECK (
  user_id IN (
    SELECT id FROM users WHERE auth_user_id = auth.uid()
  )
);
```

**UPDATE** - Editar despesa própria
```sql
CREATE POLICY "Users can update own expenses"
ON expenses
FOR UPDATE
USING (
  user_id IN (
    SELECT id FROM users WHERE auth_user_id = auth.uid()
  )
);
```

**DELETE** - Deletar despesa própria
```sql
CREATE POLICY "Users can delete own expenses"
ON expenses
FOR DELETE
USING (
  user_id IN (
    SELECT id FROM users WHERE auth_user_id = auth.uid()
  )
);
```

---

### Policies para `user_profiles`

**SELECT** - Ver próprio perfil
```sql
CREATE POLICY "Users can view own profile"
ON user_profiles
FOR SELECT
USING (
  user_id IN (
    SELECT id FROM users WHERE auth_user_id = auth.uid()
  )
);
```

**UPDATE** - Editar próprio perfil
```sql
CREATE POLICY "Users can update own profile"
ON user_profiles
FOR UPDATE
USING (
  user_id IN (
    SELECT id FROM users WHERE auth_user_id = auth.uid()
  )
);
```

**INSERT** - Criar perfil
```sql
CREATE POLICY "Users can insert own profile"
ON user_profiles
FOR INSERT
WITH CHECK (
  user_id IN (
    SELECT id FROM users WHERE auth_user_id = auth.uid()
  )
);
```

---

## Relacionamentos

```
┌─────────────────┐
│   auth.users    │
│  (Supabase)     │
└────────┬────────┘
         │ id
         │
         │ auth_user_id
┌────────▼────────┐        ┌──────────────────┐
│     users       ├───────►│ user_profiles    │
│                 │  1:1   │                  │
└────────┬────────┘        └──────────────────┘
         │ id
         │
         │ user_id
┌────────▼────────┐
│    expenses     │
│                 │
└─────────────────┘
```

---

## Exemplos de Queries

### Buscar despesas de um usuário
```sql
SELECT * FROM expenses
WHERE user_id = (
  SELECT id FROM users 
  WHERE auth_user_id = auth.uid()
)
ORDER BY date DESC;
```

### Total de despesas por categoria
```sql
SELECT category, SUM(amount) as total
FROM expenses
WHERE user_id = (
  SELECT id FROM users 
  WHERE auth_user_id = auth.uid()
)
GROUP BY category
ORDER BY total DESC;
```

### Despesas do mês atual
```sql
SELECT * FROM expenses
WHERE user_id = (
  SELECT id FROM users 
  WHERE auth_user_id = auth.uid()
)
AND date >= date_trunc('month', CURRENT_DATE)
ORDER BY date DESC;
```

### Atualizar perfil do usuário
```sql
UPDATE user_profiles
SET name = 'João Silva', updated_at = now()
WHERE user_id = (
  SELECT id FROM users 
  WHERE auth_user_id = auth.uid()
);
```

---

## Backup & Segurança

### ✅ O que está seguro
- Autenticação por auth.users (OAuth, email, etc)
- RLS ativado em todas as tabelas
- Apenas o usuário vê seus próprios dados
- Senhas nunca são armazenadas (gerenciado por Supabase)

### 🛡️ Best Practices
1. Nunca compartilhar VITE_SUPABASE_PUBLISHABLE_KEY em produção com service_role_key
2. RLS deve estar sempre ativado
3. Fazer backup regularmente no painel do Supabase
4. Usar migrations para alterações de schema

---

## Dicas de Performance

1. **Índices:** Já existem em colunas principais
2. **Paginação:** Usar LIMIT/OFFSET para grandes datasets
3. **Lazy Loading:** Buscar dados conforme necessário
4. **Cache:** Frontend pode cachear dados localmente

### Exemplo com paginação
```typescript
const { data } = await supabase
  .from('expenses')
  .select('*')
  .eq('user_id', userId)
  .order('date', { ascending: false })
  .range(0, 9);  // Primeiros 10 registros
```

---

**Última atualização**: 3 de junho de 2026
**Versão**: 1.0.0
