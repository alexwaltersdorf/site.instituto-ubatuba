# Deploy na Hostinger - Instituto Ubatuba

> ⚠️ **REGRAS INVIOLÁVEIS DE BUILD**: antes de mexer em qualquer configuração
> de build/instalação, leia [`references/hostinger-deploy-rules.md`](references/hostinger-deploy-rules.md).
> Em especial: **nunca** whitelistar `esbuild` em `onlyBuiltDependencies`/`allowBuilds`
> e **nunca** remover `.pnpmfile.cjs`, `scripts/fix-esbuild.cjs` ou o script
> `postinstall` do `package.json`.

## Configurações de Build na Hostinger (estado real do painel, 2026-07-17)

Na seção "Configurações de compilação e saída" do painel da Hostinger:

| Campo | Valor |
|-------|-------|
| **Framework** | Express |
| **Versão do Node** | 22.x |
| **Comando de instalação** | `pnpm install` (o build roda via `postinstall` do package.json) |
| **Entry file** | `dist/index.js` |
| **Diretório raiz** | `./` |

> **Importante:** apesar de o repositório conter `package-lock.json`, o painel
> da Hostinger está configurado com `pnpm install` — é o pnpm que roda no deploy.
> O pnpm v10 pula os build scripts do esbuild (desde que ele NÃO esteja
> whitelistado), e o `postinstall` do projeto gera o `dist/` chamando
> `node scripts/fix-esbuild.cjs && vite build && esbuild ...`.
> O erro `EACCES` histórico acontecia quando o postinstall do esbuild era
> executado no ambiente da Hostinger — ver regras acima.

## Variáveis de Ambiente

Configure as seguintes variáveis no painel da Hostinger (Settings → Environment Variables):

### Obrigatórias para o site funcionar:

| Variável | Descrição |
|----------|-----------|
| `NODE_ENV` | `production` |
| `PORT` | `3000` (ou a porta que a Hostinger atribuir) |
| `DATABASE_URL` | URL de conexão MySQL (ex: `mysql://user:pass@host:3306/dbname?ssl={"rejectUnauthorized":true}`) |
| `JWT_SECRET` | Chave secreta para cookies de sessão (gere uma string aleatória de 64 chars) |

### Para autenticação OAuth (Manus):

| Variável | Descrição |
|----------|-----------|
| `VITE_APP_ID` | ID da aplicação OAuth Manus |
| `OAUTH_SERVER_URL` | `https://api.manus.im` |
| `VITE_OAUTH_PORTAL_URL` | URL do portal de login Manus |
| `OWNER_OPEN_ID` | OpenID do proprietário |
| `OWNER_NAME` | Nome do proprietário |

### Para Stripe (pagamentos):

| Variável | Descrição |
|----------|-----------|
| `STRIPE_SECRET_KEY` | Chave secreta do Stripe |
| `STRIPE_WEBHOOK_SECRET` | Secret do webhook Stripe |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Chave pública do Stripe |

### Para Storage (imagens/arquivos):

| Variável | Descrição |
|----------|-----------|
| `BUILT_IN_FORGE_API_URL` | URL da API de storage Manus |
| `BUILT_IN_FORGE_API_KEY` | Chave da API de storage |
| `VITE_FRONTEND_FORGE_API_URL` | URL da API para o frontend |
| `VITE_FRONTEND_FORGE_API_KEY` | Chave da API para o frontend |

## Banco de Dados

O site usa MySQL/TiDB. Você pode:

1. **Usar o banco da Manus** (recomendado): Copie a `DATABASE_URL` do painel Manus (Settings → Secrets) e cole nas variáveis de ambiente da Hostinger. O banco da Manus é acessível externamente via SSL.

2. **Usar banco MySQL da Hostinger**: Crie um banco MySQL no painel da Hostinger e configure a `DATABASE_URL` no formato: `mysql://usuario:senha@host:3306/nome_banco`

## Fluxo de Deploy Automático

1. Você faz alterações no Manus
2. O Manus salva um checkpoint → sincroniza com GitHub (branch `main`)
3. A Hostinger detecta o push no GitHub e reimplanta automaticamente

## Solução de Problemas

### Build falha com "EACCES" + "esbuild ... install.js" + "Failed to install dependencies"
- Causa: alguém whitelistou o `esbuild` em `onlyBuiltDependencies`/`allowBuilds`
  (`pnpm-workspace.yaml` ou `package.json`), fazendo o pnpm da Hostinger executar
  o postinstall do esbuild — que sempre falha lá com EACCES.
- Correção: **remova o esbuild (e `@esbuild/*`) de qualquer whitelist de builds**
  e faça novo push. O `.pnpmfile.cjs` cuida do lado Manus (ERR_PNPM_IGNORED_BUILDS)
  e o `scripts/fix-esbuild.cjs` cuida do chmod antes do build.
- Referência completa: `references/hostinger-deploy-rules.md`. Deploy bom: commit `486064e`.

### Páginas /cursos/:slug ou /meus-certificados quebram com "TypeError: Invalid URL"
- Causa: `getLoginUrl()` avaliado em render/default parameter sem as envs de
  OAuth (a Hostinger builda sem `VITE_OAUTH_PORTAL_URL`/`VITE_APP_ID`).
- Correção: avaliar `getLoginUrl()` apenas no clique/redirect e manter os
  fallbacks hardcoded em `client/src/const.ts` e `server/_core/env.ts`.

### Build falha com "module not found"
- Verifique se o build command inclui `--include=dev`
- Certifique-se de que a versão do Node é 22.x

### Erro "Cannot find module" ao iniciar
- Verifique se o entry file está como `dist/index.js`
- Verifique se o output directory está como `dist`

### Erro de conexão com banco
- Verifique se a `DATABASE_URL` está correta
- Se usar banco externo, verifique se o IP da Hostinger está liberado no firewall do banco

### Site carrega mas sem dados
- Verifique se `DATABASE_URL` está configurada nas variáveis de ambiente
- O site funciona sem banco (mostra dados demo), mas precisa do banco para posts reais
