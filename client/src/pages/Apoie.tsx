import { useState } from "react";
import { Heart, Users, Handshake, ArrowRight, CheckCircle, Building2, Leaf, CreditCard, Lock, Loader2, Gift } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";

const HERO_IMAGE = "/manus-storage/ubatuba-hero_110ea313.jpg";

// Planos de doação (espelham os valores do backend)
const DONATION_TIERS = [
  {
    id: "doe-30",
    label: "R$ 30",
    amountBRL: 30,
    description: "Apoiador da Natureza",
    impact: "Cobre materiais esportivos para uma criança por 1 mês nas escolinhas.",
    popular: false,
  },
  {
    id: "doe-50",
    label: "R$ 50",
    amountBRL: 50,
    description: "Guardião do Santuário",
    impact: "Financia um exame de saúde preventivo para uma família da comunidade.",
    popular: false,
  },
  {
    id: "doe-100",
    label: "R$ 100",
    amountBRL: 100,
    description: "Protetor do Ecossistema",
    impact: "Garante 1 mês de atividades esportivas e educacionais para 3 crianças.",
    popular: true,
  },
  {
    id: "doe-200",
    label: "R$ 200",
    amountBRL: 200,
    description: "Embaixador Socioambiental",
    impact: "Sustenta um mês completo do Projeto Itaguá Azul de conservação marinha.",
    popular: false,
  },
];

const formasApoio = [
  {
    id: "voluntariado",
    icon: Users,
    titulo: "Voluntariado",
    subtitulo: "Doe seu tempo e talento",
    descricao: "Voluntários são o coração do Instituto Ubatuba. Seja como educador, monitor esportivo, profissional de saúde, comunicador ou apoio administrativo — sua contribuição é fundamental para ampliar nosso alcance e impacto.",
    beneficios: [
      "Certificado de voluntariado reconhecido",
      "Capacitações e treinamentos gratuitos",
      "Integração com uma rede de profissionais comprometidos",
      "Experiência transformadora em Ubatuba",
    ],
    cta: "Quero ser voluntário",
    color: "text-forest",
    bg: "bg-forest/10",
    border: "border-forest/20",
    iconBg: "bg-forest",
  },
  {
    id: "parcerias",
    icon: Handshake,
    titulo: "Parcerias",
    subtitulo: "Construa pontes conosco",
    descricao: "Buscamos parcerias com organizações, empresas e instituições que compartilham nossos valores de conservação socioambiental. Juntos, podemos criar iniciativas de maior escala e impacto duradouro em Ubatuba e região.",
    beneficios: [
      "Visibilidade e associação à causa ambiental",
      "Projetos co-desenvolvidos e personalizados",
      "Relatórios de impacto para prestação de contas",
      "Alinhamento com ESG e responsabilidade social",
    ],
    cta: "Propor uma parceria",
    color: "text-ocean",
    bg: "bg-ocean/10",
    border: "border-ocean/20",
    iconBg: "bg-ocean",
  },
];

const empresasParceiras = [
  { nome: "Total Quality Medicina Diagnóstica", tipo: "Saúde", desc: "Parceria em ações de saúde comunitária" },
  { nome: "Projeto Itaguá Azul", tipo: "Conservação", desc: "Conservação dos ecossistemas marinhos" },
  { nome: "Associação de Moradores do Pereque-açu", tipo: "Comunidade", desc: "Integração e ações comunitárias" },
];

