import { Link } from "wouter";

// Image URLs from storage
const IMAGES = {
  hero: "/manus-storage/ubatuba-praia-paradise_3ba192d3.jpg",
  ilhaCouves: "/manus-storage/ubatuba-ilha-couves_50b2c97e.jpg",
  itamambuca: "/manus-storage/ubatuba-praia-itamambuca_8f058337.jpg",
  praiaAerial: "/manus-storage/ubatuba-praia-aerial_234b8965.jpg",
  cachoeiraPrumirim: "/manus-storage/ubatuba-cachoeira-prumirim_f938804b.jpg",
  cachoeiraPrumirim2: "/manus-storage/ubatuba-cachoeira-prumirim2_6d325974.jpg",
  ilhaAnchieta: "/manus-storage/ubatuba-ilha-anchieta_097f8ca1.jpg",
  trilha: "/manus-storage/ubatuba-trilha_650f3abf.webp",
  ilhaAnchieta2: "/manus-storage/ubatuba-ilha-anchieta2_8e667f0e.jpg",
  quilomboFazenda: "/manus-storage/ubatuba-quilombo-fazenda_03b071d5.jpg",
  aldeiaBoaVista: "/manus-storage/ubatuba-aldeia-boa-vista_a5e42bb9.jpg",
  praiaFazenda: "/manus-storage/ubatuba-praia-fazenda_4328246b.jpg",
};

// Data
const PRAIAS_DESTAQUE = [
  {
    nome: "Praia de Itamambuca",
    descricao: "Famosa pelo surfe e pela vibe alternativa, Itamambuca é cercada por Mata Atlântica preservada e possui um rio que deságua no mar, criando cenários únicos.",
    regiao: "Norte",
    destaque: "Surfe e natureza",
  },
  {
    nome: "Praia do Félix",
    descricao: "Cercada por costões rochosos e vegetação exuberante, a Praia do Félix é considerada uma das mais bonitas do litoral paulista.",
    regiao: "Norte",
    destaque: "Cenário paradisíaco",
  },
  {
    nome: "Praia da Lagoinha",
    descricao: "Com águas calmas e cristalinas, a Lagoinha é perfeita para famílias. Seu formato de enseada protege das ondas e cria uma piscina natural.",
    regiao: "Sul",
    destaque: "Águas calmas",
  },
  {
    nome: "Praia do Prumirim",
    descricao: "Belíssima praia com acesso à famosa cachoeira de mesmo nome. Possui ilha frontal acessível por barco com águas transparentes.",
    regiao: "Norte",
    destaque: "Praia + Cachoeira",
  },
  {
    nome: "Praia da Fazenda",
    descricao: "Dentro do Parque Estadual Serra do Mar (Núcleo Picinguaba), é uma das praias mais preservadas do Brasil, com rio, mangue e mata intocada.",
    regiao: "Norte",
    destaque: "Preservação total",
  },
  {
    nome: "Praia de Domingas Dias",
    descricao: "Pequena e paradisíaca, cercada de mata por todos os lados. Suas águas verdes e calmas são ideais para mergulho e snorkel.",
    regiao: "Sul",
    destaque: "Mergulho",
  },
  {
    nome: "Praia do Camburi",
    descricao: "Na divisa com Paraty, é uma praia selvagem com areia clara e mar azul-esverdeado. Abriga comunidades tradicionais caiçaras e quilombolas.",
    regiao: "Norte",
    destaque: "Cultura e natureza",
  },
  {
    nome: "Praia do Lázaro",
    descricao: "Águas cristalinas e calmas, perfeita para famílias e mergulho. Conecta-se à Praia de Domingas Dias por uma trilha curta.",
    regiao: "Sul",
    destaque: "Família",
  },
];

