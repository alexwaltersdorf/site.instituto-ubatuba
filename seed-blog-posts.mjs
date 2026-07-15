import mysql from "mysql2/promise";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const posts = [
  {
    slug: "escolinha-de-surfe-ods-saude-educacao-oceano",
    title: "Escolinha de Surfe: Ondas de Transformação Social",
    excerpt: "A Escolinha de Surfe do Instituto Ubatuba conecta crianças e jovens ao oceano, promovendo saúde, disciplina e consciência ambiental marinha. Conheça como esta ação se alinha aos ODS 3, 4, 10 e 14.",
    content: `# Escolinha de Surfe: Ondas de Transformação Social

## Uma ação que transforma vidas através do esporte e do mar

A Escolinha de Surfe do Instituto Ubatuba é muito mais do que aulas de surfe — é uma porta de entrada para o desenvolvimento integral de crianças e jovens da comunidade. Com mais de 3.000 aulas ministradas, o projeto oferece acesso gratuito ao esporte, equipamentos profissionais e monitores certificados, criando oportunidades reais para jovens que, de outra forma, não teriam contato com a prática esportiva.

## Como funciona

As aulas acontecem semanalmente nas praias de Ubatuba, com turmas organizadas por faixa etária e nível de habilidade. Cada sessão integra:

- **Prática esportiva**: técnicas de surfe adaptadas ao nível do aluno
- **Educação ambiental marinha**: conhecimento sobre o ecossistema oceânico
- **Desenvolvimento socioemocional**: disciplina, respeito, trabalho em equipe
- **Segurança aquática**: noções de primeiros socorros e comportamento no mar

## Impacto em números

- + de 3.000 aulas ministradas
- 160 crianças atendidas por temporada
- Equipamentos fornecidos gratuitamente
- Monitores certificados pela Federação de Surfe

## Conexão com os Objetivos de Desenvolvimento Sustentável (ODS)

### ODS 3 — Saúde e Bem-Estar
A prática regular do surfe promove saúde física e mental, combatendo o sedentarismo e fortalecendo a autoestima dos jovens participantes.

### ODS 4 — Educação de Qualidade
O projeto integra educação ambiental ao esporte, ampliando o repertório educacional dos alunos para além da sala de aula convencional.

### ODS 10 — Redução das Desigualdades
Ao oferecer acesso gratuito ao surfe — um esporte historicamente elitizado — o projeto democratiza oportunidades e promove inclusão social.

### ODS 14 — Vida na Água
A educação ambiental marinha integrada às aulas forma cidadãos conscientes sobre a preservação dos oceanos e ecossistemas costeiros.

## Parcerias e apoio

A Escolinha de Surfe conta com o apoio de surfistas locais, empresas do setor e da comunidade de Ubatuba, formando uma rede solidária em torno da transformação social pelo esporte.

---

*O Instituto Ubatuba acredita que cada criança que entra na água encontra um caminho. Apoie esta causa e ajude a transformar mais vidas.*`,
    coverImage: "/manus-storage/esporte_surfe_01_4756749a.jpg",
    category: "Esporte e Inclusão",
    tags: JSON.stringify(["surfe", "esporte", "inclusão", "ODS 3", "ODS 4", "ODS 10", "ODS 14", "juventude"]),
  },
  {
    slug: "escolinha-de-futebol-ods-saude-educacao-comunidade",
    title: "Escolinha de Futebol: Gols de Cidadania",
    excerpt: "A Escolinha de Futebol reúne crianças de diferentes bairros em torno do esporte, desenvolvendo habilidades técnicas e valores sociais. Saiba como o projeto se conecta aos ODS 3, 4, 10 e 11.",
    content: `# Escolinha de Futebol: Gols de Cidadania

## O esporte mais popular do Brasil como ferramenta de transformação

A Escolinha de Futebol do Instituto Ubatuba utiliza a paixão nacional pelo futebol como instrumento de desenvolvimento social. Reunindo crianças de diferentes bairros de Ubatuba, o projeto vai além do campo: forma cidadãos conscientes, promove a convivência e oferece um ambiente seguro para o crescimento integral.

## Como funciona

Os treinos acontecem regularmente com metodologia pedagógica adaptada, onde cada sessão trabalha:

- **Técnica esportiva**: fundamentos do futebol com progressão por nível
- **Valores e cidadania**: respeito, fair play, cooperação
- **Integração comunitária**: crianças de diferentes bairros convivendo
- **Participação competitiva**: torneios regionais como meta motivacional

## Impacto em números

- + de 2.500 aulas ministradas
- 120 crianças atendidas por temporada
- Participação em torneios regionais
- Parceria com a Associação de Moradores do Perequê-Açu

## Conexão com os Objetivos de Desenvolvimento Sustentável (ODS)

### ODS 3 — Saúde e Bem-Estar
A prática regular do futebol combate o sedentarismo infantil, promove saúde cardiovascular e fortalece o desenvolvimento motor das crianças.

### ODS 4 — Educação de Qualidade
O esporte como ferramenta pedagógica complementa a educação formal, desenvolvendo habilidades socioemocionais essenciais para o aprendizado.

### ODS 10 — Redução das Desigualdades
Ao reunir crianças de diferentes realidades socioeconômicas em um mesmo campo, o projeto promove equidade e quebra barreiras sociais.

### ODS 11 — Cidades e Comunidades Sustentáveis
A integração entre bairros fortalece o tecido social de Ubatuba, criando comunidades mais coesas e espaços públicos mais vivos.

## Parcerias estratégicas

O projeto conta com a parceria fundamental da Associação dos Moradores do Bairro do Perequê-Açu, que cede espaço e apoia logisticamente as atividades, demonstrando o poder da cooperação comunitária.

---

*Cada gol marcado no campo é um passo a mais na construção de uma Ubatuba mais justa e inclusiva.*`,
    coverImage: "/manus-storage/esporte_futebol_01_eab01f3c.jpg",
    category: "Esporte e Inclusão",
    tags: JSON.stringify(["futebol", "esporte", "inclusão", "ODS 3", "ODS 4", "ODS 10", "ODS 11", "comunidade"]),
  },
  {
    slug: "escolinha-de-futevolei-ods-saude-inclusao",
    title: "Escolinha de Futevôlei: Esporte, Praia e Comunidade",
    excerpt: "O futevôlei nas areias de Ubatuba une esporte, natureza e convivência intergeracional. Descubra como esta ação se conecta aos ODS 3, 4 e 10.",
    content: `# Escolinha de Futevôlei: Esporte, Praia e Comunidade

## A areia como palco de transformação

O futevôlei é um esporte genuinamente brasileiro que combina a destreza do futebol com a dinâmica do vôlei de praia. A Escolinha de Futevôlei do Instituto Ubatuba aproveita o cenário natural privilegiado da cidade para oferecer uma experiência esportiva única que integra diferentes gerações e promove o contato direto com a natureza.

## Como funciona

As atividades acontecem diretamente na areia das praias de Ubatuba:

- **Prática na praia**: redes profissionais instaladas em pontos estratégicos
- **Desenvolvimento motor**: coordenação, equilíbrio e agilidade na areia
- **Integração intergeracional**: jovens e adultos praticando juntos
- **Conexão com a natureza**: o ambiente praiano como sala de aula

## Impacto em números

- + de 2.000 aulas ministradas
- 80 crianças e jovens atendidos por temporada
- Integração entre diferentes faixas etárias
- Prática ao ar livre com contato direto com o ambiente natural

## Conexão com os Objetivos de Desenvolvimento Sustentável (ODS)

### ODS 3 — Saúde e Bem-Estar
O futevôlei na areia exige esforço físico intenso, promovendo condicionamento cardiovascular, fortalecimento muscular e saúde mental através do contato com a natureza.

### ODS 4 — Educação de Qualidade
A prática esportiva desenvolve habilidades cognitivas como tomada de decisão rápida, estratégia e pensamento coletivo — competências transferíveis para a vida acadêmica.

### ODS 10 — Redução das Desigualdades
O acesso gratuito ao esporte em um ambiente natural democratiza o lazer e a atividade física, independentemente da condição socioeconômica dos participantes.

## O diferencial do futevôlei

Diferente de outros esportes, o futevôlei praticado na praia oferece uma experiência sensorial completa: o som do mar, a brisa, a areia sob os pés. Essa conexão com o ambiente natural de Ubatuba reforça nos participantes o senso de pertencimento e a valorização do patrimônio ambiental da cidade.

---

*Na areia de Ubatuba, cada toque na bola é também um toque de comunidade, saúde e natureza.*`,
    coverImage: "/manus-storage/esporte_futevolei_01_075b0952.jpg",
    category: "Esporte e Inclusão",
    tags: JSON.stringify(["futevôlei", "esporte", "praia", "ODS 3", "ODS 4", "ODS 10", "natureza"]),
  },
  {
    slug: "projeto-itagua-azul-ods-oceanos-parcerias",
    title: "Projeto Itaguá Azul: Guardiões do Litoral",
    excerpt: "Em parceria com o Projeto Itaguá Azul, o Instituto atua na conservação dos ecossistemas marinhos com limpezas de praia e educação ambiental. Alinhado aos ODS 6, 14, 15 e 17.",
    content: `# Projeto Itaguá Azul: Guardiões do Litoral

## Conservação marinha através da ação coletiva

O Projeto Itaguá Azul é uma das parcerias mais emblemáticas do Instituto Ubatuba na área de conservação ambiental. Juntos, atuam na proteção dos ecossistemas marinhos e costeiros de Ubatuba através de ações práticas de limpeza, monitoramento da fauna e educação ambiental com a comunidade.

## Como funciona

A parceria se materializa em diversas frentes de atuação:

- **Limpezas periódicas**: mutirões organizados nas praias de Ubatuba
- **Monitoramento ambiental**: acompanhamento de espécies marinhas e indicadores de saúde dos ecossistemas
- **Educação ambiental**: palestras e oficinas nas escolas locais
- **Coleta seletiva**: destinação correta de resíduos encontrados nas praias

## Impacto

- Praias e ecossistemas marinhos preservados
- Toneladas de resíduos removidos do litoral
- Centenas de voluntários mobilizados
- Educação ambiental alcançando escolas de toda a região

## Conexão com os Objetivos de Desenvolvimento Sustentável (ODS)

### ODS 6 — Água Limpa e Saneamento
A remoção de resíduos das praias e a conscientização sobre descarte correto contribuem diretamente para a qualidade das águas costeiras e dos lençóis freáticos da região.

### ODS 14 — Vida na Água
O monitoramento da fauna marinha e a limpeza dos ecossistemas costeiros protegem a biodiversidade marinha de Ubatuba, uma das mais ricas do litoral paulista.

### ODS 15 — Vida Terrestre
A interface entre ecossistemas marinhos e terrestres (manguezais, restingas) é diretamente beneficiada pelas ações de conservação e remoção de poluentes.

### ODS 17 — Parcerias e Meios de Implementação
A cooperação entre o Instituto Ubatuba e o Projeto Itaguá Azul exemplifica o poder das parcerias multissetoriais para alcançar resultados ambientais significativos.

## A importância da parceria

O Projeto Itaguá Azul traz expertise técnica em conservação marinha, enquanto o Instituto Ubatuba mobiliza a comunidade e oferece infraestrutura logística. Essa complementaridade é o que torna a parceria tão eficaz — um exemplo vivo da ODS 17 em ação.

---

*Cada pedaço de lixo removido da praia é uma vitória para o oceano. Junte-se aos guardiões do litoral de Ubatuba.*`,
    coverImage: "/manus-storage/itaguaazul_voluntarios_praia_f3eed109.jpg",
    category: "Conservação Ambiental",
    tags: JSON.stringify(["conservação", "oceano", "limpeza de praia", "ODS 6", "ODS 14", "ODS 15", "ODS 17", "Itaguá Azul"]),
  },
  {
    slug: "bituqueira-ecologica-ods-consumo-responsavel",
    title: "Bituqueira Ecológica: Pequenos Resíduos, Grande Impacto",
    excerpt: "A Bituqueira Ecológica combate um dos maiores poluentes das praias com coletores especializados e campanhas de conscientização. Conectada aos ODS 12, 14 e 15.",
    content: `# Bituqueira Ecológica: Pequenos Resíduos, Grande Impacto

## Uma solução inovadora para um problema invisível

As bitucas de cigarro são o resíduo mais encontrado nas praias do mundo. Cada bituca contém mais de 4.000 substâncias tóxicas que contaminam a areia e o oceano. A Bituqueira Ecológica é a resposta do Instituto Ubatuba a esse problema: uma iniciativa inovadora de coleta e destinação adequada que transforma comportamentos e protege ecossistemas.

## Como funciona

O projeto atua em múltiplas frentes:

- **Coletores especializados**: instalados em pontos estratégicos das praias e do comércio local
- **Reciclagem**: as bitucas coletadas são encaminhadas para processos de reciclagem e transformação
- **Campanhas de conscientização**: ações educativas com banhistas e comerciantes
- **Parcerias locais**: envolvimento do comércio e da comunidade na manutenção dos coletores

## Impacto

- Redução significativa da poluição por bitucas nas praias
- Milhares de bitucas coletadas e destinadas corretamente
- Mudança de comportamento dos frequentadores das praias
- Modelo replicável para outras cidades litorâneas

## Conexão com os Objetivos de Desenvolvimento Sustentável (ODS)

### ODS 12 — Consumo e Produção Responsáveis
O projeto promove a responsabilidade pós-consumo, incentivando fumantes a descartarem bitucas corretamente e conscientizando sobre o impacto ambiental de resíduos aparentemente pequenos.

### ODS 14 — Vida na Água
Ao impedir que bitucas cheguem ao oceano, o projeto protege diretamente a vida marinha de Ubatuba contra a contaminação por metais pesados e microplásticos presentes nos filtros de cigarro.

### ODS 15 — Vida Terrestre
A areia da praia e a vegetação de restinga são ecossistemas terrestres diretamente beneficiados pela remoção de resíduos tóxicos que comprometem a qualidade do solo.

## Inovação e replicabilidade

O modelo da Bituqueira Ecológica é simples, de baixo custo e altamente replicável. O Instituto Ubatuba documenta a experiência para que outras cidades litorâneas possam implementar soluções semelhantes, multiplicando o impacto positivo.

---

*Uma bituca pode parecer insignificante, mas milhões delas representam uma catástrofe ambiental. A Bituqueira Ecológica prova que soluções simples geram grandes transformações.*`,
    coverImage: "/manus-storage/bituqueira_flyer_6acac4ec.jpg",
    category: "Conservação Ambiental",
    tags: JSON.stringify(["bituqueira", "reciclagem", "praia", "ODS 12", "ODS 14", "ODS 15", "inovação ambiental"]),
  },
  {
    slug: "acoes-de-saude-ods-bem-estar-igualdade",
    title: "Ações de Saúde: Cuidado que Alcança Quem Mais Precisa",
    excerpt: "Em parceria com a Total Quality Medicina Diagnóstica, o Instituto oferece exames e consultas gratuitas para a comunidade. Alinhado aos ODS 3, 10 e 17.",
    content: `# Ações de Saúde: Cuidado que Alcança Quem Mais Precisa

## Saúde como direito, não privilégio

As Ações de Saúde do Instituto Ubatuba nascem da convicção de que o acesso à saúde de qualidade não pode depender da condição socioeconômica. Em parceria com a Total Quality Medicina Diagnóstica, o projeto oferece exames laboratoriais, de imagem e consultas médicas especializadas para a população mais vulnerável de Ubatuba — gratuitamente.

## Como funciona

O programa opera em diversas frentes:

- **Exames laboratoriais e de imagem**: diagnósticos que normalmente teriam custo elevado
- **Consultas médicas especializadas**: acesso a profissionais qualificados
- **Bolsas de estudo**: 120 bolsas concedidas para jovens de destaque
- **Acompanhamento de atletas**: monitoramento da saúde dos participantes das escolinhas esportivas

## Impacto em números

- + de 5.000 exames e atendimentos realizados
- 120 bolsas de estudo concedidas
- Campanhas sazonais (Outubro Rosa, Novembro Azul)
- Acompanhamento contínuo dos atletas das escolinhas

## Conexão com os Objetivos de Desenvolvimento Sustentável (ODS)

### ODS 3 — Saúde e Bem-Estar
O acesso a exames preventivos e consultas especializadas permite diagnósticos precoces, tratamentos oportunos e melhoria direta na qualidade de vida da comunidade.

### ODS 10 — Redução das Desigualdades
Ao oferecer serviços de saúde de alta qualidade gratuitamente, o projeto reduz a desigualdade no acesso à medicina diagnóstica — um dos maiores gargalos do sistema público de saúde.

### ODS 17 — Parcerias e Meios de Implementação
A parceria com a Total Quality Medicina Diagnóstica é um exemplo de como o setor privado pode contribuir decisivamente para o bem-estar social, unindo expertise técnica e responsabilidade corporativa.

## O diferencial: saúde integrada ao esporte

Um aspecto único do programa é a integração com as escolinhas esportivas: os jovens atletas recebem acompanhamento médico regular, garantindo que a prática esportiva seja segura e saudável. Além disso, as 120 bolsas de estudo reconhecem e incentivam jovens de destaque, criando um ciclo virtuoso entre saúde, educação e esporte.

## Campanhas especiais

O Instituto realiza campanhas sazonais como o Outubro Rosa e o Novembro Azul, ampliando o alcance das ações de saúde e promovendo a conscientização sobre prevenção em toda a comunidade.

---

*Saúde não é luxo — é direito. As Ações de Saúde do Instituto Ubatuba garantem que ninguém fique para trás.*`,
    coverImage: "/manus-storage/saude_equipe_outubro_rosa_30c65acf.webp",
    category: "Saúde Comunitária",
    tags: JSON.stringify(["saúde", "exames", "consultas", "ODS 3", "ODS 10", "ODS 17", "Total Quality", "bolsas de estudo"]),
  },
  {
    slug: "feira-literaria-ods-educacao-cultura",
    title: "Feira Literária: Páginas que Transformam",
    excerpt: "Em parceria com a Escola Marina Nepomuceno do Amaral, a Feira Literária promove acesso à literatura e fortalece a identidade cultural. Conectada aos ODS 4, 10 e 11.",
    content: `# Feira Literária: Páginas que Transformam

## Literatura como ferramenta de empoderamento

A Feira Literária do Instituto Ubatuba, realizada em parceria com a Escola Marina Nepomuceno do Amaral, é muito mais do que um evento de livros — é uma celebração do conhecimento, da criatividade e da identidade cultural de Ubatuba. O projeto promove o acesso à literatura para centenas de estudantes que, muitas vezes, têm na escola o único contato com livros.

## Como funciona

A Feira Literária se desdobra em múltiplas atividades:

- **Doação de livros**: acervo disponibilizado gratuitamente para alunos e comunidade
- **Oficinas literárias**: escrita criativa, poesia, contação de histórias
- **Apresentações culturais**: teatro, música e dança inspirados em obras literárias
- **Encontros com autores**: escritores locais e regionais compartilhando experiências

## Impacto

- Centenas de estudantes alcançados a cada edição
- Livros e materiais didáticos doados
- Oficinas de escrita criativa e contação de histórias
- Fortalecimento da identidade cultural local

## Conexão com os Objetivos de Desenvolvimento Sustentável (ODS)

### ODS 4 — Educação de Qualidade
O acesso à literatura amplia horizontes, desenvolve o pensamento crítico e complementa a educação formal com experiências culturais enriquecedoras.

### ODS 10 — Redução das Desigualdades
Ao democratizar o acesso a livros e experiências literárias, o projeto reduz a desigualdade educacional e cultural entre diferentes camadas sociais de Ubatuba.

### ODS 11 — Cidades e Comunidades Sustentáveis
A Feira Literária fortalece o patrimônio cultural imaterial de Ubatuba, criando espaços de encontro e expressão que tornam a cidade mais viva e inclusiva.

## A parceria com a Escola Marina Nepomuceno do Amaral

A escola é o coração do projeto: professores e alunos participam ativamente da curadoria, das apresentações e da organização. Essa co-criação garante que a Feira reflita genuinamente os interesses e necessidades da comunidade escolar.

## Além dos livros

A Feira Literária também é palco para encenações teatrais, apresentações musicais e exposições artísticas dos alunos, transformando a literatura em uma experiência multissensorial que marca a memória dos participantes.

---

*Cada página lida é uma semente plantada. A Feira Literária cultiva o futuro de Ubatuba através do poder das palavras.*`,
    coverImage: "/manus-storage/feira_literaria_criancas_db3322cc.jpg",
    category: "Educação e Cultura",
    tags: JSON.stringify(["literatura", "educação", "cultura", "ODS 4", "ODS 10", "ODS 11", "escola", "leitura"]),
  },
  {
    slug: "festivais-culturais-ods-turismo-sustentavel",
    title: "Festivais Culturais: Arte, Tradição e Sustentabilidade",
    excerpt: "O Festival de Pipas e o Festival de Escultura na Areia celebram a cultura local e promovem turismo sustentável em Ubatuba. Alinhados aos ODS 8, 11, 12 e 17.",
    content: `# Festivais Culturais: Arte, Tradição e Sustentabilidade

## Celebrando a identidade de Ubatuba

Os Festivais Culturais apoiados pelo Instituto Ubatuba — o Festival de Pipas e o Festival de Escultura na Areia — são manifestações vivas da cultura caiçara e da criatividade humana. Esses eventos reúnem moradores e turistas em celebrações que valorizam a tradição, promovem a arte e impulsionam o turismo sustentável na região.

## Festival de Pipas

Uma tradição cultural de Ubatuba que remonta a gerações:

- **Oficinas de construção**: crianças e adultos aprendem a confeccionar pipas artesanais
- **Competições amistosas**: categorias por idade e estilo
- **Resgate cultural**: preservação de técnicas tradicionais caiçaras
- **Integração comunitária**: famílias inteiras participando juntas

## Festival de Escultura na Areia

Arte efêmera que transforma a praia em galeria a céu aberto:

- **Artistas locais e regionais**: escultores criando obras diretamente na areia
- **Participação do público**: oficinas abertas para todas as idades
- **Temas ambientais**: muitas obras retratam a fauna e flora marinha
- **Documentação artística**: registro fotográfico das obras antes que o mar as leve

## Impacto

- Milhares de visitantes e participantes a cada edição
- Geração de renda para artesãos e comerciantes locais
- Promoção do turismo cultural sustentável
- Fortalecimento da identidade caiçara

## Conexão com os Objetivos de Desenvolvimento Sustentável (ODS)

### ODS 8 — Trabalho Decente e Crescimento Econômico
Os festivais geram renda para artesãos, comerciantes e prestadores de serviços locais, impulsionando a economia criativa de Ubatuba de forma sustentável.

### ODS 11 — Cidades e Comunidades Sustentáveis
Ao valorizar o patrimônio cultural imaterial e criar espaços públicos de convivência, os festivais contribuem para uma Ubatuba mais inclusiva e culturalmente rica.

### ODS 12 — Consumo e Produção Responsáveis
A arte efêmera das esculturas na areia e as pipas artesanais promovem uma relação mais consciente com materiais e recursos, valorizando a criatividade sobre o consumo.

### ODS 17 — Parcerias e Meios de Implementação
A realização dos festivais envolve parcerias entre o Instituto, a prefeitura, o comércio local e artistas — um ecossistema colaborativo que multiplica resultados.

## Arte que o mar leva, memória que fica

As esculturas na areia são, por natureza, efêmeras — o mar as dissolve ao fim do dia. Mas a experiência de criá-las e contemplá-las permanece na memória da comunidade, ensinando sobre a beleza do transitório e o valor do momento presente.

---

*Tradição e inovação se encontram nas areias de Ubatuba. Os Festivais Culturais provam que a arte é o caminho mais bonito para o desenvolvimento sustentável.*`,
    coverImage: "/manus-storage/festival_pipas_praia_a67c2a3e.webp",
    category: "Educação e Cultura",
    tags: JSON.stringify(["festivais", "cultura", "pipas", "escultura", "ODS 8", "ODS 11", "ODS 12", "ODS 17", "turismo sustentável"]),
  },
];

async function main() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  for (const post of posts) {
    try {
      await connection.execute(
        `INSERT INTO posts (slug, title, excerpt, content, coverImage, category, tags, published, publishedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, true, NOW())
         ON DUPLICATE KEY UPDATE
         title = VALUES(title),
         excerpt = VALUES(excerpt),
         content = VALUES(content),
         coverImage = VALUES(coverImage),
         category = VALUES(category),
         tags = VALUES(tags),
         published = true,
         publishedAt = COALESCE(publishedAt, NOW())`,
        [post.slug, post.title, post.excerpt, post.content, post.coverImage, post.category, post.tags]
      );
      console.log(`✓ Inserted/updated: ${post.title}`);
    } catch (err) {
      console.error(`✗ Error on "${post.title}":`, err.message);
    }
  }

  await connection.end();
  console.log("\nDone! All blog posts created.");
}

main().catch(console.error);
