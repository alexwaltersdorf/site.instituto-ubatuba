import { useEffect } from "react";

/**
 * Hook para definir a URL canônica da página.
 * Cria ou atualiza a tag <link rel="canonical"> no <head>.
 * 
 * @param path - Caminho relativo da página (ex: "/sobre", "/noticias/slug")
 */
export function useCanonical(path: string) {
  useEffect(() => {
    const baseUrl = "https://www.institutoubatuba.org.br";
    const canonicalUrl = path === "/" ? baseUrl : `${baseUrl}${path}`;
    
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", canonicalUrl);

    return () => {
      // Cleanup: reset to home on unmount
      if (link) {
        link.setAttribute("href", baseUrl);
      }
    };
  }, [path]);
}

/**
 * Hook para definir a meta description da página.
 * Cria ou atualiza a tag <meta name="description"> no <head>.
 * 
 * @param description - Descrição da página (120-160 caracteres)
 */
export function useMetaDescription(description: string) {
  useEffect(() => {
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", description);
  }, [description]);
}

/**
 * Hook para definir as keywords da página.
 * Cria ou atualiza a tag <meta name="keywords"> no <head>.
 * 
 * @param keywords - Palavras-chave separadas por vírgula
 */
export function useKeywords(keywords: string) {
  useEffect(() => {
    let meta = document.querySelector('meta[name="keywords"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "keywords");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", keywords);
  }, [keywords]);
}

/**
 * Hook para definir as Open Graph tags da página.
 * Cria ou atualiza as tags og:title, og:description, og:image, og:url no <head>.
 */
export function useOpenGraph(options: {
  title: string;
  description: string;
  image?: string;
  url: string;
  type?: string;
}) {
  useEffect(() => {
    const { title, description, image, url, type = "website" } = options;
    
    const setOgTag = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("property", property);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    setOgTag("og:title", title);
    setOgTag("og:description", description);
    setOgTag("og:url", url);
    setOgTag("og:type", type);
    setOgTag("og:site_name", "Instituto Ubatuba Santuário Ecológico");
    setOgTag("og:locale", "pt_BR");
    
    if (image) {
      setOgTag("og:image", image);
      setOgTag("og:image:width", "1200");
      setOgTag("og:image:height", "630");
    }

    // Twitter Card tags
    let twitterCard = document.querySelector('meta[name="twitter:card"]') as HTMLMetaElement | null;
    if (!twitterCard) {
      twitterCard = document.createElement("meta");
      twitterCard.setAttribute("name", "twitter:card");
      document.head.appendChild(twitterCard);
    }
    twitterCard.setAttribute("content", "summary_large_image");
  }, [options.title, options.description, options.image, options.url, options.type]);
}

/**
 * Hook completo de SEO que combina todos os hooks acima.
 * Use este hook para configurar todas as meta tags de uma página de uma vez.
 */
export function useSEO(options: {
  title: string;
  description: string;
  keywords?: string;
  canonical: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}) {
  const baseUrl = "https://www.institutoubatuba.org.br";
  const canonicalUrl = options.canonical === "/" ? baseUrl : `${baseUrl}${options.canonical}`;

  useEffect(() => {
    document.title = options.title;
  }, [options.title]);

  useMetaDescription(options.description);
  useKeywords(options.keywords || "");
  useCanonical(options.canonical);
  
  useOpenGraph({
    title: options.ogTitle || options.title,
    description: options.ogDescription || options.description,
    image: options.ogImage || `${baseUrl}/og-image.png`,
    url: canonicalUrl,
  });
}
