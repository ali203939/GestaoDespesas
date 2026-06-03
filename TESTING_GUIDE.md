# Exemplos de Uso - Sistema de Autenticação

## 🎯 Testando o Sistema

### Cenário 1: Novo Usuário (Cadastro)

1. Acesse: http://localhost:5173
2. Será redirecionado para a tela de **Login**
3. Clique em **"Cadastre-se"**
4. Preencha:
   ```
   Email: seu.email@exemplo.com
   Senha: minhasenha123
   Confirmar Senha: minhasenha123
   ```
5. Clique em **"Cadastrar"**
6. Verá mensagem de sucesso
7. Será redirecionado para login automaticamente

### Cenário 2: Login com Conta Existente

1. Na tela de login, preencha:
   ```
   Email: seu.email@exemplo.com
   Senha: minhasenha123
   ```
2. Clique em **"Entrar"**
3. Será redirecionado para o **Dashboard**

### Cenário 3: Usar o Dashboard

1. No dashboard, verá:
   - Seu email no canto superior direito
   - Botão "Sair" para fazer logout
   - Campos para gerenciar despesas

2. Para adicionar despesa:
   - Digite a descrição (ex: "Aluguel")
   - Digite o valor
   - Selecione categoria
   - Clique "Adicionar Gasto"

3. Para editar:
   - Clique no ícone ✎ na despesa
   - Modifique os dados
   - Clique "Confirmar Edição"

4. Para deletar:
   - Clique no ícone ✕ na despesa
   - Confirme a exclusão

### Cenário 4: Testar Validações

**Teste 1: Email duplicado**
- Tente cadastrar com o mesmo email
- Verá: "Este email já está cadastrado"

**Teste 2: Senha curta**
- Tente cadastrar com senha < 6 caracteres
- Verá: "Senha deve ter no mínimo 6 caracteres"

**Teste 3: Email inválido**
- Digite um email sem @
- Verá: "Email inválido"

**Teste 4: Senhas não conferem**
- Cadastro com senhas diferentes
- Verá: "As senhas não correspondem"

**Teste 5: Login com dados errados**
- Digite email/senha inválidos
- Verá: "Email ou senha incorretos"

## 📱 Teste de Responsividade

### Abrir Developer Tools (F12)
```
1. Pressione F12
2. Clique no ícone de dispositivo mobile (ou Ctrl+Shift+M)
3. Teste diferentes tamanhos:
   - iPhone 12 (390x844)
   - Galaxy S21 (360x800)
   - iPad (1024x1366)
   - Desktop (1920x1080)
```

## 🔍 Dados no LocalStorage

Você pode inspecionar os dados armazenados:

```javascript
// No console do navegador (F12 > Console)

// Ver todos os usuários cadastrados
JSON.parse(localStorage.getItem('users_db'))

// Ver usuário logado
JSON.parse(localStorage.getItem('current_user'))

// Limpar dados de teste
localStorage.clear()
```

## ✅ Checklist de Funcionalidades

- [x] Sistema de Login funcional
- [x] Sistema de Cadastro funcional
- [x] Validação de email
- [x] Validação de senha (mínimo 6 caracteres)
- [x] Prevenção de duplicação de usuários
- [x] Rotas protegidas
- [x] Logout funcional
- [x] Responsivo em mobile (320px - 1920px)
- [x] Armazenamento em localStorage
- [x] Mensagens de erro/sucesso
- [x] Autenticação persistente
- [x] Redirecionamento automático

## 🎨 Testes Visuais

### Em Mobile (480px)
```
✅ Botão login/cadastro grande e fácil de clicar
✅ Inputs com font-size 16px (sem zoom iOS)
✅ Layout single-column
✅ Cards ajustados
✅ Texto legível
✅ Sem overflow horizontal
```

### Em Desktop (1920px)
```
✅ Layout em 2 colunas (formulário + lista)
✅ Cards distribuídos horizontalmente
✅ Espaçamento adequado
✅ Hover effects funcionando
```

## 🚀 Comando para Iniciar

```bash
npm run dev
```

Acesse: http://localhost:5173

---

**Pronto para usar!** 🎉
