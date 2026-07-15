import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Sparkles, Users, Heart, Leaf, Dumbbell, BookOpen, Palette, Star, Crown } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   MASCOTES DO INSTITUTO UBATUBA
   27 personagens nomeados com conexão à história e cultura de Ubatuba.
   Cada nome carrega um significado tupi-guarani, caiçara ou histórico.
═══════════════════════════════════════════════════════════════ */

// ── Imagens dos mascotes ──
const IMAGES = {
  uba: "/manus-storage/01-Uba_75a5a8c3.jpg",
  kaua: "/manus-storage/02-Kaua_bb0fe956.jpg",
  yara: "/manus-storage/03-Yara_dfebad74.jpg",
  ibere: "/manus-storage/04-Ibere_6f9244ba.jpg",
  janaina: "/manus-storage/05-Janaina_b3a482a1.jpg",
  piata: "/manus-storage/06-Piata_663a2b11.jpg",
  jaci: "/manus-storage/07-Jaci_e8c01df8.jpg",
  guaraci: "/manus-storage/08-Guaraci_0c2d3660.jpg",
  aracy: "/manus-storage/09-Aracy_e43d69fd.jpg",
  caue: "/manus-storage/10-Caue_e139abb0.jpg",
  taina: "/manus-storage/11-Taina_863545fc.jpg",
  ubirata: "/manus-storage/12-Ubirata_0f316ae1.jpg",
  potira: "/manus-storage/13-Potira_f3730cc8.jpg",
  lucas: "/manus-storage/14-Lucas_4ea2c92e.jpg",
  iracema: "/manus-storage/15-Iracema_c5bcf416.jpg",
  ruda: "/manus-storage/16-Ruda_6dd2313d.jpg",
  moema: "/manus-storage/17-Moema_9122c572.jpg",
  alex: "/manus-storage/18-Alex_e9820acf.jpg",
  jandira: "/manus-storage/19-Jandira_b0ccdbb9.jpg",
  arandu: "/manus-storage/20-Arandu_2f68cc1c.jpg",
  keli: "/manus-storage/21-Keli_d032e098.jpg",
  chico: "/manus-storage/22-Chico_77b14192.jpg",
  jucara: "/manus-storage/23-Jucara_c8629f60.jpg",
  cunhambebe: "/manus-storage/24-Cunhambebe_f4333af5.jpg",
  jaciara: "/manus-storage/25-Jaciara_427d8960.jpg",
  benedito: "/manus-storage/26-Benedito_9188c38e.jpg",
  dandara: "/manus-storage/27-Dandara_52fb9bc3.jpg",
};

// ── Categorias ──
type Category = "todos" | "principais" | "esporte" | "saude-educacao" | "cultura";

const categories: { id: Category; label: string; icon: React.ReactNode }[] = [
  { id: "todos", label: "Todos", icon: <Sparkles className="w-4 h-4" /> },
  { id: "principais", label: "Líderes", icon: <Crown className="w-4 h-4" /> },
  { id: "esporte", label: "Esporte", icon: <Dumbbell className="w-4 h-4" /> },
  { id: "saude-educacao", label: "Saúde e Educação", icon: <BookOpen className="w-4 h-4" /> },
  { id: "cultura", label: "Cultura e Tradição", icon: <Palette className="w-4 h-4" /> },
];

// ── Dados dos mascotes ──
interface Mascot {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  image: string;
  category: Category[];
  color: string;
  special?: string; // Destaque especial (Presidente, Vice, Embaixador)
}

