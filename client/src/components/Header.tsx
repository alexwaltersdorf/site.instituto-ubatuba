import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Leaf, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const subItems = [
  { href: "/sobre", label: "Sobre Nós" },
  { href: "/programas", label: "Ações" },
  { href: "/galeria", label: "Galeria" },
  { href: "/noticias", label: "Notícias" },
  { href: "/contato", label: "Contato" },
];

// Caminhos que mantêm o item "Sobre Nós" ativo
const sobrePaths = subItems.map((i) => i.href);

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileSobreOpen, setMobileSobreOpen] = useState(false);
  const [location] = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
    setMobileSobreOpen(false);
  }, [location]);

  const isHome = location === "/";
  const isLight = scrolled || !isHome;
  const sobreActive = sobrePaths.includes(location);

  const openDropdown = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setDropdownOpen(true);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setDropdownOpen(false), 140);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isLight
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-border/40"
          : "bg-transparent"
      )}
    >
      <div className="container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
              isLight ? "bg-forest" : "bg-white/20 border border-white/40"
            )}>
              <Leaf className="w-5 h-5 text-white transition-colors" />
            </div>
            <div className="leading-tight">
              <span className={cn(
                "block font-serif font-semibold text-base tracking-tight transition-colors",
                isLight ? "text-forest-dark" : "text-white"
              )}>
                Instituto Ubatuba
              </span>
              <span className={cn(
                "block text-xs tracking-[0.12em] uppercase transition-colors",
                isLight ? "text-earth" : "text-white/70"
              )}>
                Santuário Ecológico
              </span>
            </div>
          </Link>

          {/* Nav Desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {/* Início */}
            <Link
              href="/"
              className={cn(
                "px-4 py-2 text-sm font-medium tracking-wide rounded-sm transition-all duration-200",
                location === "/"
                  ? isLight ? "text-forest bg-accent" : "text-white bg-white/15"
                  : isLight
                  ? "text-foreground/70 hover:text-forest hover:bg-accent/60"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              )}
            >
              Início
            </Link>

            {/* Sobre Nós (dropdown) */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={openDropdown}
              onMouseLeave={scheduleClose}
            >
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className={cn(
                  "flex items-center gap-1 px-4 py-2 text-sm font-medium tracking-wide rounded-sm transition-all duration-200",
                  sobreActive
                    ? isLight ? "text-forest bg-accent" : "text-white bg-white/15"
                    : isLight
                    ? "text-foreground/70 hover:text-forest hover:bg-accent/60"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                )}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                Sobre Nós
                <ChevronDown
                  className={cn(
                    "w-3.5 h-3.5 transition-transform duration-200",
                    dropdownOpen && "rotate-180"
                  )}
                />
              </button>

              {/* Dropdown menu */}
              <div
                className={cn(
                  "absolute left-0 top-full pt-2 w-56 transition-all duration-200 origin-top",
                  dropdownOpen
                    ? "opacity-100 visible translate-y-0"
                    : "opacity-0 invisible -translate-y-1 pointer-events-none"
                )}
              >
                <div className="bg-white rounded-md shadow-lg border border-border/50 overflow-hidden py-1.5">
                  {subItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "block px-4 py-2.5 text-sm font-medium transition-colors",
                        location === item.href
                          ? "text-forest bg-accent"
                          : "text-foreground/75 hover:text-forest hover:bg-accent/60"
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Transparência */}
            <Link
              href="/transparencia"
              className={cn(
                "px-4 py-2 text-sm font-medium tracking-wide rounded-sm transition-all duration-200",
                location === "/transparencia"
                  ? isLight ? "text-forest bg-accent" : "text-white bg-white/15"
                  : isLight
                  ? "text-foreground/70 hover:text-forest hover:bg-accent/60"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              )}
            >
              Transparência
            </Link>
          </nav>

          {/* CTA Desktop */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/apoie"
              className={cn(
                "px-6 py-2.5 text-sm font-semibold rounded-sm tracking-wide transition-all duration-200",
                isLight
                  ? "bg-forest text-white hover:bg-forest-dark shadow-sm hover:shadow-md hover:shadow-forest/20"
                  : "bg-white text-forest hover:bg-white/90"
              )}
            >
              Apoie o Instituto
            </Link>
          </div>

          {/* Menu Mobile */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={cn(
              "lg:hidden p-2 rounded-sm transition-colors",
              isLight ? "text-foreground hover:bg-accent" : "text-white hover:bg-white/10"
            )}
            aria-label="Menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Menu Mobile Dropdown */}
      <div
        className={cn(
          "lg:hidden overflow-hidden transition-all duration-300 ease-out bg-white border-t border-border/40",
          menuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav className="container py-4 flex flex-col gap-1">
          {/* Início */}
          <Link
            href="/"
            className={cn(
              "px-4 py-3 text-sm font-medium rounded-sm transition-colors",
              location === "/"
                ? "text-forest bg-accent font-semibold"
                : "text-foreground/70 hover:text-forest hover:bg-accent/60"
            )}
          >
            Início
          </Link>

          {/* Sobre Nós (acordeão) */}
          <button
            onClick={() => setMobileSobreOpen((v) => !v)}
            className={cn(
              "flex items-center justify-between px-4 py-3 text-sm font-medium rounded-sm transition-colors text-left",
              sobreActive
                ? "text-forest bg-accent font-semibold"
                : "text-foreground/70 hover:text-forest hover:bg-accent/60"
            )}
            aria-expanded={mobileSobreOpen}
          >
            Sobre Nós
            <ChevronDown
              className={cn(
                "w-4 h-4 transition-transform duration-200",
                mobileSobreOpen && "rotate-180"
              )}
            />
          </button>
          <div
            className={cn(
              "overflow-hidden transition-all duration-300 ease-out",
              mobileSobreOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
            )}
          >
            <div className="flex flex-col gap-1 pl-3 border-l-2 border-accent ml-4 my-1">
              {subItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-4 py-2.5 text-sm font-medium rounded-sm transition-colors",
                    location === item.href
                      ? "text-forest bg-accent font-semibold"
                      : "text-foreground/65 hover:text-forest hover:bg-accent/60"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Transparência */}
          <Link
            href="/transparencia"
            className={cn(
              "px-4 py-3 text-sm font-medium rounded-sm transition-colors",
              location === "/transparencia"
                ? "text-forest bg-accent font-semibold"
                : "text-foreground/70 hover:text-forest hover:bg-accent/60"
            )}
          >
            Transparência
          </Link>

          <Link
            href="/apoie"
            className="mt-2 px-4 py-3 bg-forest text-white text-sm font-semibold rounded-sm text-center hover:bg-forest-dark transition-colors"
          >
            Apoie o Instituto
          </Link>
        </nav>
      </div>
    </header>
  );
}
