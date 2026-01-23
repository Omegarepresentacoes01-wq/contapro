
import React, { useState } from 'react';
import { Card, CardContent, Button, Input, Badge, Modal, Select } from '../components/ui';
import { Search, Plus, Trash2 } from 'lucide-react';
import { formatCurrency, formatDate, generateId } from '../services/mocks';
import { Receivable, Payable } from '../types';
import { useData } from '../context/DataContext';

interface FinancialProps {
  type: 'receivables' | 'payables';
}

const TIPOS_DOC = [
  { label: 'Selecione o Tipo...', value: '' },
  { label: 'Boleto', value: 'Boleto' },
  { label: 'Débito Automático', value: 'Débito Automático' },
  { label: 'Pix', value: 'Pix' },
];

const CAT_RECEITAS = [
  { label: 'Selecione a Receita...', value: '' },
  { label: 'Receita com Consultoria', value: 'Receita com Consultoria' },
  { label: 'Receita de Trabalhos Extras', value: 'Receita de Trabalhos Extras' },
  { label: 'Prestação de Serviços', value: 'Prestação de Serviços' },
  { label: 'Transferência entre Contas', value: 'Transferência entre Contas' },
  { label: 'Receita Recebimento Trabalho Andressa', value: 'Receita Recebimento Trabalho Andressa' },
  { label: 'Outras Receitas Não Operacionais', value: 'Outras Receitas Não Operacionais' },
];

const CAT_DESPESAS = [
  { label: 'Selecione a Despesa...', value: '' },
  { label: 'DAS Simples Nacional', value: 'DAS Simples Nacional' },
  { label: 'ISS', value: 'ISS' },
  { label: 'Comissão', value: 'Comissão' },
  { label: 'DARF', value: 'DARF' },
  { label: 'Rescisão', value: 'Rescisão' },
  { label: 'DARE', value: 'DARE' },
  { label: 'Taxas', value: 'Taxas' },
  { label: 'Material de Expediente', value: 'Material de Expediente' },
  { label: 'Viagem e Estadia', value: 'Viagem e Estadia' },
  { label: 'Cartório', value: 'Cartório' },
  { label: 'Pró-labore', value: 'Pró-labore' },
  { label: 'Aluguel', value: 'Aluguel' },
  { label: 'IPTU', value: 'IPTU' },
  { label: 'Telefone', value: 'Telefone' },
  { label: 'Internet', value: 'Internet' },
  { label: 'Limpeza e Conservação', value: 'Limpeza e Conservação' },
  { label: 'Energia Elétrica', value: 'Energia Elétrica' },
  { label: 'Serviços Jurídicos', value: 'Serviços Jurídicos' },
  { label: 'Software', value: 'Software' },
  { label: 'Retirada de Sócio', value: 'Retirada de Sócio' },
  { label: 'FGTS', value: 'FGTS' },
  { label: 'INSS', value: 'INSS' },
  { label: 'Manutenção de Veículos', value: 'Manutenção de Veículos' },
  { label: 'Férias', value: 'Férias' },
  { label: 'Combustível', value: 'Combustível' },
  { label: 'Outros Gastos Não Operacionais', value: 'Outros Gastos Não Operacionais' },
  { label: 'Tarifa Bancária', value: 'Tarifa Bancária' },
  { label: 'Outras despesas pessoais', value: 'Outras despesas pessoais' },
  { label: 'Vale', value: 'Vale' },
  { label: 'Salário', value: 'Salário' },
];

