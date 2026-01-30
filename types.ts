
export type Status = 'PENDENTE' | 'PAGO' | 'ATRASADO' | 'PARCIAL' | 'ABERTA' | 'FECHADA' | 'ATIVO' | 'INATIVO';

export interface Client {
  id: string;
  nome: string;
  cnpjCpf: string;
  regime: 'Simples Nacional' | 'Lucro Presumido' | 'Lucro Real';
  honorarioMensal: number;
  status: 'ATIVO' | 'INATIVO';
  inadimplente: boolean;
}

export interface Employee {
  id: string;
  nome: string;
  cargo: string;
  salarioBase: number;
  tipoContrato: 'CLT' | 'PJ' | 'Estágio';
  status: 'ATIVO' | 'INATIVO';
}

export interface Supplier {
  id: string;
  nome: string;
  cnpj: string;
  categoria: string;
  contato: string;
  status: 'ATIVO' | 'INATIVO';
}

export interface Bank {
  id: string;
  nome: string;
  agencia: string;
  conta: string;
  saldo: number;
  status: 'ATIVO' | 'INATIVO';
}

export interface Receivable {
  id: string;
  clientId: string;
  clientName: string;
  competencia: string;
  vencimento: string;
  valor: number;
  status: 'PENDENTE' | 'PAGO' | 'ATRASADO' | 'PARCIAL';
  formaPagamento: string; // Mantido para compatibilidade, mas usaremos tipoDocumento na UI
  // Novos campos operacionais
  banco?: string;
  tipoDocumento?: 'Boleto' | 'Débito Automático' | 'Pix';
  categoria?: string;
  descricao?: string;
  parcelas?: number;
  pagoEm?: string;
}

export interface Payable {
  id: string;
  fornecedor: string;
  categoria: string;
  centroCustoId: string;
  centroCustoName: string;
  vencimento: string;
  valor: number;
  status: 'PENDENTE' | 'PAGO' | 'ATRASADO';
  // Novos campos operacionais
  banco?: string;
  tipoDocumento?: 'Boleto' | 'Débito Automático' | 'Pix';
  descricao?: string;
  parcelas?: number;
  pagoEm?: string;
}

export interface Payroll {
  id: string;
  employeeId: string;
  employeeName: string;
  competencia: string;
  salarioBase: number;
  beneficios: number;
  descontos: number;
  comissao: number;
  total: number;
  status: 'ABERTA' | 'FECHADA' | 'PAGO';
}

export interface CostCenter {
  id: string;
  nome: string;
}

export interface KPIData {
  label: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  icon: any;
}
