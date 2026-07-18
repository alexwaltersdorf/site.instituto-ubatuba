import { useState } from "react";
import { useParams, Link } from "wouter";
import { GraduationCap, Clock, ExternalLink, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSEO } from "@/components/SEOHead";
import { InstitutionSeal } from "@/components/InstitutionLogo";
import { trpc } from "@/lib/trpc";
import { coursesDemo, CATEGORIES } from "@/data/coursesDemo";
import { toast } from "sonner";

/* Máscaras leves para os campos do cadastro */
const maskCPF = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 11);
  return d
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d{1,2})$/, ".$1-$2");
};
const maskCEP = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
};
const maskPhone = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
};

const EMPTY_FORM = {
  fullName: "",
  cpf: "",
  address: "",
  number: "",
  neighborhood: "",
  city: "",
  cep: "",
  birthDate: "",
  phone: "",
  email: "",
};

/* Cadastro lembrado neste dispositivo (o registro oficial fica no banco do site) */
const STORAGE_PROFILE = "iu_student_profile";
const STORAGE_ENROLLED = "iu_enrolled_courses";

type StoredStudent = { id: number; fullName: string };

function loadStoredStudent(): StoredStudent | null {
  try {
    const raw = localStorage.getItem(STORAGE_PROFILE);
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed && typeof parsed.id === "number" ? parsed : null;
  } catch {
    return null;
  }
}

function loadEnrolledIds(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_ENROLLED);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((n) => typeof n === "number") : [];
  } catch {
    return [];
  }
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor} className="text-sm font-medium">
        {label} <span className="text-destructive">*</span>
      </Label>
      {children}
    </div>
  );
}

