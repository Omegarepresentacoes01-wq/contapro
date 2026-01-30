
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Client, Employee, Supplier, Bank, Receivable, Payable, Payroll } from '../types';
import { mockClients, mockEmployees, mockSuppliers, mockBanks, mockReceivables, mockPayables, mockPayroll, safeLocalStorage, generateId } from '../services/mocks';

interface DataContextType {
  clients: Client[];
  employees: Employee[];
  suppliers: Supplier[];
  receivables: Receivable[];
  payables: Payable[];
  payroll: Payroll[];
  banks: Bank[];
  addClient: (client: Client) => void;
  updateClient: (client: Client) => void;
  removeClient: (id: string) => void;
  addEmployee: (emp: Employee) => void;
  updateEmployee: (emp: Employee) => void;
  removeEmployee: (id: string) => void;
  addSupplier: (sup: Supplier) => void;
  updateSupplier: (sup: Supplier) => void;
  removeSupplier: (id: string) => void;
  addReceivable: (rec: Receivable) => void;
  removeReceivable: (id: string) => void;
  addPayable: (pay: Payable) => void;
  removePayable: (id: string) => void;
  markAsPaid: (type: 'rec' | 'pay', id: string) => void;
  closePayroll: () => void;
  updatePayrollEntry: (entry: Payroll) => void;
  addBank: (bank: Bank) => void;
  updateBank: (bank: Bank) => void;
  removeBank: (id: string) => void;
}

const DataContext = createContext<DataContextType>(null!);

