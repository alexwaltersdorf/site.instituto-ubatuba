# 🔎 Auditoria do catálogo de cursos — 11/11/2026

Verificação de **todos os 1.127 cursos** publicados em
`institutoubatuba.org/cursos`, um a um, pela URL de destino.

---

## Resposta curta: nenhum curso do site é pago

Testei os 1.127 links. **Não existe um único curso pago no catálogo.** O que
existe são **18 links defeituosos** — e isso é pior para o aluno do que um
preço errado, porque ele clica e não chega a curso nenhum.

---

## 1. O que foi verificado, por bloco

| Origem | Qtde | Veredito |
|---|---:|---|
| Escola Virtual de Governo (ENAP) | 888 | ✅ gratuitos, todos os links respondem |
| Harvard (pll.harvard.edu) | 121 | ✅ gratuitos — ver ressalva abaixo |
| Santander Open Academy | 72 | ✅ gratuitos, todos respondem |
| Fundação Bradesco (ev.org.br) | 6 | ✅ gratuitos |
| IFES / MEC Aprenda Mais | 6 | ⚠️ 5 com link genérico |
| Coursera (cursos individuais) | 8 | ✅ gratuitos para assistir |
| Coursera (páginas de parceiro) | 4 | ⚠️ link genérico |
| Kultivi | 4 | ✅ gratuitos |
| SENAI (ead.senai.br) | 3 | ⚠️ link genérico |
| Escola Virtual (home) | 3 | ⚠️ link genérico |
| Fiocruz | 2 | ⚠️ link genérico + certificado SSL inválido |
| FGV Educação Executiva | 2 | ⚠️ 1 com link genérico |
| edX (navegação de temas) | 1 | ❌ não é um curso |
| Prime Cursos | 1 | ✅ curso gratuito, certificado pago à parte |
| Demais (MIT, UNESP, DW, IFMG…) | 8 | ✅ gratuitos |

### ⚠️ Ressalva importante sobre Harvard, edX e Coursera

Os **121 cursos de Harvard** são gratuitos no modelo **"audit for free"**:
assistir é de graça, e o certificado *da plataforma* é opcional e pago
(US$ 99 a US$ 299, com US$ 149 sendo o mais comum). Confirmei isso curso a
curso pelo campo `Audit for Free` da página.

Quatro deles exibiam valores de US$ 10.600 a US$ 17.000 numa primeira leitura —
mas esses preços são de **cursos relacionados** mostrados na barra lateral, não
do curso em si. Renderizei as páginas num navegador para confirmar: o campo
`Price` do próprio curso diz **Free***.

Isso não é problema para o Instituto, porque **o certificado que o aluno recebe
é o do Instituto Ubatuba**, emitido após a conclusão. Mas convém que a página
deixe claro que o certificado da instituição de origem pode ser pago.

---

## 2. Os 18 problemas encontrados

### (A) 1 registro que não é um curso

| id | Título | Link | Problema |
|---:|---|---|---|
| 16 | História da Arte Moderna e Contemporânea | `edx.org/learn/art-history` | É a página de **navegação de temas** do edX, não um curso. Atribuído a Harvard sem ser um curso de Harvard. |

### (B) 17 cursos cujo link leva à home da plataforma

O curso existe, mas o aluno cai na página inicial e precisa procurar sozinho.

| Link genérico | Cursos afetados |
|---|---|
| `mooc.cefor.ifes.edu.br/` | Educação Ambiental · Espanhol Básico · Inglês para Iniciantes · Inglês Instrumental · Educação Inclusiva |
| `coursera.org/partners/usp` | Sustentabilidade · Conservação da Biodiversidade · Astronomia · Direitos Humanos |
| `ead.senai.br/` | Marketing Digital · Primeiros Socorros · Excel Avançado |
| `escolavirtual.gov.br/` | Segurança da Informação · Gestão Ambiental no Setor Público · Empreendedorismo no Setor Público |
| `campusvirtual.fiocruz.br/` | Saúde Pública e Meio Ambiente · Nutrição e Alimentação Saudável |

**Agravante no Fiocruz:** o domínio está com **cadeia de certificado SSL
incompleta**. Navegadores mais rigorosos mostram aviso de segurança.

Esses 17 são os cursos de demonstração que entraram no banco antes da carga
real — nunca receberam a URL do curso de verdade.

---

## 3. O que fazer

O arquivo **`corrigir-catalogo.sql`** desativa os 18 (`active = 0`, que só
esconde do site — nada é apagado, e reverter é um `UPDATE` de volta).

**Mas desativar não é a melhor saída para 17 deles**, porque os cursos existem.
O ideal é corrigir o `platformUrl` de cada um para a página real do curso. Só o
registro 16 (História da Arte) deve mesmo sair, porque não corresponde a curso
nenhum.