export default function CursoDetalhe() {
  const { slug } = useParams<{ slug: string }>();

  const { data: dbCourse, isLoading } = trpc.courses.bySlug.useQuery({ slug: slug! }, { retry: false, enabled: !!slug });
  const course = dbCourse ?? coursesDemo.find((c) => c.slug === slug);

  const [student, setStudent] = useState<StoredStudent | null>(loadStoredStudent);
  const [enrolledIds, setEnrolledIds] = useState<number[]>(loadEnrolledIds);
  const [showCadastro, setShowCadastro] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const logEnrollment = trpc.students.enroll.useMutation();

  const registerMutation = trpc.students.register.useMutation({
    onSuccess: (data) => {
      const profile: StoredStudent = { id: data.id, fullName: data.fullName };
      localStorage.setItem(STORAGE_PROFILE, JSON.stringify(profile));
      setStudent(profile);
      setShowCadastro(false);
      toast.success("Cadastro realizado! Redirecionando para o curso...");
      goToCourse(profile);
    },
    onError: (err) => {
      toast.error(err.message || "Verifique os dados do cadastro.");
    },
  });

  const setField = (key: keyof typeof EMPTY_FORM) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  useSEO({
    title: course ? `${course.title} | Cursos Gratuitos` : "Curso | Instituto Ubatuba",
    description: course?.description ?? "Curso gratuito disponível no Instituto Ubatuba.",
    canonical: `/cursos/${slug}`,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-forest" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <GraduationCap className="w-16 h-16 text-muted-foreground/40" />
        <h1 className="text-2xl font-bold text-forest-dark">Curso não encontrado</h1>
        <Link href="/cursos"><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Voltar aos cursos</Button></Link>
      </div>
    );
  }

  const category = CATEGORIES.find((c) => c.id === course.category);
  const tags: string[] = course.tags ? JSON.parse(course.tags) : [];
  const isEnrolled = enrolledIds.includes(course.id);

  /** Registra a inscrição no servidor e leva o aluno ao curso. */
  function goToCourse(profile: StoredStudent) {
    if (!course) return;
    logEnrollment.mutate({ studentId: profile.id, courseId: course.id, courseSlug: course.slug });
    if (!enrolledIds.includes(course.id)) {
      const next = [...enrolledIds, course.id];
      setEnrolledIds(next);
      localStorage.setItem(STORAGE_ENROLLED, JSON.stringify(next));
    }
    const win = window.open(course.platformUrl, "_blank", "noopener");
    if (!win) window.location.href = course.platformUrl;
  }

  const handleEnroll = () => {
    if (!student) {
      // Primeiro acesso neste dispositivo: cadastro obrigatório (uma única vez)
      setShowCadastro(true);
      return;
    }
    // Já cadastrado: pula o formulário e vai direto ao curso
    goToCourse(student);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/50 to-white">
      <div className="pt-28 pb-20 px-4">
        <div className="container max-w-4xl">
          <Link href="/cursos">
            <span className="inline-flex items-center gap-1 text-sm text-forest hover:underline mb-6 cursor-pointer">
              <ArrowLeft className="w-4 h-4" /> Voltar aos cursos
            </span>
          </Link>

          <div className="grid lg:grid-cols-3 gap-8 mt-4">
            <div className="lg:col-span-2">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">{category?.icon} {category?.label}</Badge>
                <Badge variant="outline" className="capitalize">
                  {course.level === "iniciante" ? "Iniciante" : course.level === "intermediario" ? "Intermediário" : "Avançado"}
                </Badge>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-forest-dark mb-4">{course.title}</h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                <span className="flex items-center gap-2 text-base">
                  <InstitutionSeal institution={course.institution} logo={course.institutionLogo} className="w-9 h-9" />
                  <span className="font-medium text-foreground/80">{course.institution}</span>
                </span>
                {course.duration && <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {course.duration}</span>}
                {course.platform && <span className="flex items-center gap-1.5"><ExternalLink className="w-4 h-4" /> {course.platform}</span>}
              </div>

              <div className="prose prose-green max-w-none mb-8">
                <p className="text-base text-foreground/80 leading-relaxed">{course.description}</p>
              </div>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {tags.map((tag) => (<Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>))}
                </div>
              )}

              <div className="bg-accent/40 rounded-xl p-6 mb-8">
                <h3 className="font-semibold text-forest-dark mb-2">Sobre a Instituição</h3>
                <p className="text-sm text-muted-foreground">
                  Este curso é oferecido por <strong>{course.institution}</strong>
                  {course.platform && <> através da plataforma <strong>{course.platform}</strong></>}.
                  O Instituto Ubatuba Santuário Ecológico atua como facilitador, conectando você a oportunidades educacionais gratuitas de excelência.
                </p>
              </div>

              <div className="bg-forest/5 border border-forest/20 rounded-xl p-6">
                <h3 className="font-semibold text-forest-dark mb-2 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" /> Certificado de Conclusão
                </h3>
                <p className="text-sm text-muted-foreground">
                  Ao concluir este curso na plataforma da instituição, você poderá solicitar um certificado de conclusão emitido pelo Instituto Ubatuba Santuário Ecológico, validando sua participação e dedicação ao aprendizado.
                </p>
              </div>
            </div>

            {/* Sidebar - Enrollment Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 bg-white rounded-xl border border-border/50 shadow-sm p-6">
                <div className="text-center mb-6">
                  <p className="text-3xl font-bold text-forest italic mb-1">Gratuito</p>
                  <p className="text-sm text-muted-foreground">Sem custo algum</p>
                </div>

                <div className="space-y-3">
                  {isEnrolled && (
                    <div className="flex items-center justify-center gap-2 text-forest font-medium py-2">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Inscrito</span>
                    </div>
                  )}
                  <Button
                    className="w-full bg-forest hover:bg-forest-dark text-white h-12 text-base"
                    onClick={handleEnroll}
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <GraduationCap className="w-4 h-4 mr-2" />
                    )}
                    Inscrever-se Gratuitamente
                  </Button>
                  <p className="text-[11px] text-center text-muted-foreground">
                    {student
                      ? `Cadastro ativo: ${student.fullName.split(" ")[0]} — você irá direto ao curso.`
                      : "Cadastro único e gratuito no Instituto. Seus dados são protegidos (LGPD)."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cadastro obrigatório do aluno (uma única vez) */}
      <Dialog open={showCadastro} onOpenChange={setShowCadastro}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-forest-dark">Cadastro do Aluno</DialogTitle>
            <DialogDescription>
              Para se inscrever gratuitamente, complete seu cadastro no Instituto Ubatuba.
              Você só precisa fazer isso uma vez — nas próximas inscrições irá direto ao curso.
              Todos os campos são obrigatórios.
            </DialogDescription>
          </DialogHeader>
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              registerMutation.mutate(form);
            }}
          >
            <Field label="Nome Completo" htmlFor="cad-nome">
              <Input id="cad-nome" required minLength={5} value={form.fullName} onChange={(e) => setField("fullName")(e.target.value)} placeholder="Seu nome completo" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="CPF" htmlFor="cad-cpf">
                <Input id="cad-cpf" required inputMode="numeric" value={form.cpf} onChange={(e) => setField("cpf")(maskCPF(e.target.value))} placeholder="000.000.000-00" />
              </Field>
              <Field label="Data de Nascimento" htmlFor="cad-nascimento">
                <Input id="cad-nascimento" required type="date" max={new Date().toISOString().slice(0, 10)} value={form.birthDate} onChange={(e) => setField("birthDate")(e.target.value)} />
              </Field>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <Field label="Endereço" htmlFor="cad-endereco">
                  <Input id="cad-endereco" required minLength={3} value={form.address} onChange={(e) => setField("address")(e.target.value)} placeholder="Rua, avenida..." />
                </Field>
              </div>
              <Field label="Número" htmlFor="cad-numero">
                <Input id="cad-numero" required value={form.number} onChange={(e) => setField("number")(e.target.value)} placeholder="Nº" />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Bairro" htmlFor="cad-bairro">
                <Input id="cad-bairro" required minLength={2} value={form.neighborhood} onChange={(e) => setField("neighborhood")(e.target.value)} placeholder="Seu bairro" />
              </Field>
              <Field label="Cidade" htmlFor="cad-cidade">
                <Input id="cad-cidade" required minLength={2} value={form.city} onChange={(e) => setField("city")(e.target.value)} placeholder="Sua cidade" />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="CEP" htmlFor="cad-cep">
                <Input id="cad-cep" required inputMode="numeric" value={form.cep} onChange={(e) => setField("cep")(maskCEP(e.target.value))} placeholder="00000-000" />
              </Field>
              <Field label="Telefone" htmlFor="cad-telefone">
                <Input id="cad-telefone" required inputMode="tel" value={form.phone} onChange={(e) => setField("phone")(maskPhone(e.target.value))} placeholder="(00) 00000-0000" />
              </Field>
            </div>
            <Field label="E-mail" htmlFor="cad-email">
              <Input id="cad-email" required type="email" value={form.email} onChange={(e) => setField("email")(e.target.value)} placeholder="seu@email.com" />
            </Field>
            <Button type="submit" className="w-full bg-forest hover:bg-forest-dark text-white h-11 mt-2" disabled={registerMutation.isPending}>
              {registerMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <GraduationCap className="w-4 h-4 mr-2" />}
              Concluir cadastro e acessar o curso
            </Button>
            <p className="text-[11px] text-center text-muted-foreground">
              Seus dados são usados apenas pelo Instituto Ubatuba Santuário Ecológico, conforme a LGPD.
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
