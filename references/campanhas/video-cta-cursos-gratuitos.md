# 🎬 Vídeo CTA — 1.127 Cursos Gratuitos (ultra-realista)

**Formato:** 4 cenas × 8 s = **32 s** · 9:16 (Reels/Shorts) + 16:9
**Pipeline:** referência de personagem no **Magnific** → clipes no **Google Flow
(Veo 3.1, fala pt-BR nativa com lip sync)** → montagem local (ffmpeg).
**Destino:** Instagram Reels, Facebook, YouTube Shorts.

---

## 1. Dados verificados na API de produção (11/11/2026)

Números conferidos em `institutoubatuba.org/api/trpc/courses.list` — **não
inventar nada além disto**:

| Dado | Valor real |
|---|---|
| **Total de cursos gratuitos** | **1.127** |
| Harvard University | **123 cursos** |
| Santander | 72 |
| USP | 4 |
| MIT | 2 |
| FGV | 2 |
| Fiocruz | 2 |
| Stanford | 1 |
| UNICAMP · UNESP · UFRS · Univ. Michigan · Penn · École Polytechnique | 1 cada |

**Por categoria:** Administração 556 · Tecnologia 160 · Direito 102 ·
Meio Ambiente 78 · Artes & Cultura 67 · Saúde 61 · Educação 45 ·
Idiomas 32 · Ciências 25 · Esporte 1.

**Certificado:** emitido pelo **Instituto Ubatuba Santuário Ecológico** a pedido,
após a conclusão do curso na plataforma da instituição de origem. Não é o
certificado de Harvard — a fala não deve sugerir isso.

⚠️ **Honestidade no roteiro:** Harvard tem mesmo 123 cursos, e isso é o grande
número da campanha. MIT, Stanford, USP, FGV e Fiocruz **estão no catálogo**, mas
com poucos cursos cada — a fala cita os nomes como catálogo, nunca como volume.

---

## 2. A apresentadora (âncoras de consistência)

Para a mesma pessoa aparecer nas 4 cenas, gerar **uma imagem de referência** no
Magnific e usá-la como **frame inicial** de todos os clipes no Flow. Os traços
abaixo são os âncoras — repetir **literalmente** em todos os prompts:

