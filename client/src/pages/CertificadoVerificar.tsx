import { useParams, Link } from "wouter";
import { Award, CheckCircle2, XCircle, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSEO } from "@/components/SEOHead";
import { trpc } from "@/lib/trpc";

export default function CertificadoVerificar() {
  const { code } = useParams<{ code: string }>();

  useSEO({
    title: "Verificar Certificado | Instituto Ubatuba",
    description: "Verifique a autenticidade de um certificado emitido pelo Instituto Ubatuba.",
    canonical: `/certificado/${code}`,
  });

  const { data, isLoading, error } = trpc.certificates.verify.useQuery({ code: code! }, { enabled: !!code, retry: false });

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-forest" /></div>;
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <XCircle className="w-16 h-16 text-red-400" />
        <h1 className="text-2xl font-bold text-red-600">Certificado Não Encontrado</h1>
        <p className="text-muted-foreground text-center max-w-md">O código <span className="font-mono font-medium">{code}</span> não corresponde a nenhum certificado válido.</p>
        <Link href="/cursos"><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Voltar aos cursos</Button></Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/50 to-white pt-28 pb-20 px-4">
      <div className="container max-w-lg">
        <div className="bg-white rounded-2xl border-2 border-forest/30 shadow-lg p-8 text-center">
          <CheckCircle2 className="w-16 h-16 text-forest mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-forest-dark mb-2">Certificado Válido</h1>
          <p className="text-muted-foreground mb-6">Este certificado é autêntico e foi emitido pelo Instituto Ubatuba Santuário Ecológico.</p>

          <div className="bg-accent/40 rounded-xl p-5 text-left space-y-3 mb-6">
            <div>
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Curso</span>
              <p className="font-semibold text-forest-dark">{data.course.title}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Instituição</span>
              <p className="font-medium">{data.course.institution}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Código do Certificado</span>
              <p className="font-mono font-medium">{data.certificate.code}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Data de Emissão</span>
              <p className="font-medium">{new Date(data.certificate.issuedAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-forest">
            <Award className="w-4 h-4" />
            <span>Instituto Ubatuba Santuário Ecológico</span>
          </div>
        </div>
      </div>
    </div>
  );
}
