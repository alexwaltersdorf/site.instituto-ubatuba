import { ArrowLeft, Calendar, Tag, BookOpen } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { postsDemo } from "@/data/postsDemo";

interface Props {
  slug: string;
}

function formatDate(date: Date | null | undefined) {
  if (!date) return "";
  return new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(date));
}

export default function NoticiaDetalhe({ slug }: Props) {
  const { data: post, isLoading, error } = trpc.posts.bySlug.useQuery({ slug });

  // Fallback: se o banco não retornar o post, buscar nos dados demo
  const demoPost = postsDemo.find((p) => p.slug === slug);
  const displayPost = post || demoPost;

  if (isLoading) {
    return (
      <div className="pt-20 min-h-screen">
        <div className="container py-20">
          <div className="max-w-3xl mx-auto animate-pulse space-y-6">
            <div className="h-6 bg-muted rounded w-1/4" />
            <div className="h-10 bg-muted rounded" />
            <div className="h-4 bg-muted rounded w-1/3" />
            <div className="h-64 bg-muted rounded-lg" />
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded" />
              <div className="h-4 bg-muted rounded w-5/6" />
              <div className="h-4 bg-muted rounded w-4/5" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!displayPost) {
    return (
      <div className="pt-20 min-h-screen">
        <div className="container py-20 text-center">
          <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-6" />
          <h1 className="text-3xl font-extrabold text-foreground mb-4">Post não encontrado</h1>
          <p className="text-muted-foreground mb-8">O conteúdo que você está procurando não está disponível.</p>
          <Link href="/noticias" className="btn-outline">
            <ArrowLeft className="w-4 h-4" />
            Voltar para Notícias
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      {/* ── Hero com imagem de capa ── */}
      {displayPost.coverImage && (
        <div className="relative h-[50vh] overflow-hidden">
          <img
            src={displayPost.coverImage}
            alt={displayPost.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/80 via-forest-dark/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 container pb-12">
            {displayPost.category && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-white/70 mb-3 block">
                <Tag className="w-3 h-3" />
                {displayPost.category}
              </span>
            )}
            <h1 className="text-4xl md:text-5xl font-extrabold text-white max-w-3xl leading-tight">
              {displayPost.title}
            </h1>
          </div>
        </div>
      )}

      {/* ── Conteúdo ── */}
      <article className="section-padding bg-background">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-8">
              <Link href="/noticias" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-forest transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" />
                Notícias
              </Link>
              <span className="text-muted-foreground/40">/</span>
              <span className="text-sm text-muted-foreground truncate max-w-[200px]">{displayPost.title}</span>
            </div>

            {/* Título (se não houver imagem de capa) */}
            {!displayPost.coverImage && (
              <>
                {displayPost.category && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-earth mb-4 block">
                    <Tag className="w-3 h-3" />
                    {displayPost.category}
                  </span>
                )}
                <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6 leading-tight">
                  {displayPost.title}
                </h1>
              </>
            )}

            {/* Meta */}
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-border/40">
              {displayPost.publishedAt && (
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {formatDate(displayPost.publishedAt)}
                </span>
              )}
            </div>

            {/* Excerpt */}
            {displayPost.excerpt && (
              <p className="text-xl text-muted-foreground leading-relaxed mb-8 font-light italic border-l-4 border-forest/30 pl-6">
                {displayPost.excerpt}
              </p>
            )}

            {/* Conteúdo */}
            <div className="text-foreground leading-relaxed space-y-4">
              {displayPost.content && displayPost.content.length > 0 ? (
                displayPost.content.split("\n\n").map((paragraph, i) => (
                  <p key={i} className="text-base leading-[1.8] text-muted-foreground">
                    {paragraph}
                  </p>
                ))
              ) : (
                <p className="text-base leading-[1.8] text-muted-foreground">
                  {displayPost.excerpt}
                </p>
              )}
            </div>

            {/* Tags */}
            {displayPost.tags && (
              <div className="mt-10 pt-8 border-t border-border/40">
                <div className="flex flex-wrap gap-2">
                  {(typeof displayPost.tags === 'string' ? JSON.parse(displayPost.tags) : displayPost.tags).map((tag: string, i: number) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Navegação */}
            <div className="mt-12 pt-8 border-t border-border/40 flex items-center justify-between">
              <Link href="/noticias" className="flex items-center gap-2 text-sm font-medium text-forest hover:gap-3 transition-all">
                <ArrowLeft className="w-4 h-4" />
                Voltar para Notícias
              </Link>
              <Link href="/contato" className="text-sm font-medium text-muted-foreground hover:text-forest transition-colors">
                Entre em contato
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
