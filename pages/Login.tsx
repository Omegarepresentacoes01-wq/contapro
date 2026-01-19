import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from '../components/ui';
import { PieChart } from 'lucide-react';

export const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  // Se o usuário já estiver logado (ou logar com sucesso), redireciona para o dashboard
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
        // O useEffect acima cuidará do redirecionamento assim que o estado 'user' mudar
        setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
            <div className="flex justify-center mb-2">
                <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center">
                    <PieChart className="h-6 w-6 text-primary-foreground" />
                </div>
            </div>
          <CardTitle className="text-2xl">Acessar ContaContábil</CardTitle>
          <p className="text-sm text-muted-foreground">Digite seu e-mail para acessar o dashboard</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">E-mail</label>
              <Input 
                type="email" 
                placeholder="exemplo@empresa.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Senha</label>
              <Input type="password" placeholder="******" required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
            <div className="text-center text-xs text-muted-foreground">
                Dica: Use qualquer email para entrar.
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};