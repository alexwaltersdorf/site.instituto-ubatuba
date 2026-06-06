import type { Express, Request, Response } from "express";
import express from "express";
import Stripe from "stripe";
import { notifyOwner } from "./_core/notification";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY not configured");
  return new Stripe(key);
}

export function registerStripeWebhook(app: Express) {
  // MUST use raw body BEFORE express.json() — required for signature verification
  app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    async (req: Request, res: Response) => {
      const sig = req.headers["stripe-signature"] as string;
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

      let event: Stripe.Event;

      try {
        if (!webhookSecret) {
          // No secret configured — parse body directly (dev only)
          event = JSON.parse(req.body.toString()) as Stripe.Event;
        } else {
          const stripe = getStripe();
          event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
        }
      } catch (err) {
        console.error("[Stripe Webhook] Signature verification failed:", err);
        res.status(400).send("Webhook signature verification failed");
        return;
      }

      // Handle test events
      if (event.id.startsWith("evt_test_")) {
        console.log("[Stripe Webhook] Test event detected, returning verification response");
        res.json({ verified: true });
        return;
      }

      console.log(`[Stripe Webhook] Event: ${event.type} | ID: ${event.id}`);

      try {
        switch (event.type) {
          case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            const amountBRL = session.amount_total ? (session.amount_total / 100).toFixed(2) : "—";
            const donorName = session.metadata?.customer_name ?? session.customer_details?.name ?? "Anônimo";
            const donorEmail = session.metadata?.customer_email ?? session.customer_details?.email ?? "—";

            await notifyOwner({
              title: `💚 Nova doação recebida: R$ ${amountBRL}`,
              content: `**Doador:** ${donorName}\n**E-mail:** ${donorEmail}\n**Valor:** R$ ${amountBRL}\n**Status:** ${session.payment_status}\n**ID da sessão:** ${session.id}`,
            });
            break;
          }

          case "payment_intent.payment_failed": {
            const intent = event.data.object as Stripe.PaymentIntent;
            console.warn(`[Stripe Webhook] Payment failed: ${intent.id}`);
            break;
          }

          default:
            console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
        }
      } catch (err) {
        console.error("[Stripe Webhook] Error processing event:", err);
      }

      res.json({ received: true });
    }
  );
}
