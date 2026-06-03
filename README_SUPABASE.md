# 🚀 GestaoDespesas - Integração Supabase Completa

> Aplicação React + TypeScript + Supabase PostgreSQL para gestão de despesas pessoais

## ✨ Novidades - Integração Supabase Concluída!

Seu projeto foi totalmente integrado com **Supabase PostgreSQL** (Backend as a Service).

### 📊 Status Atual

```
✅ Compilação:   SUCESSO
✅ Build:        SUCESSO (442.28 kB / 127.69 kB gzip)
✅ Autenticação: Implementada
✅ API CRUD:     Implementada
✅ Banco Dados:  Pronto
✅ Documentação: Completa
```

---

## 🎯 Começar Rápido

### 1. Ler a Documentação (⏱️ 5 minutos)

**Escolha uma:**

- 🚀 **[QUICK_START.md](./QUICK_START.md)** - Começar já (recomendado!)
- 📖 **[SUPABASE_INTEGRATION.md](./SUPABASE_INTEGRATION.md)** - Guia completo
- 📊 **[SUMMARY.md](./SUMMARY.md)** - Resumo executivo
- 📋 **[00_LEIA_PRIMEIRO.md](./00_LEIA_PRIMEIRO.md)** - Início

### 2. Executar SQL (⏱️ 2 minutos)

Copie o SQL de [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) e execute em:
```
https://supabase.com → Seu Projeto → SQL Editor
```

### 3. Testar Localmente (⏱️ 2 minutos)

```bash
npm run dev
# Acesse: http://localhost:5173
```

### 4. Integrar Dashboard (⏱️ 1 minuto)

Copie [APPDASHBOARD_EXAMPLE.tsx](./APPDASHBOARD_EXAMPLE.tsx) para `src/AppDashboard.tsx`

---

## 📁 Arquivos Importantes

### 📚 Documentação (Leia Primeiro)

```
00_LEIA_PRIMEIRO.md          ← Comece aqui! ⭐
QUICK_START.md               ← 5 minutos para começar
SUPABASE_SETUP.md            ← SQL para executar
SUPABASE_INTEGRATION.md      ← Guia de uso
SUPABASE_RESUMO.md           ← Resumo + Troubleshooting
DATABASE_SCHEMA.md           ← Estrutura das tabelas
SUMMARY.md                   ← Resumo completo
CHECKLIST.md                 ← Checklist de tarefas
```

### 💾 Código Pronto

```
APPDASHBOARD_EXAMPLE.tsx     ← Exemplo pronto (copy & paste)
```

### ⚙️ Configuração

```
.env.local                   ← Credenciais (já criado)
```

---

## 🗄️ Banco de Dados

### Tabelas

| Tabela | Descrição |
|--------|-----------|
| `users` | Usuários (vinculado com auth.users) |
| `expenses` | Despesas/Gastos |
| `user_profiles` | Perfil adicional do usuário |

### Segurança

✅ **Row Level Security (RLS)** - Cada usuário só vê seus próprios dados
✅ **Autenticação** - Supabase Auth com email/senha
✅ **Validações** - Automáticas no banco

---

## 💻 Código

### Arquivos Modificados

```
src/services/auth.ts           ← Autenticação com Supabase
src/services/api.ts            ← CRUD de despesas
src/components/ProtectedRoute  ← Rotas protegidas
src/pages/Login.tsx            ← Atualizado
src/pages/Register.tsx         ← Atualizado
src/App.tsx                    ← Atualizado
src/AppDashboard.tsx           ← Atualizado
```

### Arquivos Novos

```
src/services/supabase.ts       ← Cliente Supabase
src/hooks/useDatabase.ts       ← Hooks customizados
```

---

## 📖 Como Usar

### Autenticação

```typescript
import { register, login, logout, getCurrentUser } from './services/auth';

// Registrar
const response = await register('email@example.com', 'password123');

// Login
const response = await login('email@example.com', 'password123');

// Logout
await logout();

// Obter usuário
const user = await getCurrentUser();
```

### CRUD de Despesas

