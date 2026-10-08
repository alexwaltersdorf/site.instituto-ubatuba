// src/server.ts
import express from "express";
import { randomUUID } from "node:crypto";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
const jobs = new Map<string, any>();

function buildServer() {
  const server = new McpServer({ name: "veo-studio", version: "1.0.0" });

  server.registerTool("gerar_video", {
    description: "Inicia a geração de um vídeo de 8s com áudio nativo (Veo 3.1). Retorna um jobId.",
    inputSchema: {
      prompt: z.string().describe("Descrição da cena, câmera, diálogo entre aspas e SFX"),
      aspectRatio: z.enum(["16:9", "9:16"]).default("16:9"),
      resolution: z.enum(["720p", "1080p", "4k"]).default("720p"),
      durationSeconds: z.enum(["4", "6", "8"]).default("8"),
      imageBase64: z.string().optional().describe("Frame inicial opcional (image-to-video)"),
    },
  }, async ({ prompt, aspectRatio, resolution, durationSeconds, imageBase64 }) => {
    const op = await ai.models.generateVideos({
      model: "veo-3.1-generate-preview",
      prompt,
      ...(imageBase64
        ? { image: { imageBytes: imageBase64, mimeType: "image/png" } }
        : {}),
      config: { aspectRatio, resolution, durationSeconds: Number(durationSeconds) },
    });
    const jobId = randomUUID();
    jobs.set(jobId, op);
    return { content: [{ type: "text" as const, text: `jobId=${jobId} — use consultar_video para acompanhar.` }] };
  });

  server.registerTool("consultar_video", {
    description: "Consulta o status de um job e devolve a URI do vídeo quando pronto.",
    inputSchema: { jobId: z.string() },
  }, async ({ jobId }) => {
    let op = jobs.get(jobId);
    if (!op) return { content: [{ type: "text" as const, text: "jobId desconhecido" }], isError: true };
    op = await ai.operations.getVideosOperation({ operation: op });
    jobs.set(jobId, op);
    if (!op.done) return { content: [{ type: "text" as const, text: "Em processamento (11s a ~6min)." }] };
    const video = op.response.generatedVideos[0].video;
    return { content: [{ type: "text" as const, text: `Pronto: ${video.uri} (expira em 2 dias)` }] };
  });

  server.registerTool("estender_video", {
    description: "Estende em 7s um vídeo gerado anteriormente pelo Veo (720p, até 141s de entrada).",
    inputSchema: { jobId: z.string(), prompt: z.string() },
  }, async ({ jobId, prompt }) => {
    const prev = jobs.get(jobId);
    const op = await ai.models.generateVideos({
      model: "veo-3.1-generate-preview",
      prompt,
      video: prev.response.generatedVideos[0].video,
      config: { resolution: "720p", durationSeconds: 8 },
    });
    const newId = randomUUID();
    jobs.set(newId, op);
    return { content: [{ type: "text" as const, text: `jobId=${newId}` }] };
  });

  return server;
}

const app = express();
app.use(express.json());

// Metadados obrigatórios para o handshake OAuth do MCP (RFC 9728)
app.get("/.well-known/oauth-protected-resource", (_req, res) => {
  res.json({
    resource: process.env.PUBLIC_URL,               // ex.: https://mcp.seudominio.com
    authorization_servers: [process.env.ISSUER_URL], // seu IdP (Auth0, WorkOS, Keycloak...)
    scopes_supported: ["video:generate"],
    bearer_methods_supported: ["header"],
  });
});

// Valide o Bearer token contra o JWKS do seu IdP e confira a claim `aud`
app.use("/mcp", (req, res, next) => {
  const token = req.headers.authorization?.replace(/^Bearer /, "");
  if (!token) {
    res.setHeader("WWW-Authenticate",
      `Bearer resource_metadata="${process.env.PUBLIC_URL}/.well-known/oauth-protected-resource", scope="video:generate"`);
    return res.status(401).end();
  }
  next(); // -> substitua por verificação JWT real (jose/jwks-rsa)
});

app.post("/mcp", async (req, res) => {
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  res.on("close", () => transport.close());
  await buildServer().connect(transport);
  await transport.handleRequest(req, res, req.body);
});

app.listen(3000);
