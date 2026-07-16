# Deploy na Hostinger - Instituto Ubatuba

## Configurações de Build na Hostinger

Na seção "Configurações de compilação e saída" do painel da Hostinger:

| Campo | Valor |
|-------|-------|
| **Framework** | Express |
| **Versão do Node** | 22.x |
| **Build command** | `npm install --include=dev && npm run build` |
| **Output directory** | `dist` |
| **Entry file** | `dist/index.js` |
| **Diretório raiz** | `.` (raiz) |

> **Importante:** O build command usa `npm install --include=dev` para garantir que as devDependencies (TypeScript, Vite, esbuild, etc.) sejam instaladas antes de compilar.
>
> O script `scripts/fix-esbuild.cjs` é executado automaticamente no início do `npm run build` para corrigir permissões do binário nativo do esbuild (problema EACCES em ambientes onde pnpm ignora build scripts de dependências).

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

### Build falha com "EACCES" ou "spawn esbuild EACCES"
- O script `scripts/fix-esbuild.cjs` já corrige isso automaticamente
- Se persistir, tente usar como build command: `npm install --include=dev && chmod +x node_modules/.pnpm/@esbuild+linux-x64@*/node_modules/@esbuild/linux-x64/bin/esbuild && npm run build`

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
