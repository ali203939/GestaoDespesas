# Sistema de Autenticação - Gestão de Despesas

## 📋 Visão Geral

Implementei um sistema completo de **Login e Cadastro** (Sign Up) responsivo para dispositivos móveis na sua aplicação de Gestão de Despesas.

## ✨ Funcionalidades

### 🔐 Autenticação
- **Cadastro (Sign Up)**: Criação de nova conta com email e senha
- **Login**: Acesso à aplicação com email e senha
- **Persistência**: Dados armazenados no `localStorage`
- **Proteção**: Rotas protegidas que redirecionam usuários não autenticados para login
- **Logout**: Opção de sair da conta

### 📱 Responsividade
- **Desktop**: Layout completo com 2 colunas (formulário + lista)
- **Tablet (768px)**: Ajustes de espaçamento e tamanho de fontes
- **Mobile (480px)**: Layout single-column, inputs maiores para melhor usabilidade
- **Muito pequeno (320px)**: Otimizado para telas bem pequenas

### ✅ Validações
- Email obrigatório e em formato válido
- Senha mínima de 6 caracteres
- Confirmação de senha no cadastro
- Prevenção de cadastro duplicado
- Mensagens de erro/sucesso claras

## 📁 Estrutura de Arquivos Criados

```
src/
├── pages/
│   ├── Login.tsx          # Página de login
│   ├── Register.tsx       # Página de cadastro
│   ├── Dashboard.tsx      # Dashboard principal
│   └── Auth.css           # Estilos de autenticação
├── services/
│   └── auth.ts            # Lógica de autenticação
├── components/
│   └── ProtectedRoute.tsx # Componente de rota protegida
├── AppDashboard.tsx       # Dashboard com funcionalidades de despesas
└── main.tsx               # Configuração de rotas (atualizado)
```

## 🚀 Como Usar

### Fluxo de Usuário

1. **Primeira Vez**:
   - Acesse `http://localhost:5173`
   - Será redirecionado para `/login`
   - Clique em "Cadastre-se"
   - Preencha email e senha (mínimo 6 caracteres)
   - Confirme a senha
   - Clique em "Cadastrar"
   - Será redirecionado para login após sucesso

2. **Login**:
   - Preencha email e senha
   - Clique em "Entrar"
   - Será redirecionado para `/dashboard`

3. **Dashboard**:
   - Veja seu email no canto superior direito
   - Use o botão "Sair" para fazer logout
   - Gerencie suas despesas normalmente

### Dados de Teste

Para testar, use qualquer email/senha válidos:
- Email: `teste@exemplo.com`
- Senha: `123456` (mínimo 6 caracteres)

## 🎨 Design Responsivo

### Breakpoints
- `320px` - Dispositivos muito pequenos
- `480px` - Celulares
- `768px` - Tablets
- `1000px+` - Desktop

### Características Móvel
- Font-size 16px em inputs (evita zoom automático iOS)
- Padding reduzido mas suficiente
- Botões maior para toque
- Cores de gradiente agradáveis
- Layout flexível que se adapta

## 🔧 Tecnologias

- **React 19** com TypeScript
- **React Router DOM** para navegação
- **CSS responsivo** com media queries
- **LocalStorage** para persistência de dados (simula backend)

## 📝 Notas Importantes

### Segurança
Este é um sistema **educacional/demo**. Não use em produção porque:
- As senhas são armazenadas em `localStorage` (não criptografadas)
- Não há validação de servidor
- Para produção, use um backend com autenticação real (JWT, OAuth, etc.)

### Melhorias Futuras
- Conectar com API backend real
- Criptografia de senhas
- Recuperação de senha por email
- Autenticação social (Google, Facebook)
- Dados de despesas por usuário

## 🛠️ Desenvolvimento

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Teste
npm test
```

## 📱 Testando em Dispositivos

### Navegador (Dev Tools)
1. Abra as DevTools (F12)
2. Clique no ícone de dispositivo móvel
3. Selecione diferentes dispositivos para ver responsividade

### Celular Real
1. No terminal, veja o endereço Network
2. Acesse de outro dispositivo na mesma rede
3. Exemplo: `http://192.168.x.x:5173`

## 🎯 Próximos Passos

1. Integrar com API backend real
2. Implementar recuperação de senha
3. Adicionar autenticação multi-fator
4. Sincronizar despesas com servidor
5. Adicionar temas (claro/escuro)

---

**Status**: ✅ Sistema de autenticação e cadastro 100% funcional e responsivo!
