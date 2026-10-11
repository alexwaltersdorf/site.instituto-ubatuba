# Imagens e documentos do site (storage)

## O que aconteceu (out/2026)

O site ficou **sem nenhuma imagem**. Causa: todas as ~130 imagens e os 12 PDFs de
transparencia eram servidos por `/manus-storage/<chave>`, uma rota do Express que
pede uma URL assinada ao storage da Manus (Forge) e devolve um redirect 307.

A credencial do projeto Manus deixou de valer:

```
GET https://forge.butterfly-effect.dev/v1/storage/presign/get?path=...
-> 401 {"code":16,"message":"invalid project credential"}
```

Com isso o proxy respondia **502 em todos os arquivos** e o site inteiro aparecia
sem imagem. Nao era problema de DNS, de build, nem da Hostinger.

## Como ficou resolvido

`server/_core/storageProxy.ts` agora serve **arquivo local primeiro**:

1. `express.static` em `client/public/manus-storage/` (vai para `dist/public/` no build);
2. so se nao existir arquivo local e que tenta o proxy da Manus.

Vantagem: da para tirar a dependencia da Manus **arquivo por arquivo**, sem
reescrever nenhuma das ~130 referencias espalhadas pelas paginas.

## Como repor uma imagem

Basta commitar o arquivo com o **nome exato da chave** (inclusive o sufixo de hash
e a extensao, respeitando maiusculas) em `client/public/manus-storage/`:

```
client/public/manus-storage/18-Alex_e9820acf.jpg
client/public/manus-storage/tie-sangue_6c95169a.webp
```

Para descobrir as chaves que faltam:

```bash
grep -rhoE 'manus-storage/[A-Za-z0-9_.-]+' client/ | sed 's#manus-storage/##' | sort -u
```

## Regras

- **Nunca** substituir uma foto de evento/pessoa por outra parecida. Trocar a foto de
  `saude_equipe_outubro_rosa` por outra equipe e desinformacao. Foto generica
  (paisagem, mascote, retrato oficial) pode ser reposta; foto de evento, nao.
- Imagem de card entra com largura maxima de ~800 px e JPEG/WebP qualidade ~82.
  Os mascotes vinham em 1200x1800 (~400 KB cada): 29 deles pesavam ~11 MB na pagina.
- Retrato oficial de parlamentar vem da API da Camara (`urlFoto`) ou do Senado;
  nao usar foto de rede social.
- Novos assets do site devem ir **direto para `client/public/`**, nao para o storage
  da Manus. O padrao de `client/public/cursos/` e o certo.
