import { useState, useMemo, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Search, GraduationCap, Clock, Building2, ChevronLeft, ChevronRight, Play, Info, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSEO } from "@/components/SEOHead";
import { InstitutionSeal } from "@/components/InstitutionLogo";
import { trpc } from "@/lib/trpc";
import { coursesDemo, CATEGORIES, type CourseDemo } from "@/data/coursesDemo";

const PAGE_SIZE = 24;

const LEVELS = [
  { id: "iniciante", label: "Iniciante" },
  { id: "intermediario", label: "Intermediário" },
  { id: "avancado", label: "Avançado" },
];

const LEVEL_LABEL: Record<string, string> = {
  iniciante: "Iniciante",
  intermediario: "Intermediário",
  avancado: "Avançado",
};

/**
 * Gradientes de "pôster" por categoria usando SOMENTE a paleta oficial do
 * Instituto (Verde Serra, Azul Oceano, Amarelo Sol, Laranja Praia, Areia, Tinta).
 */
const CATEGORY_STYLES: Record<string, { gradient: string; glow: string }> = {
  tecnologia: { gradient: "from-azul-oceano via-forest-dark to-tinta", glow: "bg-azul-oceano/40" },
  saude: { gradient: "from-laranja-praia via-forest-dark to-tinta", glow: "bg-laranja-praia/40" },
  administracao: { gradient: "from-forest via-forest-dark to-tinta", glow: "bg-forest-light/40" },
  educacao: { gradient: "from-amarelo-sol via-laranja-praia to-tinta", glow: "bg-amarelo-sol/40" },
  meio_ambiente: { gradient: "from-forest-light via-forest to-tinta", glow: "bg-forest-light/50" },
  idiomas: { gradient: "from-azul-oceano via-forest to-tinta", glow: "bg-azul-oceano/40" },
  direito: { gradient: "from-forest-dark via-tinta to-tinta", glow: "bg-forest/40" },
  ciencias: { gradient: "from-azul-oceano via-tinta to-forest-dark", glow: "bg-azul-oceano/40" },
  artes: { gradient: "from-laranja-praia via-amarelo-sol to-forest-dark", glow: "bg-laranja-praia/40" },
  esporte: { gradient: "from-amarelo-sol via-forest to-forest-dark", glow: "bg-amarelo-sol/40" },
};