const mascots: Mascot[] = [
  // ── LÍDERES / PRINCIPAIS ──
  {
    id: "uba",
    name: "Ubá",
    subtitle: "O Guardião da Mata Atlântica",
    description:
      "Ubá é o mascote principal do Instituto. Seu nome vem do tupi-guarani e significa \"canoa\" — a embarcação que conecta o mar à terra, símbolo perfeito de Ubatuba, cidade cujo próprio nome deriva de \"uba\" (canoa) + \"tuba\" (abundância). Ubá representa a união entre comunidade e natureza, guiando todas as ações do Instituto com alegria e propósito.",
    image: IMAGES.uba,
    category: ["principais"],
    color: "bg-forest",
  },
  {
    id: "kaua",
    name: "Kauã",
    subtitle: "O Explorador das Ondas",
    description:
      "Kauã significa \"gavião\" em tupi-guarani — a ave de rapina que sobrevoa as montanhas da Serra do Mar em Ubatuba com olhos atentos. Assim como o gavião, Kauã tem visão ampla e espírito aventureiro. Ele representa a juventude ubatubense que busca novas oportunidades através do esporte e da conexão com o oceano.",
    image: IMAGES.kaua,
    category: ["principais"],
    color: "bg-ocean",
  },
  {
    id: "yara",
    name: "Yara",
    subtitle: "A Protetora dos Mares",
    description:
      "Yara é a lendária \"mãe d'água\" da mitologia tupi-guarani — a sereia que protege rios e mares. Em Ubatuba, onde a Mata Atlântica encontra o oceano em mais de 100 praias, Yara simboliza a preservação dos ecossistemas marinhos. Ela lidera as ações ambientais do Instituto, ensinando sobre sustentabilidade e respeito pela vida marinha.",
    image: IMAGES.yara,
    category: ["principais"],
    color: "bg-ocean",
  },

  // ── ESPORTE ──
  {
    id: "ibere",
    name: "Iberê",
    subtitle: "O Surfista das Águas Claras",
    description:
      "Iberê significa \"águas claras\" em tupi-guarani — uma referência perfeita às praias cristalinas de Ubatuba como Lázaro, Domingas Dias e Félix. Ele representa a Escolinha de Surfe, onde mais de 3.000 aulas já foram ministradas. Iberê mostra que o mar é para todos, ensinando disciplina e respeito pela natureza através das ondas.",
    image: IMAGES.ibere,
    category: ["esporte"],
    color: "bg-ocean",
  },
  {
    id: "janaina",
    name: "Janaína",
    subtitle: "A Rainha das Ondas",
    description:
      "Janaína é outro nome para Iemanjá, a rainha do mar na cultura afro-brasileira — divindade muito celebrada pelos pescadores de Ubatuba. Ela representa a força feminina no surfe e a inclusão de meninas nos programas esportivos. Nas praias do litoral norte, Janaína prova que não existem limites de gênero no esporte.",
    image: IMAGES.janaina,
    category: ["esporte"],
    color: "bg-ocean",
  },
  {
    id: "piata",
    name: "Piatã",
    subtitle: "O Craque da Comunidade",
    description:
      "Piatã significa \"forte\" e \"resistente\" em tupi-guarani — qualidades dos moradores de Ubatuba que enfrentam a Serra do Mar e o mar bravo com coragem. Ele representa a Escolinha de Futebol, com mais de 2.500 aulas ministradas. Nos campos da cidade, Piatã ensina que o verdadeiro gol é o trabalho em equipe e a amizade.",
    image: IMAGES.piata,
    category: ["esporte"],
    color: "bg-forest",
  },
  {
    id: "jaci",
    name: "Jaci",
    subtitle: "A Artilheira da Lua",
    description:
      "Jaci significa \"lua\" em tupi-guarani — o astro que ilumina as noites de Ubatuba e guia os pescadores de volta ao porto. Ela representa o futebol feminino no Instituto, mostrando que as meninas brilham nos campos com a mesma intensidade da lua cheia sobre a Praia do Itaguá. Jaci é sinônimo de empoderamento e garra.",
    image: IMAGES.jaci,
    category: ["esporte"],
    color: "bg-forest",
  },
  {
    id: "guaraci",
    name: "Guaraci",
    subtitle: "O Mestre da Areia",
    description:
      "Guaraci significa \"sol\" em tupi-guarani — o astro que aquece as areias de Ubatuba onde o futevôlei acontece. Ele representa a Escolinha de Futevôlei, com mais de 2.000 aulas nas praias. Guaraci domina a bola com os pés na areia quente, mostrando que o esporte de praia é acessível a todos sob o sol do litoral norte.",
    image: IMAGES.guaraci,
    category: ["esporte"],
    color: "bg-earth",
  },
  {
    id: "aracy",
    name: "Aracy",
    subtitle: "A Estrela da Praia",
    description:
      "Aracy significa \"aurora\" ou \"manhã\" em tupi-guarani — o momento em que o sol nasce sobre o mar de Ubatuba, tingindo as praias de dourado. Com movimentos graciosos e potentes no futevôlei, Aracy representa a presença feminina no esporte de areia, inspirando meninas a descobrirem confiança e alegria a cada toque na bola.",
    image: IMAGES.aracy,
    category: ["esporte"],
    color: "bg-earth",
  },
  {
    id: "caue",
    name: "Cauê",
    subtitle: "O Radical das Ruas",
    description:
      "Cauê significa \"gavião\" ou \"aquele que é esperto\" em tupi-guarani. Assim como o gavião que desliza pelo ar com liberdade sobre a Serra do Mar, Cauê desliza sobre o skate com criatividade e coragem. Ele representa o programa de Skate, transformando calçadas e pistas de Ubatuba em palcos de superação e expressão artística.",
    image: IMAGES.caue,
    category: ["esporte"],
    color: "bg-laranja",
  },
  {
    id: "taina",
    name: "Tainá",
    subtitle: "A Skatista Estrela",
    description:
      "Tainá significa \"estrela\" em tupi-guarani — e como uma estrela, ela brilha sobre rodas quebrando estereótipos. Tainá representa as meninas que encontram no skate liberdade e autoexpressão pelas ruas de Ubatuba. No Instituto, o skate feminino é celebrado como forma de empoderamento, criatividade e pertencimento à comunidade.",
    image: IMAGES.taina,
    category: ["esporte"],
    color: "bg-laranja",
  },
  {
    id: "ubirata",
    name: "Ubiratã",
    subtitle: "O Guerreiro da Lança Forte",
    description:
      "Ubiratã significa \"lança forte\" em tupi-guarani — o guerreiro que protege sua aldeia com disciplina e honra. Ele representa o programa de Karatê, onde crianças aprendem autocontrole, respeito e formação de caráter. Em Ubatuba, terra de guerreiros tupinambás, Ubiratã mantém viva a tradição de força interior e disciplina.",
    image: IMAGES.ubirata,
    category: ["esporte"],
    color: "bg-forest",
  },
  {
    id: "potira",
    name: "Potira",
    subtitle: "A Guerreira das Flores",
    description:
      "Potira significa \"flor\" em tupi-guarani — delicada na aparência, mas forte na essência, como as bromélias da Mata Atlântica de Ubatuba que resistem a tempestades. Ela representa o karatê feminino, demonstrando que a arte marcial combina beleza e poder. Cada kata praticado por Potira é uma lição de perseverança e autodomínio.",
    image: IMAGES.potira,
    category: ["esporte"],
    color: "bg-forest",
  },
  {
    id: "lucas",
    name: "Lucas",
    subtitle: "Embaixador do Jiu-Jitsu",
    description:
      "Lucas é filho de Alex e Keli, os fundadores do Instituto Ubatuba. Como Embaixador do Esporte do Jiu-Jitsu, ele representa a nova geração que cresce praticando a \"arte suave\" — aprendendo a resolver conflitos com inteligência e técnica. Lucas é a prova viva de que o esporte transforma vidas desde a infância.",
    image: IMAGES.lucas,
    category: ["esporte"],
    color: "bg-ocean",
    special: "Embaixador do Jiu-Jitsu — Filho de Alex e Keli",
  },
  {
    id: "iracema",
    name: "Iracema",
    subtitle: "A Lutadora dos Lábios de Mel",
    description:
      "Iracema significa \"lábios de mel\" em tupi-guarani — a heroína do romance de José de Alencar que simboliza a força e a doçura da mulher indígena brasileira. No tatame do Instituto, Iracema representa o jiu-jitsu feminino com técnica refinada e mente afiada, provando que a \"arte suave\" é também feminina e poderosa.",
    image: IMAGES.iracema,
    category: ["esporte"],
    color: "bg-ocean",
  },
  {
    id: "ruda",
    name: "Rudá",
    subtitle: "O Nadador do Amor",
    description:
      "Rudá é o deus do amor na mitologia tupi-guarani — aquele que faz os corações baterem mais forte. Em Ubatuba, cidade litorânea onde saber nadar é essencial, Rudá representa o programa de Natação com paixão e segurança. Cada braçada é um passo em direção à saúde e à liberdade de viver em harmonia com o mar.",
    image: IMAGES.ruda,
    category: ["esporte"],
    color: "bg-ocean",
  },
  {
    id: "moema",
    name: "Moema",
    subtitle: "A Sereia Atleta",
    description:
      "Moema é a indígena que, segundo a lenda, nadou até a exaustão por amor — tornando-se símbolo de determinação e entrega. Em Ubatuba, Moema representa as meninas que aprendem a nadar com segurança e confiança. Onde o mar é vizinho, saber nadar é um direito — e Moema garante que nenhuma criança fique de fora.",
    image: IMAGES.moema,
    category: ["esporte"],
    color: "bg-ocean",
  },

  // ── SAÚDE E EDUCAÇÃO ──
  {
    id: "alex",
    name: "Alex",
    subtitle: "Presidente — Mascote da Saúde",
    description:
      "Alex Waltersdorf é o Presidente do Instituto Ubatuba Santuário Ecológico e o Mascote da Saúde. Ele representa as Ações de Saúde que já realizaram mais de 5.000 exames e atendimentos gratuitos para a comunidade — do Outubro Rosa às consultas pediátricas. Alex simboliza o compromisso com o acesso à saúde como direito fundamental para todos os ubatubenses.",
    image: IMAGES.alex,
    category: ["saude-educacao", "principais"],
    color: "bg-ocean",
    special: "Presidente do Instituto Ubatuba",
  },
  {
    id: "jandira",
    name: "Jandira",
    subtitle: "A Cuidadora de Mel",
    description:
      "Jandira significa \"abelha de mel\" em tupi-guarani — o inseto que trabalha incansavelmente para o bem coletivo, assim como as profissionais de saúde voluntárias do Instituto. Ela representa o cuidado e a compaixão, garantindo que cada pessoa da comunidade de Ubatuba receba atenção médica de qualidade com acolhimento e dedicação.",
    image: IMAGES.jandira,
    category: ["saude-educacao"],
    color: "bg-ocean",
  },
  {
    id: "arandu",
    name: "Arandu",
    subtitle: "O Mestre do Saber",
    description:
      "Arandu significa \"sabedoria\" ou \"inteligência\" em guarani — o conhecimento que os anciãos transmitem às novas gerações. Ele representa os educadores e voluntários que dedicam seu tempo para formar cidadãos conscientes. No Instituto Ubatuba, educação vai além da sala de aula — acontece na praia, no campo e em cada interação com a natureza.",
    image: IMAGES.arandu,
    category: ["saude-educacao"],
    color: "bg-forest",
  },
  {
    id: "keli",
    name: "Keli",
    subtitle: "Vice-Presidente — Mascote da Educação",
    description:
      "Keli é a Vice-Presidente do Instituto Ubatuba e o Mascote da Educação. Ela representa os programas educacionais, incluindo a Feira Literária e as parcerias com escolas locais. Com livros e criatividade, Keli mostra que a educação é a base de toda transformação social. Cada aula, cada livro lido é uma semente plantada para o futuro de Ubatuba.",
    image: IMAGES.keli,
    category: ["saude-educacao", "principais"],
    color: "bg-forest",
    special: "Vice-Presidente do Instituto Ubatuba",
  },

  // ── CULTURA E TRADIÇÃO ──
  {
    id: "chico",
    name: "Chico",
    subtitle: "O Caiçara do Mar e da Terra",
    description:
      "Chico é um nome tradicional caiçara — homenagem aos pescadores artesanais que por gerações vivem entre o mar e a Mata Atlântica em Ubatuba. Com seu chapéu de palha e rede de pesca, Chico preserva os saberes ancestrais da cultura caiçara: a pesca com cerco flutuante, a farinha de mandioca e as cantigas do litoral norte paulista.",
    image: IMAGES.chico,
    category: ["cultura"],
    color: "bg-earth",
  },
  {
    id: "jucara",
    name: "Juçara",
    subtitle: "A Guardiã da Palmeira Sagrada",
    description:
      "Juçara é o nome da palmeira nativa da Mata Atlântica (Euterpe edulis) — espécie ameaçada de extinção que é símbolo da biodiversidade de Ubatuba. Ela representa as mulheres caiçaras que preservam as tradições: a culinária, o artesanato e as histórias passadas de mãe para filha. Juçara é resistência e beleza da cultura litorânea.",
    image: IMAGES.jucara,
    category: ["cultura"],
    color: "bg-earth",
  },
  {
    id: "cunhambebe",
    name: "Cunhambebe",
    subtitle: "O Grande Líder Tupinambá",
    description:
      "Cunhambebe foi o lendário chefe tupinambá que liderou a Confederação dos Tamoios no século XVI — unindo povos indígenas do litoral paulista contra a colonização. Em Ubatuba, onde a história indígena é viva, Cunhambebe representa a coragem, a liderança e a resistência dos povos originários que habitam esta terra há milhares de anos.",
    image: IMAGES.cunhambebe,
    category: ["cultura"],
    color: "bg-forest",
  },
  {
    id: "jaciara",
    name: "Jaciara",
    subtitle: "A Filha da Lua",
    description:
      "Jaciara significa \"nascida da lua\" em tupi-guarani — a mulher indígena que carrega a sabedoria ancestral iluminada pelo luar. Ela é a voz das mulheres guarani da aldeia Boa Vista em Ubatuba — guardiãs das sementes, dos cantos e das histórias que mantêm viva a memória dos povos originários e sua relação harmônica com a natureza.",
    image: IMAGES.jaciara,
    category: ["cultura"],
    color: "bg-forest",
  },
  {
    id: "benedito",
    name: "Benedito",
    subtitle: "O Herdeiro da Liberdade",
    description:
      "Benedito é nome de santo padroeiro dos negros no Brasil — São Benedito, cuja festa é uma das mais importantes tradições de Ubatuba. Ele representa as comunidades quilombolas como o Quilombo da Fazenda e o Quilombo do Camburi. Com tambor e sorriso largo, Benedito celebra a musicalidade e a força do povo negro no litoral norte.",
    image: IMAGES.benedito,
    category: ["cultura"],
    color: "bg-laranja",
  },
  {
    id: "dandara",
    name: "Dandara",
    subtitle: "A Rainha da Resistência",
    description:
      "Dandara foi a guerreira do Quilombo dos Palmares — símbolo máximo da resistência negra feminina no Brasil. Em Ubatuba, onde comunidades quilombolas preservam sua cultura há séculos, Dandara representa a ancestralidade, o turbante colorido e a postura altiva das mulheres negras que construíram parte fundamental da identidade cultural brasileira.",
    image: IMAGES.dandara,
    category: ["cultura"],
    color: "bg-laranja",
  },
];

