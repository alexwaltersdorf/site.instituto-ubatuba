# BÍBLIA DE PRODUÇÃO — "O Lugar das Muitas Canoas" v2
## Pipeline estruturado de vídeo (Hub Magnific + Flow)

> Documento-mestre das 5 etapas: (1) história + descritivos técnicos por cena,
> (2) geração de imagens no Hub, (3) prompts de vídeo, (4) falas/áudio,
> (5) vídeo final com lip sync. Elenco no cânone v2 (arquivo 05).

---

## ELENCO (referências salvas na biblioteca do Hub)

| Personagem | Papel | Referência |
|---|---|---|
| **Alex (o Guia)** | Narrador em quadro — abre e fecha o filme | biblioteca `alexguia` |
| **Yara** | Guardiã da Natureza; segura a tartaruguinha Ubá; revela o nome | biblioteca `yara` |
| **Chico** | Jovem caiçara; ponte canoa → presente | biblioteca `chico` |
| **Tiê** | O pássaro vermelho; fio condutor visual (sem fala) | biblioteca `tie` |
| **Cunhambebe** | Líder Tupinambá (flashback, séc. XVI) | por prompt (sem ref) |
| **Ubá** | Tartaruguinha-bebê nas mãos de Yara | junto da ref `yara` |

## BLOCO GLOBAL DE ESTILO (colar em TODO prompt de imagem)

```
GLOBAL STYLE: Premium Pixar-style 3D animation still, cinematic feature-film
quality, Octane Render + Unreal Engine 5 look, full ray tracing, hyper-detailed
8K, physically-based materials, subsurface scattering on all skin/feathers,
expressive big eyes with detailed iris reflections and catchlights, soft
cinematic depth of field, rich Atlantic Forest greens and ocean blues palette
(forest green #2A502B, ocean blue #008CBF, sun yellow #F4C42E, sand #F6F1E7),
volumetric light, no text, no captions, no watermark, no logo on characters.
```

**Negativos globais:** no photorealistic humans, no live action, no uncanny
valley, no extra fingers, no deformed hands/faces, no flat lighting, no
oversaturation, no cultural caricature (indigenous characters heroic and
dignified).

---

## AS 8 CENAS — descritivos técnicos completos

### CENA 1 — "A pergunta" (0–8s)
- **História:** Praia de Iperoig ao amanhecer. Alex caminha na areia; o Tiê
  pousa na placa de madeira "UBATUBA". Alex olha para a câmera.
- **Composição:** medium shot, eye level, regra dos terços (Alex à direita,
  placa com o Tiê à esquerda), foco nítido no rosto de Alex.
- **Key light:** sol nascente dourado, baixo, vindo da direita (golden hour),
  quente e suave.
- **Rim light:** contorno âmbar no cabelo grisalho e ombros, separando do mar.
- **Paleta:** dourados do amanhecer + azul-esverdeado do mar + verde da mata.
- **Olhos:** grandes e expressivos, íris castanha com reflexo do nascer do sol.
- **Pele/cabelo:** SSS quente na pele; fios grisalhos com specular suave.
- **Expressão:** sorriso caloroso convidativo (warm friendly smile), sobrancelha
  levemente erguida de quem faz uma pergunta.
- **FALA (Alex):** "Você sabe por que a nossa cidade se chama Ubatuba?"

### CENA 2 — "Ubá, a canoa" (8–16s)
- **História:** Yara ajoelhada na areia molhada desenha uma canoa com um
  graveto; a tartaruguinha Ubá observa na sua mão; o Tiê pia ao lado.
- **Composição:** close-up portrait em ângulo levemente alto (câmera olha para
  baixo, ponto de vista de quem aprende), foco nos olhos de Yara e na
  tartaruguinha, desenho na areia em segundo plano nítido.
- **Key light:** luz da manhã, frontal-lateral esquerda, suave.
- **Rim light:** azul-céu fino no cabelo castanho ondulado.
- **Paleta:** areia clara + verde da capa de folhas + casco verde-oliva.
- **Olhos:** de Yara e da tartaruga — enormes, catchlight duplo, íris detalhada.
- **Pele:** SSS morena radiante; casco da tartaruga com micro-textura.
- **Expressão:** encantamento didático — sorriso de quem conta um segredo.
- **FALA (Yara):** "Tudo começa com uma palavra tupi: ubá… a canoa!"

