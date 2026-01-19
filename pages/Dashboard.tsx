import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Select, Badge } from '../components/ui';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  AlertCircle, 
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
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">{title}</CardTitle>
          <div className={`p-2 rounded-lg shadow-sm ${iconColors[variant]}`}>
            <Icon className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{value}</div>
          <div className="flex items-center mt-2">
            <div className={`flex items-center text-xs font-bold px-1.5 py-0.5 rounded ${trend === 'up' ? 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30' : 'text-rose-600 bg-rose-100 dark:bg-rose-900/30'}`}>
              {trend === 'up' ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
              {change}
            </div>
            <span className="text-[10px] text-slate-500 ml-2 font-medium">vs último mês</span>
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

  // Dados para o gráfico de fluxo
  const dataFlow = [
    { name: 'Jan', entrada: 4200, saida: 2100 },
    { name: 'Fev', entrada: 3800, saida: 2400 },
    { name: 'Mar', entrada: 5100, saida: 1900 },
    { name: 'Abr', entrada: totalReceita / 1.8, saida: totalDespesa / 1.2 },
    { name: 'Maio', entrada: totalReceita, saida: totalDespesa },
  ];

  // Agrupamento de despesas para o Gráfico de Pizza
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

  const handleExport = () => {
    alert("Gerando relatório consolidado... O download começará em instantes.");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Dashboard Financeiro</h1>
          <p className="text-slate-500 text-sm mt-1">Resumo analítico das operações do escritório.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleExport} className="bg-white dark:bg-slate-900">
            <FileDown className="mr-2 h-4 w-4" /> Exportar Dados
          </Button>
          <Button onClick={() => window.location.hash = '#/financeiro/receber'} className="shadow-lg shadow-primary/25">
            + Novo Lançamento
          </Button>
        </div>
      </div>

      {/* Cards de KPIs */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KPICard 
          title="Faturamento Bruto" 
          value={formatCurrency(totalReceita)} 
          change="+20.1%" 
          trend="up" 
          icon={DollarSign}
          link="/financeiro/receber"
          variant="blue"
        />
        <KPICard 
          title="Despesas Fixas/Var." 
          value={formatCurrency(totalDespesa)} 
          change="-4.5%" 
          trend="down" 
          icon={CreditCard}
          link="/financeiro/pagar"
          variant="rose"
        />
        <KPICard 
          title="Saldo em Aberto" 
          value={formatCurrency(totalAReceber)} 
          change="+12.4%" 
          trend="up" 
          icon={TrendingUp}
          link="/financeiro/receber"
          variant="amber"
        />
        <KPICard 
          title="Base de Clientes" 
          value={clients.length} 
          change="+2" 
          trend="up" 
          icon={Briefcase}
          link="/cadastros/clientes"
          variant="emerald"
        />
      </div>

      {/* Gráficos Principais */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
        {/* Fluxo de Caixa */}
        <Card className="lg:col-span-8 shadow-md">
          <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b-2 border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" /> Tendência de Caixa (Entradas vs Saídas)
              </CardTitle>
            </div>
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
                  <XAxis 
                    dataKey="name" 
                    tickLine={false} 
                    axisLine={false} 
                    tick={{fontSize: 11, fill: '#64748b', fontWeight: 600}} 
                    dy={10}
                  />
                  <YAxis 
                    tickLine={false} 
                    axisLine={false} 
                    tick={{fontSize: 11, fill: '#64748b', fontWeight: 600}}
                    tickFormatter={(val) => `R$${val}`}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px' }}
                    itemStyle={{ fontWeight: 'bold' }}
                    formatter={(value) => formatCurrency(Number(value))} 
                  />
                  <Legend verticalAlign="top" align="right" height={40} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', paddingBottom: '20px' }} />
                  <Area 
                    type="monotone" 
                    dataKey="entrada" 
                    name="Entradas" 
                    stroke="#2563eb" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorEntrada)" 
                    animationDuration={1500}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="saida" 
                    name="Saídas" 
                    stroke="#f43f5e" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorSaida)" 
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Distribuição por Categoria (Pizza) */}
        <Card className="lg:col-span-4 shadow-md">
          <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b-2 border-slate-100 dark:border-slate-800">
            <CardTitle className="text-sm font-bold">Gastos por Categoria</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 flex flex-col items-center">
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                    animationDuration={1200}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full mt-4 space-y-2">
              {pieData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between text-xs font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }} />
                    <span className="text-slate-600 dark:text-slate-400">{item.name}</span>
                  </div>
                  <span className="text-slate-900 dark:text-white font-bold">{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Lançamentos Recentes */}
      <Card className="shadow-md">
        <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b-2 border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold">Últimas Operações</CardTitle>
            <Button variant="ghost" className="text-xs font-bold text-primary" onClick={() => window.location.hash = '#/financeiro/receber'}>
              Ver Extrato Completo
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50/30 dark:bg-slate-800/30 border-b-2">
                <tr className="text-left">
                  <th className="p-4 font-bold text-slate-500 uppercase text-[10px] tracking-widest">Favorecido</th>
                  <th className="p-4 font-bold text-slate-500 uppercase text-[10px] tracking-widest">Vencimento</th>
                  <th className="p-4 font-bold text-slate-500 uppercase text-[10px] tracking-widest text-right">Valor</th>
                  <th className="p-4 font-bold text-slate-500 uppercase text-[10px] tracking-widest text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {receivables.slice(0, 4).map((item) => (
                  <tr key={item.id} className="border-b-2 border-slate-50 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600">
                          <DollarSign className="h-4 w-4" />
                        </div>
                        <span className="font-bold text-slate-700 dark:text-slate-200">{item.clientName}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-500 font-medium">{item.vencimento}</td>
                    <td className="p-4 text-right font-black text-slate-900 dark:text-white">{formatCurrency(item.valor)}</td>
                    <td className="p-4 text-center">
                      <Badge variant={item.status === 'PAGO' ? 'success' : 'warning'}>
                        {item.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
