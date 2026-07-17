import { useState, useMemo } from "react";
import { ExternalLink, Search, Filter, TrendingUp, Users, Calendar, ChevronDown, ChevronUp, Building2 } from "lucide-react";

// ===== DADOS DOS PARLAMENTARES =====
interface Parlamentar {
  nome: string;
  partido: string;
  cargo: string;
  foto: string;
  bio: string;
}

const parlamentares: Record<string, Parlamentar> = {
  "Arlindo Chinaglia": {
    nome: "Arlindo Chinaglia",
    partido: "PT-SP",
    cargo: "Deputado Federal",
    foto: "/manus-storage/parlamentar-arlindo-chinaglia_7700f845.jpg",
    bio: "Médico e sindicalista natural de Mogi das Cruzes-SP. Deputado federal por São Paulo desde 1995 pelo PT. Foi presidente da Câmara dos Deputados (2007-2009). Atua nas comissões de Saúde e Relações Exteriores. Reconhecido pela defesa do SUS e políticas públicas de saúde."
  },
  "Eduardo Cury": {
    nome: "Eduardo Cury",
    partido: "PSDB-SP",
    cargo: "Deputado Federal",
    foto: "/manus-storage/parlamentar-eduardo-cury_9790af82.jpg",
    bio: "Engenheiro e político paulista natural de São José dos Campos. Ex-prefeito de São José dos Campos por dois mandatos. Deputado federal pelo PSDB-SP, atua nas comissões de Desenvolvimento Urbano e Infraestrutura. Foco em obras públicas e desenvolvimento regional."
  },
  "Policial Katia Sastre": {
    nome: "Policial Katia Sastre",
    partido: "PL-SP",
    cargo: "Deputada Federal",
    foto: "/manus-storage/parlamentar-katia-sastre_d689d1db.jpg",
    bio: "Policial militar paulista que ganhou notoriedade em 2018 ao reagir a um assalto na porta de uma escola em Suzano-SP. Eleita deputada federal em 2018 pelo PL-SP. Atua nas comissões de Segurança Pública e Combate ao Crime Organizado. Defensora de pautas de segurança e proteção à mulher."
  },
  "Coronel Tadeu": {
    nome: "Coronel Tadeu",
    partido: "PSL-SP",
    cargo: "Deputado Federal",
    foto: "/manus-storage/parlamentar-coronel-tadeu_a2b52592.jpg",
    bio: "Coronel reformado da Polícia Militar de São Paulo. Deputado federal pelo PSL-SP (2019-2023). Atuou nas comissões de Segurança Pública e Defesa Nacional. Defensor de pautas de segurança, disciplina e valorização das forças policiais."
  },
  "Marco Bertaiolli": {
    nome: "Marco Bertaiolli",
    partido: "PSD-SP",
    cargo: "Deputado Federal",
    foto: "/manus-storage/parlamentar-marco-bertaiolli_a330b8dd.jpg",
    bio: "Empresário e político paulista, ex-prefeito de Mogi das Cruzes por dois mandatos. Deputado federal pelo PSD-SP desde 2019. Atua nas comissões de Desenvolvimento Econômico e Turismo. Reconhecido por destinar emendas para infraestrutura esportiva e educacional em municípios paulistas."
  },
  "Nilto Tatto": {
    nome: "Nilto Tatto",
    partido: "PT-SP",
    cargo: "Deputado Federal",
    foto: "/manus-storage/parlamentar-nilto-tatto_ebeb6a40.jpg",
    bio: "Ambientalista e político paulista. Deputado federal pelo PT-SP, ex-secretário de Meio Ambiente de São Paulo. Atua nas comissões de Meio Ambiente e Desenvolvimento Sustentável. Reconhecido pela defesa de comunidades tradicionais e projetos de infraestrutura urbana sustentável no litoral norte."
  },
  "Eduardo Cury_dup": {
    nome: "Eduardo Cury",
    partido: "PSDB-SP",
    cargo: "Deputado Federal",
    foto: "/manus-storage/parlamentar-eduardo-cury_9790af82.jpg",
    bio: ""
  },
  "Jefferson Campos": {
    nome: "Jefferson Campos",
    partido: "PL-SP",
    cargo: "Deputado Federal",
    foto: "/manus-storage/parlamentar-jefferson-campos_84af27b5.jpg",
    bio: "Pastor evangélico e político paulista, deputado federal por São Paulo desde 2015. Filiado ao PL desde 2022, atua nas frentes parlamentares de defesa da família e do turismo. Membro das comissões de Desenvolvimento Urbano e Turismo na Câmara dos Deputados."
  },
  "Vanderlei Macris": {
    nome: "Vanderlei Macris",
    partido: "PSDB-SP",
    cargo: "Deputado Federal",
    foto: "/manus-storage/parlamentar-vanderlei-macris_1f40b892.jpg",
    bio: "Advogado e político paulista natural de Americana-SP. Deputado federal pelo PSDB-SP, ex-líder do partido na Câmara. Atuou como deputado estadual por vários mandatos antes de chegar à esfera federal. Foco em obras públicas e desenvolvimento institucional."
  },
  "Capitão Derrite": {
    nome: "Capitão Derrite (Guilherme Derrite)",
    partido: "PL-SP (hoje PP)",
    cargo: "Deputado Federal / Secretário de Segurança Pública de SP",
    foto: "/manus-storage/parlamentar-capitao-derrite_95ab4277.jpg",
    bio: "Capitão da Polícia Militar de São Paulo, eleito deputado federal em 2018 pelo PL-SP. Em 2023, foi nomeado Secretário de Segurança Pública do Estado de São Paulo pelo governador Tarcísio de Freitas. Migrou para o PP. Atua em pautas de segurança pública e combate à criminalidade."
  },
  "Guilherme Mussi": {
    nome: "Guilherme Mussi",
    partido: "PP-SP",
    cargo: "Deputado Federal",
    foto: "/manus-storage/parlamentar-guilherme-mussi_eced2761.jpg",
    bio: "Empresário e político paulista. Deputado federal pelo PP-SP desde 2015. Atua nas comissões de Turismo e Relações Exteriores. Reconhecido por destinar emendas para infraestrutura urbana e revitalização de espaços públicos em municípios do litoral paulista."
  },
  "Paulo Teixeira": {
    nome: "Paulo Teixeira",
    partido: "PT-SP",
    cargo: "Deputado Federal",
    foto: "/manus-storage/parlamentar-paulo-teixeira_c7b292fa.jpg",
    bio: "Advogado e político paulista. Deputado federal pelo PT-SP, foi Ministro do Desenvolvimento Agrário e Agricultura Familiar (2023). Atua nas comissões de Constituição e Justiça e Direitos Humanos. Defensor de políticas habitacionais e reforma agrária."
  },
  "Sen. Giordano": {
    nome: "Senador Giordano",
    partido: "MDB-SP (hoje Podemos)",
    cargo: "Senador da República",
    foto: "/manus-storage/parlamentar-giordano_0a684a54.jpeg",
    bio: "Empresário e político paulista, ex-prefeito de Jundiaí. Senador pelo MDB-SP (migrou para o Podemos). Responsável pela maior emenda individual destinada a Ubatuba, com mais de R$ 17 milhões aplicados em 21 metas de infraestrutura urbana, pavimentação, praças e equipamentos públicos."
  },
  "Fausto Pinato": {
    nome: "Fausto Pinato",
    partido: "PP-SP",
    cargo: "Deputado Federal",
    foto: "/manus-storage/parlamentar-fausto-pinato_8f7d1a01.jpg",
    bio: "Advogado e político paulista natural de Fernandópolis-SP. Deputado federal pelo PP-SP desde 2015. Atua nas comissões de Ética e Decoro Parlamentar e Infraestrutura. Reconhecido por destinar emendas para pavimentação e infraestrutura viária em municípios paulistas."
  },
  "Mauricio Neves": {
    nome: "Mauricio Neves",
    partido: "PP-SP",
    cargo: "Deputado Federal",
    foto: "/manus-storage/parlamentar-mauricio-neves_f5afb1e5.jpg",
    bio: "Político paulista, deputado federal pelo PP-SP. Presidente da Comissão de Viação e Transportes da Câmara dos Deputados. Atua em pautas de infraestrutura, transporte e desenvolvimento urbano. Destinou emenda para construção de quadra esportiva em Ubatuba."
  },
  "Sen. Astronauta Marcos Pontes": {
    nome: "Senador Astronauta Marcos Pontes",
    partido: "PL-SP",
    cargo: "Senador da República",
    foto: "/manus-storage/parlamentar-marcos-pontes_2f94c7b0.jpg",
    bio: "Astronauta, engenheiro e político brasileiro. Foi o primeiro astronauta do Brasil, tendo ido ao espaço em 2006 na Missão Centenário. Serviu como Ministro da Ciência, Tecnologia e Inovações (2019-2022). Eleito senador por São Paulo em 2022 pelo PL. Atua nas comissões de Ciência e Tecnologia e Educação."
  },
  "Delegado Paulo Bilynskyj": {
    nome: "Delegado Paulo Bilynskyj",
    partido: "PL-SP",
    cargo: "Deputado Federal",
    foto: "/manus-storage/parlamentar-paulo-bilynskyj_45c49133.jpg",
    bio: "Delegado de polícia civil de São Paulo e influenciador digital, eleito deputado federal em 2022 pelo PL-SP com expressiva votação. Preside a Comissão de Segurança Pública da Câmara dos Deputados. Defensor de pautas relacionadas à segurança, armamento e combate ao crime organizado."
  },
  "Miguel Lombardi": {
    nome: "Miguel Lombardi",
    partido: "PL-SP",
    cargo: "Deputado Federal",
    foto: "/manus-storage/parlamentar-miguel-lombardi_4453a353.jpg",
    bio: "Político paulista natural de Piracicaba, deputado federal por São Paulo pelo PL. Atuou como vereador e prefeito de Piracicaba antes de chegar à Câmara Federal. Membro das comissões de Saúde e Assistência Social. Defensor de investimentos em saúde pública e infraestrutura municipal."
  },
  "Márcio Alvino": {
    nome: "Márcio Alvino",
    partido: "PL-SP",
    cargo: "Deputado Federal",
    foto: "/manus-storage/parlamentar-marcio-alvino_f03760d3.jpg",
    bio: "Político paulista, deputado federal por São Paulo pelo PL desde 2015. Reconhecido por ter 100% de presença nas sessões da Câmara nos últimos 8 anos. Atua nas comissões de Viação e Transportes e Desenvolvimento Urbano. Foco em emendas para infraestrutura e assistência social em municípios paulistas."
  },
  "Tiririca": {
    nome: "Tiririca (Francisco Everardo Oliveira Silva)",
    partido: "PL-SP (hoje PSD)",
    cargo: "Deputado Federal",
    foto: "/manus-storage/parlamentar-tiririca_06be3bac.jpg",
    bio: "Humorista, cantor e ator cearense, eleito deputado federal por São Paulo em 2010 com a maior votação da história para o cargo na época (mais de 1,3 milhão de votos). Reeleito por quatro mandatos consecutivos (2011-2027). Atua nas comissões de Cultura e Turismo. Migrou do PL para o PSD em 2023."
  },
  "Antonio Carlos Rodrigues": {
    nome: "Antonio Carlos Rodrigues",
    partido: "PL-SP (hoje Podemos)",
    cargo: "Deputado Federal",
    foto: "/manus-storage/parlamentar-antonio-carlos-rodrigues_7d493851.jpg",
    bio: "Político paulista, deputado federal pelo PL-SP (migrou para o Podemos). Ex-secretário de Transportes de São Paulo. Atua nas comissões de Viação e Transportes e Desenvolvimento Urbano. Teve emenda impedida para Ubatuba por falta de análise conclusiva no prazo."
  }
};