export const Financial = ({ type }: FinancialProps) => {
  const isReceivable = type === 'receivables';
  const { 
    receivables, 
    payables, 
    markAsPaid, 
    addReceivable, 
    addPayable, 
    removeReceivable, 
    removePayable,
    banks,
    addBank
  } = useData();
  
  const data = isReceivable ? receivables : payables;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isBaixaModalOpen, setIsBaixaModalOpen] = useState(false);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  
  // Controle do modal de bancos
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [newBankName, setNewBankName] = useState('');

  // Estado Expandido
  const [newVal, setNewVal] = useState({ 
    name: '', // Cliente ou Fornecedor
    valor: '', 
    vencimento: '', 
    competencia: new Date().toISOString().slice(0, 7),
    banco: '',
    tipoDocumento: '',
    categoria: '',
    descricao: '',
    parcelas: '1'
  });

  const filteredData = data.filter(item => {
    const name = isReceivable ? (item as Receivable).clientName : (item as Payable).fornecedor;
    const cat = isReceivable ? (item as Receivable).categoria : (item as Payable).categoria;
    const searchLower = searchTerm.toLowerCase();
    return name.toLowerCase().includes(searchLower) || (cat && cat.toLowerCase().includes(searchLower));
  });

  const handleBaixa = (item: any) => {
    setSelectedItem(item);
    setIsBaixaModalOpen(true);
  };

  const confirmBaixa = () => {
    markAsPaid(isReceivable ? 'rec' : 'pay', selectedItem.id);
    setIsBaixaModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("ATENÇÃO: Tem certeza que deseja excluir este lançamento permanentemente?")) {
      if (isReceivable) removeReceivable(id);
      else removePayable(id);
    }
  };

  const handleSaveBank = () => {
    if (!newBankName.trim()) return;
    addBank(newBankName.trim());
    setNewBankName('');
    setIsBankModalOpen(false);
  };

  const handleSaveNew = () => {
    if (!newVal.name || !newVal.valor || !newVal.vencimento) return alert("Preencha os campos obrigatórios (*)");
    
    const id = generateId();
    if (isReceivable) {
      addReceivable({
        id, 
        clientId: '99', // Genérico, já que é input de texto livre
        clientName: newVal.name,
        competencia: newVal.competencia, 
        vencimento: newVal.vencimento,
        valor: Number(newVal.valor), 
        status: 'PENDENTE', 
        formaPagamento: newVal.tipoDocumento, // Mantido para compatibilidade
        tipoDocumento: newVal.tipoDocumento as any,
        banco: newVal.banco as any,
        categoria: newVal.categoria,
        descricao: newVal.descricao,
        parcelas: Number(newVal.parcelas)
      });
    } else {
      addPayable({
        id, 
        fornecedor: newVal.name, 
        categoria: newVal.categoria || 'Outros Gastos Não Operacionais',
        centroCustoId: '1', 
        centroCustoName: 'Geral',
        vencimento: newVal.vencimento, 
        valor: Number(newVal.valor),
        status: 'PENDENTE', 
        banco: newVal.banco as any,
        tipoDocumento: newVal.tipoDocumento as any,
        descricao: newVal.descricao,
        parcelas: Number(newVal.parcelas)
      } as any);
    }
    setIsNewModalOpen(false);
    // Reset state
    setNewVal({ 
        name: '', valor: '', vencimento: '', competencia: new Date().toISOString().slice(0, 7),
        banco: '', tipoDocumento: '', categoria: '', descricao: '', parcelas: '1'
    });
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
            placeholder="Pesquisar por nome ou categoria..." 
            className="pl-10" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card className="shadow-md print:shadow-none print:border-none">
        <CardContent className="p-0">
          <div className="w-full overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50/50 dark:bg-slate-800/50 border-b-2">
                <tr className="text-left">
                  <th className="p-4 font-bold text-slate-500 uppercase text-[10px] tracking-widest">{isReceivable ? 'Cliente' : 'Fornecedor'}</th>
                  <th className="p-4 font-bold text-slate-500 uppercase text-[10px] tracking-widest hidden md:table-cell">Categoria / Detalhe</th>
                  <th className="p-4 font-bold text-slate-500 uppercase text-[10px] tracking-widest">Vencimento</th>
                  <th className="p-4 font-bold text-slate-500 uppercase text-[10px] tracking-widest">Valor</th>
                  <th className="p-4 font-bold text-slate-500 uppercase text-[10px] tracking-widest">Status</th>
                  <th className="p-4 font-bold text-slate-500 uppercase text-[10px] tracking-widest text-right print:hidden">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item: any) => (
                  <tr key={item.id} className="border-b-2 border-slate-50 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4">
                        <div className="font-bold text-slate-700 dark:text-slate-200">{isReceivable ? item.clientName : item.fornecedor}</div>
                        <div className="text-xs text-slate-400 font-medium md:hidden">{item.categoria}</div>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                        <div className="font-medium text-slate-600 dark:text-slate-300">{item.categoria || '-'}</div>
                        {item.banco && <div className="text-[10px] text-slate-400 uppercase tracking-wider">{item.banco} • {item.tipoDocumento}</div>}
                    </td>
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

      <Modal isOpen={isBaixaModalOpen} onClose={() => setIsBaixaModalOpen(false)} title="Confirmar Liquidação">
        <div className="space-y-4 py-4">
            <p className="text-slate-600">
                Confirmar {isReceivable ? 'recebimento' : 'pagamento'} de <strong className="text-slate-900 font-black">{formatCurrency(selectedItem?.valor || 0)}</strong> referente a {isReceivable ? selectedItem?.clientName : selectedItem?.fornecedor}?
            </p>
            <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" className="border-2 font-bold" onClick={() => setIsBaixaModalOpen(false)}>Cancelar</Button>
                <Button onClick={confirmBaixa} className="font-bold shadow-lg shadow-primary/20">Confirmar</Button>
            </div>
        </div>
      </Modal>

      <Modal isOpen={isNewModalOpen} onClose={() => setIsNewModalOpen(false)} title={isReceivable ? "Nova Receita" : "Nova Despesa"}>
        <div className="space-y-4 py-2 max-h-[70vh] overflow-y-auto pr-2">
            {/* Linha 1: Nome */}
            <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{isReceivable ? 'Cliente *' : 'Fornecedor *'}</label>
                <Input value={newVal.name} onChange={e => setNewVal({...newVal, name: e.target.value})} placeholder={isReceivable ? "Nome do Cliente" : "Nome do Fornecedor"} />
            </div>

            {/* Linha 2: Descrição */}
            <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Descrição Detalhada</label>
                <Input value={newVal.descricao} onChange={e => setNewVal({...newVal, descricao: e.target.value})} placeholder="Ex: Mensalidade ref. Outubro..." />
            </div>

            {/* Linha 3: Valor e Vencimento */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Valor (R$) *</label>
                    <Input type="number" value={newVal.valor} onChange={e => setNewVal({...newVal, valor: e.target.value})} placeholder="0.00" />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Vencimento *</label>
                    <Input type="date" value={newVal.vencimento} onChange={e => setNewVal({...newVal, vencimento: e.target.value})} />
                </div>
            </div>

            {/* Linha 4: Categoria e Banco */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Categoria</label>
                    <Select 
                        value={newVal.categoria} 
                        onChange={v => setNewVal({...newVal, categoria: v})} 
                        options={isReceivable ? CAT_RECEITAS : CAT_DESPESAS} 
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Banco</label>
                    <div className="flex gap-2">
                        <Select 
                            value={newVal.banco} 
                            onChange={v => setNewVal({...newVal, banco: v})} 
                            options={[{ label: 'Selecione o Banco...', value: '' }, ...banks.map(b => ({ label: b, value: b }))]} 
                            className="flex-1"
                        />
                        <Button 
                            type="button"
                            variant="outline" 
                            className="px-3 border-2 border-slate-200 dark:border-slate-800"
                            onClick={() => setIsBankModalOpen(true)}
                            title="Incluir novo banco"
                        >
                            <Plus className="h-4 w-4 text-primary" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Linha 5: Tipo Doc e Parcelas */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Tipo Documento</label>
                    <Select value={newVal.tipoDocumento} onChange={v => setNewVal({...newVal, tipoDocumento: v})} options={TIPOS_DOC} />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Parcelas</label>
                    <Input type="number" min="1" value={newVal.parcelas} onChange={e => setNewVal({...newVal, parcelas: e.target.value})} />
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t mt-4">
                <Button variant="outline" className="border-2 font-bold" onClick={() => setIsNewModalOpen(false)}>Cancelar</Button>
                <Button onClick={handleSaveNew} className="font-bold shadow-lg shadow-primary/20">Salvar Lançamento</Button>
            </div>
        </div>
      </Modal>

      {/* Modal para Adicionar Novo Banco */}
      <Modal isOpen={isBankModalOpen} onClose={() => setIsBankModalOpen(false)} title="Incluir Novo Banco">
        <div className="space-y-4 py-4">
            <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Nome do Banco / Carteira</label>
                <Input 
                    value={newBankName} 
                    onChange={e => setNewBankName(e.target.value)} 
                    placeholder="Ex: Banco do Brasil, Inter, Caixa..." 
                    autoFocus
                />
            </div>
            <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsBankModalOpen(false)}>Cancelar</Button>
                <Button onClick={handleSaveBank} className="font-bold">Adicionar</Button>
            </div>
        </div>
      </Modal>
    </div>
  );
};
