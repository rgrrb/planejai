# 💰 Planej.ai — Educador Financeiro Inteligente

Aplicação web que transforma dados financeiros pessoais em um diagnóstico claro e personalizado, gerado por IA. A pessoa usuária preenche um formulário em etapas com renda, gastos e uma meta financeira, e recebe uma análise de viabilidade, sugestões práticas e pode conversar com o Educador Financeiro para tirar dúvidas sobre o resultado.

Projeto desenvolvido como desafio final da trilha **"Desenvolvendo seu Educador Financeiro Inteligente com React e IA Generativa"** da [DIO](https://www.dio.me/), a partir do [repositório base](https://github.com/digitalinnovationone/planejai).

## ✨ O que o projeto faz

1. A pessoa usuária preenche um formulário em etapas (renda mensal, custos fixos, dívidas, nome da meta, valor da meta e prazo).
2. Os dados são salvos no `localStorage` e a aplicação calcula a economia mensal necessária para atingir a meta no prazo informado.
3. Um prompt estruturado é enviado à API do Gemini, que retorna um diagnóstico com viabilidade da meta, sugestões práticas, ideias de renda extra, sugestões de investimento e uma mensagem motivacional.
4. O insight gerado é exibido na página de resultado e fica salvo junto da simulação.
5. A pessoa usuária pode conversar com o Educador Financeiro diretamente no card de insights, com o histórico da conversa preservado por simulação.
6. Todas as simulações ficam disponíveis em uma tela de histórico, com opção de revisitar ou excluir cada uma.

## 🛠️ Tecnologias utilizadas

- **React** + **TypeScript**
- **Vite**
- **Tailwind CSS** (com suporte a tema claro/escuro)
- **React Router DOM**
- **Google Gemini API** (geração dos insights e do chat)
- **localStorage** para persistência dos dados no navegador
- **lucide-react** para ícones
- **react-loading-skeleton** para os estados de carregamento

## 🚀 Como executar a aplicação

```bash
# clone o repositório
git clone <url-do-seu-repositorio>
cd planejai

# instale as dependências
npm install

# configure a API Key do Gemini
cp .env.example .env
# edite o .env e adicione:
# VITE_GEMINI_API_KEY=sua_chave_aqui

# rode o projeto
npm run dev
```

A aplicação estará disponível em `http://localhost:5173` (ou na porta indicada pelo terminal).

## 🧩 Melhoria implementada

O projeto base foi evoluído em três frentes principais:

### 1. Armazenamento e tipagem
- `src/data/simulation.ts`: adição da interface `SimulationRecord` com suporte ao insight gerado e ao histórico de mensagens do chat.
- `src/hooks/useSimulationStorage.tsx`: implementação de `getAllSimulations`, `updateSimulation` e `deleteSimulation`, completando o CRUD de simulações no `localStorage`.

### 2. Histórico de simulações e página de resultado
- `src/pages/SimulationActivity.tsx`: reformulação completa da tela de histórico, com listagem dinâmica em cards, badges de status, atalho para revisitar a simulação e exclusão de itens.
- `src/pages/SimulationResult.tsx`: integração do salvamento automático do insight gerado pela IA e sincronização da conversa do chat junto ao histórico da simulação.

### 3. Chat com o Educador Financeiro
- `src/services/aiService.ts`: ajuste nas chamadas à API do Gemini para suportar tanto o prompt estruturado inicial quanto as trocas de mensagens sequenciais do chat, mantendo o contexto da simulação e do diagnóstico já gerado.
- `AIInsightsCardProps.tsx`: unificação, em um único componente, da visualização dos insights com a caixa de conversa interativa — o histórico do chat é salvo por simulação e sincronizado com o `localStorage`.
- `Content.tsx`: refinamento das cores e contraste das badges de status (`statusStyles`) para garantir boa legibilidade tanto no tema claro quanto no escuro.

Essas mudanças cobrem, ao mesmo tempo, dois dos desafios propostos no repositório base: **"Criar uma página de histórico de simulações"** e **"Permitir que a pessoa usuária converse com o Educador Financeiro"** — incluindo o salvamento do histórico de perguntas e respostas.

## ✅ Como testar o fluxo principal

1. Acesse a tela inicial e preencha o formulário de simulação (renda, gastos, dívidas e meta).
2. Ao concluir, você será redirecionado para a página de resultado, onde o insight da IA é gerado automaticamente.
3. Use o campo de mensagem no card de insights para fazer uma pergunta ao Educador Financeiro (ex: *"Quais investimentos mais seguros posso usar?"*) e veja a resposta aparecer no mesmo card, abaixo do diagnóstico.
4. Acesse a tela de **Histórico de Simulações** para conferir a simulação recém-criada listada em um card.
5. Volte a essa mesma simulação e confirme que o insight e a conversa do chat continuam salvos.
6. Exclua uma simulação pelo histórico e confirme que ela some da lista e do `localStorage`.

## 📚 O que aprendi durante o desafio

- Como estruturar um prompt para IA generativa de forma que o retorno seja previsível e possa ser tipado (`InsightData`) e renderizado diretamente na interface.
- Como manter contexto entre múltiplas chamadas à IA (diagnóstico inicial + chat), reaproveitando os dados da simulação e o histórico de mensagens no prompt.
- Boas práticas de persistência local com `localStorage`, incluindo separação de responsabilidades em um hook próprio (`useSimulationStorage`) para leitura, criação, atualização e exclusão de registros.
- Como cuidar de estados de carregamento e erro em chamadas assíncronas de IA, evitando chamadas duplicadas e dando feedback visual claro (skeleton, mensagens de erro com retry).
- Ajustes finos de acessibilidade visual em tema claro/escuro, especialmente em componentes de status (badges) que dependem de contraste de cor para comunicar informação.