### CENA 3 — "A aldeia Tupinambá" (16–24s) — FLASHBACK
- **História:** Aldeia à beira-mar, séc. XVI. Cunhambebe supervisiona artesãos
  escavando um grande tronco de guapuruvu; crianças observam; fumaça fina.
- **Composição:** wide establishing shot, câmera baixa (heroísmo), Cunhambebe
  em primeiro plano à esquerda, canoa em construção no centro.
- **Key light:** fim de tarde âmbar, lateral direita, longa e quente.
- **Rim light:** brasas/fogueira recortando os corpos em laranja.
- **Paleta:** terras, ocres e verdes profundos; tom levemente sépia de memória.
- **Olhos:** determinados, reflexo do fogo na íris.
- **Pele:** SSS bronze profundo; pintura corporal geométrica discreta.
- **Expressão:** orgulho sereno de líder (dignified, heroic).
- **NARRAÇÃO (Alex, off):** "Aqui viviam os Tupinambá. Da floresta, eles
  faziam a ubá: a canoa de um tronco só."

### CENA 4 — "Mãos que fazem" (24–32s) — FLASHBACK
- **História:** Close nas mãos fortes escavando o tronco; brasas ocando a
  madeira; Cunhambebe toca o casco pronto e fala com orgulho.
- **Composição:** extreme close-up nas mãos → tilt para close-up portrait de
  Cunhambebe; profundidade rasa, lascas de madeira em bokeh.
- **Key light:** fogo (motivated lighting), quente, tremulante, de baixo.
- **Rim light:** azul crepuscular frio vindo do mar (contraste quente/frio).
- **Paleta:** laranja-brasa contra azul-noite; madeira rica em textura.
- **Olhos:** intensos, chama refletida na íris (detailed iris reflections).
- **Pele:** SSS forte no contraluz do fogo; suor sutil especular.
- **Expressão:** orgulho vibrante, sorriso largo de mestre artesão.
- **FALA (Cunhambebe):** "Cada ubá leva o espírito da floresta para o mar!"

### CENA 5 — "O mar coberto de canoas" (32–40s) — FLASHBACK ÉPICO
- **História:** Aérea: dezenas de ubás com remadores tupinambá riscando a
  enseada turquesa; o Tiê cruza o quadro em primeiro plano.
- **Composição:** aerial wide shot (drone), diagonal dinâmica das canoas,
  Tiê em primeiríssimo plano à esquerda (profundidade em 3 camadas).
- **Key light:** sol da tarde alto, cintilância especular na água (ray-traced
  reflections).
- **Rim light:** brilho dourado nas bordas das canoas e nas asas do Tiê.
- **Paleta:** turquesa + esmeralda da mata + esteiras brancas de espuma.
- **Olhos:** (Tiê) curioso, catchlight solar.
- **Penas:** SSS/sheen escarlate vibrante contra o mar.
- **Expressão:** assombro épico — a cena é o personagem.
- **NARRAÇÃO (Alex, off):** "E eram tantas canoas… que o mar parecia coberto
  delas!"

### CENA 6 — "O nome nasce" (40–48s)
- **História:** Yara na água rasa entre canoas ergue a tartaruguinha Ubá;
  letras de luz dourada flutuam na superfície: UBÁ + TYBA → UBATUBA.
