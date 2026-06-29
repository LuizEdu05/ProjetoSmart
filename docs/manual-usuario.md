# Manual do Usuário — Smart Consulta

**Versão:** 1.0.0 | **Última atualização:** Junho 2026

---

## O que é o Smart Consulta?

O Smart Consulta é uma plataforma web para agendamento de consultas médicas. Você encontra clínicas e médicos disponíveis, escolhe um horário livre e confirma sua consulta em poucos cliques — sem telefonemas, sem filas.

**Acesso:** https://smart-consulta-dev.web.app

---

## Parte 1 — Paciente

### 1.1 Criar uma conta

1. Na página inicial, clique no botão **"Criar conta"** no canto superior direito.
2. Preencha os campos: Nome, Sobrenome, E-mail e Senha.
3. Clique em **"Criar conta"**.
4. Você será autenticado automaticamente.

> A senha deve ter pelo menos 6 caracteres.

---

### 1.2 Fazer login

1. Clique em **"Entrar"** no canto superior direito.
2. Informe seu e-mail e senha cadastrados.
3. Clique em **"Entrar"**.

Se esquecer a senha: entre em contato pelo [Central de Suporte](/support).

---

### 1.3 Agendar uma consulta

#### Pela seção de clínicas

1. Role a página até a seção **"Clínicas em destaque"**.
2. Clique em **"Agendar"** no card da clínica desejada.
3. Uma janela de agendamento será aberta.

#### Pelo formulário rápido

1. Role até a seção **"Agende agora"** na página inicial.
2. Preencha especialidade, localização e data.
3. Clique em **"Buscar horários"**.

#### Passos do agendamento

**Passo 1 — Data e horário**
- Selecione o dia desejado no calendário.
- Escolha um dos horários disponíveis (horários em cinza já estão reservados por outros pacientes).
- Clique em **"Próximo"**.

**Passo 2 — Pagamento**
- Escolha a forma de pagamento: Cartão de crédito, Débito ou Pix.
- Revise o resumo da consulta (clínica, médico, data, horário, valor).
- Clique em **"Confirmar pagamento"**.

**Passo 3 — Confirmação**
- Revise todos os dados uma última vez.
- Clique em **"Confirmar agendamento"**.

**Passo 4 — Sucesso**
- Sua consulta está confirmada!
- O horário fica indisponível para outros pacientes imediatamente.

---

### 1.4 Gerenciar suas consultas (Perfil)

1. Clique no seu nome ou avatar no canto superior direito.
2. Você será redirecionado para a página **"Meu Perfil"**.

#### Abas disponíveis

| Aba | Conteúdo |
|---|---|
| **Dashboard** | Resumo: próximas consultas, total agendado, gastos |
| **Agendamentos** | Lista completa de consultas com status e ações |
| **Configurações** | Editar nome, e-mail, telefone e senha |
| **Notificações** | Lembretes e alertas sobre suas consultas |

#### Cancelar uma consulta

1. Acesse a aba **"Agendamentos"**.
2. Localize a consulta desejada.
3. Clique em **"Cancelar"** (disponível para consultas com status "Agendado").

