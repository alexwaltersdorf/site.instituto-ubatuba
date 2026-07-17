import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Search, GraduationCap, Clock, Building2, Filter } from "lucide-react";
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

  const filteredCourses = useMemo(() => {
    return allCourses.filter((course) => {
      const matchesSearch = search === "" ||
        course.title.toLowerCase().includes(search.toLowerCase()) ||
        course.institution.toLowerCase().includes(search.toLowerCase()) ||
        (course.description ?? "").toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
      const matchesLevel = selectedLevel === "all" || course.level === selectedLevel;
      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [allCourses, search, selectedCategory, selectedLevel]);

  const featuredCourses = useMemo(() => allCourses.filter((c) => c.featured), [allCourses]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/50 to-white">
      <section className="pt-32 pb-16 px-4">
        <div className="container max-w-5xl text-center">
          <Badge variant="outline" className="mb-4 text-forest border-forest/30 bg-forest/5">
            <GraduationCap className="w-3.5 h-3.5 mr-1" /> 100% Gratuito
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-forest-dark mb-4">Cursos Gratuitos</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Acesse cursos de universidades de excelência como Harvard, MIT, USP e FGV. Educação de qualidade para todos, independente de classe social.
          </p>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input placeholder="Buscar cursos por nome, instituição ou tema..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-12 h-12 text-base rounded-full border-border/60 shadow-sm" />
          </div>
        </div>
      </section>

      <section className="pb-8 px-4">
        <div className="container max-w-6xl">
          <div className="flex flex-wrap items-center gap-3">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Categoria" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {CATEGORIES.map((cat) => (<SelectItem key={cat.id} value={cat.id}>{cat.icon} {cat.label}</SelectItem>))}
              </SelectContent>
            </Select>
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="Nível" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os níveis</SelectItem>
                {LEVELS.map((lvl) => (<SelectItem key={lvl.id} value={lvl.id}>{lvl.label}</SelectItem>))}
              </SelectContent>
            </Select>
            {(selectedCategory !== "all" || selectedLevel !== "all" || search) && (
              <Button variant="ghost" size="sm" onClick={() => { setSelectedCategory("all"); setSelectedLevel("all"); setSearch(""); }}>Limpar filtros</Button>
            )}
            <span className="ml-auto text-sm text-muted-foreground">{filteredCourses.length} curso{filteredCourses.length !== 1 ? "s" : ""}</span>
          </div>
        </div>
      </section>

      {selectedCategory === "all" && selectedLevel === "all" && !search && (
        <section className="pb-12 px-4">
          <div className="container max-w-6xl">
            <h2 className="text-2xl font-bold text-forest-dark mb-6">Destaques</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredCourses.slice(0, 6).map((course) => (<CourseCard key={course.id} course={course} />))}
            </div>
          </div>
        </section>
      )}

      <section className="pb-20 px-4">
        <div className="container max-w-6xl">
          {selectedCategory === "all" && selectedLevel === "all" && !search && (
            <h2 className="text-2xl font-bold text-forest-dark mb-6">Todos os Cursos</h2>
          )}
          {filteredCourses.length === 0 ? (
            <div className="text-center py-16">
              <GraduationCap className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">Nenhum curso encontrado com os filtros selecionados.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCourses.map((course) => (<CourseCard key={course.id} course={course} />))}
            </div>
          )}
        </div>
      </section>

      <section className="pb-20 px-4 border-t border-border/40 pt-12">
        <div className="container max-w-5xl text-center">
          <h2 className="text-xl font-semibold text-forest-dark mb-2">Instituições Parceiras</h2>
          <p className="text-sm text-muted-foreground mb-8">Cursos oferecidos por universidades e plataformas reconhecidas</p>
          <div className="flex flex-wrap justify-center gap-3 text-sm text-muted-foreground">
            {["Harvard", "MIT", "Stanford", "USP", "UNICAMP", "FGV", "ENAP", "Fiocruz", "SENAI", "Fundação Bradesco", "Kultivi", "MEC", "Deutsche Welle", "British Council"].map((name) => (
              <span key={name} className="px-3 py-1.5 bg-accent/60 rounded-full font-medium">{name}</span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function CourseCard({ course }: { course: CourseDemo }) {
  const category = CATEGORIES.find((c) => c.id === course.category);
  return (
    <Link href={`/cursos/${course.slug}`}>
      <div className="group bg-white rounded-xl border border-border/50 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden h-full flex flex-col cursor-pointer">
        <div className="h-2 bg-gradient-to-r from-forest to-forest-dark" />
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-2 mb-3">
            <Badge variant="secondary" className="text-xs shrink-0">{category?.icon} {category?.label}</Badge>
            <Badge variant="outline" className="text-xs capitalize">{course.level === "iniciante" ? "Iniciante" : course.level === "intermediario" ? "Intermediário" : "Avançado"}</Badge>
          </div>
          <h3 className="font-semibold text-forest-dark group-hover:text-forest transition-colors mb-2 line-clamp-2">{course.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">{course.description}</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-auto pt-3 border-t border-border/40">
            <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> {course.institution}</span>
            {course.duration && (<span className="flex items-center gap-1 ml-auto"><Clock className="w-3.5 h-3.5" /> {course.duration}</span>)}
          </div>
        </div>
      </div>
    </Link>
  );
}