const ILHAS = [
  {
    nome: "Ilha Anchieta",
    descricao: "A maior ilha de Ubatuba, transformada em Parque Estadual em 1977. Antiga sede de um presídio político (1934-1952), hoje abriga trilhas, praias desertas, ruínas históricas e rica vida marinha. Acesso por escuna do Saco da Ribeira (~30 minutos).",
    destaques: ["Parque Estadual", "Ruínas históricas", "Mergulho", "4 praias"],
  },
  {
    nome: "Ilha das Couves",
    descricao: "Paraíso de águas cristalinas com rica vida marinha. O acesso é controlado por agendamento para preservação ambiental. Possui duas praias e é ideal para snorkel. Acesso por barco de Picinguaba (~10 minutos).",
    destaques: ["Águas cristalinas", "Snorkel", "Acesso controlado", "Preservada"],
  },
  {
    nome: "Ilha do Prumirim",
    descricao: "Pequena ilha paradisíaca com águas transparentes, ideal para mergulho e contemplação. Acessível por barco a partir da Praia do Prumirim.",
    destaques: ["Mergulho", "Águas transparentes", "Paisagem única"],
  },
  {
    nome: "Ilha dos Porcos",
    descricao: "Ilha rochosa com formações impressionantes e vida marinha abundante. Parada obrigatória nos passeios de lancha pela costa norte.",
    destaques: ["Formações rochosas", "Vida marinha", "Passeio de lancha"],
  },
];

const CACHOEIRAS = [
  {
    nome: "Cachoeira do Prumirim",
    descricao: "A mais famosa de Ubatuba, com queda de aproximadamente 30 metros e poço para banho. Trilha fácil de 15 minutos a partir da rodovia.",
    dificuldade: "Fácil",
    distancia: "19 km do centro",
  },
  {
    nome: "Cachoeira da Escada",
    descricao: "Formada por várias quedas em degraus naturais de pedra, criando piscinas naturais entre as cascatas. Cenário único na Mata Atlântica.",
    dificuldade: "Fácil",
    distancia: "Região norte",
  },
  {
    nome: "Cachoeira da Renata",
    descricao: "Em meio à Mata Atlântica densa, oferece um ambiente selvagem e preservado. A trilha moderada recompensa com um cenário espetacular.",
    dificuldade: "Moderada",
    distancia: "Região norte",
  },
  {
    nome: "Cachoeira da Água Branca",
    descricao: "Dentro de unidade de conservação, com trilha de 4,3 km até poços e cachoeira principal. Ambiente preservado com fauna e flora abundantes.",
    dificuldade: "Moderada",
    distancia: "4,3 km de trilha",
  },
  {
    nome: "Cachoeira do Ipiranguinha",
    descricao: "De fácil acesso, ideal para famílias com crianças. Possui poço raso e área para piquenique em meio à vegetação.",
    dificuldade: "Fácil",
    distancia: "Próxima ao centro",
  },
  {
    nome: "Cachoeira Pé da Serra",
    descricao: "Grande volume de água em meio à serra, com poço profundo para banho. Trilha curta mas com trechos íngremes.",
    dificuldade: "Moderada",
    distancia: "Serra do Mar",
  },
];

const TRILHAS = [
  {
    nome: "Trilha das Sete Praias",
    descricao: "Da Praia da Lagoinha à Praia da Fortaleza (ou vice-versa), passando por 7 praias selvagens e comunidades caiçaras. Possibilidade de almoço com moradores locais.",
    distancia: "8-10 km",
    duracao: "5-6 horas",
    dificuldade: "Média",
  },
  {
    nome: "Pico do Corcovado",
    descricao: "O ponto mais alto de Ubatuba (1.090m), com vista panorâmica de 360° do litoral e da Serra do Mar. Acesso pelo Núcleo Picinguaba. Ideal para ver nascer ou pôr do sol.",
    distancia: "11-17 km (ida e volta)",
    duracao: "~10 horas",
    dificuldade: "Difícil",
  },
  {
    nome: "Trilha do Saco das Bananas",
    descricao: "Começa na Praia da Caçandoca, passa pela Tabatinga e região do Saco das Bananas. Percurso completo com pernoite em praias desertas.",
    distancia: "16 km",
    duracao: "8-10 horas",
    dificuldade: "Média-Difícil",
  },
  {
    nome: "Trilha Brava da Almada",
    descricao: "Na região norte, entre as praias da Almada, Engenho e Fazenda. Curta e acessível, com vistas deslumbrantes do litoral.",
    distancia: "2-3 km",
    duracao: "20-40 minutos",
    dificuldade: "Fácil",
  },
  {
    nome: "Trilha Sete Fontes",
    descricao: "Do Saco da Ribeira/Flamengo até a Praia das Sete Fontes. Contato com comunidades caiçaras e visual paradisíaco.",
    distancia: "7 km (ida e volta)",
    duracao: "3-4 horas",
    dificuldade: "Fácil-Moderada",
  },
  {
    nome: "Trilha da Praia do Sul (Ilha Anchieta)",
    descricao: "Dentro do Parque Estadual da Ilha Anchieta, com mirante panorâmico e acesso a praias isoladas de águas cristalinas.",
    distancia: "2,3 km",
    duracao: "~1 hora",
    dificuldade: "Fácil",
  },
];

