# REGRAS DE DEPLOY — HOSTINGER (institutoubatuba.org)

> **Para o agente (Manus/IA): leia e obedeça este arquivo ANTES de alterar
> qualquer arquivo de configuração de build ou de fazer push.**
> Este site tem deploy automático: todo push em `main` dispara um build na
> Hostinger. Se o build falhar lá, o site NÃO recebe as alterações e fica
> preso na última versão boa. Em 2026-07-17 mais de 20 deploys consecutivos
> falharam por violação da Regra 1 abaixo — não repita.

## Como a Hostinger builda este site

- Web App Node.js (Node 22), usuário `u666428935`, entrada: `dist/index.js`.
- Comando de instalação (fixado no hPanel): `pnpm install`.
- O build acontece via script `postinstall` do `package.json`
  (`node scripts/fix-esbuild.cjs && vite build && esbuild server/_core/index.ts ...`).
- **A Hostinger NÃO carrega `.pnpmfile.cjs`** (pnpmfile desabilitado lá).
- **A Hostinger NÃO executa binários dentro de postinstall de dependências**:
  qualquer build script de dependência que faça `spawnSync` de um binário
  (caso do `install.js` do esbuild) morre com `EACCES` e derruba o
  `pnpm install` inteiro → deploy falha com "Failed to install dependencies".

## REGRA 1 — NUNCA whitelistar o esbuild para build scripts

**PROIBIDO** adicionar `esbuild` ou `@esbuild/*` em:
- `pnpm-workspace.yaml` → `onlyBuiltDependencies` ou `allowBuilds`
- `package.json` → `pnpm.onlyBuiltDependencies`

Isso faz o pnpm da Hostinger executar o postinstall do esbuild → `EACCES`
→ TODOS os deploys falham até reverter.

Se o ambiente Manus reclamar de `ERR_PNPM_IGNORED_BUILDS` para o esbuild:
**a solução já existe** — o `.pnpmfile.cjs` na raiz remove os scripts do
esbuild na resolução (nada a executar, nada a ignorar). Não delete esse
arquivo e não "conserte" o aviso via whitelist.

Estado correto do `pnpm-workspace.yaml` (não adicionar esbuild):

```yaml
onlyBuiltDependencies:
  - "@tailwindcss/oxide"

allowBuilds:
  "@tailwindcss/oxide": true

overrides:
  "tailwindcss>nanoid": "3.3.7"
```

## REGRA 2 — Não tocar nestes arquivos sem necessidade absoluta

- `.pnpmfile.cjs` — remove os install scripts do esbuild (compatibilidade
  Manus × Hostinger). NÃO deletar, NÃO renomear.
- `scripts/fix-esbuild.cjs` — aplica `chmod +x` nos binários do esbuild
  antes de todo build (é o 1º passo dos scripts `build` e `postinstall`).
  NÃO remover da cadeia de build.
- `.npmrc` — deve conter apenas `legacy-peer-deps=true`. NÃO adicionar
  `enable-pre-post-scripts=false` (já foi tentado; não corrige o EACCES e
  arrisca suprimir o postinstall do próprio projeto, que é quem builda).
- `package.json` → scripts `build`, `postinstall` e `start`: a Hostinger
  depende exatamente dessa estrutura (install → postinstall builda → start
  serve `dist/index.js`). Não remover o `postinstall`.

## REGRA 3 — OAuth fora da plataforma Manus

Na Hostinger NÃO existem as envs `VITE_OAUTH_PORTAL_URL`, `VITE_APP_ID` e
`OAUTH_SERVER_URL`. Por isso:

- `client/src/const.ts` (`getLoginUrl`) tem fallbacks hardcoded:
  portal `https://manus.im`, appId `6EwoPvwoUEAd368Wyozqqt`.
- `server/_core/env.ts` tem fallback `OAUTH_SERVER_URL=https://api.manus.im`.
- `client/src/_core/hooks/useAuth.ts`: `getLoginUrl()` NÃO pode ser avaliado
  como default parameter nem em render — só no momento do clique/redirect.
  (Avaliar no render derruba as páginas /cursos/:slug e /meus-certificados
  com `TypeError: Invalid URL` no ErrorBoundary.)

**Mantenha esses fallbacks** ao mexer em autenticação. Qualquer código novo
que use env `VITE_*` no client deve tolerar a env ausente (a Hostinger
builda sem elas).

## REGRA 4 — Antes de dar push, simule o fluxo da Hostinger

```bash
rm -rf node_modules dist
pnpm install   # NÃO pode rodar nenhum "esbuild ... postinstall$ node install.js"
               # e deve terminar gerando dist/ via postinstall do projeto
pnpm test      # 18+ testes passando
```

Se aparecer qualquer linha `.../esbuild@X/node_modules/esbuild postinstall$`,
a Regra 1 foi violada — corrija antes do push.

## Se um deploy falhar na Hostinger

1. hPanel → site institutoubatuba.org → **Implantações** → abrir a falha e
   ler "Registros de compilação".
2. `EACCES ... esbuild ... install.js` → violação da Regra 1: remova o
   esbuild de qualquer whitelist de builds e faça novo push.
3. `ERROR: Failed to install dependencies` sem esbuild no log → conferir
   `.npmrc`, lockfiles e a Regra 2.
4. O deploy bom de referência é o commit `486064e` (2026-07-17); a receita
   de build é a mesma desde `277621c5`.

## Histórico (para contexto)

- `277621c5` — 1º fix que destravou o build (postinstall chamando
  vite/esbuild direto + fix-esbuild.cjs). 4 deploys OK.
- `851c38c3` — reintroduziu whitelist do esbuild (`pnpm-workspace.yaml`)
  para curar ERR_PNPM_IGNORED_BUILDS no Manus → quebrou TODOS os deploys
  Hostinger seguintes (20+ falhas, site preso em `5bf15176` sem os Cursos).
- `1947649` + `486064e` (2026-07-17) — correção definitiva: whitelist limpa
  + `.pnpmfile.cjs` + fallbacks de OAuth + fix do crash `Invalid URL`.
