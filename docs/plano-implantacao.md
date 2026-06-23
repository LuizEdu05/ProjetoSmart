# Plano de Implantação — Smart Consulta

**Versão:** 1.0.0  
**Data:** Junho 2026  
**Tipo de entrega:** Somente Web  
**Equipe:** [Nome da equipe]

---

## 1. Visão Geral

### Projeto
**Smart Consulta** é uma plataforma web de agendamento de consultas médicas que conecta pacientes a clínicas e profissionais de saúde.

### Objetivo
Disponibilizar um sistema web funcional, acessível publicamente, com dois ambientes configurados (DEV/HML e PRD), fluxo de CI/CD automatizado e documentação técnica completa.

### Público-alvo
- **Pacientes:** pessoas que buscam agendar consultas médicas online.
- **Clínicas:** estabelecimentos de saúde que precisam gerenciar agendamentos e profissionais.

### Funcionalidades principais
| Funcionalidade | Descrição |
|---|---|
| Agendamento de consultas | Paciente seleciona clínica, médico, data e horário disponível |
| Gestão de horários | Horários já reservados ficam indisponíveis para outros pacientes |
| Perfil do paciente | Histórico de consultas, cancelamentos e configurações |
| Portal da clínica | Gerenciamento de agendamentos, profissionais, agenda e relatórios |
| Central de suporte | FAQ, formulário de contato e abertura de chamados |

---

## 2. Arquitetura

