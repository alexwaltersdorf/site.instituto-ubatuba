import { Link } from "wouter";
import { ArrowRight, Leaf, Users, Heart, BookOpen, Fish, TreePine, Waves, ChevronDown, ChevronLeft, ChevronRight, Droplets, GraduationCap, Stethoscope, Trophy, Music } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import WaveDivider from "@/components/WaveDivider";
import FloatingSidebar from "@/components/FloatingSidebar";

const HERO_IMAGE = "/manus-storage/ubatuba-hero_110ea313.jpg";
const PRAIA_IMAGE = "/manus-storage/ubatuba-praia_8ed0b366.jpg";
const NATUREZA_IMAGE = "/manus-storage/ubatuba-natureza_083c332c.png";

/* ── Dados ── */

const heroSlides = [
  {
    title: "Um santuário que cuida de gente e de natureza.",
    subtitle: "Saúde, esporte e meio ambiente para as comunidades de Ubatuba. Some com a gente e faça parte da rede.",
    cta: "Conhecer as ações",
    ctaHref: "/#acoes",
    image: HERO_IMAGE,
  },
  {
    title: "Cada criança que entra na quadra encontra um caminho.",
    subtitle: "360 crianças nas escolinhas de surfe, futebol e futevôlei — oportunidades reais para jovens de Ubatuba.",
    cta: "Veja nosso impacto",
    ctaHref: "/#acoes",
    image: PRAIA_IMAGE,
  },
  {
    title: "Ubatuba cresce com cuidado.",
    subtitle: "Parcerias entre poder público, institutos e comunidade. Sua contribuição preserva ecossistemas e transforma vidas.",
    cta: "Quero ser voluntário",
    ctaHref: "/apoie",
    image: NATUREZA_IMAGE,
  },
];

const impactNumbers = [
  { value: "360+", label: "Crianças atendidas nas escolinhas", icon: Users },
  { value: "781", label: "Exames e consultas realizados", icon: Stethoscope },
  { value: "8", label: "Projetos socioambientais ativos", icon: TreePine },
  { value: "3", label: "Bolsas de estudo concedidas", icon: GraduationCap },
];

const esporteImages = [
  { src: "/manus-storage/esporte_futebol_01_eab01f3c.jpg", alt: "Escolinha de Futebol — crianças treinando em campo" },
  { src: "/manus-storage/esporte_futevolei_01_075b0952.jpg", alt: "Escolinha de Futevôlei — jovens praticando na praia" },
  { src: "/manus-storage/esporte_skate_01_bdaf9970.jpg", alt: "Escolinha de Skate — inclusão pelo esporte radical" },
  { src: "/manus-storage/esporte_surfe_01_4756749a.jpg", alt: "Escolinha de Surfe — aulas no mar de Ubatuba" },
  { src: "/manus-storage/esporte_surfe_02_dcda585e.jpg", alt: "Surfe — jovens conectados com o oceano" },
  { src: "/manus-storage/esporte_futebol_02_aa55a128.jpg", alt: "Futebol — formação de cidadania pelo esporte" },
  { src: "/manus-storage/esporte_radical_01_744eeafa.webp", alt: "Esportes radicais — aventura e superação" },
  { src: "/manus-storage/esporte_guardioes_01_8ddcf9ac.webp", alt: "Guardiões do Litoral — jovens protetores da natureza" },
];

const causasData = [
  {
    id: "saude",
    label: "Saúde",
    icon: Stethoscope,
    title: "Saúde",
    description: "Mutirões e exames gratuitos com clínicas parceiras. Já realizamos 781 exames e consultas para a comunidade em parceria com a Total Quality Medicina Diagnóstica. Prevenção e políticas públicas que cuidam de quem mais precisa.",
    image: HERO_IMAGE,
    link: "#acoes",
  },
  {
    id: "esporte",
    label: "Esporte Social",
    icon: Waves,
    title: "Esporte Social",
    description: "Surfe, futebol, jiu-jitsu, futevôlei, skate e natação para crianças em vulnerabilidade. 360 crianças nas escolinhas encontram disciplina, saúde e conexão com o oceano. O esporte abre portas e constrói cidadania.",
    image: PRAIA_IMAGE,
    link: "#acoes",
    gallery: esporteImages,
  },
  {
    id: "meioambiente",
    label: "Meio Ambiente",
    icon: Fish,
    title: "Meio Ambiente",
    description: "Limpeza de praias, reflorestamento da Mata Atlântica e a Bituqueira Ecológica. Com o Projeto Itaguá Azul, protegemos os ecossistemas marinhos e terrestres de Ubatuba para as próximas gerações.",
    image: NATUREZA_IMAGE,
    link: "#acoes",
  },
];

