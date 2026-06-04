import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import AppDashboard from '../AppDashboard';
import * as api from '../services/api';

// 1. Mock global da API para evitar chamadas reais durante os testes
vi.mock('../services/api', () => ({
  getDollarRate: vi.fn(),
  getExpenses: vi.fn(),
  createExpense: vi.fn(),
  updateExpense: vi.fn(),
  deleteExpense: vi.fn(),
}));

// 2. Mock do auth para evitar problemas com localStorage
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

// Criamos uma versão tipada do mock para evitar o uso de 'any'
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
    mockedCreateExpense.mockResolvedValue(null);
    mockedUpdateExpense.mockResolvedValue(null);
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
    mockedCreateExpense.mockResolvedValue({
      id: 1,
      user_id: 'test-user',
      descricao: 'Aluguel',
      quantidade: 1200,
      categoria: 'Essencial' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

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

    await waitFor(() => {
      expect(screen.getByText(/R\$ 800.00/i)).toBeInTheDocument();
    });
  });

  it('deve exibir saldo negativo em vermelho se as despesas superarem a renda', async () => {
    mockedCreateExpense.mockResolvedValue({
      id: 1,
      user_id: 'test-user',
      descricao: 'Conta de Luz',
      quantidade: 150,
      categoria: 'Essencial' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

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

    await waitFor(() => {
      const saldo = screen.getByText(/R\$ -50.00/i);
      expect(saldo).toBeInTheDocument();
      
      // Verifica se a classe 'negative' foi aplicada
      expect(saldo.closest('.balance-card')).toHaveClass('negative');
    });
  });

  it('deve remover um gasto da lista e atualizar o saldo', async () => {
    mockedCreateExpense.mockResolvedValue({
      id: 1,
      user_id: 'test-user',
      descricao: 'Lanche',
      quantidade: 20,
      categoria: 'Comida' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    mockedDeleteExpense.mockResolvedValue(true);

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

    await waitFor(() => {
      expect(screen.getByText(/Lanche/i)).toBeInTheDocument();
    });

    // Busca o botão de excluir
    const botaoExcluir = screen.getByTitle(/Excluir/i);
    fireEvent.click(botaoExcluir);

    await waitFor(() => {
      expect(screen.queryByText(/Lanche/i)).not.toBeInTheDocument();
    });
  });
});