# 💰 Gestor de Despesas Consciente

[![CI - Integração Contínua](https://github.com/ali203939/GestaoDespesas/actions/workflows/ci.yml/badge.svg)](https://github.com/ali203939/GestaoDespesas/actions)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

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

## ✨ Novas Funcionalidades (Etapa 2)
- **Integração com API Pública:** Consumo em tempo real da cotação do Dólar (USD/BRL) via [AwesomeAPI](https://docs.awesomeapi.com.br/), permitindo uma visão macroeconómica integrada no dashboard.
- **Testes de Integração:** Validação automatizada do fluxo de dados entre a aplicação e a API externa.
- **Interface Glassmorphism:** Estilização moderna utilizando filtros de desfoque e transparências em CSS3.

## 🛠️ Tecnologias Utilizadas
- **Frontend:** [React 18](https://react.dev/) com [Vite](https://vitejs.dev/).
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/).
- **Testes:** [Vitest](https://vitest.dev/) e [React Testing Library](https://testing-library.com/).
- **Hospedagem:** [Vercel](https://vercel.com/).
- **Pipeline:** [GitHub Actions](https://github.com/features/actions) (Lint & Testes).

## 🧪 Qualidade e Manutenção
A aplicação mantém uma pipeline de CI (Integração Contínua) ativa:
1. **Linting:** Padronização de código com ESLint.
2. **Testes Unitários e de Integração:** Validação de cálculos de saldo, adição/remoção de despesas e resposta da API de moedas.
3. **Build:** Garantia de que o projeto está pronto para produção a cada commit.

## 📸 Preview
![Preview do Projeto](./Screenshot.png)

---

## 🏗️ Como Executar Localmente

### Pré-requisitos
- Node.js >= 20.3.1

### Instalação
```bash
# Clone o repositório
git clone [https://github.com/ali203939/GestaoDespesas](https://github.com/ali203939/GestaoDespesas)

# Aceda à pasta
cd GestaoDespesas

# Instale as dependências
npm install
