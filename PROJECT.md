# Documento Técnico - Desenvolvimento do Aplicativo **Lina AI**

## Visão Geral

**Lina AI** é um aplicativo pessoal, gratuito e hospedado na Vercel, desenvolvido com Next.js 15 e foco em controle financeiro inteligente. Ele registra e analisa entradas e saídas financeiras (gastos, ganhos e investimentos), separados por categoria e por conta bancária ou de investimento, com dados armazenados no Supabase. A análise é feita sob demanda pela IA Gemini, com base em perguntas padrão sobre hábitos de consumo e sugestões de economia.

---

## Funcionalidades

### 1. Controle Financeiro

- Registro de **ganhos, gastos e investimentos**;
- Separação por **categoria** e por **conta bancária/investimento**;
- Campos para **descrição** e **tags** por transação;
- Tipos de contas: bancária ou investimento (usuário define);
- Todas as movimentações possuem valor, data e tipo;
- Suporte a **limites mensais por categoria**;
- Suporte a **metas mensais de economia**;

### 2. Dashboard

- Página principal do app;
- Exibição de **gráficos de pizza e barras** para ganhos e gastos;
- Visualização **por mês e ano** com comparações mensais;
- Interface com **dark mode padrão** e design acessível;
- Navegação por **sidebar**;
- Animações suaves para transições;

### 3. IA (Gemini)

- Integração via API para análise sob demanda;
- Gatilho por botão "Analisar finanças";
- A IA retorna:

  - Diagnóstico básico da saúde financeira;
  - Sugestões de economia;
  - Pontuação de saúde financeira mensal;
  - Resumo de hábitos de consumo recorrentes;

### 4. Usuário e Autenticação

- Criação de conta: nome e e-mail;
- Login: somente com e-mail (sem verificação);
- Uso apenas pessoal (sem multiclientes);

### 5. Outras funcionalidades

- Histórico de movimentações completo;
- Filtro por categoria, conta e tipo de transação;
- Possibilidade de exportar os dados em CSV;
- Responsividade total para dispositivos móveis;
- Idioma: apenas **Português (pt-BR)**;

---

## Tecnologias Utilizadas

| Área         | Tecnologia                                 |
| ------------ | ------------------------------------------ |
| Frontend     | Next.js 15, React, TailwindCSS + shadcn/ui |
| Backend      | Supabase (PostgreSQL + API REST)           |
| IA           | Gemini API (manual trigger)                |
| Deploy       | Vercel (gratuito)                          |
| Autenticação | Nome + e-mail apenas                       |

---

## Supabase - Esquema SQL Completo

```sql
-- ENUM para tipo de transação
CREATE TYPE transaction_type AS ENUM ('ganho', 'gasto', 'investimento');

-- Tabela de usuários
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- Tabela de contas (bancária ou investimento)
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('bancaria', 'investimento')),
  created_at TIMESTAMP DEFAULT now()
);

-- Tabela de categorias
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#cccccc',
  monthly_limit NUMERIC,
  created_at TIMESTAMP DEFAULT now()
);

-- Tabela de movimentações
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  type transaction_type NOT NULL,
  amount NUMERIC NOT NULL,
  description TEXT,
  tags TEXT[],
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- Tabela de metas de economia
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  month INT NOT NULL,
  year INT NOT NULL,
  goal_amount NUMERIC NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, month, year)
);
```

---

## Importação do Schema no Supabase

### Opção 1 - Via SQL Editor (painel Supabase)

1. Acesse o projeto no painel Supabase.
2. Vá até "SQL Editor" → Novo Query.
3. Cole o schema acima e clique em "Run".

### Opção 2 - Via Supabase CLI

**Pré-requisitos:** `supabase CLI` instalado

```bash
# Crie um projeto local
supabase init

# Cole o schema SQL em um arquivo, por exemplo: schema.sql

# Execute:
supabase db push --file schema.sql
```

---

---