// ── Componente de Card do Mascote ──
function MascotCard({ mascot }: { mascot: Mascot }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="group bg-white rounded-xl shadow-sm border border-forest/10 overflow-hidden hover:shadow-lg hover:border-ocean/30 transition-all duration-300">
      {/* Imagem */}
      <div className="relative aspect-[3/4] overflow-hidden bg-cream">
        <img
          src={mascot.image}
          alt={mascot.name}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
        {/* Badge de cor */}
        <div className={`absolute top-3 right-3 w-3 h-3 rounded-full ${mascot.color} ring-2 ring-white shadow`} />

      </div>

      {/* Conteúdo */}
      <div className="p-5">
        <h3 className="text-lg font-extrabold text-ink mb-0.5">{mascot.name}</h3>
        <p className="text-sm font-semibold text-ocean mb-3">{mascot.subtitle}</p>
        <p className={`text-sm text-ink/70 leading-relaxed ${isExpanded ? "" : "line-clamp-3"}`}>
          {mascot.description}
        </p>
        {mascot.description.length > 150 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-xs font-semibold text-ocean hover:text-ocean/80 transition-colors"
          >
            {isExpanded ? "Ver menos" : "Ler mais..."}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Página Principal ──
export default function Mascotes() {
  const [activeCategory, setActiveCategory] = useState<Category>("todos");

  const filteredMascots =
    activeCategory === "todos"
      ? mascots
      : mascots.filter((m) => m.category.includes(activeCategory));

  return (
    <div className="min-h-screen bg-cream pt-20">
      {/* Hero */}
      <section className="relative bg-forest py-20 md:py-28 overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-ocean/10 rounded-full blur-2xl" />
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-earth/10 rounded-full blur-3xl" />

        <div className="relative container text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 rounded-full text-white/70 text-xs font-semibold tracking-widest uppercase mb-6">
            <Users className="w-3.5 h-3.5" />
            27 personagens com alma ubatubense
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4">
            Nossos <span className="text-ocean">Mascotes</span>
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Cada mascote carrega um nome com significado tupi-guarani, caiçara ou histórico — conectando os programas do Instituto à rica herança cultural de Ubatuba.
          </p>
        </div>
      </section>

      {/* Filtros */}
      <section className="sticky top-20 z-30 bg-cream/95 backdrop-blur-sm border-b border-forest/10 py-4">
        <div className="container">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 active:scale-[0.97] ${
                  activeCategory === cat.id
                    ? "bg-forest text-white shadow-md"
                    : "bg-white text-ink/70 border border-forest/15 hover:border-forest/40 hover:text-ink"
                }`}
              >
                {cat.icon}
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid de Mascotes */}
      <section className="py-12 md:py-16">
        <div className="container">
          {/* Contagem */}
          <p className="text-sm text-ink/50 mb-8 text-center">
            Mostrando <span className="font-semibold text-ink/80">{filteredMascots.length}</span> mascote{filteredMascots.length !== 1 ? "s" : ""}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMascots.map((mascot) => (
              <MascotCard key={mascot.id} mascot={mascot} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-forest py-16">
        <div className="container text-center">
          <Leaf className="w-10 h-10 text-ocean mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Faça parte dessa <span className="text-ocean">história</span>
          </h2>
          <p className="text-white/70 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
            Nossos mascotes representam a diversidade e a força de Ubatuba. Apoie o Instituto e ajude a transformar vidas através do esporte, saúde, educação e cultura.
          </p>
          <Link
            href="/apoie"
            className="inline-flex items-center gap-2 px-8 py-4 bg-ocean text-white font-bold rounded-sm hover:bg-ocean/90 transition-all active:scale-[0.98] shadow-lg"
          >
            Apoie o Instituto
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
