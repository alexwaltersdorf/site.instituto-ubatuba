import { Link } from "wouter";
import { Leaf, Mail, MapPin, Phone, Instagram, Facebook, Shield, ArrowRight, Heart, Send, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function Footer() {
  const [email, setEmail] = useState("");
  const subscribeMutation = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => {
      toast.success("Inscrição realizada com sucesso! Você receberá nossas novidades em breve.");
      setEmail("");
    },
    onError: (err) => {
      if (err.message?.includes("Duplicate")) {
        toast.info("Este e-mail já está inscrito na nossa newsletter.");
        setEmail("");
      } else {
        toast.error("Erro ao realizar inscrição. Tente novamente.");
      }
    },
  });

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    subscribeMutation.mutate({ email: email.trim() });
  };

  return (
    <footer className="bg-forest-dark text-white/80">
      {/* ── Newsletter Banner (estilo SOS) ── */}
      <div id="newsletter" className="bg-forest border-b border-white/10">
        <div className="container py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-extrabold text-white mb-2">
                Receba nossas novidades
              </h3>
              <p className="text-sm text-white/60">
                Cadastre-se e fique por dentro das ações do Instituto Ubatuba.
              </p>
            </div>
            <form onSubmit={handleNewsletter} className="flex w-full md:w-auto gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu melhor e-mail"
                required
                disabled={subscribeMutation.isPending}
                className="flex-1 md:w-72 px-4 py-3 bg-white/10 border border-white/20 rounded-sm text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-ocean/60 transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={subscribeMutation.isPending}
                className="inline-flex items-center gap-2 px-6 py-3 bg-ocean text-white font-semibold text-sm rounded-sm hover:bg-ocean/90 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {subscribeMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">Inscrever</span>
              </button>
            </form>
          </div>
          <p className="text-xs text-white/30 mt-4 text-center md:text-left">
            Ao se inscrever, você concorda com nossa Política de Privacidade (LGPD). Seus dados não serão compartilhados com terceiros.
          </p>
        </div>
      </div>

      {/* ── Conteúdo principal do footer ── */}
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Coluna 1 — Identidade */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-forest-light/30 border border-white/20 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="block font-extrabold text-white text-base">Instituto Ubatuba</span>
                <span className="block text-xs tracking-[0.12em] uppercase text-white/50">Santuário Ecológico</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-white/60 mb-6">
              Água limpa é vida — e proteger a nossa começa aqui. Saúde, esporte e meio ambiente para as comunidades de Ubatuba.
            </p>
            {/* Redes sociais */}
            <div>
              <span className="block text-xs tracking-[0.12em] uppercase text-white/40 mb-3">Siga-nos</span>
              <div className="flex items-center gap-3">
                <a href="https://www.instagram.com/instituto.ubatuba" target="_blank" rel="noopener noreferrer"
                  aria-label="Instagram do Instituto Ubatuba"
                  className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 hover:border-white/40 transition-all">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="https://www.facebook.com/institutoubatuba" target="_blank" rel="noopener noreferrer"
                  aria-label="Facebook do Instituto Ubatuba"
                  className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 hover:border-white/40 transition-all">
                  <Facebook className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Coluna 2 — Navegação */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-[0.12em] uppercase mb-5">Navegação</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-sm text-white/60 hover:text-white transition-colors">
                  Início
                </Link>
              </li>
              <li className="pt-1">
                <Link href="/sobre" className="text-sm font-medium text-white/75 hover:text-white transition-colors">
                  Sobre Nós
                </Link>
                <ul className="mt-2.5 space-y-2.5 pl-3 border-l border-white/10">
                  {[
                    { href: "/programas", label: "Ações e Projetos" },
                    { href: "/galeria", label: "Galeria" },
                    { href: "/noticias", label: "Notícias" },
                    { href: "/contato", label: "Contato" },
                  ].map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-sm text-white/55 hover:text-white transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="pt-1">
                <Link href="/transparencia" className="text-sm text-white/60 hover:text-white transition-colors">
                  Transparência
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3 — Links Rápidos */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-[0.12em] uppercase mb-5">Links Rápidos</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/apoie" className="group flex items-center gap-2.5 text-sm text-white/60 hover:text-white transition-colors">
                  <Heart className="w-4 h-4 text-ocean shrink-0" />
                  Apoie o Instituto
                </Link>
              </li>
              <li>
                <Link href="/transparencia" className="group flex items-center gap-2.5 text-sm text-white/60 hover:text-white transition-colors">
                  <Shield className="w-4 h-4 text-ocean shrink-0" />
                  Compliance &amp; Transparência
                </Link>
              </li>
              <li>
                <a href="https://www.instagram.com/instituto.ubatuba" target="_blank" rel="noopener noreferrer"
                  className="group flex items-center gap-2.5 text-sm text-white/60 hover:text-white transition-colors">
                  <Instagram className="w-4 h-4 text-ocean shrink-0" />
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/institutoubatuba" target="_blank" rel="noopener noreferrer"
                  className="group flex items-center gap-2.5 text-sm text-white/60 hover:text-white transition-colors">
                  <Facebook className="w-4 h-4 text-ocean shrink-0" />
                  Facebook
                </a>
              </li>
            </ul>
            <div className="mt-6">
              <Link
                href="/apoie"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-ocean/80 text-white text-sm font-semibold rounded-sm hover:bg-ocean transition-colors"
              >
                Faça uma Doação
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Coluna 4 — Contato */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-[0.12em] uppercase mb-5">Contato</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-ocean mt-0.5 shrink-0" />
                <span className="text-sm text-white/60">
                  Ubatuba, São Paulo — Brasil<br />
                  Litoral Norte do Estado
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-ocean shrink-0" />
                <a href="mailto:ubatuba@institutoubatuba.org" className="text-sm text-white/60 hover:text-white transition-colors">
                  ubatuba@institutoubatuba.org
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-ocean shrink-0" />
                <span className="text-sm text-white/60">(12) 99999-0000</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Linha divisória */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <p className="text-xs text-white/40">
              © {new Date().getFullYear()} Instituto Ubatuba Santuário Ecológico.
            </p>
            <Link href="/transparencia" className="text-xs text-white/40 hover:text-white/70 transition-colors underline underline-offset-2">
              Compliance &amp; Transparência
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/40">Alinhado à</span>
            <span className="text-xs font-semibold text-ocean/80 tracking-wide">ODS 17 — Parcerias e Meios de Implementação</span>
            <span className="text-xs text-white/40">·</span>
            <span className="text-xs text-white/40">Agenda 2030</span>
          </div>
        </div>
      </div>

      {/* Onda dupla — assinatura gráfica do manual de marca (azul + amarela) */}
      <div className="w-full overflow-hidden leading-[0]">
        <svg viewBox="0 0 1440 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-6" preserveAspectRatio="none">
          <path d="M0,12 C360,24 720,0 1080,12 C1260,18 1380,6 1440,12 L1440,24 L0,24 Z" fill="var(--color-azul-oceano)" />
          <path d="M0,18 C360,24 720,12 1080,18 C1260,21 1380,15 1440,18 L1440,24 L0,24 Z" fill="var(--color-amarelo-sol)" />
        </svg>
      </div>
    </footer>
  );
}