- **Composição:** medium shot no nível da água (câmera meio submersa na
  linha d'água), Yara centralizada, letras luminosas em arco.
- **Key light:** dourado mágico vindo das próprias letras (motivated).
- **Rim light:** ciano da água nos contornos do cabelo molhado.
- **Paleta:** dourado-luz + turquesa + verde-folha.
- **Olhos:** maravilhados, reflexo das letras na íris.
- **Pele:** SSS + gotículas d'água especulares no rosto.
- **Expressão:** revelação alegre — o "aha!" do filme.
- **FALA (Yara):** "Ubá é canoa… tyba é abundância! Ubatuba: o lugar das
  muitas canoas!"

### CENA 7 — "As canoas de hoje" (48–56s)
- **História:** Presente: Chico empurra a canoa caiçara para o mar; ao lado,
  crianças do Instituto surfam ondinhas; o Tiê voa em arco alegre.
- **Composição:** dynamic medium-wide tracking, Chico em primeiro plano
  empurrando, surfistas no meio, Serra do Mar ao fundo.
- **Key light:** manhã clara e alta, luz alegre de "dia perfeito".
- **Rim light:** spray do mar retroiluminado (backlit sea spray).
- **Paleta:** azul-oceano + branco-espuma + palha do chapéu + verde-serra.
- **Olhos:** riso nos olhos (smiling eyes), catchlight brilhante.
- **Pele:** SSS morena solar; respingos d'água congelados no ar.
- **Expressão:** alegria em movimento, esforço feliz.
- **NARRAÇÃO (Alex, off):** "As ubás viraram pranchas… mas o mar continua o
  mesmo."

### CENA 8 — "Retrato de família" (56–64s)
- **História:** Pôr do sol. Alex, Yara (com a tartaruguinha Ubá), Chico e o
  Tiê pousado no ombro de Alex — retrato de grupo; todos acenam.
- **Composição:** medium-wide group shot simétrico, leve push-in em Yara ao
  falar; sol se pondo entre as ilhas atrás.
- **Key light:** pôr do sol rosa-dourado frontal-baixo.
- **Rim light:** halo dourado forte em todo o grupo (backlit golden halo).
- **Paleta:** rosa + âmbar + silhuetas verdes das ilhas.
- **Olhos:** todos com catchlight do pôr do sol; ternura.
- **Pele/penas:** SSS máximo no contraluz (glow de encerramento).
- **Expressão:** felicidade serena de pertencimento.
- **FALA (Yara):** "Ubatuba: onde cada canoa carrega uma história!"
- **Pós:** selo do Instituto + onda dupla nos 2s finais (na edição).

---

## ETAPA 2 — Geração das imagens no Hub

- **Modelo escolhido:** **GPT-2** (o mesmo motor de todo o universo v2 dos
  mascotes — máxima coerência de estilo; suporta referências de personagem;
  30 créditos por imagem em 2K).
- Alternativa para edições/ajustes pontuais: Google Nano Banana 2 (75 cr).
- **Formato:** 16:9, 2K (master de cinema). Referências de personagem da
  biblioteca em cada cena (ver tabela do elenco).
- Master aprovado → `images_upscale` somente no corte final (economia).

## ETAPA 3 — Prompts de vídeo (por cena)

Dois caminhos, mesmo prompt de movimento:

**A) Hub (Seedance 2.0)** — melhor lip sync nativo com áudio de referência:
- `video_generate` com `keyframes.start` = imagem master da cena,
  `references[]` = áudio da fala (lip sync) + personagem, `duration` 8,
  16:9, prompt de ação/câmera (abaixo). Pro = 5.600 cr/cena (1080p);
  Mini = 1.120 cr/cena (720p, rascunho).
**B) Google Flow (Veo 3)** — sem custo de créditos do Hub; usar as imagens
  master como ingredientes/frames e os prompts de vídeo do arquivo 04
  (falas embutidas com tag "(Brazilian Portuguese)").

Prompt de movimento por cena (EN, resumo):
1. Slow push-in on Alex; the red bird lands on the UBATUBA sign, flutters;
   sea breeze, rolling waves. Alex speaks to camera, warm.
2. Overhead gentle tilt; Yara draws the canoe in wet sand, baby turtle blinks;
   she looks up and speaks with wonder.
3. Slow lateral dolly across the village; carvers chip rhythmically; smoke
   drifts; Cunhambebe nods (voice-over).
4. ECU hands carving → tilt up to Cunhambebe speaking proudly; embers spark,
   firelight flicker (speaks).
5. FPV drone glide over the canoe fleet; the red bird soars through
   foreground; sun sparkle on water (voice-over).
6. Water-level rise with Yara; golden letters assemble UBÁ+TYBA→UBATUBA;
   she lifts the little turtle and speaks joyfully.
7. Tracking shot with Chico pushing the canoe into the waves; kids surf by;
   bird arcs overhead (voice-over).
8. Slow push-in on the group at sunset; everyone waves; Yara speaks the final
   line; birds silhouette across the sun.

## ETAPA 4 — Falas e áudio

- **TTS no Hub** (ElevenLabs v3, pt-BR), um arquivo por fala/cena (8 arquivos)
  para servir de referência de lip sync no Seedance (ou dublagem na edição).