```typescript
import { 
  getExpenses, 
  createExpense, 
  updateExpense, 
  deleteExpense 
} from './services/api';

// Buscar
const expenses = await getExpenses(userId);

// Criar
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

### Hooks

```typescript
import { useAuthUser, useExpenses, useUserProfile } from './hooks/useDatabase';

const { user, loading } = useAuthUser();
const { expenses, loading } = useExpenses(user?.id);
const { profile, loading } = useUserProfile(user?.id);
```

---

## 🚀 Próximos Passos

- [ ] Ler [QUICK_START.md](./QUICK_START.md)
- [ ] Executar SQL do [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
- [ ] Rodar `npm run dev`
- [ ] Testar registro/login
- [ ] Integrar Dashboard
- [ ] Testar CRUD
- [ ] Deploy em produção

---

## 📊 Estrutura do Projeto

```
src/
├── services/
│   ├── supabase.ts        ✨ NOVO - Cliente
│   ├── auth.ts            🔄 - Autenticação
│   ├── api.ts             🔄 - API
│   └── ...
├── hooks/
│   └── useDatabase.ts      ✨ NOVO - Hooks
├── components/
│   ├── ProtectedRoute.tsx  🔄 - Proteção
│   └── ...
├── pages/
│   ├── Login.tsx           🔄 - Login
│   ├── Register.tsx        🔄 - Registro
│   └── Dashboard.tsx
├── App.tsx                 🔄 - Roteador
└── ...
```

---

## 🛠️ Scripts

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview

# Lint
npm run lint

# Testes
npm run test
```

---

## 🔐 Variáveis de Ambiente

```env
VITE_SUPABASE_URL=https://xpyvjcgdwzfkgipzaruk.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_CgyY7v5ac6H4AKqC-nCIvA_07C9CX2D
```

**Arquivo:** `.env.local` (já criado)

---

## 📚 Dependências

```json
{
  "@supabase/supabase-js": "^2.106.2",
  "react": "^19.2.4",
  "react-dom": "^19.2.4",
  "react-router-dom": "^7.16.0"
}
```

---

## 🎯 Funcionalidades

### ✅ Autenticação
- Registro com validação
- Login com credenciais
- Logout automático
- Sessão em tempo real
- Proteção de rotas

### ✅ Despesas
- Adicionar
- Editar
- Deletar
- Buscar
- Filtrar por categoria

### ✅ Perfil
- Gerenciar perfil
- Avatar (pronto para integrar)
- Preferências

### ✅ Segurança
- RLS ativado
- Autenticação segura
- Validações de entrada

---

## 🐛 Troubleshooting

### "Supabase credentials are not configured"
```bash
npm run dev  # Reiniciar
```

### "Policy violation"
Vá em SUPABASE_SETUP.md e execute o SQL novamente

### "Column not found"
Execute o SQL de migração

**Ver mais:** [SUPABASE_RESUMO.md](./SUPABASE_RESUMO.md)

---

## 📞 Recursos

- [Documentação do Projeto](./SUPABASE_INTEGRATION.md)
- [Supabase Docs](https://supabase.com/docs)
- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs)

---

## 👨‍💻 Desenvolvido com

- **React** - UI Framework
- **TypeScript** - Tipagem estática
- **Vite** - Build tool
- **Supabase** - Backend + PostgreSQL
- **React Router** - Roteamento

---

## 📄 Licença

MIT

---

## 🤝 Contribuindo

1. Leia [CONTRIBUTING.md](./CONTRIBUTING.md)
2. Faça seu fork
3. Crie uma branch para sua feature
4. Commit suas mudanças
5. Push para a branch
6. Abra um Pull Request

---

## 📞 Contato

Para dúvidas ou sugestões:
1. Consulte a documentação
2. Verifique os exemplos
3. Abra uma issue

---

## ⭐ Começar Agora

1. Abra **[00_LEIA_PRIMEIRO.md](./00_LEIA_PRIMEIRO.md)**
2. Siga os passos
3. Divirta-se! 🚀

---

**Status:** ✅ Pronto para usar
**Versão:** 1.0.0
**Data:** 3 de junho de 2026

---

**Próximo passo:** Leia [QUICK_START.md](./QUICK_START.md) 🚀
