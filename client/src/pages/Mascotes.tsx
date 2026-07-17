import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Sparkles, Users, Heart, Leaf, Dumbbell, BookOpen, Palette } from "lucide-react";
import { useSEO } from "@/components/SEOHead";


/* ═══════════════════════════════════════════════════════════════
   MASCOTES DO INSTITUTO UBATUBA
   Personagens que representam os valores, programas e a diversidade
   cultural do Instituto Ubatuba Santuário Ecológico.
═══════════════════════════════════════════════════════════════ */

// ── Imagens dos mascotes ──
const IMAGES = {
  uba: "/manus-storage/01-uba_b282493b.webp",
  kaua: "/manus-storage/02-kaua_48c79b56.webp",
  yara: "/manus-storage/03-yara_b80b040e.webp",
  surfeM: "/manus-storage/10-surfe_849e3148.webp",
  surfeF: "/manus-storage/10-surfe-f_5e76f3cb.webp",
  futebolM: "/manus-storage/11-futebol_81433c00.webp",
  futebolF: "/manus-storage/11-futebol-f_89c94587.webp",
  futevoleiM: "/manus-storage/12-futevolei_b5724271.webp",
  futevoleiF: "/manus-storage/12-futevolei-f_cd9f3978.webp",
  skateM: "/manus-storage/13-skate_722de943.webp",
  skateF: "/manus-storage/13-skate-f_74386eeb.webp",
  karateM: "/manus-storage/14-karate_e364e062.webp",
  karateF: "/manus-storage/14-karate-f_16ab976c.webp",
  jiujitsuM: "/manus-storage/15-jiujitsu_ea138c1f.webp",
  jiujitsuF: "/manus-storage/15-jiujitsu-f_e59da49a.webp",
  natacaoM: "/manus-storage/16-natacao_79bfa6ff.webp",
  natacaoF: "/manus-storage/16-natacao-f_6aaf7f5e.webp",
  saudeM: "/manus-storage/20-saude_1bd1fae9.webp",
  saudeF: "/manus-storage/20-saude-f_8c6f43ff.webp",
  educacaoF: "/manus-storage/21-educacao_9c1738d3.webp",
  educacaoM: "/manus-storage/21-educacao-m_659b763c.webp",
  caicaraM: "/manus-storage/30-caicara_41abef5f.webp",
  caicaraF: "/manus-storage/30-caicara-f_566e696c.webp",
  indigenaM: "/manus-storage/31-indigena_1f45aacf.webp",
  indigenaF: "/manus-storage/31-indigena-f_9315f6c1.webp",
  quilombolaF: "/manus-storage/32-quilombola_e2e7bf11.webp",
  quilombolaM: "/manus-storage/32-quilombola-m_d834a060.webp",
};

// ── Categorias ──
type Category = "todos" | "principais" | "esporte" | "saude-educacao" | "cultura";

const categories: { id: Category; label: string; icon: React.ReactNode }[] = [
  { id: "todos", label: "Todos", icon: <Sparkles className="w-4 h-4" /> },
  { id: "principais", label: "Principais", icon: <Heart className="w-4 h-4" /> },
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
}

