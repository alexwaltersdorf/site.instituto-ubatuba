# Regras de conteúdo editorial (matérias / notícias)

Aplica-se a qualquer matéria publicada em `institutoubatuba.org/noticias` —
seja escrita à mão, gerada por IA (Claude/Manus) ou inserida por seed.

---

## ⚠️ REGRA 1 — O leitor NUNCA pode ver marcação Markdown

Nenhum símbolo de marcação (`#`, `##`, `###`, `**`, `*`, `-`, `>`, `---`)
pode aparecer como texto na tela. Eles existem apenas no banco, como formato
de armazenamento, e são convertidos em HTML de verdade na renderização.

**Como isso é garantido:** o componente
[`client/src/components/MarkdownContent.tsx`](../client/src/components/MarkdownContent.tsx)
converte o Markdown em elementos React (títulos, negrito, itálico, código,
listas, citações, separadores e links). Ele é usado em
`client/src/pages/NoticiaDetalhe.tsx`.

**O que NÃO fazer:**

- ❌ Não renderizar `post.content` direto dentro de `<p>` (era o bug antigo:
  o conteúdo era quebrado em `\n\n` e exibido como texto puro, então o leitor
  via `## Título` e `**negrito**` na tela).
- ❌ Não usar `dangerouslySetInnerHTML` para "resolver" isso — abre risco de
  XSS. O `MarkdownContent` monta nós React, o texto nunca vira HTML cru.
- ❌ Não remover a marcação do conteúdo salvo no banco: o Markdown é a fonte
  da formatação (títulos e negritos). Sem ele, a matéria vira um bloco de
  texto sem hierarquia.

**Ao criar uma nova página que exiba conteúdo de post:** use sempre
`<MarkdownContent content={post.content} />`.

### Sintaxe suportada

| Markdown | Vira |
|---|---|
| `## Título` / `### Subtítulo` | `<h2>` / `<h3>` estilizados |
| `**texto**` | negrito |
| `*texto*` | itálico |
| `` `código` `` | código inline |
| `- item` | lista com marcador |
| `1. item` | lista numerada |
| `> citação` | bloco de citação |
| `---` | separador horizontal |
| `[texto](https://...)` | link (só http/https/mailto/`/`) |

### Título duplicado

O cabeçalho da página já exibe o `title` do post. Por isso o renderizador
**ignora o primeiro `# Título`** do conteúdo. Pode-se manter o `# Título` no
Markdown (bom para leitura do arquivo-fonte) sem duplicar na tela.

---

## REGRA 2 — Toda matéria precisa de fonte

Dados, números e datas devem vir de fonte oficial e ser citados no fim da
matéria, em uma seção `## Fontes`. Nunca inventar número, percentual ou data.

---

## REGRA 3 — Como publicar uma matéria nova

As matérias são publicadas automaticamente pelo servidor, sem acesso manual
ao banco:

1. Adicionar o objeto da matéria em [`server/seed-posts.ts`](../server/seed-posts.ts)
   (slug, title, excerpt, content em Markdown, coverImage, category, tags).
2. Colocar a imagem de capa em `client/public/noticias-img/<slug>.jpg`
   (recomendado 1200×675, 16:9).
3. Commit + push em `main`. No boot, o servidor publica o que ainda não existe.

A rotina é **idempotente** (checa por slug, não duplica) e qualquer falha é
apenas logada — nunca derruba o site.
