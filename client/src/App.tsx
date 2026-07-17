import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
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
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
