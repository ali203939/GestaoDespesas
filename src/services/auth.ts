interface User {
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  user?: { email: string };
}

// Simular banco de dados de usuários no localStorage
const USERS_KEY = 'users_db';
const CURRENT_USER_KEY = 'current_user';

function getStoredUsers(): User[] {
  const stored = localStorage.getItem(USERS_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveUsers(users: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function register(email: string, password: string): AuthResponse {
  // Validações
  if (!email || !password) {
    return { success: false, message: 'Email e senha são obrigatórios' };
  }

  if (password.length < 6) {
    return { success: false, message: 'Senha deve ter no mínimo 6 caracteres' };
  }

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, message: 'Email inválido' };
  }

  const users = getStoredUsers();
  
  // Verificar se usuário já existe
  if (users.some(u => u.email === email)) {
    return { success: false, message: 'Este email já está cadastrado' };
  }

  // Adicionar novo usuário
  users.push({ email, password });
  saveUsers(users);

  return { success: true, message: 'Cadastro realizado com sucesso!' };
}

export function login(email: string, password: string): AuthResponse {
  if (!email || !password) {
    return { success: false, message: 'Email e senha são obrigatórios' };
  }

  const users = getStoredUsers();
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return { success: false, message: 'Email ou senha incorretos' };
  }

  // Salvar usuário logado
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ email }));
  
  return { success: true, message: 'Login realizado com sucesso!', user: { email } };
}

export function getCurrentUser(): { email: string } | null {
  const stored = localStorage.getItem(CURRENT_USER_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function logout(): void {
  localStorage.removeItem(CURRENT_USER_KEY);
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}
