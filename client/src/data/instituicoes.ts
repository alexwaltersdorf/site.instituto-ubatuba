/**
 * Instituições parceiras e o endereço do catálogo gratuito de cada uma.
 *
 * O aluno clica no botão da instituição, faz o cadastro no Instituto (uma vez
 * por dispositivo) e só então é levado ao catálogo de origem. É o mesmo fluxo
 * da inscrição em um curso: o Instituto registra quem saiu para onde antes de
 * entregar o aluno à plataforma parceira.
 *
 * `url` tem de apontar para o CATÁLOGO GRATUITO, nunca para a home institucional
 * — o aluno precisa cair já na lista de cursos.
 */
export type InstituicaoParceira = {
  /** Nome exibido no botão. Casa com `courses.institution` quando houver curso. */
  nome: string;
  /** Catálogo gratuito da instituição. */
  url: string;
  /** Chave curta usada no registro do clique. */
  slug: string;
  grupo: "universidades" | "brasil" | "tecnologia";
  /** Mostrado como aviso quando o "gratuito" tem ressalva. */
  ressalva?: string;
};

export const INSTITUICOES_PARCEIRAS: InstituicaoParceira[] = [
  /* ── Universidades e instituições internacionais ── */
  {
    nome: "Harvard University",
    slug: "harvard",
    grupo: "universidades",
    url: "https://pll.harvard.edu/catalog/free",
    ressalva: "Acesso ao conteúdo gratuito; o certificado da própria Harvard é opcional e pago.",
  },
  {
    nome: "MIT",
    slug: "mit",
    grupo: "universidades",
    url: "https://ocw.mit.edu/courses/",
    ressalva: "Material de aula aberto (OpenCourseWare), sem matrícula nem certificado da instituição.",
  },
  { nome: "Stanford", slug: "stanford", grupo: "universidades", url: "https://online.stanford.edu/free-courses" },
  {
    nome: "Coursera",
    slug: "coursera",
    grupo: "universidades",
    url: "https://www.coursera.org/explore/free-courses",
    ressalva: "A lista mistura cursos de acesso livre com cursos pagos que têm amostra gratuita. Confira antes de se inscrever.",
  },
  {
    nome: "edX",
    slug: "edx",
    grupo: "universidades",
    url: "https://www.edx.org/courses?q=free+online+courses",
    ressalva: "Assistir é gratuito; o certificado da plataforma é pago.",
  },

  /* ── Instituições públicas e de ensino no Brasil ── */
  { nome: "FGV", slug: "fgv", grupo: "brasil", url: "https://cursosgratuitos.fgv.br/" },
  { nome: "Escola Virtual de Governo", slug: "evg", grupo: "brasil", url: "https://www.escolavirtual.gov.br/catalogo" },
  { nome: "USP", slug: "usp", grupo: "brasil", url: "https://www5.usp.br/ensino/cursos-on-line/" },
  { nome: "UNESP", slug: "unesp", grupo: "brasil", url: "https://portal-cursos.unesp.br/catalogo" },
  { nome: "IFRS", slug: "ifrs", grupo: "brasil", url: "https://moodle.ifrs.edu.br/course/index.php" },
  { nome: "Sebrae", slug: "sebrae", grupo: "brasil", url: "https://loja.sebrae.com.br/cursos/cursos-online" },
  { nome: "Fundação Bradesco", slug: "bradesco", grupo: "brasil", url: "https://www.ev.org.br/areas-de-interesse" },
  {
    nome: "SENAI",
    slug: "senai",
    grupo: "brasil",
    url: "https://www.sp.senai.br/cursos/cursos-livres/0?gratuito=1&modalidade=3",
    ressalva: "Boa parte dos cursos livres é presencial, em unidades do estado de São Paulo, com vaga limitada.",
  },
  { nome: "Hospital Albert Einstein", slug: "einstein", grupo: "brasil", url: "https://ensino.einstein.br/curta-duracao/cursos-gratuitos" },
  { nome: "Santander", slug: "santander", grupo: "brasil", url: "https://www.santanderopenacademy.com/pt_br/courses.html" },
  { nome: "Kultivi", slug: "kultivi", grupo: "brasil", url: "https://kultivi.com/cursos" },
  { nome: "MEC / Aprenda Mais", slug: "mec", grupo: "brasil", url: "https://aprendamais.mec.gov.br/" },

  /* ── Gigantes da tecnologia e organizações globais ── */
  {
    nome: "Google Cloud Skills Boost",
    slug: "google",
    grupo: "tecnologia",
    url: "https://www.skills.google/",
    ressalva: "O estudo é gratuito; o exame de certificação do Google é pago.",
  },
  { nome: "Microsoft Learn", slug: "microsoft", grupo: "tecnologia", url: "https://learn.microsoft.com/pt-br/training/browse/", ressalva: "O estudo é gratuito; o exame de certificação da Microsoft é pago." },
  { nome: "Cisco Networking Academy", slug: "cisco", grupo: "tecnologia", url: "https://www.netacad.com/" },
  { nome: "IBM SkillsBuild", slug: "ibm", grupo: "tecnologia", url: "https://skillsbuild.org/" },
  { nome: "AWS Skill Builder", slug: "aws", grupo: "tecnologia", url: "https://aws.amazon.com/pt/training/digital/", ressalva: "O estudo é gratuito; o exame de certificação da AWS é pago." },
  { nome: "Khan Academy", slug: "khan", grupo: "tecnologia", url: "https://pt.khanacademy.org/" },
  { nome: "OpenWHO (OMS)", slug: "openwho", grupo: "tecnologia", url: "https://openwho.org/channels" },
];

export const GRUPOS: { id: InstituicaoParceira["grupo"]; label: string }[] = [
  { id: "universidades", label: "Universidades internacionais" },
  { id: "brasil", label: "Instituições brasileiras" },
  { id: "tecnologia", label: "Tecnologia e organizações globais" },
];