// ===== DADOS DAS EMENDAS (Execução Emendas Pix - TODAS as transferências especiais 2020-2026) =====
interface Emenda {
  emenda: string;
  ano: number;
  autor: string;
  partido: string;
  situacao: string;
  meta: number | string;
  descricao_meta: string;
  unidade: string;
  qtde: number | string;
  meses: number | string;
  valor: number;
  link: string;
}

const emendas: Emenda[] = [
  { emenda: "202031350009", ano: 2020, autor: "Arlindo Chinaglia", partido: "PT-SP", situacao: "Concluído", meta: 1, descricao_meta: "Reforma do Prédio da Cadeia Velha", unidade: "M2", qtde: 135, meses: 14, valor: 170000, link: "https://especiais.transferegov.sistema.gov.br/transferencia-especial/plano-acao/detalhe/4118/plano-trabalho" },
  { emenda: "202030890002", ano: 2020, autor: "Eduardo Cury", partido: "PSDB-SP", situacao: "Em aditivação", meta: 1, descricao_meta: "Reforma do prédio localizado na Praça BIP", unidade: "M2", qtde: 133, meses: 9, valor: 241692.47, link: "https://especiais.transferegov.sistema.gov.br/transferencia-especial/plano-acao/detalhe/3908/plano-trabalho" },
  { emenda: "202030890002", ano: 2020, autor: "Eduardo Cury", partido: "PSDB-SP", situacao: "Em aditivação", meta: 2, descricao_meta: "Pavimentação e Drenagem na Rua Vinte, Bairro Sapê, Município de Ubatuba/SP", unidade: "M2", qtde: 1418, meses: 10, valor: 299999.96, link: "https://especiais.transferegov.sistema.gov.br/transferencia-especial/plano-acao/detalhe/3908/plano-trabalho" },
  { emenda: "202041260003", ano: 2020, autor: "Policial Katia Sastre", partido: "PL-SP", situacao: "Concluído", meta: 1, descricao_meta: "Aquisição de veículo adaptado para atender as atividades da Guarda Civil Municipal", unidade: "UN", qtde: 1, meses: 2, valor: 100000, link: "https://especiais.transferegov.sistema.gov.br/transferencia-especial/plano-acao/detalhe/3594/plano-trabalho" },
  { emenda: "202139460009", ano: 2021, autor: "Coronel Tadeu", partido: "PSL-SP", situacao: "Concluído", meta: 1, descricao_meta: "Execução Parcial da Manutenção do Prédio da SETUR - Secretaria Municipal de Turismo", unidade: "M2", qtde: 555, meses: 3, valor: 60000, link: "https://especiais.transferegov.sistema.gov.br/transferencia-especial/plano-acao/detalhe/13634/plano-trabalho" },
  { emenda: "202139460009", ano: 2021, autor: "Coronel Tadeu", partido: "PSL-SP", situacao: "Concluído", meta: 2, descricao_meta: "Aquisição de equipamentos para a SETUR - Secretaria Municipal de Turismo", unidade: "UN", qtde: 1, meses: 12, valor: 45000, link: "https://especiais.transferegov.sistema.gov.br/transferencia-especial/plano-acao/detalhe/13634/plano-trabalho" },
  { emenda: "202139460009", ano: 2021, autor: "Coronel Tadeu", partido: "PSL-SP", situacao: "Concluído", meta: 1, descricao_meta: "Execução Parcial da Manutenção do Prédio da SETUR - Secretaria Municipal de Turismo", unidade: "M2", qtde: 555, meses: 3, valor: 45000, link: "https://especiais.transferegov.sistema.gov.br/transferencia-especial/plano-acao/detalhe/13880/plano-trabalho" },
  { emenda: "202141180007", ano: 2021, autor: "Marco Bertaiolli", partido: "PSD-SP", situacao: "Concluído", meta: 1, descricao_meta: "Contratação de empresa para construção da Escola de surf na Praia do Sapê", unidade: "UN", qtde: 1, meses: 36, valor: 200000, link: "https://especiais.transferegov.sistema.gov.br/transferencia-especial/plano-acao/detalhe/13083/plano-trabalho" },
  { emenda: "202137350005", ano: 2021, autor: "Nilto Tatto", partido: "PT-SP", situacao: "Concluído", meta: 1, descricao_meta: "Pavimentação e drenagem superficial na rua Amendoeira, bairro Lázaro", unidade: "M2", qtde: 653, meses: 7, valor: 250000, link: "https://especiais.transferegov.sistema.gov.br/transferencia-especial/plano-acao/detalhe/11360/plano-trabalho" },
  { emenda: "202230890001", ano: 2022, autor: "Eduardo Cury", partido: "PSDB-SP", situacao: "Concluído", meta: 1, descricao_meta: "Contratação de empresa especializada para Construção de Ponte sobre o Rio Maranduba, no município de Ubatuba", unidade: "M2", qtde: 95, meses: 6, valor: 250000, link: "https://especiais.transferegov.sistema.gov.br/transferencia-especial/plano-acao/detalhe/18672/plano-trabalho" },
  { emenda: "202215810016", ano: 2022, autor: "Jefferson Campos", partido: "PL-SP", situacao: "Concluído", meta: 1, descricao_meta: "Contratação de empresa especializada para execução de serviços de pavimentação e drenagem na Estufa I", unidade: "M2", qtde: 3375, meses: 7, valor: 500000, link: "https://especiais.transferegov.sistema.gov.br/transferencia-especial/plano-acao/detalhe/17075/plano-trabalho" },
  { emenda: "202237350004", ano: 2022, autor: "Nilto Tatto", partido: "PT-SP", situacao: "Concluído", meta: 1, descricao_meta: "Iluminação Pública da Rua Saíras e Aguia - bairro Rio Escuro", unidade: "UN", qtde: 8, meses: 12, valor: 100000, link: "https://especiais.transferegov.sistema.gov.br/transferencia-especial/plano-acao/detalhe/16751/plano-trabalho" },
  { emenda: "202223660001", ano: 2022, autor: "Vanderlei Macris", partido: "PSDB-SP", situacao: "Concluído", meta: 1, descricao_meta: "Contratação de Empresa para Construção da Sede da Secretaria Municipal de Obras Públicas", unidade: "UN", qtde: 1, meses: 16, valor: 250000, link: "https://especiais.transferegov.sistema.gov.br/transferencia-especial/plano-acao/detalhe/17536/plano-trabalho" },
  { emenda: "202390600002", ano: 2023, autor: "Capitão Derrite", partido: "PL-SP (hoje PP)", situacao: "Concluído", meta: 1, descricao_meta: "Aquisição de veículo tipo van para atender as necessidades da secretaria municipal de esportes e lazer", unidade: "UN", qtde: 1, meses: 25, valor: 300000, link: "https://especiais.transferegov.sistema.gov.br/transferencia-especial/plano-acao/detalhe/39097/plano-trabalho" },
  { emenda: "202328010001", ano: 2023, autor: "Guilherme Mussi", partido: "PP-SP", situacao: "Concluído", meta: 1, descricao_meta: "Revitalização da Praça do Sumidouro, na rua 6, bairro Sumidouro", unidade: "M2", qtde: 1352, meses: 12, valor: 200000, link: "https://especiais.transferegov.sistema.gov.br/transferencia-especial/plano-acao/detalhe/35083/plano-trabalho" },
  { emenda: "202337350006", ano: 2023, autor: "Nilto Tatto", partido: "PT-SP", situacao: "Concluído", meta: 1, descricao_meta: "Pavimentação e drenagem superficial da rua Manoel Correa Leite, Jd. Carolina", unidade: "M2", qtde: 1424, meses: 12, valor: 398999.33, link: "https://especiais.transferegov.sistema.gov.br/transferencia-especial/plano-acao/detalhe/36387/plano-trabalho" },
  { emenda: "202337350006", ano: 2023, autor: "Nilto Tatto", partido: "PT-SP", situacao: "Concluído", meta: 2, descricao_meta: "Reforma e Manutenção da escada de acesso a praia, Toninhas", unidade: "M2", qtde: 33, meses: 4, valor: 58388.25, link: "https://especiais.transferegov.sistema.gov.br/transferencia-especial/plano-acao/detalhe/36387/plano-trabalho" },
  { emenda: "202337350006", ano: 2023, autor: "Nilto Tatto", partido: "PT-SP", situacao: "Concluído", meta: 3, descricao_meta: "Pavimentação da Rua Vitor, bairro Acaraú", unidade: "M2", qtde: 784, meses: 12, valor: 292612.42, link: "https://especiais.transferegov.sistema.gov.br/transferencia-especial/plano-acao/detalhe/36387/plano-trabalho" },
  { emenda: "202325340025", ano: 2023, autor: "Paulo Teixeira", partido: "PT-SP", situacao: "Concluído", meta: 1, descricao_meta: "Aquisição de veículo para a Secretaria Municipal de Habitação", unidade: "UN", qtde: 1, meses: 12, valor: 100000, link: "https://especiais.transferegov.sistema.gov.br/transferencia-especial/plano-acao/detalhe/33251/plano-trabalho" },
  { emenda: "202342210001", ano: 2023, autor: "Sen. Giordano", partido: "MDB-SP (hoje Podemos)", situacao: "Concluído", meta: 1, descricao_meta: "Aquisição de Concreto Betuminoso Usinado a Quente (CBUQ) nas faixas \"b\", \"c\" e \"d\"", unidade: "T", qtde: 3125, meses: 12, valor: 2393750, link: "https://especiais.transferegov.sistema.gov.br/transferencia-especial/plano-acao/detalhe/38872/plano-trabalho" },
  { emenda: "202342210001", ano: 2023, autor: "Sen. Giordano", partido: "MDB-SP (hoje Podemos)", situacao: "Concluído", meta: 2, descricao_meta: "Execução de infraestrutura urbana na Av. Iperoig (Termo Aditivo nº 01 ao CT 76/2023)", unidade: "M2", qtde: 1986, meses: 12, valor: 842949.27, link: "https://especiais.transferegov.sistema.gov.br/transferencia-especial/plano-acao/detalhe/38872/plano-trabalho" },
  { emenda: "202342210001", ano: 2023, autor: "Sen. Giordano", partido: "MDB-SP (hoje Podemos)", situacao: "Concluído", meta: 3, descricao_meta: "Pavimentação da estrada da Casanga", unidade: "M2", qtde: 18430, meses: 25, valor: 4867812.16, link: "https://especiais.transferegov.sistema.gov.br/transferencia-especial/plano-acao/detalhe/38872/plano-trabalho" },
  { emenda: "202342210001", ano: 2023, autor: "Sen. Giordano", partido: "MDB-SP (hoje Podemos)", situacao: "Concluído", meta: 4, descricao_meta: "Revitalização da Ciclovia da Região Sul (aditivo)", unidade: "M2", qtde: 233, meses: 17, valor: 104274.88, link: "https://especiais.transferegov.sistema.gov.br/transferencia-especial/plano-acao/detalhe/38872/plano-trabalho" },
  { emenda: "202342210001", ano: 2023, autor: "Sen. Giordano", partido: "MDB-SP (hoje Podemos)", situacao: "Concluído", meta: 5, descricao_meta: "Reforma e ampliação do estádio municipal", unidade: "M2", qtde: 1287, meses: 60, valor: 832232.91, link: "https://especiais.transferegov.sistema.gov.br/transferencia-especial/plano-acao/detalhe/38872/plano-trabalho" },
  { emenda: "202342210001", ano: 2023, autor: "Sen. Giordano", partido: "MDB-SP (hoje Podemos)", situacao: "Concluído", meta: 6, descricao_meta: "Revitalização da Estrada do Cais (Lote 2)", unidade: "M2", qtde: 8880, meses: 33, valor: 94026.09, link: "https://especiais.transferegov.sistema.gov.br/transferencia-especial/plano-acao/detalhe/38872/plano-trabalho" },
  { emenda: "202342210001", ano: 2023, autor: "Sen. Giordano", partido: "MDB-SP (hoje Podemos)", situacao: "Concluído", meta: 7, descricao_meta: "Recuperação de muro de arrimo da orla da praia do Itaguá (aditivo)", unidade: "M2", qtde: 30, meses: 27, valor: 888832.06, link: "https://especiais.transferegov.sistema.gov.br/transferencia-especial/plano-acao/detalhe/38872/plano-trabalho" },
  { emenda: "202342210001", ano: 2023, autor: "Sen. Giordano", partido: "MDB-SP (hoje Podemos)", situacao: "Concluído", meta: 8, descricao_meta: "Pavimentação, drenagem e sinalização em ruas do bairro Estufa II", unidade: "M2", qtde: 13841, meses: 60, valor: 617484.48, link: "https://especiais.transferegov.sistema.gov.br/transferencia-especial/plano-acao/detalhe/38872/plano-trabalho" },
  { emenda: "202342210001", ano: 2023, autor: "Sen. Giordano", partido: "MDB-SP (hoje Podemos)", situacao: "Concluído", meta: 9, descricao_meta: "Pavimentação e drenagem no bairro Taquaral (aditivo +90 dias)", unidade: "M2", qtde: 1926, meses: 14, valor: 461382.21, link: "https://especiais.transferegov.sistema.gov.br/transferencia-especial/plano-acao/detalhe/38872/plano-trabalho" },
  { emenda: "202342210001", ano: 2023, autor: "Sen. Giordano", partido: "MDB-SP (hoje Podemos)", situacao: "Concluído", meta: 10, descricao_meta: "Remanescente da pavimentação de acesso à orla da Picinguaba", unidade: "M2", qtde: 17159, meses: 14, valor: 803755.84, link: "https://especiais.transferegov.sistema.gov.br/transferencia-especial/plano-acao/detalhe/38872/plano-trabalho" },
  { emenda: "202342210001", ano: 2023, autor: "Sen. Giordano", partido: "MDB-SP (hoje Podemos)", situacao: "Concluído", meta: 11, descricao_meta: "Ponte sobre o Rio Indaiá, Estrada do Angelim, bairro Taquaral (aditivo)", unidade: "M2", qtde: 8, meses: 16, valor: 144529.77, link: "https://especiais.transferegov.sistema.gov.br/transferencia-especial/plano-acao/detalhe/38872/plano-trabalho" },
  { emenda: "202342210001", ano: 2023, autor: "Sen. Giordano", partido: "MDB-SP (hoje Podemos)", situacao: "Concluído", meta: 12, descricao_meta: "Revitalização da Praça da Av. Palmeiras, Estufa II (Lote 1, aditivo)", unidade: "M2", qtde: 18, meses: 4, valor: 4764.11, link: "https://especiais.transferegov.sistema.gov.br/transferencia-especial/plano-acao/detalhe/38872/plano-trabalho" },
  { emenda: "202342210001", ano: 2023, autor: "Sen. Giordano", partido: "MDB-SP (hoje Podemos)", situacao: "Concluído", meta: 13, descricao_meta: "Revitalização da praça Maracanã (Lote 2, aditivo)", unidade: "UN", qtde: 58, meses: 18, valor: 174744.46, link: "https://especiais.transferegov.sistema.gov.br/transferencia-especial/plano-acao/detalhe/38872/plano-trabalho" },
  { emenda: "202342210001", ano: 2023, autor: "Sen. Giordano", partido: "MDB-SP (hoje Podemos)", situacao: "Concluído", meta: 14, descricao_meta: "Revitalização da Praça do Bairro Marafunda (Lote 2, aditivo)", unidade: "M2", qtde: 600, meses: 12, valor: 31128.32, link: "https://especiais.transferegov.sistema.gov.br/transferencia-especial/plano-acao/detalhe/38872/plano-trabalho" },
  { emenda: "202342210001", ano: 2023, autor: "Sen. Giordano", partido: "MDB-SP (hoje Podemos)", situacao: "Concluído", meta: 15, descricao_meta: "Revitalização da Praça Marino Elídio Vieira e Praça Sapa (aditivo)", unidade: "M2", qtde: 30, meses: 19, valor: 38190.66, link: "https://especiais.transferegov.sistema.gov.br/transferencia-especial/plano-acao/detalhe/38872/plano-trabalho" },
  { emenda: "202342210001", ano: 2023, autor: "Sen. Giordano", partido: "MDB-SP (hoje Podemos)", situacao: "Concluído", meta: 16, descricao_meta: "Construção da Sede da Secretaria Municipal de Obras Públicas (Lote 2, aditivo)", unidade: "M2", qtde: 125, meses: 15, valor: 11248.48, link: "https://especiais.transferegov.sistema.gov.br/transferencia-especial/plano-acao/detalhe/38872/plano-trabalho" },
  { emenda: "202342210001", ano: 2023, autor: "Sen. Giordano", partido: "MDB-SP (hoje Podemos)", situacao: "Concluído", meta: 17, descricao_meta: "Revitalização do espaço de eventos do Sertão do Ubatumirim (aditivo)", unidade: "UN", qtde: 6, meses: 26, valor: 70564.42, link: "https://especiais.transferegov.sistema.gov.br/transferencia-especial/plano-acao/detalhe/38872/plano-trabalho" },
  { emenda: "202342210001", ano: 2023, autor: "Sen. Giordano", partido: "MDB-SP (hoje Podemos)", situacao: "Concluído", meta: 18, descricao_meta: "Pavimentação e recapeamento em vias da Região Sul", unidade: "M2", qtde: 20460, meses: 28, valor: 500000, link: "https://especiais.transferegov.sistema.gov.br/transferencia-especial/plano-acao/detalhe/38872/plano-trabalho" },
  { emenda: "202342210001", ano: 2023, autor: "Sen. Giordano", partido: "MDB-SP (hoje Podemos)", situacao: "Concluído", meta: 19, descricao_meta: "Pavimentação e drenagem na Estufa I (Lote 9, aditivo)", unidade: "M2", qtde: 184, meses: 13, valor: 46275.87, link: "https://especiais.transferegov.sistema.gov.br/transferencia-especial/plano-acao/detalhe/38872/plano-trabalho" },
  { emenda: "202342210001", ano: 2023, autor: "Sen. Giordano", partido: "MDB-SP (hoje Podemos)", situacao: "Concluído", meta: 20, descricao_meta: "Registro de preço de hora para locação de veículos e máquinas pesadas", unidade: "H", qtde: 15000, meses: 13, valor: 4405500, link: "https://especiais.transferegov.sistema.gov.br/transferencia-especial/plano-acao/detalhe/38872/plano-trabalho" },
  { emenda: "202342210001", ano: 2023, autor: "Sen. Giordano", partido: "MDB-SP (hoje Podemos)", situacao: "Concluído", meta: 21, descricao_meta: "Pequenos serviços de reparos e manutenção de próprios públicos", unidade: "UN", qtde: 1, meses: 24, valor: 732008.01, link: "https://especiais.transferegov.sistema.gov.br/transferencia-especial/plano-acao/detalhe/38872/plano-trabalho" },
  { emenda: "202431340005", ano: 2024, autor: "Fausto Pinato", partido: "PP-SP", situacao: "Concluído", meta: 1, descricao_meta: "Pavimentação e drenagem em diversas ruas do município (Mato Dentro e Taquaral)", unidade: "M2", qtde: 2142, meses: 36, valor: 704998.66, link: "https://especiais.transferegov.sistema.gov.br/transferencia-especial/plano-acao/detalhe/72134/plano-trabalho" },
  { emenda: "202431340005", ano: 2024, autor: "Fausto Pinato", partido: "PP-SP", situacao: "Concluído", meta: 2, descricao_meta: "Aquisição de veículo automotor", unidade: "UN", qtde: 1, meses: 12, valor: 206900, link: "https://especiais.transferegov.sistema.gov.br/transferencia-especial/plano-acao/detalhe/72134/plano-trabalho" },
  { emenda: "202431340005", ano: 2024, autor: "Fausto Pinato", partido: "PP-SP", situacao: "Concluído", meta: 3, descricao_meta: "Pavimentação e drenagem superficial da rua Doracidia Maria Vieira, Perequê Açu", unidade: "M2", qtde: 1579, meses: 6, valor: 410446.34, link: "https://especiais.transferegov.sistema.gov.br/transferencia-especial/plano-acao/detalhe/72134/plano-trabalho" },
  { emenda: "202444290001", ano: 2024, autor: "Mauricio Neves", partido: "PP-SP", situacao: "Concluído", meta: 1, descricao_meta: "Execução da Quadra Sintética localizada na Praça Renata Bergamie, no Bairro Perequê Açu", unidade: "M2", qtde: 1248, meses: 12, valor: 500000, link: "https://especiais.transferegov.sistema.gov.br/transferencia-especial/plano-acao/detalhe/74925/plano-trabalho" },
  { emenda: "202442650003", ano: 2024, autor: "Sen. Astronauta Marcos Pontes", partido: "PL-SP", situacao: "Concluído", meta: 1, descricao_meta: "Contratação de solução integrada de educação digital com serviços de formação docente", unidade: "UN", qtde: 1, meses: 12, valor: 200000, link: "https://especiais.transferegov.sistema.gov.br/transferencia-especial/plano-acao/detalhe/65715/plano-trabalho" },
  { emenda: "202543500003", ano: 2025, autor: "Delegado Paulo Bilynskyj", partido: "PL-SP", situacao: "Aprovado (em execução)", meta: 1, descricao_meta: "Aquisição de equipamento para implantação de simulador de tiro para a Guarda Municipal", unidade: "UN", qtde: 1, meses: 12, valor: 297000, link: "https://especiais.transferegov.sistema.gov.br/transferencia-especial/plano-acao/detalhe/80925/plano-trabalho" },
  { emenda: "202637350007", ano: 2026, autor: "Nilto Tatto", partido: "PT-SP", situacao: "Aprovado (em execução)", meta: 1, descricao_meta: "Pavimentação em bloco de concreto intertravado e drenagem da Estrada da Folha Seca", unidade: "CM2", qtde: 3963, meses: 12, valor: 497500, link: "https://especiais.transferegov.sistema.gov.br/transferencia-especial/plano-acao/detalhe/95599/plano-trabalho" },
  { emenda: "202543060003", ano: 2025, autor: "Antonio Carlos Rodrigues", partido: "PL-SP (hoje Podemos)", situacao: "IMPEDIDO", meta: "—", descricao_meta: "Plano de ação de R$ 277.200,00 (custeio, Saúde/Atenção Básica) impedido — sem plano de trabalho no prazo", unidade: "—", qtde: "—", meses: "—", valor: 0, link: "https://especiais.transferegov.sistema.gov.br/transferencia-especial/plano-acao/detalhe/79073/plano-trabalho" },
];

