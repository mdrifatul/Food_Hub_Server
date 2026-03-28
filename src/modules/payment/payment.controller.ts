/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { stripe } from "../../config/stripe.config";
import { PaymentService } from "./payment.service";

// POST /api/payments/checkout — Create a Stripe Checkout Session for an order
const createCheckoutSession = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { orderId } = req.body;

    if (!orderId) {
      return res
        .status(400)
        .json({ success: false, message: "orderId is required" });
    }

    const result = await PaymentService.createCheckoutSession(orderId);

    res.status(200).json({
      success: true,
      message: "Checkout session created",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// POST /webhook — Handle Stripe webhook events (raw body required)
const handleStripeWebhookEvent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const signature = req.headers["stripe-signature"] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    console.error("Missing Stripe signature or webhook secret");
    return res
      .status(400)
      .json({ message: "Missing Stripe signature or webhook secret" });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (error: any) {
    console.error("Webhook signature verification failed:", error.message);
    return res
      .status(400)
      .json({ message: "Webhook signature verification failed" });
  }

  try {
    const result = await PaymentService.handlerStripeWebhookEvent(event);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error handling Stripe webhook event:", error);
    next(error);
  }
};

export const PaymentController = {
  createCheckoutSession,
  handleStripeWebhookEvent,
};
