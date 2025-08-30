# Lina AI - Controle Financeiro Inteligente

Lina AI é uma aplicação de controle financeiro que utiliza inteligência artificial para fornecer insights sobre seus hábitos de consumo e ajudá-lo a atingir suas metas de economia.

## Funcionalidades

*   **Dashboard:** Visualize um resumo de suas finanças, incluindo despesas por categoria, receitas vs. despesas e contas a pagar.
*   **Transações:** Adicione, edite e exclua suas transações financeiras.
*   **Contas:** Gerencie suas contas bancárias e de investimento.
*   **Categorias:** Crie e gerencie categorias para suas transações, com a opção de definir limites de gastos mensais.
*   **Metas de Economia:** Defina e acompanhe suas metas de economia.
*   **Análise de IA:** Obtenha insights detalhados sobre seus hábitos de consumo com a ajuda do Gemini, a IA do Google.
*   **Lembretes e Notificações:** Receba alertas sobre contas a pagar e limites de categoria que estão sendo atingidos.
*   **Animações Suaves:** Desfrute de uma experiência de usuário fluida com animações e transições de página suaves.

## Como Iniciar em Desenvolvimento

Para executar a aplicação em modo de desenvolvimento, siga estas etapas:

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/seu-usuario/lina-ai.git
    cd lina-ai
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente:**
    Crie um arquivo `.env.local` na raiz do projeto e adicione as seguintes variáveis:
    ```
    NEXT_PUBLIC_SUPABASE_URL=URL_DO_SEU_PROJETO_SUPABASE
    NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA_CHAVE_ANON_SUPABASE
    GEMINI_API_KEY=SUA_CHAVE_API_GEMINI
    BRAPI_API_TOKEN=BRAPI_API_TOKEN
    ```

4.  **Execute a aplicação:**
    ```bash
    npm run dev
    ```

## Pré-requisitos

- Node.js (versão 18.x ou superior)
- npm ou yarn

A aplicação estará disponível em `http://localhost:3000`.

## Como Buildar a Aplicação

Para buildar a aplicação para produção, execute o seguinte comando:

```bash
npm run build
```

Este comando irá gerar uma versão otimizada da aplicação na pasta `.next`.

## Como Rodar a Aplicação Buildada Localmente

Para rodar a versão buildada da aplicação localmente, execute o seguinte comando:

```bash
npm run start
```

## Como Hospedar na Vercel

Para hospedar a aplicação na Vercel, siga estas etapas:

1.  **Crie uma conta na Vercel:**
    Acesse [vercel.com](https://vercel.com) e crie uma conta.

2.  **Importe o projeto:**
    No dashboard da Vercel, clique em "Add New..." e selecione "Project". Importe seu repositório do GitHub.

3.  **Configure o projeto:**
    A Vercel irá detectar automaticamente que é um projeto Next.js. Você precisará configurar as variáveis de ambiente na seção "Environment Variables" do seu projeto na Vercel. Adicione as mesmas variáveis de ambiente que você configurou no arquivo `.env.local`.

4.  **Deploy:**
    Clique em "Deploy" para iniciar o processo de build e deploy. Após a conclusão, sua aplicação estará disponível em um domínio fornecido pela Vercel.
