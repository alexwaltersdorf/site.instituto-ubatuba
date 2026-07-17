import { useParams, Link } from "wouter";
import { useMemo, useEffect } from "react";
import { ArrowLeft, Clock, BarChart3, ExternalLink, GraduationCap, Award, BookOpen, CheckCircle2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useSEO } from "@/components/SEOHead";
import { coursesDemo, courseCategories } from "@/data/coursesDemo";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";

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

export default function CursoDetalhe() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();

  // Try DB first, fallback to demo
  const { data: dbCourse } = trpc.courses.bySlug.useQuery(
    { slug: slug || "" },
    { retry: false, enabled: !!slug }
  );

  const demoCourse = useMemo(() => {
    return coursesDemo.find((c) => c.slug === slug);
  }, [slug]);

  const course = dbCourse || demoCourse;

  // Enrollment status
  const { data: enrollment } = trpc.courses.getEnrollment.useQuery(
    { courseId: course?.id || 0 },
    { retry: false, enabled: !!user && !!course?.id && !!dbCourse }
  );

  const enrollMutation = trpc.courses.enroll.useMutation({
    onSuccess: () => {
      toast.success("Inscrição realizada com sucesso! Agora acesse o curso na plataforma parceira.");
    },
    onError: (err) => {
      toast.error(err.message || "Erro ao realizar inscrição.");
    },
  });

  const completeMutation = trpc.courses.complete.useMutation({
    onSuccess: () => {
      toast.success("Curso marcado como concluído! Agora você pode emitir seu certificado.");
    },
    onError: (err) => {
      toast.error(err.message || "Erro ao marcar conclusão.");
    },
  });

  useSEO({
    title: course ? `${course.title} | Cursos Gratuitos | Instituto Ubatuba` : "Curso | Instituto Ubatuba",
    description: course?.description || "Curso gratuito disponível no Instituto Ubatuba.",
    canonical: `/cursos/${slug || ""}`,
  });

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Curso não encontrado</h1>
          <p className="text-muted-foreground mb-6">O curso que você procura não está disponível.</p>
          <Link href="/cursos">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para Cursos
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const categoryInfo = courseCategories.find((c) => c.value === course.category);
  const tags = course.tags ? JSON.parse(course.tags as string) : [];

  const handleEnroll = () => {
    if (!user) {
      window.location.href = getLoginUrl(`/cursos/${slug}`);
      return;
    }
    if (dbCourse) {
      enrollMutation.mutate({ courseId: course.id });
    } else {
      // Demo mode - just redirect to platform
      toast.info("Cadastre-se para acompanhar seu progresso e receber certificado.");
      window.open(course.platformUrl, "_blank");
    }
  };

  const handleComplete = () => {
    if (enrollment) {
      completeMutation.mutate({ enrollmentId: enrollment.id });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-accent/30 border-b border-border/50">
        <div className="container py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Início</Link>
            <span>/</span>
            <Link href="/cursos" className="hover:text-foreground transition-colors">Cursos</Link>
            <span>/</span>
            <span className="text-foreground font-medium truncate">{course.title}</span>
          </div>
        </div>
      </div>

      <div className="container py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Link href="/cursos">
              <Button variant="ghost" size="sm" className="mb-4 -ml-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Voltar para Cursos
              </Button>
            </Link>

            {/* Header */}
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {categoryInfo && (
                  <Badge variant="secondary">
                    {categoryInfo.icon} {categoryInfo.label}
                  </Badge>
                )}
                <Badge className={levelColors[course.level]}>
                  {levelLabels[course.level]}
                </Badge>
                {course.featured && (
                  <Badge className="bg-forest/10 text-forest border-forest/20">
                    <Award className="w-3 h-3 mr-1" /> Destaque
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-3">
                {course.title}
              </h1>
              <p className="text-lg text-muted-foreground">
                Oferecido por <span className="font-semibold text-foreground">{course.institution}</span>
                {course.platform && <> via <span className="font-medium">{course.platform}</span></>}
              </p>
            </div>

            <Separator className="my-6" />

            {/* Description */}
            <div className="prose prose-gray max-w-none mb-8">
              <h2 className="text-xl font-bold text-foreground mb-3">Sobre o Curso</h2>
              <p className="text-muted-foreground leading-relaxed text-base">
                {course.description}
              </p>
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-foreground mb-3">Temas abordados:</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag: string) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* How it works */}
            <Card className="bg-accent/30 border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-forest" />
                  Como obter o certificado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-forest/10 text-forest text-xs font-bold flex items-center justify-center">1</span>
                    <span>Cadastre-se no Instituto Ubatuba (login com Google, Microsoft ou Apple)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-forest/10 text-forest text-xs font-bold flex items-center justify-center">2</span>
                    <span>Inscreva-se neste curso e acesse a plataforma parceira</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-forest/10 text-forest text-xs font-bold flex items-center justify-center">3</span>
                    <span>Conclua todas as atividades do curso na plataforma original</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-forest/10 text-forest text-xs font-bold flex items-center justify-center">4</span>
                    <span>Marque o curso como concluído e emita seu certificado do Instituto Ubatuba</span>
                  </li>
                </ol>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Enrollment Card */}
              <Card className="shadow-lg border-forest/10">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <span className="text-3xl font-bold text-forest">Gratuito</span>
                    <p className="text-sm text-muted-foreground mt-1">Sem custo algum</p>
                  </div>

                  {enrollment?.status === "concluido" ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-lg">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="text-sm font-medium">Curso concluído!</span>
                      </div>
                      <Link href="/meus-certificados">
                        <Button className="w-full bg-forest hover:bg-forest-dark text-white">
                          <Award className="w-4 h-4 mr-2" />
                          Ver Certificado
                        </Button>
                      </Link>
                    </div>
                  ) : enrollment?.status === "em_andamento" ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-blue-700 bg-blue-50 p-3 rounded-lg">
                        <BookOpen className="w-5 h-5" />
                        <span className="text-sm font-medium">Em andamento</span>
                      </div>
                      <a href={course.platformUrl} target="_blank" rel="noopener noreferrer" className="block">
                        <Button className="w-full bg-forest hover:bg-forest-dark text-white">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Continuar na Plataforma
                        </Button>
                      </a>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleComplete}
                        disabled={completeMutation.isPending}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Marcar como Concluído
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Button
                        className="w-full bg-forest hover:bg-forest-dark text-white"
                        onClick={handleEnroll}
                        disabled={enrollMutation.isPending}
                      >
                        <GraduationCap className="w-4 h-4 mr-2" />
                        {user ? "Inscrever-se Gratuitamente" : "Cadastre-se para Inscrever"}
                      </Button>
                      <a href={course.platformUrl} target="_blank" rel="noopener noreferrer" className="block">
                        <Button variant="outline" className="w-full">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Acessar Plataforma
                        </Button>
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Course Info Card */}
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-semibold text-foreground">Informações do Curso</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" /> Instituição
                      </span>
                      <span className="font-medium text-foreground">{course.institution}</span>
                    </div>
                    {course.platform && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <BookOpen className="w-4 h-4" /> Plataforma
                        </span>
                        <span className="font-medium text-foreground">{course.platform}</span>
                      </div>
                    )}
                    {course.duration && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <Clock className="w-4 h-4" /> Duração
                        </span>
                        <span className="font-medium text-foreground">{course.duration}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" /> Nível
                      </span>
                      <Badge className={`text-xs ${levelColors[course.level]}`}>
                        {levelLabels[course.level]}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Award className="w-4 h-4" /> Certificado
                      </span>
                      <span className="font-medium text-green-700">Sim (Instituto Ubatuba)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