const DEFAULT_STYLE = { gradient: "from-forest via-forest-dark to-tinta", glow: "bg-forest/40" };
const categoryStyle = (id: string) => CATEGORY_STYLES[id] ?? DEFAULT_STYLE;
const categoryMeta = (id: string) => CATEGORIES.find((c) => c.id === id);

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export default function Cursos() {
  useSEO({
    title: "Cursos Gratuitos | Instituto Ubatuba Santuário Ecológico",
    description: "Centenas de cursos gratuitos de Harvard, MIT, USP, FGV, Santander, Escola Virtual de Governo e mais.",
    keywords: "cursos gratuitos, educação online, Harvard, Santander, ENAP, USP, idiomas",
    canonical: "/cursos",
  });

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [page, setPage] = useState(1);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Debounce da busca (evita uma consulta por tecla)
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput.trim()), 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Volta para a 1ª página quando um filtro muda
  useEffect(() => {
    setPage(1);
  }, [search, selectedCategory, selectedLevel]);

  const browsing = search === "" && selectedCategory === "all" && selectedLevel === "all";

  const listQuery = trpc.courses.list.useQuery(
    {
      search: search || undefined,
      category: selectedCategory === "all" ? undefined : selectedCategory,
      level: selectedLevel === "all" ? undefined : selectedLevel,
      page,
      pageSize: PAGE_SIZE,
    },
    { retry: false, placeholderData: (prev) => prev }
  );
  const featuredQuery = trpc.courses.featured.useQuery(undefined, { retry: false });

  // Fallback local (coursesDemo) caso o banco esteja indisponível
  const demoPage = useMemo(() => {
    const q = norm(search);
    const arr = coursesDemo.filter((c) => {
      const okCat = selectedCategory === "all" || c.category === selectedCategory;
      const okLvl = selectedLevel === "all" || c.level === selectedLevel;
      const okS = q === "" || norm(`${c.title} ${c.institution} ${c.description ?? ""}`).includes(q);
      return okCat && okLvl && okS;
    });
    const start = (page - 1) * PAGE_SIZE;
    return { items: arr.slice(start, start + PAGE_SIZE), total: arr.length };
  }, [search, selectedCategory, selectedLevel, page]);

  const data = listQuery.data;
  const demoNeeded = !!data && data.total === 0 && browsing; // banco vazio/indisponível
  const items: CourseDemo[] = demoNeeded
    ? demoPage.items
    : ((data?.items ?? []) as unknown as CourseDemo[]);
  const total = demoNeeded ? demoPage.total : data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const featured: CourseDemo[] =
    featuredQuery.data && featuredQuery.data.length > 0
      ? (featuredQuery.data as unknown as CourseDemo[])
      : coursesDemo.filter((c) => c.featured).slice(0, 5);

  const goToPage = (p: number) => {
    setPage(p);
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-tinta text-areia">
      {browsing && featured.length > 0 && <HeroBillboard courses={featured} />}

      {/* Barra de busca e filtros */}
      <section className={browsing ? "px-4 pb-2 -mt-6 relative z-10" : "px-4 pt-28 pb-2"}>
        <div className="container max-w-7xl">
          <div className="flex flex-wrap items-center gap-3 bg-forest-dark/60 backdrop-blur-md border border-areia/10 rounded-2xl p-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-areia/50" />
              <Input
                placeholder="Buscar por curso, instituição ou tema..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-11 h-11 rounded-xl bg-tinta/60 border-areia/15 text-areia placeholder:text-areia/40 focus-visible:ring-amarelo-sol"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[190px] h-11 rounded-xl bg-tinta/60 border-areia/15 text-areia"><SelectValue placeholder="Categoria" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {CATEGORIES.map((cat) => (<SelectItem key={cat.id} value={cat.id}>{cat.icon} {cat.label}</SelectItem>))}
              </SelectContent>
            </Select>
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-[160px] h-11 rounded-xl bg-tinta/60 border-areia/15 text-areia"><SelectValue placeholder="Nível" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os níveis</SelectItem>
                {LEVELS.map((lvl) => (<SelectItem key={lvl.id} value={lvl.id}>{lvl.label}</SelectItem>))}
              </SelectContent>
            </Select>
            {!browsing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setSelectedCategory("all"); setSelectedLevel("all"); setSearchInput(""); setSearch(""); }}
                className="text-areia/70 hover:text-areia hover:bg-areia/10"
              >
                <X className="w-4 h-4 mr-1" /> Limpar
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Grade paginada */}
      <section ref={resultsRef} className="px-4 py-8 scroll-mt-24">
        <div className="container max-w-7xl">
          <p className="text-sm text-areia/60 mb-6">
            {total.toLocaleString("pt-BR")} curso{total !== 1 ? "s" : ""} gratuito{total !== 1 ? "s" : ""}
            {!browsing && " encontrado" + (total !== 1 ? "s" : "")}
          </p>

          {listQuery.isLoading && !data ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-8 h-8 animate-spin text-amarelo-sol" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20">
              <GraduationCap className="w-12 h-12 mx-auto text-areia/30 mb-4" />
              <p className="text-areia/60">Nenhum curso encontrado com os filtros selecionados.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {items.map((course) => (<PosterCard key={course.id} course={course} />))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-12">
                  <Button
                    variant="outline"
                    disabled={page <= 1}
                    onClick={() => goToPage(page - 1)}
                    className="border-areia/20 bg-areia/5 text-areia hover:bg-areia/15 hover:text-areia rounded-full disabled:opacity-40"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" /> Anterior
                  </Button>
                  <span className="text-sm text-areia/70 tabular-nums">
                    Página {page} de {totalPages.toLocaleString("pt-BR")}
                  </span>
                  <Button
                    variant="outline"
                    disabled={page >= totalPages}
                    onClick={() => goToPage(page + 1)}
                    className="border-areia/20 bg-areia/5 text-areia hover:bg-areia/15 hover:text-areia rounded-full disabled:opacity-40"
                  >
                    Próxima <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Instituições parceiras */}
      <section className="px-4 py-16 border-t border-areia/10 mt-4">
        <div className="container max-w-6xl text-center">
          <h2 className="text-lg font-semibold text-areia mb-2">Instituições Parceiras</h2>
          <p className="text-sm text-areia/50 mb-8">Cursos oferecidos por universidades e plataformas reconhecidas</p>
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            {["Harvard", "MIT", "Stanford", "USP", "UNICAMP", "FGV", "Fiocruz", "SENAI", "Santander", "Escola Virtual de Governo", "Fundação Bradesco", "Kultivi", "MEC"].map((name) => (
              <span key={name} className="px-3 py-1.5 bg-areia/10 text-areia/80 rounded-full font-medium">{name}</span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ── Hero estilo billboard, com rotação dos destaques ── */
function HeroBillboard({ courses }: { courses: CourseDemo[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (courses.length <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % courses.length), 8000);
    return () => clearInterval(t);
  }, [courses.length]);

  const course = courses[Math.min(index, courses.length - 1)];
  const cat = categoryMeta(course.category);
  const style = categoryStyle(course.category);

  return (
    <section className={`relative overflow-hidden bg-gradient-to-br ${style.gradient} transition-colors duration-700`}>
      {course.coverImage && (
        <img key={course.id} src={course.coverImage} alt="" className="absolute inset-0 w-full h-full object-cover object-right animate-in fade-in duration-700" />
      )}
      {!course.coverImage && (
        <div className={`absolute -top-24 -right-24 w-[480px] h-[480px] rounded-full blur-3xl opacity-60 ${style.glow}`} />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-tinta via-transparent to-tinta/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-tinta/80 via-transparent to-transparent" />
      {!course.coverImage && (
        <div aria-hidden className="absolute right-6 bottom-2 text-[180px] md:text-[260px] leading-none opacity-15 select-none">{cat?.icon}</div>
      )}

      <div className="container max-w-7xl relative z-10 pt-32 md:pt-36 pb-20 px-4">
        <div className="max-w-2xl" key={course.id}>
          <div className="flex items-center gap-2 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Badge className="bg-amarelo-sol text-tinta hover:bg-amarelo-sol font-semibold">
              <GraduationCap className="w-3.5 h-3.5 mr-1" /> 100% Gratuito
            </Badge>
            <Badge variant="outline" className="border-areia/30 text-areia/90">{cat?.icon} {cat?.label}</Badge>
            <Badge variant="outline" className="border-areia/30 text-areia/90">{LEVEL_LABEL[course.level]}</Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-areia leading-[1.05] mb-4 animate-in fade-in slide-in-from-bottom-3 duration-500">
            {course.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-areia/70 mb-4 animate-in fade-in duration-700">
            <span className="flex items-center gap-2 text-lg">
              <InstitutionSeal institution={course.institution} logo={course.institutionLogo} className="w-10 h-10" />
              <span className="text-sm text-areia/80 font-medium">{course.institution}</span>
            </span>
            {course.duration && <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {course.duration}</span>}
          </div>
          <p className="text-base md:text-lg text-areia/80 line-clamp-3 mb-8 animate-in fade-in duration-700">{course.description}</p>
          <div className="flex flex-wrap items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <Link href={`/cursos/${course.slug}`}>
              <Button size="lg" className="bg-amarelo-sol text-tinta hover:bg-laranja-praia font-bold rounded-full px-8 h-12 text-base">
                <Play className="w-5 h-5 mr-2 fill-tinta" /> Começar agora
              </Button>
            </Link>
            <Link href={`/cursos/${course.slug}`}>
              <Button size="lg" variant="outline" className="border-areia/30 bg-areia/10 text-areia hover:bg-areia/20 hover:text-areia rounded-full px-8 h-12 text-base backdrop-blur-sm">
                <Info className="w-5 h-5 mr-2" /> Mais informações
              </Button>
            </Link>
          </div>
        </div>

        {courses.length > 1 && (
          <div className="flex gap-2 mt-10">
            {courses.map((c, i) => (
              <button
                key={c.id}
                aria-label={`Destaque ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? "w-8 bg-amarelo-sol" : "w-4 bg-areia/25 hover:bg-areia/50"}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ── Card "pôster" com gradiente da categoria e hover Netflix ── */
function PosterCard({ course }: { course: CourseDemo }) {
  const cat = categoryMeta(course.category);
  const style = categoryStyle(course.category);

  return (
    <Link href={`/cursos/${course.slug}`}>
      <div className="group relative rounded-lg overflow-hidden cursor-pointer transition-all duration-300 md:hover:scale-[1.06] md:hover:z-20 hover:shadow-2xl hover:shadow-tinta ring-0 hover:ring-2 hover:ring-amarelo-sol/80 bg-forest-dark">
        <div className={`relative bg-gradient-to-br ${style.gradient} h-44 md:h-48 p-4 flex flex-col justify-between overflow-hidden`}>
          {course.coverImage ? (
            <>
              <img src={course.coverImage} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-tinta/85 via-tinta/15 to-tinta/40" />
            </>
          ) : (
            <div aria-hidden className="absolute -right-4 -bottom-6 text-[96px] leading-none opacity-25 select-none group-hover:scale-110 transition-transform duration-500">{cat?.icon}</div>
          )}
          <div className="flex items-start justify-between gap-2 relative z-10">
            <span className="flex items-center gap-1.5 min-w-0 text-base">
              <InstitutionSeal institution={course.institution} logo={course.institutionLogo} className="w-8 h-8" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-areia/80 bg-tinta/40 backdrop-blur-sm px-2 py-1 rounded-md truncate">{course.institution}</span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-tinta bg-amarelo-sol px-2 py-1 rounded-md shrink-0">Grátis</span>
          </div>
          <h3 className="relative z-10 font-bold text-areia leading-snug line-clamp-3 drop-shadow-md">{course.title}</h3>
        </div>

        {/* Rodapé do card — Azul Oceano (#008CBF) do manual de marca */}
        <div className="px-4 py-3 flex items-center gap-3 text-[11px] text-areia/90 bg-ocean">
          <span className="capitalize">{LEVEL_LABEL[course.level]}</span>
          {course.duration && (<span className="flex items-center gap-1 ml-auto"><Clock className="w-3 h-3" /> {course.duration}</span>)}
        </div>

        {/* Overlay de hover com descrição */}
        <div className="absolute inset-0 bg-tinta/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex-col justify-between hidden md:flex pointer-events-none">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-amarelo-sol text-tinta hover:bg-amarelo-sol text-[10px] font-bold">Grátis</Badge>
              <span className="text-[11px] text-areia/70">{cat?.icon} {cat?.label}</span>
            </div>
            <h3 className="font-bold text-areia text-sm leading-snug mb-2 line-clamp-2">{course.title}</h3>
            {course.description && <p className="text-xs text-areia/70 line-clamp-4">{course.description}</p>}
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[11px] text-areia/60 min-w-0">
              <Building2 className="w-3 h-3 shrink-0" />
              <span className="truncate text-[11px]">{course.institution}</span>
            </span>
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amarelo-sol text-tinta shrink-0">
              <Play className="w-4 h-4 fill-tinta ml-0.5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
