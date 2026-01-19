
import React, { useState, useMemo } from 'react';
import { Card, CardContent, Button, Badge, Modal, Input } from '../components/ui';
import { formatCurrency } from '../services/mocks';
import { Download, Lock, CheckCircle2, Edit3, User, ChevronRight, Save } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Payroll } from '../types';

export const PayrollPage = () => {
  const { payroll, closePayroll, updatePayrollEntry } = useData();
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Payroll | null>(null);

  const totalBruto = payroll.reduce((acc, cur) => acc + cur.salarioBase, 0);
  const totalDescontos = payroll.reduce((acc, cur) => acc + cur.descontos, 0);
  const totalLiquido = payroll.reduce((acc, cur) => acc + cur.total, 0);

  const isAllClosed = payroll.every(p => p.status === 'FECHADA');

  const handleExport = () => {
    alert("Gerando arquivo CNAB para o banco... Download iniciado.");
  };

  const handleEditEntry = (entry: Payroll) => {
    setEditingEntry({ ...entry });
  };

  const handleSaveEntry = () => {
    if (editingEntry) {
      const updatedTotal = Number(editingEntry.salarioBase) + 
                           Number(editingEntry.beneficios) + 
                           Number(editingEntry.comissao) - 
                           Number(editingEntry.descontos);
      
      updatePayrollEntry({
        ...editingEntry,
        total: updatedTotal
      });
      setEditingEntry(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Folha de Pagamento</h1>
          <p className="text-muted-foreground">Competência Atual: Novembro / 2023</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport}><Download className="mr-2 h-4 w-4" /> Exportar Bancário</Button>
            {!isAllClosed && (
                <Button variant="secondary" onClick={() => setIsListModalOpen(true)}>
                    <Edit3 className="mr-2 h-4 w-4" /> Gerenciar Lançamentos
                </Button>
            )}
            {!isAllClosed ? (
                <Button onClick={closePayroll}><Lock className="mr-2 h-4 w-4" /> Fechar Folha</Button>
            ) : (
                <Badge variant="success" className="h-10 px-4 text-sm gap-2">
                    <CheckCircle2 className="h-4 w-4" /> Folha Consolidada
                </Badge>
            )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
         <Card>
            <CardContent className="p-6">
                <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Total Bruto</div>
                <div className="text-2xl font-bold mt-1">{formatCurrency(totalBruto)}</div>
            </CardContent>
         </Card>
         <Card>
            <CardContent className="p-6">
                <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Total Retenções</div>
                <div className="text-2xl font-bold text-red-500 mt-1">{formatCurrency(totalDescontos)}</div>
            </CardContent>
         </Card>
         <Card>
            <CardContent className="p-6 bg-primary/5 border-primary/20">
                <div className="text-sm text-primary font-medium uppercase tracking-wider">Líquido a Pagar</div>
                <div className="text-2xl font-bold text-primary mt-1">{formatCurrency(totalLiquido)}</div>
            </CardContent>
         </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="w-full overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b">
                <tr className="text-left">
                  <th className="p-4 font-medium">Colaborador</th>
                  <th className="p-4 font-medium">Salário Base</th>
                  <th className="p-4 font-medium">Vantagens</th>
                  <th className="p-4 font-medium">Descontos</th>
                  <th className="p-4 font-medium">Comissão</th>
                  <th className="p-4 font-medium">Líquido</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Holerite</th>
                </tr>
              </thead>
              <tbody>
                {payroll.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="p-4 font-medium">{item.employeeName}</td>
                    <td className="p-4">{formatCurrency(item.salarioBase)}</td>
                    <td className="p-4 text-green-600">+{formatCurrency(item.beneficios)}</td>
                    <td className="p-4 text-red-500">-{formatCurrency(item.descontos)}</td>
                    <td className="p-4 text-primary font-medium">{formatCurrency(item.comissao)}</td>
                    <td className="p-4 font-bold">{formatCurrency(item.total)}</td>
                    <td className="p-4">
                      <Badge variant={item.status === 'FECHADA' ? 'secondary' : 'warning'}>{item.status}</Badge>
                    </td>
                    <td className="p-4 text-right">
                        <Button size="sm" variant="outline" onClick={() => alert(`Imprimindo holerite de ${item.employeeName}`)}>Ver PDF</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal Principal: Listagem de Funcionários para Edição */}
      <Modal isOpen={isListModalOpen} onClose={() => setIsListModalOpen(false)} title="Gerenciar Lançamentos da Folha">
        <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">Selecione um funcionário para ajustar os valores de salário, descontos ou incluir comissões.</p>
            <div className="divide-y rounded-md border">
                {payroll.map((item) => (
                    <button 
                        key={item.id} 
                        onClick={() => handleEditEntry(item)}
                        className="w-full flex items-center justify-between p-4 hover:bg-muted transition-colors text-left"
                    >
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <User className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="font-medium text-sm">{item.employeeName}</p>
                                <p className="text-xs text-muted-foreground">Atual: {formatCurrency(item.total)}</p>
                            </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </button>
                ))}
            </div>
            <div className="flex justify-end pt-4">
                <Button variant="outline" onClick={() => setIsListModalOpen(false)}>Fechar</Button>
            </div>
        </div>
      </Modal>

      {/* Sub-modal: Edição Individual */}
      <Modal isOpen={!!editingEntry} onClose={() => setEditingEntry(null)} title={`Ajustar Folha: ${editingEntry?.employeeName}`}>
        {editingEntry && (
            <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase text-muted-foreground">Salário Base (R$)</label>
                        <Input 
                            type="number" 
                            value={editingEntry.salarioBase} 
                            onChange={(e) => setEditingEntry({...editingEntry, salarioBase: Number(e.target.value)})}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase text-muted-foreground">Benefícios (R$)</label>
                        <Input 
                            type="number" 
                            value={editingEntry.beneficios} 
                            onChange={(e) => setEditingEntry({...editingEntry, beneficios: Number(e.target.value)})}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase text-muted-foreground">Descontos (R$)</label>
                        <Input 
                            type="number" 
                            value={editingEntry.descontos} 
                            onChange={(e) => setEditingEntry({...editingEntry, descontos: Number(e.target.value)})}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase text-primary">Comissão (R$)</label>
                        <Input 
                            type="number" 
                            className="border-primary/50 focus:ring-primary"
                            placeholder="Adicionar comissão..."
                            value={editingEntry.comissao} 
                            onChange={(e) => setEditingEntry({...editingEntry, comissao: Number(e.target.value)})}
                        />
                    </div>
                </div>

                <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/20 flex justify-between items-center">
                    <span className="text-sm font-medium">Novo Líquido Estimado:</span>
                    <span className="text-lg font-bold text-primary">
                        {formatCurrency(
                            editingEntry.salarioBase + 
                            editingEntry.beneficios + 
                            editingEntry.comissao - 
                            editingEntry.descontos
                        )}
                    </span>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setEditingEntry(null)}>Cancelar</Button>
                    <Button onClick={handleSaveEntry}>
                        <Save className="mr-2 h-4 w-4" /> Salvar Alterações
                    </Button>
                </div>
            </div>
        )}
      </Modal>
    </div>
  );
};
