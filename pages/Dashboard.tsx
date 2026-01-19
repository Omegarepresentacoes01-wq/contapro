
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '../components/ui';
import { 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  FileDown, 
  CreditCard,
  Briefcase
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { formatCurrency } from '../services/mocks';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

const KPICard = ({ title, value, change, trend, icon: Icon, link, variant }: any) => {
  const variants: Record<string, string> = {
    blue: "bg-indigo-50 dark:bg-indigo-900/10 border-indigo-200 dark:border-indigo-900/50",
    rose: "bg-rose-50 dark:bg-rose-900/10 border-rose-200 dark:border-rose-900/50",
    amber: "bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900/50",
    emerald: "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-900/50",
  };

  const iconColors: Record<string, string> = {
    blue: "bg-indigo-500 text-white",
    rose: "bg-rose-500 text-white",
    amber: "bg-amber-500 text-white",
    emerald: "bg-emerald-500 text-white",
  };

  return (
    <Link to={link || '#'}>
      <Card className={`group transition-all duration-300 hover:-translate-y-1 ${variants[variant]}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-500">{title}</CardTitle>
          <div className={`p-2 rounded-lg shadow-sm ${iconColors[variant]}`}>
            <Icon className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{value}</div>
          <div className="flex items-center mt-2">
            <div className={`flex items-center text-xs font-bold px-1.5 py-0.5 rounded ${trend === 'up' ? 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30' : 'text-rose-600 bg-rose-100 dark:bg-rose-900/30'}`}>
              {trend === 'up' ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
              {change}
            </div>
            <span className="text-[10px] text-slate-500 ml-2 font-medium">vs último período</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export const Dashboard = () => {
  const { receivables, payables, clients } = useData();

  const totalReceita = receivables.reduce((acc, curr) => acc + curr.valor, 0);
  const totalDespesa = payables.reduce((acc, curr) => acc + curr.valor, 0);
  const totalAReceber = receivables.filter(r => r.status !== 'PAGO').reduce((acc, curr) => acc + curr.valor, 0);

  const dataFlow = useMemo(() => {
    // Agrupa por mês para criar o gráfico dinâmico
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
    return months.map((m, idx) => {
        // Simulação de histórico + dados reais no mês atual (Maio = idx 4)
        if (idx < 4) return { name: m, entrada: 2000 + (idx * 500), saida: 1500 + (idx * 200) };
        if (idx === 4) return { name: m, entrada: totalReceita, saida: totalDespesa };
        return { name: m, entrada: 0, saida: 0 };
    });
  }, [totalReceita, totalDespesa]);

  const pieData = useMemo(() => {
    const categories: Record<string, number> = {};
    payables.forEach(p => {
      categories[p.categoria] = (categories[p.categoria] || 0) + p.valor;
    });
    return Object.keys(categories).map(cat => ({
      name: cat,
      value: categories[cat]
    }));
  }, [payables]);

  const PIE_COLORS = ['#6366f1', '#f43f5e', '#f59e0b', '#10b981', '#06b6d4'];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">Dashboard <span className="text-primary">Geral</span></h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">Dados atualizados em tempo real conforme movimentações.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => window.print()} className="bg-white dark:bg-slate-900 border-2 font-bold">
            <FileDown className="mr-2 h-4 w-4" /> Relatório Rápido
          </Button>
          <Button onClick={() => window.location.hash = '#/financeiro/receber'} className="shadow-lg shadow-primary/40 font-bold">
            + Novo Registro
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Receita Total" value={formatCurrency(totalReceita)} change="+15%" trend="up" icon={DollarSign} link="/financeiro/receber" variant="blue" />
        <KPICard title="Gastos Totais" value={formatCurrency(totalDespesa)} change="-3%" trend="down" icon={CreditCard} link="/financeiro/pagar" variant="rose" />
        <KPICard title="Em Aberto" value={formatCurrency(totalAReceber)} change="+8%" trend="up" icon={TrendingUp} link="/financeiro/receber" variant="amber" />
        <KPICard title="Clientes Ativos" value={clients.length} change="+1" trend="up" icon={Briefcase} link="/cadastros/clientes" variant="emerald" />
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
        <Card className="lg:col-span-8 shadow-xl">
          <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b-2 border-slate-100 dark:border-slate-800">
            <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" /> Fluxo de Caixa Mensal
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-8">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dataFlow}>
                  <defs>
                    <linearGradient id="colorEntrada" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorSaida" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{fontSize: 11, fill: '#64748b', fontWeight: 800}} axisLine={false} tickLine={false} />
                  <YAxis tick={{fontSize: 11, fill: '#64748b', fontWeight: 800}} axisLine={false} tickLine={false} tickFormatter={(val) => `R$${val}`} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '2px solid #e2e8f0', fontWeight: '800' }} />
                  <Area type="monotone" dataKey="entrada" name="Entradas" stroke="#2563eb" strokeWidth={4} fill="url(#colorEntrada)" />
                  <Area type="monotone" dataKey="saida" name="Saídas" stroke="#f43f5e" strokeWidth={4} fill="url(#colorSaida)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-4 shadow-xl">
          <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b-2 border-slate-100 dark:border-slate-800">
            <CardTitle className="text-xs font-black uppercase tracking-widest">Despesas por Setor</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={8} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '2px solid #e2e8f0' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full mt-4 space-y-2">
              {pieData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }} />
                    <span className="text-slate-600">{item.name}</span>
                  </div>
                  <span className="text-slate-900 dark:text-white">{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-xl border-2">
        <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b-2">
          <CardTitle className="text-xs font-black uppercase tracking-widest">Recentes no Sistema</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50/30 dark:bg-slate-800/30 border-b-2">
                <tr className="text-left text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <th className="p-4">Beneficiário</th>
                  <th className="p-4">Vencimento</th>
                  <th className="p-4 text-right">Valor</th>
                  <th className="p-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {receivables.slice(0, 5).map((item) => (
                  <tr key={item.id} className="border-b-2 border-slate-50 dark:border-slate-800 hover:bg-slate-100/50 dark:hover:bg-slate-800/50">
                    <td className="p-4 font-bold">{item.clientName}</td>
                    <td className="p-4 font-medium text-slate-500">{item.vencimento}</td>
                    <td className="p-4 text-right font-black">{formatCurrency(item.valor)}</td>
                    <td className="p-4 text-center">
                      <Badge variant={item.status === 'PAGO' ? 'success' : 'warning'}>{item.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        </CardContent>
      </Card>
    </div>
  );
};