// ===== ÁREAS DE APLICAÇÃO =====
function getArea(descricao: string): string {
  const d = descricao.toLowerCase();
  if (d.includes("paviment") || d.includes("drenagem") || d.includes("recapeamento") || d.includes("estrada") || d.includes("rua ") || d.includes("bloco de concreto")) return "Infraestrutura Viária";
  if (d.includes("praça") || d.includes("ciclovia") || d.includes("orla") || d.includes("muro de arrimo") || d.includes("revitalização")) return "Urbanismo e Lazer";
  if (d.includes("ponte")) return "Infraestrutura Viária";
  if (d.includes("reforma") || d.includes("construção") || d.includes("sede") || d.includes("prédio") || d.includes("cadeia")) return "Obras Públicas";
  if (d.includes("veículo") || d.includes("van") || d.includes("automotor")) return "Aquisição de Veículos";
  if (d.includes("equipamento") || d.includes("simulador") || d.includes("máquinas")) return "Equipamentos";
  if (d.includes("iluminação")) return "Iluminação Pública";
  if (d.includes("surf") || d.includes("escola") || d.includes("quadra") || d.includes("estádio") || d.includes("esporte")) return "Esporte";
  if (d.includes("educação") || d.includes("formação") || d.includes("digital")) return "Educação";
  if (d.includes("saúde") || d.includes("atenção básica")) return "Saúde";
  if (d.includes("turismo") || d.includes("setur")) return "Turismo";
  if (d.includes("habitação")) return "Habitação";
  if (d.includes("reparos") || d.includes("manutenção")) return "Manutenção";
  if (d.includes("registro de preço") || d.includes("locação")) return "Serviços";
  return "Outros";
}