const parceiros = [
  { name: "Projeto Itaguá Azul", initials: "IA" },
  { name: "Total Quality Medicina", initials: "TQ" },
  { name: "Escola Marina Nepomuceno", initials: "MN" },
  { name: "Assoc. Moradores Perequê-Açu", initials: "AM" },
  { name: "Prefeitura de Ubatuba", initials: "PU" },
  { name: "Clínica Total Quality", initials: "CQ" },
];

const postsDestaque = [
  {
    id: 1,
    slug: "instituto-ubatuba-realiza-capacitacao-com-parceiros-em-dezembro-2025",
    title: "Instituto Ubatuba realiza grande capacitação com parceiros em dezembro de 2025",
    excerpt: "O Instituto Ubatuba reuniu sua equipe e parceiros estratégicos em um evento de capacitação realizado em dezembro de 2025, reforçando o compromisso com a transparência e a governança.",
    coverImage: "/manus-storage/ig_foto3_24660931.jpg",
    category: "Institucional",
    publishedAt: new Date("2025-12-10"),
  },
  {
    id: 2,
    slug: "capacitacao-em-saude-fortalece-parceria-com-o-sus",
    title: "Capacitação em saúde fortalece parceria do instituto com o SUS",
    excerpt: "O Instituto Ubatuba participou de capacitação sobre certificação de entidades de saúde. A parceria com a Total Quality já realizou 781 exames gratuitos para a comunidade.",
    coverImage: "/manus-storage/ig_foto1_2593cca7.jpg",
    category: "Saúde",
    publishedAt: new Date("2025-09-20"),
  },
  {
    id: 3,
    slug: "escolinhas-esportivas-atingem-360-criancas-atendidas",
    title: "Escolinhas esportivas atingem 360 crianças atendidas em Ubatuba",
    excerpt: "As escolinhas de surfe (160), futebol (120) e futevôlei (80) alcançaram a marca de 360 crianças atendidas, consolidando o programa como referência em inclusão social.",
    coverImage: "/manus-storage/ubatuba-praia_8ed0b366.jpg",
    category: "Ações",
    publishedAt: new Date("2025-07-10"),
  },
];

/* ── Componente: Galeria Esporte com Carrossel ── */

