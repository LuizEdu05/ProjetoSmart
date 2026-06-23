# Smart Consulta

Plataforma web de agendamento de consultas mÃ©dicas. Permite que pacientes encontrem clÃ­nicas e mÃ©dicos, agendem horÃ¡rios e gerenciem seus atendimentos. ClÃ­nicas acessam um painel administrativo para gerenciar profissionais, agendamentos e relatÃ³rios.

## Links

| Ambiente | URL |
|---|---|
| **ProduÃ§Ã£o (PRD)** | https://smart-consulta.web.app |
| **HomologaÃ§Ã£o (HML)** | https://smart-consulta-dev.web.app |
| **Health Check (PRD)** | https://smart-consulta.web.app/api/health |
| **RepositÃ³rio** | https://github.com/seu-usuario/smart-consulta |

## Credenciais de demonstraÃ§Ã£o

**Paciente (site principal)**
- Cadastre uma conta nova em "Criar conta" ou use qualquer e-mail + senha na tela de registro.

**ClÃ­nica (portal administrativo â€” `/clinic/login`)**
- E-mail: `clinica@smartconsulta.com`
- Senha: `admin123`

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router) |
| Linguagem | TypeScript 5 |
| Estilo | Tailwind CSS v4 |
| Componentes | shadcn/ui + Radix UI |
| AnimaÃ§Ãµes | Framer Motion |
| Monorepo | Turborepo |
| PersistÃªncia | Firebase (Firestore) + localStorage |
| Hospedagem | Firebase Hosting |
| CI/CD | GitHub Actions |

## Estrutura do repositÃ³rio

```
Smart Consulta/
â”œâ”€â”€ apps/
â”‚   â””â”€â”€ web/                  # AplicaÃ§Ã£o Next.js principal
â”‚       â”œâ”€â”€ app/              # Rotas (App Router)
â”‚       â”‚   â”œâ”€â”€ clinic/       # Portal da clÃ­nica
â”‚       â”‚   â”œâ”€â”€ profile/      # Perfil do paciente
â”‚       â”‚   â”œâ”€â”€ support/      # Central de suporte
â”‚       â”‚   â””â”€â”€ api/health/   # Health check endpoint
â”‚       â”œâ”€â”€ components/       # Componentes da aplicaÃ§Ã£o
â”‚       â”œâ”€â”€ context/          # Contextos React (auth, toast, booking)
â”‚       â””â”€â”€ lib/              # LÃ³gica de negÃ³cio e stores
â”œâ”€â”€ packages/
â”‚   â””â”€â”€ ui/                   # Biblioteca de componentes compartilhados
â”œâ”€â”€ docs/
â”‚   â”œâ”€â”€ plano-implantacao.md  # Plano tÃ©cnico de implantaÃ§Ã£o
â”‚   â””â”€â”€ manual-usuario.md     # Manual do usuÃ¡rio final
â”œâ”€â”€ .github/workflows/        # Pipelines CI/CD
â”œâ”€â”€ .env.example              # Template de variÃ¡veis de ambiente
â””â”€â”€ vercel.json               # ConfiguraÃ§Ã£o de deploy
```

## Executar localmente

### PrÃ©-requisitos
- Node.js 20+
- npm 11+

### InstalaÃ§Ã£o

```bash
# Clone o repositÃ³rio
git clone https://github.com/seu-usuario/smart-consulta.git
cd "smart-consulta/Smart Consulta"

# Instale as dependÃªncias
npm install

# Copie as variÃ¡veis de ambiente
cp .env.example .env.local
# Edite .env.local conforme necessÃ¡rio

# Execute em modo desenvolvimento
npm run dev
```

Acesse `http://localhost:3000`.

### Scripts disponÃ­veis

| Comando | DescriÃ§Ã£o |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Build de produÃ§Ã£o |
| `npm run typecheck` | Verifica tipos TypeScript |
| `npm run lint` | Executa ESLint |