const mascots: Mascot[] = [
  // ── PRINCIPAIS ──
  {
    id: "uba",
    name: "Ubá",
    subtitle: "O Guardião da Mata Atlântica",
    description:
      "Ubá é o mascote principal do Instituto Ubatuba. Seu nome vem do tupi-guarani e significa \"canoa\" — símbolo da conexão entre o mar e a terra que define Ubatuba. Alegre, acolhedor e cheio de energia, Ubá representa o espírito comunitário e a força da natureza que guia todas as ações do Instituto. Ele inspira crianças e adultos a protegerem o meio ambiente e a valorizarem a cultura local.",
    image: IMAGES.uba,
    category: ["principais"],
    color: "bg-forest",
  },
  {
    id: "kaua",
    name: "Kauã",
    subtitle: "O Explorador das Ondas",
    description:
      "Kauã é o companheiro aventureiro de Ubá. Seu nome significa \"gavião\" em tupi-guarani, e assim como a ave, ele tem olhos atentos para tudo que acontece no litoral. Curioso e destemido, Kauã representa a juventude de Ubatuba que busca novas oportunidades através do esporte e da educação. Ele é o elo entre as crianças da comunidade e os programas sociais do Instituto.",
    image: IMAGES.kaua,
    category: ["principais"],
    color: "bg-ocean",
  },
  {
    id: "yara",
    name: "Yara",
    subtitle: "A Protetora dos Mares",
    description:
      "Yara carrega o nome da lendária sereia das águas brasileiras. Ela é a guardiã dos oceanos e das praias de Ubatuba, simbolizando a preservação ambiental e o respeito pela vida marinha. Gentil e determinada, Yara ensina sobre sustentabilidade, reciclagem e a importância de manter as praias limpas. Ela lidera as ações do Projeto Itaguá Azul e da Bituqueira Ecológica.",
    image: IMAGES.yara,
    category: ["principais"],
    color: "bg-ocean",
  },

  // ── ESPORTE ──
  {
    id: "surfe-m",
    name: "Mascote Surfe",
    subtitle: "O Domador de Ondas",
    description:
      "Representa a Escolinha de Surfe do Instituto Ubatuba, onde mais de 3.000 aulas já foram ministradas para crianças e adolescentes da comunidade. Com sua prancha colorida e sorriso contagiante, ele mostra que o mar é para todos — independente de condição social. O surfe ensina disciplina, respeito pela natureza e superação de limites.",
    image: IMAGES.surfeM,
    category: ["esporte"],
    color: "bg-ocean",
  },
  {
    id: "surfe-f",
    name: "Mascote Surfe",
    subtitle: "A Rainha das Ondas",
    description:
      "Ela representa a força feminina no surfe e a inclusão de meninas nos programas esportivos do Instituto. Corajosa e habilidosa, inspira outras garotas a enfrentarem os desafios das ondas e da vida. Nas praias de Ubatuba, ela prova que não existem limites de gênero no esporte — apenas a vontade de aprender e se superar.",
    image: IMAGES.surfeF,
    category: ["esporte"],
    color: "bg-ocean",
  },
  {
    id: "futebol-m",
    name: "Mascote Futebol",
    subtitle: "O Craque da Comunidade",
    description:
      "Representa a Escolinha de Futebol, com mais de 2.500 aulas ministradas. Ágil e cooperativo, ele ensina que o verdadeiro gol é o trabalho em equipe e a amizade. Nos campos de Ubatuba, crianças aprendem não apenas técnicas de futebol, mas valores como respeito, fair play e companheirismo que levam para toda a vida.",
    image: IMAGES.futebolM,
    category: ["esporte"],
    color: "bg-forest",
  },
  {
    id: "futebol-f",
    name: "Mascote Futebol",
    subtitle: "A Artilheira Destemida",
    description:
      "Ela mostra que o futebol feminino é tão vibrante quanto qualquer outro. Com dribles criativos e espírito de liderança, representa as meninas que ocupam os campos com orgulho. No Instituto Ubatuba, o futebol é ferramenta de empoderamento e transformação social para todas e todos.",
    image: IMAGES.futebolF,
    category: ["esporte"],
    color: "bg-forest",
  },
  {
    id: "futevolei-m",
    name: "Mascote Futevôlei",
    subtitle: "O Mestre da Areia",
    description:
      "Representa a Escolinha de Futevôlei, com mais de 2.000 aulas realizadas nas areias de Ubatuba. Equilibrado e preciso, ele domina a bola com os pés na areia quente, mostrando que o esporte de praia é acessível a todos. O futevôlei desenvolve coordenação, agilidade e espírito esportivo em um cenário único — o litoral norte paulista.",
    image: IMAGES.futevoleiM,
    category: ["esporte"],
    color: "bg-earth",
  },
  {
    id: "futevolei-f",
    name: "Mascote Futevôlei",
    subtitle: "A Estrela da Praia",
    description:
      "Com movimentos graciosos e potentes, ela representa a presença feminina no futevôlei de Ubatuba. Determinada e talentosa, inspira meninas a descobrirem o prazer do esporte na areia. Cada toque na bola é um passo em direção à autoconfiança e ao bem-estar físico e emocional.",
    image: IMAGES.futevoleiF,
    category: ["esporte"],
    color: "bg-earth",
  },
  {
    id: "skate-m",
    name: "Mascote Skate",
    subtitle: "O Radical das Ruas",
    description:
      "Representa o programa de Skate do Instituto, que oferece às crianças uma forma de expressão urbana e artística. Criativo e destemido, ele transforma calçadas e pistas em palcos de superação. O skate ensina resiliência — cada queda é um aprendizado, cada manobra conquistada é uma vitória pessoal.",
    image: IMAGES.skateM,
    category: ["esporte"],
    color: "bg-laranja",
  },
  {
    id: "skate-f",
    name: "Mascote Skate",
    subtitle: "A Skatista Destemida",
    description:
      "Ela quebra estereótipos sobre rodas. Com estilo próprio e coragem de sobra, representa as meninas que encontram no skate liberdade e autoexpressão. No Instituto Ubatuba, o skate feminino é celebrado como forma de empoderamento, criatividade e pertencimento à comunidade.",
    image: IMAGES.skateF,
    category: ["esporte"],
    color: "bg-laranja",
  },
  {
    id: "karate-m",
    name: "Mascote Karatê",
    subtitle: "O Guerreiro Disciplinado",
    description:
      "Representa o programa de Karatê, onde crianças aprendem muito mais que golpes — aprendem disciplina, respeito e autocontrole. Com postura firme e olhar concentrado, ele mostra que a verdadeira força vem de dentro. As artes marciais no Instituto são ferramentas de formação de caráter e desenvolvimento pessoal.",
    image: IMAGES.karateM,
    category: ["esporte"],
    color: "bg-forest",
  },
  {
    id: "karate-f",
    name: "Mascote Karatê",
    subtitle: "A Guerreira Focada",
    description:
      "Ela demonstra que a arte marcial é para todos os gêneros. Com técnica apurada e espírito inabalável, representa as meninas que encontram no karatê confiança e empoderamento. Cada kata praticado é uma lição de perseverança e autodomínio que transcende o tatame.",
    image: IMAGES.karateF,
    category: ["esporte"],
    color: "bg-forest",
  },
  {
    id: "jiujitsu-m",
    name: "Mascote Jiu-Jitsu",
    subtitle: "O Estrategista Gentil",
    description:
      "Representa o programa de Jiu-Jitsu Brasileiro, a \"arte suave\" que ensina crianças a resolverem conflitos com inteligência, não com força bruta. Paciente e estratégico, ele mostra que o menor pode vencer o maior com técnica e sabedoria. No Instituto, o jiu-jitsu é escola de vida e respeito mútuo.",
    image: IMAGES.jiujitsuM,
    category: ["esporte"],
    color: "bg-ocean",
  },
  {
    id: "jiujitsu-f",
    name: "Mascote Jiu-Jitsu",
    subtitle: "A Lutadora Sábia",
    description:
      "Ela prova que a \"arte suave\" é também feminina. Com técnica refinada e mente afiada, representa as meninas que no tatame encontram força interior e autodefesa. O jiu-jitsu feminino no Instituto Ubatuba é sinônimo de empoderamento, segurança e igualdade.",
    image: IMAGES.jiujitsuF,
    category: ["esporte"],
    color: "bg-ocean",
  },
  {
    id: "natacao-m",
    name: "Mascote Natação",
    subtitle: "O Nadador Veloz",
    description:
      "Representa o programa de Natação, essencial em uma cidade litorânea como Ubatuba. Veloz e seguro na água, ele ensina que saber nadar é mais que esporte — é sobrevivência e liberdade. Cada braçada é um passo em direção à saúde, à segurança aquática e ao prazer de viver em harmonia com o mar.",
    image: IMAGES.natacaoM,
    category: ["esporte"],
    color: "bg-ocean",
  },
  {
    id: "natacao-f",
    name: "Mascote Natação",
    subtitle: "A Sereia Atleta",
    description:
      "Ela desliza pela água com graça e potência, representando as meninas que aprendem a nadar com segurança e confiança. Em Ubatuba, onde o mar é vizinho, saber nadar é um direito — e ela garante que nenhuma criança fique de fora dessa conquista fundamental.",
    image: IMAGES.natacaoF,
    category: ["esporte"],
    color: "bg-ocean",
  },

  // ── SAÚDE E EDUCAÇÃO ──
  {
    id: "saude-m",
    name: "Mascote Saúde",
    subtitle: "O Cuidador Atencioso",
    description:
      "Representa as Ações de Saúde do Instituto, que já realizaram mais de 5.000 exames e atendimentos gratuitos para a comunidade. Com jaleco e estetoscópio, ele simboliza o acesso à saúde como direito fundamental. Campanhas de prevenção, exames oftalmológicos, ultrassons e consultas — tudo para que ninguém fique sem cuidado.",
    image: IMAGES.saudeM,
    category: ["saude-educacao"],
    color: "bg-ocean",
  },
  {
    id: "saude-f",
    name: "Mascote Saúde",
    subtitle: "A Doutora Solidária",
    description:
      "Ela representa o cuidado e a compaixão das profissionais de saúde que atendem voluntariamente nas ações do Instituto. Com sorriso acolhedor e mãos habilidosas, garante que cada pessoa da comunidade receba atenção médica de qualidade — do Outubro Rosa às consultas pediátricas.",
    image: IMAGES.saudeF,
    category: ["saude-educacao"],
    color: "bg-ocean",
  },
  {
    id: "educacao-f",
    name: "Mascote Educação",
    subtitle: "A Professora Inspiradora",
    description:
      "Representa os programas educacionais do Instituto, incluindo a parceria com a Escola Marina Nepomuceno do Amaral e a Feira Literária. Com livros e criatividade, ela mostra que a educação é a base de toda transformação social. Cada aula, cada livro lido, cada história contada é uma semente plantada para o futuro.",
    image: IMAGES.educacaoF,
    category: ["saude-educacao"],
    color: "bg-forest",
  },
  {
    id: "educacao-m",
    name: "Mascote Educação",
    subtitle: "O Mestre do Saber",
    description:
      "Ele carrega o conhecimento como ferramenta de libertação. Representa os educadores e voluntários que dedicam seu tempo para formar cidadãos conscientes e preparados. No Instituto Ubatuba, educação vai além da sala de aula — acontece na praia, no campo, na comunidade e em cada interação com a natureza.",
    image: IMAGES.educacaoM,
    category: ["saude-educacao"],
    color: "bg-forest",
  },

  // ── CULTURA E TRADIÇÃO ──
  {
    id: "caicara-m",
    name: "Mascote Caiçara",
    subtitle: "O Filho do Mar e da Terra",
    description:
      "Representa a cultura caiçara — o povo tradicional do litoral paulista que vive da pesca, da roça e do artesanato. Com seu chapéu de palha e rede de pesca, ele preserva os saberes ancestrais que fazem de Ubatuba um lugar único. O Instituto valoriza e protege essa herança cultural como patrimônio vivo da comunidade.",
    image: IMAGES.caicaraM,
    category: ["cultura"],
    color: "bg-earth",
  },
  {
    id: "caicara-f",
    name: "Mascote Caiçara",
    subtitle: "A Guardiã das Tradições",
    description:
      "Ela carrega a força das mulheres caiçaras — pescadoras, artesãs, cozinheiras e contadoras de histórias. Com suas mãos habilidosas e sabedoria herdada de gerações, representa a resistência e a beleza da cultura litorânea. No Instituto, ela inspira o resgate e a valorização das tradições locais.",
    image: IMAGES.caicaraF,
    category: ["cultura"],
    color: "bg-earth",
  },
  {
    id: "indigena-m",
    name: "Mascote Indígena",
    subtitle: "O Guardião da Floresta",
    description:
      "Representa os povos indígenas que habitam Ubatuba há milhares de anos — especialmente os Guarani Mbya da aldeia Boa Vista. Com seus adornos tradicionais e conexão profunda com a terra, ele nos lembra que somos parte da natureza, não seus donos. O Instituto respeita e celebra a sabedoria ancestral indígena.",
    image: IMAGES.indigenaM,
    category: ["cultura"],
    color: "bg-forest",
  },
  {
    id: "indigena-f",
    name: "Mascote Indígena",
    subtitle: "A Sabedoria Ancestral",
    description:
      "Ela é a voz das mulheres indígenas — guardiãs das sementes, dos cantos e das histórias que mantêm viva a memória dos povos originários. Com sua presença serena e poderosa, representa a espiritualidade e o conhecimento milenar que orientam a relação harmônica entre ser humano e natureza.",
    image: IMAGES.indigenaF,
    category: ["cultura"],
    color: "bg-forest",
  },
  {
    id: "quilombola-f",
    name: "Mascote Quilombola",
    subtitle: "A Rainha da Resistência",
    description:
      "Representa as comunidades quilombolas de Ubatuba — descendentes de africanos escravizados que conquistaram sua liberdade e preservam sua cultura até hoje. Com turbante colorido e postura altiva, ela celebra a ancestralidade negra, a resistência histórica e a riqueza cultural afro-brasileira presente no litoral norte.",
    image: IMAGES.quilombolaF,
    category: ["cultura"],
    color: "bg-laranja",
  },
  {
    id: "quilombola-m",
    name: "Mascote Quilombola",
    subtitle: "O Herdeiro da Liberdade",
    description:
      "Ele carrega a memória e o orgulho dos quilombos de Ubatuba — comunidades como o Quilombo da Fazenda e o Quilombo do Camburi. Com tambor e sorriso largo, representa a alegria, a musicalidade e a força do povo negro que construiu parte fundamental da identidade cultural brasileira.",
    image: IMAGES.quilombolaM,
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
      <div className="relative aspect-square overflow-hidden bg-cream">
        <img
          src={mascot.image}
          alt={mascot.name}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
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
  useSEO({
    title: "Mascotes | Instituto Ubatuba Santuário Ecológico",
    description: "Conheça os mascotes do Instituto Ubatuba: personagens que representam a fauna local e educam sobre conservação ambiental de forma lúdica.",
    keywords: "mascotes instituto ubatuba, personagens fauna, educação ambiental, conservação lúdica, animais ubatuba",
    canonical: "/mascotes",
    ogTitle: "Mascotes | Instituto Ubatuba",
    ogDescription: "Personagens que representam a fauna local e educam sobre conservação ambiental.",
  });

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
            Conheça nossa turma
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4">
            Nossos <span className="text-ocean">Mascotes</span>
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Personagens que representam os valores, programas e a diversidade cultural do Instituto Ubatuba Santuário Ecológico.
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
