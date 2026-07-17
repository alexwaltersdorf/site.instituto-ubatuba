import { Link } from "wouter";
import { Award, BookOpen, ExternalLink, GraduationCap, Download, ArrowLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSEO } from "@/components/SEOHead";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

const statusLabels: Record<string, string> = {
  em_andamento: "Em Andamento",
  concluido: "Concluído",
};

const statusColors: Record<string, string> = {
  em_andamento: "bg-blue-100 text-blue-800",
  concluido: "bg-green-100 text-green-800",
};

export default function MeusCertificados() {
  useSEO({
    title: "Meus Cursos e Certificados | Instituto Ubatuba",
    description: "Acompanhe seus cursos em andamento e certificados emitidos pelo Instituto Ubatuba.",
    canonical: "/meus-certificados",
  });

  const { user } = useAuth();

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <GraduationCap className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Acesso Restrito</h1>
          <p className="text-muted-foreground mb-6">
            Faça login para ver seus cursos e certificados.
          </p>
          <a href={getLoginUrl("/meus-certificados")}>
            <Button className="bg-forest hover:bg-forest-dark text-white">
              Fazer Login
            </Button>
          </a>
        </div>
      </div>
    );
  }

  const { data: enrollments, isLoading: loadingEnrollments } = trpc.courses.myEnrollments.useQuery(
    undefined,
    { retry: false }
  );

  const { data: certificates, isLoading: loadingCertificates } = trpc.certificates.myCertificates.useQuery(
    undefined,
    { retry: false }
  );

  const activeEnrollments = enrollments?.filter((e) => e.enrollment.status === "em_andamento") || [];
  const completedEnrollments = enrollments?.filter((e) => e.enrollment.status === "concluido") || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-forest via-forest-dark to-emerald-900 text-white py-12 lg:py-16">
        <div className="container">
          <Link href="/cursos">
            <Button variant="ghost" size="sm" className="mb-4 -ml-2 text-white/70 hover:text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Voltar para Cursos
            </Button>
          </Link>
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">Meus Cursos e Certificados</h1>
          <p className="text-white/80 text-lg">
            Acompanhe seu progresso e acesse seus certificados emitidos.
          </p>
          <div className="flex gap-6 mt-6 text-sm text-white/70">
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" /> {enrollments?.length || 0} cursos
            </span>
            <span className="flex items-center gap-1.5">
              <Award className="w-4 h-4" /> {certificates?.length || 0} certificados
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container py-8 lg:py-12">
        <Tabs defaultValue="cursos" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="cursos" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Meus Cursos ({enrollments?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="certificados" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Certificados ({certificates?.length || 0})
            </TabsTrigger>
          </TabsList>

          {/* Cursos Tab */}
          <TabsContent value="cursos">
            {loadingEnrollments ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-muted rounded w-3/4 mb-3" />
                      <div className="h-3 bg-muted rounded w-1/2 mb-2" />
                      <div className="h-3 bg-muted rounded w-1/4" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : !enrollments || enrollments.length === 0 ? (
              <EmptyState
                icon={<BookOpen className="w-16 h-16" />}
                title="Nenhum curso iniciado"
                description="Explore nosso catálogo de cursos gratuitos e comece a aprender hoje!"
                actionLabel="Explorar Cursos"
                actionHref="/cursos"
              />
            ) : (
              <div className="space-y-8">
                {/* Active */}
                {activeEnrollments.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      Em Andamento ({activeEnrollments.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activeEnrollments.map((item) => (
                        <EnrollmentCard key={item.enrollment.id} enrollment={item} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Completed */}
                {completedEnrollments.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5 text-green-600" />
                      Concluídos ({completedEnrollments.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {completedEnrollments.map((item) => (
                        <EnrollmentCard key={item.enrollment.id} enrollment={item} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* Certificados Tab */}
          <TabsContent value="certificados">
            {loadingCertificates ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-muted rounded w-3/4 mb-3" />
                      <div className="h-3 bg-muted rounded w-1/2 mb-2" />
                      <div className="h-3 bg-muted rounded w-1/4" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : !certificates || certificates.length === 0 ? (
              <EmptyState
                icon={<Award className="w-16 h-16" />}
                title="Nenhum certificado emitido"
                description="Conclua um curso para receber seu certificado do Instituto Ubatuba."
                actionLabel="Ver Meus Cursos"
                actionHref="/cursos"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certificates.map((cert) => (
                  <CertificateCard key={cert.id} certificate={cert} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}

function EnrollmentCard({ enrollment: item }: { enrollment: { enrollment: any; course: any } }) {
  const { enrollment, course } = item;
  const utils = trpc.useUtils();

  const issueCertMutation = trpc.certificates.issue.useMutation({
    onSuccess: () => {
      utils.certificates.myCertificates.invalidate();
      utils.courses.myEnrollments.invalidate();
    },
  });

  const handleIssueCertificate = () => {
    issueCertMutation.mutate({ enrollmentId: enrollment.id, courseId: enrollment.courseId });
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-foreground line-clamp-1 flex-1 mr-2">
            {course?.title || "Curso"}
          </h3>
          <Badge className={`text-xs flex-shrink-0 ${statusColors[enrollment.status] || "bg-gray-100 text-gray-800"}`}>
            {statusLabels[enrollment.status] || enrollment.status}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          {course?.institution || "Instituição parceira"}
        </p>
        <div className="flex flex-wrap gap-2">
          {course?.slug && (
            <Link href={`/cursos/${course.slug}`}>
              <Button variant="outline" size="sm" className="text-xs">
                <BookOpen className="w-3 h-3 mr-1" />
                Ver Curso
              </Button>
            </Link>
          )}
          {course?.platformUrl && (
            <a href={course.platformUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="text-xs">
                <ExternalLink className="w-3 h-3 mr-1" />
                Plataforma
              </Button>
            </a>
          )}
          {enrollment.status === "concluido" && !enrollment.certificateId && (
            <Button
              size="sm"
              className="text-xs bg-forest hover:bg-forest-dark text-white"
              onClick={handleIssueCertificate}
              disabled={issueCertMutation.isPending}
            >
              <Award className="w-3 h-3 mr-1" />
              {issueCertMutation.isPending ? "Emitindo..." : "Emitir Certificado"}
            </Button>
          )}
          {enrollment.certificateId && (
            <Link href="/meus-certificados">
              <Button size="sm" variant="outline" className="text-xs text-forest border-forest/30">
                <Award className="w-3 h-3 mr-1" />
                Ver Certificado
              </Button>
            </Link>
          )}
        </div>
        {issueCertMutation.isSuccess && (
          <p className="text-xs text-green-700 mt-2">Certificado emitido com sucesso!</p>
        )}
        {issueCertMutation.isError && (
          <p className="text-xs text-red-600 mt-2">{issueCertMutation.error?.message || "Erro ao emitir certificado."}</p>
        )}
      </CardContent>
    </Card>
  );
}

function CertificateCard({ certificate }: { certificate: any }) {
  return (
    <Card className="hover:shadow-md transition-shadow border-forest/10">
      <CardContent className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-forest/10 flex items-center justify-center flex-shrink-0">
            <Award className="w-5 h-5 text-forest" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground line-clamp-1">
              {certificate.courseName || "Certificado"}
            </h3>
            <p className="text-xs text-muted-foreground">
              Emitido em {new Date(certificate.issuedAt).toLocaleDateString("pt-BR")}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-mono">
            Código: {certificate.code}
          </span>
          <Link href={`/certificado/${certificate.code}`}>
            <Button size="sm" className="bg-forest hover:bg-forest-dark text-white text-xs">
              <Download className="w-3 h-3 mr-1" />
              Visualizar
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
}) {
  return (
    <div className="text-center py-16">
      <div className="text-muted-foreground/40 mx-auto mb-4 flex justify-center">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6">{description}</p>
      <Link href={actionHref}>
        <Button className="bg-forest hover:bg-forest-dark text-white">
          {actionLabel}
        </Button>
      </Link>
    </div>
  );
}
