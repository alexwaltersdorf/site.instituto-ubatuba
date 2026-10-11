import path from "path";
import express, { type Express } from "express";
import { ENV } from "./env";

// Diretorio publico servido em producao (mesma resolucao usada por serveStatic).
function resolvePublicDir(): string {
  return process.env.NODE_ENV === "development"
    ? path.resolve(import.meta.dirname, "../..", "dist", "public")
    : path.resolve(import.meta.dirname, "public");
}

export function registerStorageProxy(app: Express) {
  // 1) ARQUIVOS LOCAIS PRIMEIRO.
  // Historicamente todas as imagens e documentos do site moravam no storage da
  // Manus (Forge) e eram servidos por redirect assinado. Quando a credencial do
  // projeto Manus deixa de valer, o proxy passa a responder 502 e o site inteiro
  // fica sem imagem. Qualquer arquivo commitado em client/public/manus-storage/
  // passa a ter precedencia sobre o proxy, o que torna o site independente da
  // Manus arquivo por arquivo, sem precisar reescrever as ~130 referencias.
  const localDir = path.join(resolvePublicDir(), "manus-storage");
  app.use(
    "/manus-storage",
    express.static(localDir, {
      maxAge: "30d",
      fallthrough: true, // sem arquivo local -> tenta o proxy abaixo
    }),
  );

  // 2) FALLBACK: proxy para o storage da Manus.
  app.get("/manus-storage/*", async (req, res) => {
    const key = (req.params as Record<string, string>)[0];
    if (!key) {
      res.status(400).send("Missing storage key");
      return;
    }

    if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
      res.status(404).send("Asset not found");
      return;
    }

    try {
      const forgeUrl = new URL(
        "v1/storage/presign/get",
        ENV.forgeApiUrl.replace(/\/+$/, "") + "/",
      );
      forgeUrl.searchParams.set("path", key);

      const forgeResp = await fetch(forgeUrl, {
        headers: { Authorization: `Bearer ${ENV.forgeApiKey}` },
      });

      if (!forgeResp.ok) {
        const body = await forgeResp.text().catch(() => "");
        console.error(`[StorageProxy] forge error: ${forgeResp.status} ${body}`);
        res.status(404).send("Asset not found");
        return;
      }

      const { url } = (await forgeResp.json()) as { url: string };
      if (!url) {
        res.status(404).send("Asset not found");
        return;
      }

      res.set("Cache-Control", "no-store");
      res.redirect(307, url);
    } catch (err) {
      console.error("[StorageProxy] failed:", err);
      res.status(404).send("Asset not found");
    }
  });
}
