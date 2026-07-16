import { useState } from "react";
import { Link } from "wouter";
import {
  Shield, FileText, BarChart3, Scale, AlertTriangle, Award,
  ChevronDown, ChevronRight, Download, ExternalLink, CheckCircle2,
  Eye, Lock, Users, Globe, ArrowRight, Search, Send, Copy, Check
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const HERO_IMAGE = "/manus-storage/ubatuba-natureza_083c332c.png";

/* ── Dados estáticos ── */
const principiosGovernanca = [
  {
    icon: Eye,
    title: "Transparência Radical",
    desc: "Publicamos anualmente nossas demonstrações financeiras auditadas por empresa independente, relatórios de atividades e prestação de contas completa ao Ministério Público. Seguimos o modelo da Gates Foundation e da Fundação Amazonas Sustentável.",
  },
  {
    icon: Scale,
    title: "Independência e Integridade",
    desc: "Nosso Conselho de Administração é composto por membros independentes. Adotamos política de conflito de interesses e código de conduta obrigatório para todos os colaboradores, voluntários e parceiros.",
  },
  {
    icon: Users,
    title: "Responsabilidade Comunitária",
    desc: "Prestamos contas diretamente às comunidades que servimos em Ubatuba. Realizamos assembleias abertas e publicamos relatórios de impacto com indicadores verificáveis.",
  },
  {
    icon: Globe,
    title: "Alinhamento à Agenda 2030",
    desc: "Todas as nossas ações são mapeadas aos Objetivos de Desenvolvimento Sustentável (ODS), especialmente à ODS 17 — Parcerias e Meios de Implementação, ODS 3 (Saúde), ODS 4 (Educação) e ODS 14 (Vida na Água).",
  },
];

const documentosPublicos = [
  {
    categoria: "Governança",
    icone: Shield,
    cor: "text-forest",
    bg: "bg-forest/8",
    docs: [
      { nome: "Estatuto Social (Atualizado 2025)", tipo: "PDF", status: "disponivel", desc: "Documento constitutivo do instituto com finalidade, estrutura e normas de funcionamento — versão atualizada.", url: "/manus-storage/ESTATUTO2025-ATUALIZADO_a0210599.pdf" },
      { nome: "Estatuto Social (Fundação)", tipo: "PDF", status: "disponivel", desc: "Estatuto original aprovado na Assembleia Geral de Criação e Fundação em 30/08/2021.", url: "/manus-storage/10-ESTATUTOINSTITUTOUBATUBASANTUARIOECOLOGICO_343a2569.pdf" },
      { nome: "Ata de Fundação (30/08/2021)", tipo: "PDF", status: "disponivel", desc: "Ata da Assembleia Geral de Criação e Fundação do Instituto Ubatuba Santuário Ecológico.", url: "/manus-storage/10-ESTATUTOINSTITUTOUBATUBASANTUARIOECOLOGICO_343a2569.pdf" },
      { nome: "Composição do Conselho e Diretoria (2025)", tipo: "PDF", status: "disponivel", desc: "Ata de Eleição e Posse dos integrantes dos Órgãos de Administração — Diretoria Executiva e Conselho Fiscal.", url: "/manus-storage/ATADEPOSSE-ATUALIZADO2025_5c0bccec.pdf" },
      { nome: "Regimento Interno", tipo: "PDF", status: "disponivel", desc: "Normas internas de funcionamento, atribuições, competências e responsabilidades dos órgãos de direção.", url: "/manus-storage/regimento_interno_4eefe0ff.pdf" },
    ],
  },
  {
    categoria: "Certificação OSCIP",
    icone: Award,
    cor: "text-earth",
    bg: "bg-earth/8",
    docs: [
      { nome: "Despacho OSCIP — Ministério da Justiça", tipo: "PDF", status: "disponivel", desc: "SEI/MJ — Despacho de qualificação como Organização da Sociedade Civil de Interesse Público.", url: "/manus-storage/SEI_MJ-33323909-Despacho-OSCIP_5fe1c086.pdf" },
      { nome: "Publicação DOU — Certificação OSCIP", tipo: "PDF", status: "disponivel", desc: "Publicação no Diário Oficial da União em 30 de outubro, confirmando a qualificação OSCIP.", url: "/manus-storage/Publicacao_30_outubro-OSCIP_40a43af2.pdf" },
    ],
  },
  {
    categoria: "Certidões Negativas",
    icone: CheckCircle2,
    cor: "text-ocean",
    bg: "bg-ocean/8",
    docs: [
      { nome: "CND — Contas Julgadas Irregulares (TCU)", tipo: "PDF", status: "disponivel", desc: "Certidão Negativa de Débitos de Contas Julgadas Irregulares pelo Tribunal de Contas da União.", url: "/manus-storage/03-CND-CONTAS-JULGADAS-TCU_39f82166.pdf" },
      { nome: "CND — Débitos Trabalhistas", tipo: "PDF", status: "disponivel", desc: "Certidão Negativa de Débitos Trabalhistas emitida pelo Tribunal Superior do Trabalho.", url: "/manus-storage/05-CND-DEBITOSTRABALHISTAS_5c815fbb.pdf" },
      { nome: "CND — Improbidade Administrativa e Inelegibilidade", tipo: "PDF", status: "disponivel", desc: "Certidão Negativa de Improbidade Administrativa e Inelegibilidade do Instituto.", url: "/manus-storage/06-CND-IMPROBIDADE_16b65f4d.pdf" },
      { nome: "CND — FGTS", tipo: "PDF", status: "disponivel", desc: "Certificado de Regularidade do FGTS emitido pela Caixa Econômica Federal.", url: "/manus-storage/07-CND-FGTS_cc6c8a11.pdf" },
      { nome: "CND — Estadual (Fazenda do Estado de SP)", tipo: "PDF", status: "disponivel", desc: "Certidão Negativa de Débitos Tributários da Fazenda do Estado de São Paulo.", url: "/manus-storage/24-CNDESTADUAL_c5633455.pdf" },
      { nome: "CND — Falência e Concordata", tipo: "PDF", status: "disponivel", desc: "Certidão Negativa de Falência, Concordata e Recuperação Judicial.", url: "/manus-storage/CND-FALENCIA-CONCORDATA_63b8e0c6.pdf" },
    ],
  },
  {
    categoria: "Financeiro",
    icone: BarChart3,
    cor: "text-forest-light",
    bg: "bg-forest-light/8",
    docs: [
      { nome: "Demonstrações Financeiras 2024", tipo: "PDF", status: "em_breve", desc: "Balanço patrimonial, DRE e notas explicativas auditadas por empresa independente." },
      { nome: "Relatório de Atividades 2024", tipo: "PDF", status: "em_breve", desc: "Resultados, impacto social e aplicação de recursos do exercício." },
    ],
  },
];

const alocacaoRecursos = [
  { label: "Programas Socioambientais", percentual: 72, cor: "bg-forest", descricao: "Escolinhas esportivas, saúde, educação e conservação" },
  { label: "Gestão e Administração", percentual: 15, cor: "bg-earth", descricao: "Custos operacionais e equipe de gestão" },
  { label: "Captação de Recursos", percentual: 8, cor: "bg-ocean", descricao: "Comunicação, eventos e desenvolvimento institucional" },
  { label: "Reserva Técnica", percentual: 5, cor: "bg-forest-light", descricao: "Fundo de contingência e projetos futuros" },
];

const certificacoes = [
  {
    nome: "Charity Navigator",
    descricao: "Avaliação independente de eficiência financeira e responsabilidade de organizações sem fins lucrativos.",
    status: "Em processo de certificação",
    icone: "⭐",
    cor: "border-earth/30 bg-earth/5",
  },
  {
    nome: "Candid GuideStar Platinum",
    descricao: "Selo de máxima transparência para organizações que divulgam informações detalhadas sobre governança, finanças e resultados.",
    status: "Em processo de certificação",
    icone: "🏆",
    cor: "border-forest/30 bg-forest/5",
  },
  {
    nome: "TheDotGood",
    descricao: "Reconhecimento internacional de organizações de impacto social com critérios de boa governança, inovação e transparência.",
    status: "Em processo de certificação",
    icone: "🌱",
    cor: "border-ocean/30 bg-ocean/5",
  },
  {
    nome: "OSCIP / Utilidade Pública",
    descricao: "Qualificação como Organização da Sociedade Civil de Interesse Público junto ao Ministério da Justiça.",
    status: "Certificado",
    icone: "🇧🇷",
    cor: "border-forest/40 bg-forest/8",
  },
];

const normasAdotadas = [
  { sigla: "LGPD", nome: "Lei Geral de Proteção de Dados", descricao: "Lei 13.709/2018 — proteção de dados pessoais de beneficiários e colaboradores." },
  { sigla: "Lei 14.611", nome: "Igualdade Salarial", descricao: "Transparência remuneratória entre mulheres e homens conforme IN GM/MTE nº 6/2024." },
  { sigla: "Lei 12.527", nome: "Lei de Acesso à Informação", descricao: "Publicidade ativa de informações de interesse público." },
  { sigla: "ODS/SDG", nome: "Agenda 2030 da ONU", descricao: "Alinhamento dos programas aos 17 Objetivos de Desenvolvimento Sustentável." },
  { sigla: "GRI", nome: "Global Reporting Initiative", descricao: "Padrões internacionais para relatórios de sustentabilidade e impacto social." },
  { sigla: "FASB/NBC", nome: "Normas Contábeis Brasileiras", descricao: "Demonstrações financeiras preparadas conforme NBC TG e normas do CFC para entidades sem fins lucrativos." },
];

const categoriasEtica = [
  { value: "corrupcao", label: "Corrupção ou desvio de recursos" },
  { value: "assedio", label: "Assédio moral ou sexual" },
  { value: "fraude", label: "Fraude ou falsificação" },
  { value: "conflito_interesses", label: "Conflito de interesses" },
  { value: "desvio_recursos", label: "Desvio de recursos ou patrimônio" },
  { value: "discriminacao", label: "Discriminação ou preconceito" },
  { value: "outros", label: "Outros" },
];

const statusLabels: Record<string, { label: string; cor: string }> = {
  recebido: { label: "Recebido — aguardando análise", cor: "text-earth" },
  em_analise: { label: "Em análise pela comissão de ética", cor: "text-ocean" },
  concluido: { label: "Concluído — providências tomadas", cor: "text-forest" },
  arquivado: { label: "Arquivado", cor: "text-muted-foreground" },
};

/* ── Componente Seção Colapsável ── */
function SecaoColapsavel({ id, titulo, icone: Icone, cor, children, defaultOpen = false }: {
  id: string; titulo: string; icone: React.ElementType; cor: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [aberta, setAberta] = useState(defaultOpen);
  return (
    <div id={id} className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setAberta(!aberta)}
        className="w-full flex items-center justify-between p-6 bg-background hover:bg-muted/30 transition-colors text-left"
      >
        <div className="flex items-center gap-4">
          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", cor.replace("text-", "bg-") + "/10")}>
            <Icone className={cn("w-5 h-5", cor)} />
          </div>
          <span className="text-xl font-extrabold text-foreground">{titulo}</span>
        </div>
        {aberta ? <ChevronDown className="w-5 h-5 text-muted-foreground" /> : <ChevronRight className="w-5 h-5 text-muted-foreground" />}
      </button>
      {aberta && <div className="border-t border-border">{children}</div>}
    </div>
  );
}

export default function Transparencia() {
  const [protocoloBusca, setProtocoloBusca] = useState("");
  const [protocoloEnviado, setProtocoloEnviado] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);
  const [formEtica, setFormEtica] = useState({
    category: "" as "corrupcao" | "assedio" | "fraude" | "conflito_interesses" | "desvio_recursos" | "discriminacao" | "outros" | "",
    description: "",
    evidence: "",
    anonymous: true,
    contactEmail: "",
  });

  const submitEtica = trpc.ethics.submit.useMutation({
    onSuccess: (data) => {
      setProtocoloEnviado(data.protocol);
      setFormEtica({ category: "", description: "", evidence: "", anonymous: true, contactEmail: "" });
      toast.success("Denúncia registrada com sucesso!");
    },
    onError: (err) => toast.error(err.message),
  });

  const { data: statusData, refetch: buscarStatus, isFetching } = trpc.ethics.checkStatus.useQuery(
    { protocol: protocoloBusca },
    { enabled: false, retry: false }
  );

  const copiarProtocolo = (p: string) => {
    navigator.clipboard.writeText(p);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className="pt-20">
      {/* ── Hero ── */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="Transparência" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-forest-dark/82" />
        </div>
        <div className="relative container text-center text-white">
          <span className="section-label block mb-4 text-white/60">Governança e Integridade</span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6">
            Compliance e Transparência
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed mb-10">
            Seguimos os mais altos padrões de governança, integridade e prestação de contas — alinhados às melhores práticas de fundações filantrópicas internacionais como a Gates Foundation, Obama Foundation e Instituto Ayrton Senna.
          </p>
          {/* Navegação rápida */}
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { href: "#governanca", label: "Governança" },
              { href: "#documentos", label: "Documentos" },
              { href: "#financeiro", label: "Financeiro" },
              { href: "#integridade", label: "Integridade" },
              { href: "#canal-etica", label: "Canal de Ética" },
              { href: "#certificacoes", label: "Certificações" },
              { href: "/emendas-parlamentares", label: "Emendas Parlamentares" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-4 py-2 rounded-full border border-white/30 text-white/80 text-sm hover:bg-white/10 hover:border-white/60 transition-all"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Compromisso ── */}
      <section className="section-padding bg-sand">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="section-label block mb-4">Nosso Compromisso</span>
            <h2 className="section-title mx-auto mb-6">Transparência como valor central</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              O Instituto Ubatuba Santuário Ecológico adota práticas de compliance e transparência baseadas nos mais rigorosos padrões internacionais. Acreditamos que a confiança pública é o alicerce de qualquer organização filantrópica de impacto.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {principiosGovernanca.map((p, i) => (
              <div key={i} className="card-elegant p-7">
                <div className="w-11 h-11 rounded-lg bg-forest/10 flex items-center justify-center mb-5">
                  <p.icon className="w-5 h-5 text-forest" />
                </div>
                <h3 className="text-lg font-extrabold text-foreground mb-3">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Normas e Padrões ── */}
      <section className="section-padding bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <span className="section-label block mb-4">Normas Adotadas</span>
            <h2 className="section-title mx-auto mb-4">Padrões que nos orientam</h2>
            <p className="section-subtitle mx-auto">Seguimos legislações brasileiras e normas internacionais de governança e reporte.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {normasAdotadas.map((n, i) => (
              <div key={i} className="flex gap-4 p-5 rounded-xl border border-border bg-background hover:border-forest/30 transition-colors">
                <div className="shrink-0 w-14 h-14 rounded-lg bg-forest/8 flex items-center justify-center">
                  <span className="font-mono text-xs font-bold text-forest leading-tight text-center">{n.sigla}</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm mb-1">{n.nome}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{n.descricao}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Documentos Públicos ── */}
      <section id="documentos" className="section-padding bg-sand">
        <div className="container">
          <div className="text-center mb-12">
            <span className="section-label block mb-4">Acesso Público</span>
            <h2 className="section-title mx-auto mb-4">Documentos Institucionais</h2>
            <p className="section-subtitle mx-auto">
              Disponibilizamos todos os documentos relevantes para consulta pública, seguindo o modelo de transparência da Gates Foundation e da Fundação Amazonas Sustentável.
            </p>
          </div>
          <div className="space-y-4">
            {documentosPublicos.map((cat, ci) => (
              <SecaoColapsavel
                key={ci}
                id={ci === 1 ? "financeiro" : ci === 2 ? "integridade" : ""}
                titulo={cat.categoria}
                icone={cat.icone}
                cor={cat.cor}
                defaultOpen={ci === 0}
              >
                <div className="divide-y divide-border">
                  {cat.docs.map((doc, di) => (
                    <div key={di} className="flex items-start justify-between gap-4 p-5 hover:bg-muted/20 transition-colors">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <FileText className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-foreground text-sm">{doc.nome}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{doc.desc}</p>
                        </div>
                      </div>
                      <div className="shrink-0">
                        {doc.status === "disponivel" && (doc as any).url ? (
                          <a
                            href={(doc as any).url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-forest hover:text-forest-dark transition-colors px-3 py-1.5 rounded-lg border border-forest/20 hover:border-forest/40 hover:bg-forest/5"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Abrir {doc.tipo}
                          </a>
                        ) : doc.status === "disponivel" ? (
                          <button className="inline-flex items-center gap-1.5 text-xs font-medium text-forest hover:text-forest-dark transition-colors px-3 py-1.5 rounded-lg border border-forest/20 hover:border-forest/40 hover:bg-forest/5">
                            <Download className="w-3.5 h-3.5" />
                            {doc.tipo}
                          </button>
                        ) : (
                          <span className="text-xs text-muted-foreground px-3 py-1.5 rounded-lg border border-border bg-muted/30">
                            Em breve
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </SecaoColapsavel>
            ))}
          </div>
        </div>
      </section>

      {/* ── Banner Emendas Parlamentares ── */}
      <section className="py-10 bg-forest/5">
        <div className="container">
          <Link href="/emendas-parlamentares" className="block group">
            <div className="bg-white rounded-2xl border border-forest/10 p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 hover:shadow-lg transition-all hover:border-ocean/30">
              <div className="w-16 h-16 rounded-full bg-ocean/10 flex items-center justify-center shrink-0">
                <BarChart3 className="w-8 h-8 text-ocean" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold text-forest mb-1">Emendas Parlamentares para Ubatuba</h3>
                <p className="text-sm text-forest/70">Consulte todas as emendas parlamentares destinadas ao município de Ubatuba com valores, parlamentares, datas e links para o Portal da Transparência.</p>
              </div>
              <ArrowRight className="w-6 h-6 text-ocean group-hover:translate-x-1 transition-transform shrink-0" />
            </div>
          </Link>
        </div>
      </section>

      {/* ── Alocação de Recursos ── */}
      <section id="financeiro" className="section-padding bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="section-label block mb-4">Resultados Financeiros</span>
              <h2 className="text-4xl font-extrabold text-foreground mb-6 leading-tight">
                Como aplicamos os recursos
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Seguindo o modelo da Fundação Amazonas Sustentável — que aplica em média 78% dos recursos em áreas finalísticas — o Instituto Ubatuba destina <strong className="text-forest font-semibold">72% dos recursos diretamente aos programas socioambientais</strong>, com total transparência na prestação de contas.
              </p>
              <div className="space-y-5">
                {alocacaoRecursos.map((item, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">{item.label}</span>
                      <span className="text-sm font-bold text-foreground">{item.percentual}%</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className={cn("h-full rounded-full transition-all duration-1000", item.cor)}
                        style={{ width: `${item.percentual}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{item.descricao}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="card-elegant p-8 text-center">
                <div className="text-6xl font-extrabold text-forest mb-2">72%</div>
                <p className="text-muted-foreground font-medium">dos recursos aplicados em programas socioambientais</p>
                <p className="text-xs text-muted-foreground mt-2">Exercício 2024 — auditado por empresa independente</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="card-elegant p-6 text-center">
                  <div className="text-3xl font-extrabold text-earth mb-1">7.500+</div>
                  <p className="text-xs text-muted-foreground">aulas ministradas</p>
                </div>
                <div className="card-elegant p-6 text-center">
                  <div className="text-3xl font-extrabold text-ocean mb-1">5.000+</div>
                  <p className="text-xs text-muted-foreground">exames e atendimentos</p>
                </div>
              </div>
              <div className="card-elegant p-6 border-l-4 border-forest">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Auditoria independente:</strong> As demonstrações financeiras do Instituto Ubatuba são auditadas anualmente por empresa de auditoria independente, seguindo o modelo adotado pelo GRAACC (Ernst &amp; Young) e pela Fundação Amazonas Sustentável.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Programa de Integridade ── */}
      <section id="integridade" className="section-padding bg-sand">
        <div className="container">
          <div className="text-center mb-12">
            <span className="section-label block mb-4">Programa de Integridade</span>
            <h2 className="section-title mx-auto mb-4">Ética como fundamento</h2>
            <p className="section-subtitle mx-auto">
              Inspirado no modelo do Instituto Ayrton Senna — reconhecido entre as 200 melhores organizações de impacto social do mundo — nosso Programa de Integridade estrutura a cultura ética em toda a organização.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              {
                icone: Scale,
                titulo: "Código de Conduta",
                itens: [
                  "Princípios de comportamento ético",
                  "Relações com parceiros e fornecedores",
                  "Uso de recursos e patrimônio",
                  "Comunicação e representação institucional",
                  "Proteção de dados e confidencialidade",
                ],
              },
              {
                icone: Shield,
                titulo: "Política Anticorrupção",
                itens: [
                  "Proibição absoluta de suborno e propina",
                  "Controles internos e auditoria",
                  "Due diligence de parceiros e fornecedores",
                  "Treinamento obrigatório para toda a equipe",
                  "Procedimentos de investigação interna",
                ],
              },
              {
                icone: Lock,
                titulo: "Proteção de Dados (LGPD)",
                itens: [
                  "Política de privacidade transparente",
                  "Consentimento informado dos beneficiários",
                  "Segurança no armazenamento de dados",
                  "Direitos dos titulares garantidos",
                  "Encarregado de Proteção de Dados (DPO)",
                ],
              },
            ].map((item, i) => (
              <div key={i} className="card-elegant p-7">
                <div className="w-11 h-11 rounded-lg bg-forest/10 flex items-center justify-center mb-5">
                  <item.icone className="w-5 h-5 text-forest" />
                </div>
                <h3 className="text-lg font-extrabold text-foreground mb-4">{item.titulo}</h3>
                <ul className="space-y-2.5">
                  {item.itens.map((it, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-forest shrink-0 mt-0.5" />
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="card-elegant p-8 border-l-4 border-forest max-w-3xl mx-auto">
            <p className="text-muted-foreground leading-relaxed">
              <strong className="text-foreground font-semibold">Comitê de Compliance:</strong> O Instituto Ubatuba mantém um Comitê de Compliance independente, responsável por monitorar a aplicação das políticas de integridade, investigar denúncias recebidas pelo Canal de Ética e reportar ao Conselho de Administração. Todos os membros da equipe passam por treinamento obrigatório anual sobre ética e compliance.
            </p>
          </div>
        </div>
      </section>

      {/* ── Canal de Ética ── */}
      <section id="canal-etica" className="section-padding bg-background">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <div className="w-14 h-14 rounded-full bg-earth/10 flex items-center justify-center mx-auto mb-5">
                <AlertTriangle className="w-7 h-7 text-earth" />
              </div>
              <span className="section-label block mb-4">Canal de Ética</span>
              <h2 className="section-title mx-auto mb-4">Denúncias seguras e confidenciais</h2>
              <p className="section-subtitle mx-auto">
                Seguindo as melhores práticas da Fundação Amazonas Sustentável e do Instituto Ayrton Senna, mantemos um canal seguro, confidencial e — se preferir — completamente anônimo para receber denúncias, sugestões e relatos de irregularidades.
              </p>
            </div>

            {/* Garantias */}
            <div className="grid sm:grid-cols-3 gap-4 mb-10">
              {[
                { icone: Lock, titulo: "100% Confidencial", desc: "Sua identidade é protegida. Nenhuma informação pessoal é compartilhada sem seu consentimento." },
                { icone: Eye, titulo: "Acompanhamento", desc: "Receba um protocolo único para acompanhar o andamento da sua denúncia a qualquer momento." },
                { icone: Shield, titulo: "Sem Represálias", desc: "Garantimos proteção contra qualquer forma de retaliação a quem utilizar o canal de ética." },
              ].map((g, i) => (
                <div key={i} className="text-center p-5 rounded-xl border border-border bg-muted/20">
                  <div className="w-10 h-10 rounded-lg bg-forest/10 flex items-center justify-center mx-auto mb-3">
                    <g.icone className="w-5 h-5 text-forest" />
                  </div>
                  <p className="font-semibold text-foreground text-sm mb-1">{g.titulo}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{g.desc}</p>
                </div>
              ))}
            </div>

            {/* Formulário ou Confirmação */}
            {protocoloEnviado ? (
              <div className="card-elegant p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-forest/10 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 className="w-8 h-8 text-forest" />
                </div>
                <h3 className="text-2xl font-extrabold text-foreground mb-3">Denúncia registrada com sucesso</h3>
                <p className="text-muted-foreground mb-6">Guarde o protocolo abaixo para acompanhar o andamento da sua denúncia.</p>
                <div className="inline-flex items-center gap-3 px-6 py-4 bg-forest/8 rounded-xl border border-forest/20 mb-6">
                  <span className="font-mono text-xl font-bold text-forest tracking-wider">{protocoloEnviado}</span>
                  <button
                    onClick={() => copiarProtocolo(protocoloEnviado)}
                    className="text-forest/60 hover:text-forest transition-colors"
                    title="Copiar protocolo"
                  >
                    {copiado ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-sm text-muted-foreground mb-6">Prazo de resposta: até 30 dias úteis. Você pode consultar o status abaixo.</p>
                <Button variant="outline" onClick={() => setProtocoloEnviado(null)}>
                  Registrar nova denúncia
                </Button>
              </div>
            ) : (
              <div className="card-elegant p-8">
                <h3 className="text-xl font-extrabold text-foreground mb-6">Registrar ocorrência</h3>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Categoria da ocorrência *</label>
                    <Select
                      value={formEtica.category}
                      onValueChange={(v) => setFormEtica(f => ({ ...f, category: v as typeof f.category }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoriasEtica.map((c) => (
                          <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Descrição da ocorrência *</label>
                    <Textarea
                      placeholder="Descreva o ocorrido com o máximo de detalhes possível: o que aconteceu, quando, onde e quem estava envolvido..."
                      rows={5}
                      value={formEtica.description}
                      onChange={(e) => setFormEtica(f => ({ ...f, description: e.target.value }))}
                      className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground mt-1">{formEtica.description.length}/20 caracteres mínimos</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Evidências (opcional)</label>
                    <Input
                      placeholder="Links, nomes de documentos ou outras referências que possam auxiliar a investigação"
                      value={formEtica.evidence}
                      onChange={(e) => setFormEtica(f => ({ ...f, evidence: e.target.value }))}
                    />
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30 border border-border">
                    <input
                      type="checkbox"
                      id="anonimo"
                      checked={formEtica.anonymous}
                      onChange={(e) => setFormEtica(f => ({ ...f, anonymous: e.target.checked }))}
                      className="mt-0.5 accent-forest"
                    />
                    <label htmlFor="anonimo" className="text-sm text-foreground cursor-pointer">
                      <span className="font-medium">Enviar anonimamente</span>
                      <span className="text-muted-foreground"> — sua identidade não será revelada em nenhuma circunstância</span>
                    </label>
                  </div>
                  {!formEtica.anonymous && (
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">E-mail para contato (opcional)</label>
                      <Input
                        type="email"
                        placeholder="seu@email.com"
                        value={formEtica.contactEmail}
                        onChange={(e) => setFormEtica(f => ({ ...f, contactEmail: e.target.value }))}
                      />
                    </div>
                  )}
                  <Button
                    className="w-full btn-primary"
                    disabled={!formEtica.category || formEtica.description.length < 20 || submitEtica.isPending}
                    onClick={() => {
                      if (!formEtica.category) return;
                      submitEtica.mutate({
                        category: formEtica.category,
                        description: formEtica.description,
                        evidence: formEtica.evidence || undefined,
                        anonymous: formEtica.anonymous,
                        contactEmail: formEtica.contactEmail || undefined,
                      });
                    }}
                  >
                    {submitEtica.isPending ? "Enviando..." : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Enviar denúncia com segurança
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Consultar status */}
            <div className="mt-8 card-elegant p-6">
              <h4 className="text-lg font-extrabold text-foreground mb-4 flex items-center gap-2">
                <Search className="w-5 h-5 text-forest" />
                Consultar status de denúncia
              </h4>
              <div className="flex gap-3">
                <Input
                  placeholder="Digite seu protocolo (ex: IU2025123456)"
                  value={protocoloBusca}
                  onChange={(e) => setProtocoloBusca(e.target.value.toUpperCase())}
                  className="font-mono"
                />
                <Button
                  variant="outline"
                  onClick={() => buscarStatus()}
                  disabled={protocoloBusca.length < 10 || isFetching}
                >
                  {isFetching ? "Buscando..." : "Consultar"}
                </Button>
              </div>
              {statusData && (
                <div className="mt-4 p-4 rounded-lg bg-muted/30 border border-border">
                  <p className="text-sm font-medium text-foreground mb-1">Protocolo: <span className="font-mono">{protocoloBusca}</span></p>
                  <p className={cn("text-sm font-semibold", statusLabels[statusData.status]?.cor)}>
                    {statusLabels[statusData.status]?.label ?? statusData.status}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Registrado em: {new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(new Date(statusData.createdAt))}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Certificações ── */}
      <section id="certificacoes" className="section-padding bg-sand">
        <div className="container">
          <div className="text-center mb-12">
            <span className="section-label block mb-4">Reconhecimentos</span>
            <h2 className="section-title mx-auto mb-4">Certificações e Selos</h2>
            <p className="section-subtitle mx-auto">
              Buscamos os mais altos reconhecimentos de qualidade e transparência, seguindo o exemplo da Obama Foundation (GuideStar Platinum) e do Instituto Ayrton Senna (TheDotGood).
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {certificacoes.map((cert, i) => (
              <div key={i} className={cn("rounded-xl border p-6 flex flex-col", cert.cor)}>
                <div className="text-3xl mb-4">{cert.icone}</div>
                <h3 className="text-lg font-extrabold text-foreground mb-2">{cert.nome}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">{cert.descricao}</p>
                <span className={cn(
                  "text-xs font-semibold px-3 py-1.5 rounded-full self-start",
                  cert.status === "Certificado" ? "bg-forest/10 text-forest" : "bg-earth/10 text-earth"
                )}>
                  {cert.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Igualdade Salarial ── */}
      <section className="section-padding bg-background">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="card-elegant p-8 md:p-10">
              <div className="flex items-start gap-5 mb-6">
                <div className="w-12 h-12 rounded-xl bg-ocean/10 flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6 text-ocean" />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-foreground mb-2">Relatório de Igualdade Salarial</h3>
                  <p className="text-muted-foreground text-sm">Conforme Lei nº 14.611/2023 e Instrução Normativa GM/MTE nº 6/2024</p>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6">
                O Instituto Ubatuba Santuário Ecológico publica anualmente seu Relatório de Transparência e Igualdade Salarial entre Mulheres e Homens, seguindo o modelo adotado pelo GRAACC e pela Fundação Amazonas Sustentável. Acreditamos que a equidade de gênero começa pela transparência remuneratória.
              </p>
              <div className="grid sm:grid-cols-3 gap-4 mb-6">
                {[
                  { label: "Equidade salarial por cargo", valor: "100%" },
                  { label: "Mulheres em posições de liderança", valor: "60%" },
                  { label: "Plano de cargos e salários", valor: "Publicado" },
                ].map((item, i) => (
                  <div key={i} className="text-center p-4 rounded-lg bg-muted/30">
                    <div className="text-2xl font-extrabold text-forest mb-1">{item.valor}</div>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                  </div>
                ))}
              </div>
              <button className="inline-flex items-center gap-2 text-sm font-medium text-forest hover:text-forest-dark transition-colors">
                <Download className="w-4 h-4" />
                Baixar Relatório de Igualdade Salarial 2024
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section className="section-padding bg-forest-dark text-white">
        <div className="container text-center">
          <Award className="w-12 h-12 text-white/40 mx-auto mb-5" />
          <h2 className="text-4xl font-extrabold text-white mb-4">
            Dúvidas ou solicitações?
          </h2>
          <p className="text-white/70 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
            Para solicitações de acesso à informação, esclarecimentos sobre nossa governança ou documentos adicionais, entre em contato com nossa equipe de compliance.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contato" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-forest-dark font-semibold rounded-sm hover:bg-white/90 transition-all active:scale-[0.98]">
              Falar com o time de compliance
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="mailto:compliance@institutoubatuba.org"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/40 text-white font-semibold rounded-sm hover:bg-white/10 hover:border-white/70 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              compliance@institutoubatuba.org
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