- Vozes: Alex = masculina adulta calorosa; Yara = feminina jovem alegre;
  Cunhambebe = masculina grave e digna.
- Direção de interpretação por fala descrita nas cenas acima.
- Trilha musical única (orquestra + flauta indígena + percussão leve) na
  edição final — nunca por clipe.

## ETAPA 5 — Montagem final

1. 8 clipes → `video_concatenate` (Hub) ou editor (CapCut/Premiere).
2. Verificar lip sync das cenas com fala em quadro (1, 2, 4, 6, 8).
3. Trilha + sound design (ondas, pássaros, fogo, remadas).
4. Selo + onda dupla da marca nos 2s finais; legendas .srt pt-BR.
5. `video_upscale` do corte final se necessário (custo sob demanda).

## PLANO ORÇAMENTÁRIO APROVADO — conta Total Quality (plano 45k)

Estratégia **"Pro nos heróis, Mini nos apoios"** — fecha o filme inteiro com
margem real de retakes:

| Fase | Item | Custo | Subtotal |
|---|---|---|---|
| A | 8 imagens master GPT-2 2K + buffer de 4 retakes | 30/un | 360 |
| A | 8 falas TTS + buffer 2 | ~30/un | 300 |
| B | 1 clipe piloto Seedance Mini (valida movimento+lip sync) | 1.120 | 1.120 |
| C | 5 cenas-herói em **Seedance Pro 1080p** (cenas 1, 2, 4, 6, 8 — fala em quadro, lip sync) | 5.600/un | 28.000 |
| C | 3 cenas de apoio em **Seedance Mini 720p** (cenas 3, 5, 7 — narração off, sem lip sync em quadro) | 1.120/un | 3.360 |
| — | **Total planejado** | | **~33.100** |
| — | **Margem de segurança** (2 retakes Pro OU 10 retakes Mini + upscales) | | **~11.900** |

Regras de governança:
1. Nunca gerar um Pro sem o master de imagem e a fala aprovados.
2. Cena reprovada: 1º retake sempre em Mini (1.120) para validar a correção;
   só regenerar em Pro com o Mini aprovado.
3. Checar `account_balance` antes de cada fase; abortar fase C se margem < 6k.
4. Cenas 3/5/7 em Mini 720p podem receber `video_upscale` no corte final se o
   orçamento remanescente permitir (simular custo antes).
5. Todas em Pro (44.800) só com orçamento extra — inviável com margem em 45k.

## ORÇAMENTO REFERÊNCIA (rodada 1, conta antiga — saldo inicial: 711)

| Item | Unidade | Qtde | Total |
|---|---|---|---|
| Imagem master GPT-2 2K | 30 | 8 | 240 |
| Fala TTS (~1 frase) | ~30 | 8 | ~240 |
| Reserva p/ retakes | — | — | ~230 |
| **Vídeo Seedance Mini 720p 8s** | 1.120 | 8 | **8.960** ⛔ |
| **Vídeo Seedance Pro 1080p 8s** | 5.600 | 8 | **44.800** ⛔ |

⛔ = inviável no saldo atual; executar na renovação do ciclo ou via Flow (B).

## LOG DE PRODUÇÃO — Rodada 1 (conta alexdasaudeoficial@gmail.com, 22-23/07/2026)

Projeto no Hub: **"Instituto Ubatuba — Filme Origem do Nome"**.
Assets gerados (abrir pelo app do Magnific na conta original):

| Asset | Status | Link |
|---|---|---|
| Cena 1 — A pergunta (Alex + Tiê na placa) | ✅ aprovada | magnific.com/app/creation/tf85oFWmZJ |
| Cena 2 — Ubá, a canoa (Yara + tartaruga) | ✅ aprovada (2º retake) | magnific.com/app/creation/Tech042VNR |
| Cena 3 — Aldeia Tupinambá | 🔄 retake de estilo em processamento | magnific.com/app/creation/iANMZwn3uK |
| Cena 4 — Mãos que fazem | 🔄 retake de estilo em processamento | magnific.com/app/creation/rlk4LF4xtc |
| Cena 5 — Mar coberto de canoas (aérea) | ✅ aprovada | magnific.com/app/creation/brHwFA95Y2 |
| Cena 6 — O nome nasce (letras douradas) | ✅ aprovada (retake) | magnific.com/app/creation/xg141pwjfW |
| Cena 7 — As canoas de hoje (Chico) | ✅ aprovada | magnific.com/app/creation/l7LijmBgv9 |
| Cena 8 — Retrato de família | ✅ aprovada (retake) | magnific.com/app/creation/swj6jxAl8e |
| Falas 1–8 (TTS pt-BR, ElevenLabs v3) | ✅ todas prontas | no mesmo projeto |

