# 📚 Novas fontes de cursos — levantamento de 12/11/2026

Varredura dos 20 catálogos indicados. Abaixo o que foi extraído, o que ficou
de fora e por quê.

---

## ✅ Coletado e pronto para inserir — **727 cursos**

| Fonte | Cursos | Como foi obtido |
|---|---:|---|
| **FGV** Cursos Gratuitos | **227** | API pública do catálogo (todos os 227) |
| **MIT** OpenCourseWare | **199** | API aberta `api.learn.mit.edu`, os mais acessados |
| **Einstein** Academia Digital | **140** | API do catálogo (todos os 140) |
| **Fundação Bradesco** Escola Virtual | **61** | API `ev.org.br/api/busca-curso` (todos os 61) |
| **Sebrae-SP** | **42** | Leitura da vitrine de cursos online |
| **USP** Apolo (extensão a distância) | **26** | Tabela oficial — de 104, só os 26 gratuitos |
| **SENAI-SP** Cursos Livres | **22** | Varredura das 14 áreas, só os a distância |
| **Harvard** catálogo gratuito | **10** | Os que ainda não estavam no site |

**Por categoria:** Administração 238 · Tecnologia 175 · Saúde 142 ·
Educação 112 · Direito 32 · Ciências 15 · Meio Ambiente 12 · Artes 1.

### Decisões que tomei na coleta

**MIT: 199 de 2.587.** O OpenCourseWare tem 2.587 cursos gratuitos. Trazer
todos faria o MIT sozinho dobrar o catálogo e afogar as outras instituições na
busca. Peguei os **200 mais acessados** (um já estava no site), ordenados pelo
número real de visualizações da API — de "Hands-On Deep Learning" (290 mil
acessos) para baixo. Se quiser o catálogo inteiro, é só pedir: a API entrega.

**Harvard: só 10 novos.** O catálogo gratuito de Harvard tem 118 cursos, e
**108 já estavam no site**. Os 10 restantes entram — entre eles "Humanitarian
Response to Conflict and Disaster" e "Energy Within Environmental Constraints".

**MIT OpenCourseWare não é curso com matrícula.** São materiais de aula
abertos: notas, exercícios, vídeos. Não há inscrição nem conclusão rastreável,
e boa parte é de 2005–2015. Entram como material de estudo, mas o fluxo de
"concluir e pedir certificado do Instituto" não se aplica a eles do mesmo jeito
que a FGV ou ao Bradesco. Vale um aviso na página desses cursos.

---

## ⚠️ Não coletado — e por quê

### Precisam de trabalho específico por site

| Fonte | O que impediu |
|---|---|
| **Stanford Online** | A lista de cursos gratuitos carrega por JavaScript com um padrão de link próprio; a varredura genérica não pegou |
| **UNESP Aberta** | O catálogo é uma aplicação de página única; o conteúdo só aparece após interação |
| **IFRS Moodle** | A página inicial lista **categorias**, não cursos — é preciso entrar em cada uma |
| **OpenWHO (OMS)** | O site não respondeu dentro de 100 segundos nas tentativas |
| **Khan Academy** | Bloqueia automação ("Client Challenge") |

Nenhum é impossível — cada um precisa de um extrator próprio, que é meia hora
de trabalho por site. Diga quais importam mais e eu faço.

### Levantam uma questão antes de entrar

**Escala.** Microsoft Learn tem mais de 5 mil módulos; Khan Academy, milhares
de vídeos e exercícios. Despejar isso levaria o catálogo de 1.127 para mais de
10 mil registros e tornaria a busca inútil. Com o novo filtro de instituições
isso melhora, mas ainda assim recomendo **um teto por instituição** (algo como
150 a 250), escolhendo pelos mais procurados — foi o que fiz com o MIT.

**O que "gratuito" significa em cada um.** As páginas de "cursos gratuitos" do
**Coursera** e do **edX** misturam curso de acesso livre com curso pago que tem
só uma amostra grátis, e o rótulo muda de semana para semana. Entrar com elas
sem checar curso a curso repetiria o problema que a auditoria de ontem
encontrou. O mesmo vale para **Google Cloud Skills Boost, Microsoft Learn,
AWS Skill Builder, Cisco NetAcad e IBM SkillsBuild**: o conteúdo é gratuito,
mas o **exame de certificação é pago** (de US$ 100 a US$ 300). São plataformas
de treinamento de fornecedor, não cursos com certificado de conclusão — e isso
precisa ficar claro para o aluno.

**Escola Virtual.Gov (EV.G/ENAP)** já é a maior fonte do site, com **888
cursos**. O catálogo completo tem mais, mas antes de ampliar vale decidir se o
Instituto quer que quase toda a oferta venha de uma única plataforma.

---

## Minha recomendação de ordem

1. **Inserir os 727 agora** — são oito instituições verificadas, e o salto em
   Saúde (de 61 para 203) e Educação cobre lacunas reais do catálogo.
2. **Decidir o teto por instituição** antes de abrir MIT, Microsoft e Khan.
3. **Coletar Stanford, UNESP, IFRS e OpenWHO** com extrator dedicado — os
   quatro são gratuitos de verdade e sem pegadinha de certificado.
4. **Deixar Coursera, edX e os fornecedores de tecnologia por último**, e só
   com verificação curso a curso do que é realmente livre.

---

## Arquivos

| Arquivo | Conteúdo |
|---|---|
| `inserir-cursos.sql` | 727 INSERTs, em transação, prontos para rodar |
| `novos-cursos.json` | Os mesmos 727 em JSON, para conferência |
| `corrigir-catalogo.sql` | Os 18 registros defeituosos da auditoria anterior |

Todos entram com `featured = 0` e `active = 1`, e os slugs levam prefixo da
instituição (`fgv-`, `mit-`, `einstein-`, `bradesco-`…) para não colidir.
