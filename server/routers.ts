import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  completeCourse,
  createCertificate,
  createContact,
  createCourse,
  createEthicsReport,
  createGalleryItem,
  createPost,
  deletePost,
  enrollInCourse,
  getActiveCourses,
  getAllCourses,
  getAllPosts,
  getCertificateByCode,
  getContacts,
  getCourseById,
  getCourseBySlug,
  getEnrollment,
  getEthicsReportByProtocol,
  getEthicsReports,
  getFeaturedCourses,
  getFeaturedGallery,
  getGalleryItems,
  getPostBySlug,
  getPublishedPosts,
  getUserCertificates,
  getUserEnrollments,
  subscribeNewsletter,
  updatePost,
} from "./db";
import { notifyOwner } from "./_core/notification";
import Stripe from "stripe";
import { DONATION_TIERS, DONATION_CURRENCY, DONATION_PRODUCT_NAME, DONATION_PRODUCT_DESCRIPTION } from "./stripe-products";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Acesso restrito a administradores." });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  /* ── Blog / Posts ── */
  posts: router({
    list: publicProcedure
      .input(z.object({ limit: z.number().min(1).max(50).default(10), offset: z.number().min(0).default(0) }).optional())
      .query(async ({ input }) => {
        return getPublishedPosts(input?.limit ?? 10, input?.offset ?? 0);
      }),

    bySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const post = await getPostBySlug(input.slug);
        if (!post) throw new TRPCError({ code: "NOT_FOUND", message: "Post não encontrado." });
        return post;
      }),

    // Admin: listar todos (incluindo rascunhos)
    adminList: adminProcedure
      .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }).optional())
      .query(async ({ input }) => {
        return getAllPosts(input?.limit ?? 50, input?.offset ?? 0);
      }),

    create: adminProcedure
      .input(
        z.object({
          slug: z.string().min(1),
          title: z.string().min(1),
          excerpt: z.string().optional(),
          content: z.string().min(1),
          coverImage: z.string().optional(),
          category: z.string().optional(),
          tags: z.string().optional(),
          published: z.boolean().default(false),
        })
      )
      .mutation(async ({ input, ctx }) => {
        await createPost({
          ...input,
          authorId: ctx.user.id,
          publishedAt: input.published ? new Date() : undefined,
        });
        return { success: true };
      }),

    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          slug: z.string().optional(),
          title: z.string().optional(),
          excerpt: z.string().optional(),
          content: z.string().optional(),
          coverImage: z.string().optional(),
          category: z.string().optional(),
          tags: z.string().optional(),
          published: z.boolean().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        if (data.published) (data as Record<string, unknown>).publishedAt = new Date();
        await updatePost(id, data);
        return { success: true };
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deletePost(input.id);
        return { success: true };
      }),
  }),

  /* ── Galeria ── */
  gallery: router({
    list: publicProcedure
      .input(z.object({ category: z.string().optional() }).optional())
      .query(async ({ input }) => {
        return getGalleryItems(input?.category);
      }),

    featured: publicProcedure.query(async () => {
      return getFeaturedGallery();
    }),

    create: adminProcedure
      .input(
        z.object({
          title: z.string().optional(),
          description: z.string().optional(),
          imageUrl: z.string().min(1),
          imageKey: z.string().optional(),
          category: z.string().optional(),
          featured: z.boolean().default(false),
          sortOrder: z.number().default(0),
        })
      )
      .mutation(async ({ input }) => {
        await createGalleryItem(input);
        return { success: true };
      }),
  }),

  /* ── Contato ── */
  contact: router({
    submit: publicProcedure
      .input(
        z.object({
          name: z.string().min(2, "Nome obrigatório"),
          email: z.string().email("E-mail inválido"),
          phone: z.string().optional(),
          subject: z.string().optional(),
          message: z.string().min(10, "Mensagem muito curta"),
          type: z.enum(["geral", "voluntariado", "doacao", "parceria", "imprensa"]).default("geral"),
        })
      )
      .mutation(async ({ input }) => {
        await createContact(input);
        // Notifica o dono do projeto
        await notifyOwner({
          title: `Nova mensagem de contato: ${input.name}`,
          content: `**De:** ${input.name} (${input.email})\n**Tipo:** ${input.type}\n**Assunto:** ${input.subject ?? "—"}\n\n${input.message}`,
        });
        return { success: true };
      }),

    list: adminProcedure.query(async () => {
      return getContacts();
    }),
  }),

  /* ── Doações (Stripe) ── */
  donation: router({
    createCheckout: publicProcedure
      .input(
        z.object({
          tierId: z.string().optional(),           // ID do tier pré-definido
          customAmountBRL: z.number().min(500).max(1000000).optional(), // valor livre em centavos
          donorName: z.string().optional(),
          donorEmail: z.string().email().optional(),
          origin: z.string().url(),                // window.location.origin do frontend
        })
      )
      .mutation(async ({ input }) => {
        const stripeKey = process.env.STRIPE_SECRET_KEY;
        if (!stripeKey) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Pagamentos não configurados." });

        const stripe = new Stripe(stripeKey);

        // Determina o valor da doação
        let amountBRL: number;
        if (input.tierId) {
          const tier = DONATION_TIERS.find((t) => t.id === input.tierId);
          if (!tier) throw new TRPCError({ code: "BAD_REQUEST", message: "Plano de doação inválido." });
          amountBRL = tier.amountBRL;
        } else if (input.customAmountBRL) {
          amountBRL = input.customAmountBRL;
        } else {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Informe um valor de doação." });
        }

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          mode: "payment",
          line_items: [
            {
              price_data: {
                currency: DONATION_CURRENCY,
                unit_amount: amountBRL,
                product_data: {
                  name: DONATION_PRODUCT_NAME,
                  description: DONATION_PRODUCT_DESCRIPTION,
                },
              },
              quantity: 1,
            },
          ],
          customer_email: input.donorEmail,
          metadata: {
            customer_name: input.donorName ?? "",
            customer_email: input.donorEmail ?? "",
            tier_id: input.tierId ?? "custom",
            amount_brl_cents: amountBRL.toString(),
          },
          allow_promotion_codes: true,
          success_url: `${input.origin}/obrigado?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${input.origin}/apoie`,
        });

        if (!session.url) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Erro ao criar sessão de pagamento." });
        return { checkoutUrl: session.url };
      }),
  }),

  /* ── Canal de Ética ── */
  ethics: router({
    submit: publicProcedure
      .input(
        z.object({
          category: z.enum(["corrupcao", "assedio", "fraude", "conflito_interesses", "desvio_recursos", "discriminacao", "outros"]),
          description: z.string().min(20, "Descreva o ocorrido com pelo menos 20 caracteres"),
          evidence: z.string().optional(),
          anonymous: z.boolean().default(true),
          contactEmail: z.string().email().optional(),
        })
      )
      .mutation(async ({ input }) => {
        // Gera protocolo único: IU + ano + 6 dígitos aleatórios
        const protocol = `IU${new Date().getFullYear()}${Math.floor(100000 + Math.random() * 900000)}`;
        await createEthicsReport({ ...input, protocol });
        await notifyOwner({
          title: `⚠️ Canal de Ética: nova denúncia recebida`,
          content: `**Protocolo:** ${protocol}\n**Categoria:** ${input.category}\n**Anônimo:** ${input.anonymous ? "Sim" : "Não"}\n\n${input.description.slice(0, 300)}${input.description.length > 300 ? "..." : ""}`,
        });
        return { success: true, protocol };
      }),

    checkStatus: publicProcedure
      .input(z.object({ protocol: z.string().min(1) }))
      .query(async ({ input }) => {
        const report = await getEthicsReportByProtocol(input.protocol);
        if (!report) throw new TRPCError({ code: "NOT_FOUND", message: "Protocolo não encontrado." });
        return { status: report.status, createdAt: report.createdAt, category: report.category };
      }),

    adminList: adminProcedure.query(async () => {
      return getEthicsReports();
    }),
  }),

  // ── Newsletter ──
  newsletter: router({
    subscribe: publicProcedure
      .input(z.object({ email: z.string().email(), name: z.string().optional() }))
      .mutation(async ({ input }) => {
        await subscribeNewsletter(input.email, input.name);
        return { success: true };
      }),
  }),

  /* ── Cursos ── */
  courses: router({
    list: publicProcedure
      .input(z.object({ category: z.string().optional() }).optional())
      .query(async ({ input }) => {
        return getActiveCourses(input?.category);
      }),

    featured: publicProcedure.query(async () => {
      return getFeaturedCourses();
    }),

    bySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const course = await getCourseBySlug(input.slug);
        if (!course) throw new TRPCError({ code: "NOT_FOUND", message: "Curso n\u00e3o encontrado." });
        return course;
      }),

    enroll: protectedProcedure
      .input(z.object({ courseId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const enrollment = await enrollInCourse(ctx.user.id, input.courseId);
        return enrollment;
      }),

    myEnrollments: protectedProcedure.query(async ({ ctx }) => {
      return getUserEnrollments(ctx.user.id);
    }),

    getEnrollment: protectedProcedure
      .input(z.object({ courseId: z.number() }))
      .query(async ({ ctx, input }) => {
        return getEnrollment(ctx.user.id, input.courseId);
      }),

    complete: protectedProcedure
      .input(z.object({ enrollmentId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await completeCourse(input.enrollmentId);
        return { success: true };
      }),

    // Admin
    adminList: adminProcedure.query(async () => {
      return getAllCourses();
    }),

    create: adminProcedure
      .input(z.object({
        slug: z.string().min(1),
        title: z.string().min(1),
        description: z.string().min(1),
        institution: z.string().min(1),
        institutionLogo: z.string().optional(),
        platform: z.string().optional(),
        platformUrl: z.string().url(),
        category: z.enum(["tecnologia", "saude", "administracao", "educacao", "meio_ambiente", "esporte", "idiomas", "direito", "ciencias", "artes"]),
        duration: z.string().optional(),
        level: z.enum(["iniciante", "intermediario", "avancado"]).default("iniciante"),
        coverImage: z.string().optional(),
        tags: z.string().optional(),
        featured: z.boolean().default(false),
      }))
      .mutation(async ({ input }) => {
        await createCourse(input);
        return { success: true };
      }),
  }),

  /* ── Certificados ── */
  certificates: router({
    issue: protectedProcedure
      .input(z.object({ enrollmentId: z.number(), courseId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        // Verify enrollment is completed
        const enrollment = await getEnrollment(ctx.user.id, input.courseId);
        if (!enrollment || enrollment.status !== "concluido") {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Voc\u00ea precisa concluir o curso antes de emitir o certificado." });
        }
        if (enrollment.certificateId) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Certificado j\u00e1 emitido para este curso." });
        }
        // Get course info for certificate
        const course = await getCourseById(input.courseId);
        const cert = await createCertificate({
          userId: ctx.user.id,
          courseId: input.courseId,
          enrollmentId: input.enrollmentId,
          userName: ctx.user.name || "Aluno",
          courseName: course?.title || "Curso",
          institution: course?.institution || "Instituto Ubatuba",
        });
        return cert;
      }),

    verify: publicProcedure
      .input(z.object({ code: z.string() }))
      .query(async ({ input }) => {
        const cert = await getCertificateByCode(input.code);
        if (!cert) throw new TRPCError({ code: "NOT_FOUND", message: "Certificado n\u00e3o encontrado." });
        return cert;
      }),

    myCertificates: protectedProcedure.query(async ({ ctx }) => {
      return getUserCertificates(ctx.user.id);
    }),
  }),
});

export type AppRouter = typeof appRouter;
