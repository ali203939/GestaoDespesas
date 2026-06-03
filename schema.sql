-- ============================================
-- GESTOR DE DESPESAS - Database Schema
-- PostgreSQL (Supabase)
-- ============================================

-- Drop tables if they exist (for fresh setup)
DROP TABLE IF EXISTS expenses CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- 1. Users Table
-- ============================================
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX idx_users_email ON users(email);

-- ============================================
-- 2. Expenses Table
-- ============================================
CREATE TABLE expenses (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  descricao VARCHAR(255) NOT NULL,
  quantidade DECIMAL(10, 2) NOT NULL CHECK (quantidade > 0),
  categoria VARCHAR(50) NOT NULL CHECK (categoria IN ('Essencial', 'Comida', 'Saúde', 'Transporte', 'Outros')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_expenses_user_id ON expenses(user_id);
CREATE INDEX idx_expenses_created_at ON expenses(created_at);
CREATE INDEX idx_expenses_categoria ON expenses(categoria);

-- ============================================
-- 3. User Profile / Settings (Optional)
-- ============================================
CREATE TABLE user_profiles (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  renda_mensal DECIMAL(10, 2) DEFAULT 0.00,
  moeda_padrao VARCHAR(10) DEFAULT 'BRL',
  tema VARCHAR(20) DEFAULT 'dark',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 4. Exchange Rates Log (Optional - for tracking)
-- ============================================
CREATE TABLE exchange_rates_log (
  id BIGSERIAL PRIMARY KEY,
  taxa_usd_brl DECIMAL(10, 4) NOT NULL,
  fonte VARCHAR(100) DEFAULT 'AwesomeAPI',
  registrado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Keep only last 30 days of exchange rates
CREATE INDEX idx_exchange_rates_data ON exchange_rates_log(registrado_em);

-- ============================================
-- Sample Data (Optional)
-- ============================================
-- Uncomment to insert sample data

-- INSERT INTO users (email, password) VALUES
-- ('usuario@example.com', 'senha_criptografada_aqui'),
-- ('outro.usuario@example.com', 'outra_senha_aqui');

-- INSERT INTO user_profiles (user_id, renda_mensal) VALUES
-- (1, 5000.00),
-- (2, 3500.00);

-- INSERT INTO expenses (user_id, descricao, quantidade, categoria) VALUES
-- (1, 'Aluguel', 1500.00, 'Essencial'),
-- (1, 'Supermercado', 450.00, 'Comida'),
-- (1, 'Uber', 85.00, 'Transporte'),
-- (1, 'Farmácia', 120.00, 'Saúde'),
-- (1, 'Streaming', 50.00, 'Outros');

-- ============================================
-- Row Level Security (RLS) - Enable for security
-- ============================================

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policies for users table (users can only see their own data)
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Policies for expenses table (users can only see their own expenses)
CREATE POLICY "Users can view their own expenses" ON expenses
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own expenses" ON expenses
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own expenses" ON expenses
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own expenses" ON expenses
  FOR DELETE USING (user_id = auth.uid());

-- Policies for user_profiles table
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (user_id = auth.uid());

-- ============================================
-- Views (Optional)
-- ============================================

-- View to get user expense summary
CREATE OR REPLACE VIEW user_expense_summary AS
SELECT 
  u.id as user_id,
  u.email,
  COUNT(e.id) as total_expenses,
  SUM(e.quantidade) as total_gasto,
  AVG(e.quantidade) as media_gasto,
  MAX(e.quantidade) as maior_gasto,
  MIN(e.quantidade) as menor_gasto
FROM users u
LEFT JOIN expenses e ON u.id = e.user_id
GROUP BY u.id, u.email;

-- View to get expenses by category
CREATE OR REPLACE VIEW expenses_by_category AS
SELECT 
  e.user_id,
  e.categoria,
  COUNT(e.id) as quantidade_expenses,
  SUM(e.quantidade) as total_categoria,
  AVG(e.quantidade) as media_categoria
FROM expenses e
GROUP BY e.user_id, e.categoria;
