-- Auditoria do catálogo de cursos — 11/11/2026
-- Checados os 1.127 cursos: NENHUM é pago. Harvard, edX, Coursera e Prime
-- seguem o modelo "acesso gratuito, certificado opcional pago", e o certificado
-- que o aluno recebe é o do próprio Instituto.
--
-- O que há de errado são 18 LINKS, não preços.

START TRANSACTION;

-- (A) 1 registro que não é um curso: aponta para a página de navegação de temas
--     do edX, atribuído a Harvard. Não existe esse curso. Desativar.
UPDATE courses SET active = 0 WHERE id = 16; -- História da Arte Moderna e Contemporânea

-- (B) 17 cursos cujo link leva à HOME da plataforma, não ao curso.
--     Os cursos existem; o link é que está genérico. Duas opções:
--     1. Desativar até alguém corrigir o link (descomente as linhas UPDATE abaixo)
--     2. Corrigir o platformUrl de cada um (preferível)
--     Deixei desativadas por padrão para não entregar link quebrado ao aluno.
UPDATE courses SET active = 0 WHERE id = 6; -- Saúde Pública e Meio Ambiente                  -> https://campusvirtual.fiocruz.br/
UPDATE courses SET active = 0 WHERE id = 41; -- Nutrição e Alimentação Saudável                -> https://campusvirtual.fiocruz.br/
UPDATE courses SET active = 0 WHERE id = 42; -- Marketing Digital                              -> https://ead.senai.br/
UPDATE courses SET active = 0 WHERE id = 7; -- Primeiros Socorros                             -> https://ead.senai.br/
UPDATE courses SET active = 0 WHERE id = 5; -- Excel Avançado                                 -> https://ead.senai.br/
UPDATE courses SET active = 0 WHERE id = 44; -- Educação Ambiental                             -> https://mooc.cefor.ifes.edu.br/
UPDATE courses SET active = 0 WHERE id = 26; -- Espanhol Básico - MEC                          -> https://mooc.cefor.ifes.edu.br/
UPDATE courses SET active = 0 WHERE id = 23; -- Inglês para Iniciantes - MEC                   -> https://mooc.cefor.ifes.edu.br/
UPDATE courses SET active = 0 WHERE id = 21; -- Inglês Instrumental                            -> https://mooc.cefor.ifes.edu.br/
UPDATE courses SET active = 0 WHERE id = 11; -- Educação Inclusiva                             -> https://mooc.cefor.ifes.edu.br/
UPDATE courses SET active = 0 WHERE id = 12; -- Sustentabilidade: Conceitos e Aplicações       -> https://www.coursera.org/partners/usp
UPDATE courses SET active = 0 WHERE id = 45; -- Conservação da Biodiversidade                  -> https://www.coursera.org/partners/usp
UPDATE courses SET active = 0 WHERE id = 15; -- Astronomia: Uma Visão Geral                    -> https://www.coursera.org/partners/usp
UPDATE courses SET active = 0 WHERE id = 14; -- Direitos Humanos                               -> https://www.coursera.org/partners/usp
UPDATE courses SET active = 0 WHERE id = 39; -- Segurança da Informação                        -> https://www.escolavirtual.gov.br/
UPDATE courses SET active = 0 WHERE id = 13; -- Gestão Ambiental no Setor Público              -> https://www.escolavirtual.gov.br/
UPDATE courses SET active = 0 WHERE id = 9; -- Empreendedorismo no Setor Público              -> https://www.escolavirtual.gov.br/

COMMIT;

-- Para reverter qualquer desativação:
--   UPDATE courses SET active = 1 WHERE id IN (...);
-- Nenhum registro é apagado: 'active = 0' só tira do site.