## VariÃ¡veis de ambiente

Consulte `.env.example` para a lista completa. As principais:

| VariÃ¡vel | DEV/HML | PRD |
|---|---|---|
| `NEXT_PUBLIC_APP_ENV` | `preview` | `production` |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | chave do projeto DEV | chave do projeto PRD |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `smart-consulta-dev` | `smart-consulta` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `...dev-hp-20260407.firebaseapp.com` | `...prd-hp-260407.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | ID do app DEV | ID do app PRD |

> **SeguranÃ§a:** As chaves Firebase `NEXT_PUBLIC_*` sÃ£o chaves de cliente, projetadas para serem pÃºblicas. A seguranÃ§a Ã© garantida pelas Firebase Security Rules no console. Nunca coloque chaves de conta de serviÃ§o (service account) em variÃ¡veis `NEXT_PUBLIC_`.

> Cada ambiente aponta para um projeto Firebase diferente, garantindo isolamento completo de dados.

## Deploy no Firebase Hosting

### Via GitHub Actions (pipeline automatizado â€” recomendado)

Configure os seguintes segredos no repositÃ³rio GitHub (Settings â†’ Secrets â†’ Actions):

| Segredo | Ambiente | Como obter |
|---|---|---|
| `FIREBASE_SERVICE_ACCOUNT_DEV` | HML | Firebase Console â†’ ConfiguraÃ§Ãµes â†’ Contas de serviÃ§o â†’ Gerar chave privada |
| `FIREBASE_SERVICE_ACCOUNT_PRD` | PRD | Firebase Console (projeto PRD) â†’ mesma sequÃªncia |
| `FIREBASE_DEV_API_KEY` | HML | Firebase Console DEV â†’ ConfiguraÃ§Ãµes do projeto â†’ SDK |
| `FIREBASE_DEV_PROJECT_ID` | HML | `smart-consulta-dev` |
| `FIREBASE_PRD_API_KEY` | PRD | Firebase Console PRD â†’ ConfiguraÃ§Ãµes do projeto â†’ SDK |
| `FIREBASE_PRD_PROJECT_ID` | PRD | `smart-consulta` |
| *(demais variÃ¡veis Firebase)* | â€” | Mesma fonte: Firebase Console â†’ SDK config |

### Via CLI (manual)

```bash
npm install -g firebase-tools
firebase login

# Deploy no ambiente DEV/HML
firebase use dev
npm run build
firebase deploy --only hosting

# Deploy no ambiente PRD
firebase use prod
npm run build
firebase deploy --only hosting
```

## Arquitetura de dados

Esta versÃ£o utiliza `localStorage` do navegador como camada de persistÃªncia. NÃ£o hÃ¡ servidor de banco de dados â€” os dados vivem no navegador de cada usuÃ¡rio.

| Chave localStorage | ConteÃºdo |
|---|---|
| `sc_session` | SessÃ£o do paciente logado |
| `sc_users` | UsuÃ¡rios cadastrados |
| `sc_clinic_session` | SessÃ£o da clÃ­nica logada |
| `sc_clinic_admins` | Admins de clÃ­nicas |
| `sc_professionals` | Profissionais cadastrados |
| `sc_global_appointments` | Todos os agendamentos |
| `sc_support_tickets` | Tickets de suporte |

## SeguranÃ§a

- Nenhum segredo ou chave privada estÃ¡ no repositÃ³rio.
- `.env.local` estÃ¡ no `.gitignore`.
- Headers de seguranÃ§a configurados em `next.config.ts`.
- Dados de demonstraÃ§Ã£o nÃ£o contÃªm informaÃ§Ãµes pessoais reais.

## DocumentaÃ§Ã£o adicional

- [Plano de ImplantaÃ§Ã£o](docs/plano-implantacao.md)
- [Manual do UsuÃ¡rio](docs/manual-usuario.md)