// ── Componente de Doação ──────────────────────────────────────────────────────
function SecaoDoacoes() {
  const [selectedTier, setSelectedTier] = useState<string>("doe-100");
  const [customValue, setCustomValue] = useState<string>("");
  const [isCustom, setIsCustom] = useState(false);
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");

  const createCheckout = trpc.donation.createCheckout.useMutation({
    onSuccess: ({ checkoutUrl }) => {
      window.open(checkoutUrl, "_blank");
      toast.success("Redirecionando para o pagamento seguro...");
    },
    onError: (err) => {
      toast.error(err.message || "Erro ao processar doação. Tente novamente.");
    },
  });

  const handleDonate = () => {
    if (isCustom) {
      const val = parseFloat(customValue.replace(",", "."));
      if (!val || val < 5) {
        toast.error("O valor mínimo para doação é R$ 5,00.");
        return;
      }
      createCheckout.mutate({
        customAmountBRL: Math.round(val * 100),
        donorName: donorName || undefined,
        donorEmail: donorEmail || undefined,
        origin: window.location.origin,
      });
    } else {
      createCheckout.mutate({
        tierId: selectedTier,
        donorName: donorName || undefined,
        donorEmail: donorEmail || undefined,
        origin: window.location.origin,
      });
    }
  };

  const selectedTierData = DONATION_TIERS.find((t) => t.id === selectedTier);

  return (
    <section id="doacoes" className="section-padding bg-gradient-to-b from-forest-dark to-forest">
      <div className="container">
        <div className="text-center mb-14">
          <span className="section-label block mb-4 text-white/50">Faça a diferença</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Faça uma Doação
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
            Cada real doado vai diretamente para os programas que transformam vidas em Ubatuba.
            Pagamento 100% seguro via Stripe.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header do card */}
            <div className="bg-forest/5 border-b border-border/40 px-8 py-5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-forest/10 flex items-center justify-center">
                <Heart className="w-4 h-4 text-forest fill-forest/30" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm">Instituto Ubatuba Santuário Ecológico</h3>
                <p className="text-xs text-muted-foreground">ODS 17 · Parcerias · Saúde, Esporte e Meio Ambiente</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
                <Lock className="w-3 h-3" />
                <span>Pagamento seguro</span>
              </div>
            </div>

            <div className="p-8">
              {/* Seleção de valor */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Escolha o valor da sua doação
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                  {DONATION_TIERS.map((tier) => (
                    <button
                      key={tier.id}
                      onClick={() => { setSelectedTier(tier.id); setIsCustom(false); }}
                      className={cn(
                        "relative py-3 px-4 rounded-lg border-2 text-sm font-semibold transition-all duration-150 active:scale-[0.97]",
                        !isCustom && selectedTier === tier.id
                          ? "border-forest bg-forest text-white shadow-md shadow-forest/20"
                          : "border-border text-foreground hover:border-forest/50 hover:bg-forest/5"
                      )}
                    >
                      {tier.popular && (
                        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-earth text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                          Mais popular
                        </span>
                      )}
                      {tier.label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => { setIsCustom(true); setSelectedTier(""); }}
                  className={cn(
                    "w-full py-3 px-4 rounded-lg border-2 text-sm font-medium transition-all duration-150 text-left flex items-center gap-2",
                    isCustom
                      ? "border-forest bg-forest/5 text-forest"
                      : "border-border text-muted-foreground hover:border-forest/50"
                  )}
                >
                  <Gift className="w-4 h-4" />
                  Outro valor (livre)
                </button>
                {isCustom && (
                  <div className="mt-3">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">R$</span>
                      <Input
                        type="number"
                        min="5"
                        step="1"
                        placeholder="0,00"
                        value={customValue}
                        onChange={(e) => setCustomValue(e.target.value)}
                        className="pl-10 text-base font-semibold"
                        autoFocus
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Valor mínimo: R$ 5,00</p>
                  </div>
                )}
              </div>

              {/* Impacto do valor selecionado */}
              {!isCustom && selectedTierData && (
                <div className="mb-6 p-4 bg-forest/5 rounded-lg border border-forest/15">
                  <div className="flex items-start gap-3">
                    <Leaf className="w-4 h-4 text-forest mt-0.5 shrink-0" />
                    <div>
                      <span className="text-xs font-semibold text-forest uppercase tracking-wide block mb-1">
                        {selectedTierData.description}
                      </span>
                      <p className="text-sm text-foreground/80">{selectedTierData.impact}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Dados opcionais do doador */}
              <div className="mb-6 space-y-3">
                <label className="block text-sm font-semibold text-foreground mb-1">
                  Seus dados <span className="font-normal text-muted-foreground">(opcional — para recibo)</span>
                </label>
                <Input
                  placeholder="Seu nome"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                />
                <Input
                  type="email"
                  placeholder="Seu e-mail"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                />
              </div>

              {/* Botão de doação */}
              <Button
                onClick={handleDonate}
                disabled={createCheckout.isPending}
                className="w-full h-12 bg-forest hover:bg-forest-dark text-white font-semibold text-base gap-2 shadow-lg shadow-forest/25 active:scale-[0.98] transition-all"
              >
                {createCheckout.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Preparando pagamento...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Doar agora
                    {!isCustom && selectedTierData && ` — ${selectedTierData.label}`}
                    {isCustom && customValue && ` — R$ ${parseFloat(customValue || "0").toFixed(2)}`}
                  </>
                )}
              </Button>

              {/* Selos de segurança */}
              <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3 h-3" />
                  <span>Criptografia SSL</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CreditCard className="w-3 h-3" />
                  <span>Powered by Stripe</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3 h-3 text-forest" />
                  <span>Transparência total</span>
                </div>
              </div>
            </div>
          </div>

          {/* Nota de transparência */}
          <p className="text-center text-white/50 text-xs mt-6 max-w-lg mx-auto">
            72% dos recursos são aplicados diretamente em programas socioambientais.
            Consulte nosso{" "}
            <Link href="/transparencia" className="text-white/70 underline hover:text-white transition-colors">
              Relatório de Transparência
            </Link>{" "}
            para detalhes completos.
          </p>
        </div>
      </div>
    </section>
  );
}

// ── Página Principal ──────────────────────────────────────────────────────────
export default function Apoie() {
  return (
    <div className="pt-20">
      {/* ── Hero ── */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="Apoie o Instituto" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-forest-dark/80" />
        </div>
        <div className="relative container text-center text-white">
          <span className="section-label block mb-4 text-white/60">Faça parte</span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6">
            Como Apoiar
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
            Existem muitas formas de contribuir para a missão do Instituto Ubatuba. Encontre a que melhor se encaixa no seu perfil.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <a href="#doacoes" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-forest font-semibold rounded-sm hover:bg-white/90 transition-colors">
              <Heart className="w-4 h-4" />
              Fazer uma doação
            </a>
            <a href="#voluntariado" className="inline-flex items-center gap-2 px-8 py-3.5 border border-white/40 text-white font-semibold rounded-sm hover:bg-white/10 transition-colors">
              Ser voluntário
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ── Seção de Doações com Stripe ── */}
      <SecaoDoacoes />

      {/* ── Outras formas de apoio ── */}
      <section className="section-padding bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <span className="section-label block mb-4">Outras Formas de Contribuição</span>
            <h2 className="section-title mx-auto mb-4">Além das doações</h2>
            <p className="section-subtitle mx-auto">
              Voluntariado e parcerias são igualmente essenciais para ampliar nosso impacto em Ubatuba.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {formasApoio.map((forma) => (
              <div key={forma.id} id={forma.id} className="card-elegant p-8 flex flex-col">
                <div className={`w-14 h-14 rounded-full ${forma.iconBg} flex items-center justify-center mb-6`}>
                  <forma.icon className="w-6 h-6 text-white" />
                </div>
                <span className={`text-xs font-semibold tracking-widest uppercase mb-2 block ${forma.color}`}>
                  {forma.subtitulo}
                </span>
                <h3 className="text-2xl font-extrabold text-foreground mb-4">{forma.titulo}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm mb-6">{forma.descricao}</p>

                <ul className="space-y-3 mb-8 flex-1">
                  {forma.beneficios.map((b, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <CheckCircle className={`w-4 h-4 mt-0.5 shrink-0 ${forma.color}`} />
                      <span className="text-muted-foreground">{b}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/contato"
                  className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-sm text-sm font-semibold transition-all duration-200 active:scale-[0.98] ${
                    forma.id === "voluntariado"
                      ? "bg-forest text-white hover:bg-forest-dark"
                      : "bg-ocean text-white hover:bg-ocean/90"
                  }`}
                >
                  {forma.cta}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Por que apoiar ── */}
      <section className="section-padding bg-sand">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="section-label block mb-4">Por que apoiar</span>
              <h2 className="section-title mb-6">
                Seu apoio gera impacto real
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                O Instituto Ubatuba opera com total transparência e compromisso com resultados mensuráveis. Cada recurso recebido é aplicado diretamente nos programas que atendem crianças, jovens e famílias de Ubatuba.
              </p>
              <div className="grid grid-cols-2 gap-6 mb-8">
                {[
                  { num: "7.500+", label: "Aulas ministradas" },
                  { num: "5.000+", label: "Exames e atendimentos" },
                  { num: "8+", label: "Projetos ativos" },
                  { num: "3", label: "Bolsas de estudo" },
                ].map((stat, i) => (
                  <div key={i} className="text-center p-5 bg-white rounded-lg border border-border/60">
                    <div className="text-3xl font-extrabold text-forest mb-1">{stat.num}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
              <Link href="/programas" className="btn-outline">
                Ver nossos programas <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-4">
              {[
                { titulo: "Transparência total", desc: "Publicamos relatórios periódicos com a aplicação de todos os recursos recebidos." },
                { titulo: "Impacto mensurável", desc: "Monitoramos e comunicamos os resultados de cada programa com dados concretos." },
                { titulo: "Alinhamento com ODS", desc: "Nossas ações estão alinhadas à Agenda 2030 e à ODS 17 — Parcerias e Meios de Implementação." },
                { titulo: "Comunidade local", desc: "100% dos beneficiários são moradores de Ubatuba e região, gerando impacto local." },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-5 bg-white rounded-lg border border-border/60">
                  <div className="w-8 h-8 rounded-full bg-forest/10 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-forest" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm mb-1">{item.titulo}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Parceiros ── */}
      <section id="empresas" className="section-padding bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <span className="section-label block mb-4">Parceiros Institucionais</span>
            <h2 className="section-title mx-auto mb-4">Quem já apoia o instituto</h2>
            <p className="section-subtitle mx-auto">
              Organizações e empresas que compartilham nossa visão de um futuro mais sustentável para Ubatuba.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
            {empresasParceiras.map((p, i) => (
              <div key={i} className="card-elegant p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-forest/10 flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-5 h-5 text-forest" />
                </div>
                <span className="text-xs font-semibold tracking-widest uppercase text-earth block mb-2">{p.tipo}</span>
                <h4 className="text-base font-extrabold text-foreground mb-2">{p.nome}</h4>
                <p className="text-xs text-muted-foreground">{p.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA para novas parcerias */}
          <div className="text-center p-10 rounded-xl bg-forest/5 border border-forest/20 max-w-2xl mx-auto">
            <Leaf className="w-10 h-10 text-forest mx-auto mb-4" />
            <h3 className="text-2xl font-extrabold text-foreground mb-3">
              Seja um parceiro do Instituto Ubatuba
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Sua empresa pode fazer parte de uma iniciativa reconhecida de conservação socioambiental, com visibilidade, impacto e alinhamento aos critérios ESG.
            </p>
            <Link href="/contato" className="btn-primary">
              Fale conosco sobre parcerias
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
