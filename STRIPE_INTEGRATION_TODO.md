# Stripe Checkout — o que já está pronto e o que falta

Integração do **Stripe Checkout hospedado** (o doador é levado para a página de
pagamento do Stripe e volta para o site). Este arquivo é a referência única do
que ainda depende de você.

O site já recebia doações antes desta rodada: o que mudou foi a configuração
feita no Checkout Studio, trazida para o código.

---

## Valores a substituir (*Values to Replace*)

**Nenhum.** Não há placeholder no código — todos os campos já estão com os
valores reais do Instituto. A tabela abaixo é só para conferência.

**Arquivos envolvidos:**
- [server/routers.ts](server/routers.ts) — `donation.createCheckout`

| Campo | Valor atual | Situação |
|---|---|---|
| `mode` | `payment` | ✅ Correto. Doação é cobrança única, não assinatura. |
| `success_url` | `{origin}/obrigado?session_id={CHECKOUT_SESSION_ID}` | ✅ Página real, com o `{CHECKOUT_SESSION_ID}` preservado. |
| `cancel_url` | `{origin}/apoie` | ✅ Volta para a própria página de doações. |
| `line_items` | `price_data` montado a partir de `DONATION_TIERS` | ✅ Sem ID de preço fixo de propósito: os valores (R$ 30, 50, 100, 200 e valor livre) vêm de [server/stripe-products.ts](server/stripe-products.ts), então mudar um valor é editar esse arquivo — não precisa criar preço no painel. |

> O `{origin}` vem do navegador do doador, então o mesmo código serve para
> `institutoubatuba.org` e para os ambientes de pré-visualização.

---

## Parâmetros configurados (*Configured Parameters*)

Vieram do Checkout Studio e já estão aplicados.

**Arquivos com esses parâmetros:**
- [server/routers.ts](server/routers.ts)

| Parâmetro | Valor |
|---|---|
| `ui_mode` | `hosted_page` |
| `billing_address_collection` | `auto` |
| `phone_number_collection` | `{ enabled: false }` |
| `automatic_tax` | `{ enabled: false }` |
| `allow_promotion_codes` | `false` |
| `submit_type` | `auto` |
| `integration_identifier` | `hosted_web_0001` |
| `origin_context` | `web` |

### Duas decisões que você precisa saber

**1. O campo de cupom sumiu da tela.** `allow_promotion_codes` era `true` e o
Checkout Studio definiu `false`. O doador não vê mais "Adicionar código
promocional". Se o Instituto usa cupons em alguma campanha, religue no Checkout
Studio e traga a mudança para cá.

**2. `customer_email` e `metadata` foram mantidos.** A instrução de integração
pedia para remover tudo que não viesse do Checkout Studio. Não removi esses
dois, porque não são configuração de vitrine — são o registro do Instituto:

```ts
customer_email: input.donorEmail,
metadata: { customer_name, customer_email, tier_id, amount_brl_cents },
```

Sem eles, cada doação vira uma linha anônima no painel do Stripe, sem nome,
sem e-mail e sem o plano escolhido, e o recibo do Stripe perde o destinatário.
Se mesmo assim quiser tirá-los, é só dizer.

**3. `payment_method_collection` ficou de fora.** Só tem efeito em
`mode: "subscription"`. Como a doação é pagamento único, incluí-lo seria ruído.

---

## Como a integração funciona

```
Doador em /apoie
   │  escolhe um valor (tier ou valor livre) e informa nome e e-mail
   ▼
POST /api/trpc/donation.createCheckout        ← server/routers.ts
   │  stripe.checkout.sessions.create(...)
   ▼
checkout.stripe.com (página hospedada)
   │  Pix · Cartão · Apple Pay — o Stripe escolhe pelo painel e pelo país
   ▼
/obrigado?session_id=cs_live_...              ← sucesso
/apoie                                        ← cancelamento
```

**Quem decide as formas de pagamento é o painel, não o código.** O parâmetro
`payment_method_types` foi removido de propósito: com ele presente, o checkout
fica travado no que estiver escrito aqui e nada do painel aparece. Para ligar
ou desligar um meio de pagamento, use
[Configurações → Métodos de pagamento](https://dashboard.stripe.com/settings/payment_methods).

**Pix** exige cobrança em real e doador no Brasil. Quem acessa de fora vê o
valor convertido na própria moeda (conversão automática do Stripe) e, nesse
caso, o Pix não aparece — basta clicar no seletor "R$" para trazê-lo de volta.

---

## Variáveis de ambiente

Só uma é necessária, e ela é **de servidor** — nunca pode ir para o navegador:

| Variável | Onde | Valor |
|---|---|---|
| `STRIPE_SECRET_KEY` | painel da Hostinger, variáveis de ambiente | `sk_live_...` em produção, `sk_test_...` para testar |

Não existe `VITE_STRIPE_PUBLISHABLE_KEY` neste projeto e não precisa existir:
no Checkout hospedado o navegador só recebe uma URL do Stripe, nunca uma chave.
Qualquer variável com prefixo `VITE_` é empacotada no JavaScript público — se um
dia alguém colocar uma chave secreta com esse prefixo, ela vira pública.

O código já avisa no log do servidor quando uma `sk_test_` está rodando em
produção, porque nesse caso nenhuma doação real é cobrada e o erro do Stripe não
explica isso.

---

## Testando

Use uma chave `sk_test_` e os cartões de teste do Stripe:

| Cenário | Cartão | Resto |
|---|---|---|
| Aprovado | `4242 4242 4242 4242` | validade futura, CVC qualquer |
| Exige autenticação (3DS) | `4000 0025 0000 3155` | idem |
| Recusado | `4000 0000 0000 9995` | idem |

Pix em modo de teste não gera QR code real — o pagamento é simulado pelo painel.

Lista completa: https://docs.stripe.com/testing

---

## Próximos passos

- [ ] **Confirmar o Pix no celular**, de conexão brasileira, em
      `institutoubatuba.org/apoie`. O Pix já aparece no checkout; falta ver o QR
      code de verdade.
- [ ] **Verificar o IOF.** Se a conta do Instituto no Stripe for domiciliada
      fora do Brasil, o doador brasileiro paga 3,5% a mais por cima, no app do
      banco. Dá para o Instituto absorver esse custo
      (`payment_method_options.pix.amount_includes_iof = "always"`).
- [ ] **Decidir sobre o botão.** `submit_type` está em `auto` (vem do Checkout
      Studio). O Stripe também aceita `donate`, que escreve "Doar" no botão em
      vez de "Pagar" — combina mais com a página. Mudança de uma linha, se quiser.
- [ ] **Webhook de confirmação.** Hoje a página `/obrigado` confia no retorno do
      navegador. Um webhook `checkout.session.completed` registraria a doação
      mesmo se o doador fechasse a aba logo após pagar — e no Pix, em que a
      confirmação chega pelo banco, isso pesa mais.
- [ ] **Cupons**: reativar `allow_promotion_codes` no Checkout Studio se o
      Instituto for usar códigos em alguma campanha.

### Mudar os valores de doação

Edite `DONATION_TIERS` em [server/stripe-products.ts](server/stripe-products.ts).
Os valores são em **centavos** (`3000` = R$ 30,00). Não é preciso criar nada no
painel do Stripe.

---

## Recursos

- Painel: https://dashboard.stripe.com
- Documentação: https://docs.stripe.com
- Pix: https://docs.stripe.com/payments/pix
- Suporte: https://support.stripe.com
- MCP do Stripe (para usar o Stripe direto daqui): https://docs.stripe.com/mcp