function EsporteGalleryTab({ causa }: { causa: typeof causasData[0] }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const gallery = causa.gallery!;

  const next = useCallback(() => {
    setActiveIdx((prev) => (prev + 1) % gallery.length);
  }, [gallery.length]);

  const prev = useCallback(() => {
    setActiveIdx((prev) => (prev - 1 + gallery.length) % gallery.length);
  }, [gallery.length]);

  // Auto-advance every 4s
  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      {/* Carrossel de fotos */}
      <div className="space-y-4">
        <div className="relative rounded-xl overflow-hidden shadow-xl group">
          <div className="relative h-[320px] md:h-[380px]">
            {gallery.map((img, i) => (
              <img
                key={i}
                src={img.src}
                alt={img.alt}
                className={cn(
                  "absolute inset-0 w-full h-full object-cover transition-opacity duration-700",
                  i === activeIdx ? "opacity-100" : "opacity-0"
                )}
              />
            ))}
          </div>
          {/* Controles */}
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
            aria-label="Foto anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
            aria-label="Próxima foto"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          {/* Legenda */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3">
            <p className="text-white text-sm font-medium">{gallery[activeIdx].alt}</p>
          </div>
        </div>
        {/* Thumbnails */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {gallery.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={cn(
                "flex-shrink-0 w-16 h-12 rounded-md overflow-hidden border-2 transition-all",
                i === activeIdx
                  ? "border-forest ring-2 ring-forest/30 scale-105"
                  : "border-transparent opacity-60 hover:opacity-100"
              )}
            >
              <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>
      {/* Texto descritivo */}
      <div>
        <h3 className="text-3xl font-extrabold text-foreground mb-4">{causa.title}</h3>
        <p className="text-muted-foreground leading-relaxed text-lg mb-6">{causa.description}</p>
        <Link href={causa.link} className="btn-primary">
          Saiba Mais <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

/* ── Ações e Projetos (integrado) ── */

const programas = [
  {
    id: "surfe",
    icon: Waves,
    categoria: "Esporte e Inclusão",
    titulo: "Escolinha de Surfe",
    descricao: "A Escolinha de Surfe do Instituto Ubatuba oferece aulas gratuitas para crianças e jovens da comunidade, promovendo o contato com o oceano, a prática esportiva e o desenvolvimento de valores como disciplina, respeito à natureza e trabalho em equipe.",
    impacto: "160 crianças atendidas",
    detalhes: [
      "Aulas semanais na praia de Ubatuba",
      "Equipamentos fornecidos pelo instituto",
      "Monitores certificados e experientes",
      "Integração com educação ambiental marinha",
    ],
    color: "text-ocean",
    bg: "bg-ocean/10",
    border: "border-ocean/20",
    image: "/manus-storage/esporte_surfe_01_4756749a.jpg",
  },
  {
    id: "futebol",
    icon: Trophy,
    categoria: "Esporte e Inclusão",
    titulo: "Escolinha de Futebol",
    descricao: "A Escolinha de Futebol reúne crianças de diferentes bairros de Ubatuba em torno do esporte mais popular do Brasil, desenvolvendo habilidades técnicas, sociais e emocionais em um ambiente seguro e acolhedor.",
    impacto: "120 crianças atendidas",
    detalhes: [
      "Treinos regulares com metodologia pedagógica",
      "Participação em torneios regionais",
      "Parceria com a Associação de Moradores do Pereque-açu",
      "Foco em valores e cidadania",
    ],
    color: "text-earth",
    bg: "bg-earth/10",
    border: "border-earth/20",
    image: "/manus-storage/esporte_futebol_01_eab01f3c.jpg",
  },
  {
    id: "futevolei",
    icon: Users,
    categoria: "Esporte e Inclusão",
    titulo: "Escolinha de Futevôlei",
    descricao: "O futevôlei combina a destreza do futebol com a dinâmica do vôlei de praia, sendo praticado diretamente na areia de Ubatuba. A escolinha oferece uma experiência única que une esporte, praia e comunidade.",
    impacto: "80 crianças atendidas",
    detalhes: [
      "Prática na praia com redes profissionais",
      "Desenvolvimento de coordenação motora",
      "Integração entre diferentes faixas etárias",
      "Conexão com o ambiente natural de Ubatuba",
    ],
    color: "text-forest",
    bg: "bg-forest/10",
    border: "border-forest/20",
    image: "/manus-storage/esporte_futevolei_01_075b0952.jpg",
  },
  {
    id: "ituaga-azul",
    icon: Fish,
    categoria: "Conservação Ambiental",
    titulo: "Projeto Itaguá Azul",
    descricao: "Em parceria com o Projeto Itaguá Azul, o instituto atua na conservação dos ecossistemas marinhos de Ubatuba, realizando limpezas de praia, monitoramento da fauna marinha e ações de educação ambiental com a comunidade.",
    impacto: "Praias e ecossistemas preservados",
    detalhes: [
      "Limpezas periódicas das praias de Ubatuba",
      "Monitoramento de espécies marinhas",
      "Educação ambiental nas escolas locais",
      "Coleta e destinação correta de resíduos",
    ],
    color: "text-ocean",
    bg: "bg-ocean/10",
    border: "border-ocean/20",
    images: [
      { src: "/manus-storage/itaguaazul_voluntarios_praia_f3eed109.jpg", alt: "Voluntários do Itaguá Azul na praia" },
      { src: "/manus-storage/itaguaazul_grupo_limpeza_734d6de7.jpg", alt: "Grupo de voluntários em ação de limpeza" },
      { src: "/manus-storage/itaguaazul_limpeza_praia_8b82609f.jpg", alt: "Limpeza da praia de Ubatuba" },
      { src: "/manus-storage/itaguaazul_canoa_bc570881.jpg", alt: "Voluntárias com canoa na praia" },
    ],
  },
  {
    id: "bituqueira",
    icon: Leaf,
    categoria: "Conservação Ambiental",
    titulo: "Bituqueira Ecológica",
    descricao: "A Bituqueira Ecológica é uma iniciativa inovadora para a coleta e destinação adequada de bitucas de cigarro nas praias de Ubatuba, um dos principais poluentes dos ecossistemas costeiros.",
    impacto: "Redução da poluição nas praias",
    detalhes: [
      "Instalação de coletores especializados",
      "Destinação correta e reciclagem de bitucas",
      "Campanhas de conscientização",
      "Parceria com empresas e comércio local",
    ],
    color: "text-forest",
    bg: "bg-forest/10",
    border: "border-forest/20",
    images: [
      { src: "/manus-storage/bituqueira_flyer_6acac4ec.jpg", alt: "Flyer do projeto BitucAqui com coletor" },
      { src: "/manus-storage/bituqueira_ponto_coleta_961501c5.jpg", alt: "Ponto de coleta de bitucas instalado" },
      { src: "/manus-storage/bituqueira_bitucas_arte_71330acd.jpg", alt: "Bitucas coletadas em instalação artística" },
      { src: "/manus-storage/bituqueira_coletor_arvore_6c62721b.jpg", alt: "Coletor de bitucas fixado em árvore na praia" },
    ],
  },
  {
    id: "saude",
    icon: Stethoscope,
    categoria: "Saúde Comunitária",
    titulo: "Ações de Saúde",
    descricao: "Em parceria com a Total Quality Medicina Diagnóstica, o instituto oferece exames e consultas gratuitas para a comunidade de Ubatuba, com foco nas populações mais vulneráveis.",
    impacto: "781 exames e consultas realizados · 3 bolsas de estudo",
    detalhes: [
      "Exames laboratoriais e de imagem gratuitos",
      "Consultas médicas especializadas",
      "3 bolsas de estudo para jovens de destaque",
      "Acompanhamento de saúde dos atletas",
    ],
    color: "text-earth",
    bg: "bg-earth/10",
    border: "border-earth/20",
    images: [
      { src: "/manus-storage/saude_equipe_outubro_rosa_30c65acf.webp", alt: "Equipe de saúde no Outubro Rosa" },
      { src: "/manus-storage/saude_palestra_comunitaria_087af887.webp", alt: "Palestra de saúde comunitária" },
      { src: "/manus-storage/saude_grupo_mulheres_ff963075.webp", alt: "Grupo de mulheres em ação de saúde" },
      { src: "/manus-storage/saude_evento_rosa_e8d42020.JPEG", alt: "Evento Outubro Rosa com comunidade" },
      { src: "/manus-storage/saude_ultrassom_85631ea7.webp", alt: "Exame de ultrassom gratuito" },
      { src: "/manus-storage/saude_consulta_medica_8b0bf6d6.webp", alt: "Consulta médica comunitária" },
    ],
  },
  {
    id: "educacao",
    icon: BookOpen,
    categoria: "Educação e Cultura",
    titulo: "Feira Literária",
    descricao: "O Instituto Ubatuba apoia a Feira Literária realizada em parceria com a Escola Marina Nepomuceno do Amaral, promovendo o acesso à literatura e o fortalecimento da identidade cultural.",
    impacto: "Centenas de estudantes alcançados",
    detalhes: [
      "Parceria com Escola Marina Nepomuceno do Amaral",
      "Doação de livros e materiais didáticos",
      "Oficinas literárias e contação de histórias",
      "Incentivo à leitura e à escrita criativa",
    ],
    color: "text-forest-light",
    bg: "bg-forest-light/10",
    border: "border-forest-light/20",
    images: [
      { src: "/manus-storage/feira_literaria_criancas_db3322cc.jpg", alt: "Crianças participando da Feira Literária" },
      { src: "/manus-storage/feira_literaria_palco_4a670986.JPEG", alt: "Apresentação no palco da Feira Literária" },
      { src: "/manus-storage/feira_literaria_leitura_b1803c62.jpg", alt: "Momento de leitura com alunos" },
      { src: "/manus-storage/feira_literaria_banner_e3e5de01.webp", alt: "Banner da Feira Literária" },
      { src: "/manus-storage/feira_literaria_teatro_7517dc4d.webp", alt: "Encenação teatral dos alunos" },
      { src: "/manus-storage/feira_literaria_apresentacao_8d9d2a86.webp", alt: "Apresentação cultural dos estudantes" },
      { src: "/manus-storage/feira_literaria_alunos_2d34f79e.webp", alt: "Alunos reunidos na Feira Literária" },
      { src: "/manus-storage/feira_literaria_grupo_f4ce68a5.webp", alt: "Grupo de alunos em atividade literária" },
      { src: "/manus-storage/feira_literaria_plateia_473b972d.webp", alt: "Plateia assistindo à apresentação" },
      { src: "/manus-storage/feira_literaria_encenacao_9d5acc6f.webp", alt: "Encenação literária dos estudantes" },
    ],
  },
  {
    id: "cultura",
    icon: Music,
    categoria: "Educação e Cultura",
    titulo: "Festivais Culturais",
    descricao: "O instituto apoia o Festival de Pipas e o Festival de Escultura na Areia de Ubatuba, eventos que celebram a cultura local e promovem o turismo sustentável.",
    impacto: "Milhares de visitantes e participantes",
    detalhes: [
      "Festival de Pipas — tradição cultural de Ubatuba",
      "Festival de Escultura na Areia — arte efêmera",
      "Integração entre moradores e turistas",
      "Promoção da cultura e do turismo sustentável",
    ],
    color: "text-earth",
    bg: "bg-earth/10",
    border: "border-earth/20",
    images: [
      { src: "/manus-storage/festival_pipas_praia_a67c2a3e.webp", alt: "Pai e filho empinando pipa na praia" },
      { src: "/manus-storage/festival_pipas_bandeira_50bc9892.webp", alt: "Pipa com bandeira de Ubatuba" },
      { src: "/manus-storage/festival_tenda_equipe_47c337af.webp", alt: "Equipe do Instituto na tenda do festival" },
      { src: "/manus-storage/festival_escultura_criancas_6d9d4675.webp", alt: "Crianças esculpindo na areia" },
      { src: "/manus-storage/festival_escultura_roda_0d35331f.webp", alt: "Escultura de roda na areia" },
      { src: "/manus-storage/festival_escultura_artista_c4b77740.webp", alt: "Artista criando escultura de tartaruga" },
      { src: "/manus-storage/festival_escultura_sereia_6bbe8b40.webp", alt: "Escultura de sereia na areia" },
      { src: "/manus-storage/festival_escultura_caranguejo_6e7c0afa.webp", alt: "Escultura de caranguejo na areia" },
      { src: "/manus-storage/festival_escultura_pessoa_0e51b2d2.webp", alt: "Escultura de figura humana na areia" },
      { src: "/manus-storage/festival_escultura_elefante_fe7aba55.webp", alt: "Escultura de elefante na areia" },
      { src: "/manus-storage/festival_comunidade_tenda_c7c9efa8.webp", alt: "Comunidade reunida na tenda do Instituto" },
      { src: "/manus-storage/festival_oficina_pipas_e69d60d0.webp", alt: "Oficina de construção de pipas" },
      { src: "/manus-storage/festival_tenda_publico_f81c00a5.webp", alt: "Público no festival com tenda do Instituto" },
    ],
  },
];

function AcoesImageCarousel({ images, titulo }: { images: { src: string; alt: string }[]; titulo: string }) {
  const [current, setCurrent] = useState(0);
  const next = useCallback(() => setCurrent((c) => (c + 1) % images.length), [images.length]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + images.length) % images.length), [images.length]);

  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="relative h-[280px] md:h-[340px]">
      {images.map((img, idx) => (
        <img
          key={img.src}
          src={img.src}
          alt={img.alt}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-700",
            idx === current ? "opacity-100" : "opacity-0"
          )}
        />
      ))}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-5">
        <h3 className="text-lg font-extrabold text-white mb-1">{titulo}</h3>
        <p className="text-white/80 text-xs">{images[current].alt}</p>
      </div>
      <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-colors" aria-label="Anterior">
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-colors" aria-label="Próxima">
        <ChevronRight className="w-4 h-4" />
      </button>
      <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex gap-1.5">
        {images.map((_, idx) => (
          <button key={idx} onClick={() => setCurrent(idx)} className={cn("w-2 h-2 rounded-full transition-all", idx === current ? "bg-white w-4" : "bg-white/50")} aria-label={`Foto ${idx + 1}`} />
        ))}
      </div>
    </div>
  );
}

