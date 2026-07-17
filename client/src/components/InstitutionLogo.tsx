import { useState } from "react";

/**
 * REGRA DA PLATAFORMA DE CURSOS — logotipo da instituição em todo card.
 *
 * Todo curso exibido em /cursos mostra a arte/logotipo da instituição de
 * ensino que oferece a bolsa gratuita. A resolução do logo segue esta ordem:
 *
 *   1. `course.institutionLogo` (URL explícita no cadastro do curso);
 *   2. Domínio oficial mapeado em INSTITUTION_DOMAINS abaixo (o logo é
 *      servido via serviço de favicons do Google em 128px);
 *   3. Fallback final: monograma com as iniciais da instituição nas cores
 *      da marca (Verde Serra sobre Areia) — nunca quebra.
 *
 * ⚠️ AO CADASTRAR UM CURSO NOVO (coursesDemo.ts ou tabela `courses`):
 * preencha `institutionLogo` com a URL do logotipo OU adicione o domínio
 * oficial da instituição em INSTITUTION_DOMAINS. Sem isso o card mostra
 * apenas o monograma.
 */
export const INSTITUTION_DOMAINS: Record<string, string> = {
  "Harvard University": "harvard.edu",
  MIT: "mit.edu",
  "Stanford University": "stanford.edu",
  USP: "usp.br",
  UNICAMP: "unicamp.br",
  UNESP: "unesp.br",
  UFRS: "ufrgs.br",
  FGV: "fgv.br",
  ENAP: "enap.gov.br",
  Fiocruz: "fiocruz.br",
  SENAI: "senai.br",
  "Fundação Bradesco": "ev.org.br",
  "MEC/Aprenda Mais": "gov.br",
  Kultivi: "kultivi.com",
  "University of Pennsylvania": "upenn.edu",
  IFMG: "ifmg.edu.br",
  Santander: "santanderopenacademy.com",
  "Prime Cursos": "primecursos.com.br",
  "Deutsche Welle": "dw.com",
  "École Polytechnique": "polytechnique.edu",
  "LMU Munique": "lmu.de",
  "Peking University": "pku.edu.cn",
  "Yonsei University": "yonsei.ac.kr",
  "Universitat Autònoma de Barcelona": "uab.cat",
  "University of Michigan": "umich.edu",
  "British Council": "britishcouncil.org",
};

export function institutionLogoUrl(institution: string, explicit?: string | null): string | null {
  if (explicit) return explicit;
  const domain = INSTITUTION_DOMAINS[institution];
  if (!domain) return null;
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}

function initials(name: string): string {
  const stop = new Set(["de", "da", "do", "e", "of", "the"]);
  const words = name.split(/[\s/]+/).filter((w) => w && !stop.has(w.toLowerCase()));
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

/**
 * Selo circular com o logotipo da instituição (fundo Areia para o logo
 * respirar sobre os pôsteres escuros). Cai para monograma se a imagem
 * não carregar.
 */
export function InstitutionSeal({
  institution,
  logo,
  className = "w-9 h-9",
}: {
  institution: string;
  logo?: string | null;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const url = institutionLogoUrl(institution, logo);
  const showImage = url && !failed;

  return (
    <span
      className={`${className} shrink-0 rounded-full bg-areia ring-1 ring-tinta/15 shadow-sm flex items-center justify-center overflow-hidden`}
      title={institution}
    >
      {showImage ? (
        <img
          src={url}
          alt={`Logotipo ${institution}`}
          loading="lazy"
          className="w-[70%] h-[70%] object-contain"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="text-[0.62em] font-extrabold text-forest-dark leading-none select-none">
          {initials(institution)}
        </span>
      )}
    </span>
  );
}
