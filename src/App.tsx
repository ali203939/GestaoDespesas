import { useState } from 'react';
import './App.css';

interface Expense {
  id: number;
  descricao: string;
  quantidade: number;
  categoria: 'Essencial' | 'Comida' | 'Saúde' | 'Transporte' | 'Outros';
}

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [renda, setRenda] = useState<number>(0);
  const [descricao, setDescricao] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [categoria, setCategoria] = useState<Expense['categoria']>('Essencial');
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const salvarDespesa = () => {
    const valorNum = parseFloat(quantidade);
    if (!descricao || isNaN(valorNum) || valorNum <= 0) return;

    if (editandoId !== null) {
      // Lógica de Editar
      setExpenses(expenses.map(exp => 
        exp.id === editandoId 
        ? { ...exp, descricao, quantidade: valorNum, categoria } 
        : exp
      ));
      setEditandoId(null);
    } else {
      // Lógica de Adicionar
      const novaDespesa: Expense = {
        id: Date.now(),
        descricao,
        quantidade: valorNum,
        categoria
      };
      setExpenses([novaDespesa, ...expenses]);
    }

    setDescricao('');
    setQuantidade('');
  };

  const prepararEdicao = (exp: Expense) => {
    setEditandoId(exp.id);
    setDescricao(exp.descricao);
    setQuantidade(exp.quantidade.toString());
    setCategoria(exp.categoria);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Sobe para o formulário
  };

  const removerDespesa = (id: number) => {
    if (window.confirm("Deseja realmente excluir este gasto?")) {
      setExpenses(expenses.filter(exp => exp.id !== id));
    }
  };

  const totalDespesas = expenses.reduce((acc, curr) => acc + curr.quantidade, 0);
  const saldoFinal = renda - totalDespesas;

  return (
    <div className="app-wrapper">
      <div className="container">
        <header className="header">
          <h1>💰 Gestor de Despesas Consciente</h1>
          <p>Sua saúde financeira em um só lugar.</p>
        </header>

        <div className="dashboard">
          <div className="balance-card incoming">
            <span>Renda Total</span>
            <input 
              type="number" 
              placeholder="R$ 0,00"
              onChange={(e) => setRenda(Number(e.target.value) || 0)}
            />
          </div>
          <div className={`balance-card status ${saldoFinal < 0 ? 'negative' : 'positive'}`}>
            <span>Saldo Restante</span>
            <h2>R$ {saldoFinal.toFixed(2)}</h2>
          </div>
        </div>

        <main className="main-content">
          <section className="form-container">
            <h3>{editandoId !== null ? '📝 Editar Gasto' : '✨ Nova Transação'}</h3>
            <div className="input-group">
              <input 
                placeholder="O que você comprou/gastou?" 
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
              <input 
                type="number" 
                placeholder="Valor R$" 
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
              />
                <select 
                  value={categoria} 
                  onChange={(e) => setCategoria(e.target.value as Expense['categoria'])} >
                <option value="Essencial">🟢 Essencial</option>
                <option value="Saúde">🏥 Saúde</option>
                <option value="Transporte">🚗 Transporte</option>
                <option value="Comida">🍕 Comida</option>
                <option value="Outros">⚪ Outros</option>
              </select>
              <button className={`btn-add ${editandoId !== null ? 'btn-edit-mode' : ''}`} onClick={salvarDespesa}>
                {editandoId !== null ? 'Atualizar Gasto' : 'Adicionar Gasto'}
              </button>
              {editandoId !== null && (
                <button className="btn-cancel" onClick={() => {setEditandoId(null); setDescricao(''); setQuantidade('');}}>
                  Cancelar
                </button>
              )}
            </div>
          </section>

          <section className="list-container">
            <h3>Histórico de Gastos ({expenses.length})</h3>
            <div className="scroll-area">
              {expenses.length === 0 && <p className="empty-msg">Nenhum gasto registrado ainda.</p>}
              {expenses.map(exp => (
                <div key={exp.id} className="expense-card">
                  <div className="exp-info">
                    <strong>{exp.descricao}</strong>
                    <span className={`tag ${exp.categoria.toLowerCase()}`}>{exp.categoria}</span>
                  </div>
                  <div className="exp-actions-group">
                    <span className="exp-value">- R$ {exp.quantidade.toFixed(2)}</span>
                    <div className="action-buttons">
                      <button className="btn-icon edit" onClick={() => prepararEdicao(exp)} title="Editar">✎</button>
                      <button className="btn-icon delete" onClick={() => removerDespesa(exp.id)} title="Excluir">✕</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;