const PONTOS_CULTURAIS = [
  {
    nome: "Aldeia Boa Vista",
    tipo: "Comunidade Indígena",
    descricao: "Aldeia Guarani localizada próxima à Cachoeira do Prumirim. Oferece turismo comunitário com demonstrações de danças tradicionais, artesanato indígena e vivências culturais. Uma oportunidade única de conhecer a cultura Tupi-Guarani preservada há séculos.",
    atividades: ["Artesanato indígena", "Danças tradicionais", "Vivências culturais", "Trilhas guiadas"],
  },
  {
    nome: "Quilombo da Fazenda",
    tipo: "Comunidade Quilombola",
    descricao: "Centro de Turismo de Base Comunitária que preserva a cultura afro-brasileira. Oferece trilhas monitoradas, hospedagem, culinária tradicional, oficinas de capoeira e dança afro. Realiza anualmente o Festival da Cultura Quilombola.",
    atividades: ["Turismo comunitário", "Capoeira", "Culinária afro", "Festival anual"],
  },
  {
    nome: "Quilombo da Caçandoca",
    tipo: "Comunidade Quilombola",
    descricao: "Primeiro quilombo do Brasil a receber reconhecimento federal em terras da Marinha. Mais de 80 famílias vivem na comunidade, que preserva tradições ancestrais e possui uma praia paradisíaca de mesmo nome.",
    atividades: ["Praia preservada", "História quilombola", "Cultura ancestral", "Natureza"],
  },
  {
    nome: "Quilombo do Camburi",
    tipo: "Comunidade Quilombola",
    descricao: "Na divisa com Paraty, é um símbolo de resiliência e preservação da cultura afro-brasileira. A comunidade mantém tradições centenárias e oferece experiências de turismo ancestral.",
    atividades: ["Turismo ancestral", "Cultura afro-brasileira", "Artesanato", "Gastronomia"],
  },
  {
    nome: "Núcleo Picinguaba",
    tipo: "Parque Estadual Serra do Mar",
    descricao: "Único trecho onde a Serra do Mar encontra o mar. Abriga a Praia da Fazenda, trilhas fluviais, ciclismo, stand-up paddle no Rio da Fazenda e uma biodiversidade extraordinária.",
    atividades: ["Trilhas", "Ciclismo", "SUP", "Observação de fauna"],
  },
  {
    nome: "Ruínas do Presídio (Ilha Anchieta)",
    tipo: "Patrimônio Histórico",
    descricao: "Restos do antigo presídio político que funcionou na Ilha Anchieta entre 1934 e 1952. Palco de uma das maiores rebeliões prisionais do Brasil, hoje é um sítio arqueológico e histórico.",
    atividades: ["Visita guiada", "História", "Arqueologia", "Trilhas"],
  },
];

