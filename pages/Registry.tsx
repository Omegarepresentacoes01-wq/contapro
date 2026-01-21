
import React, { useState } from 'react';
import { Card, CardContent, Button, Input, Badge, Modal } from '../components/ui';
import { Search, Plus, User, Building, Trash2, Edit } from 'lucide-react';
import { formatCurrency, generateId } from '../services/mocks';
import { useData } from '../context/DataContext';

interface RegistryProps {
  type: 'clients' | 'employees';
}

export const Registry = ({ type }: RegistryProps) => {
  const isClient = type === 'clients';
  const { 
    clients, 
    employees, 
    addClient, 
    addEmployee, 
    removeClient, 
    removeEmployee,
    updateClient,
    updateEmployee
  } = useData();
  
  const data = isClient ? clients : employees;

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Estado para controle de edição
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ nome: '', doc: '', valor: '' });

  const filteredData = data.filter((item: any) => 
    item.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Garante a confirmação de exclusão
  const handleDelete = (id: string) => {
    if (window.confirm(`ATENÇÃO: Deseja realmente excluir este ${isClient ? 'cliente' : 'funcionário'} do sistema?`)) {
      if (isClient) removeClient(id);
      else removeEmployee(id);
    }
  };

  const openNewModal = () => {
    setEditingId(null);
    setFormData({ nome: '', doc: '', valor: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingId(item.id);
    setFormData({
        nome: item.nome,
        doc: isClient ? item.cnpjCpf : item.cargo,
        valor: isClient ? item.honorarioMensal.toString() : item.salarioBase.toString()
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.nome || !formData.valor) return alert("Preencha os campos obrigatórios");
    
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
        } else {
            updateEmployee({
                id: editingId,
                nome: formData.nome,
                cargo: formData.doc,
                salarioBase: Number(formData.valor),
                tipoContrato: 'CLT',
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
        } else {
            addEmployee({
                id, nome: formData.nome, cargo: formData.doc,
                salarioBase: Number(formData.valor), tipoContrato: 'CLT',
                status: 'ATIVO'
            });
        }
    }
    
    setIsModalOpen(false);
    setFormData({ nome: '', doc: '', valor: '' });
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            {isClient ? 'Clientes' : 'Funcionários'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">Gestão de cadastros e registros do sistema.</p>
        </div>
        <Button onClick={openNewModal} className="font-bold shadow-lg shadow-primary/20 print:hidden">
          <Plus className="mr-2 h-4 w-4" /> Novo {isClient ? 'Cliente' : 'Funcionário'}
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
                  <th className="p-4 font-bold text-slate-500 uppercase text-[10px] tracking-widest">{isClient ? 'Documento' : 'Cargo'}</th>
                  <th className="p-4 font-bold text-slate-500 uppercase text-[10px] tracking-widest">{isClient ? 'Honorário' : 'Salário'}</th>
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
                            {isClient ? <Building className="h-5 w-5" /> : <User className="h-5 w-5" />}
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white">{item.nome}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-500 font-medium">{isClient ? item.cnpjCpf : item.cargo}</td>
                    <td className="p-4 font-black text-slate-900 dark:text-white">{formatCurrency(isClient ? item.honorarioMensal : item.salarioBase)}</td>
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`${editingId ? 'Editar' : 'Novo'} ${isClient ? 'Cliente' : 'Funcionário'}`}>
        <div className="space-y-5 py-4">
            <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Nome Completo</label>
                <Input value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} placeholder="Nome completo..." />
            </div>
            <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-500 tracking-widest">{isClient ? 'CNPJ / CPF' : 'Cargo / Função'}</label>
                <Input value={formData.doc} onChange={e => setFormData({...formData, doc: e.target.value})} placeholder={isClient ? "00.000.000/0001-00" : "Analista..."} />
            </div>
            <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-500 tracking-widest">{isClient ? 'Valor Honorário (R$)' : 'Salário Base (R$)'}</label>
                <Input type="number" value={formData.valor} onChange={e => setFormData({...formData, valor: e.target.value})} placeholder="0.00" />
            </div>
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
