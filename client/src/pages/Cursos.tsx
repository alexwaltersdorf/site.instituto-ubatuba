import { useState, useMemo, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Search, GraduationCap, Clock, Building2, ChevronLeft, ChevronRight, Play, Info, X, Loader2, ExternalLink, PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSEO } from "@/components/SEOHead";
import { InstitutionSeal } from "@/components/InstitutionLogo";
import { trpc } from "@/lib/trpc";
import { coursesDemo, CATEGORIES, type CourseDemo } from "@/data/coursesDemo";
import { INSTITUICOES_PARCEIRAS, GRUPOS, type InstituicaoParceira } from "@/data/instituicoes";
import {
  CadastroAlunoDialog,
  loadStoredStudent,
  type StoredStudent,
} from "@/components/CadastroAlunoDialog";

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
  const [selectedInstitution, setSelectedInstitution] = useState<string>("all");
  const [page, setPage] = useState(1);
  const resultsRef = useRef<HTMLDivElement>(null);

  /* Saída para o catálogo de uma instituição parceira */
  const [student, setStudent] = useState<StoredStudent | null>(loadStoredStudent);
  const [showCadastro, setShowCadastro] = useState(false);
  const [pendente, setPendente] = useState<InstituicaoParceira | null>(null);
  const logVisit = trpc.students.visitInstitution.useMutation();

  // Debounce da busca (evita uma consulta por tecla)
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput.trim()), 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Volta para a 1ª página quando um filtro muda
  useEffect(() => {
    setPage(1);
  }, [search, selectedCategory, selectedLevel, selectedInstitution]);

  const browsing =
    search === "" &&
    selectedCategory === "all" &&
    selectedLevel === "all" &&
    selectedInstitution === "all";

  const listQuery = trpc.courses.list.useQuery(
    {
      search: search || undefined,
      category: selectedCategory === "all" ? undefined : selectedCategory,
      level: selectedLevel === "all" ? undefined : selectedLevel,
      institution: selectedInstitution === "all" ? undefined : selectedInstitution,
      page,
      pageSize: PAGE_SIZE,
    },
    { retry: false, placeholderData: (prev) => prev }
  );
  const featuredQuery = trpc.courses.featured.useQuery(undefined, { retry: false });
  const institutionsQuery = trpc.courses.institutions.useQuery(undefined, { retry: false });

  /**
   * Lista do filtro de instituições. Sem banco, cai no fallback local para o
   * seletor não aparecer vazio — mesma estratégia da grade de cursos.
   */
  const institutions = useMemo(() => {
    const fromDb = institutionsQuery.data ?? [];
    if (fromDb.length > 0) return fromDb;
    const cnt = new Map<string, number>();
    for (const c of coursesDemo) cnt.set(c.institution, (cnt.get(c.institution) ?? 0) + 1);
    return [...cnt.entries()]
      .map(([institution, count]) => ({ institution, count }))
      .sort((a, b) => b.count - a.count || a.institution.localeCompare(b.institution));
  }, [institutionsQuery.data]);

  // Fallback local (coursesDemo) caso o banco esteja indisponível
  const demoPage = useMemo(() => {
    const q = norm(search);
    const arr = coursesDemo.filter((c) => {
      const okCat = selectedCategory === "all" || c.category === selectedCategory;
      const okLvl = selectedLevel === "all" || c.level === selectedLevel;
      const okInst = selectedInstitution === "all" || c.institution === selectedInstitution;
      const okS = q === "" || norm(`${c.title} ${c.institution} ${c.description ?? ""}`).includes(q);
      return okCat && okLvl && okInst && okS;
    });
    const start = (page - 1) * PAGE_SIZE;
    return { items: arr.slice(start, start + PAGE_SIZE), total: arr.length };
  }, [search, selectedCategory, selectedLevel, selectedInstitution, page]);

  const data = listQuery.data;
  /**
   * Banco vazio ou indisponível: a consulta de instituições volta sem nenhuma
   * linha. Esse é o sinal certo — antes o fallback só valia na navegação sem
   * filtro, então qualquer filtro (categoria, nível e agora instituição)
   * esvaziava a grade em ambiente sem banco, mesmo com os cursos locais à mão.
   */
  const bancoVazio = institutionsQuery.isSuccess && (institutionsQuery.data?.length ?? 0) === 0;
  const demoNeeded = bancoVazio || (!!data && data.total === 0 && browsing);
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

  /** Registra a saída e abre o catálogo da instituição numa nova aba. */
  function irParaInstituicao(inst: InstituicaoParceira, profile: StoredStudent) {
    logVisit.mutate({ studentId: profile.id, institutionSlug: inst.slug });
    setPendente(null);
    const win = window.open(inst.url, "_blank", "noopener");
    // Bloqueador de pop-up: segue na mesma aba em vez de não ir a lugar nenhum.
    if (!win) window.location.href = inst.url;
  }

  /**
   * Primeiro clique neste dispositivo abre o cadastro; depois dele (e em todos
   * os acessos seguintes) o aluno vai direto ao catálogo da instituição.
   */
  function abrirInstituicao(inst: InstituicaoParceira) {
    setPendente(inst);
    if (student) irParaInstituicao(inst, student);
    else setShowCadastro(true);
  }

  return (
    <div className="min-h-screen bg-areia text-tinta">
      {browsing && featured.length > 0 && <HeroBillboard courses={featured} />}

      {/* Barra de busca e filtros */}
      <section className={browsing ? "px-4 pb-2 -mt-6 relative z-10" : "px-4 pt-28 pb-2"}>
        <div className="container max-w-7xl">
          <div className="flex flex-wrap items-center gap-3 bg-white border border-tinta/10 rounded-xl p-3 shadow-[0_1px_3px_rgba(18,32,25,0.05)]">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-tinta/40" />
              <Input
                placeholder="Buscar por curso, instituição ou tema..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-11 h-11 rounded-lg bg-areia/40 border-tinta/10 text-tinta placeholder:text-tinta/40 focus-visible:ring-azul-oceano"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[190px] h-11 rounded-lg bg-areia/40 border-tinta/10 text-tinta"><SelectValue placeholder="Categoria" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {CATEGORIES.map((cat) => (<SelectItem key={cat.id} value={cat.id}>{cat.icon} {cat.label}</SelectItem>))}
              </SelectContent>
            </Select>
            <Select value={selectedInstitution} onValueChange={setSelectedInstitution}>
              <SelectTrigger className="w-[230px] h-11 rounded-lg bg-areia/40 border-tinta/10 text-tinta">
                <SelectValue placeholder="Instituição" />
              </SelectTrigger>
              <SelectContent className="max-h-[320px]">
                <SelectItem value="all">Todas as instituições</SelectItem>
                {institutions.map((inst) => (
                  <SelectItem key={inst.institution} value={inst.institution}>
                    {inst.institution} ({inst.count.toLocaleString("pt-BR")})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-[160px] h-11 rounded-lg bg-areia/40 border-tinta/10 text-tinta"><SelectValue placeholder="Nível" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os níveis</SelectItem>
                {LEVELS.map((lvl) => (<SelectItem key={lvl.id} value={lvl.id}>{lvl.label}</SelectItem>))}
              </SelectContent>
            </Select>
            {!browsing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setSelectedCategory("all"); setSelectedLevel("all"); setSelectedInstitution("all"); setSearchInput(""); setSearch(""); }}
                className="text-tinta/60 hover:text-tinta hover:bg-tinta/5"
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
          <p className="text-sm text-tinta/60 mb-6">
            {total.toLocaleString("pt-BR")} curso{total !== 1 ? "s" : ""} gratuito{total !== 1 ? "s" : ""}
            {!browsing && " encontrado" + (total !== 1 ? "s" : "")}
          </p>

          {listQuery.isLoading && !data ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-8 h-8 animate-spin text-azul-oceano" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20">
              <GraduationCap className="w-12 h-12 mx-auto text-tinta/25 mb-4" />
              <p className="text-tinta/60">Nenhum curso encontrado com os filtros selecionados.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {items.map((course) => (<PosterCard key={course.id} course={course} />))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-12">
                  <Button
                    variant="outline"
                    disabled={page <= 1}
                    onClick={() => goToPage(page - 1)}
                    className="border-tinta/15 bg-white text-tinta hover:bg-tinta/5 hover:text-tinta rounded-lg disabled:opacity-40"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" /> Anterior
                  </Button>
                  <span className="text-sm text-tinta/60 tabular-nums">
                    Página {page} de {totalPages.toLocaleString("pt-BR")}
                  </span>
                  <Button
                    variant="outline"
                    disabled={page >= totalPages}
                    onClick={() => goToPage(page + 1)}
                    className="border-tinta/15 bg-white text-tinta hover:bg-tinta/5 hover:text-tinta rounded-lg disabled:opacity-40"
                  >
                    Próxima <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Instituições parceiras — cada uma leva ao catálogo gratuito de origem */}
      <section className="px-4 py-16 border-t border-tinta/10 mt-4">
        <div className="container max-w-6xl text-center">
          <h2 className="text-lg font-semibold text-tinta mb-2">Instituições Parceiras</h2>
          <p className="text-sm text-tinta/55 mb-10">
            Clique na instituição para abrir o catálogo gratuito dela. No primeiro acesso
            pedimos um cadastro rápido — depois disso, vai direto.
          </p>

          {GRUPOS.map((grupo) => {
            const doGrupo = INSTITUICOES_PARCEIRAS.filter((i) => i.grupo === grupo.id);
            if (doGrupo.length === 0) return null;
            return (
              <div key={grupo.id} className="mb-9 last:mb-0">
                <p className="text-[11px] uppercase tracking-widest text-tinta/40 mb-4">{grupo.label}</p>
                <div className="flex flex-wrap justify-center gap-3 text-sm">
                  {doGrupo.map((inst) => (
                    <button
                      key={inst.slug}
                      type="button"
                      onClick={() => abrirInstituicao(inst)}
                      title={inst.ressalva ?? `Abrir o catálogo gratuito — ${inst.nome}`}
                      className="group inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-tinta/10 hover:border-azul-oceano hover:text-azul-oceano text-tinta/75 rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azul-oceano focus-visible:ring-offset-2"
                    >
                      {inst.nome}
                      <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-70 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <CadastroAlunoDialog
        open={showCadastro}
        onOpenChange={setShowCadastro}
        destino={pendente?.nome ?? "a instituição"}
        onRegistered={(profile) => {
          setStudent(profile);
          if (pendente) irParaInstituicao(pendente, profile);
        }}
      />
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
/**
 * Cartão enxuto, no padrão de catálogo de documentação técnica: a informação
 * vem primeiro e o enfeite some. O aluno varre a lista lendo título, duração e
 * instituição — pôster colorido atrapalhava essa leitura quando a grade passou
 * de mil cursos.
 */
function PosterCard({ course }: { course: CourseDemo }) {
  const cat = categoryMeta(course.category);

  return (
    <Link href={`/cursos/${course.slug}`}>
      <article className="group h-full flex flex-col bg-white border border-tinta/10 rounded-lg p-5 cursor-pointer transition-all duration-200 hover:border-azul-oceano/50 hover:shadow-[0_2px_12px_rgba(18,32,25,0.08)]">
        <div className="flex items-start justify-between gap-3 mb-3">
          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-tinta/45">
            {cat?.label ?? "Curso"}
          </span>
          <InstitutionSeal
            institution={course.institution}
            logo={course.institutionLogo}
            className="w-8 h-8 shrink-0 opacity-90"
          />
        </div>

        <h3 className="font-semibold text-[15px] leading-snug text-azul-oceano group-hover:underline decoration-azul-oceano/40 underline-offset-2 line-clamp-3 mb-3">
          {course.title}
        </h3>

        {/* Metadados seguem o título; só a ação é empurrada para o rodapé, o
            que mantém a linha "Inscrever-se" alinhada entre cartões vizinhos. */}
        <div className="space-y-1.5">
          {course.duration && (
            <p className="flex items-center gap-1.5 text-xs text-tinta/60">
              <Clock className="w-3.5 h-3.5 shrink-0" /> {course.duration}
            </p>
          )}
          <p className="text-xs text-tinta/55 leading-relaxed">
            <span className="truncate">{course.institution}</span>
            <span className="mx-1.5 text-tinta/25">•</span>
            {LEVEL_LABEL[course.level]}
          </p>
        </div>

        <div className="mt-auto pt-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-azul-oceano">
            <PlusCircle className="w-3.5 h-3.5" /> Inscrever-se
          </span>
        </div>
      </article>
    </Link>
  );
}
