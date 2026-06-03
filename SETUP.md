# 🚀 Guia Rápido de Setup - Gestor de Despesas

Este guia oferece um passo-a-passo rápido para configurar o projeto do zero.

## ⚡ Setup em 5 minutos

### 1. Clone o repositório
```bash
git clone https://github.com/ali203939/GestaoDespesas
cd GestaoDespesas
npm install
```

### 2. Crie uma conta Supabase e configure o banco
- Acesse [supabase.com](https://supabase.com/) e faça login
- Crie um novo projeto
- Vá para **SQL Editor** e crie uma **New Query**
- Copie todo o conteúdo do arquivo `schema.sql`
- Cole na query e execute (clique em **Run**)

### 3. Configure as variáveis de ambiente
Copie o arquivo `.env.example` para `.env.local`:
```bash
cp .env.example .env.local
```

Edite `.env.local` e adicione suas credenciais do Supabase:
```env
VITE_SUPABASE_URL=https://seu-projeto-hash.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon_aqui
```

Para obter essas credenciais:
1. No Supabase, vá para **Settings > API**
2. Copie `Project URL` e `anon public key`

### 4. Inicie o projeto
```bash
npm run dev
```

A aplicação estará em `http://localhost:5173/`

### 5. (Opcional) Execute os testes
```bash
npm test    # Testes de integração
npm run lint # Validar código
```

---

## 📊 O que está no banco de dados?

Após executar o `schema.sql`, você terá:

### Tabelas criadas:
- **users** - Dados de login (email, senha)
- **expenses** - Despesas de cada usuário
- **user_profiles** - Configurações do perfil
- **exchange_rates_log** - Histórico de cotações

### Segurança:
- Row Level Security (RLS) habilitado em todas as tabelas
- Políticas de acesso para garantir que cada usuário vê apenas seus dados
- Índices para melhor performance

---

## 🐛 Troubleshooting

### Erro: "Cannot find module '@supabase/supabase-js'"
```bash
npm install @supabase/supabase-js
```

### Erro: "CORS issue com API externa"
- Certifique-se de que `VITE_SUPABASE_URL` está correto
- Verifique se a chave anon key está no `.env.local`

### Erro: "Problema ao conectar ao banco de dados"
- Verifique se o `schema.sql` foi executado completamente
- Confirme que a query SQL não teve erros
- Verifique as credenciais no `.env.local`

### Testes falhando?
```bash
# Limpe cache e reinstale
rm -rf node_modules package-lock.json
npm install

# Execute os testes novamente
npm test
```

---

## 📚 Próximos passos

1. **Integrar com Supabase Auth:**
   - Use `supabase.auth.signUp()` para registro
   - Use `supabase.auth.signIn()` para login
   - Mude de localStorage para autenticação nativa

2. **Adicionar mais funcionalidades:**
   - Filtros de despesas por data
   - Gráficos de gastos
   - Exportar relatório em PDF

3. **Deploy:**
   - Push para GitHub
   - Conecte ao Vercel (deploy automático)

---

## ❓ Dúvidas?

Consulte o [README completo](./README.md) ou abra uma [Issue no GitHub](https://github.com/ali203939/GestaoDespesas/issues).
