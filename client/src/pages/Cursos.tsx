import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Search, GraduationCap, Clock, BarChart3, ExternalLink, BookOpen, Award, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSEO } from "@/components/SEOHead";
import { coursesDemo, courseCategories, partnerInstitutions } from "@/data/coursesDemo";
import { trpc } from "@/lib/trpc";

const levelLabels: Record<string, string> = {
  iniciante: "Iniciante",
  intermediario: "Intermediário",
  avancado: "Avançado",
};

const levelColors: Record<string, string> = {
  iniciante: "bg-green-100 text-green-800",
  intermediario: "bg-amber-100 text-amber-800",
  avancado: "bg-red-100 text-red-800",
};

export default function Cursos() {
  useSEO({
    title: "Cursos Gratuitos | Instituto Ubatuba",
    description: "Acesse cursos gratuitos de universidades como Harvard, MIT, USP, FGV e plataformas governamentais. Educação de qualidade para todos, com certificado do Instituto Ubatuba.",
    canonical: "/cursos",
  });

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [level, setLevel] = useState<string>("all");

  // Try to fetch from DB, fallback to demo data
  const { data: dbCourses } = trpc.courses.list.useQuery(
    category !== "all" ? { category } : undefined,
    { retry: false }
  );

  const courses = dbCourses && dbCourses.length > 0 ? dbCourses : coursesDemo;

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesCategory = category === "all" || course.category === category;
      const matchesLevel = level === "all" || course.level === level;
      const matchesSearch =
        search === "" ||
        course.title.toLowerCase().includes(search.toLowerCase()) ||
        course.institution.toLowerCase().includes(search.toLowerCase()) ||
        course.description.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesLevel && matchesSearch;
    });
  }, [courses, category, level, search]);

  const featuredCourses = useMemo(() => {
    return courses.filter((c) => c.featured);
  }, [courses]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-forest via-forest-dark to-emerald-900 text-white py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl" />
        </div>
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4 bg-white/15 text-white border-white/30 hover:bg-white/20">
              <GraduationCap className="w-3.5 h-3.5 mr-1.5" />
              100% Gratuito
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              Educação de Qualidade para Todos
            </h1>
            <p className="text-lg lg:text-xl text-white/85 leading-relaxed mb-8">
              Acesse cursos gratuitos das melhores universidades do mundo — Harvard, MIT, USP, FGV
              e plataformas governamentais. Ao concluir, receba um certificado emitido pelo Instituto Ubatuba.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-white/70">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" /> {courses.length} cursos disponíveis
              </span>
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4" /> Certificado gratuito
              </span>
              <span className="flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4" /> {partnerInstitutions.length} instituições parceiras
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="container py-8 -mt-8 relative z-20">
        <div className="bg-white rounded-xl shadow-lg border border-border/50 p-4 lg:p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar cursos por nome, instituição ou tema..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-3">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {courseCategories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger className="w-[160px]">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Nível" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os níveis</SelectItem>
                  <SelectItem value="iniciante">Iniciante</SelectItem>
                  <SelectItem value="intermediario">Intermediário</SelectItem>
                  <SelectItem value="avancado">Avançado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      {category === "all" && level === "all" && search === "" && featuredCourses.length > 0 && (
        <section className="container pb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Award className="w-6 h-6 text-forest" />
            Cursos em Destaque
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.slice(0, 6).map((course) => (
              <CourseCard key={course.id} course={course} featured />
            ))}
          </div>
        </section>
      )}

      {/* All Courses */}
      <section className="container pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">
            {category === "all" && level === "all" && search === ""
              ? "Todos os Cursos"
              : `${filteredCourses.length} curso${filteredCourses.length !== 1 ? "s" : ""} encontrado${filteredCourses.length !== 1 ? "s" : ""}`}
          </h2>
        </div>

        {filteredCourses.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Nenhum curso encontrado</h3>
            <p className="text-muted-foreground">Tente ajustar os filtros ou buscar por outro termo.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </section>

      {/* Partner Institutions */}
      <section className="bg-accent/30 py-16">
        <div className="container">
          <h2 className="text-2xl font-bold text-center text-foreground mb-3">
            Instituições Parceiras
          </h2>
          <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
            Cursos selecionados das melhores universidades e plataformas educacionais do Brasil e do mundo.
          </p>
          <div className="flex flex-wrap justify-center gap-4 lg:gap-6">
            {partnerInstitutions.map((inst) => (
              <div
                key={inst.name}
                className="bg-white px-4 py-2.5 rounded-lg shadow-sm border border-border/50 text-sm font-medium text-foreground/80 hover:shadow-md transition-shadow"
              >
                {inst.name}
                <span className="ml-1.5 text-xs text-muted-foreground">({inst.country})</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Como Funciona?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-forest/10 flex items-center justify-center mb-3">
                <span className="text-forest font-bold text-lg">1</span>
              </div>
              <h3 className="font-semibold text-foreground mb-1">Cadastre-se</h3>
              <p className="text-sm text-muted-foreground">Crie sua conta gratuitamente no Instituto Ubatuba</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-forest/10 flex items-center justify-center mb-3">
                <span className="text-forest font-bold text-lg">2</span>
              </div>
              <h3 className="font-semibold text-foreground mb-1">Estude</h3>
              <p className="text-sm text-muted-foreground">Acesse o curso na plataforma parceira e conclua</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-forest/10 flex items-center justify-center mb-3">
                <span className="text-forest font-bold text-lg">3</span>
              </div>
              <h3 className="font-semibold text-foreground mb-1">Certifique-se</h3>
              <p className="text-sm text-muted-foreground">Receba seu certificado emitido pelo Instituto Ubatuba</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function CourseCard({ course, featured }: { course: typeof coursesDemo[0]; featured?: boolean }) {
  const categoryInfo = courseCategories.find((c) => c.value === course.category);

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 overflow-hidden ${featured ? "ring-1 ring-forest/20" : ""}`}>
      <CardContent className="p-0">
        {/* Card Header with category color */}
        <div className="h-2 bg-gradient-to-r from-forest to-emerald-500" />
        <div className="p-5">
          {/* Institution & Platform */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-forest uppercase tracking-wide">
              {course.institution}
            </span>
            {course.platform && (
              <Badge variant="outline" className="text-xs">
                {course.platform}
              </Badge>
            )}
          </div>

          {/* Title */}
          <h3 className="font-bold text-foreground text-lg mb-2 line-clamp-2 group-hover:text-forest transition-colors">
            {course.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
            {course.description}
          </p>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {categoryInfo && (
              <Badge variant="secondary" className="text-xs">
                {categoryInfo.icon} {categoryInfo.label}
              </Badge>
            )}
            <Badge className={`text-xs ${levelColors[course.level]}`}>
              {levelLabels[course.level]}
            </Badge>
            {course.duration && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" /> {course.duration}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Link href={`/cursos/${course.slug}`} className="flex-1">
              <Button variant="outline" className="w-full text-sm" size="sm">
                <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                Ver Detalhes
              </Button>
            </Link>
            <a href={course.platformUrl} target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="bg-forest hover:bg-forest-dark text-white text-sm">
                <ExternalLink className="w-3.5 h-3.5" />
              </Button>
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