function AcoesSection() {
  return (
    <section id="acoes" className="section-padding bg-background">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="section-label">O que fazemos</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mt-3">
            <span className="text-forest">Ações</span>{" "}
            <span className="text-ocean">e Projetos</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mt-4">
            Iniciativas integradas que unem conservação ambiental, esporte, saúde e cultura para o desenvolvimento sustentável de Ubatuba.
          </p>
        </div>

        {/* Números de Impacto */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="text-center p-6 rounded-lg bg-forest/5 border border-forest/10">
            <div className="text-4xl font-extrabold text-forest mb-1">360+</div>
            <div className="text-sm text-muted-foreground">Crianças nas Escolinhas</div>
          </div>
          <div className="text-center p-6 rounded-lg bg-ocean/5 border border-ocean/10">
            <div className="text-4xl font-extrabold text-ocean mb-1">781</div>
            <div className="text-sm text-muted-foreground">Exames e Consultas</div>
          </div>
          <div className="text-center p-6 rounded-lg bg-earth/5 border border-earth/10">
            <div className="text-4xl font-extrabold text-earth mb-1">3</div>
            <div className="text-sm text-muted-foreground">Bolsas de Estudo</div>
          </div>
          <div className="text-center p-6 rounded-lg bg-forest-light/5 border border-forest-light/10">
            <div className="text-4xl font-extrabold text-forest-light mb-1">8+</div>
            <div className="text-sm text-muted-foreground">Projetos Ativos</div>
          </div>
        </div>

        {/* Grid de Programas */}
        <div className="space-y-14">
          {programas.map((prog, i) => (
            <div
              key={prog.id}
              className={cn(
                "grid lg:grid-cols-2 gap-10 items-center",
                i % 2 === 1 ? "lg:grid-flow-col-dense" : ""
              )}
            >
              {/* Conteúdo */}
              <div className={i % 2 === 1 ? "lg:col-start-2" : ""}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", prog.bg)}>
                    <prog.icon className={cn("w-5 h-5", prog.color)} />
                  </div>
                  <span className={cn("text-xs font-semibold tracking-widest uppercase", prog.color)}>
                    {prog.categoria}
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-foreground mb-3">{prog.titulo}</h3>
                <p className="text-muted-foreground leading-relaxed mb-5">{prog.descricao}</p>
                <ul className="space-y-2 mb-5">
                  {prog.detalhes.map((d, di) => (
                    <li key={di} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <div className={cn("w-1.5 h-1.5 rounded-full mt-2 shrink-0", prog.color.replace("text-", "bg-"))} />
                      {d}
                    </li>
                  ))}
                </ul>
                <div className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium", prog.bg, prog.border, prog.color)}>
                  <Heart className="w-3.5 h-3.5" />
                  {prog.impacto}
                </div>
              </div>

              {/* Card visual */}
              <div className={cn("rounded-xl overflow-hidden shadow-xl", i % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : "")}>
                {prog.images ? (
                  <AcoesImageCarousel images={prog.images} titulo={prog.titulo} />
                ) : prog.image ? (
                  <div className="relative">
                    <img src={prog.image} alt={prog.titulo} className="w-full h-[280px] md:h-[340px] object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-5">
                      <h3 className="text-lg font-extrabold text-white mb-1">{prog.titulo}</h3>
                      <p className="text-white/80 text-xs">{prog.impacto.split("·")[0].trim()}</p>
                    </div>
                  </div>
                ) : (
                  <div className="card-elegant p-10 text-center h-full flex flex-col items-center justify-center">
                    <div className={cn("w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center", prog.bg)}>
                      <prog.icon className={cn("w-10 h-10", prog.color)} />
                    </div>
                    <h3 className="text-2xl font-extrabold text-foreground mb-3">{prog.titulo}</h3>
                    <p className={cn("text-3xl font-extrabold mb-2", prog.color)}>{prog.impacto.split("·")[0].trim()}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Componente Principal ── */

export default function Home() {
  const { data: postsDB } = trpc.posts.list.useQuery({ limit: 3, offset: 0 });
  const posts = postsDB && postsDB.length > 0 ? postsDB : postsDestaque;

  // Carrossel state
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  }, []);

  // Auto-advance carrossel
  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <div className="overflow-x-hidden">
      {/* Barra lateral flutuante */}
      <FloatingSidebar />

      {/* ══════════════════════════════════════════════════════════════
          HERO CARROSSEL
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Slides */}
        {heroSlides.map((slide, i) => (
          <div
            key={i}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000",
              i === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 gradient-hero" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-forest-dark/60" />
          </div>
        ))}

        {/* Conteúdo do slide ativo */}
        <div className="relative container text-center text-white pt-20">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-8 animate-fade-in">
              <Leaf className="w-3.5 h-3.5 text-white/80" />
              <span className="text-xs font-medium tracking-[0.15em] uppercase text-white/80">
                Ubatuba, São Paulo · ODS 17 — Parcerias
              </span>
            </div>

            <h1
              key={`title-${currentSlide}`}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.1] mb-6 animate-fade-up tracking-tight"
            >
              {heroSlides[currentSlide].title}
            </h1>

            <p
              key={`sub-${currentSlide}`}
              className="text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl mx-auto mb-10 animate-fade-up"
              style={{ animationDelay: "0.15s" }}
            >
              {heroSlides[currentSlide].subtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: "0.25s" }}>
              <Link
                href={heroSlides[currentSlide].ctaHref}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-forest font-semibold rounded-sm hover:bg-white/90 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98]"
              >
                {heroSlides[currentSlide].cta}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/apoie"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/60 text-white font-semibold rounded-sm hover:bg-white/10 hover:border-white transition-all duration-200 active:scale-[0.98]"
              >
                Apoie o Instituto
              </Link>
            </div>
          </div>
        </div>

        {/* Controles do carrossel */}
        <button
          onClick={prevSlide}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Indicadores */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all duration-300",
                i === currentSlide ? "bg-white w-8" : "bg-white/40 hover:bg-white/60"
              )}
            />
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          NÚMEROS DE IMPACTO (estilo SOS — fundo colorido + ícones)
      ══════════════════════════════════════════════════════════════ */}
      <section className="bg-forest relative py-16 md:py-20">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {impactNumbers.map((item, i) => (
              <div key={i} className="text-center text-white">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full border-2 border-white/20 flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-earth" />
                </div>
                <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">{item.value}</div>
                <div className="text-sm text-white/60 leading-snug">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wave divider */}
      <WaveDivider color="var(--color-cream)" />

      {/* ══════════════════════════════════════════════════════════════
          SEÇÃO DE CAUSAS COM TABS (inspirado SOS)
      ══════════════════════════════════════════════════════════════ */}
      <section className="bg-cream section-padding -mt-1">
        <div className="container">
          <div className="text-center mb-12">
            <span className="section-label block mb-4">Nossas Causas</span>
            <h2 className="section-title mx-auto">Áreas de <span className="text-azul-oceano">atuação</span></h2>
          </div>

          <Tabs defaultValue="saude" className="w-full">
            <TabsList className="w-full max-w-2xl mx-auto grid grid-cols-3 h-auto gap-2 bg-transparent p-0 mb-12">
              {causasData.map((causa) => (
                <TabsTrigger
                  key={causa.id}
                  value={causa.id}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg border border-border bg-card text-sm font-semibold data-[state=active]:bg-forest data-[state=active]:text-white data-[state=active]:border-forest transition-all"
                >
                  <causa.icon className="w-4 h-4" />
                  {causa.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {causasData.map((causa) => (
              <TabsContent key={causa.id} value={causa.id}>
                {causa.gallery ? (
                  <EsporteGalleryTab causa={causa} />
                ) : (
                  <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="rounded-xl overflow-hidden shadow-xl">
                      <img src={causa.image} alt={causa.title} className="w-full h-[320px] object-cover" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-extrabold text-foreground mb-4">{causa.title}</h3>
                      <p className="text-muted-foreground leading-relaxed text-lg mb-6">{causa.description}</p>
                      <Link href={causa.link} className="btn-primary">
                        Saiba Mais <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Wave divider invertido */}
      <WaveDivider color="var(--color-cream)" flip className="-mt-1" />

      {/* ══════════════════════════════════════════════════════════════
          AÇÕES E PROJETOS (integrado da página Programas)
      ══════════════════════════════════════════════════════════════ */}
      <AcoesSection />

      {/* ══════════════════════════════════════════════════════════════
          CTA DE DOAÇÃO VIBRANTE (estilo SOS — fundo dourado)
      ══════════════════════════════════════════════════════════════ */}
      <section className="bg-earth py-12 md:py-16">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
                Some com a gente.
              </h2>
              <p className="text-white/80 text-lg">
                Sua doação transforma vidas e preserva a natureza em Ubatuba.
              </p>
            </div>
            <Link
              href="/apoie#doacoes"
              className="inline-flex items-center gap-2 px-10 py-4 bg-white text-forest font-bold rounded-sm hover:bg-white/90 transition-all shadow-lg hover:shadow-xl active:scale-[0.98] whitespace-nowrap"
            >
              Doar Agora
              <Heart className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          FIQUE POR DENTRO — Notícias e Artigos (estilo SOS)
      ══════════════════════════════════════════════════════════════ */}
      <section className="section-padding bg-background">
        <div className="container">
          <div className="text-center mb-14">
            <span className="section-label block mb-4">Blog e Notícias</span>
            <h2 className="section-title mx-auto">Fique por <span className="text-azul-oceano">dentro</span></h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {posts.map((post: any, i: number) => (
              <Link key={post.id} href={`/noticias/${post.slug}`} className={cn("card-elegant overflow-hidden group block", i === 0 && "md:row-span-2")}>
                {post.coverImage && (
                  <div className={cn("overflow-hidden", i === 0 ? "h-56 md:h-72" : "h-48")}>
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-6">
                  {post.category && (
                    <span className="inline-block px-3 py-1 text-xs font-semibold tracking-widest uppercase bg-forest/10 text-forest rounded-full mb-3">{post.category}</span>
                  )}
                  <h3 className={cn("font-bold text-foreground mb-3 group-hover:text-forest transition-colors line-clamp-2", i === 0 ? "text-2xl" : "text-lg")}>
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{post.excerpt}</p>
                  )}
                  <div className="mt-4 flex items-center gap-1.5 text-forest text-sm font-medium group-hover:gap-2.5 transition-all">
                    Ler mais <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/noticias" className="btn-outline">
              Veja Mais Notícias <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          PARCEIROS (estilo SOS — grid de logos)
      ══════════════════════════════════════════════════════════════ */}
      <section className="section-padding bg-sand">
        <div className="container">
          <div className="text-center mb-12">
            <span className="section-label block mb-4">Rede de Apoio</span>
            <h2 className="section-title mx-auto mb-4"><span className="text-azul-oceano">Parceiros</span></h2>
            <p className="section-subtitle mx-auto">
              As causas do Instituto Ubatuba são fortalecidas graças ao apoio de parceiros, patrocinadores e doadores. Uma verdadeira rede em torno da sustentabilidade.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {parceiros.map((p, i) => (
              <div key={i} className="bg-card rounded-xl p-6 flex flex-col items-center justify-center border border-border/60 hover:shadow-md hover:border-forest/20 transition-all">
                <div className="w-16 h-16 rounded-full bg-forest/10 flex items-center justify-center mb-3">
                  <span className="text-forest font-bold text-lg">{p.initials}</span>
                </div>
                <span className="text-xs text-muted-foreground text-center leading-tight">{p.name}</span>
              </div>
            ))}
          </div>

          <div className="text-center mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/apoie#parcerias" className="btn-primary">
              Seja nosso parceiro <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          BANNER APOIE (mantido — imagem + CTA)
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img src={NATUREZA_IMAGE} alt="Natureza" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-forest-dark/85" />
        </div>
        <div className="relative container text-center text-white">
          <span className="section-label block mb-4 text-white/60">Faça parte</span>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-white">
            Parcerias entre poder público, institutos e comunidade.
          </h2>
          <p className="text-white/70 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Seja como voluntário, doador ou parceiro institucional — sua contribuição é fundamental para ampliar nosso impacto em Ubatuba e região.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/apoie#doacoes" className="inline-flex items-center gap-2 px-8 py-4 bg-earth text-white font-semibold rounded-sm hover:bg-earth/90 transition-all active:scale-[0.98]">
              Fazer uma doação
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/apoie#voluntariado" className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/40 text-white font-semibold rounded-sm hover:bg-white/10 hover:border-white/70 transition-all active:scale-[0.98]">
              Ser voluntário
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
