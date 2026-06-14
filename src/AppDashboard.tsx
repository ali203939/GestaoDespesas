import { useState, useEffect, useCallback } from 'react';
import './App.css';
import { 
  getDollarRate,
  getBitcoinRate,
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  updateUserProfile
} from './services/api';
import { logout } from './services/auth';
import { useNavigate } from 'react-router-dom';
import { useAuthUser, useUserProfile } from './hooks/useDatabase';

interface Expense {
  id?: string;
  descricao: string;
  quantidade: number;
  categoria: 'Essencial' | 'Comida' | 'Saúde' | 'Transporte' | 'Outros';
}

function AppDashboard() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [renda, setRenda] = useState<number>(0);
  const [cotacao, setCotacao] = useState<number | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [btcPrice, setBtcPrice] = useState<number | null>(null);

  const [descricao, setDescricao] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [categoria, setCategoria] = useState<Expense['categoria']>('Essencial');
  const [editandoId, setEditandoId] = useState<string | null>(null);

  const { user } = useAuthUser();
  const { profile } = useUserProfile(user?.id);
  const navigate = useNavigate();

  // Carregar renda do banco quando o perfil for carregado
  useEffect(() => {
    if (profile?.renda_mensal !== undefined && profile.renda_mensal !== null) {
      setRenda(Number(profile.renda_mensal));
    }
  }, [profile]);

  // Carregar despesas do banco quando o usuário faz login
  useEffect(() => {
    const carregarDespesas = async () => {
      if (!user?.id) {
        setCarregando(false);
        return;
      }

      try {
        setCarregando(true);
        const dados = await getExpenses(user.id);
        
        const despesasFormatadas = dados?.map((item: { id?: string | number; descricao: string; quantidade: number; categoria: string }) => ({
          id: item.id?.toString(),
          descricao: item.descricao,
          quantidade: item.quantidade,
          categoria: item.categoria as Expense['categoria']
        })) || [];
        
        setExpenses(despesasFormatadas);
      } catch (err) {
        console.error('Erro ao carregar despesas:', err);
      } finally {
        setCarregando(false);
      }
    };

    carregarDespesas();
  }, [user?.id]);

  useEffect(() => {
    const carregarCotacao = async () => {
      try {
        const valor = await getDollarRate();
        setCotacao(valor);
      } catch (err) { 
        console.error("Não foi possível carregar a cotação do Dólar:", err);
      }
    };
    
    const carregarBitcoin = async () => {
      try {
        const valorBtc = await getBitcoinRate();
        if (valorBtc > 0) setBtcPrice(valorBtc);
      } catch (err) {
        console.error("Não foi possível carregar a cotação do Bitcoin:", err);
      }
    };

    carregarCotacao();
    carregarBitcoin();
    
    const btcInterval = setInterval(carregarBitcoin, 30000);
    return () => clearInterval(btcInterval);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Salvar renda no banco com debounce (espera 800ms após parar de digitar)
  const salvarRenda = useCallback(async (novaRenda: number) => {
    if (!user?.id) return;
    try {
      await updateUserProfile(user.id, { renda_mensal: novaRenda });
    } catch (err) {
      console.error('Erro ao salvar renda:', err);
    }
  }, [user?.id]);

  const handleRendaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const novaRenda = Number(e.target.value) || 0;
    setRenda(novaRenda);

    // Salva no banco após 800ms sem digitar
    const timer = setTimeout(() => salvarRenda(novaRenda), 800);
    return () => clearTimeout(timer);
  };

  const salvarDespesa = async () => {
    const valorNum = parseFloat(quantidade);
    if (!descricao || isNaN(valorNum) || valorNum <= 0 || !user?.id) return;

    try {
      if (editandoId !== null) {
        const despesaAtualizada = await updateExpense(editandoId, {
          user_id: user.id,
          descricao: descricao,
          quantidade: valorNum,
          categoria: categoria
        });

        if (despesaAtualizada) {
          setExpenses(expenses.map(exp => 
            exp.id === editandoId 
            ? { ...exp, descricao, quantidade: valorNum, categoria } 
            : exp
          ));
          setEditandoId(null);
        }
      } else {
        const novaDespesa = await createExpense({
          user_id: user.id,
          descricao: descricao,
          quantidade: valorNum,
          categoria: categoria
        });

        if (novaDespesa) {
          const despesaFormatada: Expense = {
            id: novaDespesa.id?.toString(),
            descricao,
            quantidade: valorNum,
            categoria
          };
          setExpenses([despesaFormatada, ...expenses]);
        }
      }
      setDescricao('');
      setQuantidade('');
    } catch (err) {
      console.error('Erro ao salvar despesa:', err);
      alert('Erro ao salvar despesa');
    }
  };

  const prepararEdicao = (exp: Expense) => {
    setEditandoId(exp.id || null);
    setDescricao(exp.descricao);
    setQuantidade(exp.quantidade.toString());
    setCategoria(exp.categoria);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const removerDespesa = async (id: string | undefined) => {
    if (!id) return;
    
    if (window.confirm("Deseja realmente excluir este gasto?")) {
      try {
        const sucesso = await deleteExpense(id);
        if (sucesso) {
          setExpenses(expenses.filter(exp => exp.id !== id));
        }
      } catch (err) {
        console.error('Erro ao deletar despesa:', err);
        alert('Erro ao deletar despesa');
      }
    }
  };

  const totalDespesas = expenses.reduce((acc, curr) => acc + curr.quantidade, 0);
  const saldoFinal = renda - totalDespesas;

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

      <section className="dashboard">
        <div className="balance-card incoming">
          <span>Renda Total (R$)</span>
          <input 
            type="number" 
            placeholder="R$ 0,00"
            value={renda || ''}
            onChange={handleRendaChange}
          />
        </div>

        <div className={`balance-card status ${saldoFinal < 0 ? 'negative' : 'positive'}`}>
          <span>Saldo Restante</span>
          <h2>R$ {saldoFinal.toFixed(2)}</h2>
        </div>

        {cotacao && (
          <div className="balance-card quote">
            <span>Dólar Hoje (USD)</span>
            <h2>R$ {cotacao.toFixed(2)}</h2>
          </div>
        )}

        {btcPrice && (
          <div className="balance-card quote" style={{ backgroundColor: '#fff3cd', borderColor: '#ffeeba' }}>
            <span>Bitcoin Hoje (BTC)</span>
            <h2 style={{ color: '#856404' }}>
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(btcPrice)}
            </h2>
          </div>
        )}
      </section>

      <main className="main-content">
        
        <section className="form-container">
          <h3>{editandoId !== null ? '📝 Editar Gasto' : '✨ Nova Transação'}</h3>
          <div className="input-group">
            <input 
              placeholder="Descrição (ex: Aluguel)" 
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
              onChange={(e) => setCategoria(e.target.value as Expense['categoria'])}
            >
              <option value="Essencial">🟢 Essencial</option>
              <option value="Saúde">🏥 Saúde</option>
              <option value="Transporte">🚗 Transporte</option>
              <option value="Comida">🍕 Comida</option>
              <option value="Outros">⚪ Outros</option>
            </select>
            
            <button 
              className={`btn-add ${editandoId !== null ? 'btn-edit-mode' : ''}`} 
              onClick={salvarDespesa}
            >
              {editandoId !== null ? 'Confirmar Edição' : 'Adicionar Gasto'}
            </button>
            
            {editandoId !== null && (
              <button className="btn-cancel" onClick={() => {setEditandoId(null); setDescricao(''); setQuantidade('');}}>
                Cancelar Edição
              </button>
            )}
          </div>
        </section>

        <section className="list-container">
          <h3>Histórico de Gastos ({expenses.length})</h3>
          <div className="scroll-area">
            {carregando && (
              <p className="empty-msg">Carregando despesas...</p>
            )}
            
            {!carregando && expenses.length === 0 && (
              <p className="empty-msg">Nenhum gasto registrado ainda.</p>
            )}
            
            {!carregando && expenses.map(exp => (
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
                    <button className="btn-icon edit" onClick={() => prepararEdicao(exp)} title='Editar'>✎</button>
                    <button className="btn-icon delete" onClick={() => removerDespesa(exp.id)} title='Excluir'>✕</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}

export default AppDashboard;