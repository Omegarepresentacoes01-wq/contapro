
import React, { useState } from 'react';
import { Card, CardContent, Button, Input, Badge, Modal } from '../components/ui';
import { Search, Plus, User, Building, Trash2, Edit, Truck } from 'lucide-react';
import { formatCurrency, generateId } from '../services/mocks';
import { useData } from '../context/DataContext';

interface RegistryProps {
  type: 'clients' | 'employees' | 'suppliers';
}

export const Registry = ({ type }: RegistryProps) => {
  const isClient = type === 'clients';
  const isEmployee = type === 'employees';
  const isSupplier = type === 'suppliers';

  const { 
    clients, 
    employees, 
    suppliers,
    addClient, 
    addEmployee, 
    addSupplier,
    removeClient, 
    removeEmployee,
    removeSupplier,
    updateClient,
    updateEmployee,
    updateSupplier
  } = useData();
  
  const data = isClient ? clients : (isEmployee ? employees : suppliers);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Estado para controle de edição
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ nome: '', doc: '', valor: '', extra: '' });

  const filteredData = data.filter((item: any) => 
    item.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLabel = () => {
    if (isClient) return 'Cliente';
    if (isEmployee) return 'Funcionário';
    return 'Fornecedor';
  };

  const handleDelete = (id: string) => {
    if (window.confirm(`ATENÇÃO: Deseja realmente excluir este ${getLabel().toLowerCase()} do sistema?`)) {
      if (isClient) removeClient(id);
      else if (isEmployee) removeEmployee(id);
      else removeSupplier(id);
    }
  };

  const openNewModal = () => {
    setEditingId(null);
    setFormData({ nome: '', doc: '', valor: '', extra: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingId(item.id);
    if (isClient) {
        setFormData({ nome: item.nome, doc: item.cnpjCpf, valor: item.honorarioMensal.toString(), extra: '' });
    } else if (isEmployee) {
        setFormData({ nome: item.nome, doc: item.cargo, valor: item.salarioBase.toString(), extra: '' });
    } else {
        // Supplier
        setFormData({ nome: item.nome, doc: item.cnpj, valor: item.categoria, extra: item.contato });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.nome) return alert("Preencha o nome");
    
    // Validações básicas
    if (isClient || isEmployee) {
        if (!formData.valor) return alert("Preencha o valor financeiro");
    }

    if (editingId) {
        // Modo Edição
        if (isClient) {
            updateClient({
                id: editingId,
                nome: formData.nome,
                cnpjCpf: formData.doc,
                regime: 'Simples Nacional', 
                honorarioMensal: Number(formData.valor),
                status: 'ATIVO',
                inadimplente: false
            });
        } else if (isEmployee) {
            updateEmployee({
                id: editingId,
                nome: formData.nome,
                cargo: formData.doc,
                salarioBase: Number(formData.valor),
                tipoContrato: 'CLT',
                status: 'ATIVO'
            });
        } else {
            updateSupplier({
                id: editingId,
                nome: formData.nome,
                cnpj: formData.doc,
                categoria: formData.valor, // Usamos campo valor para categoria no modal
                contato: formData.extra,
                status: 'ATIVO'
            });
        }
    } else {
        // Modo Criação
        const id = generateId();
        if (isClient) {
            addClient({
                id, nome: formData.nome, cnpjCpf: formData.doc,
                regime: 'Simples Nacional', honorarioMensal: Number(formData.valor),
                status: 'ATIVO', inadimplente: false
            });
        } else if (isEmployee) {
            addEmployee({
                id, nome: formData.nome, cargo: formData.doc,
                salarioBase: Number(formData.valor), tipoContrato: 'CLT',
                status: 'ATIVO'
            });
        } else {
            addSupplier({
                id, nome: formData.nome, cnpj: formData.doc,
                categoria: formData.valor, // Campo valor como Categoria
                contato: formData.extra,
                status: 'ATIVO'
            });
        }
    }
    
    setIsModalOpen(false);
    setFormData({ nome: '', doc: '', valor: '', extra: '' });
    setEditingId(null);
  };

  // Definição dinâmica das colunas
  const colDoc = isClient ? 'Documento' : (isEmployee ? 'Cargo' : 'Documento');
  const colVal = isClient ? 'Honorário' : (isEmployee ? 'Salário' : 'Categoria / Contato');

  return (
    <div className="space-y-6">
       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            {isClient ? 'Clientes' : (isEmployee ? 'Funcionários' : 'Fornecedores')}
          </h1>
          <p className="text-slate-500 text-sm mt-1">Gestão de cadastros e registros do sistema.</p>
        </div>
        <Button onClick={openNewModal} className="font-bold shadow-lg shadow-primary/20 print:hidden">
          <Plus className="mr-2 h-4 w-4" /> Novo {getLabel()}
        </Button>
      </div>

      <div className="flex items-center gap-2 print:hidden">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Buscar por nome..." 
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
                  <th className="p-4 font-bold text-slate-500 uppercase text-[10px] tracking-widest">Nome / Registro</th>
                  <th className="p-4 font-bold text-slate-500 uppercase text-[10px] tracking-widest">{colDoc}</th>
                  <th className="p-4 font-bold text-slate-500 uppercase text-[10px] tracking-widest">{colVal}</th>
                  <th className="p-4 font-bold text-slate-500 uppercase text-[10px] tracking-widest">Status</th>
                  <th className="p-4 font-bold text-slate-500 uppercase text-[10px] tracking-widest text-right print:hidden">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item: any) => (
                  <tr key={item.id} className="border-b-2 border-slate-50 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary border-2 border-primary/10 print:hidden">
                            {isClient && <Building className="h-5 w-5" />}
                            {isEmployee && <User className="h-5 w-5" />}
                            {isSupplier && <Truck className="h-5 w-5" />}
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white">{item.nome}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-500 font-medium">
                        {isClient ? item.cnpjCpf : (isEmployee ? item.cargo : item.cnpj)}
                    </td>
                    <td className="p-4">
                        {isSupplier ? (
                            <div>
                                <div className="font-bold text-slate-800 dark:text-slate-200">{item.categoria}</div>
                                <div className="text-[10px] text-slate-500 uppercase">{item.contato}</div>
                            </div>
                        ) : (
                            <span className="font-black text-slate-900 dark:text-white">
                                {formatCurrency(isClient ? item.honorarioMensal : item.salarioBase)}
                            </span>
                        )}
                    </td>
                    <td className="p-4">
                        <Badge variant={item.status === 'ATIVO' ? 'success' : 'secondary'}>{item.status}</Badge>
                    </td>
                    <td className="p-4 text-right flex justify-end gap-2 print:hidden">
                      <Button size="sm" variant="ghost" className="text-slate-400 hover:text-primary" onClick={() => openEditModal(item)}>
                        <Edit className="h-4 w-4" />
                      </Button>
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`${editingId ? 'Editar' : 'Novo'} ${getLabel()}`}>
        <div className="space-y-5 py-4">
            <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Nome do {getLabel()}</label>
                <Input value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} placeholder="Nome completo ou Razão Social..." />
            </div>
            
            <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-500 tracking-widest">
                    {isClient ? 'CNPJ / CPF' : (isEmployee ? 'Cargo / Função' : 'CNPJ / Documento')}
                </label>
                <Input value={formData.doc} onChange={e => setFormData({...formData, doc: e.target.value})} placeholder={isEmployee ? "Analista..." : "00.000.000/0000-00"} />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-500 tracking-widest">
                    {isClient ? 'Valor Honorário (R$)' : (isEmployee ? 'Salário Base (R$)' : 'Categoria Principal')}
                </label>
                {isSupplier ? (
                     <Input value={formData.valor} onChange={e => setFormData({...formData, valor: e.target.value})} placeholder="Ex: Material de Escritório, Software..." />
                ) : (
                     <Input type="number" value={formData.valor} onChange={e => setFormData({...formData, valor: e.target.value})} placeholder="0.00" />
                )}
            </div>
            
            {isSupplier && (
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Contato / Email</label>
                    <Input value={formData.extra} onChange={e => setFormData({...formData, extra: e.target.value})} placeholder="contato@fornecedor.com" />
                </div>
            )}

            <div className="flex justify-end gap-3 pt-6">
                <Button variant="outline" className="border-2 font-bold" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                <Button onClick={handleSave} className="font-bold shadow-lg shadow-primary/20">
                    {editingId ? 'Salvar Alterações' : 'Confirmar Cadastro'}
                </Button>
            </div>
        </div>
      </Modal>
    </div>
  );
};
