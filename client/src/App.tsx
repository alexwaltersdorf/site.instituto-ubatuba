import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Sobre from "./pages/Sobre";
import Programas from "./pages/Programas";
import Galeria from "./pages/Galeria";
import Apoie from "./pages/Apoie";
import Contato from "./pages/Contato";
import Noticias from "./pages/Noticias";
import NoticiaDetalhe from "./pages/NoticiaDetalhe";
import Transparencia from "./pages/Transparencia";
import Obrigado from "./pages/Obrigado";
import Mascotes from "./pages/Mascotes";
import EmendasParlamentares from "./pages/EmendasParlamentares";
import Cursos from "./pages/Cursos";
import CursoDetalhe from "./pages/CursoDetalhe";
import MeusCertificados from "./pages/MeusCertificados";
import CertificadoVerificar from "./pages/CertificadoVerificar";

/**
 * SPAs mantêm a posição de scroll ao trocar de rota — quem clicava num
 * card no fim da lista chegava à página seguinte já rolada até o rodapé.
 * Este componente rola para o topo a cada navegação. Âncoras (#secao,
 * ex.: /#acoes no menu) são preservadas: nesse caso rolamos até o alvo.
 */
function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <Layout><Home /></Layout>} />
      <Route path="/sobre" component={() => <Layout><Sobre /></Layout>} />
      <Route path="/programas" component={() => <Layout><Programas /></Layout>} />
      <Route path="/galeria" component={() => <Layout><Galeria /></Layout>} />
      <Route path="/apoie" component={() => <Layout><Apoie /></Layout>} />
      <Route path="/contato" component={() => <Layout><Contato /></Layout>} />
      <Route path="/noticias" component={() => <Layout><Noticias /></Layout>} />
      <Route path="/noticias/:slug" component={({ params }) => <Layout><NoticiaDetalhe slug={params.slug} /></Layout>} />
      <Route path="/transparencia" component={() => <Layout><Transparencia /></Layout>} />
      <Route path="/mascotes" component={() => <Layout><Mascotes /></Layout>} />
      <Route path="/emendas-parlamentares" component={() => <Layout><EmendasParlamentares /></Layout>} />
      <Route path="/cursos" component={() => <Layout><Cursos /></Layout>} />
      <Route path="/cursos/:slug" component={() => <Layout><CursoDetalhe /></Layout>} />
      <Route path="/meus-certificados" component={() => <Layout><MeusCertificados /></Layout>} />
      <Route path="/certificado/:code" component={() => <Layout><CertificadoVerificar /></Layout>} />
      <Route path="/obrigado" component={() => <Obrigado />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <ScrollToTop />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
