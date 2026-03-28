import Stripe from "stripe";
import { PaymentStatus } from "../../../generated/client/enums";
import { stripe } from "../../config/stripe.config";
import { prisma } from "../../lib/prisma";

// Create a Stripe Checkout Session for an existing order
const createCheckoutSession = async (orderId: string) => {
  // Find the order with its items and meal details
  const order = await prisma.order.findUniqueOrThrow({
    where: { id: orderId },
    include: {
      items: {
        include: {
          meal: {
            select: {
              title: true,
              imageUrl: true,
            },
          },
        },
      },
    },
  });

  // Don't allow double payment
  if (order.paymentStatus === "PAID") {
    throw new Error("This order has already been paid");
  }

  // Build Stripe line items from order items
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
    order.items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.meal.title || "Meal item",
          ...(item.meal.imageUrl && { images: [item.meal.imageUrl] }),
        },
        unit_amount: item.price * 100, // Convert to cents
      },
      quantity: item.quantity || 1,
    }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    metadata: {
      orderId: order.id,
    },
    success_url: `${process.env.APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.APP_URL}/payment/cancel`,
  });

  // Create a Payment record in UNPAID state, linked to the order
  await prisma.payment.create({
    data: {
      orderId: order.id,
      amount: order.totalPrice,
      status: PaymentStatus.UNPAID,
      transactionId: session.id,
    },
  });

  return { sessionId: session.id, url: session.url };
};

// Handle incoming Stripe webhook events (idempotent)
const handlerStripeWebhookEvent = async (event: Stripe.Event) => {
  // Only handle checkout.session.completed
  if (event.type !== "checkout.session.completed") {
    return { received: true, message: `Unhandled event type: ${event.type}` };
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const orderId = session.metadata?.orderId;

  if (!orderId) {
    throw new Error("Missing orderId in session metadata");
  }

  // Idempotency check — skip if this event was already processed
  const existingPayment = await prisma.payment.findUnique({
    where: { stripeEventId: event.id },
  });

  if (existingPayment) {
    return { received: true, message: "Event already processed" };
  }

  // Update Payment record + Order status in a transaction
  await prisma.$transaction(async (tx) => {
    // Update the payment record (find by orderId since we created it during checkout)
    await tx.payment.update({
      where: { orderId },
      data: {
        status: PaymentStatus.PAID,
        stripeEventId: event.id,
        paymentGatewayData: JSON.parse(JSON.stringify(session)),
      },
    });

    // Mark the order as paid
    await tx.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: "PAID",
        transactionId: session.id,
      },
    });
  });

  return { received: true, message: "Payment confirmed" };
};

export const PaymentService = {
  createCheckoutSession,
  handlerStripeWebhookEvent,
};
