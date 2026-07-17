import { useParams, Link } from "wouter";
import { Award, CheckCircle2, ArrowLeft, Download, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSEO } from "@/components/SEOHead";
import { trpc } from "@/lib/trpc";

export default function CertificadoVerificar() {
  const { code } = useParams<{ code: string }>();

  useSEO({
    title: `Certificado ${code || ""} | Instituto Ubatuba`,
    description: "Verifique a autenticidade de um certificado emitido pelo Instituto Ubatuba.",
    canonical: `/certificado/${code || ""}`,
  });

  const { data: certificate, isLoading, error } = trpc.certificates.verify.useQuery(
    { code: code || "" },
    { retry: false, enabled: !!code }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-center">
          <Award className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
          <p className="text-muted-foreground">Verificando certificado...</p>
        </div>
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <Award className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Certificado não encontrado</h1>
          <p className="text-muted-foreground mb-6">
            O código informado não corresponde a nenhum certificado válido.
          </p>
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12 lg:py-16">
        <div className="max-w-2xl mx-auto">
          {/* Success badge */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium mb-4">
              <CheckCircle2 className="w-4 h-4" />
              Certificado Verificado
            </div>
            <h1 className="text-3xl font-bold text-foreground">Certificado de Conclusão</h1>
          </div>

          {/* Certificate Card */}
          <Card className="border-2 border-forest/20 shadow-lg">
            <CardContent className="p-8 lg:p-10">
              {/* Header */}
              <div className="text-center mb-8">
                <GraduationCap className="w-12 h-12 text-forest mx-auto mb-3" />
                <h2 className="text-xl font-bold text-forest">Instituto Ubatuba</h2>
                <p className="text-sm text-muted-foreground">Santuário Ecológico</p>
              </div>

              {/* Content */}
              <div className="text-center space-y-4 mb-8">
                <p className="text-muted-foreground">Certificamos que</p>
                <p className="text-2xl font-bold text-foreground">{certificate.userName}</p>
                <p className="text-muted-foreground">concluiu com êxito o curso</p>
                <p className="text-xl font-semibold text-foreground">{certificate.courseName}</p>
                <p className="text-muted-foreground">
                  oferecido por <span className="font-medium text-foreground">{certificate.institution}</span>
                </p>
              </div>

              {/* Footer */}
              <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                <div>
                  <p>Emitido em: {new Date(certificate.issuedAt).toLocaleDateString("pt-BR")}</p>
                  <p className="font-mono text-xs mt-1">Código: {certificate.code}</p>
                </div>
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="font-medium">Autêntico</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-center gap-4 mt-8">
            <Link href="/cursos">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Ver Cursos
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
