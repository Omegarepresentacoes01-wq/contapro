
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Client, Employee, Receivable, Payable, Payroll } from '../types';
import { mockClients, mockEmployees, mockReceivables, mockPayables, mockPayroll } from '../services/mocks';

interface DataContextType {
  clients: Client[];
  employees: Employee[];
  receivables: Receivable[];
  payables: Payable[];
  payroll: Payroll[];
  addClient: (client: Client) => void;
  updateClient: (client: Client) => void;
  removeClient: (id: string) => void;
  addEmployee: (emp: Employee) => void;
  removeEmployee: (id: string) => void;
  addReceivable: (rec: Receivable) => void;
  removeReceivable: (id: string) => void;
  addPayable: (pay: Payable) => void;
  removePayable: (id: string) => void;
  markAsPaid: (type: 'rec' | 'pay', id: string) => void;
  closePayroll: () => void;
  updatePayrollEntry: (entry: Payroll) => void;
}

const DataContext = createContext<DataContextType>(null!);

export const DataProvider = ({ children }: { children?: React.ReactNode }) => {
  const loadData = (key: string, defaultValue: any) => {
    try {
      const saved = localStorage.getItem(`contapro_${key}`);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  };

  const [clients, setClients] = useState<Client[]>(() => loadData('clients', mockClients));
  const [employees, setEmployees] = useState<Employee[]>(() => loadData('employees', mockEmployees));
  const [receivables, setReceivables] = useState<Receivable[]>(() => loadData('receivables', mockReceivables));
  const [payables, setPayables] = useState<Payable[]>(() => loadData('payables', mockPayables));
  const [payroll, setPayroll] = useState<Payroll[]>(() => loadData('payroll', mockPayroll));

  useEffect(() => {
    localStorage.setItem('contapro_clients', JSON.stringify(clients));
    localStorage.setItem('contapro_employees', JSON.stringify(employees));
    localStorage.setItem('contapro_receivables', JSON.stringify(receivables));
    localStorage.setItem('contapro_payables', JSON.stringify(payables));
    localStorage.setItem('contapro_payroll', JSON.stringify(payroll));
  }, [clients, employees, receivables, payables, payroll]);

  const addClient = (client: Client) => setClients(prev => [client, ...prev]);
  const updateClient = (client: Client) => setClients(prev => prev.map(c => c.id === client.id ? client : c));
  const removeClient = (id: string) => setClients(prev => prev.filter(c => c.id !== id));

  const addEmployee = (emp: Employee) => {
    setEmployees(prev => [emp, ...prev]);
    // Gera automaticamente uma entrada na folha para o novo funcionário
    const newPayroll: Payroll = {
        id: Math.random().toString(36).substr(2, 9),
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
  
  const removeEmployee = (id: string) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
    setPayroll(prev => prev.filter(p => p.employeeId !== id));
  };
  
  const addReceivable = (rec: Receivable) => setReceivables(prev => [rec, ...prev]);
  const removeReceivable = (id: string) => setReceivables(prev => prev.filter(r => r.id !== id));
  
  const addPayable = (pay: Payable) => setPayables(prev => [pay, ...prev]);
  const removePayable = (id: string) => setPayables(prev => prev.filter(p => p.id !== id));

  const markAsPaid = (type: 'rec' | 'pay', id: string) => {
    if (type === 'rec') {
      setReceivables(prev => prev.map(r => r.id === id ? { ...r, status: 'PAGO', pagoEm: new Date().toISOString().split('T')[0] } : r));
    } else {
      setPayables(prev => prev.map(p => p.id === id ? { ...p, status: 'PAGO', pagoEm: new Date().toISOString().split('T')[0] } : p));
    }
  };

  const closePayroll = () => setPayroll(prev => prev.map(p => ({ ...p, status: 'FECHADA' })));
  const updatePayrollEntry = (entry: Payroll) => setPayroll(prev => prev.map(p => p.id === entry.id ? entry : p));

  return (
    <DataContext.Provider value={{ 
      clients, employees, receivables, payables, payroll,
      addClient, updateClient, removeClient, addEmployee, removeEmployee,
      addReceivable, removeReceivable, addPayable, removePayable, markAsPaid, closePayroll,
      updatePayrollEntry
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
