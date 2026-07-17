/**
 * SEO Routes Metadata
 * 
 * Mapeamento centralizado de meta tags por rota.
 * Cada nova página DEVE ser registrada aqui para garantir SEO correto.
 * 
 * Campos:
 * - title: 30-60 caracteres, aparece na aba do navegador e nos resultados do Google
 * - description: 120-160 caracteres, resumo para motores de busca
 * - keywords: palavras-chave separadas por vírgula
 * - ogTitle: título para redes sociais (Open Graph)
 * - ogDescription: descrição para redes sociais
 * - ogImage: URL da imagem para compartilhamento (1200x630px)
 * - canonical: URL canônica completa da página
 * - priority: prioridade no sitemap (0.0 a 1.0)
 * - changefreq: frequência de atualização (always, hourly, daily, weekly, monthly, yearly, never)
 */

export interface RouteMetadata {
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  canonical: string;
  priority: number;
  changefreq: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
}

const SITE_URL = "https://www.institutoubatuba.org.br";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export const routesMetadata: Record<string, RouteMetadata> = {
  "": {
    title: "Instituto Ubatuba Santuário Ecológico | Saúde, Esporte e Meio Ambiente",
    description: "Instituto Ubatuba promove conservação socioambiental em Ubatuba-SP por meio de esporte social, saúde comunitária e preservação ambiental. Conheça nossas ações.",
    keywords: "instituto ubatuba, santuário ecológico, conservação ambiental, esporte social, saúde comunitária, ubatuba, ONG ubatuba",
    ogTitle: "Instituto Ubatuba Santuário Ecológico",
    ogDescription: "Promovendo saúde, esporte e meio ambiente para as comunidades de Ubatuba. Some com a gente e faça parte da rede.",
    ogImage: DEFAULT_OG_IMAGE,
    canonical: SITE_URL,
    priority: 1.0,
    changefreq: "weekly",
  },
  "sobre": {
    title: "Sobre Nós | Instituto Ubatuba Santuário Ecológico",
    description: "Conheça a história, missão, visão e valores do Instituto Ubatuba. Atuamos desde 2019 promovendo inclusão social, saúde e conservação ambiental em Ubatuba-SP.",
    keywords: "sobre instituto ubatuba, história, missão, visão, valores, ODS, conservação, ubatuba",
    ogTitle: "Sobre o Instituto Ubatuba",
    ogDescription: "Nossa história, missão e valores. Atuamos com saúde, esporte social e meio ambiente em Ubatuba-SP.",
    ogImage: DEFAULT_OG_IMAGE,
    canonical: `${SITE_URL}/sobre`,
    priority: 0.8,
    changefreq: "monthly",
  },
  "programas": {
    title: "Ações e Programas | Instituto Ubatuba Santuário Ecológico",
    description: "Conheça os programas do Instituto Ubatuba: Escolinhas de Surfe, Futebol e Futevôlei, Ações de Saúde, Projeto Itaguá Azul, Bituqueira Ecológica e mais.",
    keywords: "programas sociais ubatuba, escolinha de surfe, futebol social, saúde comunitária, itaguá azul, bituqueira ecológica",
    ogTitle: "Ações e Programas | Instituto Ubatuba",
    ogDescription: "Escolinhas de Surfe, Futebol, Futevôlei, Ações de Saúde, Projeto Itaguá Azul e Bituqueira Ecológica.",
    ogImage: DEFAULT_OG_IMAGE,
    canonical: `${SITE_URL}/programas`,
    priority: 0.9,
    changefreq: "monthly",
  },
  "galeria": {
    title: "Galeria de Fotos | Instituto Ubatuba Santuário Ecológico",
    description: "Veja fotos das atividades do Instituto Ubatuba: esportes, ações de saúde, conservação ambiental, festivais culturais e muito mais.",
    keywords: "galeria fotos ubatuba, fotos esporte social, fotos conservação ambiental, instituto ubatuba fotos",
    ogTitle: "Galeria de Fotos | Instituto Ubatuba",
    ogDescription: "Registros fotográficos das nossas ações em esporte, saúde e meio ambiente em Ubatuba.",
    ogImage: DEFAULT_OG_IMAGE,
    canonical: `${SITE_URL}/galeria`,
    priority: 0.7,
    changefreq: "weekly",
  },
  "apoie": {
    title: "Apoie o Instituto Ubatuba | Doe, Seja Voluntário ou Parceiro",
    description: "Apoie o Instituto Ubatuba: faça uma doação, seja voluntário ou torne-se parceiro institucional. Juntos transformamos vidas em Ubatuba-SP.",
    keywords: "doar instituto ubatuba, voluntário ubatuba, parceiro ONG, apoiar conservação, doação social ubatuba",
    ogTitle: "Apoie o Instituto Ubatuba",
    ogDescription: "Faça uma doação, seja voluntário ou torne-se parceiro. Juntos transformamos vidas em Ubatuba.",
    ogImage: DEFAULT_OG_IMAGE,
    canonical: `${SITE_URL}/apoie`,
    priority: 0.9,
    changefreq: "monthly",
  },
  "contato": {
    title: "Contato | Instituto Ubatuba Santuário Ecológico",
    description: "Entre em contato com o Instituto Ubatuba. Envie sua mensagem, visite nosso endereço em Ubatuba-SP ou ligue para nós. Estamos prontos para atender.",
    keywords: "contato instituto ubatuba, endereço ubatuba, telefone instituto ubatuba, fale conosco",
    ogTitle: "Contato | Instituto Ubatuba",
    ogDescription: "Entre em contato conosco. Estamos em Ubatuba-SP prontos para atender você.",
    ogImage: DEFAULT_OG_IMAGE,
    canonical: `${SITE_URL}/contato`,
    priority: 0.7,
    changefreq: "monthly",
  },
  "noticias": {
    title: "Notícias e Blog | Instituto Ubatuba Santuário Ecológico",
    description: "Acompanhe as últimas notícias do Instituto Ubatuba: ações realizadas, eventos, parcerias e resultados dos nossos programas socioambientais.",
    keywords: "notícias instituto ubatuba, blog ONG ubatuba, ações sociais ubatuba, eventos ubatuba",
    ogTitle: "Notícias | Instituto Ubatuba",
    ogDescription: "Últimas notícias e artigos sobre nossas ações em saúde, esporte e meio ambiente.",
    ogImage: DEFAULT_OG_IMAGE,
    canonical: `${SITE_URL}/noticias`,
    priority: 0.8,
    changefreq: "weekly",
  },
  "transparencia": {
    title: "Transparência e Governança | Instituto Ubatuba Santuário Ecológico",
    description: "Acesse documentos públicos, relatórios financeiros, estatuto social e informações de governança do Instituto Ubatuba. Compromisso com a transparência.",
    keywords: "transparência ONG, governança instituto ubatuba, relatório financeiro, estatuto social, prestação de contas",
    ogTitle: "Transparência | Instituto Ubatuba",
    ogDescription: "Documentos públicos, relatórios financeiros e informações de governança. Nosso compromisso com a transparência.",
    ogImage: DEFAULT_OG_IMAGE,
    canonical: `${SITE_URL}/transparencia`,
    priority: 0.8,
    changefreq: "monthly",
  },
  "mascotes": {
    title: "Mascotes | Instituto Ubatuba Santuário Ecológico",
    description: "Conheça os mascotes do Instituto Ubatuba: personagens que representam a fauna local e educam sobre conservação ambiental de forma lúdica.",
    keywords: "mascotes instituto ubatuba, personagens fauna, educação ambiental, conservação lúdica, animais ubatuba",
    ogTitle: "Mascotes | Instituto Ubatuba",
    ogDescription: "Personagens que representam a fauna local e educam sobre conservação ambiental.",
    ogImage: DEFAULT_OG_IMAGE,
    canonical: `${SITE_URL}/mascotes`,
    priority: 0.6,
    changefreq: "monthly",
  },
  "obrigado": {
    title: "Obrigado pela Doação | Instituto Ubatuba",
    description: "Agradecemos sua contribuição ao Instituto Ubatuba. Sua doação ajuda a transformar vidas em Ubatuba através de esporte, saúde e conservação ambiental.",
    keywords: "obrigado doação, confirmação pagamento, instituto ubatuba",
    ogTitle: "Obrigado! | Instituto Ubatuba",
    ogDescription: "Sua doação faz a diferença. Obrigado por apoiar o Instituto Ubatuba.",
    ogImage: DEFAULT_OG_IMAGE,
    canonical: `${SITE_URL}/obrigado`,
    priority: 0.3,
    changefreq: "yearly",
  },
  "cursos": {
    title: "Cursos Gratuitos | Instituto Ubatuba Santuário Ecológico",
    description: "Acesse cursos gratuitos de universidades como Harvard, MIT, USP, FGV e plataformas governamentais. Educação de qualidade para todos, com certificado do Instituto Ubatuba.",
    keywords: "cursos gratuitos, harvard, mit, usp, fgv, educação gratuita, certificado, instituto ubatuba",
    ogTitle: "Cursos Gratuitos | Instituto Ubatuba",
    ogDescription: "Cursos gratuitos das melhores universidades do mundo com certificado do Instituto Ubatuba.",
    ogImage: DEFAULT_OG_IMAGE,
    canonical: `${SITE_URL}/cursos`,
    priority: 0.9,
    changefreq: "weekly",
  },
  "meus-certificados": {
    title: "Meus Cursos e Certificados | Instituto Ubatuba",
    description: "Acompanhe seus cursos em andamento e certificados emitidos pelo Instituto Ubatuba.",
    keywords: "meus cursos, certificados, progresso, instituto ubatuba",
    ogTitle: "Meus Certificados | Instituto Ubatuba",
    ogDescription: "Acompanhe seus cursos e certificados no Instituto Ubatuba.",
    ogImage: DEFAULT_OG_IMAGE,
    canonical: `${SITE_URL}/meus-certificados`,
    priority: 0.4,
    changefreq: "monthly",
  },
};

