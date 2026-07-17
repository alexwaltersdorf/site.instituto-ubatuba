import { useParams, Link } from "wouter";
import { GraduationCap, Clock, Building2, ExternalLink, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSEO } from "@/components/SEOHead";
import { InstitutionSeal } from "@/components/InstitutionLogo";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { coursesDemo, CATEGORIES } from "@/data/coursesDemo";
import { toast } from "sonner";

export default function CursoDetalhe() {
  const { slug } = useParams<{ slug: string }>();
  const { user, loading: authLoading } = useAuth();

  const { data: dbCourse, isLoading } = trpc.courses.bySlug.useQuery({ slug: slug! }, { retry: false, enabled: !!slug });
  const course = dbCourse ?? coursesDemo.find((c) => c.slug === slug);

  const { data: enrollment, refetch: refetchEnrollment } = trpc.courses.checkEnrollment.useQuery(
    { courseId: course?.id ?? 0 },
    { enabled: !!user && !!course }
  );

  const enrollMutation = trpc.courses.enroll.useMutation({
    onSuccess: (data) => {
      toast.success("Inscrição realizada! Redirecionando para a plataforma do curso...");
      refetchEnrollment();
      if (data.platformUrl) {
        setTimeout(() => {
          window.open(data.platformUrl, "_blank");
        }, 800);
      }
    },
    onError: (err) => {
      toast.error(err.message || "Erro ao realizar inscrição.");
    },
  });

  useSEO({
    title: course ? `${course.title} | Cursos Gratuitos` : "Curso | Instituto Ubatuba",
    description: course?.description ?? "Curso gratuito disponível no Instituto Ubatuba.",
    canonical: `/cursos/${slug}`,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-forest" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <GraduationCap className="w-16 h-16 text-muted-foreground/40" />
        <h1 className="text-2xl font-bold text-forest-dark">Curso não encontrado</h1>
        <Link href="/cursos"><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Voltar aos cursos</Button></Link>
      </div>
    );
  }

  const category = CATEGORIES.find((c) => c.id === course.category);
  const tags: string[] = course.tags ? JSON.parse(course.tags) : [];
  const isEnrolled = !!enrollment;

  const handleEnroll = () => {
    if (!user) {
      window.location.href = getLoginUrl(`/cursos/${slug}`);
      return;
    }
    enrollMutation.mutate({ courseId: course.id });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/50 to-white">
      <div className="pt-28 pb-20 px-4">
        <div className="container max-w-4xl">
          <Link href="/cursos">
            <span className="inline-flex items-center gap-1 text-sm text-forest hover:underline mb-6 cursor-pointer">
              <ArrowLeft className="w-4 h-4" /> Voltar aos cursos
            </span>
          </Link>

          <div className="grid lg:grid-cols-3 gap-8 mt-4">
            <div className="lg:col-span-2">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">{category?.icon} {category?.label}</Badge>
                <Badge variant="outline" className="capitalize">
                  {course.level === "iniciante" ? "Iniciante" : course.level === "intermediario" ? "Intermediário" : "Avançado"}
                </Badge>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-forest-dark mb-4">{course.title}</h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                <span className="flex items-center gap-2 text-base">
                  <InstitutionSeal institution={course.institution} logo={course.institutionLogo} className="w-9 h-9" />
                  <span className="font-medium text-foreground/80">{course.institution}</span>
                </span>
                {course.duration && <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {course.duration}</span>}
                {course.platform && <span className="flex items-center gap-1.5"><ExternalLink className="w-4 h-4" /> {course.platform}</span>}
              </div>

              <div className="prose prose-green max-w-none mb-8">
                <p className="text-base text-foreground/80 leading-relaxed">{course.description}</p>
              </div>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {tags.map((tag) => (<Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>))}
                </div>
              )}

              <div className="bg-accent/40 rounded-xl p-6 mb-8">
                <h3 className="font-semibold text-forest-dark mb-2">Sobre a Instituição</h3>
                <p className="text-sm text-muted-foreground">
                  Este curso é oferecido por <strong>{course.institution}</strong>
                  {course.platform && <> através da plataforma <strong>{course.platform}</strong></>}.
                  O Instituto Ubatuba Santuário Ecológico atua como facilitador, conectando você a oportunidades educacionais gratuitas de excelência.
                </p>
              </div>

              <div className="bg-forest/5 border border-forest/20 rounded-xl p-6">
                <h3 className="font-semibold text-forest-dark mb-2 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" /> Certificado de Conclusão
                </h3>
                <p className="text-sm text-muted-foreground">
                  Ao concluir este curso na plataforma da instituição, você poderá solicitar um certificado de conclusão emitido pelo Instituto Ubatuba Santuário Ecológico, validando sua participação e dedicação ao aprendizado.
                </p>
              </div>
            </div>

            {/* Sidebar - Enrollment Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 bg-white rounded-xl border border-border/50 shadow-sm p-6">
                <div className="text-center mb-6">
                  <p className="text-3xl font-bold text-forest italic mb-1">Gratuito</p>
                  <p className="text-sm text-muted-foreground">Sem custo algum</p>
                </div>

                {isEnrolled ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2 text-forest font-medium py-2">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Inscrito</span>
                    </div>
                    <Button className="w-full bg-forest hover:bg-forest-dark text-white" onClick={() => window.open(course.platformUrl, "_blank")}>
                      <ExternalLink className="w-4 h-4 mr-2" /> Acessar Plataforma
                    </Button>
                    <Link href="/meus-certificados">
                      <Button variant="outline" className="w-full mt-2">
                        <GraduationCap className="w-4 h-4 mr-2" /> Meus Certificados
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Button className="w-full bg-forest hover:bg-forest-dark text-white h-12 text-base" onClick={handleEnroll} disabled={enrollMutation.isPending || authLoading}>
                      {enrollMutation.isPending ? (<Loader2 className="w-4 h-4 mr-2 animate-spin" />) : (<GraduationCap className="w-4 h-4 mr-2" />)}
                      Inscrever-se Gratuitamente
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => window.open(course.platformUrl, "_blank")}>
                      <ExternalLink className="w-4 h-4 mr-2" /> Acessar Plataforma
                    </Button>
                    {!user && (
                      <p className="text-xs text-center text-muted-foreground">Faça login para se inscrever e acompanhar seu progresso</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
