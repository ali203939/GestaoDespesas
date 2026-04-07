import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from '../App';

// Mock do window.confirm para o teste de remoção não travar
window.confirm = vi.fn(() => true);

describe('Gestor de Despesas - Testes de Fluxo Financeiro', () => {
  
  // Teste 1: Sanidade (Renderização)
  it('deve renderizar o cabeçalho e os campos iniciais', () => {
    render(<App />);
    expect(screen.getByText(/Gestor de Despesas/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/R\$ 0,00/i)).toBeInTheDocument();
  });

  // Teste 2: Lógica de Saldo
  it('deve calcular o saldo corretamente (Renda - Despesa)', () => {
    render(<App />);
    
    const inputRenda = screen.getByPlaceholderText(/R\$ 0,00/i);
    fireEvent.change(inputRenda, { target: { value: '2000' } });

    const inputDesc = screen.getByPlaceholderText(/O que você comprou\/gastou\?/i);
    const inputValor = screen.getByPlaceholderText(/Valor R\$/i);
    const botao = screen.getByText(/Adicionar Gasto/i);

    fireEvent.change(inputDesc, { target: { value: 'Supermercado' } });
    fireEvent.change(inputValor, { target: { value: '500' } });
    fireEvent.click(botao);

    expect(screen.getByText(/R\$ 1500.00/i)).toBeInTheDocument();
  });

  // Teste 3: Feedback Visual de Saldo Negativo
  it('deve exibir saldo negativo se as despesas superarem a renda', () => {
    render(<App />);
    
    const inputRenda = screen.getByPlaceholderText(/R\$ 0,00/i);
    fireEvent.change(inputRenda, { target: { value: '100' } });

    const inputDesc = screen.getByPlaceholderText(/O que você comprou\/gastou\?/i);
    const inputValor = screen.getByPlaceholderText(/Valor R\$/i);
    const botao = screen.getByText(/Adicionar Gasto/i);

    fireEvent.change(inputDesc, { target: { value: 'Conta de Luz' } });
    fireEvent.change(inputValor, { target: { value: '150' } });
    fireEvent.click(botao);

    expect(screen.getByText(/R\$ -50.00/i)).toBeInTheDocument();
  });

  // Teste 4: Remoção de Gasto
  it('deve remover um gasto da lista e atualizar o saldo', () => {
    render(<App />);
    
    // Adiciona um gasto
    const inputDesc = screen.getByPlaceholderText(/O que você comprou\/gastou\?/i);
    const inputValor = screen.getByPlaceholderText(/Valor R\$/i);
    const botaoAdd = screen.getByText(/Adicionar Gasto/i);

    fireEvent.change(inputDesc, { target: { value: 'Lanche' } });
    fireEvent.change(inputValor, { target: { value: '20' } });
    fireEvent.click(botaoAdd);

    expect(screen.getByText(/Lanche/i)).toBeInTheDocument();

    // Clica no botão de excluir (X)
    const botaoExcluir = screen.getByTitle(/Excluir/i);
    fireEvent.click(botaoExcluir);

    // Verifica se sumiu
    expect(screen.queryByText(/Lanche/i)).not.toBeInTheDocument();
  });
});