### Diagrama simplificado

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚                  USUÁRIO (Navegador)             â”‚
â”‚                                                 â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”‚
â”‚  â”‚  Site do Paciente â”‚   â”‚  Portal da Clínica â”‚  â”‚
â”‚  â”‚  *.web.app       â”‚   â”‚  /clinic/*         â”‚  â”‚
â”‚  â”‚  (Firebase PRD)  â”‚   â”‚                    â”‚  â”‚
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜   â””â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â”‚
â”‚           â”‚                      â”‚               â”‚
â”‚           â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜               â”‚
â”‚                      â”‚                           â”‚
â”‚         â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”              â”‚
â”‚         â”‚     localStorage        â”‚              â”‚
â”‚         â”‚  (persistência local)   â”‚              â”‚
â”‚         â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜              â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
             â”‚ Deploy
             â–¼
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚    FIREBASE HOSTING         â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”    â”‚
â”‚  â”‚  Next.js 16 (SSG)  â”‚    â”‚
â”‚  â”‚  Build estático    â”‚    â”‚
â”‚  â”‚  CDN Global        â”‚    â”‚
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜    â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
             â–²
             â”‚ CI/CD
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚      GitHub Actions        â”‚
â”‚  branch dev  â†’ HML        â”‚
â”‚  branch main â†’ PRD        â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

### Camadas
| Camada | Tecnologia | Função |
|---|---|---|
| Frontend | Next.js 16 + React 19 | Interface do usuário |
| Estilos | Tailwind CSS v4 + shadcn/ui | Design system |
| Animações | Framer Motion | UX e transições |
| Tipagem | TypeScript 5 | Segurança de código |
| Monorepo | Turborepo + npm workspaces | Organização do projeto |
| Persistência | localStorage do navegador | Armazenamento de dados |
| Hospedagem | Firebase Hosting (CDN Google) | Entrega global |
| CI/CD | GitHub Actions | Automação de deploy |

### Observação sobre back-end
Esta versão não possui servidor back-end próprio. O papel de armazenamento é exercido pelo `localStorage` do navegador. Esta decisão foi tomada para viabilizar o escopo acadêmico; a arquitetura permite migração futura para um BaaS (ex.: Supabase, Firebase) sem alterações na camada de apresentação.

---

## 3. Ambientes

### Configuração dos ambientes

| Atributo | DEV/HML | PRD |
|---|---|---|
| **URL** | https://smart-consulta-dev.web.app | https://smart-consulta.web.app |
| **Branch** | `dev` | `main` |
| **Projeto Firebase** | `smart-consulta-dev` | `smart-consulta` |
| **Banner visual** | Sim (laranja: "smart-consulta"HOMOLOGAÃ‡ÃƒO"smart-consulta") | Não exibido |
| **Dados** | Dados de demonstração (seeds) | Dados de demonstração (seeds) |
| `NEXT_PUBLIC_APP_ENV` | `preview` | `production` |

### Diferenças entre ambientes
- **DEV/HML:** exibe banner laranja no topo indicando que não é produção. Usado para validação antes de promover para PRD.
- **PRD:** sem banner, configurações de produção, domínio principal.
- `NEXT_PUBLIC_APP_ENV` é definida no pipeline CI/CD para cada ambiente; controla o banner e demais comportamentos específicos de ambiente.

### Health check
Endpoint estático disponível em ambos os ambientes:
```
GET /api/health
```
Retorna: `status`, `app`, `platform`. Servido pelo Firebase Hosting como arquivo JSON estático.

---

## 4. Configuração

### Variáveis de ambiente

| Variável | DEV/HML | PRD | Obrigatória |
|---|---|---|---|
| `NEXT_PUBLIC_APP_ENV` | `preview` | `production` | Sim |
| `NEXT_PUBLIC_APP_VERSION` | ex.: `1.0.0-hml` | `1.0.0` | Não |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | chave projeto DEV | chave projeto PRD | Sim |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `...dev-hp-20260407.firebaseapp.com` | `...prd-hp-260407.firebaseapp.com` | Sim |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `smart-consulta-dev` | `smart-consulta` | Sim |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | ID app DEV | ID app PRD | Sim |
| `FIREBASE_SERVICE_ACCOUNT_DEV` | JSON conta de serviço DEV | — | Sim (CI) |
| `FIREBASE_SERVICE_ACCOUNT_PRD` | — | JSON conta de serviço PRD | Sim (CI) |

> Consulte `.env.example` para documentação completa. Nunca commitar `.env.local`.

### Dependências de sistema
- Node.js â‰¥ 20
- npm â‰¥ 11
- Conta no Firebase (gratuita — plano Spark)
- Repositório no GitHub

---

## 5. Deploy

### Fluxo de entrega

```
Desenvolvedor (local)
       â”‚
       â”‚  git push origin dev
       â–¼
GitHub (branch dev)
       â”‚
       â”‚  Trigger: GitHub Actions
       â–¼
CI (Typecheck + Build)
       â”‚
       â”‚  âœ… Aprovado
       â–¼
Deploy HML â†’ Firebase DEV (smart-consulta-dev.web.app)
       â”‚
       â”‚  Equipe valida no HML
       â”‚  git checkout main && git merge dev
       â”‚  git push origin main
       â–¼
GitHub (branch main)
       â”‚
       â”‚  Trigger: GitHub Actions
       â–¼
CI (Typecheck + Build)
       â”‚
       â”‚  âœ… Aprovado
       â–¼
Deploy PRD â†’ Firebase PRD (smart-consulta.web.app)
```

### Pipeline (GitHub Actions)

O arquivo `.github/workflows/ci-deploy.yml` define três jobs:

| Job | Trigger | Ação |
|---|---|---|
| `ci` | Todo push e PR | Instala deps, roda typecheck e build |
| `deploy-hml` | Push em `dev` | Deploy no Firebase Hosting DEV |
| `deploy-prd` | Push em `main` | Deploy no Firebase Hosting PRD |

### Configuração inicial do Firebase Hosting

```bash
# 1. Instalar Firebase CLI
npm install -g firebase-tools

# 2. Login
firebase login

# 3. Ativar Hosting nos dois projetos (DEV e PRD) via Firebase Console
#    Console â†’ Hosting â†’ Primeiros passos

# 4. Gerar Service Account JSON para cada projeto
#    Console â†’ Configurações â†’ Contas de serviço â†’ Gerar nova chave privada

# 5. Adicionar como GitHub Secrets:
#    FIREBASE_SERVICE_ACCOUNT_DEV  â†’ conteúdo do JSON do projeto DEV
#    FIREBASE_SERVICE_ACCOUNT_PRD  â†’ conteúdo do JSON do projeto PRD
#    + variáveis FIREBASE_DEV_* e FIREBASE_PRD_* (chaves do SDK)

# 6. Deploy manual (alternativa ao CI)
cd "smart-consulta"Smart Consulta"smart-consulta"
npm run build
firebase use dev
firebase deploy --only hosting    # â†’ HML
firebase use prod
firebase deploy --only hosting    # â†’ PRD
```

---

## 6. Dados

### Estratégia de carga inicial (seed)
Os dados de demonstração são semeados automaticamente via código no primeiro acesso. Não há script externo de seed.

| Função | Localização | O que semeia |
|---|---|---|
| `seedClinicAdmins()` | `lib/clinic-store.ts` | Conta admin da clínica demo |
| `seedProfessionals()` | `lib/clinic-store.ts` | 4 médicos com especialidades |
| `seedDemoAppointments()` | `lib/global-appointments.ts` | Agendamentos de exemplo |

### Quando os seeds são executados
- `seedClinicAdmins()`: no carregamento da página de login da clínica.
- `seedProfessionals()`: ao autenticar no portal da clínica.
- `seedDemoAppointments()`: ao autenticar no portal da clínica.

### Dados semeados

**Clínica demo:**
- Clínica: Clínica Saúde & Vida
- Login: `clinica@smartconsulta.com` / `admin123`

**Profissionais:**
- Dr. Felipe Moura — Clínica Geral
- Dra. Ana Ribeiro — Cardiologia
- Dr. Lucas Peixoto — Ortopedia
- Dra. Camila Nunes — Dermatologia

### Isolamento de dados
Cada usuário tem seus dados isolados no `localStorage` do próprio navegador. Dados de demonstração não contêm informações pessoais reais.

---

## 7. Segurança

### Práticas aplicadas

| Prática | Implementação |
|---|---|
| Segredos fora do repositório | `.env.local` no `.gitignore`; segredos CI via GitHub Secrets |
| Headers de segurança | `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` em `next.config.ts` |
| Sem dados sensíveis reais | Seeds usam dados fictícios |
| Separação de variáveis | `NEXT_PUBLIC_*` (cliente) vs variáveis servidor (sem prefixo) |
| Autenticação local | Senhas armazenadas apenas em `localStorage` (sem transmissão de rede) |

### O que NÃƒO está no repositório
- Tokens Vercel
- IDs de projeto
- Chaves de API externas
- Senhas de usuários reais

### Limitações conhecidas
- Autenticação via `localStorage` é adequada para protótipo acadêmico, mas não para produção real (sem criptografia de senha no lado cliente).
- Em produção real, seria necessário implementar autenticação server-side (JWT, sessões, OAuth).

---

## 8. Backup e Continuidade

### Estratégia de backup
Os dados estão no `localStorage` do navegador de cada usuário. A Vercel não precisa de backup de banco de dados neste cenário.

| Aspecto | Abordagem |
|---|---|
| Dados do usuário | Locais ao navegador; usuário pode exportar via perfil |
| Código-fonte | Repositório Git (histórico completo) |
| Build | Vercel armazena todos os deploys anteriores |
| Rollback | Vercel permite reverter para qualquer deploy anterior em 1 clique |

### Plano de recuperação

| Falha | Ação |
|---|---|
| Deploy com erro em PRD | Reverter para deploy anterior via painel Vercel |
| Dados corrompidos no navegador | Limpar `localStorage` â†’ seeds recriados automaticamente |
| Repositório inacessível | Vercel mantém o último build publicado funcionando |
| Indisponibilidade da Vercel | Vercel SLA 99,99% com CDN global; migrar para Netlify se necessário |

### Evidência de rollback
O painel da Vercel (Deployments) lista todos os deploys com status, data e opção de "smart-consulta"Promote to Production"smart-consulta" para qualquer versão anterior.

---

## 9. Validação da Implantação

### Checklist pós-deploy

#### Funcionalidades do paciente
- [ ] Página inicial carrega corretamente (Hero, Clínicas, Médicos)
- [ ] Botão "smart-consulta"Criar conta"smart-consulta" abre modal e cadastra usuário
- [ ] Botão "smart-consulta"Entrar"smart-consulta" autentica com dados cadastrados
- [ ] Botão "smart-consulta"Agendar"smart-consulta" abre modal de agendamento
- [ ] Seleção de data e horário funciona
- [ ] Horários já reservados aparecem indisponíveis
- [ ] Agendamento confirmado aparece no perfil
- [ ] Cancelamento de consulta funciona
- [ ] Página `/profile` exibe histórico corretamente
- [ ] Navbar navega corretamente entre seções

#### Portal da clínica (`/clinic/*`)
- [ ] Login com `clinica@smartconsulta.com` / `admin123`
- [ ] Dashboard exibe estatísticas corretas
- [ ] Lista de agendamentos carrega
- [ ] Filtros por status funcionam
- [ ] Ação "smart-consulta"Confirmar"smart-consulta" muda status para "smart-consulta"Confirmado"smart-consulta"
- [ ] Ação "smart-consulta"Marcar realizado"smart-consulta" muda status para "smart-consulta"Realizado"smart-consulta"
- [ ] Modal de detalhes abre com informações corretas
- [ ] Notas são salvas corretamente
- [ ] Lista de profissionais carrega
- [ ] Novo profissional pode ser adicionado
- [ ] Edição de agenda semanal funciona
- [ ] Relatórios exibem dados corretos
- [ ] Configurações salva informações

#### Suporte (`/support`)
- [ ] FAQ accordion abre e fecha
- [ ] Formulário de chamado valida campos obrigatórios
- [ ] Envio do formulário exibe mensagem de sucesso

#### Infraestrutura
- [ ] Health check `/api/health` retorna `{"smart-consulta"status"smart-consulta":"smart-consulta"ok"smart-consulta"}`
- [ ] Banner de ambiente aparece em HML e não em PRD
- [ ] Navegação entre páginas não recarrega a página (SPA)
- [ ] Responsividade funciona em mobile (375px)

### Resultados dos testes
| Área | Status | Observações |
|---|---|---|
| Agendamento (fluxo completo) | âœ… Aprovado | |
| Portal da clínica | âœ… Aprovado | |
| Suporte | âœ… Aprovado | |
| Health check | âœ… Aprovado | |
| Responsividade mobile | âœ… Aprovado | |

---

## 10. Observabilidade, Logs e Monitoramento

### Ferramentas utilizadas

| Ferramenta | Função | Acesso |
|---|---|---|
| Firebase Console â†’ Hosting | Histórico de deploys, status, rollback | console.firebase.google.com |
| GitHub Actions | Logs de build, typecheck e deploy | GitHub â†’ Actions â†’ CI/Deploy |
| Firebase Performance | Tempo de carregamento, Web Vitals | Console â†’ Performance |
| Browser DevTools | Console do cliente, erros de JS | F12 no navegador |
| `localStorage` inspector | Inspecionar dados persistidos | DevTools â†’ Application |

### Indicadores monitorados

| Indicador | Fonte | Alerta |
|---|---|---|
| Status do deploy | GitHub Actions | Falha = notificação no GitHub (ícone vermelho) |
| Disponibilidade (uptime) | Firebase Hosting SLA 99,95% | Console â†’ Hosting |
| Tempo de carregamento | Firebase Performance / DevTools | > 3s = investigar |
| Erros de JS no cliente | Browser DevTools Console | Qualquer `Uncaught Error` |
| Health check | `GET /api/health` â†’ `{"smart-consulta"status"smart-consulta":"smart-consulta"ok"smart-consulta"}` | Status â‰  200 |

### Como acessar os logs

```
Firebase Console (console.firebase.google.com)
  â†’ Selecionar projeto (DEV ou PRD)
  â†’ Hosting
    â†’ Aba "smart-consulta"Histórico de lançamentos"smart-consulta" (lista todos os deploys)
    â†’ Clicar em deploy â†’ ver detalhes e rollback disponível

GitHub (github.com / repositório)
  â†’ Actions â†’ CI/Deploy
    â†’ Selecionar execução â†’ ver logs de cada job
```

### Resposta do health check
```json
{
  "smart-consulta"status"smart-consulta": "smart-consulta"ok"smart-consulta",
  "smart-consulta"app"smart-consulta": "smart-consulta"Smart Consulta"smart-consulta",
  "smart-consulta"platform"smart-consulta": "smart-consulta"Firebase Hosting (static)"smart-consulta"
}
```

---

## Responsabilidades

| Membro | Responsabilidade |
|---|---|
| [Nome 1] | Configuração da Vercel, pipeline CI/CD |
| [Nome 2] | Documentação técnica, plano de implantação |
| [Nome 3] | Validação, testes e manual do usuário |
| [Nome 4] | Desenvolvimento das funcionalidades |

---

## Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| Deploy falhando próximo à apresentação | Baixa | Alto | Manter deploy anterior estável; testar 1 dia antes |
| Dados do localStorage perdidos durante demo | Média | Médio | Seeds recriam automaticamente ao abrir o portal |
| Vercel fora do ar | Muito baixa | Alto | CDN global; SLA 99,99% |
| Segredos expostos no repositório | Baixa | Alto | `.gitignore` configurado; verificar antes de push |

---

*Documento gerado para fins acadêmicos — Projeto Integrador.*