export default function Ubatuba() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={IMAGES.hero}
            alt="Vista aérea de Ubatuba - praias paradisíacas cercadas por Mata Atlântica"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        </div>
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg">
            Ubatuba
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mb-2 drop-shadow-md">
            Capital do Surfe &middot; Santuário Ecológico &middot; Litoral Norte de São Paulo
          </p>
          <p className="text-lg text-white/80 max-w-2xl drop-shadow-md">
            Mais de 100 praias, ilhas paradisíacas, cachoeiras, trilhas na Mata Atlântica
            e uma riqueza cultural única entre aldeias indígenas e quilombos
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <a href="#praias" className="px-6 py-3 bg-white text-green-800 font-semibold rounded-full hover:bg-green-50 transition-colors shadow-lg">
              Praias
            </a>
            <a href="#ilhas" className="px-6 py-3 bg-white/20 text-white font-semibold rounded-full border border-white/40 hover:bg-white/30 transition-colors backdrop-blur-sm">
              Ilhas
            </a>
            <a href="#cachoeiras" className="px-6 py-3 bg-white/20 text-white font-semibold rounded-full border border-white/40 hover:bg-white/30 transition-colors backdrop-blur-sm">
              Cachoeiras
            </a>
            <a href="#trilhas" className="px-6 py-3 bg-white/20 text-white font-semibold rounded-full border border-white/40 hover:bg-white/30 transition-colors backdrop-blur-sm">
              Trilhas
            </a>
            <a href="#cultura" className="px-6 py-3 bg-white/20 text-white font-semibold rounded-full border border-white/40 hover:bg-white/30 transition-colors backdrop-blur-sm">
              Cultura
            </a>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-16 md:py-24 bg-green-50">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-6">
              Um Paraíso entre a Serra e o Mar
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Ubatuba é um município do Litoral Norte de São Paulo, fundado em 1637, com mais de 386 anos de história.
              Com <strong>102 praias</strong> distribuídas em aproximadamente 100 km de costa, é um dos destinos mais
              biodiversos do Brasil. Cerca de <strong>80% de seu território</strong> é coberto por Mata Atlântica preservada,
              abrigando o Parque Estadual Serra do Mar (Núcleo Picinguaba) e o Parque Estadual da Ilha Anchieta.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl font-bold text-green-700">102+</div>
              <div className="text-sm text-gray-600 mt-1">Praias</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl font-bold text-green-700">10+</div>
              <div className="text-sm text-gray-600 mt-1">Ilhas</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl font-bold text-green-700">20+</div>
              <div className="text-sm text-gray-600 mt-1">Cachoeiras</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl font-bold text-green-700">4</div>
              <div className="text-sm text-gray-600 mt-1">Quilombos</div>
            </div>
          </div>
        </div>
      </section>

      {/* Praias Section */}
      <section id="praias" className="py-16 md:py-24 bg-white">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Litoral</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
              Praias de Ubatuba
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Com mais de 100 praias divididas em três regiões — Centro (8), Sul (54) e Norte (30) —
              Ubatuba oferece opções para todos os gostos: desde praias urbanas com infraestrutura
              até refúgios selvagens acessíveis apenas por trilha ou barco.
            </p>
          </div>

          {/* Featured beach image */}
          <div className="mb-12 rounded-2xl overflow-hidden shadow-xl">
            <img
              src={IMAGES.itamambuca}
              alt="Vista aérea da Praia de Itamambuca - Ubatuba"
              className="w-full h-64 md:h-96 object-cover"
            />
          </div>

          {/* Beach cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRAIAS_DESTAQUE.map((praia) => (
              <div key={praia.nome} className="bg-gray-50 rounded-xl p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                    {praia.regiao}
                  </span>
                  <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full">
                    {praia.destaque}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{praia.nome}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{praia.descricao}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-gray-500 text-sm">
              E mais: Toninhas, Enseada, Sununga, Fortaleza, Puruba, Ubatumirim, Almada, Flamengo, Perequê-Açu...
            </p>
          </div>
        </div>
      </section>

      {/* Ilhas Section */}
      <section id="ilhas" className="py-16 md:py-24 bg-gradient-to-b from-blue-50 to-white">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-cyan-600 uppercase tracking-wider">Arquipélago</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
              Ilhas Paradisíacas
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              As ilhas de Ubatuba são verdadeiros santuários marinhos, com águas cristalinas,
              vida marinha abundante e paisagens que parecem saídas de um cartão-postal.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src={IMAGES.ilhaAnchieta}
                alt="Ilha Anchieta - Ubatuba"
                className="w-full h-64 object-cover"
              />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src={IMAGES.ilhaCouves}
                alt="Ilha das Couves - Ubatuba"
                className="w-full h-64 object-cover"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {ILHAS.map((ilha) => (
              <div key={ilha.nome} className="bg-white rounded-xl p-6 shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{ilha.nome}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{ilha.descricao}</p>
                <div className="flex flex-wrap gap-2">
                  {ilha.destaques.map((d) => (
                    <span key={d} className="text-xs px-2 py-1 bg-cyan-50 text-cyan-700 rounded-full">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cachoeiras Section */}
      <section id="cachoeiras" className="py-16 md:py-24 bg-white">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">Águas Doces</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
              Cachoeiras
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Escondidas na Mata Atlântica, as cachoeiras de Ubatuba oferecem refúgios naturais
              com poços para banho, quedas impressionantes e trilhas em meio à floresta tropical.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src={IMAGES.cachoeiraPrumirim}
                alt="Cachoeira do Prumirim - Ubatuba"
                className="w-full h-72 object-cover"
              />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src={IMAGES.cachoeiraPrumirim2}
                alt="Cachoeira do Prumirim - vista das quedas"
                className="w-full h-72 object-cover"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CACHOEIRAS.map((cachoeira) => (
              <div key={cachoeira.nome} className="bg-emerald-50 rounded-xl p-5 hover:shadow-md transition-shadow">
                <h3 className="font-bold text-gray-900 mb-2">{cachoeira.nome}</h3>
                <p className="text-sm text-gray-600 mb-3 leading-relaxed">{cachoeira.descricao}</p>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {cachoeira.dificuldade}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {cachoeira.distancia}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trilhas Section */}
      <section id="trilhas" className="py-16 md:py-24 bg-gradient-to-b from-green-50 to-white">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-green-600 uppercase tracking-wider">Ecoturismo</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
              Trilhas
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              De caminhadas curtas a expedições de dia inteiro, as trilhas de Ubatuba levam a
              praias selvagens, mirantes com vistas panorâmicas e cenários deslumbrantes da Mata Atlântica.
            </p>
          </div>

          <div className="mb-12 rounded-2xl overflow-hidden shadow-xl">
            <img
              src={IMAGES.trilha}
              alt="Trilha na Mata Atlântica - Ubatuba"
              className="w-full h-64 md:h-80 object-cover"
            />
          </div>

          <div className="space-y-4">
            {TRILHAS.map((trilha) => (
              <div key={trilha.nome} className="bg-white rounded-xl p-6 shadow-sm border border-green-100 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{trilha.nome}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{trilha.descricao}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 md:flex-col md:items-end md:min-w-[140px]">
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                      {trilha.distancia}
                    </span>
                    <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full">
                      {trilha.duracao}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      trilha.dificuldade === "Fácil" ? "bg-green-100 text-green-700" :
                      trilha.dificuldade === "Difícil" ? "bg-red-100 text-red-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {trilha.dificuldade}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-200">
            <p className="text-sm text-amber-800">
              <strong>Dica importante:</strong> Para trilhas de nível médio ou difícil, é recomendado contratar um monitor ambiental
              credenciado. Dentro de unidades de conservação, o acompanhamento de guia é obrigatório. Leve água, lanche,
              protetor solar, repelente e calçados adequados.
            </p>
          </div>
        </div>
      </section>

      {/* Pontos Culturais Section */}
      <section id="cultura" className="py-16 md:py-24 bg-white">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-purple-600 uppercase tracking-wider">Patrimônio</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
              Pontos Turísticos Culturais
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Ubatuba abriga mais de 1.300 quilombolas distribuídos em 4 comunidades reconhecidas,
              além de aldeias indígenas Guarani que preservam tradições ancestrais. O turismo de base
              comunitária é uma forma de valorizar e manter viva essa riqueza cultural.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src={IMAGES.quilomboFazenda}
                alt="Quilombo da Fazenda - Turismo de Base Comunitária"
                className="w-full h-64 object-cover"
              />
              <div className="p-4 bg-purple-50">
                <p className="text-sm font-medium text-purple-900">Quilombo da Fazenda — Turismo de Base Comunitária</p>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src={IMAGES.aldeiaBoaVista}
                alt="Aldeia Indígena Boa Vista - Comunidade Guarani"
                className="w-full h-64 object-cover"
              />
              <div className="p-4 bg-purple-50">
                <p className="text-sm font-medium text-purple-900">Aldeia Indígena Boa Vista — Comunidade Guarani</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PONTOS_CULTURAIS.map((ponto) => (
              <div key={ponto.nome} className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow">
                <span className="text-xs font-medium px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                  {ponto.tipo}
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-3 mb-2">{ponto.nome}</h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">{ponto.descricao}</p>
                <div className="flex flex-wrap gap-2">
                  {ponto.atividades.map((a) => (
                    <span key={a} className="text-xs px-2 py-1 bg-white text-gray-600 rounded-full border border-gray-200">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-green-900 text-white">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Conheça o Instituto Ubatuba
          </h2>
          <p className="text-lg text-green-100 mb-8 max-w-2xl mx-auto">
            O Instituto Ubatuba Santuário Ecológico trabalha pela conservação socioambiental
            de Ubatuba, promovendo inclusão social, educação ambiental e desenvolvimento sustentável.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/" className="px-8 py-3 bg-white text-green-900 font-semibold rounded-full hover:bg-green-50 transition-colors">
              Conheça nossos projetos
            </Link>
            <Link href="/cursos" className="px-8 py-3 bg-green-700 text-white font-semibold rounded-full border border-green-600 hover:bg-green-600 transition-colors">
              Cursos gratuitos
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
