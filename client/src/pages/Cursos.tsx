import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Link } from "wouter";
import {
  Search,
  GraduationCap,
  Clock,
  Building2,
  ChevronLeft,
  ChevronRight,
  Play,
  Info,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSEO } from "@/components/SEOHead";
import { trpc } from "@/lib/trpc";
import { coursesDemo, CATEGORIES, type CourseDemo } from "@/data/coursesDemo";

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
 * Instituto (Verde Serra, Azul Oceano, Amarelo Sol, Laranja Praia, Areia,
 * Tinta) — nada fora do manual de marca.
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

function categoryStyle(id: string) {
  return CATEGORY_STYLES[id] ?? DEFAULT_STYLE;
}

function categoryMeta(id: string) {
  return CATEGORIES.find((c) => c.id === id);
}

export default function Cursos() {
  useSEO({
    title: "Cursos Gratuitos | Instituto Ubatuba Santuário Ecológico",
    description: "Acesse cursos gratuitos de universidades de excelência como Harvard, MIT, USP, FGV e plataformas do governo.",
    keywords: "cursos gratuitos, educação online, Harvard, MIT, USP, FGV, ENAP, idiomas",
    canonical: "/cursos",
  });

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");

  const { data: dbCourses } = trpc.courses.list.useQuery(undefined, { retry: false });
  const allCourses = dbCourses && dbCourses.length > 0 ? dbCourses : coursesDemo;

  const browsing = search === "" && selectedCategory === "all" && selectedLevel === "all";

  const filteredCourses = useMemo(() => {
    // Busca sem acentos: "ingles" encontra "Inglês"
    const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const q = norm(search);
    return allCourses.filter((course) => {
      const matchesSearch = q === "" ||
        norm(course.title).includes(q) ||
        norm(course.institution).includes(q) ||
        norm(course.description ?? "").includes(q);
      const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
      const matchesLevel = selectedLevel === "all" || course.level === selectedLevel;
      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [allCourses, search, selectedCategory, selectedLevel]);

  const featuredCourses = useMemo(() => allCourses.filter((c) => c.featured), [allCourses]);
  const topTen = useMemo(() => featuredCourses.concat(allCourses.filter((c) => !c.featured)).slice(0, 10), [allCourses, featuredCourses]);

  const categoriesWithCourses = useMemo(
    () => CATEGORIES.filter((cat) => allCourses.some((c) => c.category === cat.id)),
    [allCourses]
  );

  return (
    <div className="min-h-screen bg-tinta text-areia">
      {browsing && featuredCourses.length > 0 && <HeroBillboard courses={featuredCourses.slice(0, 5)} />}

      {/* Barra de busca e filtros */}
      <section className={browsing ? "px-4 pb-2 -mt-6 relative z-10" : "px-4 pt-28 pb-2"}>
        <div className="container max-w-7xl">
          <div className="flex flex-wrap items-center gap-3 bg-forest-dark/60 backdrop-blur-md border border-areia/10 rounded-2xl p-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-areia/50" />
              <Input
                placeholder="Buscar por curso, instituição ou tema..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
                onClick={() => { setSelectedCategory("all"); setSelectedLevel("all"); setSearch(""); }}
                className="text-areia/70 hover:text-areia hover:bg-areia/10"
              >
                <X className="w-4 h-4 mr-1" /> Limpar
              </Button>
            )}
          </div>
        </div>
      </section>

      {browsing ? (
        <>
          <CourseRow title="Em Destaque" courses={featuredCourses} />
          <TopTenRow courses={topTen} />
          {categoriesWithCourses.map((cat) => (
            <CourseRow
              key={cat.id}
              title={`${cat.icon} ${cat.label}`}
              courses={allCourses.filter((c) => c.category === cat.id)}
            />
          ))}
        </>
      ) : (
        <section className="px-4 py-10">
          <div className="container max-w-7xl">
            <p className="text-sm text-areia/60 mb-6">
              {filteredCourses.length} curso{filteredCourses.length !== 1 ? "s" : ""} encontrado{filteredCourses.length !== 1 ? "s" : ""}
            </p>
            {filteredCourses.length === 0 ? (
              <div className="text-center py-20">
                <GraduationCap className="w-12 h-12 mx-auto text-areia/30 mb-4" />
                <p className="text-areia/60">Nenhum curso encontrado com os filtros selecionados.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredCourses.map((course) => (<PosterCard key={course.id} course={course} />))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Instituições parceiras */}
      <section className="px-4 py-16 border-t border-areia/10 mt-8">
        <div className="container max-w-6xl text-center">
          <h2 className="text-lg font-semibold text-areia mb-2">Instituições Parceiras</h2>
          <p className="text-sm text-areia/50 mb-8">Cursos oferecidos por universidades e plataformas reconhecidas</p>
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            {["Harvard", "MIT", "Stanford", "USP", "UNICAMP", "FGV", "ENAP", "Fiocruz", "SENAI", "Fundação Bradesco", "Kultivi", "MEC", "Deutsche Welle", "British Council"].map((name) => (
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

  const course = courses[index];
  const cat = categoryMeta(course.category);
  const style = categoryStyle(course.category);

  return (
    <section className={`relative overflow-hidden bg-gradient-to-br ${style.gradient} transition-colors duration-700`}>
      {/* brilho de cor da categoria + vinheta para o fundo Tinta */}
      <div className={`absolute -top-24 -right-24 w-[480px] h-[480px] rounded-full blur-3xl opacity-60 ${style.glow}`} />
      <div className="absolute inset-0 bg-gradient-to-t from-tinta via-transparent to-tinta/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-tinta/80 via-transparent to-transparent" />
      <div aria-hidden className="absolute right-6 bottom-2 text-[180px] md:text-[260px] leading-none opacity-15 select-none">
        {cat?.icon}
      </div>

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
            <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4" /> {course.institution}</span>
            {course.duration && <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {course.duration}</span>}
          </div>
          <p className="text-base md:text-lg text-areia/80 line-clamp-3 mb-8 animate-in fade-in duration-700">
            {course.description}
          </p>
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

        {/* indicadores de rotação */}
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

/* ── Fileira horizontal estilo Netflix ── */
function CourseRow({ title, courses }: { title: string; courses: CourseDemo[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollBy = useCallback((dir: 1 | -1) => {
    scrollRef.current?.scrollBy({ left: dir * Math.round(scrollRef.current.clientWidth * 0.85), behavior: "smooth" });
  }, []);

  if (courses.length === 0) return null;

  return (
    <section className="py-5 group/row">
      <div className="container max-w-7xl px-4">
        <h2 className="text-lg md:text-xl font-bold text-areia mb-3">{title}</h2>
      </div>
      <div className="relative">
        <RowArrow dir={-1} onClick={() => scrollBy(-1)} />
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto snap-x snap-mandatory px-4 md:px-[max(1rem,calc((100vw-80rem)/2+1rem))] pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {courses.map((course) => (
            <div key={course.id} className="snap-start shrink-0 w-[230px] md:w-[270px]">
              <PosterCard course={course} />
            </div>
          ))}
        </div>
        <RowArrow dir={1} onClick={() => scrollBy(1)} />
      </div>
    </section>
  );
}

/* ── Fileira "Top 10" com numerões ── */
function TopTenRow({ courses }: { courses: CourseDemo[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollBy = useCallback((dir: 1 | -1) => {
    scrollRef.current?.scrollBy({ left: dir * Math.round(scrollRef.current.clientWidth * 0.85), behavior: "smooth" });
  }, []);

  if (courses.length === 0) return null;

  return (
    <section className="py-5 group/row">
      <div className="container max-w-7xl px-4">
        <h2 className="text-lg md:text-xl font-bold text-areia mb-3">🏆 Top 10 do Instituto</h2>
      </div>
      <div className="relative">
        <RowArrow dir={-1} onClick={() => scrollBy(-1)} />
        <div
          ref={scrollRef}
          className="flex gap-1 overflow-x-auto snap-x snap-mandatory px-4 md:px-[max(1rem,calc((100vw-80rem)/2+1rem))] pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {courses.map((course, i) => (
            <div key={course.id} className="snap-start shrink-0 flex items-end">
              <span
                aria-hidden
                className="text-[110px] md:text-[150px] font-extrabold leading-[0.75] text-transparent select-none -mr-5 md:-mr-7 relative z-0"
                style={{ WebkitTextStroke: "3px #F4C42E" }}
              >
                {i + 1}
              </span>
              <div className="w-[190px] md:w-[220px] relative z-10">
                <PosterCard course={course} compact />
              </div>
            </div>
          ))}
        </div>
        <RowArrow dir={1} onClick={() => scrollBy(1)} />
      </div>
    </section>
  );
}

function RowArrow({ dir, onClick }: { dir: 1 | -1; onClick: () => void }) {
  return (
    <button
      aria-label={dir === 1 ? "Avançar" : "Voltar"}
      onClick={onClick}
      className={`hidden md:flex absolute top-0 bottom-2 ${dir === 1 ? "right-0" : "left-0"} z-20 w-12 items-center justify-center bg-tinta/60 hover:bg-tinta/85 text-areia opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 backdrop-blur-[2px]`}
    >
      {dir === 1 ? <ChevronRight className="w-8 h-8" /> : <ChevronLeft className="w-8 h-8" />}
    </button>
  );
}

/* ── Card "pôster" com gradiente da categoria e hover Netflix ── */
function PosterCard({ course, compact }: { course: CourseDemo; compact?: boolean }) {
  const cat = categoryMeta(course.category);
  const style = categoryStyle(course.category);

  return (
    <Link href={`/cursos/${course.slug}`}>
      <div className="group relative rounded-lg overflow-hidden cursor-pointer transition-all duration-300 md:hover:scale-[1.06] md:hover:z-20 hover:shadow-2xl hover:shadow-tinta ring-0 hover:ring-2 hover:ring-amarelo-sol/80 bg-forest-dark">
        {/* Pôster */}
        <div className={`relative bg-gradient-to-br ${style.gradient} ${compact ? "h-40" : "h-44 md:h-48"} p-4 flex flex-col justify-between overflow-hidden`}>
          <div aria-hidden className="absolute -right-4 -bottom-6 text-[96px] leading-none opacity-25 select-none group-hover:scale-110 transition-transform duration-500">
            {cat?.icon}
          </div>
          <div className="flex items-start justify-between gap-2 relative z-10">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-areia/80 bg-tinta/40 backdrop-blur-sm px-2 py-1 rounded-md">
              {course.institution}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-tinta bg-amarelo-sol px-2 py-1 rounded-md shrink-0">
              Grátis
            </span>
          </div>
          <h3 className="relative z-10 font-bold text-areia leading-snug line-clamp-3 drop-shadow-md">
            {course.title}
          </h3>
        </div>

        {/* Rodapé do card */}
        <div className="px-4 py-3 flex items-center gap-3 text-[11px] text-areia/60 bg-forest-dark">
          <span className="capitalize">{LEVEL_LABEL[course.level]}</span>
          {course.duration && (
            <span className="flex items-center gap-1 ml-auto"><Clock className="w-3 h-3" /> {course.duration}</span>
          )}
        </div>

        {/* Overlay de hover com descrição */}
        <div className="absolute inset-0 bg-tinta/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex-col justify-between hidden md:flex pointer-events-none">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-amarelo-sol text-tinta hover:bg-amarelo-sol text-[10px] font-bold">Grátis</Badge>
              <span className="text-[11px] text-areia/70">{cat?.icon} {cat?.label}</span>
            </div>
            <h3 className="font-bold text-areia text-sm leading-snug mb-2 line-clamp-2">{course.title}</h3>
            <p className="text-xs text-areia/70 line-clamp-4">{course.description}</p>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-[11px] text-areia/60"><Building2 className="w-3 h-3" /> {course.institution}</span>
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amarelo-sol text-tinta">
              <Play className="w-4 h-4 fill-tinta ml-0.5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
