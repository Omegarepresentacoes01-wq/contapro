
// Utilitário para download de arquivos de texto/csv
export const downloadFile = (content: string, filename: string, mimeType: string) => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Conversor de JSON para CSV
export const convertToCSV = (data: any[]) => {
  if (data.length === 0) return '';
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(obj => 
    Object.values(obj).map(val => 
      typeof val === 'string' ? `"${val}"` : val
    ).join(',')
  );
  return [headers, ...rows].join('\n');
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
