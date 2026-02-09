
// Utilitário para download de arquivos de texto/csv
export const downloadFile = (content: string, filename: string, mimeType: string) => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  
  // Adicionar BOM UTF-8 para garantir encoding correto no Excel
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + content], { type: mimeType + ';charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Conversor de JSON para CSV com tratamento correto de caracteres especiais
export const convertToCSV = (data: any[]) => {
  if (data.length === 0) return '';
  
  // Extrair headers
  const headers = Object.keys(data[0]);
  
  // Função para escapar valores CSV corretamente
  const escapeCSVValue = (value: any): string => {
    if (value === null || value === undefined) return '';
    
    const stringValue = String(value);
    
    // Se contém vírgula, aspas, quebra de linha ou ponto e vírgula, precisa ser escapado
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n') || stringValue.includes(';')) {
      // Duplicar aspas internas e envolver em aspas
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    
    return stringValue;
  };
  
  // Criar linha de cabeçalho
  const headerLine = headers.map(escapeCSVValue).join(',');
  
  // Criar linhas de dados
  const dataLines = data.map(row => 
    headers.map(header => escapeCSVValue(row[header])).join(',')
  );
  
  // Juntar tudo com quebras de linha
  return [headerLine, ...dataLines].join('\r\n');
};

// Gerador de CNAB 240 - Padrão FEBRABAN para Pagamento de Salários
export const generateCNAB240 = (companyName: string, payments: any[]) => {
  const now = new Date();
  const date = now.toISOString().slice(0,10).replace(/-/g,'');
  const time = now.toTimeString().slice(0,8).replace(/:/g,'');
  const sequencial = '000001';
  
  // Função auxiliar para preencher com espaços à direita
  const padRight = (str: string, len: number) => str.padEnd(len, ' ').slice(0, len);
  
  // Função auxiliar para preencher com zeros à esquerda
  const padLeft = (str: string, len: number) => str.padStart(len, '0').slice(0, len);
  
  let lines: string[] = [];
  
  // ===== HEADER DO ARQUIVO (Registro 0) =====
  let headerArquivo = '';
  headerArquivo += '001';                           // Código do Banco (001 = Banco do Brasil)
  headerArquivo += '0000';                          // Lote de Serviço (0000 = Header de Arquivo)
  headerArquivo += '0';                             // Tipo de Registro (0 = Header)
  headerArquivo += ' '.repeat(9);                   // Uso Exclusivo FEBRABAN/CNAB
  headerArquivo += '2';                             // Tipo de Inscrição (2 = CNPJ)
  headerArquivo += padLeft('12345678000199', 14);   // CNPJ da Empresa
  headerArquivo += ' '.repeat(20);                  // Código do Convênio no Banco
  headerArquivo += '00000';                         // Agência Mantenedora da Conta
  headerArquivo += ' ';                             // Dígito Verificador da Agência
  headerArquivo += padLeft('123456', 12);           // Número da Conta Corrente
  headerArquivo += '0';                             // Dígito Verificador da Conta
  headerArquivo += ' ';                             // Dígito Verificador da Ag/Conta
  headerArquivo += padRight(companyName, 30);       // Nome da Empresa
  headerArquivo += padRight('BANCO DO BRASIL S.A.', 30); // Nome do Banco
  headerArquivo += ' '.repeat(10);                  // Uso Exclusivo FEBRABAN/CNAB
  headerArquivo += '1';                             // Código de Remessa (1 = Remessa)
  headerArquivo += date;                            // Data de Geração do Arquivo
  headerArquivo += time;                            // Hora de Geração do Arquivo
  headerArquivo += padLeft(sequencial, 6);          // Número Seqüencial do Arquivo
  headerArquivo += '103';                           // Versão do Layout (103 = CNAB 240)
  headerArquivo += '00000';                         // Densidade de Gravação
  headerArquivo += ' '.repeat(20);                  // Uso Reservado do Banco
  headerArquivo += ' '.repeat(20);                  // Uso Reservado da Empresa
  headerArquivo += ' '.repeat(29);                  // Uso Exclusivo FEBRABAN/CNAB
  lines.push(headerArquivo);
  
  // ===== HEADER DO LOTE (Registro 1) =====
  let headerLote = '';
  headerLote += '001';                              // Código do Banco
  headerLote += '0001';                             // Lote de Serviço (0001 = Primeiro Lote)
  headerLote += '1';                                // Tipo de Registro (1 = Header de Lote)
  headerLote += 'C';                                // Tipo de Operação (C = Lançamento a Crédito)
  headerLote += '30';                               // Tipo de Serviço (30 = Pagamento de Salários)
  headerLote += '01';                               // Forma de Lançamento (01 = Crédito em Conta Corrente)
  headerLote += '045';                              // Versão do Layout do Lote
  headerLote += ' ';                                // Uso Exclusivo FEBRABAN/CNAB
  headerLote += '2';                                // Tipo de Inscrição da Empresa
  headerLote += padLeft('12345678000199', 14);      // CNPJ da Empresa
  headerLote += ' '.repeat(20);                     // Código do Convênio no Banco
  headerLote += '00000';                            // Agência Mantenedora da Conta
  headerLote += ' ';                                // Dígito Verificador da Agência
  headerLote += padLeft('123456', 12);              // Número da Conta Corrente
  headerLote += '0';                                // Dígito Verificador da Conta
  headerLote += ' ';                                // Dígito Verificador da Ag/Conta
  headerLote += padRight(companyName, 30);          // Nome da Empresa
  headerLote += ' '.repeat(40);                     // Mensagem 1
  headerLote += ' '.repeat(40);                     // Mensagem 2
  headerLote += padLeft('1', 8);                    // Número Remessa/Retorno
  headerLote += date;                               // Data de Gravação Remessa/Retorno
  headerLote += '00000000';                         // Data do Crédito
  headerLote += ' '.repeat(33);                     // Uso Exclusivo FEBRABAN/CNAB
  lines.push(headerLote);
  
  // ===== REGISTROS DE DETALHE (Segmento A) =====
  payments.forEach((payment, index) => {
    const sequencialRegistro = index + 1;
    
    let detalheA = '';
    detalheA += '001';                              // Código do Banco
    detalheA += '0001';                             // Lote de Serviço
    detalheA += '3';                                // Tipo de Registro (3 = Detalhe)
    detalheA += padLeft(String(sequencialRegistro), 5); // Número Seqüencial do Registro
    detalheA += 'A';                                // Código do Segmento (A = Pagamento)
    detalheA += '0';                                // Tipo de Movimento (0 = Inclusão)
    detalheA += '00';                               // Código de Instrução
    detalheA += '001';                              // Código do Banco Favorecido
    detalheA += padLeft('00000', 5);                // Agência do Favorecido
    detalheA += ' ';                                // Dígito Verificador da Agência
    detalheA += padLeft('000000', 12);              // Conta do Favorecido
    detalheA += '0';                                // Dígito Verificador da Conta
    detalheA += ' ';                                // Dígito Verificador da Ag/Conta
    detalheA += padRight(payment.employeeName || 'FUNCIONARIO', 30); // Nome do Favorecido
    detalheA += padRight('', 20);                   // Número do Documento Atribuído pela Empresa
    detalheA += date;                               // Data do Pagamento
    detalheA += 'REA';                              // Tipo da Moeda (REA = Real)
    detalheA += padLeft('0', 15);                   // Quantidade da Moeda
    detalheA += padLeft(String(Math.round(payment.total * 100)), 15); // Valor do Pagamento (em centavos)
    detalheA += padRight('', 20);                   // Número do Documento Atribuído pelo Banco
    detalheA += '00000000';                         // Data Real da Efetivação do Pagamento
    detalheA += padLeft('0', 15);                   // Valor Real da Efetivação do Pagamento
    detalheA += ' '.repeat(40);                     // Informações Complementares
    detalheA += ' '.repeat(2);                      // Uso Exclusivo FEBRABAN/CNAB
    detalheA += '00';                               // Código de Ocorrências
    lines.push(detalheA);
  });
  
  // ===== TRAILER DO LOTE (Registro 5) =====
  const totalValor = payments.reduce((sum, p) => sum + (p.total || 0), 0);
  const qtdRegistros = payments.length + 2; // +2 para header e trailer do lote
  
  let trailerLote = '';
  trailerLote += '001';                             // Código do Banco
  trailerLote += '0001';                            // Lote de Serviço
  trailerLote += '5';                               // Tipo de Registro (5 = Trailer de Lote)
  trailerLote += ' '.repeat(9);                     // Uso Exclusivo FEBRABAN/CNAB
  trailerLote += padLeft(String(qtdRegistros), 6);  // Quantidade de Registros do Lote
  trailerLote += padLeft(String(payments.length), 6); // Quantidade de Registros de Detalhe
  trailerLote += padLeft(String(Math.round(totalValor * 100)), 18); // Valor Total do Lote (em centavos)
  trailerLote += padLeft('0', 18);                  // Quantidade de Moeda
  trailerLote += ' '.repeat(171);                   // Uso Exclusivo FEBRABAN/CNAB
  lines.push(trailerLote);
  
  // ===== TRAILER DO ARQUIVO (Registro 9) =====
  const qtdLotes = 1;
  const qtdRegistrosArquivo = lines.length + 1; // +1 para o próprio trailer
  
  let trailerArquivo = '';
  trailerArquivo += '001';                          // Código do Banco
  trailerArquivo += '9999';                         // Lote de Serviço (9999 = Trailer de Arquivo)
  trailerArquivo += '9';                            // Tipo de Registro (9 = Trailer)
  trailerArquivo += ' '.repeat(9);                  // Uso Exclusivo FEBRABAN/CNAB
  trailerArquivo += padLeft(String(qtdLotes), 6);   // Quantidade de Lotes do Arquivo
  trailerArquivo += padLeft(String(qtdRegistrosArquivo), 6); // Quantidade de Registros do Arquivo
  trailerArquivo += ' '.repeat(211);                // Uso Exclusivo FEBRABAN/CNAB
  lines.push(trailerArquivo);
  
  // Cada linha deve ter exatamente 240 caracteres
  return lines.map(line => line.padEnd(240, ' ')).join('\r\n');
};

// Manter compatibilidade com código antigo
export const generateCNABMock = generateCNAB240;
