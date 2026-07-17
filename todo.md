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

## Galeria de Fotos Reais na Tab Esporte

- [x] Upload de 8 fotos reais de esporte para o storage (futebol, futevôlei, skate, surfe, esporte radical, guardiões)
- [x] Criar componente EsporteGalleryTab com carrossel de fotos + thumbnails + legendas
- [x] Integrar carrossel na tab "Esporte e Inclusão Social" da Home (substituindo imagem estática)
- [x] Auto-advance do carrossel a cada 4 segundos
- [x] Controles de navegação (setas + thumbnails clicáveis)
- [x] 18 testes Vitest passando

## Fotos Reais na Página Ações (/programas)

- [x] Substituir cards com ícones por fotos reais nos projetos de Surfe, Futebol e Futevôlei
- [x] Manter layout alternado (texto à esquerda/direita) com imagens reais
- [x] Adicionar carrossel de 6 fotos reais no card "Ações de Saúde" (Outubro Rosa, palestra, ultrassom, consulta)
- [x] Adicionar carrossel de 4 fotos reais no card "Projeto Itaguá Azul" (voluntários, limpeza de praia, canoa)
- [x] Adicionar carrossel de 4 fotos reais no card "Bituqueira Ecológica" (flyer, ponto de coleta, bitucas arte, coletor em árvore)
- [x] Adicionar carrossel de 10 fotos reais no card "Feira Literária" (crianças, palco, leitura, banner, teatro, apresentação, alunos, grupo, plateia, encenação)
- [x] Adicionar carrossel de 13 fotos reais no card "Festivais Culturais" (Festival de Pipas e Festival de Escultura na Areia)

## Adequação ao Manual de Marca v1.0

