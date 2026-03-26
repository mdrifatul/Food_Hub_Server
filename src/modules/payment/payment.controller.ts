import { Request, Response } from "express";
import { stripe } from "../../config/stripe.config";
import { PaymentService } from "./payment.service";

const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "orderId is required",
      });
    }

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const result = await PaymentService.createCheckoutSession(
      orderId,
      req.user.email,
    );

    res.status(200).json({
      success: true,
      message: "Checkout session created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create checkout session",
    });
  }
};

const handleStripeWebhookEvent = async (req: Request, res: Response) => {
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
    console.error("Error processing Stripe webhook:", error);
    return res.status(400).json({ message: `Webhook Error: ${error.message}` });
  }

  try {
    const result = await PaymentService.handlerStripeWebhookEvent(event);
    res.status(200).json({
      success: true,
      message: "Stripe webhook event processed successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("Error handling Stripe webhook event:", error);
    res.status(500).json({
      success: false,
      message: "Error handling Stripe webhook event",
    });
  }
};

export const PaymentController = {
  createCheckoutSession,
  handleStripeWebhookEvent,
};
