import { Link } from "wouter";
import { CheckCircle2, Heart, Leaf, ArrowRight, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Obrigado() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleShare = async () => {
    const text = "Acabei de apoiar o Instituto Ubatuba Santuário Ecológico! 🌿 Juntos pela conservação socioambiental de Ubatuba e pela ODS 17 — Parcerias.";
    if (navigator.share) {
      await navigator.share({ text, url: "https://institutoubatuba.org" });
    } else {
      await navigator.clipboard.writeText(text);
      alert("Mensagem copiada! Compartilhe nas suas redes sociais.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 flex items-center justify-center py-32 px-4">
        <div
          className="max-w-lg w-full text-center"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
          }}
        >
          {/* Ícone de sucesso */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-forest/10 flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-forest" strokeWidth={1.5} />
              </div>
              <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-earth/20 flex items-center justify-center">
                <Heart className="w-4 h-4 text-earth fill-earth" />
              </div>
            </div>
          </div>

          {/* Título */}
          <h1 className="text-4xl font-extrabold text-forest-dark mb-4">
            Muito obrigado!
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            Sua doação foi recebida com sucesso.
          </p>
          <p className="text-base text-muted-foreground/80 mb-10 leading-relaxed">
            Você acaba de fazer parte da história do Instituto Ubatuba Santuário Ecológico.
            Cada contribuição fortalece nossos programas socioambientais e transforma vidas em Ubatuba.
          </p>

          {/* Impacto */}
          <div className="bg-accent/60 border border-border/40 rounded-lg p-6 mb-10 text-left">
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="w-4 h-4 text-forest" />
              <span className="text-sm font-semibold text-forest uppercase tracking-wide">Seu impacto</span>
            </div>
            <ul className="space-y-2 text-sm text-foreground/80">
              <li className="flex items-start gap-2">
                <span className="text-forest mt-0.5">•</span>
                <span>Apoia escolinhas de surfe, futebol e futevolei para crianças de Ubatuba</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-forest mt-0.5">•</span>
                <span>Contribui com o Projeto Itaguá Azul de conservação marinha</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-forest mt-0.5">•</span>
                <span>Financia ações de saúde e bem-estar para famílias vulneráveis</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-forest mt-0.5">•</span>
                <span>Fortalece a ODS 17 — Parcerias e Meios de Implementação</span>
              </li>
            </ul>
          </div>

          {/* Ações */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={handleShare}
              variant="outline"
              className="gap-2 border-forest/30 text-forest hover:bg-forest/5"
            >
              <Share2 className="w-4 h-4" />
              Compartilhar
            </Button>
            <Link href="/">
              <Button className="gap-2 bg-forest hover:bg-forest-dark text-white w-full sm:w-auto">
                Voltar ao início
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Recibo */}
          <p className="mt-8 text-xs text-muted-foreground/60">
            Um recibo de pagamento foi enviado para o seu e-mail pelo Stripe.
            Guarde-o para fins de declaração de imposto de renda.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
