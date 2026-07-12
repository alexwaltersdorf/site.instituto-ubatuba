import { Heart, Mail, MessageCircle } from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect } from "react";

export default function FloatingSidebar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-3 animate-fade-in">
      {/* Doar */}
      <Link
        href="/apoie#doacoes"
        className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-earth text-white shadow-lg hover:scale-110 transition-all duration-200 hover:shadow-xl"
      >
        <Heart className="w-5 h-5" />
        <span className="absolute right-full mr-3 px-3 py-1.5 bg-foreground text-background text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Doe Agora
        </span>
      </Link>

      {/* Newsletter */}
      <a
        href="#newsletter"
        className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-forest text-white shadow-lg hover:scale-110 transition-all duration-200 hover:shadow-xl"
      >
        <Mail className="w-5 h-5" />
        <span className="absolute right-full mr-3 px-3 py-1.5 bg-foreground text-background text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Newsletter
        </span>
      </a>

      {/* Contato */}
      <Link
        href="/contato"
        className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-[oklch(0.55_0.15_145)] text-white shadow-lg hover:scale-110 transition-all duration-200 hover:shadow-xl"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="absolute right-full mr-3 px-3 py-1.5 bg-foreground text-background text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Contato
        </span>
      </Link>
    </div>
  );
}
