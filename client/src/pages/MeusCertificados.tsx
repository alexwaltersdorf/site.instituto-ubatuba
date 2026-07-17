import { Link } from "wouter";
import { GraduationCap, Award, ExternalLink, Clock, CheckCircle2, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSEO } from "@/components/SEOHead";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";

export default function MeusCertificados() {
  useSEO({
    title: "Meus Certificados | Instituto Ubatuba",
    description: "Acompanhe seus cursos e certificados emitidos pelo Instituto Ubatuba.",
    canonical: "/meus-certificados",
  });

  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-forest" /></div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <GraduationCap className="w-16 h-16 text-muted-foreground/40" />
        <h1 className="text-2xl font-bold text-forest-dark">Faça login para acessar</h1>
        <p className="text-muted-foreground text-center max-w-md">Você precisa estar logado para ver seus cursos e certificados.</p>
        <a href={getLoginUrl("/meus-certificados")}><Button className="bg-forest hover:bg-forest-dark text-white">Fazer Login</Button></a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/50 to-white pt-28 pb-20 px-4">
      <div className="container max-w-4xl">
        <h1 className="text-3xl font-bold text-forest-dark mb-2">Meus Cursos & Certificados</h1>
        <p className="text-muted-foreground mb-8">Acompanhe seu progresso e certificados emitidos</p>
        <Tabs defaultValue="cursos" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="cursos"><GraduationCap className="w-4 h-4 mr-2" /> Meus Cursos</TabsTrigger>
            <TabsTrigger value="certificados"><Award className="w-4 h-4 mr-2" /> Certificados</TabsTrigger>
          </TabsList>
          <TabsContent value="cursos"><EnrollmentsList /></TabsContent>
          <TabsContent value="certificados"><CertificatesList /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function EnrollmentsList() {
  const { data: enrollments, isLoading } = trpc.courses.myEnrollments.useQuery();
  const completeMutation = trpc.courses.complete.useMutation();
  const utils = trpc.useUtils();

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-forest" /></div>;
  if (!enrollments || enrollments.length === 0) {
    return (
      <div className="text-center py-16">
        <GraduationCap className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
        <p className="text-muted-foreground mb-4">Você ainda não se inscreveu em nenhum curso.</p>
        <Link href="/cursos"><Button className="bg-forest hover:bg-forest-dark text-white">Explorar Cursos</Button></Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {enrollments.map(({ enrollment, course }) => (
        <div key={enrollment.id} className="bg-white rounded-xl border border-border/50 p-5 flex flex-col sm:flex-row gap-4 items-start">
          <div className="flex-1">
            <Link href={`/cursos/${course.slug}`}><h3 className="font-semibold text-forest-dark hover:text-forest cursor-pointer">{course.title}</h3></Link>
            <p className="text-sm text-muted-foreground mt-1">{course.institution}</p>
            <Badge variant={enrollment.status === "completed" ? "default" : "secondary"} className={`mt-2 ${enrollment.status === "completed" ? "bg-forest" : ""}`}>
              {enrollment.status === "completed" ? <><CheckCircle2 className="w-3 h-3 mr-1" /> Concluído</> : <><Clock className="w-3 h-3 mr-1" /> Em andamento</>}
            </Badge>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button size="sm" variant="outline" onClick={() => window.open(course.platformUrl, "_blank")}><ExternalLink className="w-3.5 h-3.5 mr-1" /> Plataforma</Button>
            {enrollment.status === "active" && (
              <Button size="sm" className="bg-forest hover:bg-forest-dark text-white" disabled={completeMutation.isPending} onClick={() => {
                completeMutation.mutate({ enrollmentId: enrollment.id }, { onSuccess: () => { toast.success("Curso concluído!"); utils.courses.myEnrollments.invalidate(); } });
              }}>Concluir</Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function CertificatesList() {
  const { data: certificates, isLoading } = trpc.certificates.myCertificates.useQuery();
  const { data: enrollments } = trpc.courses.myEnrollments.useQuery();
  const issueMutation = trpc.certificates.issue.useMutation();
  const utils = trpc.useUtils();

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-forest" /></div>;

  const completedWithoutCert = enrollments?.filter(
    (e) => e.enrollment.status === "completed" && !certificates?.some((c) => c.certificate.enrollmentId === e.enrollment.id)
  ) ?? [];

  return (
    <div className="space-y-6">
      {completedWithoutCert.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <h3 className="font-semibold text-amber-800 mb-3">Certificados Disponíveis para Emissão</h3>
          <div className="space-y-3">
            {completedWithoutCert.map(({ enrollment, course }) => (
              <div key={enrollment.id} className="flex items-center justify-between gap-3 bg-white rounded-lg p-3 border border-amber-100">
                <span className="text-sm font-medium">{course.title}</span>
                <Button size="sm" className="bg-forest hover:bg-forest-dark text-white shrink-0" disabled={issueMutation.isPending} onClick={() => {
                  issueMutation.mutate({ enrollmentId: enrollment.id, courseId: course.id }, { onSuccess: () => { toast.success("Certificado emitido!"); utils.certificates.myCertificates.invalidate(); } });
                }}><Award className="w-3.5 h-3.5 mr-1" /> Emitir</Button>
              </div>
            ))}
          </div>
        </div>
      )}
      {(!certificates || certificates.length === 0) && completedWithoutCert.length === 0 && (
        <div className="text-center py-16">
          <Award className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
          <p className="text-muted-foreground mb-2">Nenhum certificado emitido ainda.</p>
          <p className="text-sm text-muted-foreground">Conclua um curso para solicitar seu certificado.</p>
        </div>
      )}
      {certificates && certificates.length > 0 && (
        <div className="space-y-4">
          {certificates.map(({ certificate, course }) => (
            <div key={certificate.id} className="bg-white rounded-xl border border-forest/20 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-forest-dark">{course.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{course.institution}</p>
                  <p className="text-xs text-muted-foreground mt-2">Código: <span className="font-mono font-medium">{certificate.code}</span></p>
                  <p className="text-xs text-muted-foreground">Emitido em: {new Date(certificate.issuedAt).toLocaleDateString("pt-BR")}</p>
                </div>
                <Link href={`/certificado/${certificate.code}`}><Button size="sm" variant="outline"><Award className="w-3.5 h-3.5 mr-1" /> Verificar</Button></Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
