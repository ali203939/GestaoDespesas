# Integração Supabase - Guia de Uso

## ✅ O que foi implementado

### 1. **Autenticação com Supabase**
- ✅ Registro de usuários com validação
- ✅ Login com credenciais
- ✅ Logout automático
- ✅ Verificação de sessão em tempo real
- ✅ Rotas protegidas

### 2. **Variáveis de Ambiente**
- ✅ `.env.local` criado com credenciais do Supabase

### 3. **Serviços e Hooks**

#### `src/services/supabase.ts`
Cliente Supabase e helpers para o banco de dados

```typescript
import { supabase } from './supabase';

// Obter usuário autenticado
const user = await getCurrentAuthUser();

// Obter dados do usuário no banco
const userData = await getUserData(userId);

// Criar/atualizar usuário
await createOrUpdateUserData(userId, email);
```

#### `src/services/auth.ts`
Funções de autenticação (agora com Supabase)

```typescript
import { register, login, logout, getCurrentUser, onAuthStateChanged } from './services/auth';

// Registrar novo usuário
const response = await register('email@example.com', 'password123');

// Fazer login
const response = await login('email@example.com', 'password123');

// Fazer logout
const response = await logout();

// Obter usuário atual
const user = await getCurrentUser();

// Monitorar mudanças de autenticação
const subscription = onAuthStateChanged((user) => {
  console.log('Usuário:', user);
});
```

#### `src/services/api.ts`
CRUD de despesas e perfil do usuário

```typescript
import { 
  getExpenses, 
  createExpense, 
  updateExpense, 
  deleteExpense,
  getUserProfile,
  updateUserProfile,
  getDollarRate
} from './services/api';

// Operações com despesas
const expenses = await getExpenses(userId);
const expense = await createExpense({ user_id, description, amount, category, date });
await updateExpense(id, { description, amount });
await deleteExpense(id);

// Operações com perfil
const profile = await getUserProfile(userId);
await updateUserProfile(userId, { name, phone, avatar_url });

// Taxa de câmbio
const rate = await getDollarRate();
```

#### `src/hooks/useDatabase.ts`
Hooks customizados para simplificar o uso

```typescript
import { useAuthUser, useExpenses, useUserProfile } from '../hooks/useDatabase';

// No seu componente
export function MyComponent() {
  const { user, loading } = useAuthUser();
  const { expenses, loading: expLoading } = useExpenses(user?.id);
  const { profile, loading: profileLoading } = useUserProfile(user?.id);

  if (loading) return <div>Carregando...</div>;
  
  return (
    <div>
      <h1>Olá, {profile?.name || user?.email}</h1>
      {/* ... */}
    </div>
  );
}
```

### 4. **Componentes Atualizados**

#### `src/components/ProtectedRoute.tsx`
- ✅ Agora monitora sessão em tempo real com Supabase

#### `src/pages/Login.tsx`
- ✅ Atualizado para usar async/await com Supabase

#### `src/pages/Register.tsx`
- ✅ Atualizado para usar async/await com Supabase

## 🚀 Próximos Passos

### 1. Executar o SQL no Supabase
Consulte [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) para as instruções SQL

### 2. Testar a Integração
```bash
npm run dev
```

### 3. Integrar CRUD no Dashboard
Atualize `src/pages/Dashboard.tsx` e `src/AppDashboard.tsx` para usar os hooks:

```typescript
import { useAuthUser, useExpenses } from '../hooks/useDatabase';
import { createExpense, deleteExpense, updateExpense } from '../services/api';

export function Dashboard() {
  const { user } = useAuthUser();
  const { expenses, setExpenses } = useExpenses(user?.id);

  const handleAddExpense = async (data) => {
    const newExpense = await createExpense({
      user_id: user.id,
      ...data
    });
    setExpenses([newExpense, ...expenses]);
  };

  const handleDeleteExpense = async (id) => {
    await deleteExpense(id);
    setExpenses(expenses.filter(e => e.id !== id));
  };

  // ... resto do componente
}
```

### 4. Implementar Real-Time (Opcional)
```typescript
import { supabase } from '../services/supabase';

useEffect(() => {
  const subscription = supabase
    .from('expenses')
    .on('*', payload => {
      console.log('Mudança:', payload);
      // Atualizar estado
    })
    .subscribe();

  return () => subscription.unsubscribe();
}, []);
```

## 📋 Checklist de Configuração

- [ ] Credenciais do Supabase no `.env.local` ✅
- [ ] SQL executado no Supabase (consulte SUPABASE_SETUP.md)
- [ ] Testar Registro
- [ ] Testar Login
- [ ] Testar Logout
- [ ] Integrar CRUD de despesas
- [ ] Implementar real-time (opcional)

## 🐛 Troubleshooting

### Erro: "Supabase credentials are not configured"
- Verifique se `.env.local` existe na raiz do projeto
- Reinicie o servidor de desenvolvimento

### Erro: "CORS"
- Isso é normal em desenvolvimento
- Adicione sua URL local nas configurações do Supabase

### Erro: "Policy violation"
- Certifique-se de ter executado todas as políticas RLS no Supabase
- Verifique se a coluna `auth_user_id` foi adicionada na tabela `users`

## 📚 Referências

- [Documentação Supabase](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