export default function EmendasParlamentares() {
  const [filtroAno, setFiltroAno] = useState<string>("todos");
  const [filtroAutor, setFiltroAutor] = useState<string>("todos");
  const [filtroArea, setFiltroArea] = useState<string>("todos");
  const [busca, setBusca] = useState("");
  const [parlamentarExpandido, setParlamentarExpandido] = useState<string | null>(null);

  const anos = useMemo(() => Array.from(new Set(emendas.map(e => e.ano))).sort((a, b) => b - a), []);
  const autores = useMemo(() => Array.from(new Set(emendas.map(e => e.autor))).sort(), []);
  const areas = useMemo(() => Array.from(new Set(emendas.map(e => getArea(e.descricao_meta)))).sort(), []);

  const emendasFiltradas = useMemo(() => {
    return emendas.filter(e => {
      if (filtroAno !== "todos" && e.ano !== Number(filtroAno)) return false;
      if (filtroAutor !== "todos" && e.autor !== filtroAutor) return false;
      if (filtroArea !== "todos" && getArea(e.descricao_meta) !== filtroArea) return false;
      if (busca) {
        const term = busca.toLowerCase();
        return e.descricao_meta.toLowerCase().includes(term) || e.autor.toLowerCase().includes(term) || e.partido.toLowerCase().includes(term);
      }
      return true;
    });
  }, [filtroAno, filtroAutor, filtroArea, busca]);

  const totalGeral = emendas.reduce((s, e) => s + e.valor, 0);
  const totalFiltrado = emendasFiltradas.reduce((s, e) => s + e.valor, 0);

  const formatCurrency = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  // Agrupar por autor para resumo
  const resumoPorAutor = useMemo(() => {
    const map: Record<string, { total: number; qtd: number; partido: string }> = {};
    emendas.forEach(e => {
      if (!map[e.autor]) map[e.autor] = { total: 0, qtd: 0, partido: e.partido };
      map[e.autor].total += e.valor;
      map[e.autor].qtd += 1;
    });
    return Object.entries(map).sort((a, b) => b[1].total - a[1].total);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f6f0] pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1a3a2a] to-[#2d5a3f] text-white py-16 md:py-24">
        <div className="container max-w-6xl">
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="w-8 h-8 text-[#008CBF]" />
            <span className="text-[#008CBF] font-semibold uppercase tracking-wider text-sm">Transparência Pública</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Emendas Parlamentares</h1>
          <p className="text-lg md:text-xl text-white/80 max-w-3xl">
            Execução de todas as Emendas PIX (Transferências Especiais) recebidas pelo município de Ubatuba/SP — 2020 a 2026. 
            Dados extraídos da API de Dados Abertos do Transferegov.br.
          </p>
          <div className="mt-8 flex flex-wrap gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4">
              <p className="text-sm text-white/60">Total Recebido</p>
              <p className="text-2xl md:text-3xl font-bold text-[#008CBF]">{formatCurrency(totalGeral)}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4">
              <p className="text-sm text-white/60">Metas de Trabalho</p>
              <p className="text-2xl md:text-3xl font-bold">{emendas.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4">
              <p className="text-sm text-white/60">Parlamentares</p>
              <p className="text-2xl md:text-3xl font-bold">{autores.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4">
              <p className="text-sm text-white/60">Período</p>
              <p className="text-2xl md:text-3xl font-bold">2020–2026</p>
            </div>
          </div>
        </div>
      </section>

      {/* Resumo por Parlamentar */}
      <section className="py-12 bg-white border-b">
        <div className="container max-w-6xl">
          <h2 className="text-2xl font-bold text-[#1a3a2a] mb-6 flex items-center gap-2">
            <Users className="w-6 h-6" /> Parlamentares que Destinaram Emendas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resumoPorAutor.map(([autor, info]) => {
              const p = parlamentares[autor];
              const expandido = parlamentarExpandido === autor;
              return (
                <div key={autor} className="border rounded-xl overflow-hidden bg-[#f8f6f0] hover:shadow-md transition-shadow">
                  <div 
                    className="flex items-center gap-3 p-4 cursor-pointer"
                    onClick={() => setParlamentarExpandido(expandido ? null : autor)}
                  >
                    {p && (
                      <img src={p.foto} alt={p.nome} className="w-14 h-14 rounded-full object-cover border-2 border-[#1a3a2a]/20 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#1a3a2a] truncate">{p?.nome || autor}</p>
                      <p className="text-xs text-gray-500">{info.partido} • {p?.cargo || "Parlamentar"}</p>
                      <p className="text-sm font-bold text-[#008CBF] mt-1">{formatCurrency(info.total)}</p>
                    </div>
                    <div className="flex-shrink-0">
                      {expandido ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                    </div>
                  </div>
                  {expandido && p && (
                    <div className="px-4 pb-4 border-t bg-white">
                      <p className="text-sm text-gray-600 mt-3">{p.bio}</p>
                      <p className="text-xs text-gray-400 mt-2">{info.qtd} meta(s) de trabalho registrada(s)</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Filtros */}
      <section className="py-8 bg-[#f8f6f0] border-b sticky top-16 z-30">
        <div className="container max-w-6xl">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por descrição, autor ou partido..."
                value={busca}
                onChange={e => setBusca(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#008CBF]/30"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select value={filtroAno} onChange={e => setFiltroAno(e.target.value)} className="px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm">
                <option value="todos">Todos os anos</option>
                {anos.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
              <select value={filtroAutor} onChange={e => setFiltroAutor(e.target.value)} className="px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm">
                <option value="todos">Todos os parlamentares</option>
                {autores.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
              <select value={filtroArea} onChange={e => setFiltroArea(e.target.value)} className="px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm">
                <option value="todos">Todas as áreas</option>
                {areas.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </div>
          {(filtroAno !== "todos" || filtroAutor !== "todos" || filtroArea !== "todos" || busca) && (
            <div className="mt-3 flex items-center gap-4 text-sm">
              <span className="text-gray-500">
                <TrendingUp className="w-4 h-4 inline mr-1" />
                {emendasFiltradas.length} resultado(s) • Total: <strong className="text-[#008CBF]">{formatCurrency(totalFiltrado)}</strong>
              </span>
              <button onClick={() => { setFiltroAno("todos"); setFiltroAutor("todos"); setFiltroArea("todos"); setBusca(""); }} className="text-red-500 hover:underline">
                Limpar filtros
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Tabela de Emendas */}
      <section className="py-8">
        <div className="container max-w-6xl">
          <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-[#1a3a2a] text-white">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Ano</th>
                  <th className="px-4 py-3 text-left font-medium">Parlamentar</th>
                  <th className="px-4 py-3 text-left font-medium">Partido</th>
                  <th className="px-4 py-3 text-left font-medium">Área</th>
                  <th className="px-4 py-3 text-left font-medium max-w-xs">Descrição da Meta</th>
                  <th className="px-4 py-3 text-left font-medium">Situação</th>
                  <th className="px-4 py-3 text-right font-medium">Valor (R$)</th>
                  <th className="px-4 py-3 text-center font-medium">Consulta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {emendasFiltradas.map((e, i) => (
                  <tr key={i} className="hover:bg-[#f8f6f0]/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-[#1a3a2a]">{e.ano}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {parlamentares[e.autor] && (
                          <img src={parlamentares[e.autor].foto} alt="" className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                        )}
                        <span className="truncate max-w-[120px]">{e.autor}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{e.partido}</td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-[#008CBF]/10 text-[#008CBF]">
                        {getArea(e.descricao_meta)}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="text-gray-700 line-clamp-2">{e.descricao_meta}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        e.situacao === "Concluído" ? "bg-green-100 text-green-700" :
                        e.situacao === "IMPEDIDO" ? "bg-red-100 text-red-700" :
                        e.situacao.includes("execução") ? "bg-yellow-100 text-yellow-700" :
                        "bg-gray-100 text-gray-700"
                      }`}>
                        {e.situacao}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold whitespace-nowrap">
                      {e.valor > 0 ? formatCurrency(e.valor) : "—"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <a href={e.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[#008CBF] hover:underline text-xs">
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span className="hidden md:inline">Ver</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-[#f8f6f0] border-t-2 border-[#1a3a2a]">
                <tr>
                  <td colSpan={6} className="px-4 py-3 font-bold text-[#1a3a2a]">
                    TOTAL {filtroAno !== "todos" || filtroAutor !== "todos" || filtroArea !== "todos" || busca ? "(filtrado)" : "GERAL"}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-[#1a3a2a] text-base whitespace-nowrap">
                    {formatCurrency(totalFiltrado)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </section>

      {/* Nota de Rodapé */}
      <section className="py-8 bg-white border-t">
        <div className="container max-w-6xl">
          <div className="bg-[#f8f6f0] rounded-xl p-6 border">
            <h3 className="font-semibold text-[#1a3a2a] mb-2 flex items-center gap-2">
              <Calendar className="w-5 h-5" /> Fonte dos Dados
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Dados extraídos da API de Dados Abertos do <strong>Transferegov.br</strong> (transferenciasespeciais: plano_acao_especial, executor_especial, meta_especial) 
              e API pública do módulo Transferências Especiais. Consulta realizada em 15/07/2026. Cada linha é uma META do Plano de Trabalho do município, 
              mostrando em que o recurso da emenda foi/está sendo aplicado. Os links direcionam para a página pública do plano de trabalho no Portal da Transparência.
            </p>
            <p className="text-xs text-gray-400 mt-3">
              As emendas de "finalidade definida" (Tiririca, Miguel Lombardi, Márcio Alvino etc.) não passam pelo módulo Pix; são repasses a fundo (saúde/assistência) 
              ou convênios — documentados no Fundo Nacional de Saúde e no Portal da Transparência (aba "Emendas PL").
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
