#!/usr/bin/env node
// Baixa TODOS os assets ainda hospedados no storage da Manus e grava em
// client/public/manus-storage/, tornando o site definitivamente independente.
//
// Uso (com a credencial valida):
//   BUILT_IN_FORGE_API_URL=https://forge.butterfly-effect.dev \
//   BUILT_IN_FORGE_API_KEY=<chave> \
//   node scripts/resgatar-assets-manus.mjs
//
// Idempotente: pula o que ja existe localmente. Valida o conteudo antes de
// gravar (nao salva pagina de erro como se fosse imagem).

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "client", "public", "manus-storage");
const FORGE = (process.env.BUILT_IN_FORGE_API_URL || "https://forge.butterfly-effect.dev").replace(/\/+$/, "");
const KEY = process.env.BUILT_IN_FORGE_API_KEY;

if (!KEY) {
  console.error("ERRO: defina BUILT_IN_FORGE_API_KEY (e opcionalmente BUILT_IN_FORGE_API_URL).");
  process.exit(1);
}

// Descobre as chaves referenciadas no codigo-fonte.
const grep = execSync(
  `grep -rhoE "manus-storage/[A-Za-z0-9_.-]+" client server --include=*.ts --include=*.tsx --include=*.html`,
  { cwd: ROOT, encoding: "utf-8", maxBuffer: 32 * 1024 * 1024 },
);
const keys = [...new Set(grep.split("\n").filter(Boolean).map(l => l.replace("manus-storage/", "")))].sort();

fs.mkdirSync(OUT, { recursive: true });
const MAGIC = {
  ".pdf": [0x25, 0x50, 0x44, 0x46],            // %PDF
  ".png": [0x89, 0x50, 0x4e, 0x47],            // .PNG
  ".jpg": [0xff, 0xd8, 0xff], ".jpeg": [0xff, 0xd8, 0xff],
};

function looksValid(buf, ext) {
  if (buf.length < 512) return false;
  if (ext === ".webp") return buf.subarray(0, 4).toString() === "RIFF" && buf.subarray(8, 12).toString() === "WEBP";
  const m = MAGIC[ext];
  if (!m) return true;
  return m.every((b, i) => buf[i] === b);
}

let baixados = 0, pulados = 0, falhas = [];
for (const key of keys) {
  const dest = path.join(OUT, key);
  if (fs.existsSync(dest)) { pulados++; continue; }
  try {
    const presign = new URL("v1/storage/presign/get", FORGE + "/");
    presign.searchParams.set("path", key);
    const pr = await fetch(presign, { headers: { Authorization: `Bearer ${KEY}` } });
    if (!pr.ok) throw new Error(`presign ${pr.status}: ${(await pr.text()).slice(0, 120)}`);
    const { url } = await pr.json();
    if (!url) throw new Error("presign sem url");

    const fr = await fetch(url);
    if (!fr.ok) throw new Error(`download ${fr.status}`);
    const buf = Buffer.from(await fr.arrayBuffer());

    const ext = path.extname(key).toLowerCase();
    if (!looksValid(buf, ext)) throw new Error(`conteudo invalido para ${ext} (${buf.length}B)`);

    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, buf);
    baixados++;
    console.log(`OK   ${key}  (${(buf.length / 1024).toFixed(0)} KB)`);
  } catch (e) {
    falhas.push([key, String(e.message || e).slice(0, 110)]);
    console.log(`--   ${key}: ${String(e.message || e).slice(0, 110)}`);
  }
}

console.log(`\nbaixados: ${baixados} | ja existiam: ${pulados} | falhas: ${falhas.length} | total: ${keys.length}`);
if (baixados) {
  console.log("\nProximos passos:");
  console.log("  1. Otimizar as imagens grandes (max ~800px, qualidade 82).");
  console.log("  2. git add client/public/manus-storage && git commit && git push origin main");
}
if (falhas.length) process.exitCode = 1;
