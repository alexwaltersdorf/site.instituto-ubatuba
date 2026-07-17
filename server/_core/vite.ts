import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";
import { getRouteMetadata } from "./routes-metadata";

/**
 * Injeta meta tags SEO no HTML baseado na rota solicitada.
 * Isso garante que crawlers (Google, Facebook, Twitter) recebam
 * as meta tags corretas mesmo sem executar JavaScript.
 */
function injectSEOMetaTags(html: string, url: string): string {
  const metadata = getRouteMetadata(url);

  // Substituir o <title> existente
  html = html.replace(
    /<title>.*?<\/title>/,
    `<title>${metadata.title}</title>`
  );

  // Substituir a meta description existente
  html = html.replace(
    /<meta name="description" content="[^"]*" \/>/,
    `<meta name="description" content="${escapeHtml(metadata.description)}" />`
  );

  // Montar as meta tags adicionais de SEO
  const seoTags = `
    <meta name="keywords" content="${escapeHtml(metadata.keywords)}" />
    <link rel="canonical" href="${metadata.canonical}" />
    <meta property="og:title" content="${escapeHtml(metadata.ogTitle)}" />
    <meta property="og:description" content="${escapeHtml(metadata.ogDescription)}" />
    <meta property="og:image" content="${metadata.ogImage}" />
    <meta property="og:url" content="${metadata.canonical}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Instituto Ubatuba Santuário Ecológico" />
    <meta property="og:locale" content="pt_BR" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(metadata.ogTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(metadata.ogDescription)}" />
    <meta name="twitter:image" content="${metadata.ogImage}" />
    <meta name="robots" content="index, follow" />
    <meta name="author" content="Instituto Ubatuba Santuário Ecológico" />
    <meta name="geo.region" content="BR-SP" />
    <meta name="geo.placename" content="Ubatuba" />`;

  // Inserir antes do </head>
  html = html.replace("</head>", `${seoTags}\n  </head>`);

  return html;
}

/**
 * Escapa caracteres HTML para uso em atributos
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );

      // Injetar meta tags SEO baseado na URL
      template = injectSEOMetaTags(template, url);

      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "public")
      : path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  // Also inject SEO meta tags for production
  app.use("*", (req, res) => {
    const indexPath = path.resolve(distPath, "index.html");
    let html = fs.readFileSync(indexPath, "utf-8");
    html = injectSEOMetaTags(html, req.originalUrl);
    res.status(200).set({ "Content-Type": "text/html" }).end(html);
  });
}
