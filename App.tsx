import React, { createContext, useContext, useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Financial } from './pages/Financial';
import { Registry } from './pages/Registry';
import { PayrollPage } from './pages/Payroll';
import { Reports } from './pages/Reports';
import { DataProvider } from './context/DataContext';

// --- Auth Context ---
interface AuthContextType {
  user: { email: string } | null;
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }: { children?: React.ReactNode }) => {
  const [user, setUser] = useState<{ email: string } | null>(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      return null;
    }
  });

  const login = (email: string) => {
    const fakeUser = { email };
    setUser(fakeUser);
    localStorage.setItem('user', JSON.stringify(fakeUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return <Layout>{children}</Layout>;
};

const App = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/financeiro/receber" element={<ProtectedRoute><Financial type="receivables" /></ProtectedRoute>} />
            <Route path="/financeiro/pagar" element={<ProtectedRoute><Financial type="payables" /></ProtectedRoute>} />
            <Route path="/financeiro/fluxo-caixa" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/cadastros/clients" element={<Navigate to="/cadastros/clientes" replace />} />
            <Route path="/cadastros/clientes" element={<ProtectedRoute><Registry type="clients" /></ProtectedRoute>} />
            <Route path="/cadastros/funcionarios" element={<ProtectedRoute><Registry type="employees" /></ProtectedRoute>} />
            <Route path="/folha/pagamento" element={<ProtectedRoute><PayrollPage /></ProtectedRoute>} />
            <Route path="/relatorios" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
            <Route path="*" element={<ProtectedRoute><div className="p-8 text-center">Página em construção</div></ProtectedRoute>} />
          </Routes>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
};

export default App;