# 💰 Gestor de Despesas Consciente

[![CI - Integração Contínua](https://github.com/ali203939/GestaoDespesas/actions/workflows/ci.yml/badge.svg)](https://github.com/ali203939/GestaoDespesas/actions)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

## 🚀 Link do Projeto Online
**Aceda à aplicação aqui:** [Gestor de Despesas Consciente — Deploy Vercel](https://gestao-despesas-of003rkik-ali203939s-projects.vercel.app/)

---

## 🎯 Sobre o Projeto
O **Gestor de Despesas Consciente** é uma ferramenta de gestão financeira pessoal que permite aos utilizadores controlar a sua saúde financeira de forma intuitiva. A aplicação combina funcionalidades de registo de gastos (CRUD) com dados externos em tempo real para auxiliar na tomada de decisões.

Este projeto foi desenvolvido como parte da **Entrega Intermediária do BootCamp**, focando-se em:
- Gestão de demandas via **GitHub Issues**.
- Consumo de **APIs RESTful**.
- Qualidade de código com **Testes de Integração**.
- **CI/CD** e Deploy contínuo.
- Integração com banco de dados PostgreSQL via Supabase.

## ✨ Novas Funcionalidades (Etapa 2 & 3)
- **Autenticação Robusta:** Sistema de login/cadastro com email e senha
- **Banco de Dados PostgreSQL:** Dados persistentes com Supabase
- **Integração com API Pública:** Consumo em tempo real da cotação do Dólar (USD/BRL) via [AwesomeAPI](https://docs.awesomeapi.com.br/), permitindo uma visão macroeconómica integrada no dashboard.
- **Testes de Integração:** Validação automatizada do fluxo de dados entre a aplicação e a API externa.
- **Interface Glassmorphism:** Estilização moderna utilizando filtros de desfoque e transparências em CSS3.
- **Design 100% Responsivo:** Otimizado para desktop, tablet e mobile (320px a 1920px)

## 🛠️ Tecnologias Utilizadas
- **Frontend:** [React 19](https://react.dev/) com [TypeScript](https://www.typescriptlang.org/) e [Vite](https://vitejs.dev/).
- **Roteamento:** [React Router DOM v6](https://reactrouter.com/)
- **Testes:** [Vitest](https://vitest.dev/) e [React Testing Library](https://testing-library.com/).
- **Database:** [PostgreSQL](https://www.postgresql.org/) via [Supabase](https://supabase.com/)
- **Hospedagem Frontend:** [Vercel](https://vercel.com/).
- **CI/CD:** [GitHub Actions](https://github.com/features/actions) (Lint, Testes & Build).

## 🧪 Qualidade e Manutenção
A aplicação mantém uma pipeline de CI (Integração Contínua) ativa:
1. **Linting:** Padronização de código com ESLint.
2. **Testes Unitários e de Integração:** Validação de cálculos de saldo, adição/remoção de despesas e resposta da API de moedas.
3. **Build:** Garantia de que o projeto está pronto para produção a cada commit.
4. **Deploy Automático:** Vercel faz deploy automático a cada push em `main`.

## 📸 Preview
![Preview do Projeto](./Screenshot.png)

---

## 🏗️ Como Executar Localmente

### Pré-requisitos
- Node.js >= 20.3.1
- npm ou yarn
- Conta no [Supabase](https://supabase.com/) (para banco de dados PostgreSQL)

### Instalação Passo a Passo

#### 1️⃣ Clone o Repositório
```bash
# Clone o repositório
git clone https://github.com/ali203939/GestaoDespesas

# Aceda à pasta
cd GestaoDespesas

# Instale as dependências
npm install
```

#### 2️⃣ Configure o Banco de Dados (Supabase)

1. **Crie uma conta no Supabase:**
   - Acesse [supabase.com](https://supabase.com/)
   - Crie uma nova organização e projeto
   - Escolha a região mais próxima de você

2. **Execute o script SQL:**
   - Na dashboard do Supabase, vá para **SQL Editor**
   - Clique em **New Query**
   - Copie e cole o conteúdo do arquivo `schema.sql` do projeto
   - Execute o script clicando em **Run**

3. **Obtenha as credenciais de conexão:**
   - Na aba **Settings > Database**, copie:
     - `Project URL` (ex: `https://seu-projeto.supabase.co`)
     - `API Key` (Anon Public)
     - `Connection String` (se necessário conectar via aplicação)

#### 3️⃣ Configure as Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon_aqui

# API Externa (AwesomeAPI para cotação de dólar)
VITE_API_DOLLAR_RATE=https://api.awesomeapi.com.br/json/last/USD-BRL
```

**⚠️ IMPORTANTE:** Nunca commita o `.env.local` no GitHub! Adicione à `.gitignore`.

#### 4️⃣ Execute o Projeto

```bash
# Inicie o servidor de desenvolvimento
npm run dev

# A aplicação estará disponível em http://localhost:5173/
```

#### 5️⃣ Execute os Testes

```bash
# Rode os testes de integração
npm test

# Execute o linter para validar código
npm run lint

# Build para produção
npm run build
```

### 📊 Estrutura do Banco de Dados

O projeto utiliza 4 tabelas principais no PostgreSQL (via Supabase):

| Tabela | Descrição |
|--------|-----------|
| **users** | Armazena dados de autenticação dos utilizadores |
| **expenses** | Registra todas as despesas dos utilizadores |
| **user_profiles** | Perfil e configurações de cada utilizador |
| **exchange_rates_log** | Histórico de cotações de moedas |

#### Diagrama Relacional:
```
┌─────────────────────────────────┐
│    users                        │
│ (id, email, password)           │
└────────┬────────────────────────┘
         │
         │ user_id (FK)
         │
┌────────▼──────────────────────────────────────┐
│        expenses                                │
│ (id, user_id, descricao, quantidade, categoria)│
└────────────────────────────────────────────────┘
```

#### Schema SQL Disponível:
O arquivo `schema.sql` contém:
- ✅ Definição completa das tabelas
- ✅ Índices para performance
- ✅ Constraints e validações
- ✅ Row Level Security (RLS) para proteção de dados
- ✅ Views úteis para analytics
- ✅ Dados de exemplo (comentados)

### 🔐 Segurança - Row Level Security (RLS)

O banco de dados implementa **Row Level Security** para garantir que cada utilizador veja apenas os seus próprios dados:

- ✅ Utilizadores só podem ver suas próprias despesas
- ✅ Utilizadores só podem editar/deletar suas próprias despesas
- ✅ Autenticação integrada com Supabase Auth
- ✅ Proteção contra SQL injection e acesso não autorizado

---

## 🔧 Scripts Disponíveis

```bash
npm run dev      # Inicia servidor de desenvolvimento
npm test         # Executa os testes
npm run lint     # Valida o código
npm run build    # Faz build de produção
```

---

## 📱 Funcionalidades Principais

### Autenticação
- ✅ Cadastro com email e senha (validação forte)
- ✅ Login com persistência de sessão
- ✅ Logout com limpeza de dados
- ✅ Proteção de rotas (apenas usuários autenticados)

### Gestão de Despesas (CRUD)
- ✅ Adicionar despesas com descrição, valor e categoria
- ✅ Listar todas as despesas do utilizador
- ✅ Editar despesas existentes
- ✅ Deletar despesas com confirmação
- ✅ Categorização de gastos (Essencial, Comida, Saúde, Transporte, Outros)

### Dashboard
- ✅ Visualizar saldo total (Renda - Despesas)
- ✅ Categorização de gastos por tipo
- ✅ Cotação em tempo real USD/BRL via [AwesomeAPI](https://docs.awesomeapi.com.br/)
- ✅ Indicador visual de saldo positivo/negativo
- ✅ Design responsivo para mobile

---

## 🎨 Design Responsivo

A aplicação foi otimizada para todos os dispositivos:

| Breakpoint | Resolução | Otimizações |
|-----------|-----------|------------|
| **Desktop** | 1920px+ | Layout multi-coluna, tabelas completas |
| **Tablet** | 768px - 1024px | Grid adaptativo, touch-friendly |
| **Mobile** | 320px - 768px | Layout single-column, botões maiores |

**Tema:** Dark mode profissional com cores navy (#0f172a) e azul (#3b82f6)

---

## 🌐 Deploy em Produção

### Opção 1: Vercel (Recomendado)
```bash
# Faça push para GitHub
git push origin main

# Vercel faz deploy automático
# A cada push, Vercel faz deploy automaticamente
```

### Opção 2: Netlify
```bash
npm run build
# Arraste a pasta dist para Netlify
```

### Opção 3: Docker
```bash
docker build -t gestao-despesas .
docker run -p 3000:3000 gestao-despesas
```

---

## 📂 Estrutura do Projeto

```
GestaoDespesas/
├── src/
│   ├── App.tsx              # Router principal
│   ├── AppDashboard.tsx     # Dashboard com CRUD de despesas
│   ├── components/
│   │   └── ProtectedRoute.tsx
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Dashboard.tsx
│   │   └── Auth.css
│   ├── services/
│   │   ├── api.ts           # Integração com AwesomeAPI
│   │   └── auth.ts          # Autenticação (localStorage/Supabase)
│   ├── test/
│   │   └── App.test.tsx     # Testes de integração
│   ├── App.css
│   ├── index.css
│   └── main.tsx
├── schema.sql               # Script de banco de dados PostgreSQL
├── vite.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 🚀 Próximas Melhorias Planejadas

- [ ] Integração com Supabase Auth (autenticação nativa)
- [ ] Sincronização em tempo real com banco de dados
- [ ] Gráficos e analytics de gastos
- [ ] Exportar relatórios em PDF
- [ ] Notificações de limites de orçamento
- [ ] Modo offline com sincronização
- [ ] Suporte a múltiplas moedas

---

## 📧 Suporte & Contribuições

Para reportar bugs ou sugerir melhorias, abra uma [Issue no GitHub](https://github.com/ali203939/GestaoDespesas/issues).

Contribuições são bem-vindas! Sinta-se à vontade para fazer um Fork e enviar um Pull Request.

---

## 📄 Licença

Este projeto está licenciado sob a [MIT License](./LICENSE).

---

**Desenvolvido com ❤️ para uma gestão financeira consciente.**
