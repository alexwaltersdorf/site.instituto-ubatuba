import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  completeEnrollment,
  createContact,
  createEnrollment,
  createEthicsReport,
  createGalleryItem,
  createPost,
  deletePost,
  getAllPosts,
  getCertificateByCode,
  getContacts,
  getCourseById,
  getCourseBySlug,
  getCourses,
  getEnrollment,
  getEthicsReportByProtocol,
  getEthicsReports,
  getFeaturedGallery,
  getGalleryItems,
  getMyCertificates,
  getMyEnrollments,
  getPostBySlug,
  getPublishedPosts,
  findStudentByCpf,
  issueCertificate,
  logStudentEnrollment,
  saveStudentProfile,
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

/** Validação de CPF com dígitos verificadores */
function isValidCPF(raw: string): boolean {
  const cpf = raw.replace(/\D/g, "");
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  for (const t of [9, 10]) {
    let sum = 0;
    for (let i = 0; i < t; i++) sum += parseInt(cpf[i]) * (t + 1 - i);
    const digit = ((sum * 10) % 11) % 10;
    if (digit !== parseInt(cpf[t])) return false;
  }
  return true;
}

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

  /* ── Cadastro de Alunos ──
   * SEM login/OAuth (o domínio próprio não é aceito pelo OAuth da Manus):
   * o cadastro é público, identificado por CPF e salvo direto no banco
   * MySQL do site hospedado na Hostinger. */
  students: router({
    register: publicProcedure
      .input(
        z.object({
          fullName: z.string().trim().min(5, "Informe o nome completo"),
          cpf: z
            .string()
            .trim()
            .regex(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, "CPF inválido")
            .refine(isValidCPF, "CPF inválido"),
          address: z.string().trim().min(3, "Informe o endereço"),
          number: z.string().trim().min(1, "Informe o número"),
          neighborhood: z.string().trim().min(2, "Informe o bairro"),
          city: z.string().trim().min(2, "Informe a cidade"),
          cep: z.string().trim().regex(/^\d{5}-?\d{3}$/, "CEP inválido"),
          birthDate: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, "Data de nascimento inválida")
            .refine((d) => {
              const dt = new Date(`${d}T00:00:00`);
              return !Number.isNaN(dt.getTime()) && dt < new Date() && dt.getFullYear() > 1900;
            }, "Data de nascimento inválida"),
          phone: z.string().trim().min(10, "Informe o telefone com DDD"),
          email: z.string().trim().email("E-mail inválido"),
        })
      )
      .mutation(async ({ input }) => {
        const cpf = input.cpf.replace(/\D/g, "");
        const existing = await findStudentByCpf(cpf);
        const profile = await saveStudentProfile({ ...input, cpf });
        if (!profile) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Não foi possível salvar o cadastro. Tente novamente." });
        }
        if (!existing) {
          await notifyOwner({
            title: `🎓 Novo aluno cadastrado: ${input.fullName}`,
            content: `**Nome:** ${input.fullName}\n**E-mail:** ${input.email}\n**Telefone:** ${input.phone}\n**Cidade:** ${input.city}`,
          });
        }
        return { success: true, id: profile.id, fullName: profile.fullName };
      }),

    enroll: publicProcedure
      .input(z.object({ studentId: z.number(), courseId: z.number(), courseSlug: z.string() }))
      .mutation(async ({ input }) => {
        try {
          await logStudentEnrollment(input.studentId, input.courseId, input.courseSlug);
        } catch {
          // registro de inscrição não pode bloquear o acesso ao curso
        }
        return { success: true };
      }),
  }),

  /* ── Cursos Gratuitos ── */
  courses: router({
    list: publicProcedure
      .input(z.object({ category: z.string().optional(), level: z.string().optional() }).optional())
      .query(async ({ input }) => {
        return getCourses(input?.category, input?.level);
      }),

    bySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const course = await getCourseBySlug(input.slug);
        if (!course) throw new TRPCError({ code: "NOT_FOUND", message: "Curso não encontrado." });
        return course;
      }),

    enroll: protectedProcedure
      .input(z.object({ courseId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const course = await getCourseById(input.courseId);
        if (!course) throw new TRPCError({ code: "NOT_FOUND", message: "Curso não encontrado." });
        const enrollment = await createEnrollment(ctx.user.id, input.courseId);
        return { success: true, enrollment, platformUrl: course.platformUrl };
      }),

    complete: protectedProcedure
      .input(z.object({ enrollmentId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        await completeEnrollment(input.enrollmentId, ctx.user.id);
        return { success: true };
      }),

    myEnrollments: protectedProcedure.query(async ({ ctx }) => {
      return getMyEnrollments(ctx.user.id);
    }),

    checkEnrollment: protectedProcedure
      .input(z.object({ courseId: z.number() }))
      .query(async ({ input, ctx }) => {
        const enrollment = await getEnrollment(ctx.user.id, input.courseId);
        return enrollment ?? null;
      }),
  }),

  /* ── Certificados ── */
  certificates: router({
    issue: protectedProcedure
      .input(z.object({ enrollmentId: z.number(), courseId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const cert = await issueCertificate(input.enrollmentId, ctx.user.id, input.courseId);
        return cert;
      }),

    myCertificates: protectedProcedure.query(async ({ ctx }) => {
      return getMyCertificates(ctx.user.id);
    }),

    verify: publicProcedure
      .input(z.object({ code: z.string() }))
      .query(async ({ input }) => {
        const result = await getCertificateByCode(input.code);
        if (!result) throw new TRPCError({ code: "NOT_FOUND", message: "Certificado não encontrado." });
        return result;
      }),
  }),
});

export type AppRouter = typeof appRouter;