Vozes: Alex = Lucas Moreira; Yara = Camila Rocha; Cunhambebe = Onildo F. Rocha.

**Lições da rodada 1 (aplicar sempre):**
1. O filtro de conteúdo do GPT-2 dá falso positivo com crianças + "wet/kneeling/
   waist-deep" → descrever personagens sempre "FULLY DRESSED", em pé, wholesome.
2. Cenas SEM referência de personagem (3 e 4) derivam para realismo → SEMPRE
   passar uma cena aprovada como referência de `style` + "NOT photorealistic,
   cartoon, rounded proportions".
3. Texto em cena (UBATUBA na placa, letras UBÁ/TYBA) pode cortar na borda →
   planejar tipografia na pós.
4. Custos reais: imagem GPT-2 2K = 30 cr; fala TTS = ~30 cr; Seedance Mini 8s
   720p = 1.120 cr; Seedance Pro 8s 1080p = 5.600 cr.

**Migração de conta (para sac@totalquality.med.br):** recriar o projeto,
re-registrar as referências de personagem na biblioteca (yara, chico, alexguia,
tie — subir as imagens dos mascotes) e reexecutar os prompts deste documento.
Tudo é reproduzível a partir deste arquivo.

## LOG DE PRODUÇÃO — Rodada 2 (conta sac@totalquality.med.br, 23/07/2026)

Projeto: "Instituto Ubatuba — Filme Origem do Nome" (conta Total Quality,
plano 45k). Biblioteca recriada: personagens yara, alexguia, chico, tie.

**Fase A concluída — 628 créditos:**
| Cena | Status | Link |
|---|---|---|
| 1 — A pergunta | ✅ | magnific.com/app/creation/3G6D0nhREY |
| 2 — Ubá, a canoa | ✅ (1 retry de filtro) | magnific.com/app/creation/WMntopxcXe |
| 3 — Aldeia Tupinambá | ✅ (style ref da cena 7) | magnific.com/app/creation/3G6DTCgREY |
| 4 — A canoa pronta | ✅ (Cunhambebe de **manto de penas tupinambá** — resolveu filtro com rigor histórico) | magnific.com/app/creation/brH7wNH5Y2 |
| 5 — Mar de canoas (aérea) | ✅ | magnific.com/app/creation/ubClxlaQLD |
| 6 — O nome nasce | ✅ (letras a refinar na pós) | magnific.com/app/creation/3G6D0mjREY |
| 7 — Canoas de hoje | ✅ | magnific.com/app/creation/swji42Ul8e |
| 8 — Retrato de família | ✅ | magnific.com/app/creation/43ycztr9Aa |
| Falas 1–8 (TTS) | ✅ todas | no projeto |

**Fase B:** piloto lip sync cena 2 (Seedance Mini 8s 720p, 1.120 cr) —
magnific.com/app/creation/hEt11cgvqL

Nota de cânone: a partir da cena 4, Cunhambebe veste o manto de penas
escarlate tupinambá (historicamente documentado; os mantos originais estão
em museus europeus) — adotar como visual oficial do personagem.

## TIME DE PRODUÇÃO (avaliação)

Estrutura enxuta, um especialista por etapa, sob direção única:
- **Diretor/Showrunner** (esta sessão): orquestra, aprova, controla créditos.
- **Roteirista-Historiador** (skill `historiador-ubatuba`): história e rigor.
- **Diretor de Fotografia** (skill `photo-prompt-pro`): prompts de imagem.
- **Diretor de Animação** (skill `video-prompt-pro`): prompts de vídeo/câmera.
- **Estúdio de Som**: TTS + trilha (Hub).
Time paralelo (multiagente) só se justifica para produzir VÁRIOS filmes
simultâneos; para um filme, o gargalo é geração (fila do Hub) e aprovação
humana — não a escrita. Escalar quando houver série.