> Brazilian woman, 24 years old, warm medium-brown skin with visible natural
> pores and fine peach-fuzz, dark brown wavy shoulder-length hair with a few
> loose strands, warm brown almond eyes with detailed iris and catchlights,
> **three small freckles across the bridge of the nose**, full natural eyebrows,
> minimal makeup, genuine asymmetric smile showing slight dimple on the left
> cheek, small gold stud earrings, **sand-cream linen button shirt** (#F6F1E7)
> with sleeves rolled to the elbow.

**Paleta oficial (para sobreposições e ambiente):** Verde Serra `#2A502B` ·
Azul Oceano `#008CBF` · Amarelo Sol `#F4C42E` · Laranja Praia `#EC9939` ·
Areia `#F6F1E7` · Tinta `#122019`.

### Prompt da referência (Magnific — gerar em 9:16, 2K)

```
Photorealistic editorial portrait, Brazilian woman, 24 years old, warm
medium-brown skin with visible natural pores, fine peach-fuzz and realistic
subsurface scattering, dark brown wavy shoulder-length hair with loose strands
catching the light, warm brown almond eyes with detailed iris texture and soft
catchlights, three small freckles across the bridge of the nose, full natural
eyebrows, minimal makeup, genuine asymmetric smile with a slight dimple on the
left cheek, small gold stud earrings, sand-cream linen button shirt with sleeves
rolled to the elbow. Waist-up, facing camera, relaxed confident posture.
Shot on Sony A7S III, 85mm f/1.4, shallow depth of field, creamy bokeh.
Golden-hour side key light from camera left, soft bounce fill from camera right,
warm rim light separating hair from background. Background: sunlit Atlantic
Forest foliage and a hint of blue ocean, heavily defocused.
Natural skin tones, no retouching, no plastic skin, realistic film grain,
8K detail, color grade warm and airy.
```

**Negativo:** `plastic skin, airbrushed, waxy, CGI, 3D render, cartoon,
anime, oversaturated, uncanny eyes, extra fingers, distorted hands, text,
watermark, logo`.

---

## 2-B. ✅ FRAMES GERADOS (11/11/2026) — Magnific, Nano Banana 2.1, 2K 9:16

As quatro cenas já existem. A cena 1 foi gerada do zero e as outras três usaram
**a cena 1 como referência de imagem**, o que travou o rosto, as sardas, o
cabelo e a camisa nas quatro. Projeto: *Instituto Ubatuba — CTA Cursos Gratuitos*.

| Cena | Frame | Link |
|---|---|---|
| 1 — Gancho | deck, mata e oceano desfocado, golden hour | magnific.com/app/creation/fH2j9qVCDY |
| 2 — Credibilidade | mesa de madeira clara, laptop, caderno, café | magnific.com/app/creation/8a9bwiMIrU |
| 3 — Como funciona | trilha de areia na mata, celular na mão | magnific.com/app/creation/bx07ABz5Y2 |
| 4 — CTA | praia, mar aberto, mão aberta em convite | magnific.com/app/creation/ov4qUYe829 |

Variantes alternativas de cada cena ficaram no mesmo projeto, caso alguma
precise ser trocada. **Custo: 520 créditos** (8 imagens a 65).

**No Flow:** subir cada PNG como frame inicial do clipe correspondente e colar o
prompt da cena 3 abaixo — o Veo gera a fala pt-BR com lip sync a partir do texto
entre aspas, sem áudio externo.

---

## 3. Roteiro — fala exata (pt-BR)

Ritmo: ~16 palavras por clipe de 8 s, com respiro no fim. A fala vai **dentro do
prompt do Flow, entre aspas** — o Veo gera a voz nativa com lip sync, sem áudio
externo.

### CENA 1 — Gancho (0,0 – 8,0 s)
> **"Mil cento e vinte e sete cursos gratuitos. Harvard, MIT, USP. E você não paga nada."**

**Prompt Flow:**
```
Photorealistic 8-second shot. [COLAR OS ÂNCOROS DA APRESENTADORA AQUI]
She stands on a wooden deck with sunlit Atlantic Forest and defocused blue ocean
behind her, holding eye contact with the camera, speaking with bright energy and
an open gesture of both hands on "gratuitos".
Camera: slow push-in on a gimbal, 85mm, f/1.8, shallow depth of field.
Lighting: golden-hour side key from camera left, warm rim light on hair, soft
bounce fill. Natural skin texture, realistic film grain.
She says in Brazilian Portuguese, warm and energetic, as if sharing great news:
"Mil cento e vinte e sete cursos gratuitos. Harvard, MIT, USP. E você não paga nada."
Ambient: soft forest birds and distant surf. No music.
```

### CENA 2 — Credibilidade (8,0 – 16,0 s)
> **"Só de Harvard são cento e vinte e três cursos. Tem MIT, Stanford, USP, FGV, Fiocruz."**

**Prompt Flow:**
```
Photorealistic 8-second shot, same woman, identical face, hair and sand-cream
linen shirt. [ÂNCOROS] Now seated at a light wooden table by a large window,
open laptop in front of her, a notebook and a cup of coffee beside it.
She glances at the laptop screen then back to camera, counting the institutions
on her fingers with a confident smile.
Camera: static medium shot, 50mm, f/2.0, slight shallow focus.
Lighting: large soft window light from camera right, gentle fill, warm practical
lamp behind her out of focus. Natural skin texture, realistic film grain.
She says in Brazilian Portuguese, confident and clear:
"Só de Harvard são cento e vinte e três cursos. Tem MIT, Stanford, USP, FGV, Fiocruz."
Ambient: quiet room tone, faint page turn. No music.
```

### CENA 3 — Como funciona (16,0 – 24,0 s)
> **"Tecnologia, saúde, direito, idiomas. No seu ritmo, pelo celular. E com certificado."**

**Prompt Flow:**
```
Photorealistic 8-second shot, same woman, identical face, hair and sand-cream
linen shirt. [ÂNCOROS] She is walking slowly along a shaded garden path with
dappled sunlight, holding her phone up and gesturing to it naturally, then
looking back to camera on "certificado".
Camera: handheld tracking shot walking with her, 35mm, f/2.2, subtle natural
camera movement. Lighting: dappled sunlight through leaves, soft ambient bounce
from sandy ground. Natural skin texture, realistic film grain.
She says in Brazilian Portuguese, friendly and reassuring:
"Tecnologia, saúde, direito, idiomas. No seu ritmo, pelo celular. E com certificado."
Ambient: footsteps on sand, light breeze in leaves. No music.
```

### CENA 4 — Chamada para ação (24,0 – 32,0 s)
> **"Corre pro site do Instituto Ubatuba, na página Cursos. Tudo gratuito. Sua vaga já está lá."**

**Prompt Flow:**
```
Photorealistic 8-second shot, same woman, identical face, hair and sand-cream
linen shirt. [ÂNCOROS] She stands facing camera with the open sea and late
afternoon sky behind her, leaning in slightly on "Corre", then an inviting
open-palm gesture and a warm closing smile. She holds the final smile for a full
second after the last word, looking straight into the lens.
Camera: slow pull-back on a gimbal, 85mm, f/1.8, strong background bokeh.
Lighting: warm low sun as backlight creating a golden rim, soft reflector fill
on her face. Natural skin texture, realistic film grain.
She says in Brazilian Portuguese, warm and inviting, with a smile:
"Corre pro site do Instituto Ubatuba, na página Cursos. Tudo gratuito. Sua vaga já está lá."
Ambient: gentle surf and wind. No music.
```

⚠️ **Regra permanente:** o selo do Instituto **nunca** é gerado por IA. Entra na
montagem, a partir do PNG oficial do manual da marca.

---

## 4. Textos na tela (overlays — montagem, não IA)

| Cena | Tempo | Texto | Estilo |
|---|---|---|---|
| 1 | 1,2 – 7,0 s | **1.127** cursos gratuitos | Poppins Bold, Amarelo Sol `#F4C42E`, número grande |
| 2 | 8,5 – 15,5 s | Harvard · MIT · Stanford · USP · FGV · Fiocruz | Poppins Medium, Areia, uma linha |
| 3 | 16,5 – 23,5 s | Certificado do Instituto Ubatuba | Poppins Medium, Areia, com ✓ em Verde Serra |
| 4 | 25,0 – 32,0 s | **institutoubatuba.org/cursos** | Poppins Bold, Areia sobre faixa Verde Serra 85% |
| 4 | 28,0 – 32,0 s | selo oficial (PNG), canto inferior | fade-in 1 s, 92% opacidade |

---

## 5. Montagem (ffmpeg)

```bash
# 1) concat dos 4 clipes (mesmo codec/fps saídos do Flow)
printf "file 'c1.mp4'\nfile 'c2.mp4'\nfile 'c3.mp4'\nfile 'c4.mp4'\n" > lista.txt
ffmpeg -nostdin -f concat -safe 0 -i lista.txt -c copy corte-bruto.mp4

# 2) trilha a 20% + loudnorm padrão web + selo oficial
#    (medir a fala na BANDA DA VOZ antes de qualquer corte:
#     highpass=250,lowpass=3800, janelas de 0,1 s, fala > -30 dB)
#    e terminar SEMPRE ~1 s depois da última sílaba
```

**Lições herdadas dos filmes 1 e 2 — valem aqui:**
1. Medir fala com `highpass=250,lowpass=3800` em janelas de 0,1 s; ondas e
   ambiência mascaram a cauda da voz e fazem cortar a última palavra.
2. Deixar **~1 s de respiro** depois da fala final, com fade de áudio.
3. Normalizar em `loudnorm I=-14:TP=-1.5` (padrão de web).
4. Vertical 9:16 a custo zero: `crop` dirigido com offset X por cena.

---

## 6. Legenda do post

**Instagram / Facebook:**

> 🎓 **1.127 CURSOS GRATUITOS — E 123 DELES SÃO DE HARVARD**
>
> Não é promoção, não é pegadinha, não tem cartão de crédito. 💚
>
> 📚 **O QUE TEM NO CATÁLOGO**
> 💻 Tecnologia — 160 cursos
> 📊 Administração — 556 cursos
> ⚖️ Direito — 102 cursos
> 🌿 Meio Ambiente — 78 cursos
> 🏥 Saúde — 61 cursos
> 🌍 Idiomas — 32 cursos
> 🎨 Artes & Cultura, 📖 Educação, 🔬 Ciências e mais
>
> 🏛️ **DE ONDE VÊM**
> Harvard · MIT · Stanford · USP · UNICAMP · UNESP · FGV · Fiocruz · SENAI ·
> Santander · Escola Virtual de Governo · Fundação Bradesco · Kultivi · MEC
>
> ✅ **POR QUE VALE**
> 💸 100% gratuito — sem mensalidade, sem taxa
> 🎓 Certificado do Instituto Ubatuba ao concluir
> ⏰ No seu ritmo, pelo celular
> 📖 Do iniciante ao avançado
>
> 🎯 **ODS 4 — EDUCAÇÃO DE QUALIDADE**
> A Agenda 2030 pede educação inclusiva, equitativa e de qualidade para todos.
> Democratizar o acesso ao conhecimento é exatamente isso na prática. 📚
>
> 👉 **institutoubatuba.org/cursos**
> (no Instagram, o link também está na bio 🔝)
>
> Não importa a idade nem a escolaridade: é para você. Marque nos comentários
> quem precisa dessa oportunidade. 💚🌊
>
> #CursosGratuitos #Educação #ODS4 #Ubatuba #InstitutoUbatuba #Harvard #MIT
> #USP #Agenda2030 #CursoOnline #Certificado #LitoralNorte #SantuárioEcológico
> #EducaçãoGratuita #Qualificação #PrimeiroEmprego
