/**
 * Definição dos planos de doação do Instituto Ubatuba Santuário Ecológico.
 * Valores em centavos (BRL). Stripe trabalha com a menor unidade monetária.
 */

export interface DonationTier {
  id: string;
  label: string;
  amountBRL: number;   // em centavos
  description: string;
  impact: string;
  popular?: boolean;
}

export const DONATION_TIERS: DonationTier[] = [
  {
    id: "doe-30",
    label: "R$ 30",
    amountBRL: 3000,
    description: "Apoiador da Natureza",
    impact: "Cobre materiais esportivos para uma criança por 1 mês nas escolinhas.",
    popular: false,
  },
  {
    id: "doe-50",
    label: "R$ 50",
    amountBRL: 5000,
    description: "Guardião do Santuário",
    impact: "Financia um exame de saúde preventivo para uma família da comunidade.",
    popular: false,
  },
  {
    id: "doe-100",
    label: "R$ 100",
    amountBRL: 10000,
    description: "Protetor do Ecossistema",
    impact: "Garante 1 mês de atividades esportivas e educacionais para 3 crianças.",
    popular: true,
  },
  {
    id: "doe-200",
    label: "R$ 200",
    amountBRL: 20000,
    description: "Embaixador Socioambiental",
    impact: "Sustenta um mês completo do Projeto Itaguá Azul de conservação marinha.",
    popular: false,
  },
];

export const DONATION_CURRENCY = "brl";
export const DONATION_PRODUCT_NAME = "Doação — Instituto Ubatuba Santuário Ecológico";
export const DONATION_PRODUCT_DESCRIPTION =
  "Sua doação apoia programas socioambientais em Ubatuba: escolinhas esportivas, ações de saúde, conservação ecológica e bem-estar animal — alinhados à ODS 18 e à Agenda 2030.";