export const DataProvider = ({ children }: { children?: React.ReactNode }) => {
  // Inicializa com mocks padrão para garantir consistência entre SSR e primeiro render
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [receivables, setReceivables] = useState<Receivable[]>(mockReceivables);
  const [payables, setPayables] = useState<Payable[]>(mockPayables);
  const [payroll, setPayroll] = useState<Payroll[]>(mockPayroll);
  const [banks, setBanks] = useState<Bank[]>(mockBanks);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carrega dados do LocalStorage apenas no cliente
  useEffect(() => {
    const loadData = (key: string, currentData: any) => {
      const saved = safeLocalStorage.getItem(`contapro_${key}`);
      return saved ? JSON.parse(saved) : currentData;
    };

    setClients(loadData('clients', mockClients));
    setEmployees(loadData('employees', mockEmployees));
    setSuppliers(loadData('suppliers', mockSuppliers));
    setReceivables(loadData('receivables', mockReceivables));
    setPayables(loadData('payables', mockPayables));
    setPayroll(loadData('payroll', mockPayroll));
    setBanks(loadData('banks', mockBanks));
    setIsLoaded(true);
  }, []);

  // Salva alterações no localStorage
  useEffect(() => {
    if (isLoaded) {
      safeLocalStorage.setItem('contapro_clients', JSON.stringify(clients));
      safeLocalStorage.setItem('contapro_employees', JSON.stringify(employees));
      safeLocalStorage.setItem('contapro_suppliers', JSON.stringify(suppliers));
      safeLocalStorage.setItem('contapro_receivables', JSON.stringify(receivables));
      safeLocalStorage.setItem('contapro_payables', JSON.stringify(payables));
      safeLocalStorage.setItem('contapro_payroll', JSON.stringify(payroll));
      safeLocalStorage.setItem('contapro_banks', JSON.stringify(banks));
    }
  }, [clients, employees, suppliers, receivables, payables, payroll, banks, isLoaded]);

  const addClient = (client: Client) => setClients(prev => [client, ...prev]);
  const updateClient = (client: Client) => setClients(prev => prev.map(c => c.id === client.id ? client : c));
  const removeClient = (id: string) => setClients(prev => prev.filter(c => c.id !== id));

  const addEmployee = (emp: Employee) => {
    setEmployees(prev => [emp, ...prev]);
    // Gera automaticamente uma entrada na folha para o novo funcionário
    const newPayroll: Payroll = {
        id: generateId(),
        employeeId: emp.id,
        employeeName: emp.nome,
        competencia: new Date().toISOString().slice(0, 7),
        salarioBase: emp.salarioBase,
        beneficios: 0,
        descontos: 0,
        comissao: 0,
        total: emp.salarioBase,
        status: 'ABERTA'
    };
    setPayroll(prev => [newPayroll, ...prev]);
  };

  const updateEmployee = (emp: Employee) => {
    setEmployees(prev => prev.map(e => e.id === emp.id ? emp : e));
    // Atualiza entradas da folha em aberto se houver mudança de salário ou nome
    setPayroll(prev => prev.map(p => {
        if (p.employeeId === emp.id && p.status === 'ABERTA') {
            return {
                ...p,
                employeeName: emp.nome,
                salarioBase: emp.salarioBase,
                total: emp.salarioBase + p.beneficios + p.comissao - p.descontos
            };
        }
        return p;
    }));
  };
  
  const removeEmployee = (id: string) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
    setPayroll(prev => prev.filter(p => p.employeeId !== id));
  };

  const addSupplier = (sup: Supplier) => setSuppliers(prev => [sup, ...prev]);
  const updateSupplier = (sup: Supplier) => setSuppliers(prev => prev.map(s => s.id === sup.id ? sup : s));
  const removeSupplier = (id: string) => setSuppliers(prev => prev.filter(s => s.id !== id));
  
  const addReceivable = (rec: Receivable) => setReceivables(prev => [rec, ...prev]);
  const removeReceivable = (id: string) => setReceivables(prev => prev.filter(r => r.id !== id));
  
  const addPayable = (pay: Payable) => setPayables(prev => [pay, ...prev]);
  const removePayable = (id: string) => setPayables(prev => prev.filter(p => p.id !== id));

  // Funções de Bancos
  const addBank = (bank: Bank) => setBanks(prev => [...prev, bank]);
  const updateBank = (bank: Bank) => setBanks(prev => prev.map(b => b.id === bank.id ? bank : b));
  const removeBank = (id: string) => setBanks(prev => prev.filter(b => b.id !== id));

  const updateBankBalance = (bankName: string, amount: number, type: 'credit' | 'debit') => {
    if (!bankName) return;
    setBanks(prev => prev.map(b => {
      if (b.nome === bankName) {
        const newBalance = type === 'credit' ? b.saldo + amount : b.saldo - amount;
        return { ...b, saldo: newBalance };
      }
      return b;
    }));
  };

  const markAsPaid = (type: 'rec' | 'pay', id: string) => {
    if (type === 'rec') {
      // Recebimento -> Crédito no Banco
      setReceivables(prev => prev.map(r => {
        if (r.id === id && r.status !== 'PAGO') {
          // Atualiza saldo se o status não era PAGO
          if (r.banco) updateBankBalance(r.banco, r.valor, 'credit');
          return { ...r, status: 'PAGO', pagoEm: new Date().toISOString().split('T')[0] };
        }
        return r;
      }));
    } else {
      // Pagamento -> Débito no Banco
      setPayables(prev => prev.map(p => {
        if (p.id === id && p.status !== 'PAGO') {
          // Atualiza saldo se o status não era PAGO
          if (p.banco) updateBankBalance(p.banco, p.valor, 'debit');
          return { ...p, status: 'PAGO', pagoEm: new Date().toISOString().split('T')[0] };
        }
        return p;
      }));
    }
  };

  const closePayroll = () => setPayroll(prev => prev.map(p => ({ ...p, status: 'FECHADA' })));
  const updatePayrollEntry = (entry: Payroll) => setPayroll(prev => prev.map(p => p.id === entry.id ? entry : p));

  return (
    <DataContext.Provider value={{ 
      clients, employees, suppliers, receivables, payables, payroll, banks,
      addClient, updateClient, removeClient, addEmployee, updateEmployee, removeEmployee, addSupplier, updateSupplier, removeSupplier,
      addReceivable, removeReceivable, addPayable, removePayable, markAsPaid, closePayroll,
      updatePayrollEntry, addBank, updateBank, removeBank
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
