import { Link } from "wouter";
import { ArrowRight, Leaf, Users, Heart, BookOpen, Fish, TreePine, Waves, ChevronDown, ChevronLeft, ChevronRight, Droplets, GraduationCap, Stethoscope } from "lucide-react";
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
    title: "Preservar a natureza é preservar a vida",
    subtitle: "O Instituto Ubatuba Santuário Ecológico promove a conservação socioambiental por meio de parcerias, educação e inclusão social.",
    cta: "Conheça nossas ações",
    ctaHref: "/programas",
    image: HERO_IMAGE,
  },
  {
    title: "360 crianças transformadas pelo esporte",
    subtitle: "Nossas escolinhas de surfe, futebol e futevôlei oferecem oportunidades reais para jovens da comunidade de Ubatuba.",
    cta: "Veja nosso impacto",
    ctaHref: "/programas",
    image: PRAIA_IMAGE,
  },
  {
    title: "Apoie o trabalho do Instituto Ubatuba",
    subtitle: "Veja como é simples e rápido ajudar a preservar os ecossistemas e transformar vidas no litoral norte de São Paulo.",
    cta: "Doe agora",
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
    id: "esporte",
    label: "Esporte",
    icon: Waves,
    title: "Esporte e Inclusão Social",
    description: "Por meio das escolinhas de surfe (160 crianças), futebol (120 crianças) e futevôlei (80 crianças), promovemos saúde, disciplina e conexão com o oceano para jovens da comunidade de Ubatuba. O esporte é uma ferramenta de transformação social que abre portas e constrói cidadania.",
    image: PRAIA_IMAGE,
    link: "/programas",
    gallery: esporteImages,
  },
  {
    id: "conservacao",
    label: "Conservação",
    icon: Fish,
    title: "Conservação Ambiental",
    description: "Com o projeto Bituqueira Ecológica e a parceria com o Itaguá Azul, trabalhamos pela preservação dos ecossistemas marinhos e terrestres de Ubatuba. Realizamos limpeza de praias, monitoramento ambiental e educação ecológica nas escolas locais.",
    image: NATUREZA_IMAGE,
    link: "/programas",
  },
  {
    id: "saude",
    label: "Saúde",
    icon: Stethoscope,
    title: "Saúde Comunitária",
    description: "Em parceria com a Total Quality Medicina Diagnóstica, já realizamos 781 exames e consultas gratuitas para a comunidade. Além disso, concedemos 3 bolsas de estudo para jovens que desejam seguir carreira na área da saúde.",
    image: HERO_IMAGE,
    link: "/programas",
  },
  {
    id: "educacao",
    label: "Educação",
    icon: GraduationCap,
    title: "Educação e Cultura",
    description: "Apoiamos a Feira Literária com a Escola Marina Nepomuceno do Amaral, o Festival de Pipas e o Festival de Escultura na Areia. Essas iniciativas fortalecem a identidade cultural de Ubatuba e promovem o acesso à arte e ao conhecimento.",
    image: PRAIA_IMAGE,
    link: "/programas",
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
        <h3 className="font-serif text-3xl font-medium text-foreground mb-4">{causa.title}</h3>
        <p className="text-muted-foreground leading-relaxed text-lg mb-6">{causa.description}</p>
        <Link href={causa.link} className="btn-primary">
          Saiba Mais <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
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
                Ubatuba, São Paulo · ODS 18
              </span>
            </div>

            <h1
              key={`title-${currentSlide}`}
              className="font-serif text-4xl sm:text-5xl md:text-7xl font-medium leading-[1.1] mb-6 animate-fade-up"
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
                <div className="font-serif text-4xl md:text-5xl font-semibold text-white mb-2">{item.value}</div>
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
            <h2 className="section-title mx-auto">Áreas de atuação</h2>
          </div>

          <Tabs defaultValue="esporte" className="w-full">
            <TabsList className="w-full max-w-2xl mx-auto grid grid-cols-2 md:grid-cols-4 h-auto gap-2 bg-transparent p-0 mb-12">
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
                      <h3 className="font-serif text-3xl font-medium text-foreground mb-4">{causa.title}</h3>
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
          CTA DE DOAÇÃO VIBRANTE (estilo SOS — fundo dourado)
      ══════════════════════════════════════════════════════════════ */}
      <section className="bg-earth py-12 md:py-16">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h2 className="font-serif text-3xl md:text-4xl font-medium text-white mb-2">
                Contribua para nossas causas.
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
            <h2 className="section-title mx-auto">Fique por dentro</h2>
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
                  <h3 className={cn("font-serif font-medium text-foreground mb-3 group-hover:text-forest transition-colors line-clamp-2", i === 0 ? "text-2xl" : "text-lg")}>
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
            <h2 className="section-title mx-auto mb-4">Parceiros</h2>
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
          <h2 className="font-serif text-4xl md:text-5xl font-medium mb-6 text-white">
            Juntos, preservamos mais
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
