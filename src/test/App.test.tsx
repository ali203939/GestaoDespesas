import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App';

describe('GastoConsciente - Testes de Fluxo Financeiro', () => {
  
  // Teste 1: Sanidade (Renderização)
  it('deve renderizar o cabeçalho e os campos iniciais', () => {
    render(<App />);
    expect(screen.getByText(/GastoConsciente/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/R\$ 0,00/i)).toBeInTheDocument();
  });

  // Teste 2: Lógica de Saldo (O mais importante agora!)
  it('deve calcular o saldo corretamente (Renda - Despesa)', () => {
    render(<App />);
    
    // 1. Definir a Renda
    const inputRenda = screen.getByPlaceholderText(/R\$ 0,00/i);
    fireEvent.change(inputRenda, { target: { value: '2000' } });

    // 2. Adicionar uma Despesa
    const inputDesc = screen.getByPlaceholderText(/O que você comprou\?/i);
    const inputValor = screen.getByPlaceholderText(/Valor R\$/i);
    const botao = screen.getByText(/Adicionar Gasto/i);

    fireEvent.change(inputDesc, { target: { value: 'Supermercado' } });
    fireEvent.change(inputValor, { target: { value: '500' } });
    fireEvent.click(botao);

    // 3. Verificar o Saldo (2000 - 500 = 1500)
    expect(screen.getByText(/R\$ 1500.00/i)).toBeInTheDocument();
  });

  // Teste 3: Feedback Visual de Saldo Negativo (UX)
  it('deve exibir saldo negativo se as despesas superarem a renda', () => {
    render(<App />);
    
    // Renda de 100
    const inputRenda = screen.getByPlaceholderText(/R\$ 0,00/i);
    fireEvent.change(inputRenda, { target: { value: '100' } });

    // Gasto de 150
    const inputDesc = screen.getByPlaceholderText(/O que você comprou\?/i);
    const inputValor = screen.getByPlaceholderText(/Valor R\$/i);
    const botao = screen.getByText(/Adicionar Gasto/i);

    fireEvent.change(inputDesc, { target: { value: 'Conta de Luz' } });
    fireEvent.change(inputValor, { target: { value: '150' } });
    fireEvent.click(botao);

    // Saldo esperado: -50.00
    expect(screen.getByText(/R\$ -50.00/i)).toBeInTheDocument();
  });
});