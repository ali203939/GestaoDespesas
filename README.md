# 💰 Gestor de Despesas Consciente

[![CI - Integração Contínua](https://github.com/ali203939/GestaoDespesas/actions/workflows/ci.yml/badge.svg)](https://github.com/ali203939/GestaoDespesas/actions)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)

## 🎯 Sobre o Projeto
O **Gestor de Despesas** é uma aplicação web focada em resolver a desorganização financeira pessoal. Através de uma interface intuitiva e responsiva, o usuário pode gerenciar sua renda, registrar gastos por categorias e ter um feedback visual imediato sobre sua saúde financeira.

Este projeto foi desenvolvido seguindo rigorosos padrões de engenharia de software, incluindo **Testes Automatizados**, **CI/CD** e princípios de **UX/UI Design**.

## 🚀 Funcionalidades Principais (CRUD Completo)
- **Renda Dinâmica:** Defina sua receita e veja o saldo ser atualizado em tempo real.
- **Registro de Gastos:** Adicione despesas com descrição, valor e categorias (Essencial, Saúde, Transporte, Lazer, Outros).
- **Edição Inteligente:** Altere qualquer registro clicando no ícone de lápis (✎).
- **Exclusão Segura:** Remova gastos com confirmação de segurança (✕).
- **Categorização Visual:** Tags coloridas que facilitam a identificação rápida dos tipos de gastos.
- **Design Responsivo:** Experiência fluida tanto em Desktop quanto em dispositivos Móveis.

## 🛠️ Tecnologias Utilizadas
- **Core:** [React 18](https://react.dev/) com [Vite](https://vitejs.dev/).
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/) para maior segurança e tipagem de dados.
- **Testes:** [Vitest](https://vitest.dev/) e [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/).
- **Estilo:** CSS3 moderno com foco em **Acessibilidade de Contraste** e **Glassmorphism**.
- **Automação:** [GitHub Actions](https://github.com/features/actions) configurado para rodar Lint e Testes a cada Push (Node 24).

## 🧪 Qualidade de Software
O projeto conta com uma suíte de testes automatizados que cobrem os principais fluxos:
1. **Renderização:** Valida se a interface carrega os elementos essenciais.
2. **Cálculo de Saldo:** Garante que a matemática (Renda - Despesa) está correta.
3. **Fluxo de Adição/Exclusão:** Simula o comportamento real do usuário final.
4. **Casos Limite:** Teste de saldo negativo para feedback de alerta ao usuário.

## 📸 Preview
![Preview do Projeto](./Screenshot.png)

## Versão: 1.0.0

## Licença: MIT

## Desenvolvido por: Ali de brito

## Para rodar os testes localmente:
```bash
npm run test
```

## 🏗️ Como Executar
Clone o repositório:
```Bash
git clone [https://github.com/ali203939/GestaoDespesas]
```

## Instale as dependências
```Bash
npm install
```

## Inicie o servidor de desenvolvimento:
```Bash
npm run dev
```