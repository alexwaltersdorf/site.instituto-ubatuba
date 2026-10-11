# Deploy na Hostinger - Instituto Ubatuba

> ⚠️ **REGRAS INVIOLÁVEIS DE BUILD**: antes de mexer em qualquer configuração
> de build/instalação, leia [`references/hostinger-deploy-rules.md`](references/hostinger-deploy-rules.md).
> Em especial: **nunca** whitelistar `esbuild` com valor `true` em
> `onlyBuiltDependencies`/`allowBuilds` e **nunca** remover `.pnpmfile.cjs`,
> `scripts/fix-esbuild.cjs` ou o script `postinstall` do `package.json`.

> 🖼️ **Imagens e PDFs**: o site referencia ~130 arquivos em `/manus-storage/`,
> hospedados no storage da Manus, que **parou de responder** (credencial do
> projeto invalidada). Leia [`references/imagens-e-storage.md`](references/imagens-e-storage.md)
> antes de mexer em assets.

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
> whitelistado com `true`), e o `postinstall` do projeto gera o `dist/` chamando
> `node scripts/fix-esbuild.cjs && vite build && esbuild ...`.
> O erro `EACCES` histórico acontecia quando o postinstall do esbuild era
> executado no ambiente da Hostinger — ver regras acima.

> **`client/public/` → `dist/public/`**: o `vite build` copia o `publicDir`
> inteiro para o `outDir` (com `emptyOutDir: true`). Qualquer arquivo commitado
> em `client/public/` é publicado estaticamente na raiz do site. É o caminho
> certo para assets novos.

## Variáveis de Ambiente

Configure as seguintes variáveis no painel da Hostinger (Settings → Environment Variables):

### Obrigatórias para o site funcionar:

| Variável | Descrição |
|----------|-----------|
| `NODE_ENV` | `production` |
| `PORT` | `3000` (ou a porta que a Hostinger atribuir) |
| `DATABASE_URL` | MySQL do plano da Hostinger (ver seção "Banco de Dados") |
| `JWT_SECRET` | Chave secreta para cookies de sessão (gere uma string aleatória de 64 chars) |

### Para autenticação OAuth (Manus):

| Variável | Descrição |
|----------|-----------|
| `VITE_APP_ID` | ID da aplicação OAuth Manus |
| `OAUTH_SERVER_URL` | `https://api.manus.im` |
| `VITE_OAUTH_PORTAL_URL` | URL do portal de login Manus |
| `OWNER_OPEN_ID` | OpenID do proprietário |
| `OWNER_NAME` | Nome do proprietário |

> ⚠️ Na prática **a Hostinger não tem nenhuma `VITE_*` configurada** — o build lá
> roda sem elas (é por isso que existem os fallbacks hardcoded da Regra 3 em
> `client/src/const.ts` e `server/_core/env.ts`). Consequência: código novo no
> client **não pode depender** de `import.meta.env.VITE_*` estar definido; sai
> `undefined` no bundle publicado.

### Para Stripe (pagamentos):

| Variável | Descrição |
|----------|-----------|
| `STRIPE_SECRET_KEY` | Chave secreta do Stripe |
| `STRIPE_WEBHOOK_SECRET` | Secret do webhook Stripe |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Chave pública do Stripe |

### Para Storage (imagens/arquivos) — ⚠️ atualmente quebrado

| Variável | Descrição |
|----------|-----------|
| `BUILT_IN_FORGE_API_URL` | `https://forge.butterfly-effect.dev` |
| `BUILT_IN_FORGE_API_KEY` | Chave da API de storage da Manus |
| `VITE_FRONTEND_FORGE_API_URL` | URL da API para o frontend (usada só pelo `Map.tsx`) |
| `VITE_FRONTEND_FORGE_API_KEY` | Chave para o frontend (não configurada na Hostinger) |

**Estado em out/2026:** a chave *está* configurada na Hostinger, mas o Forge a
rejeita com `401 {"code":16,"message":"invalid project credential"}`. Resultado:
todos os `/manus-storage/*` passaram a falhar e o site ficou sem imagem nenhuma.

Mitigação já aplicada: `server/_core/storageProxy.ts` serve
`client/public/manus-storage/` **antes** do proxy, então dá para migrar os
arquivos para o repo um a um. Inventário do que falta e procedimento:
[`references/imagens-e-storage.md`](references/imagens-e-storage.md).