/**
 * Retorna os metadados de uma rota específica.
 * Se a rota não existir, retorna os metadados padrão (home).
 */
export function getRouteMetadata(path: string): RouteMetadata {
  // Remove leading slash and trailing slash
  const cleanPath = path.replace(/^\//, "").replace(/\/$/, "");
  
  // Check for exact match
  if (routesMetadata[cleanPath]) {
    return routesMetadata[cleanPath];
  }
  
  // Check for dynamic blog routes
  if (cleanPath.startsWith("noticias/")) {
    const slug = cleanPath.replace("noticias/", "");
    return {
      title: `${formatSlugToTitle(slug)} | Instituto Ubatuba`,
      description: `Leia sobre ${formatSlugToTitle(slug).toLowerCase()} no blog do Instituto Ubatuba Santuário Ecológico.`,
      keywords: `${slug.replace(/-/g, ", ")}, instituto ubatuba, blog`,
      ogTitle: `${formatSlugToTitle(slug)} | Instituto Ubatuba`,
      ogDescription: `Artigo do Instituto Ubatuba sobre ${formatSlugToTitle(slug).toLowerCase()}.`,
      ogImage: DEFAULT_OG_IMAGE,
      canonical: `${SITE_URL}/noticias/${slug}`,
      priority: 0.7,
      changefreq: "monthly",
    };
  }

  // Check for dynamic course routes
  if (cleanPath.startsWith("cursos/")) {
    const slug = cleanPath.replace("cursos/", "");
    return {
      title: `${formatSlugToTitle(slug)} | Cursos Gratuitos | Instituto Ubatuba`,
      description: `Curso gratuito: ${formatSlugToTitle(slug)}. Acesse na plataforma parceira e receba certificado do Instituto Ubatuba.`,
      keywords: `${slug.replace(/-/g, ", ")}, curso gratuito, instituto ubatuba, certificado`,
      ogTitle: `${formatSlugToTitle(slug)} | Cursos | Instituto Ubatuba`,
      ogDescription: `Curso gratuito com certificado do Instituto Ubatuba.`,
      ogImage: DEFAULT_OG_IMAGE,
      canonical: `${SITE_URL}/cursos/${slug}`,
      priority: 0.7,
      changefreq: "monthly",
    };
  }
  
  // Default to home metadata
  return routesMetadata[""];
}

/**
 * Converte slug para título legível
 */
function formatSlugToTitle(slug: string): string {
  return slug
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Retorna todas as rotas estáticas para o sitemap
 */
export function getAllStaticRoutes(): Array<{ path: string; metadata: RouteMetadata }> {
  return Object.entries(routesMetadata)
    .filter(([path]) => path !== "obrigado") // Exclude thank-you page from sitemap
    .map(([path, metadata]) => ({
      path: path === "" ? "/" : `/${path}`,
      metadata,
    }));
}

export { SITE_URL };
