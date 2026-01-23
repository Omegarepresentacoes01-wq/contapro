
import { Client, Employee, Receivable, Payable, Payroll, CostCenter } from '../types';

// --- Utilities ---

export const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  if (typeof window !== 'undefined') {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
  return 'server-' + Date.now().toString(36);
};

export const safeLocalStorage = {
  getItem: (key: string) => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  },
  setItem: (key: string, value: string) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, value);
      } catch (e) {
        console.error('Error saving to localStorage', e);
      }
    }
  },
  removeItem: (key: string) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.error('Error removing from localStorage', e);
      }
    }
  }
};

// --- Mocks ---

export const mockCostCenters: CostCenter[] = [
  { id: '1', nome: 'Operacional' },
  { id: '2', nome: 'Administrativo' },
  { id: '3', nome: 'Marketing' },
  { id: '4', nome: 'TI' },
];

export const mockClients: Client[] = [
  { id: '1', nome: 'Tech Solutions LTDA', cnpjCpf: '12.345.678/0001-90', regime: 'Lucro Presumido', honorarioMensal: 2500, status: 'ATIVO', inadimplente: false },
  { id: '2', nome: 'Padaria do João', cnpjCpf: '98.765.432/0001-10', regime: 'Simples Nacional', honorarioMensal: 800, status: 'ATIVO', inadimplente: true },
  { id: '3', nome: 'Consultoria Aguiar', cnpjCpf: '11.222.333/0001-55', regime: 'Simples Nacional', honorarioMensal: 1200, status: 'ATIVO', inadimplente: false },
  { id: '4', nome: 'Construtora Global', cnpjCpf: '55.444.333/0001-22', regime: 'Lucro Real', honorarioMensal: 5000, status: 'INATIVO', inadimplente: false },
  { id: '5', nome: 'Agência Criativa', cnpjCpf: '33.222.111/0001-99', regime: 'Simples Nacional', honorarioMensal: 1500, status: 'ATIVO', inadimplente: false },
];

export const mockEmployees: Employee[] = [
  { id: '1', nome: 'Ana Silva', cargo: 'Contadora Senior', salarioBase: 6500, tipoContrato: 'CLT', status: 'ATIVO' },
  { id: '2', nome: 'Carlos Souza', cargo: 'Analista Fiscal', salarioBase: 3500, tipoContrato: 'CLT', status: 'ATIVO' },
  { id: '3', nome: 'Roberto Alves', cargo: 'Desenvolvedor', salarioBase: 8000, tipoContrato: 'PJ', status: 'ATIVO' },
  { id: '4', nome: 'Julia Lima', cargo: 'Assistente RH', salarioBase: 2200, tipoContrato: 'Estágio', status: 'ATIVO' },
];

export const mockReceivables: Receivable[] = [
  { 
    id: '1', clientId: '1', clientName: 'Tech Solutions LTDA', competencia: '2023-10', vencimento: '2023-10-15', valor: 2500, status: 'PAGO', 
    formaPagamento: 'Boleto', tipoDocumento: 'Boleto', banco: 'Sicoob', categoria: 'Prestação de Serviços', descricao: 'Mensalidade Outubro', parcelas: 1, pagoEm: '2023-10-14' 
  },
  { 
    id: '2', clientId: '2', clientName: 'Padaria do João', competencia: '2023-10', vencimento: '2023-10-15', valor: 800, status: 'ATRASADO', 
    formaPagamento: 'Pix', tipoDocumento: 'Pix', banco: 'Oteropay', categoria: 'Receita com Consultoria', descricao: 'Consultoria Fiscal', parcelas: 1 
  },
  { 
    id: '3', clientId: '3', clientName: 'Consultoria Aguiar', competencia: '2023-11', vencimento: '2023-11-15', valor: 1200, status: 'PENDENTE', 
    formaPagamento: 'Boleto', tipoDocumento: 'Boleto', banco: 'Sicoob', categoria: 'Prestação de Serviços', descricao: 'Mensalidade Novembro', parcelas: 1 
  },
  { 
    id: '4', clientId: '1', clientName: 'Tech Solutions LTDA', competencia: '2023-11', vencimento: '2023-11-15', valor: 2500, status: 'PENDENTE', 
    formaPagamento: 'Boleto', tipoDocumento: 'Boleto', banco: 'Sicoob', categoria: 'Prestação de Serviços', descricao: 'Mensalidade Novembro', parcelas: 1 
  },
  { 
    id: '5', clientId: '5', clientName: 'Agência Criativa', competencia: '2023-10', vencimento: '2023-10-20', valor: 1500, status: 'PAGO', 
    formaPagamento: 'Transferência', tipoDocumento: 'Débito Automático', banco: 'Oteropay', categoria: 'Receita de Trabalhos Extras', descricao: 'Projeto Especial', parcelas: 1, pagoEm: '2023-10-20' 
  },
];

export const mockPayables: Payable[] = [
  { 
    id: '1', fornecedor: 'AWS Services', categoria: 'Software', centroCustoId: '4', centroCustoName: 'TI', vencimento: '2023-11-10', valor: 850.50, status: 'PENDENTE',
    banco: 'Oteropay', tipoDocumento: 'Débito Automático', descricao: 'Servidor Nuvem', parcelas: 1
  },
  { 
    id: '2', fornecedor: 'Papelaria Central', categoria: 'Material de Expediente', centroCustoId: '2', centroCustoName: 'Administrativo', vencimento: '2023-10-25', valor: 230.00, status: 'PAGO', pagoEm: '2023-10-24',
    banco: 'Sicoob', tipoDocumento: 'Pix', descricao: 'Material Escritório', parcelas: 1
  },
  { 
    id: '3', fornecedor: 'Google Workspace', categoria: 'Software', centroCustoId: '4', centroCustoName: 'TI', vencimento: '2023-11-05', valor: 150.00, status: 'PENDENTE',
    banco: 'Oteropay', tipoDocumento: 'Débito Automático', descricao: 'Email Corporativo', parcelas: 1
  },
  { 
    id: '4', fornecedor: 'Aluguel Sala', categoria: 'Aluguel', centroCustoId: '2', centroCustoName: 'Administrativo', vencimento: '2023-11-01', valor: 3500.00, status: 'PENDENTE',
    banco: 'Sicoob', tipoDocumento: 'Boleto', descricao: 'Aluguel Sede', parcelas: 1
  },
];

export const mockPayroll: Payroll[] = [
  { id: '1', employeeId: '1', employeeName: 'Ana Silva', competencia: '2023-10', salarioBase: 6500, beneficios: 800, descontos: 1500, comissao: 0, total: 5800, status: 'FECHADA' },
  { id: '2', employeeId: '2', employeeName: 'Carlos Souza', competencia: '2023-10', salarioBase: 3500, beneficios: 600, descontos: 800, comissao: 200, total: 3500, status: 'FECHADA' },
  { id: '3', employeeId: '1', employeeName: 'Ana Silva', competencia: '2023-11', salarioBase: 6500, beneficios: 800, descontos: 0, comissao: 0, total: 7300, status: 'ABERTA' },
];

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatDate = (dateStr: string) => {
  if (!dateStr) return '-';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
};
