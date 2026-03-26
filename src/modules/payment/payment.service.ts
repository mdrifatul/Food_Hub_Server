import Stripe from "stripe";
import {
  OrderPaymentStatus,
  OrderStatus,
  PaymentStatus,
} from "../../../generated/client/enums";
import { stripe } from "../../config/stripe.config";
import { prisma } from "../../lib/prisma";

const createCheckoutSession = async (orderId: string, authorEmail: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          meal: true,
        },
      },
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: order.items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.meal.title || "Meal",
        },
        unit_amount: item.price * 100, // cents
      },
      quantity: item.quantity || 1,
    })),
    customer_email: authorEmail,
    success_url: `${process.env.APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.APP_URL}/cancel`,
    metadata: {
      orderId: order.id,
    },
  });

  return {
    url: session.url,
    sessionId: session.id,
  };
};

const handlerStripeWebhookEvent = async (event: Stripe.Event) => {
  const existingPayment = await prisma.payment.findFirst({
    where: {
      stripeEventId: event.id,
    },
  });

  if (existingPayment) {
    console.log(`Event ${event.id} already processed. Skipping`);
    return { message: `Event ${event.id} already processed. Skipping` };
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      const orderId = session.metadata?.orderId;

      if (!orderId) {
        console.error("Missing orderId in session metadata");
        return {
          message: "Missing orderId in session metadata",
        };
      }

      const order = await prisma.order.findUnique({
        where: {
          id: orderId,
        },
      });

      if (!order) {
        console.error(`Order with id ${orderId} not found`);
        return { message: `Order with id ${orderId} not found` };
      }

      // Update both order and payment in a transaction
      await prisma.$transaction(async (tx) => {
        await tx.order.update({
          where: {
            id: orderId,
          },
          data: {
            paymentStatus:
              session.payment_status === "paid"
                ? OrderPaymentStatus.PAID
                : OrderPaymentStatus.UNPAID,
            status:
              session.payment_status === "paid"
                ? OrderStatus.PREPARING
                : OrderStatus.PENDING,
            transactionId: (session.payment_intent as string) || null,
          },
        });

        await tx.payment.upsert({
          where: {
            orderId: orderId,
          },
          update: {
            status:
              session.payment_status === "paid"
                ? PaymentStatus.PAID
                : PaymentStatus.UNPAID,
            paymentGatewayData: session as any,
            transactionId: (session.payment_intent as string) || null,
            stripeEventId: event.id,
          },
          create: {
            orderId: orderId,
            amount: session.amount_total || 0,
            status:
              session.payment_status === "paid"
                ? PaymentStatus.PAID
                : PaymentStatus.UNPAID,
            paymentGatewayData: session as any,
            transactionId: (session.payment_intent as string) || null,
            stripeEventId: event.id,
          },
        });
      });

      console.log(`✅ Payment ${session.payment_status} for order ${orderId}`);
      break;
    }
    case "checkout.session.expired":
    case "payment_intent.payment_failed": {
      console.log(`Event ${event.type} received for session/intent`);
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return { message: `Webhook Event ${event.id} processed successfully` };
};

export const PaymentService = {
  createCheckoutSession,
  handlerStripeWebhookEvent,
};
