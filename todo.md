# Instituto Ubatuba — TODO

## Identidade Visual e Tema
- [x] Configurar paleta de cores com verde floresta #315832 e tons naturais
- [x] Adicionar tipografias sofisticadas (Playfair Display + Inter) via Google Fonts
- [x] Atualizar index.css com variáveis CSS, tema claro elegante e estilos globais
- [x] Configurar animações suaves e micro-interações

## Estrutura e Navegação
- [x] Criar componente Header com navegação responsiva e logo
- [x] Criar componente Footer com links, redes sociais e créditos
- [x] Configurar rotas no App.tsx (Home, Sobre, Programas, Galeria, Apoie, Contato, Blog)
- [x] Schema do banco: tabelas posts (blog), galeria, projetos, contatos

## Página Inicial (Home)
- [x] Hero section com imagem de fundo, missão e CTA impactante
- [x] Seção de números/impacto (160 crianças surfe, 120 futebol, 781 exames, etc.)
- [x] Seção de destaques dos programas
- [x] Seção de chamada para apoio/doação
- [x] Seção de últimas notícias

## Sobre Nós
- [x] História do instituto
- [x] Missão, Visão e Valores
- [x] Referência explícita à ODS 18 (bem-estar animal e conservação ecológica)
- [x] Apresentação da equipe

## Programas e Projetos
- [x] Escolinha de Surfe (160 crianças)
- [x] Escolinha de Futebol (120 crianças)
- [x] Escolinha de Futevôlei (80 crianças)
- [x] Bituqueira Ecológica
- [x] Projeto Itaguá Azul
- [x] Ações de Saúde (781 exames/consultas, 3 bolsas)
- [x] Parceria com Escola Marina Nepomuceno do Amaral
- [x] Festival de Pipas e Festival de Escultura na Areia

## Galeria
- [x] Grid de fotos do santuário e atividades
- [x] Lightbox para visualização ampliada
- [x] Filtros por categoria

## Como Apoiar
- [x] Seção de voluntáriado
- [x] Seção de doações
- [x] Seção de parcerias institucionais

## Contato e Localização
- [x] Formulário de contato (nome, e-mail, mensagem)
- [x] Mapa integrado com localização em Ubatuba
- [x] Informações de contato (endereço, e-mail, telefone)
- [x] Integração com notifyOwner para novos contatos

## Blog / Notícias
- [x] Listagem de posts com cards elegantes
- [x] Página de post individual
- [x] Área admin para criar/editar posts (protectedProcedure)
- [x] tRPC routers para CRUD de posts

## Testes
- [x] Vitest para routers de posts e contato (10 testes passando)
- [x] Verificação de responsividade mobile

## Compliance e Transparência

- [x] Criar página /transparencia com seções: Governança, Documentos Públicos, Financeiro, Código de Conduta, Canal de Ética, Certificações
- [x] Seção de Princípios de Governança (inspirado na Gates Foundation)
- [x] Seção de Documentos Públicos para download (Estatuto, Relatórios, Demonstrações Financeiras)
- [x] Seção de Programa de Integridade (Código de Conduta + Política Anticorrupção)
- [x] Canal de Ética com formulário anônimo e protocolo de acompanhamento
- [x] Seção de Certificações e Selos (Charity Navigator, GuideStar Platinum, TheDotGood, OSCIP)
- [x] Painel de alocação de recursos financeiros (72% em programas)
- [x] Seção de Igualdade Salarial (Lei nº 14.611/2023 + IN GM/MTE nº 6/2024)
- [x] Seção de Convênios e Parcerias Públicas
- [x] Seção de Normas Adotadas (LGPD, GRI, ODS, FASB/NBC)
- [x] Integrar link de Transparência no Header e Footer
- [x] Router tRPC para canal de ética (envio anônimo + consulta por protocolo)
- [x] Notificar owner ao receber mensagem pelo canal de ética
- [x] 14 testes Vitest passando (incluindo 4 novos para canal de ética)

## Doações Online (Stripe)

- [x] Configurar Stripe no projeto via webdev_add_feature
- [x] Criar endpoint tRPC para gerar Stripe Checkout Session (valores fixos + valor livre)
- [x] Criar página /obrigado para confirmação pós-doação (success_url)
- [x] Atualizar página Apoie com seção de doação com botões de valores pré-definidos (R$30, R$50, R$100, R$200) e valor personalizado
- [x] Webhook Stripe para confirmar pagamentos e notificar o owner
- [x] 14 testes Vitest passando

## Redesign inspirado na SOS Mata Atlântica

- [x] Adicionar barra lateral flutuante com atalhos (Doar, Newsletter, WhatsApp)
- [x] Adicionar wave dividers (ondas orgânicas) entre seções da Home
- [x] Criar seção de Causas/Áreas com tabs (Esporte, Saúde, Conservação, Educação)
- [x] Criar CTA de doação com fundo vibrante (dourado) na Home
- [x] Adicionar seção de Parceiros com grid de logos
- [x] Adicionar formulário de Newsletter no footer com LGPD
- [x] Melhorar seção de números de impacto com ícones line-art e fundo colorido
- [x] Transformar hero em carrossel de notícias/destaques com auto-advance
- [x] Adicionar seção "Fique por dentro" com grid de notícias/artigos
