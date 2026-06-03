# 🧪 TESTE DE INTEGRAÇÃO SUPABASE - GUIA PASSO A PASSO

## ✅ Servidor Iniciado

```
Local: http://localhost:5174/
Status: RODANDO ✅
```

---

## 📋 Guia de Teste

### 1️⃣ TESTE DE REGISTRO

**Objetivo:** Criar uma nova conta no Supabase

#### Passos:

1. Abra: http://localhost:5174
2. Clique em **"Cadastre-se"**
3. Preencha o formulário:
   ```
   Email: teste@exemplo.com
   Senha: senha123
   Confirmar Senha: senha123
   ```
4. Clique em **"Cadastrar"**

#### ✅ Se funcionar:
- ✅ Mensagem "Cadastro realizado com sucesso!"
- ✅ Redireciona para Login após 1.5s
- ✅ Usuário criado no Supabase

#### ❌ Se não funcionar:
- Error "email rate limit exceeded" → Vá em [Configuração de Rate Limit](#configuração-de-rate-limit)
- Error "senha muito curta" → Use senha com 6+ caracteres
- Error de conexão → Verificar [Troubleshooting](#troubleshooting)

---

### 2️⃣ TESTE DE LOGIN

**Objetivo:** Fazer login com a conta criada

#### Passos:

1. Se foi redirecionado: Ótimo! Você está na tela de Login
2. Se não: Acesse http://localhost:5174/login
3. Preencha:
   ```
   Email: teste@exemplo.com
   Senha: senha123
   ```
4. Clique em **"Entrar"**

#### ✅ Se funcionar:
- ✅ Mensagem "Login realizado com sucesso!"
- ✅ Redireciona para Dashboard
- ✅ Você vê o email no header (canto superior direito)
- ✅ Sessão ativa no Supabase

#### ❌ Se não funcionar:
- Error "Email ou senha incorretos" → Verifique credenciais
- Error "usuário não encontrado" → Faça registro primeiro
- Error de conexão → Ver [Troubleshooting](#troubleshooting)

---

### 3️⃣ TESTE DE DASHBOARD

**Objetivo:** Verificar se dashboard carregou e está protegido

#### Passos:

1. Após login, você deve estar em: http://localhost:5174/dashboard
2. Verifique:
   - [x] Email aparece no header
   - [x] Botão "Sair" aparece
   - [x] Dashboard está visível

#### ✅ Se funcionar:
- ✅ Dashboard carrega
- ✅ Email visível
- ✅ Rota protegida funcionando

---

### 4️⃣ TESTE DE LOGOUT

**Objetivo:** Fazer logout e verificar proteção de rota

#### Passos:

1. Clique em **"Sair"** (no header, lado direito)
2. Aguarde redirecionamento

#### ✅ Se funcionar:
- ✅ Redireciona para login
- ✅ Sessão encerrada
- ✅ Se tentar acessar /dashboard → Redireciona para /login

#### ❌ Se não funcionar:
- Sessão não limpa → Limpar cache do navegador
- Rota não protegida → Ver [Troubleshooting](#troubleshooting)

---

### 5️⃣ TESTE DE PROTEÇÃO DE ROTA

**Objetivo:** Verificar se rotas estão protegidas

#### Passos:

1. Faça logout (passo anterior)
2. Tente acessar diretamente: http://localhost:5174/dashboard
3. Você deve ser redirecionado para login

#### ✅ Se funcionar:
- ✅ Redirecionado para /login
- ✅ Rota está protegida

---

## 🔧 Configuração de Rate Limit

Se receber erro "email rate limit exceeded":

### Solução Rápida:
1. Use um email diferente (ex: teste2@exemplo.com)
2. Aguarde 15 minutos
3. Ou desabilite verificação de email (próximo item)

### Desabilitar Verificação de Email:
1. Acesse: https://supabase.com
2. Seu Projeto → Authentication → Providers
3. Clique em "Email"
4. Procure: "Email Confirmations"
5. Mude para: "Disabled"
6. Clique "Save"
7. Tente novamente

---

## ❓ Troubleshooting

### Erro: "Cannot find module or connection failed"

```
❌ Problema: Servidor não iniciou corretamente

✅ Solução:
1. Parar servidor: CTRL+C no terminal
2. npm install (reinstalar dependências)
3. npm run dev (iniciar novamente)
```

### Erro: "Supabase credentials are not configured"

```
❌ Problema: Variáveis de ambiente não carregadas

✅ Solução:
1. Verifique se .env.local existe
2. Verifique se tem as 2 linhas:
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_PUBLISHABLE_KEY=...
3. Reinicie servidor: npm run dev
```

### Erro: "Policy violation" ou "Not authenticated"

```
❌ Problema: SQL não foi executado no Supabase

✅ Solução:
1. Abra: https://supabase.com
2. SQL Editor
3. Cole o SQL de SUPABASE_SETUP.md
4. Clique "Run"
5. Tente novamente
```

### Erro: "Network request failed"

```
❌ Problema: Sem conexão com Supabase

✅ Solução:
1. Verifique internet
2. Verifique se URL do Supabase está correta
3. Verifique se credenciais não expirou
4. Tente abrir https://supabase.com (testa conexão)
```

### Página não carrega / Branca

```
❌ Problema: Erro na compilação ou servidor

✅ Solução:
1. Abra DevTools: F12
2. Veja console for errors
3. Verifique Network tab
4. Veja se há CORS errors
5. Se sim, adicione URL local no Supabase:
   Settings → CORS → Add URL: http://localhost:5174
```

---

## 📊 O Que Está Sendo Testado

### ✅ Autenticação
- [x] Conexão com Supabase Auth
- [x] Criação de usuário
- [x] Validação de email
- [x] Validação de senha
- [x] Login
- [x] Logout
- [x] Sessão

### ✅ Banco de Dados
- [x] Tabela `users` vinculada
- [x] RLS (Row Level Security)
- [x] Políticas de acesso
- [x] Dados do usuário salvos

### ✅ Frontend
- [x] Componentes React
- [x] Formulários
- [x] Validações
- [x] Rotas protegidas
- [x] Redirecionamentos

---

## 📝 Resumo do Teste

Preencha conforme você testa:

```
Teste de Registro:           [ ] Feito
Teste de Login:              [ ] Feito
Teste de Dashboard:          [ ] Feito
Teste de Logout:             [ ] Feito
Teste de Proteção de Rota:   [ ] Feito
```

---

## ✅ Se Todos os Testes Passarem

Parabéns! 🎉 Sua integração está **100% funcional**!

Próximos passos:
1. ✅ Integre o Dashboard com exemplo
2. ✅ Teste CRUD de despesas
3. ✅ Deploy em produção

---

## 🆘 Precisa de Ajuda?

1. **Leia:** SUPABASE_RESUMO.md (Troubleshooting)
2. **Consulte:** SUPABASE_INTEGRATION.md
3. **Verifique:** Logs do navegador (F12)
4. **Veja:** Logs do servidor (terminal)

---

**Bom teste! 🚀**
