# Manual de Uso do Sistema ContaPro

**Versão 1.0 | Fevereiro 2026**

---

## 1. Introdução

Bem-vindo ao **ContaPro**, o seu sistema de gestão financeira inteligente. Este manual foi criado para guiar você por todas as funcionalidades do sistema, desde o login até a geração de relatórios complexos.

### 1.1. Visão Geral

O ContaPro foi desenhado para simplificar a gestão financeira de escritórios de contabilidade e pequenas empresas, oferecendo uma visão clara e centralizada de:

- **Dashboard Geral**: Visão rápida da saúde financeira.
- **Contas a Pagar e Receber**: Gestão completa do fluxo de caixa.
- **Folha de Pagamento**: Processamento e exportação bancária.
- **Cadastros**: Centralização de clientes, funcionários, fornecedores e bancos.
- **Relatórios**: Análise detalhada de movimentações.

### 1.2. Acesso ao Sistema

Para acessar o sistema, utilize suas credenciais (e-mail e senha) na tela de login. Por padrão, o sistema vem com um usuário de demonstração:

- **E-mail**: `admin@contapro.com`
- **Senha**: `123456`

![Tela de Login](https://i.imgur.com/example.png)  
*Figura 1: Tela de Login do ContaPro com a logo da empresa.*

---

## 2. Dashboard Geral

O Dashboard é a primeira tela que você vê após o login. Ele oferece uma visão consolidada e em tempo real da saúde financeira da sua empresa.

### 2.1. Indicadores Chave de Performance (KPIs)

No topo da tela, você encontra 4 indicadores principais:

| Indicador | Descrição | Ícone | Cor |
| :--- | :--- | :--- | :--- |
| **Receita Total** | Soma de todos os valores a receber no período. | `DollarSign` | Azul |
| **Gastos Totais** | Soma de todas as despesas a pagar no período. | `CreditCard` | Rosa |
| **Em Aberto** | Soma de todos os valores a receber que ainda não foram pagos. | `TrendingUp` | Amarelo |
| **Clientes Ativos** | Quantidade de clientes com status "ATIVO" no cadastro. | `Briefcase` | Verde |

### 2.2. Insights do Sistema

Este card utiliza inteligência de dados para fornecer 3 insights valiosos:

1.  **Principal Fonte de Receita**: Identifica o cliente que mais gera receita e qual a porcentagem de participação dele no faturamento total.
2.  **Foco de Custos**: Mostra a categoria de despesa que mais consome recursos financeiros.
3.  **Impacto Operacional**: Calcula o percentual que a folha de pagamento representa sobre o total de saídas da empresa.

### 2.3. Gráficos

-   **Fluxo de Caixa Mensal**: Gráfico de área que compara as entradas e saídas ao longo dos meses.
-   **Composição de Gastos**: Gráfico de pizza que mostra a distribuição das despesas por categoria.

### 2.4. Ações Rápidas

-   **Relatório Rápido**: Gera uma versão para impressão (PDF) do dashboard atual.
-   **+ Novo Registro**: Atalho para adicionar uma nova receita ou despesa.

---

## 3. Contas a Pagar e Receber

Esta seção, acessada pelo menu "Financeiro", permite a gestão detalhada de todas as entradas e saídas.

### 3.1. Funcionalidades

-   **Listagem**: Tabela com todos os lançamentos, incluindo cliente/fornecedor, categoria, vencimento, valor e status.
-   **Pesquisa**: Filtre rapidamente por nome ou categoria.
-   **Status**: Os lançamentos são automaticamente classificados como:
    -   `PENDENTE` (Amarelo)
    -   `PAGO` (Verde)
    -   `ATRASADO` (Vermelho)
-   **Ações por Lançamento**:
    -   **Dar Baixa**: Marcar um lançamento como "PAGO".
    -   **Excluir**: Remover um lançamento permanentemente.

### 3.2. Adicionar Nova Receita/Despesa

Ao clicar em "+ Nova Receita" ou "+ Nova Despesa", um modal se abrirá com os seguintes campos:

| Campo | Descrição | Obrigatório |
| :--- | :--- | :--- |
| **Cliente/Fornecedor** | Nome do cliente ou fornecedor. | Sim |
| **Valor (R$)** | Valor do lançamento. | Sim |
| **Vencimento** | Data de vencimento. | Sim |
| **Competência** | Mês/ano a que o lançamento se refere. | Sim |
| **Banco** | Banco associado ao lançamento. | Não |
| **Tipo de Documento** | Boleto, Pix, Débito Automático, etc. | Não |
| **Categoria** | Categoria da receita ou despesa. | Sim |
| **Descrição** | Detalhes adicionais sobre o lançamento. | Não |
| **Parcelas** | Quantidade de parcelas (para lançamentos recorrentes). | Não |

---

## 4. Folha de Pagamento

Esta tela centraliza todas as operações relacionadas à folha de pagamento dos funcionários.

### 4.1. Visão Geral

-   **Resumo Financeiro**: Cards com Total Bruto, Total de Retenções e Líquido a Pagar.
-   **Listagem de Funcionários**: Tabela com os detalhes do pagamento de cada funcionário (salário base, vantagens, descontos, comissão, líquido e status).

### 4.2. Ações Principais

-   **Exportar Bancário**: Gera um arquivo no formato **CNAB 240** para envio ao banco, automatizando o pagamento de todos os funcionários. O arquivo gerado tem a extensão `.rem`.
-   **Gerenciar Lançamentos**: Abre um modal para editar os valores (salário, benefícios, descontos, comissão) de cada funcionário individualmente.
-   **Fechar Folha**: Consolida todos os pagamentos, mudando o status para "FECHADA" e bloqueando novas edições.
-   **Imprimir Holerite (PDF)**: Gera um holerite individual para cada funcionário.

---

## 5. Cadastros

Esta seção permite gerenciar as entidades principais do sistema.

### 5.1. Tipos de Cadastro

-   **Clientes**: Cadastro de clientes com nome, documento (CNPJ/CPF), honorário mensal e status de inadimplência.
-   **Funcionários**: Cadastro de funcionários com nome, cargo e salário base.
-   **Fornecedores**: Cadastro de fornecedores com nome, documento (CNPJ), categoria e contato.
-   **Bancos & Caixas**: Cadastro das contas bancárias da empresa com nome do banco, agência, conta e saldo inicial.

### 5.2. Funcionalidades

-   **Adicionar**: Clicar em "+ Novo" para abrir o modal de cadastro.
-   **Editar**: Alterar as informações de um registro existente.
-   **Excluir**: Remover um registro permanentemente.

---

## 6. Relatórios

Esta tela oferece uma visão analítica e consolidada de todas as movimentações financeiras.

### 6.1. Filtros

-   **Período**: Selecione uma data de início e fim.
-   **Tipo de Lançamento**: Filtre por "Todos", "Apenas Receitas", "Apenas Despesas" ou "Folha de Pagamento".

### 6.2. Visão Analítica

-   **Resumo do Período**: Cards com o total de Entradas, Saídas e o Saldo Líquido do período filtrado.
-   **Detalhamento das Movimentações**: Tabela completa com todas as transações (receitas, despesas e folha) no período, mostrando data, descrição, tipo, status e valor.

### 6.3. Exportação

-   **PDF / Imprimir**: Gera uma versão para impressão da tela de relatório, com layout otimizado.
-   **Exportar CSV**: Exporta os dados da tabela para um arquivo `.csv`, compatível com Excel e Google Sheets, com formatação e encoding corretos.

---

## 7. Suporte

Em caso de dúvidas, problemas ou sugestões, entre em contato com o suporte técnico.
