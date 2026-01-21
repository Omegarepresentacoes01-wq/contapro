
import React, { useState } from 'react';
import { Card, CardContent, Button, Input, Badge, Modal } from '../components/ui';
import { Search, Filter, Plus, Trash2 } from 'lucide-react';
import { formatCurrency, formatDate, generateId } from '../services/mocks';
import { Receivable, Payable } from '../types';
import { useData } from '../context/DataContext';

interface FinancialProps {
  type: 'receivables' | 'payables';
}

export const Financial = ({ type }: FinancialProps) => {
  const isReceivable = type === 'receivables';
  const { 
    receivables, 
    payables, 
    markAsPaid, 
    addReceivable, 
    addPayable, 
    removeReceivable, 
    removePayable 
  } = useData();
  
  const data = isReceivable ? receivables : payables;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isBaixaModalOpen, setIsBaixaModalOpen] = useState(false);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  const [newVal, setNewVal] = useState({ name: '', valor: '', vencimento: '', competencia: '2023-11' });

  const filteredData = data.filter(item => {
    const name = isReceivable ? (item as Receivable).clientName : (item as Payable).fornecedor;
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleBaixa = (item: any) => {
    setSelectedItem(item);
    setIsBaixaModalOpen(true);
  };

  const confirmBaixa = () => {
    markAsPaid(isReceivable ? 'rec' : 'pay', selectedItem.id);
    setIsBaixaModalOpen(false);
  };

  // Garante a confirmação de exclusão
  const handleDelete = (id: string) => {
    if (window.confirm("ATENÇÃO: Tem certeza que deseja excluir este lançamento permanentemente?")) {
      if (isReceivable) removeReceivable(id);
      else removePayable(id);
    }
  };

  const handleSaveNew = () => {
    if (!newVal.name || !newVal.valor) return alert("Preencha os campos obrigatórios");
    
    const id = generateId();
    if (isReceivable) {
      addReceivable({
        id, clientId: '99', clientName: newVal.name,
        competencia: newVal.competencia, vencimento: newVal.vencimento,
        valor: Number(newVal.valor), status: 'PENDENTE', formaPagamento: 'Boleto'
      });
    } else {
      addPayable({
        id, fornecedor: newVal.name, categoria: 'Diversos',
        centroCustoId: '1', centroCustoName: 'Geral',
        vencimento: newVal.vencimento, valor: Number(newVal.valor),
        status: 'PENDENTE', competencia: newVal.competencia
      } as any);
    }
    setIsNewModalOpen(false);
    setNewVal({ name: '', valor: '', vencimento: '', competencia: '2023-11' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            {isReceivable ? 'Contas a Receber' : 'Contas a Pagar'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">Gestão de fluxo financeiro do escritório.</p>
        </div>
        <Button onClick={() => setIsNewModalOpen(true)} className="shadow-lg shadow-primary/20 font-bold print:hidden">
          <Plus className="mr-2 h-4 w-4" /> {isReceivable ? 'Nova Receita' : 'Nova Despesa'}
        </Button>
      </div>

      <div className="flex items-center gap-2 print:hidden">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Pesquisar..." 
            className="pl-10" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon" className="border-2"><Filter className="h-4 w-4" /></Button>
      </div>

      <Card className="shadow-md print:shadow-none print:border-none">
        <CardContent className="p-0">
          <div className="w-full overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50/50 dark:bg-slate-800/50 border-b-2">
                <tr className="text-left">
                  <th className="p-4 font-bold text-slate-500 uppercase text-[10px] tracking-widest">{isReceivable ? 'Cliente' : 'Fornecedor'}</th>
                  <th className="p-4 font-bold text-slate-500 uppercase text-[10px] tracking-widest">Vencimento</th>
                  <th className="p-4 font-bold text-slate-500 uppercase text-[10px] tracking-widest">Valor</th>
                  <th className="p-4 font-bold text-slate-500 uppercase text-[10px] tracking-widest">Status</th>
                  <th className="p-4 font-bold text-slate-500 uppercase text-[10px] tracking-widest text-right print:hidden">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item: any) => (
                  <tr key={item.id} className="border-b-2 border-slate-50 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-bold text-slate-700 dark:text-slate-200">{isReceivable ? item.clientName : item.fornecedor}</td>
                    <td className="p-4 text-slate-500 font-medium">{formatDate(item.vencimento)}</td>
                    <td className="p-4 font-black text-slate-900 dark:text-white">{formatCurrency(item.valor)}</td>
                    <td className="p-4">
                        <Badge variant={item.status === 'PAGO' ? 'success' : (item.status === 'ATRASADO' ? 'destructive' : 'warning')}>
                            {item.status}
                        </Badge>
                    </td>
                    <td className="p-4 text-right flex justify-end gap-2 print:hidden">
                      {item.status !== 'PAGO' && (
                        <Button size="sm" variant="outline" className="border-2 font-bold" onClick={() => handleBaixa(item)}>Baixar</Button>
                      )}
                      <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-50" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Modal isOpen={isBaixaModalOpen} onClose={() => setIsBaixaModalOpen(false)} title="Confirmar Recebimento">
        <div className="space-y-4 py-4">
            <p className="text-slate-600">Deseja confirmar a liquidação de <strong className="text-slate-900 font-black">{formatCurrency(selectedItem?.valor || 0)}</strong>?</p>
            <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" className="border-2 font-bold" onClick={() => setIsBaixaModalOpen(false)}>Cancelar</Button>
                <Button onClick={confirmBaixa} className="font-bold">Confirmar Pagamento</Button>
            </div>
        </div>
      </Modal>

      <Modal isOpen={isNewModalOpen} onClose={() => setIsNewModalOpen(false)} title={isReceivable ? "Nova Receita" : "Nova Despesa"}>
        <div className="space-y-5 py-4">
            <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Nome do {isReceivable ? 'Cliente' : 'Fornecedor'}</label>
                <Input value={newVal.name} onChange={e => setNewVal({...newVal, name: e.target.value})} placeholder="Digite o nome..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Valor (R$)</label>
                    <Input type="number" value={newVal.valor} onChange={e => setNewVal({...newVal, valor: e.target.value})} placeholder="0.00" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Vencimento</label>
                    <Input type="date" value={newVal.vencimento} onChange={e => setNewVal({...newVal, vencimento: e.target.value})} />
                </div>
            </div>
            <div className="flex justify-end gap-3 pt-6">
                <Button variant="outline" className="border-2 font-bold" onClick={() => setIsNewModalOpen(false)}>Cancelar</Button>
                <Button onClick={handleSaveNew} className="font-bold shadow-lg shadow-primary/20">Salvar Lançamento</Button>
            </div>
        </div>
      </Modal>
    </div>
  );
};
