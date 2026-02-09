
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from '../components/ui';
import { PieChart } from 'lucide-react';

export const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  
  // Credenciais pré-preenchidas para acesso fácil
  const [email, setEmail] = useState('admin@contapro.com');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);

  // Se o usuário já estiver logado, redireciona para o dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simula um pequeno delay de rede para feedback visual
    setTimeout(() => {
        login(email);
        setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 relative overflow-hidden">
      {/* Background Decorativo */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[100px]"></div>
      </div>

      <Card className="w-full max-w-md shadow-2xl border-slate-200 dark:border-slate-800 relative z-10">
        <CardHeader className="text-center space-y-4 pb-8">
            <div className="flex justify-center mb-4">
                <img src="/logo.jpeg" alt="Contabilidade" className="h-24 w-auto object-contain" />
            </div>
          <div>
            <p className="text-sm text-slate-500 mt-2 font-medium">Sistema de Gestão Financeira</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-500 tracking-wider ml-1">E-mail Corporativo</label>
              <Input 
                type="email" 
                placeholder="exemplo@empresa.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 bg-slate-50 dark:bg-slate-900/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-500 tracking-wider ml-1">Senha</label>
              <Input 
                type="password" 
                placeholder="******" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 bg-slate-50 dark:bg-slate-900/50"
              />
            </div>
            <Button type="submit" className="w-full h-11 font-bold shadow-lg shadow-primary/20 text-base" disabled={loading}>
              {loading ? 'Verificando...' : 'Acessar Sistema'}
            </Button>
          </form>
          
          <div className="text-center pt-2">
             <p className="text-xs text-slate-400">Versão de Protótipo v1.0.6</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
