// Exemplo de como integrar Supabase ao AppDashboard
// Substituir o arquivo atual src/AppDashboard.tsx com este código

import { useState, useEffect } from 'react';
import './src/App.css';
import { getDollarRate, createExpense, updateExpense, deleteExpense } from './src/services/api';
import { logout } from './src/services/auth';
import { useNavigate } from 'react-router-dom';
import { useAuthUser, useUserProfile, useExpenses } from './src/hooks/useDatabase';
import type { Expense } from './src/services/api';

interface ExpenseForm {
  descricao: string;
  quantidade: string;
  categoria: 'Essencial' | 'Comida' | 'Saúde' | 'Transporte' | 'Outros';
}

function AppDashboard() {
  const navigate = useNavigate();
  const { user, loading: userLoading } = useAuthUser();
  useUserProfile();
  const { expenses, loading: expLoading, error: expError, setExpenses } = useExpenses();

  const [renda, setRenda] = useState<number>(0);
  const [cotacao, setCotacao] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState<ExpenseForm>({
    descricao: '',
    quantidade: '',
    categoria: 'Essencial'
  });

  // Carregar cotação do dólar
  useEffect(() => {
    const carregarCotacao = async () => {
      try {
        const valor = await getDollarRate();
        setCotacao(valor);
      } catch (err) {
        console.error("Não foi possível carregar a cotação:", err);
      }
    };
    carregarCotacao();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleSaveExpense = async () => {
    if (!user?.id) return;

    const quantidade = parseFloat(form.quantidade);
    if (!form.descricao || isNaN(quantidade) || quantidade <= 0) {
      alert('Preencha todos os campos corretamente');
      return;
    }

    try {
      if (editingId) {
        // Editar despesa existente
        const updated = await updateExpense(editingId, {
          descricao: form.descricao,
          quantidade: quantidade,
          categoria: form.categoria,
        });
        if (updated) {
          setExpenses(expenses.map((e) => e.id === editingId ? updated : e));
          resetForm();
        }
      } else {
        // Criar nova despesa
        const newExpense = await createExpense({
          descricao: form.descricao,
          quantidade: quantidade,
          categoria: form.categoria,
        });
        if (newExpense) {
          setExpenses([newExpense, ...expenses]);
          resetForm();
        }
      }
    } catch (err) {
      console.error('Erro ao salvar despesa:', err);
      alert('Erro ao salvar despesa');
    }
  };

  const handleEditExpense = (expense: Expense): void => {
    if (expense.id) {
      setEditingId(expense.id);
    }
    setForm({
      descricao: expense.descricao,
      quantidade: expense.quantidade.toString(),
      categoria: expense.categoria,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteExpense = async (id: number | undefined): Promise<void> => {
    if (!id || !window.confirm("Deseja realmente excluir este gasto?")) return;

    try {
      const success = await deleteExpense(id);
      if (success) {
        setExpenses(expenses.filter(e => e.id !== id));
      }
    } catch (err) {
      console.error('Erro ao deletar despesa:', err);
      alert('Erro ao deletar despesa');
    }
  };

  const resetForm = (): void => {
    setForm({ descricao: '', quantidade: '', categoria: 'Essencial' });
    setEditingId(null);
  };

  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.quantidade, 0);
  const balance = renda - totalExpenses;

  if (userLoading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="app-wrapper">
      <header className="header">
        <div className="header-content">
          <h1>💰 Gestor de Despesas Consciente</h1>
          <div className="header-right">
            <span className="user-info">{user?.email}</span>
            <button onClick={handleLogout} className="logout-btn">Sair</button>
          </div>
        </div>
        <p>Sua saúde financeira em um só lugar.</p>
      </header>

      {/* DASHBOARD COM CARDS */}
      <section className="dashboard">
        <div className="balance-card incoming">
          <span>Renda Total (R$)</span>
          <input
            type="number"
            placeholder="R$ 0,00"
            value={renda}
            onChange={(e) => setRenda(Number(e.target.value) || 0)}
          />
        </div>

        <div className={`balance-card status ${balance < 0 ? 'negative' : 'positive'}`}>
          <span>Saldo Restante</span>
          <h2>R$ {balance.toFixed(2)}</h2>
        </div>

        {cotacao && (
          <div className="balance-card quote">
            <span>Dólar Hoje (USD)</span>
            <h2>R$ {cotacao.toFixed(2)}</h2>
          </div>
        )}
      </section>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="main-content">

        {/* FORMULÁRIO */}
        <section className="form-container">
          <h3>{editingId ? '📝 Editar Gasto' : '✨ Nova Transação'}</h3>
          <div className="input-group">
            <input
              placeholder="Descrição (ex: Aluguel)"
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
            />
            <input
              type="number"
              placeholder="Valor R$"
              value={form.quantidade}
              onChange={(e) => setForm({ ...form, quantidade: e.target.value })}
            />
            <select
              value={form.categoria}
              onChange={(e) => setForm({ ...form, categoria: e.target.value as ExpenseForm['categoria'] })}
            >
              <option value="Essencial">🟢 Essencial</option>
              <option value="Saúde">🏥 Saúde</option>
              <option value="Transporte">🚗 Transporte</option>
              <option value="Comida">🍕 Comida</option>
              <option value="Outros">⚪ Outros</option>
            </select>

            <button
              className={`btn-add ${editingId ? 'btn-edit-mode' : ''}`}
              onClick={handleSaveExpense}
            >
              {editingId ? 'Confirmar Edição' : 'Adicionar Gasto'}
            </button>

            {editingId && (
              <button className="btn-cancel" onClick={resetForm}>
                Cancelar Edição
              </button>
            )}
          </div>
        </section>

        {/* LISTAGEM */}
        <section className="list-container">
          <h3>Histórico de Gastos ({expenses.length})</h3>
          {expError && <p style={{ color: 'red' }}>{expError}</p>}
          {expLoading && <p>Carregando despesas...</p>}

          <div className="scroll-area">
            {expenses.length === 0 ? (
              <p className="empty-msg">Nenhum gasto registrado ainda.</p>
            ) : (
              expenses.map((exp) => (
                <div key={exp.id} className="expense-card">
                  <div className="exp-info">
                    <strong>{exp.descricao}</strong>
                    <span className={`tag ${exp.categoria.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`}>
                      {exp.categoria}
                    </span>
                  </div>

                  <div className="exp-actions-group">
                    <span className="exp-value">- R$ {exp.quantidade.toFixed(2)}</span>
                    <div className="action-buttons">
                      <button className="btn-icon edit" onClick={() => handleEditExpense(exp)} title='Editar'>✎</button>
                      <button className="btn-icon delete" onClick={() => handleDeleteExpense(exp.id)} title='Excluir'>✕</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

      </main>
    </div>
  );
}

export default AppDashboard;