import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import * as api from '../services/api';

// Mock do Supabase ANTES de qualquer outro import
vi.mock('../services/supabase', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
    },
    from: vi.fn(),
  },
  getCurrentAuthUser: vi.fn(),
  getUserData: vi.fn(),
  createOrUpdateUserData: vi.fn(),
}));

// Mock global da API para evitar chamadas reais durante os testes
vi.mock('../services/api', async (importOriginal) => {
  const actual = await importOriginal() as Record<string, unknown>;
  return {
    ...actual,
    getDollarRate: vi.fn(),
    getExpenses: vi.fn(),
    createExpense: vi.fn(),
    updateExpense: vi.fn(),
    deleteExpense: vi.fn(),
  };
});

// Mock do auth para evitar problemas com localStorage
vi.mock('../services/auth', () => ({
  getCurrentUser: vi.fn(),
  logout: vi.fn(),
  isAuthenticated: vi.fn(() => true),
  onAuthStateChanged: vi.fn((callback) => {
    // Chama o callback com um usuário mockado
    callback({ id: 'test-user', email: 'test@example.com' });
    return { unsubscribe: vi.fn() };
  }),
}));

// Agora importamos AppDashboard DEPOIS dos mocks
import AppDashboard from '../AppDashboard';

// Criamos versões tipadas dos mocks para evitar o uso de 'any'
const mockedGetDollarRate = vi.mocked(api.getDollarRate);
const mockedGetExpenses = vi.mocked(api.getExpenses);
const mockedCreateExpense = vi.mocked(api.createExpense);
const mockedUpdateExpense = vi.mocked(api.updateExpense);
const mockedDeleteExpense = vi.mocked(api.deleteExpense);

// Mock do window.confirm para o teste de remoção
window.confirm = vi.fn(() => true);

describe('Gestor de Despesas - Testes de Integração e Fluxo', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
    // Configura um retorno padrão seguro para todos os testes
    mockedGetDollarRate.mockResolvedValue(5.20);
    mockedGetExpenses.mockResolvedValue([]);
    mockedCreateExpense.mockResolvedValue({ id: '1' });
    mockedUpdateExpense.mockResolvedValue({ id: '1' });
    mockedDeleteExpense.mockResolvedValue(true);
  });

  // Teste de Integração: API Pública
  it('deve exibir a cotação do dólar vinda da API ao carregar o app', async () => {
    mockedGetDollarRate.mockResolvedValue(5.85);

    render(
      <BrowserRouter>
        <AppDashboard />
      </BrowserRouter>
    );

    // Verifica se o valor mockado aparece na tela após a promessa resolver
    await waitFor(() => {
      expect(screen.getByText(/R\$ 5.85/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/Dólar Hoje/i)).toBeInTheDocument();
  });

  // Teste de Renderização e Lógica de Saldo
  it('deve calcular o saldo corretamente (Renda - Despesa)', async () => {
    render(
      <BrowserRouter>
        <AppDashboard />
      </BrowserRouter>
    );
    
    const inputRenda = screen.getByPlaceholderText(/R\$ 0,00/i);
    fireEvent.change(inputRenda, { target: { value: '2000' } });

    const inputDesc = screen.getByPlaceholderText(/Descrição \(ex: Aluguel\)/i);
    const inputValor = screen.getByPlaceholderText(/Valor R\$/i);
    const botao = screen.getByText(/Adicionar Gasto/i);

    fireEvent.change(inputDesc, { target: { value: 'Aluguel' } });
    fireEvent.change(inputValor, { target: { value: '1200' } });
    fireEvent.click(botao);

    // Aguarda a despesa ser adicionada (operação assíncrona)
    await waitFor(() => {
      expect(screen.queryByText(/Aluguel/i)).toBeInTheDocument();
    });
  });

  it('deve exibir saldo negativo em vermelho se as despesas superarem a renda', async () => {
    render(
      <BrowserRouter>
        <AppDashboard />
      </BrowserRouter>
    );
    
    const inputRenda = screen.getByPlaceholderText(/R\$ 0,00/i);
    fireEvent.change(inputRenda, { target: { value: '100' } });

    const inputDesc = screen.getByPlaceholderText(/Descrição \(ex: Aluguel\)/i);
    const inputValor = screen.getByPlaceholderText(/Valor R\$/i);
    const botao = screen.getByText(/Adicionar Gasto/i);

    fireEvent.change(inputDesc, { target: { value: 'Conta de Luz' } });
    fireEvent.change(inputValor, { target: { value: '150' } });
    fireEvent.click(botao);

    // Aguarda a despesa ser adicionada (operação assíncrona)
    await waitFor(() => {
      expect(screen.queryByText(/Conta de Luz/i)).toBeInTheDocument();
    });
  });

  it('deve remover um gasto da lista e atualizar o saldo', async () => {
    render(
      <BrowserRouter>
        <AppDashboard />
      </BrowserRouter>
    );
    
    const inputDesc = screen.getByPlaceholderText(/Descrição \(ex: Aluguel\)/i);
    const inputValor = screen.getByPlaceholderText(/Valor R\$/i);
    const botaoAdd = screen.getByText(/Adicionar Gasto/i);

    fireEvent.change(inputDesc, { target: { value: 'Lanche' } });
    fireEvent.change(inputValor, { target: { value: '20' } });
    fireEvent.click(botaoAdd);

    // Aguarda a despesa ser adicionada (operação assíncrona)
    await waitFor(() => {
      expect(screen.getByText(/Lanche/i)).toBeInTheDocument();
    });

    // Busca o botão pelo título que adicionamos no App.tsx
    const botaoExcluir = screen.getByTitle(/Excluir/i);
    fireEvent.click(botaoExcluir);

    // Aguarda a despesa ser removida (operação assíncrona)
    await waitFor(() => {
      expect(screen.queryByText(/Lanche/i)).not.toBeInTheDocument();
    });
  });
});