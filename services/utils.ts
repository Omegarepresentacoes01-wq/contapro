
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

// Gerador Simulado de CNAB 240 (Exemplo básico)
export const generateCNABMock = (companyName: string, payments: any[]) => {
    const date = new Date().toISOString().slice(0,10).replace(/-/g,'');
    let content = `00100000         2${companyName.padEnd(30, ' ')}001${date}\n`; // Header
    payments.forEach((p, index) => {
        content += `1${index.toString().padStart(5, '0')}${p.employeeName.padEnd(30, ' ')}${p.total.toFixed(2).replace('.', '').padStart(15, '0')}\n`;
    });
    content += `9${payments.length.toString().padStart(5, '0')}`; // Trailer
    return content;
};