### Tipografia
- [x] Substituir fonte atual por Poppins ExtraBold (títulos) + Poppins Regular (corpo)
- [x] Implementar headlines bicolor (verde #2A502B + azul #008CBF) em títulos principais
- [x] Ajustar hierarquia: Display 40-68px, H1 26-34px, H2 20-24px, Corpo 16-18px, Legenda 12-13px
- [x] Tags/pílulas em caixa alta com tracking expandido

### Paleta de Cores
- [x] Atualizar cor primária para Verde Serra #2A502B
- [x] Atualizar cor secundária para Azul Oceano #008CBF
- [x] Atualizar cor de acento para Amarelo Sol #F4C42E
- [x] Adicionar Laranja Praia #EC9939 como terciária
- [x] Fundo principal: Areia #F6F1E7 (não branco puro)
- [x] Texto principal: Tinta #122019 (não preto puro)
- [x] Remover qualquer uso de vermelho da paleta

### Informações Institucionais
- [x] Atualizar pilares: Saúde, Esporte Social, Meio Ambiente (conforme manual)
- [x] Verificar tom de voz: humano, esperançoso, mobilizador, próximo, transparente
- [x] Atualizar textos para refletir "impacto, não favor" (sem assistencialismo)
- [x] Incluir referência ODS 17 — Parcerias como base estratégica

### Elementos Visuais
- [x] Adicionar onda dupla (azul + amarela) como assinatura no rodapé
- [x] Fundo Areia (#F6F1E7) nas seções de texto
- [x] Bullets com ponto verde nas listas

## Integrar Ações na Página Início

- [x] Mover conteúdo da página Ações (Programas) para dentro da Home
- [x] Adicionar link "Ações" no menu de navegação principal
- [x] Garantir que o link rola até a seção de ações na Home
- [x] Substituir tabs por 3 cards lado a lado na seção Áreas de Atuação (Saúde, Esporte Social, Meio Ambiente) com carrosséis de fotos reais

## Bug Fix: Notícias não abrem conteúdo

- [x] Fazer NoticiaDetalhe funcionar com fallback para postsDemo quando o banco está vazio

## Ajuste de Cores

- [x] Trocar texto/botões amarelos para azul oceano na seção CTA com fundo verde (doação + newsletter)

## Página Mascotes

- [x] Upload de todas as imagens de mascotes para o storage
- [x] Criar página Mascotes.tsx com grid de personagens e descritivos
- [x] Adicionar rota /mascotes no App.tsx
- [x] Adicionar link "Mascotes" na navegação do Header

## Efeito Parallax Hero

- [x] Implementar efeito de scroll parallax no hero da Home onde a imagem desce com a página "congelada"
- [x] Ajustar velocidade do parallax (0.7x scroll speed, imagem 130% altura, offset 0.6x)
- [x] Adicionar efeito de reveal (fade-in + slide-up) nas seções: Números de Impacto, Áreas de Atuação, CTA Doação, Notícias, Parceiros

## Blog Posts por Ação (ODS)

- [x] Criar post: Escolinha de Surfe (ODS 3, 4, 10, 14)
- [x] Criar post: Escolinha de Futebol (ODS 3, 4, 10, 11)
- [x] Criar post: Escolinha de Futevôlei (ODS 3, 4, 10)
- [x] Criar post: Projeto Itaguá Azul (ODS 6, 14, 15, 17)
- [x] Criar post: Bituqueira Ecológica (ODS 12, 14, 15)
- [x] Criar post: Ações de Saúde (ODS 3, 10, 17)
- [x] Criar post: Feira Literária (ODS 4, 10, 11)
- [x] Criar post: Festivais Culturais (ODS 8, 11, 12, 17)

## Links Ações → Blog

- [x] Adicionar slug do blog em cada programa no array programas[]
- [x] Fazer "Ver ações" direcionar para /noticias/{slug} do blog correspondente
- [x] Fazer clique na foto da ação direcionar para /noticias/{slug} do blog correspondente

## Governança - Documentos

- [x] Ler Estatuto Social e Ata de Posse para extrair informações
- [x] Elaborar Regimento Interno completo do Instituto
- [x] Upload de todos os PDFs de governança para o storage
- [x] Atualizar página de Transparência com seção de Governança e downloads

## SEO - Otimização para Motores de Busca
- [x] Criar server/_core/routes-metadata.ts com meta tags de todas as páginas
- [x] Criar componente SEOHead com hooks useCanonical e useMetaDescription
- [x] Implementar injeção server-side de meta tags no vite.ts
- [x] Criar rota /sitemap.xml dinâmica
- [x] Criar rota /robots.txt
- [x] Integrar SEOHead em todas as páginas existentes
- [x] Adicionar Open Graph tags (og:title, og:description, og:image, og:url)
- [x] Adicionar canonical URLs em todas as páginas
- [x] Testar meta tags com curl em todas as rotas
- [x] Corrigir deploy (migrado de pnpm para npm no deploy Hostinger; pnpm-workspace.yaml com allowBuilds configurado para dev local)
## Atualização Mascotes Nomeados
- [x] Upload das 27 novas imagens nomeadas dos mascotes
- [x] Atualizar página Mascotes.tsx com nomes, significados históricos e categorias
- [x] Destacar mascotes especiais: Alex (Presidente/Saúde), Keli (Vice/Educação), Lucas (Embaixador Jiu-Jitsu)
## Emendas Parlamentares - Transparência
- [x] Processar planilha Excel com dados das emendas
- [x] Pesquisar fotos e perfis dos parlamentares
- [x] Upload das fotos dos parlamentares
- [x] Criar página de Emendas Parlamentares com tabela, filtros e perfis dos deputados/senadores
- [x] Adicionar link na página de Transparência para a seção de emendas
- [x] Expandir para todos os partidos (PT, PSDB, PSD, PP, MDB/Podemos além do PL)
- [x] Incluir descrição da meta/área de aplicação de cada emenda
- [x] Adicionar perfis de todos os 17 parlamentares com foto e bio
## Deploy Hostinger via GitHub
- [x] Configurar scripts de build compatíveis com Hostinger (Node.js 22 + Express)
- [x] Criar arquivo de configuração para Hostinger (.nvmrc, .npmrc, engines)
- [x] Documentar variáveis de ambiente necessárias (HOSTINGER-DEPLOY.md)
- [x] Salvar checkpoint para sincronizar com GitHub e acionar deploy automático

## Correções de Deploy e Blog
- [x] Corrigir ERR_PNPM_IGNORED_BUILDS no deploy Manus (adicionar pnpm-workspace.yaml com allowBuilds ao repo)
- [x] Corrigir "Post não encontrado" na Hostinger para posts de blog (postsDemo atualizado com todos os posts do DB como fallback)
