import { type ReactNode } from "react";

/**
 * Renderizador de Markdown das matérias (sem dependência externa).
 *
 * O conteúdo dos posts é escrito em Markdown. Este componente converte a
 * marcação em elementos React de verdade — títulos, negrito, listas, links e
 * separadores — para que os símbolos (##, **, -) NUNCA apareçam no site.
 *
 * Suporta: # ## ###, **negrito**, *itálico*, `código`, - lista, 1. lista
 * numerada, > citação, --- separador e [texto](link).
 *
 * Não usa dangerouslySetInnerHTML: o texto é sempre tratado como dado, o que
 * elimina risco de XSS. Links só são criados para http(s) e mailto.
 */

function isSafeHref(href: string) {
  return /^(https?:\/\/|mailto:|\/)/i.test(href.trim());
}

/** Converte marcação inline (negrito, itálico, código, link) em nós React. */
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|\*[^*\n]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
    const token = match[0];
    const key = `${keyPrefix}-i${i++}`;

    if (token.startsWith("**")) {
      nodes.push(
        <strong key={key} className="font-semibold text-foreground">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("`")) {
      nodes.push(
        <code key={key} className="px-1.5 py-0.5 rounded bg-accent text-accent-foreground text-[0.9em]">
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith("[")) {
      const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token);
      if (link && isSafeHref(link[2])) {
        nodes.push(
          <a
            key={key}
            href={link[2]}
            target={link[2].startsWith("/") ? undefined : "_blank"}
            rel="noopener noreferrer"
            className="text-ocean underline underline-offset-2 hover:opacity-80"
          >
            {link[1]}
          </a>
        );
      } else {
        nodes.push(link ? link[1] : token);
      }
    } else {
      nodes.push(<em key={key}>{token.slice(1, -1)}</em>);
    }
    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

export function MarkdownContent({ content }: { content: string }) {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];

  let paragraph: string[] = [];
  let listItems: string[] = [];
  let listOrdered = false;
  let quote: string[] = [];
  let key = 0;
  // A página já exibe o título do post no cabeçalho: o primeiro "# " do
  // conteúdo é ignorado para não duplicar o título na tela.
  let firstHeadingSkipped = false;

  const flushParagraph = () => {
    if (!paragraph.length) return;
    const text = paragraph.join(" ");
    blocks.push(
      <p key={`p${key++}`} className="text-base leading-[1.8] text-muted-foreground">
        {renderInline(text, `p${key}`)}
      </p>
    );
    paragraph = [];
  };

  const flushList = () => {
    if (!listItems.length) return;
    const items = listItems.map((item, i) => (
      <li key={i} className="leading-[1.8]">
        {renderInline(item, `l${key}-${i}`)}
      </li>
    ));
    blocks.push(
      listOrdered ? (
        <ol key={`ol${key++}`} className="list-decimal pl-6 space-y-2 text-base text-muted-foreground">
          {items}
        </ol>
      ) : (
        <ul key={`ul${key++}`} className="list-disc pl-6 space-y-2 text-base text-muted-foreground">
          {items}
        </ul>
      )
    );
    listItems = [];
  };

  const flushQuote = () => {
    if (!quote.length) return;
    blocks.push(
      <blockquote
        key={`q${key++}`}
        className="border-l-4 border-forest/30 pl-6 italic text-muted-foreground"
      >
        {renderInline(quote.join(" "), `q${key}`)}
      </blockquote>
    );
    quote = [];
  };

  const flushAll = () => {
    flushParagraph();
    flushList();
    flushQuote();
  };

  for (const raw of lines) {
    const line = raw.trim();

    if (!line) {
      flushAll();
      continue;
    }

    // Separador ---
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line)) {
      flushAll();
      blocks.push(<hr key={`hr${key++}`} className="border-border/60 my-8" />);
      continue;
    }

    // Títulos # ## ###
    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading) {
      flushAll();
      const level = heading[1].length;
      const text = heading[2];
      if (level === 1 && !firstHeadingSkipped) {
        firstHeadingSkipped = true; // já exibido no cabeçalho da página
        continue;
      }
      const cls =
        level <= 2
          ? "text-2xl md:text-3xl font-bold text-forest mt-10 mb-3"
          : "text-xl md:text-2xl font-semibold text-forest mt-8 mb-2";
      const Tag = (level <= 2 ? "h2" : "h3") as "h2" | "h3";
      blocks.push(
        <Tag key={`h${key++}`} className={cls}>
          {renderInline(text, `h${key}`)}
        </Tag>
      );
      continue;
    }

    // Citação >
    if (/^>\s?/.test(line)) {
      flushParagraph();
      flushList();
      quote.push(line.replace(/^>\s?/, ""));
      continue;
    }

    // Lista numerada 1. 2. 3.
    const ordered = /^\d+[.)]\s+(.*)$/.exec(line);
    if (ordered) {
      flushParagraph();
      flushQuote();
      if (!listOrdered) flushList();
      listOrdered = true;
      listItems.push(ordered[1]);
      continue;
    }

    // Lista com marcador - ou *
    const bullet = /^[-*+]\s+(.*)$/.exec(line);
    if (bullet) {
      flushParagraph();
      flushQuote();
      if (listOrdered) flushList();
      listOrdered = false;
      listItems.push(bullet[1]);
      continue;
    }

    // Parágrafo comum
    flushList();
    flushQuote();
    paragraph.push(line);
  }

  flushAll();
  return <div className="space-y-4">{blocks}</div>;
}