> Consulte a [política de cancelamento](/support#cancelamento) para taxas aplicáveis.

---

### 1.5 Central de Suporte

Acesse **https://smart-consulta-dev.web.app/support** para:

- Consultar as **perguntas frequentes (FAQ)**.
- Verificar os canais de atendimento (chat, e-mail, telefone).
- Abrir um **chamado** descrevendo sua dúvida ou problema.

#### Abrir um chamado

1. Acesse a Central de Suporte.
2. Role até o formulário **"Abrir chamado"**.
3. Preencha: nome, e-mail, assunto e mensagem.
4. Clique em **"Enviar chamado"**.
5. Você receberá resposta em até 24 horas úteis.

---

### 1.6 Voltar ao site principal

De qualquer página (perfil, suporte, portal da clínica), clique no **logo "SMART Consulta"** no canto superior esquerdo da navbar para voltar à página inicial.

---

## Parte 2 — Clínica (Portal Administrativo)

### 2.1 Acessar o portal

**URL:** https://smart-consulta-dev.web.app/clinic/login

**Credenciais de demonstração:**
- E-mail: `clinica@smartconsulta.com`
- Senha: `admin123`

---

### 2.2 Dashboard

Ao entrar, você verá o painel inicial com:

| Card | Informação |
|---|---|
| **Hoje** | Número de consultas marcadas para o dia |
| **Próximas** | Consultas aguardando atendimento |
| **Profissionais** | Quantidade de médicos ativos |
| **Faturamento** | Receita das consultas realizadas |

A coluna direita mostra um **resumo por status** e a **taxa de ocupação** baseada nos últimos agendamentos.

---

### 2.3 Gerenciar Agendamentos

Menu lateral → **"Agendamentos"**

#### Filtrar agendamentos

- Use a **barra de busca** para filtrar por nome do paciente, médico ou especialidade.
- Use os **botões de status** (Todos, Agendado, Confirmado, Realizado, Cancelado, Faltou) para filtrar a lista.

#### Ações disponíveis na tabela

| Ícone | Ação |
|---|---|
| Olho | Abrir detalhes completos do agendamento |
| Check verde | Confirmar o agendamento |
| ✓ | Marcar como realizado |
| X vermelho | Cancelar o agendamento |

#### Modal de detalhes

Ao clicar no ícone de detalhes, você pode:
- Ver todas as informações do paciente e da consulta.
- Adicionar **observações internas** (notas sobre o paciente).
- Alterar o status (Confirmar, Marcar realizado, Registrar falta, Cancelar).

---

### 2.4 Gerenciar Profissionais

Menu lateral → **"Profissionais"**

#### Adicionar novo profissional

1. Clique em **"Novo profissional"** no canto superior direito.
2. Preencha: nome completo, especialidade, CRM, e-mail e telefone.
3. Ative ou desative o profissional com o toggle.
4. Clique em **"Salvar"**.

#### Editar profissional

1. Localize o profissional na lista.
2. Clique no ícone de lápis (Editar).
3. Faça as alterações desejadas.
4. Clique em **"Salvar"**.

#### Ativar/Desativar profissional

Clique no ícone de pessoa com X (Desativar) ou pessoa com check (Ativar) na linha do profissional.

> Profissionais inativos não aparecem nas opções de agendamento para pacientes.

---

### 2.5 Configurar Agenda

Menu lateral → **"Agenda"**

1. Selecione o profissional na barra lateral esquerda.
2. Para cada dia da semana, configure:
   - **Ativo/Inativo:** toggle para habilitar o dia de atendimento.
   - **Horário de início** e **horário de término**.
   - **Intervalo entre consultas:** 15, 20, 30, 45 ou 60 minutos.
3. Clique em **"Salvar horários"**.

> As configurações de agenda definem os slots disponíveis para agendamento pelos pacientes.

---

### 2.6 Relatórios

Menu lateral → **"Relatórios"**

Visualize métricas de desempenho:

| Métrica | Descrição |
|---|---|
| Faturamento | Receita total de consultas realizadas |
| Total de consultas | Todas as consultas registradas |
| Ticket médio | Valor médio por consulta realizada |
| Taxa de cancelamento | Percentual de consultas canceladas |

Os gráficos de barras mostram:
- **Consultas por mês** (últimos 6 meses)
- **Consultas por especialidade** (top 5)
- **Consultas por médico** (top 5)

---

### 2.7 Configurações da Clínica

Menu lateral → **"Configurações"**

#### Editar informações da clínica

1. Atualize: nome, especialidade, responsável, e-mail, telefone e endereço.
2. Clique em **"Salvar informações"**.

#### Alterar senha

1. Informe a senha atual.
2. Digite a nova senha (mínimo 6 caracteres).
3. Confirme a nova senha.
4. Clique em **"Alterar senha"**.

#### Sair da conta

Clique em **"Sair da conta"** na seção "Sair do painel" ou use o botão **"Sair"** no menu lateral.

---

## Parte 3 — Informações Gerais

### Compatibilidade

O Smart Consulta funciona nos seguintes navegadores:

| Navegador | Versão mínima |
|---|---|
| Google Chrome | 110+ |
| Mozilla Firefox | 110+ |
| Microsoft Edge | 110+ |
| Safari | 16+ |

> O sistema é responsivo e funciona em dispositivos móveis (smartphones e tablets).

### Perguntas frequentes

**Os dados ficam salvos se eu fechar o navegador?**
Sim. Os dados são salvos no armazenamento local do seu navegador (`localStorage`) e persistem entre sessões.

**Posso usar o sistema em outro computador?**
Os dados são locais ao navegador/dispositivo. Cada dispositivo tem seu próprio armazenamento.

**O que acontece se eu limpar o histórico do navegador?**
Limpar os dados do site removerá suas informações locais. Conta e agendamentos precisarão ser recriados.

**Como os horários reservados ficam indisponíveis?**
Ao confirmar um agendamento, o sistema registra o horário como ocupado. Outros pacientes que abrirem o modal de agendamento verão esse horário em cinza e não poderão selecioná-lo.

---

### Limitações conhecidas

| Limitação | Explicação |
|---|---|
| Dados não sincronizados entre dispositivos | Cada navegador tem sua própria cópia local dos dados |
| Sem envio real de e-mails | Notificações são exibidas apenas na interface |
| Pagamento simulado | O processamento de pagamento é fictício nesta versão |
| Sem recuperação de senha por e-mail | Funcionalidade disponível em versão futura |

---

### Próximos passos (versões futuras)

- Integração com banco de dados em nuvem (Supabase ou Firebase)
- Autenticação por e-mail real com recuperação de senha
- Notificações por e-mail e SMS
- Teleconsulta por videoconferência
- App mobile (Android e iOS)
- Integração com planos de saúde

---

*Manual elaborado para fins acadêmicos — Projeto Integrador Smart Consulta.*
