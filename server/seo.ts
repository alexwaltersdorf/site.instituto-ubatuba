/**
 * SEO Routes - Sitemap.xml e Robots.txt
 * 
 * Gera dinamicamente o sitemap.xml e robots.txt para o site.
 * O sitemap inclui todas as rotas estáticas + posts publicados do banco de dados.
 */
import { type Express } from "express";
import { getDb } from "./db";
import { posts } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { getAllStaticRoutes, SITE_URL } from "./_core/routes-metadata";

export function registerSEORoutes(app: Express) {
  /**
   * GET /robots.txt
   * Instruções para crawlers de motores de busca.
   */
  app.get("/robots.txt", (_req, res) => {
    const robotsTxt = `User-agent: *
Allow: /

# Bloquear rotas internas
Disallow: /api/
Disallow: /obrigado

# Sitemap
Sitemap: ${SITE_URL}/sitemap.xml
`;
    res.set("Content-Type", "text/plain");
    res.set("Cache-Control", "public, max-age=86400"); // Cache 24h
    res.send(robotsTxt);
  });

  /**
   * GET /sitemap.xml
   * Sitemap dinâmico com rotas estáticas + posts publicados.
   */
  app.get("/sitemap.xml", async (_req, res) => {
    try {
      // Rotas estáticas definidas em routes-metadata.ts
      const staticRoutes = getAllStaticRoutes();

      // Posts publicados do banco de dados
      let dynamicUrls: Array<{ loc: string; lastmod: string; changefreq: string; priority: number }> = [];
      try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        const publishedPosts = await db
          .select({
            slug: posts.slug,
            updatedAt: posts.updatedAt,
          })
          .from(posts)
          .where(eq(posts.published, true));

        dynamicUrls = publishedPosts.map((post: { slug: string; updatedAt: Date | null }) => ({
          loc: `${SITE_URL}/noticias/${post.slug}`,
          lastmod: post.updatedAt
            ? new Date(post.updatedAt).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          changefreq: "monthly",
          priority: 0.7,
        }));
      } catch {
        // Se o banco não estiver disponível, continuar sem posts dinâmicos
        console.warn("[SEO] Could not fetch posts for sitemap, continuing with static routes only");
      }

      const today = new Date().toISOString().split("T")[0];

      // Gerar XML
      const urls = [
        ...staticRoutes.map((route) => ({
          loc: route.metadata.canonical,
          lastmod: today,
          changefreq: route.metadata.changefreq,
          priority: route.metadata.priority,
        })),
        ...dynamicUrls,
      ];

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls
  .map(
    (url) => `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

      res.set("Content-Type", "application/xml");
      res.set("Cache-Control", "public, max-age=3600"); // Cache 1h
      res.send(xml);
    } catch (error) {
      console.error("[SEO] Error generating sitemap:", error);
      res.status(500).send("Error generating sitemap");
    }
  });
}

/**
 * Escapa caracteres especiais para XML
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
