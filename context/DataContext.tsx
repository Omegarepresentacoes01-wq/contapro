
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Client, Employee, Receivable, Payable, Payroll } from '../types';
import { mockClients, mockEmployees, mockReceivables, mockPayables, mockPayroll, safeLocalStorage, generateId } from '../services/mocks';

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
  // Inicializa com mocks padrão para garantir consistência entre SSR e primeiro render
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [receivables, setReceivables] = useState<Receivable[]>(mockReceivables);
  const [payables, setPayables] = useState<Payable[]>(mockPayables);
  const [payroll, setPayroll] = useState<Payroll[]>(mockPayroll);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carrega dados do LocalStorage apenas no cliente
  useEffect(() => {
    const loadData = (key: string, currentData: any) => {
      const saved = safeLocalStorage.getItem(`contapro_${key}`);
      return saved ? JSON.parse(saved) : currentData;
    };

    setClients(loadData('clients', mockClients));
    setEmployees(loadData('employees', mockEmployees));
    setReceivables(loadData('receivables', mockReceivables));
    setPayables(loadData('payables', mockPayables));
    setPayroll(loadData('payroll', mockPayroll));
    setIsLoaded(true);
  }, []);

  // Salva alterações no localStorage
  useEffect(() => {
    if (isLoaded) {
      safeLocalStorage.setItem('contapro_clients', JSON.stringify(clients));
      safeLocalStorage.setItem('contapro_employees', JSON.stringify(employees));
      safeLocalStorage.setItem('contapro_receivables', JSON.stringify(receivables));
      safeLocalStorage.setItem('contapro_payables', JSON.stringify(payables));
      safeLocalStorage.setItem('contapro_payroll', JSON.stringify(payroll));
    }
  }, [clients, employees, receivables, payables, payroll, isLoaded]);

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
