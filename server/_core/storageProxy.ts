import path from "path";
import express, { type Express } from "express";

// Diretorio publico servido em producao (mesma resolucao usada por serveStatic).
function resolvePublicDir(): string {
  return process.env.NODE_ENV === "development"
    ? path.resolve(import.meta.dirname, "../..", "dist", "public")
    : path.resolve(import.meta.dirname, "public");
}

/**
 * Serve os assets historicamente referenciados como /manus-storage/<chave>.
 *
 * Esses arquivos moravam no storage da Manus (Forge) e eram entregues por
 * redirect assinado. O projeto na Manus foi encerrado (out/2026): a credencial
 * nao existe mais e o conteudo de la e irrecuperavel. O proxy foi removido
 * porque so gerava uma chamada HTTP inutil a uma API morta a cada requisicao.
 *
 * Agora os arquivos vem do repo, de client/public/manus-storage/, que o
 * vite build copia para dist/public/. Para repor um asset que falta, basta
 * commitar o arquivo com o nome exato da chave. Ver references/imagens-e-storage.md.
 */
export function registerStorageProxy(app: Express) {
  const localDir = path.join(resolvePublicDir(), "manus-storage");

  app.use(
    "/manus-storage",
    express.static(localDir, {
      maxAge: "30d",
      fallthrough: true,
    }),
  );

  // Terminador obrigatorio: sem ele o catch-all do SPA (app.use("*")) devolveria
  // index.html com status 200 no lugar de uma imagem que falta.
  app.use("/manus-storage", (_req, res) => {
    res.status(404).type("text/plain").send("Asset not found");
  });
}
