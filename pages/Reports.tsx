import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Select, Badge } from '../components/ui';
import { FileText, Download, Filter, Calendar, ArrowUpCircle, ArrowDownCircle, Calculator } from 'lucide-react';
import { useData } from '../context/DataContext';
import { formatCurrency, formatDate } from '../services/mocks';

export const Reports = () => {
  const { receivables, payables } = useData();
  
  // Estados de filtro
  const [startDate, setStartDate] = useState('2023-01-01');
  const [endDate, setEndDate] = useState('2023-12-31');
  const [category, setCategory] = useState('all');

  // Mescla e filtra os dados
  const reportData = useMemo(() => {
    const combined = [
      ...receivables.map(r => ({ ...r, type: 'INCOME', label: r.clientName })),
      ...payables.map(p => ({ ...p, type: 'EXPENSE', label: p.fornecedor }))
    ];

    return combined
      .filter(item => {
        const dateMatch = item.vencimento >= startDate && item.vencimento <= endDate;
        const categoryMatch = category === 'all' || 
                             (category === 'income' && item.type === 'INCOME') || 
                             (category === 'expense' && item.type === 'EXPENSE');
        return dateMatch && categoryMatch;
      })
      .sort((a, b) => b.vencimento.localeCompare(a.vencimento));
  }, [receivables, payables, startDate, endDate, category]);

  // Cálculos de resumo
  const totals = useMemo(() => {
    return reportData.reduce((acc, curr) => {
      if (curr.type === 'INCOME') acc.income += curr.valor;
      else acc.expense += curr.valor;
      return acc;
    }, { income: 0, expense: 0 });
  }, [reportData]);

  const handleExport = (format: string) => {
    alert(`Gerando relatório em ${format.toUpperCase()} para o período ${formatDate(startDate)} a ${formatDate(endDate)}...`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios Financeiros</h1>
          <p className="text-muted-foreground">Análise detalhada de movimentações por período.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport('pdf')}>
            <Download className="mr-2 h-4 w-4" /> PDF
          </Button>
          <Button variant="outline" onClick={() => handleExport('excel')}>
            <FileText className="mr-2 h-4 w-4" /> Excel
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Início
              </label>
              <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Fim
              </label>
              <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1">
                <Filter className="h-3 w-3" /> Tipo
              </label>
              <Select 
                value={category} 
                onChange={setCategory} 
                options={[
                  { label: 'Todos os Lançamentos', value: 'all' },
                  { label: 'Apenas Receitas', value: 'income' },
                  { label: 'Apenas Despesas', value: 'expense' }
                ]} 
              />
            </div>
            <Button variant="secondary" className="w-full">
              <Calculator className="mr-2 h-4 w-4" /> Atualizar Vista
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resumo */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-blue-50/50 border-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600 flex items-center gap-2">
              <ArrowUpCircle className="h-4 w-4" /> Entradas no Período
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totals.income)}</div>
          </CardContent>
        </Card>
        <Card className="bg-red-50/50 border-red-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600 flex items-center gap-2">
              <ArrowDownCircle className="h-4 w-4" /> Saídas no Período
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totals.expense)}</div>
          </CardContent>
        </Card>
        <Card className={totals.income - totals.expense >= 0 ? "bg-green-50/50 border-green-100" : "bg-orange-50/50 border-orange-100"}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Saldo Líquido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totals.income - totals.expense >= 0 ? 'text-green-600' : 'text-orange-600'}`}>
              {formatCurrency(totals.income - totals.expense)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Dados */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Detalhamento das Movimentações</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b">
                <tr className="text-left">
                  <th className="p-4 font-medium">Data</th>
                  <th className="p-4 font-medium">Descrição</th>
                  <th className="p-4 font-medium">Tipo</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Valor</th>
                </tr>
              </thead>
              <tbody>
                {reportData.length > 0 ? reportData.map((item: any) => (
                  <tr key={item.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="p-4">{formatDate(item.vencimento)}</td>
                    <td className="p-4 font-medium">{item.label}</td>
                    <td className="p-4">
                      <Badge variant={item.type === 'INCOME' ? 'secondary' : 'outline'}>
                        {item.type === 'INCOME' ? 'Receita' : 'Despesa'}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge variant={item.status === 'PAGO' ? 'success' : 'warning'}>
                        {item.status}
                      </Badge>
                    </td>
                    <td className={`p-4 text-right font-bold ${item.type === 'INCOME' ? 'text-green-600' : 'text-red-500'}`}>
                      {item.type === 'INCOME' ? '+' : '-'} {formatCurrency(item.valor)}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                      Nenhum registro encontrado para este filtro.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};