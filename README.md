# Smart Consulta

Plataforma de agendamento de consultas medicas que conecta pacientes, clinicas e medicos em uma unica interface. Desenvolvida como prototipo funcional com armazenamento local (localStorage), sem necessidade de backend.

**Producao:** https://smart-consulta.web.app  
**Staging/Dev:** https://smart-consulta-dev.web.app

---

## Indice

1. [Visao Geral](#visao-geral)
2. [Stack Tecnologica](#stack-tecnologica)
3. [Estrutura do Projeto](#estrutura-do-projeto)
4. [Como Rodar Localmente](#como-rodar-localmente)
5. [Portais e Funcionalidades](#portais-e-funcionalidades)
6. [Arquitetura de Dados](#arquitetura-de-dados)
7. [Contas Demo](#contas-demo)
8. [Fluxos Principais](#fluxos-principais)
9. [Componentes UI](#componentes-ui)
10. [Deploy](#deploy)
11. [Limitacoes do Prototipo](#limitacoes-do-prototipo)

---

## Visao Geral

O Smart Consulta possui tres portais independentes:

| Portal | Publico-alvo | Acesso |
|--------|-------------|--------|
| Paciente | Usuarios que buscam e agendam consultas | `/` (home publica) |
| Clinica | Gestores/administradores de clinicas | `/clinic/login` |
| Medico | Profissionais de saude cadastrados | `/doctor/login` |

---

## Stack Tecnologica

| Tecnologia | Versao | Uso |
|-----------|--------|-----|
| Next.js | 16.2.6 | Framework React com `output: "export"` (geracao estatica) |
| React | 19.2.4 | UI |
| TypeScript | 5.x | Tipagem estatica em todo o projeto |
| Tailwind CSS | 4.x | Estilizacao (configuracao CSS-only, sem `tailwind.config.js`) |
| Framer Motion | 12.x | Animacoes e transicoes de pagina |
| Lucide React | 1.x | Icones |
| next-themes | 0.4.6 | Dark/light mode com classe `.dark` no `<html>` |
| Firebase Hosting | -- | Deploy estatico (CDN global) |
| Turbo | 2.x | Monorepo build system |

---

## Estrutura do Projeto

```
Smart Consulta/
├── apps/
│   └── web/                              # Aplicacao Next.js principal
│       ├── app/                          # App Router (Next.js 13+)
│       │   ├── page.tsx                  # Home — portal do paciente
│       │   ├── buscar/page.tsx           # Busca de clinicas e agendamento
│       │   ├── login/page.tsx            # Login do paciente
│       │   ├── register/page.tsx         # Cadastro do paciente
│       │   ├── profile/page.tsx          # Perfil e historico do paciente
│       │   ├── support/page.tsx          # Pagina de suporte
│       │   ├── clinic/
│       │   │   ├── login/                # Login da clinica
│       │   │   ├── dashboard/            # Visao geral da clinica
│       │   │   ├── appointments/         # Gestao de agendamentos
│       │   │   ├── professionals/        # Cadastro de medicos
│       │   │   ├── schedule/             # Configuracao de horarios
│       │   │   ├── analytics/            # Relatorios e metricas
│       │   │   └── settings/             # Configuracoes da clinica
│       │   └── doctor/
│       │       ├── login/                # Login do medico
│       │       ├── dashboard/            # Visao geral do medico
│       │       ├── agenda/               # Agenda e gestao de consultas
│       │       └── patients/             # Prontuarios e pacientes
│       ├── components/
│       │   ├── navbar.tsx                # Navbar global (paciente)
│       │   ├── env-banner.tsx            # Banner de ambiente (invisivel em prod)
│       │   ├── theme-provider.tsx        # Provider de dark mode
│       │   ├── modals/                   # Modais (login, registro, agendamento)
│       │   ├── sections/                 # Secoes da home page
│       │   └── ui/                       # Componentes reutilizaveis
│       ├── context/
│       │   ├── auth-context.tsx          # Auth do paciente
│       │   ├── clinic-auth-context.tsx   # Auth da clinica
│       │   └── doctor-auth-context.tsx   # Auth do medico
│       ├── lib/
│       │   ├── auth-store.ts             # CRUD de pacientes (localStorage)
│       │   ├── clinic-store.ts           # CRUD de clinicas e profissionais
│       │   ├── public-profiles-store.ts  # Perfis publicos + slots disponiveis
│       │   ├── global-appointments.ts    # Store compartilhado de agendamentos
│       │   ├── doctor-store.ts           # Auth do medico
│       │   ├── medical-records-store.ts  # Prontuarios, prescricoes, exames
│       │   └── status-config.ts          # Mapeamento de status para estilo visual
│       └── .env.production               # NEXT_PUBLIC_APP_ENV=production
├── packages/
│   └── ui/                               # Pacote de componentes compartilhados
├── firebase.json                         # Configuracao do Firebase Hosting
├── .firebaserc                           # Aliases de projetos (dev/prod)
└── package.json                          # Scripts raiz (turbo)
```

---

## Como Rodar Localmente

### Pre-requisitos

- Node.js >= 20
- npm >= 11
- Firebase CLI (apenas para deploy): `npm install -g firebase-tools`

### Instalacao

```bash
# Entre na pasta do projeto
cd "Smart Consulta"

# Instale as dependencias
npm install

# Inicie em modo desenvolvimento
npm run dev
```

Acesse `http://localhost:3000`.

### Scripts disponiveis

| Comando | O que faz |
|---------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento com hot reload |
| `npm run build` | Gera exportacao estatica em `apps/web/out/` |
| `npm run typecheck` | Verifica tipagem TypeScript sem compilar |
| `npm run lint` | Executa ESLint |
| `npm run format` | Formata codigo com Prettier + Tailwind sort |

### Build para producao

```bash
# Build completo via Turbo (com cache automatico)
npx turbo build

# Build forcado — sem cache (necessario apos mudar .env ou dados demo)
npx turbo build --force
```

---

## Portais e Funcionalidades

### Portal do Paciente

**Acesso:** `/` — home publica, sem necessidade de login para navegar.

#### Home Page
- Navbar com toggle dark/light mode, busca rapida, login e cadastro
- Hero animado com estatisticas da plataforma
- **Deck Carousel de Clinicas** — cards animados com efeito "baralho", blur-reveal text nos nomes, avaliacao, especialidade e botao de agendar
- Secao de medicos em destaque
- Como funciona — passo a passo visual
- Avaliacoes de pacientes
- Footer com links e informacoes

#### Busca e Agendamento (`/buscar`)

O fluxo completo de agendamento acontece nesta pagina:

1. **Lista de clinicas** com filtros por cidade e especialidade
2. Clique em uma clinica → lista de **especialidades** disponiveis
3. Selecao de **profissional** com bio, rating, experiencia e preco
4. Escolha de **data** via calendario (apenas datas futuras habilitadas)
5. Escolha de **horario** — slots calculados em tempo real com base na configuracao do medico, excluindo horarios ja ocupados
6. Selecao de **forma de pagamento** (plano de saude ou particular)
7. **Resumo e confirmacao** do agendamento
8. Paciente sem login e redirecionado para autenticacao antes de confirmar

#### Perfil do Paciente (`/profile`)
- Visualizacao e edicao de dados pessoais (nome, CPF, telefone, plano de saude)
- Historico completo de consultas com status atualizado em tempo real
- Reagendamento de consultas com nova data e horario
- Cancelamento de consultas
- Alteracao de senha

---

### Portal da Clinica

**Acesso:** `/clinic/login`  
**Conta demo:** `clinica@smartconsulta.com` / `admin123`

#### Login (`/clinic/login`)
- Layout split-screen com painel lateral mostrando os beneficios da plataforma
- Animacoes de entrada com Framer Motion
- Hint de conta demo visivel na tela

#### Dashboard (`/clinic/dashboard`)
- Saudacao personalizada com nome do responsavel e dia da semana
- **4 cards de metricas** com entrada em stagger animado:
  - Consultas marcadas para hoje
  - Proximas consultas (status pendente/confirmado)
  - Profissionais ativos na clinica
  - Faturamento acumulado de consultas realizadas
- Alert animado quando ha consultas aguardando confirmacao no dia
- Lista dos agendamentos do dia com status em tempo real e indicador de atividade
- Resumo geral (confirmados / cancelados / aguardando / realizados)
- **Taxa de ocupacao** com barra de progresso animada

#### Agendamentos (`/clinic/appointments`)
- Tabela completa de todos os agendamentos da clinica
- **Filtros por status:** Todos / Pendentes / Agendado / Confirmado / Reagendado / Em atendimento / Realizado / Cancelado / Faltou
- Busca por nome do paciente, medico ou especialidade
- Acoes inline: confirmar, marcar como realizado, cancelar
- **Modal de detalhes** com informacoes completas do agendamento e campo de observacoes internas editavel

#### Profissionais (`/clinic/professionals`)
- Listagem de medicos cadastrados na clinica com status ativo/inativo
- Cadastro de novo profissional: nome, especialidade, CRM, e-mail, telefone
- Ativacao e desativacao de profissionais
- Cada profissional cadastrado recebe senha padrao `medico123` automaticamente

#### Agenda (`/clinic/schedule`)
- Configuracao de horarios por profissional
- Para cada medico: definir, por dia da semana, se atende, horario de inicio, fim e intervalo entre consultas (em minutos)
- Dias inativos nao geram slots para agendamento

#### Relatorios (`/clinic/analytics`)
- Faturamento total e medio por consulta
- Taxa de conclusao vs. cancelamento
- Ranking de profissionais por volume de atendimentos
- Distribuicao de agendamentos por especialidade

#### Configuracoes (`/clinic/settings`)
- Atualizacao dos dados da clinica (nome, endereco, telefone, especialidade)
- Alteracao de senha da conta admin

---

### Portal do Medico

**Acesso:** `/doctor/login`  
**Conta demo:** `felipe@clinica.com` / `medico123`

#### Dashboard (`/doctor/dashboard`)
- Saudacao com especialidade e CRM do medico
- Metricas: consultas hoje, proximas consultas, total de pacientes atendidos, prontuarios criados
- Alert de consultas pendentes de confirmacao
- Agenda do dia com horarios e nomes dos pacientes
- Resumo geral de status e acoes rapidas

#### Minha Agenda (`/doctor/agenda`)
- Tabela de todos os agendamentos do medico em ordem cronologica
- Filtros por status e busca por nome de paciente ou especialidade
- **Fluxo de atendimento via botoes inline:**
  1. Confirmar (pending → confirmed)
  2. Iniciar atendimento (confirmed → in-progress)
  3. Finalizar (in-progress → completed)
  4. Marcar como faltou (no-show)
  5. Cancelar
- **Modal de detalhes** com campo de anotacoes privadas do medico (visivel apenas ao medico e a clinica)

#### Meus Pacientes (`/doctor/patients`)
- Historico de todos os pacientes que ja agendaram com o medico
- Acesso ao **prontuario eletronico** de cada paciente
- Criacao e edicao de prontuarios com campos estruturados:
  - Queixa principal
  - Historia da molestia atual
  - Exame fisico
  - Diagnostico (com campo opcional para CID)
  - Conduta/tratamento
  - Observacoes gerais
- **Emissao de prescricoes** com lista de medicamentos (nome, dosagem, frequencia, duracao, observacoes)
- **Pedidos de exame** com nome do exame e instrucoes

---

## Arquitetura de Dados

Todos os dados vivem no `localStorage` do navegador. Nao ha servidor, API REST nem banco de dados real.

### Chaves do localStorage

| Chave | Tipo | Conteudo |
|-------|------|---------|
| `sc_users` | `User[]` | Pacientes cadastrados |
| `sc_session` | `User` | Sessao ativa do paciente |
| `sc_clinic_admins` | `ClinicAdmin[]` | Contas das clinicas |
| `sc_clinic_session` | `ClinicAdmin` | Sessao ativa da clinica |
| `sc_professionals` | `Professional[]` | Medicos de todas as clinicas |
| `sc_doctor_session` | `DoctorSession` | Sessao ativa do medico |
| `sc_doctor_passwords` | `Record<id, string>` | Senhas dos medicos |
| `sc_global_appointments` | `GlobalAppointment[]` | Todos os agendamentos |
| `sc_waiting_list` | `WaitingEntry[]` | Lista de espera |
| `sc_public_clinics` | `ClinicPublicProfile[]` | Perfis publicos das clinicas |
| `sc_prof_extended` | `ProfessionalExtended[]` | Bio, rating e preco dos medicos |
| `sc_medical_records` | `MedicalRecord[]` | Prontuarios eletronicos |
| `sc_prescriptions` | `Prescription[]` | Prescricoes emitidas |
| `sc_exam_orders` | `ExamOrder[]` | Pedidos de exame |
| `sc_data_version` | `string` | Versao dos dados demo (ex: `"v3"`) |

### Versionamento de Dados Demo

A chave `sc_data_version` forca re-seed automatico quando os dados demo mudam entre versoes do codigo. Se a versao armazenada diferir da versao atual, `sc_public_clinics` e `sc_prof_extended` sao resetados e repovoados com os dados novos. Dados do usuario (agendamentos, sessao, cadastro) **nunca** sao apagados pelo versionamento.

Para atualizar dados demo: incremente a constante `DATA_VERSION` em `lib/public-profiles-store.ts`.

### Status de Agendamento

Centralizados em `lib/status-config.ts`:

| Status | Label | Cor |
|--------|-------|-----|
| `pending` | Pendente | Laranja |
| `scheduled` | Agendado | Azul |
| `confirmed` | Confirmado | Verde |
| `rescheduled` | Reagendado | Roxo |
| `in-progress` | Em atendimento | Azul claro |
| `completed` | Realizado | Verde escuro |
| `cancelled` | Cancelado | Vermelho |
| `no-show` | Faltou | Amarelo |

### Fluxo de Status

```
Paciente agenda
      ↓
   pending   →  clinica confirma  →  scheduled
                                          ↓
                              medico confirma presenca
                                          ↓
                                      confirmed
                                          ↓
                                medico inicia atendimento
                                          ↓
                                      in-progress
                                          ↓
                                  medico finaliza
                                          ↓
                                      completed

Em qualquer etapa:  → cancelled (qualquer parte)
                    → no-show   (paciente nao compareceu)
                    → rescheduled (reagendado)
```

---

## Contas Demo

### Paciente
Crie uma conta nova em `/register` com qualquer e-mail e senha (minimo 6 caracteres).

### Clinica
| Campo | Valor |
|-------|-------|
| E-mail | `clinica@smartconsulta.com` |
| Senha | `admin123` |
| URL | `/clinic/login` |

### Medicos da Clinica Demo
| Nome | E-mail | Senha | Especialidade |
|------|--------|-------|---------------|
| Dr. Felipe Moura | `felipe@clinica.com` | `medico123` | Clinica Geral |
| Dra. Ana Ribeiro | `ana@clinica.com` | `medico123` | Cardiologia |
| Dr. Lucas Peixoto | `lucas@clinica.com` | `medico123` | Ortopedia |
| Dra. Camila Nunes | `camila@clinica.com` | `medico123` | Dermatologia |

> **Dados nao aparecem?** Abra em aba anonima ou va em DevTools (F12) > Application > Local Storage > clique com botao direito > Clear para resetar os dados demo.

---

## Fluxos Principais

### Paciente agenda uma consulta

```
1. Acessa /buscar
2. Filtra por cidade (Jaragua do Sul / Guaramirim / Schroeder) e/ou especialidade
3. Clica em uma clinica
4. Seleciona especialidade disponivel
5. Escolhe um medico (ve bio, rating, preco)
6. Escolhe data no calendario
7. Escolhe horario disponivel (calculado em tempo real)
8. Seleciona forma de pagamento
9. Revisa resumo e confirma
   → Sem login: vai para login/cadastro, volta automaticamente apos autenticar
   → Com login: agendamento criado com status "pending"
10. Consulta aparece em /profile
```

### Clinica gerencia agendamentos

```
1. Login em /clinic/login
2. Dashboard mostra consultas do dia e metricas
3. Agendamentos > filtra por "Pendentes"
4. Confirma consultas (pending → scheduled)
5. Acompanha andamento pelo status em tempo real
6. Adiciona observacoes internas no modal de detalhes
7. Relatorios mostra faturamento e taxa de ocupacao
```

### Medico realiza atendimento

```
1. Login em /doctor/login
2. Dashboard alerta sobre consultas pendentes
3. Minha Agenda > confirma presenca (scheduled → confirmed)
4. No momento do atendimento: Iniciar (confirmed → in-progress)
5. Meus Pacientes > abre prontuario do paciente
6. Preenche prontuario (queixa, diagnostico, conduta)
7. Emite prescricao e/ou pedido de exame se necessario
8. Agenda > Finalizar consulta (in-progress → completed)
```

---

## Componentes UI

Componentes customizados em `apps/web/components/ui/`:

### DeckCarousel / BlurRevealText (`blur-reveal-deck.tsx`)
Carrossel estilo "baralho de cartas". Usado na home para exibir as clinicas parceiras.
- 2 cartas "empilhadas" visiveis atras do card ativo
- Navegacao por setas, pontos ou swipe (mobile)
- Texto anima palavra por palavra: blur → nitido
- Ativado por scroll (useInView)

### FilterDropdown (`filter-dropdown.tsx`)
Substitui todos os `<select>` nativos do projeto. Generico: aceita qualquer tipo `T extends string | number`.
- Abre com animacao suave (Framer Motion)
- Suporta icone, valor "todos" customizavel e funcao `getLabel` para exibicao
- Fecha ao clicar fora ou pressionar Escape
- Usado em: filtros de busca (cidade, especialidade), configuracao de agenda (intervalo em minutos)

### Skeleton (`skeleton.tsx`)
Loading placeholders para clinicas e profissionais durante carregamento do localStorage.

### ECGMonitor (`ecg-monitor.tsx`)
Animacao decorativa de linha de ECG cardiaco. Usada em paginas de login.

### EnvBanner (`env-banner.tsx`)
Faixa no topo da pagina indicando ambiente de desenvolvimento ou homologacao.
- Automaticamente invisivel quando `NEXT_PUBLIC_APP_ENV=production`
- Laranja em preview/HML, azul em desenvolvimento

---

## Deploy

### Ambientes Firebase

| Alias | Projeto Firebase | URL |
|-------|----------------|-----|
| `dev` | `smart-consulta-dev` | https://smart-consulta-dev.web.app |
| `prod` | `smart-consulta` | https://smart-consulta.web.app |

### Comandos de deploy

```bash
# 1. Build (--force para reprocessar variaveis de ambiente)
npx turbo build --force

# 2. Deploy em staging (dev)
firebase deploy --only hosting -P dev

# 3. Deploy em producao
firebase deploy --only hosting -P prod
```

### Variaveis de ambiente

| Variavel | Arquivo | Valor | Efeito |
|----------|---------|-------|--------|
| `NEXT_PUBLIC_APP_ENV` | `.env.production` | `production` | Oculta o banner de ambiente dev/hml |

O arquivo `.env.production` e carregado automaticamente pelo Next.js durante `next build`. Nao e necessario configurar manualmente.

### Como o static export funciona

O Next.js gera arquivos HTML/JS/CSS estaticos em `apps/web/out/`. O Firebase Hosting serve esses arquivos via CDN global. Nao ha servidor Node.js nem funcoes serverless — toda a logica roda no navegador do usuario (client-side).

---

## Limitacoes do Prototipo

Por ser baseado em localStorage:

- **Dados nao persistem entre dispositivos** — cada navegador/dispositivo tem sua propria instancia dos dados
- **Dados nao sao compartilhados em tempo real** — para testar o fluxo completo (paciente + clinica + medico), use o mesmo navegador/aba
- **Sem autenticacao real** — senhas ficam no localStorage (adequado apenas para demonstracao)
- **Sem notificacoes push** — mudancas de status nao geram alertas automaticos
- **Sem upload de arquivos** — fotos de perfil e documentos nao sao suportados

Para evoluir para producao real, os stores de localStorage devem ser substituidos por chamadas a uma API com Firebase Auth + Firestore.

---

## Clinicas Cadastradas

| Clinica | Cidade | Especialidades |
|---------|--------|---------------|
| Clinica Saude & Vida | Jaragua do Sul | Clinica Geral, Cardiologia, Ortopedia, Dermatologia |
| CardioCenter Jaragua do Sul | Jaragua do Sul | Cardiologia, Medicina Interna, Clinica Geral |
| Clinica Infantil Crescer | Guaramirim | Pediatria, Neonatologia, Clinica Geral |
| OdontoMais Guaramirim | Guaramirim | Odontologia, Ortodontia |
| Espaco NutriMente | Schroeder | Nutricao, Psicologia |
| FisioMovimento Schroeder | Schroeder | Fisioterapia, Ortopedia |