## Banco de Dados

O site usa o **MySQL do plano da Hostinger** (desde o commit `bf68b75`, 2026-07-18).

Detalhe que já custou caro: o Web App Node roda em um **container separado** do
MySQL, então `localhost` não resolve. O host correto é `srv722.hstgr.io`
(hPanel → Bancos de dados → MySQL remoto). O `server/db.ts` já reescreve
`localhost` para esse host automaticamente e normaliza `DATABASE_URL` com `@`
sem encoding na senha (causa histórica de erro 500 nas queries).

> O banco da Manus **não é mais usado**. Versões anteriores deste documento
> mandavam copiar a `DATABASE_URL` do painel da Manus — não faça isso.

Restrição conhecida: `information_schema` é bloqueado nesse banco, então a
verificação de schema das tabelas de aluno é feita por `SELECT` com fallback de
recriação.

## Fluxo de Deploy Automático

Todo push na branch `main` dispara um build na Hostinger. Há dois caminhos:

1. **Push direto no GitHub** (fluxo atual) — commit + `git push origin main`.
2. **Via Manus** — o Manus salva um checkpoint e sincroniza com a `main`.
   Último checkpoint do Manus: 2026-07-22. Se voltar a usar o Manus,
   **sincronize antes**, para não sobrescrever o que foi commitado direto.

Se o build falhar na Hostinger, o site **não** recebe as alterações e fica preso
na última versão boa.

## Checklist antes do push

```bash
npx tsc --noEmit    # typecheck
npx vitest run      # 18 testes
npm run build       # vite build + esbuild do servidor
```

Não commitar `dist/` — ele é regerado pelo `postinstall` no deploy, e nenhum
commit do histórico recente o inclui.

## Solução de Problemas

### Site sem nenhuma imagem (todas quebradas)
- Causa provável: `/manus-storage/*` falhando — credencial do Forge da Manus
  inválida. Confirme com:
  `curl -s -o /dev/null -w "%{http_code}" https://institutoubatuba.org/manus-storage/<chave>`
- Correção: ver [`references/imagens-e-storage.md`](references/imagens-e-storage.md)
  — repor o arquivo em `client/public/manus-storage/`, ou renovar a credencial e
  rodar `node scripts/resgatar-assets-manus.mjs`.

### Build falha com "EACCES" + "esbuild ... install.js" + "Failed to install dependencies"
- Causa: alguém whitelistou o `esbuild` com `true` em `onlyBuiltDependencies`/`allowBuilds`
  (`pnpm-workspace.yaml` ou `package.json`), fazendo o pnpm da Hostinger executar
  o postinstall do esbuild — que sempre falha lá com EACCES.
- Correção: **remova o esbuild (e `@esbuild/*`) de qualquer whitelist com `true`**
  e faça novo push. Entradas com valor `false` são corretas e devem permanecer:
  são elas que evitam o `ERR_PNPM_IGNORED_BUILDS` sem executar nada.
- Referência completa: `references/hostinger-deploy-rules.md`. Deploy bom: commit `486064e`.

### Páginas /cursos/:slug ou /meus-certificados quebram com "TypeError: Invalid URL"
- Causa: `getLoginUrl()` avaliado em render/default parameter sem as envs de
  OAuth (a Hostinger builda sem `VITE_OAUTH_PORTAL_URL`/`VITE_APP_ID`).
- Correção: avaliar `getLoginUrl()` apenas no clique/redirect e manter os
  fallbacks hardcoded em `client/src/const.ts` e `server/_core/env.ts`.

### Build falha com "module not found"
- Certifique-se de que a versão do Node é 22.x
- Confira se a dependência não está só em `devDependencies` sendo usada em runtime

### Erro "Cannot find module" ao iniciar
- Verifique se o entry file está como `dist/index.js`
- Verifique se o output directory está como `dist`

### Erro de conexão com banco
- O host correto é `srv722.hstgr.io`, não `localhost`
- Confira a senha na `DATABASE_URL` (o `server/db.ts` normaliza `@` sem encoding, mas verifique)
- Se usar banco externo, verifique se o IP da Hostinger está liberado no firewall do banco

### Site carrega mas sem dados
- Verifique se `DATABASE_URL` está configurada nas variáveis de ambiente
- O site funciona sem banco (mostra dados demo), mas precisa do banco para posts reais