---

## 4. Como aplicar (preciso do acesso ao banco)

Os cursos ficam num **MySQL na Hostinger**, e as rotas públicas da API só leem —
não existe mutation de administrador para desativar curso. Esta sessão não tem
`DATABASE_URL`, então **não consegui aplicar as mudanças sozinho**.

Para rodar, por qualquer um destes caminhos:

```bash
# com a connection string da Hostinger (hPanel → Bancos de dados → MySQL remoto)
mysql --host=srv722.hstgr.io -u USUARIO -p NOME_DO_BANCO < corrigir-catalogo.sql
mysql --host=srv722.hstgr.io -u USUARIO -p NOME_DO_BANCO < inserir-cursos.sql
```

Ou cole o conteúdo no **phpMyAdmin** do hPanel.

Se preferir que eu mesmo rode, me passe a `DATABASE_URL` — mas, pelo que
aconteceu com o token do Meta nesta conversa, prefiro avisar: credencial colada
no chat fica no histórico. O phpMyAdmin não expõe nada.

---

## 5. Cursos novos levantados — **457**

Auditei os cinco sites indicados e extraí só o que é **comprovadamente gratuito**.

| Fonte | Gratuitos | Como foi obtido | Observação |
|---|---:|---|---|
| **FGV** `cursosgratuitos.fgv.br` | **227** | API pública do catálogo | Catálogo inteiro, com área, carga horária e nº de inscritos |
| **Einstein** `ensino.einstein.br` | **140** | API do catálogo (VTEX) | Todos de saúde; o site confirma 140 |
| **Sebrae-SP** `sp.loja.sebrae.com.br` | **42** | Leitura da vitrine | Todos marcados "Gratuito", 3h a 20h |
| **USP** `uspdigital.usp.br/apolo` | **26** | Tabela de extensão a distância | De 104 cursos, **78 são pagos** — só entraram os 26 gratuitos |
| **SENAI-SP** `sp.senai.br` | **22** | Varredura das 14 áreas | Só os "A Distância" com inscrição aberta |

### ⚠️ Três ressalvas que mudam o que deve entrar no site

**1. O link do SENAI que você mandou é uma notícia, não um catálogo.** É um
texto de 23/01/2024 explicando o que são Cursos Livres — não lista curso nenhum.
Fui ao catálogo real: são **139 cursos livres, e 117 deles são presenciais**, em
unidades do estado de São Paulo, com vaga limitada e inscrição por turma. Só
**22 são a distância com inscrição aberta** — e esses sim valem, porque vários
são de **economia circular, educação ambiental e descarbonização**, que batem
direto com a missão do Instituto.

**2. Os 26 da USP têm janela de inscrição datada.** Não são perenes como o resto
do catálogo: cada um abre e fecha em datas fixas (alguns terminam em dezembro de
2026). Se entrarem no site, vão virar links mortos em poucos meses. Sugiro
**revisão trimestral** desses 26, ou deixá-los de fora até existir um campo de
validade no banco.

**3. O Sebrae não dá URL por curso.** A vitrine monta os links por JavaScript e
só expõe a lista. Os 42 entraram apontando para a vitrine de cursos online; se
quiser link direto, alguém precisa abrir um a um e copiar.

### O que os 457 acrescentam ao site

| Categoria do site | Hoje | Entram | Depois |
|---|---:|---:|---:|
| Administração | 556 | +156 | 712 |
| **Saúde** | 61 | **+140** | **201** |
| Educação | 45 | +85 | 130 |
| Tecnologia | 160 | +32 | 192 |
| Direito | 102 | +32 | 134 |
| Meio Ambiente | 78 | +9 | 87 |
| Ciências | 25 | +2 | 27 |
| Artes & Cultura | 67 | +1 | 68 |
| Idiomas | 32 | — | 32 |
| Esporte | 1 | — | 1 |

O ganho mais forte é em **Saúde, que mais que triplica** graças ao Einstein — e
é uma área em que o catálogo era fraco para uma cidade com a Santa Casa e a rede
municipal. **Educação quase triplica** com a FGV.

**Total do catálogo depois de tudo: 1.566 cursos** (1.127 − 18 + 457).

---

## 6. Arquivos gerados

| Arquivo | O que faz |
|---|---|
| `corrigir-catalogo.sql` | Desativa os 18 registros defeituosos (reversível) |
| `inserir-cursos.sql` | Insere os 457 cursos novos, em transação |
| `novos-cursos.json` | Os 457 em JSON, para conferência ou outra carga |

Os slugs são gerados com prefixo da instituição (`fgv-`, `einstein-`,
`sebrae-`, `senai-`, `usp-`) para não colidir com o que já existe, e todos
entram com `featured = 0` e `active = 1`.
