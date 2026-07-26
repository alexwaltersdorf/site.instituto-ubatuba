/**
 * Publica a matéria "El Niño 2026" na tabela posts.
 * Uso (com DATABASE_URL no ambiente, ex. Hostinger):
 *   node seed-post-elnino.mjs
 * Idempotente: se o slug já existir, atualiza o conteúdo.
 */
import mysql from "mysql2/promise";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const post = {
  slug: "el-nino-2026-o-que-esperar-em-ubatuba-ods-13",
  title: "El Niño 2026: o oceano esquentou — o que esperar em Ubatuba",
  excerpt:
    "O El Niño de 2026 caminha para ser um dos mais fortes já registrados, segundo a NOAA e o INMET. Entenda o fenômeno, os efeitos esperados no litoral norte de SP e como a ODS 13 orienta a preparação da nossa cidade.",
  content: `# El Niño 2026: o oceano esquentou — o que esperar em Ubatuba

## Um dos eventos mais fortes já registrados

O Oceano Pacífico vive, em 2026, um aquecimento fora do comum. Em julho, o índice Niño 3.4 — o principal termômetro do fenômeno — atingiu **+2,1 °C acima da média**, e a agência climática americana (NOAA) estima **97% de chance** de o El Niño durar até o início de 2027. Dos 26 modelos climáticos internacionais acompanhados, **23 preveem um evento "muito forte"** no trimestre outubro–dezembro.

No Brasil, o monitoramento é feito em conjunto por INMET, INPE, Funceme e CENSIPAM, que publicaram nota técnica alertando para a alta probabilidade de um El Niño muito forte.

## O que é o El Niño?

O El Niño é o aquecimento anormal das águas do Pacífico Equatorial. Esse calor extra muda a circulação dos ventos e a distribuição das chuvas no planeta inteiro. O fenômeno é natural e ocorre a cada 2 a 7 anos — mas, num mundo já aquecido pelas mudanças climáticas, seus efeitos tendem a ser mais intensos.

## Efeitos opostos pelo Brasil

- **Norte e Nordeste:** maior risco de seca e de incêndios florestais.
- **Sul:** chuvas acima da média e risco de enchentes.
- **Sudeste:** ondas de calor mais frequentes e maior chance de eventos extremos de chuva.

## E aqui em Ubatuba?

O litoral norte de São Paulo pode sentir o El Niño de três formas principais:

1. **Mar mais quente** — a temperatura da água altera o comportamento dos cardumes, afetando a pesca artesanal caiçara, e aumenta o estresse sobre a vida marinha.
2. **Chuvas intensas na Serra do Mar** — em anos de El Niño, eventos extremos de chuva ficam mais prováveis no nosso relevo de encostas. Atenção redobrada com áreas de risco.
3. **Calor fora de época** — ondas de calor pressionam a saúde, o abastecimento de água e o saneamento, especialmente na alta temporada.

## O gancho com a Agenda 2030: ODS 13

Falar de El Niño é falar da **ODS 13 — Ação Contra a Mudança Global do Clima**. A meta **13.1** pede exatamente isto: *fortalecer a resiliência e a capacidade de adaptação a riscos e desastres relacionados ao clima*. Uma cidade informada e preparada protege vidas — e é esse o papel da educação climática que o Instituto Ubatuba promove. O tema também conversa com a **ODS 11** (cidades resilientes) e a **ODS 14** (vida na água).

## Como se preparar

- **Cadastre-se nos alertas da Defesa Civil:** envie seu CEP por SMS para o número **40199**.
- **Em chuva forte, evite encostas e áreas de risco.** Trincas nas paredes, portas emperrando e água barrenta são sinais de perigo: saia na hora.
- **Proteja a mata.** A floresta em pé segura a encosta, absorve a chuva e refresca a cidade — é a nossa melhor defesa natural.
- **Acompanhe fontes oficiais:** INMET, Defesa Civil e os canais do Instituto Ubatuba.

## Fontes

- NOAA / Climate Prediction Center — ENSO Diagnostic Discussion (jul/2026)
- INMET — "El Niño 2026: monitoramento, previsões e possíveis impactos no Brasil"
- Nota Técnica Conjunta El Niño 2026 — INPE, INMET, Funceme e CENSIPAM

---

*O Instituto Ubatuba Santuário Ecológico acompanha o clima e educa a comunidade para um futuro mais seguro. Siga [@instituto.ubatuba](https://www.instagram.com/instituto.ubatuba) e compartilhe este alerta.*`,
  coverImage: "/noticias-img/el-nino-2026.jpg",
  category: "Meio Ambiente",
  tags: JSON.stringify([
    "El Niño",
    "clima",
    "ODS 13",
    "ODS 11",
    "ODS 14",
    "Defesa Civil",
    "Serra do Mar",
    "pesca",
  ]),
};

const conn = await mysql.createConnection(DATABASE_URL);
const now = new Date();
const [rows] = await conn.execute("SELECT id FROM posts WHERE slug = ?", [post.slug]);
if (rows.length > 0) {
  await conn.execute(
    "UPDATE posts SET title=?, excerpt=?, content=?, coverImage=?, category=?, tags=?, published=1, publishedAt=COALESCE(publishedAt, ?) WHERE slug=?",
    [post.title, post.excerpt, post.content, post.coverImage, post.category, post.tags, now, post.slug]
  );
  console.log("Post atualizado:", post.slug);
} else {
  await conn.execute(
    "INSERT INTO posts (slug, title, excerpt, content, coverImage, category, tags, published, publishedAt) VALUES (?,?,?,?,?,?,?,1,?)",
    [post.slug, post.title, post.excerpt, post.content, post.coverImage, post.category, post.tags, now]
  );
  console.log("Post publicado:", post.slug);
}
await conn.end();
