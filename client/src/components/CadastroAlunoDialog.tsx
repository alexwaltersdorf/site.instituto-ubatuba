import { useState, type ReactNode } from "react";
import { GraduationCap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

/**
 * Cadastro do aluno, exigido uma única vez por dispositivo antes de sair do
 * site para a plataforma de origem — seja um curso específico ou o catálogo de
 * uma instituição parceira. Vive num componente próprio porque dois lugares
 * usam exatamente o mesmo formulário.
 */

/* Máscaras leves para os campos do cadastro */
export const maskCPF = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 11);
  return d
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d{1,2})$/, ".$1-$2");
};
export const maskCEP = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
};
export const maskPhone = (v: string) => {
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
export const STORAGE_PROFILE = "iu_student_profile";

export type StoredStudent = { id: number; fullName: string };

export function loadStoredStudent(): StoredStudent | null {
  try {
    const raw = localStorage.getItem(STORAGE_PROFILE);
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed && typeof parsed.id === "number" ? parsed : null;
  } catch {
    return null;
  }
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor} className="text-xs font-medium text-forest-dark">{label}</Label>
      {children}
    </div>
  );
}

export function CadastroAlunoDialog({
  open,
  onOpenChange,
  onRegistered,
  destino = "o curso",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Chamado com o perfil salvo assim que o cadastro é concluído. */
  onRegistered: (profile: StoredStudent) => void;
  /** Para onde o aluno vai depois — aparece no texto do botão. */
  destino?: string;
}) {
  const [form, setForm] = useState(EMPTY_FORM);

  const registerMutation = trpc.students.register.useMutation({
    onSuccess: (data) => {
      const profile: StoredStudent = { id: data.id, fullName: data.fullName };
      localStorage.setItem(STORAGE_PROFILE, JSON.stringify(profile));
      onOpenChange(false);
      toast.success(`Cadastro realizado! Redirecionando para ${destino}...`);
      onRegistered(profile);
    },
    onError: (err) => {
      toast.error(err.message || "Verifique os dados do cadastro.");
    },
  });

  const setField = (key: keyof typeof EMPTY_FORM) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-forest-dark">Cadastro do Aluno</DialogTitle>
          <DialogDescription>
            Para acessar gratuitamente, complete seu cadastro no Instituto Ubatuba.
            Você só precisa fazer isso uma vez — nos próximos acessos irá direto.
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
            Concluir cadastro e acessar
          </Button>
          <p className="text-[11px] text-center text-muted-foreground">
            Seus dados são usados apenas pelo Instituto Ubatuba Santuário Ecológico, conforme a LGPD.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
